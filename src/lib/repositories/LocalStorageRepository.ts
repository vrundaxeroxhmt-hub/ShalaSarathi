import { TeacherProfile } from '@/types/user';
import { PatrakTemplate, PatrakDocument } from '@/types/patrak';
import { AhevalTemplate, AhevalDocument } from '@/types/aheval';
import { 
  RojmelEntry, 
  DeadStockItem, 
  RojmelAccountSetup, 
  HeadItem, 
  PackageRojmelQuota 
} from '@/types/rojmel';
import { Voucher } from '@/types/voucher';
import { PaperTemplate } from '@/types/paperGenerator';
import { SavedDocumentItem } from '@/types/documentLibrary';
import { Supplier, PayableItem, PayablePayment } from '@/types/payable';
import { computeRunningBalances } from '@/lib/services/rojmelService';
import { computePayableItemBalances, validatePaymentAmount, validateTotalAmountEdit } from '@/lib/services/payableService';
import { 
  ITeacherRepository, 
  IPatrakRepository, 
  IAhevalRepository, 
  IRojmelRepository, 
  IPayableRepository,
  IVoucherRepository,
  IDocumentLibraryRepository,
  IPaperGeneratorRepository
} from './interfaces';
import { 
  INITIAL_TEACHER_PROFILE, 
  SAMPLE_PATRAK_TEMPLATES, 
  SAMPLE_ROJMEL_ENTRIES, 
  SAMPLE_DEAD_STOCK, 
  SAMPLE_VOUCHERS,
  SAMPLE_PAPER_TEMPLATES,
  SAMPLE_SAVED_DOCUMENTS,
  SAMPLE_HEADS,
  SAMPLE_ROJMEL_SETUP,
  SAMPLE_SUPPLIERS,
  SAMPLE_PAYABLES
} from './mockData';

const STORAGE_KEYS = {
  TEACHER_PROFILE: 'ss_teacher_profile',
  PATRAK_DOCS: 'ss_patrak_documents',
  ROJMEL_ENTRIES: 'ss_rojmel_entries',
  ROJMEL_SETUPS: 'ss_rojmel_setups',
  ROJMEL_HEADS: 'ss_rojmel_heads',
  ADMIN_TEACHER_CAN_EDIT_LIMITS: 'ss_admin_teacher_can_edit_limits',
  DEAD_STOCK: 'ss_dead_stock',
  VOUCHERS: 'ss_vouchers',
  SAVED_DOCUMENTS: 'ss_saved_documents',
  PATRAK_FAVORITES: 'ss_patrak_favorites',
  PAYABLES: 'ss_payables',
  SUPPLIERS: 'ss_suppliers'
};

export class LocalTeacherRepository implements ITeacherRepository {
  async getProfile(): Promise<TeacherProfile> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TEACHER_PROFILE);
      if (!raw || raw === 'undefined' || raw === 'null') {
        localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(INITIAL_TEACHER_PROFILE));
        return INITIAL_TEACHER_PROFILE;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.id) {
        localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(INITIAL_TEACHER_PROFILE));
        return INITIAL_TEACHER_PROFILE;
      }

      const normalized: TeacherProfile = {
        ...INITIAL_TEACHER_PROFILE,
        ...parsed,
        school: {
          ...INITIAL_TEACHER_PROFILE.school,
          ...(parsed.school || {})
        }
      };

      return normalized;
    } catch (e) {
      console.warn('Fallback teacher profile used:', e);
      localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(INITIAL_TEACHER_PROFILE));
      return INITIAL_TEACHER_PROFILE;
    }
  }

  async updateProfile(profile: Partial<TeacherProfile>): Promise<TeacherProfile> {
    const current = await this.getProfile();
    const updated: TeacherProfile = {
      ...current,
      ...profile,
      school: {
        ...current.school,
        ...(profile.school || {})
      },
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(updated));
    return updated;
  }
}

