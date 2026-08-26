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

export interface ITeacherRepository {
  getProfile(): Promise<TeacherProfile>;
  updateProfile(profile: Partial<TeacherProfile>): Promise<TeacherProfile>;
}

export interface IPatrakRepository {
  getTemplates(): Promise<PatrakTemplate[]>;
  getTemplateById(id: string): Promise<PatrakTemplate | null>;
  toggleFavorite(id: string): Promise<boolean>;
  getSavedDocuments(): Promise<PatrakDocument[]>;
  saveDocument(doc: Omit<PatrakDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<PatrakDocument>;
  deleteDocument(id: string): Promise<boolean>;
}

export interface IAhevalRepository {
  getTemplates(): Promise<AhevalTemplate[]>;
  getSavedDocuments(): Promise<AhevalDocument[]>;
  saveDocument(doc: Omit<AhevalDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<AhevalDocument>;
}

export interface IRojmelRepository {
  getEntries(): Promise<RojmelEntry[]>;
  getDeadStockItems(): Promise<DeadStockItem[]>;
  getSetups(): Promise<RojmelAccountSetup[]>;
  getActiveSetup(): Promise<RojmelAccountSetup | null>;
  saveSetup(setup: Omit<RojmelAccountSetup, 'id' | 'createdAt' | 'updatedAt'>): Promise<RojmelAccountSetup>;
  requestEditRelease(setupId: string, reason: string): Promise<boolean>;
  adminReleaseOneTimeEdit(setupId: string): Promise<boolean>;
  checkPackageQuotaAllowed(): Promise<{ allowed: boolean; currentCount: number; maxAllowed: number }>;
  
  // Head Management
  getHeads(): Promise<HeadItem[]>;
  saveHead(head: Omit<HeadItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeadItem>;
  updateHead(id: string, headData: Partial<HeadItem>): Promise<HeadItem>;
  deleteHead(id: string): Promise<boolean>;
  getAdminTeacherCanEditLimits(): Promise<boolean>;
  setAdminTeacherCanEditLimits(allowed: boolean): Promise<boolean>;

  // Core Entry CRUD
  addEntry(
    entry: Omit<RojmelEntry, 'id' | 'balanceAfter' | 'createdAt'>, 
    createDeadStock?: boolean
  ): Promise<{ entry: RojmelEntry; deadStock?: DeadStockItem }>;
  updateEntry(
    id: string, 
    entryData: Partial<RojmelEntry>, 
    updateDeadStock?: boolean
  ): Promise<{ entry: RojmelEntry; deadStock?: DeadStockItem }>;
  deleteEntrySafely(id: string): Promise<{ success: boolean; unlinkedDeadStockId?: string }>;
  duplicateEntry(id: string): Promise<RojmelEntry | null>;
}

export interface IPayableRepository {
  getPayables(): Promise<PayableItem[]>;
  getSuppliers(): Promise<Supplier[]>;
  saveSupplier(supplierData: Omit<Supplier, 'id' | 'createdAt'>): Promise<Supplier>;
  savePayable(payableData: Omit<PayableItem, 'id' | 'paidAmount' | 'remainingAmount' | 'status' | 'payments' | 'createdAt' | 'updatedAt'>): Promise<PayableItem>;
  updatePayable(id: string, updates: Partial<PayableItem>): Promise<PayableItem>;
  recordPayment(payableId: string, paymentData: Omit<PayablePayment, 'id' | 'payableId' | 'createdAt'>): Promise<PayableItem>;
  deletePayableSafely(id: string): Promise<boolean>;
  duplicatePayable(id: string): Promise<PayableItem | null>;
}

export interface IVoucherRepository {
  getVouchers(): Promise<Voucher[]>;
  getVoucherById(id: string): Promise<Voucher | null>;
  createVoucher(voucher: Omit<Voucher, 'id' | 'createdAt'>): Promise<Voucher>;
  updateVoucher(id: string, updates: Partial<Voucher>): Promise<Voucher>;
  deleteVoucher(id: string): Promise<boolean>;
  duplicateVoucher(id: string): Promise<Voucher | null>;
}

export interface IDocumentLibraryRepository {
  getAllDocuments(): Promise<SavedDocumentItem[]>;
  toggleFavorite(id: string): Promise<boolean>;
  deleteDocument(id: string): Promise<boolean>;
  duplicateDocument(id: string): Promise<SavedDocumentItem | null>;
}

export interface IPaperGeneratorRepository {
  getPaperTemplates(): Promise<PaperTemplate[]>;
}