export class LocalPatrakRepository implements IPatrakRepository {
  async getTemplates(): Promise<PatrakTemplate[]> {
    try {
      const favsRaw = localStorage.getItem(STORAGE_KEYS.PATRAK_FAVORITES);
      const favIds: string[] = favsRaw && favsRaw !== 'undefined' ? JSON.parse(favsRaw) : ['patrak_1', 'patrak_2', 'patrak_12'];
      
      return SAMPLE_PATRAK_TEMPLATES.map(t => ({
        ...t,
        isFavorite: Array.isArray(favIds) && favIds.includes(t.id)
      }));
    } catch {
      return SAMPLE_PATRAK_TEMPLATES;
    }
  }

  async getTemplateById(id: string): Promise<PatrakTemplate | null> {
    const templates = await this.getTemplates();
    return templates.find(t => t.id === id) || null;
  }

  async toggleFavorite(id: string): Promise<boolean> {
    const favsRaw = localStorage.getItem(STORAGE_KEYS.PATRAK_FAVORITES);
    let favIds: string[] = favsRaw && favsRaw !== 'undefined' ? JSON.parse(favsRaw) : ['patrak_1', 'patrak_2', 'patrak_12'];
    if (!Array.isArray(favIds)) favIds = ['patrak_1', 'patrak_2', 'patrak_12'];

    if (favIds.includes(id)) {
      favIds = favIds.filter(f => f !== id);
    } else {
      favIds.push(id);
    }
    localStorage.setItem(STORAGE_KEYS.PATRAK_FAVORITES, JSON.stringify(favIds));
    return favIds.includes(id);
  }

  async getSavedDocuments(): Promise<PatrakDocument[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PATRAK_DOCS);
      if (!raw || raw === 'undefined') return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async saveDocument(docData: Omit<PatrakDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<PatrakDocument> {
    const docs = await this.getSavedDocuments();
    const newDoc: PatrakDocument = {
      ...docData,
      id: `pat_doc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    docs.unshift(newDoc);
    localStorage.setItem(STORAGE_KEYS.PATRAK_DOCS, JSON.stringify(docs));

    // Also sync to global SavedDocuments library
    const libRepo = new LocalDocumentLibraryRepository();
    await libRepo.addOrUpdateDocument({
      id: newDoc.id,
      category: 'Patrak',
      titleGuj: newDoc.titleGuj,
      subtitleGuj: `પત્રક ${newDoc.patrakNumber} • ${newDoc.selectedVersion}`,
      status: newDoc.status,
      versionCode: newDoc.selectedVersion,
      createdAt: newDoc.createdAt,
      updatedAt: newDoc.updatedAt,
      payload: newDoc
    });

    return newDoc;
  }

  async deleteDocument(id: string): Promise<boolean> {
    const docs = await this.getSavedDocuments();
    const filtered = docs.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.PATRAK_DOCS, JSON.stringify(filtered));
    return true;
  }
}

export class LocalRojmelRepository implements IRojmelRepository {
  async getEntries(): Promise<RojmelEntry[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ROJMEL_ENTRIES);
      const setup = await this.getActiveSetup();
      const opening = setup ? setup.openingBalance : 25000;

      if (!raw || raw === 'undefined' || raw === 'null') {
        localStorage.setItem(STORAGE_KEYS.ROJMEL_ENTRIES, JSON.stringify(SAMPLE_ROJMEL_ENTRIES));
        return computeRunningBalances(SAMPLE_ROJMEL_ENTRIES, opening);
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEYS.ROJMEL_ENTRIES, JSON.stringify(SAMPLE_ROJMEL_ENTRIES));
        return computeRunningBalances(SAMPLE_ROJMEL_ENTRIES, opening);
      }
      return computeRunningBalances(parsed, opening);
    } catch {
      localStorage.setItem(STORAGE_KEYS.ROJMEL_ENTRIES, JSON.stringify(SAMPLE_ROJMEL_ENTRIES));
      return computeRunningBalances(SAMPLE_ROJMEL_ENTRIES, 25000);
    }
  }

  async getDeadStockItems(): Promise<DeadStockItem[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DEAD_STOCK);
      if (!raw || raw === 'undefined' || raw === 'null') {
        localStorage.setItem(STORAGE_KEYS.DEAD_STOCK, JSON.stringify(SAMPLE_DEAD_STOCK));
        return SAMPLE_DEAD_STOCK;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : SAMPLE_DEAD_STOCK;
    } catch {
      localStorage.setItem(STORAGE_KEYS.DEAD_STOCK, JSON.stringify(SAMPLE_DEAD_STOCK));
      return SAMPLE_DEAD_STOCK;
    }
  }

  async getSetups(): Promise<RojmelAccountSetup[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ROJMEL_SETUPS);
      if (!raw || raw === 'undefined' || raw === 'null') {
        localStorage.setItem(STORAGE_KEYS.ROJMEL_SETUPS, JSON.stringify([SAMPLE_ROJMEL_SETUP]));
        return [SAMPLE_ROJMEL_SETUP];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [SAMPLE_ROJMEL_SETUP];
    } catch {
      return [SAMPLE_ROJMEL_SETUP];
    }
  }

  async getActiveSetup(): Promise<RojmelAccountSetup | null> {
    const setups = await this.getSetups();
    return setups[0] || null;
  }

  async saveSetup(setupData: Omit<RojmelAccountSetup, 'id' | 'createdAt' | 'updatedAt'>): Promise<RojmelAccountSetup> {
    const setups = await this.getSetups();
    const existing = setups.find(s => s.financialYear === setupData.financialYear);

    if (existing) {
      if (!existing.isLocked || existing.editRequestStatus === 'released_once') {
        const updatedSetup: RojmelAccountSetup = {
          ...existing,
          ...setupData,
          isLocked: true,
          editRequestStatus: 'none',
          updatedAt: new Date().toISOString()
        };
        const idx = setups.findIndex(s => s.id === existing.id);
        setups[idx] = updatedSetup;
        localStorage.setItem(STORAGE_KEYS.ROJMEL_SETUPS, JSON.stringify(setups));
        return updatedSetup;
      } else {
        throw new Error('આ રોજમેળ સેટઅપ લોક થયેલ છે. ફેરફાર માટે એડમિન પરમિશનની જરૂર છે.');
      }
    }

    const newSetup: RojmelAccountSetup = {
      ...setupData,
      id: `setup_${Date.now()}`,
      isLocked: true,
      editRequestStatus: 'none',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setups.unshift(newSetup);
    localStorage.setItem(STORAGE_KEYS.ROJMEL_SETUPS, JSON.stringify(setups));
    return newSetup;
  }

  async requestEditRelease(setupId: string, reason: string): Promise<boolean> {
    const setups = await this.getSetups();
    const target = setups.find(s => s.id === setupId);
    if (!target) return false;

    target.editRequestStatus = 'requested';
    target.editRequestReason = reason;
    target.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ROJMEL_SETUPS, JSON.stringify(setups));
    return true;
  }

  async adminReleaseOneTimeEdit(setupId: string): Promise<boolean> {
    const setups = await this.getSetups();
    const target = setups.find(s => s.id === setupId);
    if (!target) return false;

    target.isLocked = false;
    target.editRequestStatus = 'released_once';
    target.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ROJMEL_SETUPS, JSON.stringify(setups));
    return true;
  }

  async checkPackageQuotaAllowed(): Promise<{ allowed: boolean; currentCount: number; maxAllowed: number }> {
    const setups = await this.getSetups();
    const maxAllowed = 4;
    return {
      allowed: setups.length < maxAllowed,
      currentCount: setups.length,
      maxAllowed
    };
  }

  // Head Management
  async getHeads(): Promise<HeadItem[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ROJMEL_HEADS);
      if (!raw || raw === 'undefined' || raw === 'null') {
        localStorage.setItem(STORAGE_KEYS.ROJMEL_HEADS, JSON.stringify(SAMPLE_HEADS));
        return SAMPLE_HEADS;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_HEADS;
    } catch {
      return SAMPLE_HEADS;
    }
  }

  async saveHead(headData: Omit<HeadItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeadItem> {
    const heads = await this.getHeads();
    const newHead: HeadItem = {
      ...headData,
      id: `head_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    heads.unshift(newHead);
    localStorage.setItem(STORAGE_KEYS.ROJMEL_HEADS, JSON.stringify(heads));
    return newHead;
  }

  async updateHead(id: string, headData: Partial<HeadItem>): Promise<HeadItem> {
    const heads = await this.getHeads();
    const idx = heads.findIndex(h => h.id === id);
    if (idx < 0) {
      throw new Error(`Head not found: ${id}`);
    }

    const updatedHead: HeadItem = {
      ...heads[idx],
      ...headData,
      updatedAt: new Date().toISOString()
    };

    heads[idx] = updatedHead;
    localStorage.setItem(STORAGE_KEYS.ROJMEL_HEADS, JSON.stringify(heads));
    return updatedHead;
  }

  async deleteHead(id: string): Promise<boolean> {
    const heads = await this.getHeads();
    const filtered = heads.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.ROJMEL_HEADS, JSON.stringify(filtered));
    return true;
  }

  async getAdminTeacherCanEditLimits(): Promise<boolean> {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_TEACHER_CAN_EDIT_LIMITS);
    if (!raw) return true;
    return JSON.parse(raw);
  }

  async setAdminTeacherCanEditLimits(allowed: boolean): Promise<boolean> {
    localStorage.setItem(STORAGE_KEYS.ADMIN_TEACHER_CAN_EDIT_LIMITS, JSON.stringify(allowed));
    return allowed;
  }

  async addEntry(
    entryData: Omit<RojmelEntry, 'id' | 'balanceAfter' | 'createdAt'>, 
    createDeadStock: boolean = false
  ): Promise<{ entry: RojmelEntry; deadStock?: DeadStockItem }> {
    const entries = await this.getEntries();
    const newEntryId = `roj_${Date.now()}`;
    let createdDeadStock: DeadStockItem | undefined;

    if (createDeadStock && entryData.type === 'purchase') {
      const deadStockList = await this.getDeadStockItems();
      createdDeadStock = {
        id: `ds_${Date.now()}`,
        itemNameGuj: entryData.particularGuj,
        itemNameEng: entryData.particularEng || entryData.particularGuj,
        purchaseDate: entryData.date,
        amount: entryData.amount,
        quantity: entryData.quantity || 1,
        category: entryData.category || 'Equipment',
        sourceRojmelEntryId: newEntryId,
        voucherRef: entryData.voucherNo,
        remarksGuj: `રોજમેળ ખરીદી ક્રમાંક ${newEntryId} માંથી ઓટો-લિંક્ડ ડેડ સ્ટોક.`,
        createdAt: new Date().toISOString()
      };
      deadStockList.unshift(createdDeadStock);
      localStorage.setItem(STORAGE_KEYS.DEAD_STOCK, JSON.stringify(deadStockList));
    }

    const rawNewEntry: RojmelEntry = {
      ...entryData,
      id: newEntryId,
      balanceAfter: 0,
      isDeadStockLinked: !!createdDeadStock,
      linkedDeadStockId: createdDeadStock?.id,
      createdAt: new Date().toISOString()
    };

    const setup = await this.getActiveSetup();
    const opening = setup ? setup.openingBalance : 25000;
    const updatedList = computeRunningBalances([rawNewEntry, ...entries], opening);
    localStorage.setItem(STORAGE_KEYS.ROJMEL_ENTRIES, JSON.stringify(updatedList));

    const savedEntry = updatedList.find(e => e.id === newEntryId) || rawNewEntry;
    return { entry: savedEntry, deadStock: createdDeadStock };
  }

  async updateEntry(
    id: string,
    entryData: Partial<RojmelEntry>,
    updateDeadStock: boolean = true
  ): Promise<{ entry: RojmelEntry; deadStock?: DeadStockItem }> {
    const entries = await this.getEntries();
    const targetIdx = entries.findIndex(e => e.id === id);
    if (targetIdx < 0) {
      throw new Error(`Rojmel entry not found: ${id}`);
    }

    const current = entries[targetIdx];
    const updatedEntry: RojmelEntry = {
      ...current,
      ...entryData
    };

    entries[targetIdx] = updatedEntry;
    const setup = await this.getActiveSetup();
    const opening = setup ? setup.openingBalance : 25000;
    const recomputed = computeRunningBalances(entries, opening);
    localStorage.setItem(STORAGE_KEYS.ROJMEL_ENTRIES, JSON.stringify(recomputed));

    let updatedDeadStock: DeadStockItem | undefined;
    if (updateDeadStock && updatedEntry.isDeadStockLinked) {
      const deadStockList = await this.getDeadStockItems();
      const dsIdx = deadStockList.findIndex(
        ds => ds.sourceRojmelEntryId === id || ds.id === updatedEntry.linkedDeadStockId
      );

      if (dsIdx >= 0) {
        deadStockList[dsIdx] = {
          ...deadStockList[dsIdx],
          itemNameGuj: updatedEntry.particularGuj,
          purchaseDate: updatedEntry.date,
          amount: updatedEntry.amount,
          quantity: updatedEntry.quantity || 1,
          category: updatedEntry.category,
          voucherRef: updatedEntry.voucherNo
        };
        updatedDeadStock = deadStockList[dsIdx];
        localStorage.setItem(STORAGE_KEYS.DEAD_STOCK, JSON.stringify(deadStockList));
      }
    }

    const savedEntry = recomputed.find(e => e.id === id) || updatedEntry;
    return { entry: savedEntry, deadStock: updatedDeadStock };
  }

  async deleteEntrySafely(id: string): Promise<{ success: boolean; unlinkedDeadStockId?: string }> {
    const entries = await this.getEntries();
    const target = entries.find(e => e.id === id);
    const filteredEntries = entries.filter(e => e.id !== id);

    const setup = await this.getActiveSetup();
    const opening = setup ? setup.openingBalance : 25000;
    const recomputed = computeRunningBalances(filteredEntries, opening);
    localStorage.setItem(STORAGE_KEYS.ROJMEL_ENTRIES, JSON.stringify(recomputed));

    let unlinkedId: string | undefined;
    if (target?.isDeadStockLinked) {
      const deadStockList = await this.getDeadStockItems();
      const dsItem = deadStockList.find(ds => ds.sourceRojmelEntryId === id || ds.id === target.linkedDeadStockId);
      if (dsItem) {
        unlinkedId = dsItem.id;
        const filteredDeadStock = deadStockList.filter(ds => ds.id !== dsItem.id);
        localStorage.setItem(STORAGE_KEYS.DEAD_STOCK, JSON.stringify(filteredDeadStock));
      }
    }

    return { success: true, unlinkedDeadStockId: unlinkedId };
  }

  async duplicateEntry(id: string): Promise<RojmelEntry | null> {
    const entries = await this.getEntries();
    const target = entries.find(e => e.id === id);
    if (!target) return null;

    const dupEntryData: Omit<RojmelEntry, 'id' | 'balanceAfter' | 'createdAt'> = {
      date: new Date().toISOString().split('T')[0],
      type: target.type,
      headId: target.headId,
      headNameGuj: target.headNameGuj,
      particularGuj: `${target.particularGuj} (નકલ)`,
      amount: target.amount,
      quantity: target.quantity,
      paymentMode: target.paymentMode,
      category: target.category,
      remarksGuj: target.remarksGuj,
      voucherNo: target.voucherNo ? `${target.voucherNo}-C` : undefined,
      isDeadStockLinked: false
    };

    const res = await this.addEntry(dupEntryData, false);
    return res.entry;
  }
}

export class LocalPayableRepository implements IPayableRepository {
  async getPayables(): Promise<PayableItem[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PAYABLES);
      if (!raw || raw === 'undefined' || raw === 'null') {
        localStorage.setItem(STORAGE_KEYS.PAYABLES, JSON.stringify(SAMPLE_PAYABLES));
        return SAMPLE_PAYABLES.map(p => computePayableItemBalances(p));
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEYS.PAYABLES, JSON.stringify(SAMPLE_PAYABLES));
        return SAMPLE_PAYABLES.map(p => computePayableItemBalances(p));
      }
      return parsed.map(p => computePayableItemBalances(p));
    } catch {
      localStorage.setItem(STORAGE_KEYS.PAYABLES, JSON.stringify(SAMPLE_PAYABLES));
      return SAMPLE_PAYABLES.map(p => computePayableItemBalances(p));
    }
  }

  async getSuppliers(): Promise<Supplier[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      if (!raw || raw === 'undefined' || raw === 'null') {
        localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(SAMPLE_SUPPLIERS));
        return SAMPLE_SUPPLIERS;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_SUPPLIERS;
    } catch {
      return SAMPLE_SUPPLIERS;
    }
  }

  async saveSupplier(supplierData: Omit<Supplier, 'id' | 'createdAt'>): Promise<Supplier> {
    const suppliers = await this.getSuppliers();
    const existing = suppliers.find(s => s.nameGuj.trim().toLowerCase() === supplierData.nameGuj.trim().toLowerCase());
    if (existing) {
      return existing; // Avoid duplicates
    }

    const newSupplier: Supplier = {
      ...supplierData,
      id: `sup_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    suppliers.unshift(newSupplier);
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
    return newSupplier;
  }

  async savePayable(
    payableData: Omit<PayableItem, 'id' | 'paidAmount' | 'remainingAmount' | 'status' | 'payments' | 'createdAt' | 'updatedAt'>
  ): Promise<PayableItem> {
    const payables = await this.getPayables();
    const newPayableId = `pay_${Date.now()}`;

    const rawPayable: PayableItem = {
      ...payableData,
      id: newPayableId,
      paidAmount: 0,
      remainingAmount: payableData.totalAmount,
      status: 'unpaid',
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const computed = computePayableItemBalances(rawPayable);
    payables.unshift(computed);
    localStorage.setItem(STORAGE_KEYS.PAYABLES, JSON.stringify(payables));
    return computed;
  }

  async updatePayable(id: string, updates: Partial<PayableItem>): Promise<PayableItem> {
    const payables = await this.getPayables();
    const idx = payables.findIndex(p => p.id === id);
    if (idx < 0) {
      throw new Error(`Payable not found: ${id}`);
    }

    const current = payables[idx];

    // Safety validation: totalAmount cannot be reduced below paidAmount
    if (updates.totalAmount !== undefined) {
      const validRes = validateTotalAmountEdit(current.paidAmount, updates.totalAmount);
      if (!validRes.valid) {
        throw new Error(validRes.errorMsgGuj);
      }
    }

    const updatedRaw: PayableItem = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const computed = computePayableItemBalances(updatedRaw);
    payables[idx] = computed;
    localStorage.setItem(STORAGE_KEYS.PAYABLES, JSON.stringify(payables));
    return computed;
  }

  async recordPayment(
    payableId: string, 
    paymentData: Omit<PayablePayment, 'id' | 'payableId' | 'createdAt'>
  ): Promise<PayableItem> {
    const payables = await this.getPayables();
    const idx = payables.findIndex(p => p.id === payableId);
    if (idx < 0) {
      throw new Error(`Payable not found: ${payableId}`);
    }

    const current = payables[idx];
    const validRes = validatePaymentAmount(current.remainingAmount, paymentData.amount);
    if (!validRes.valid) {
      throw new Error(validRes.errorMsgGuj);
    }

    const newPayment: PayablePayment = {
      ...paymentData,
      id: `pay_sub_${Date.now()}`,
      payableId,
      createdAt: new Date().toISOString()
    };

    const updatedPayments = [newPayment, ...current.payments];
    const updatedRaw: PayableItem = {
      ...current,
      payments: updatedPayments,
      updatedAt: new Date().toISOString()
    };

    const computed = computePayableItemBalances(updatedRaw);
    payables[idx] = computed;
    localStorage.setItem(STORAGE_KEYS.PAYABLES, JSON.stringify(payables));
    return computed;
  }

  async deletePayableSafely(id: string): Promise<boolean> {
    const payables = await this.getPayables();
    const filtered = payables.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PAYABLES, JSON.stringify(filtered));
    return true;
  }

  async duplicatePayable(id: string): Promise<PayableItem | null> {
    const payables = await this.getPayables();
    const target = payables.find(p => p.id === id);
    if (!target) return null;

    const dupData: Omit<PayableItem, 'id' | 'paidAmount' | 'remainingAmount' | 'status' | 'payments' | 'createdAt' | 'updatedAt'> = {
      supplierId: target.supplierId,
      supplierNameGuj: target.supplierNameGuj,
      supplierMobile: target.supplierMobile,
      billNumber: `${target.billNumber}-DUP`,
      purchaseDate: new Date().toISOString().split('T')[0],
      dueDate: target.dueDate,
      financialYear: target.financialYear,
      headId: target.headId,
      headNameGuj: target.headNameGuj,
      particularGuj: `${target.particularGuj} (નકલ)`,
      quantity: target.quantity,
      unit: target.unit,
      totalAmount: target.totalAmount,
      billImageBase64: target.billImageBase64,
      billFileName: target.billFileName,
      remarksGuj: target.remarksGuj
    };

    return await this.savePayable(dupData);
  }
}

export class LocalVoucherRepository implements IVoucherRepository {
  async getVouchers(): Promise<Voucher[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.VOUCHERS);
      if (!raw || raw === 'undefined' || raw === 'null') {
        localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(SAMPLE_VOUCHERS));
        return SAMPLE_VOUCHERS;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : SAMPLE_VOUCHERS;
    } catch {
      localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(SAMPLE_VOUCHERS));
      return SAMPLE_VOUCHERS;
    }
  }

  async getVoucherById(id: string): Promise<Voucher | null> {
    const list = await this.getVouchers();
    return list.find(v => v.id === id) || null;
  }

  async createVoucher(vData: Omit<Voucher, 'id' | 'createdAt'>): Promise<Voucher> {
    const vouchers = await this.getVouchers();
    const newVoucher: Voucher = {
      ...vData,
      id: `vch_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    vouchers.unshift(newVoucher);
    localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(vouchers));

    const libRepo = new LocalDocumentLibraryRepository();
    await libRepo.addOrUpdateDocument({
      id: newVoucher.id,
      category: 'Voucher',
      titleGuj: `વાઉચર ${newVoucher.voucherNo}: ${newVoucher.payeeNameGuj}`,
      subtitleGuj: `ગ્રાન્ટ: ${newVoucher.grantTypeGuj || 'Composite'} • ₹${newVoucher.amount}`,
      status: 'completed',
      createdAt: newVoucher.createdAt,
      updatedAt: newVoucher.createdAt,
      payload: newVoucher
    });

    return newVoucher;
  }

  async updateVoucher(id: string, updates: Partial<Voucher>): Promise<Voucher> {
    const vouchers = await this.getVouchers();
    const idx = vouchers.findIndex(v => v.id === id);
    if (idx < 0) {
      throw new Error(`Voucher not found: ${id}`);
    }

    const updated: Voucher = {
      ...vouchers[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    vouchers[idx] = updated;
    localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(vouchers));
    return updated;
  }

  async deleteVoucher(id: string): Promise<boolean> {
    const vouchers = await this.getVouchers();
    const filtered = vouchers.filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(filtered));
    return true;
  }

  async duplicateVoucher(id: string): Promise<Voucher | null> {
    const vouchers = await this.getVouchers();
    const target = vouchers.find(v => v.id === id);
    if (!target) return null;

    const newVoucherNo = `VCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const dupData: Omit<Voucher, 'id' | 'createdAt'> = {
      voucherNo: newVoucherNo,
      voucherType: target.voucherType || 'expense',
      date: new Date().toISOString().split('T')[0],
      schoolNameGuj: target.schoolNameGuj,
      udiseCode: target.udiseCode,
      academicYear: target.academicYear,
      payeeNameGuj: `${target.payeeNameGuj} (નકલ)`,
      payeeMobile: target.payeeMobile,
      particularGuj: target.particularGuj,
      amount: target.amount,
      amountInWordsGuj: target.amountInWordsGuj,
      headId: target.headId,
      grantTypeGuj: target.grantTypeGuj,
      paymentMode: target.paymentMode,
      billNumber: target.billNumber ? `${target.billNumber}-DUP` : undefined,
      remarksGuj: target.remarksGuj,
      billImageBase64: target.billImageBase64,
      billFileName: target.billFileName
    };

    return await this.createVoucher(dupData);
  }
}

export class LocalDocumentLibraryRepository implements IDocumentLibraryRepository {
  async getAllDocuments(): Promise<SavedDocumentItem[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SAVED_DOCUMENTS);
      if (!raw || raw === 'undefined' || raw === 'null') {
        localStorage.setItem(STORAGE_KEYS.SAVED_DOCUMENTS, JSON.stringify(SAMPLE_SAVED_DOCUMENTS));
        return SAMPLE_SAVED_DOCUMENTS;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : SAMPLE_SAVED_DOCUMENTS;
    } catch {
      localStorage.setItem(STORAGE_KEYS.SAVED_DOCUMENTS, JSON.stringify(SAMPLE_SAVED_DOCUMENTS));
      return SAMPLE_SAVED_DOCUMENTS;
    }
  }

  async addOrUpdateDocument(item: SavedDocumentItem): Promise<SavedDocumentItem> {
    const list = await this.getAllDocuments();
    const idx = list.findIndex(d => d.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_DOCUMENTS, JSON.stringify(list));
    return item;
  }

  async toggleFavorite(id: string): Promise<boolean> {
    const list = await this.getAllDocuments();
    const item = list.find(d => d.id === id);
    if (item) {
      item.isFavorite = !item.isFavorite;
      localStorage.setItem(STORAGE_KEYS.SAVED_DOCUMENTS, JSON.stringify(list));
      return !!item.isFavorite;
    }
    return false;
  }

  async deleteDocument(id: string): Promise<boolean> {
    const list = await this.getAllDocuments();
    const filtered = list.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.SAVED_DOCUMENTS, JSON.stringify(filtered));
    return true;
  }

  async duplicateDocument(id: string): Promise<SavedDocumentItem | null> {
    const list = await this.getAllDocuments();
    const target = list.find(d => d.id === id);
    if (!target) return null;

    const dup: SavedDocumentItem = {
      ...target,
      id: `doc_dup_${Date.now()}`,
      titleGuj: `${target.titleGuj} (કોપી)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.unshift(dup);
    localStorage.setItem(STORAGE_KEYS.SAVED_DOCUMENTS, JSON.stringify(list));
    return dup;
  }
}

export class LocalPaperGeneratorRepository implements IPaperGeneratorRepository {
  async getPaperTemplates(): Promise<PaperTemplate[]> {
    return SAMPLE_PAPER_TEMPLATES;
  }
}

export const teacherRepo = new LocalTeacherRepository();
export const patrakRepo = new LocalPatrakRepository();
export const rojmelRepo = new LocalRojmelRepository();
export const payableRepo = new LocalPayableRepository();
export const voucherRepo = new LocalVoucherRepository();
export const docLibRepo = new LocalDocumentLibraryRepository();
export const paperGenRepo = new LocalPaperGeneratorRepository();
