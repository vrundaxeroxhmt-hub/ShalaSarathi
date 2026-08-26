import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Printer, 
  Search, 
  PackageCheck, 
  Link as LinkIcon, 
  AlertTriangle,
  Sparkles,
  BarChart3,
  Download,
  RotateCcw,
  Calendar,
  Lock,
  FileText,
  ShieldCheck,
  Building2,
  FolderKanban,
  Receipt
} from 'lucide-react';
import { 
  RojmelEntry, 
  DeadStockItem, 
  TransactionType, 
  PaymentMode, 
  RojmelAccountSetup, 
  HeadItem, 
  GrantHeadStatus 
} from '@/types/rojmel';
import { Voucher } from '@/types/voucher';
import { ParishishtNumber } from '@/types/parishishtTemplate';
import { TeacherProfile } from '@/types/user';
import { 
  calculateRojmelSummary, 
  filterRojmelEntries, 
  computeHeadGrantStatus,
  getDailyGrantReminders,
  markReminderSeenToday 
} from '@/lib/services/rojmelService';
import { RojmelSummaryCards } from './RojmelSummaryCards';
import { RojmelWebLedger } from './RojmelWebLedger';
import { RojmelMobileCards } from './RojmelMobileCards';
import { RojmelFormModal } from './RojmelFormModal';
import { RojmelPrintRenderer } from './RojmelPrintRenderer';
import { RojmelMonthlyYearlyModal } from './RojmelMonthlyYearlyModal';
import { RojmelBackupRestoreModal } from './RojmelBackupRestoreModal';
import { RojmelSetupModal } from './RojmelSetupModal';
import { RojmelHeadManagerModal } from './RojmelHeadManagerModal';
import { RojmelDailyGrantReminderModal } from './RojmelDailyGrantReminderModal';
import { RojmelOfficialPatrakModal } from './RojmelOfficialPatrakModal';
import { RojmelAdminControlModal } from './RojmelAdminControlModal';
import { RojmelParishishtReportsModal } from './RojmelParishishtReportsModal';
import { RojmelParishishtPrintRenderer } from './RojmelParishishtPrintRenderer';
import { VoucherFormModal } from '../Voucher/VoucherFormModal';
import { rojmelRepo, voucherRepo } from '@/lib/repositories/LocalStorageRepository';

interface Props {
  entries: RojmelEntry[];
  deadStockItems: DeadStockItem[];
  teacher: TeacherProfile;
  onAddEntry: (entry: Omit<RojmelEntry, 'id' | 'balanceAfter' | 'createdAt'>, linkDeadStock: boolean) => Promise<void>;
  isMobile?: boolean;
}

export const RojmelModule: React.FC<Props> = ({ 
  entries: initialEntries, 
  deadStockItems: initialDeadStock, 
  teacher, 
  onAddEntry,
  isMobile = false 
}) => {
  const [entries, setEntries] = useState<RojmelEntry[]>(initialEntries);
  const [deadStockItems, setDeadStockItems] = useState<DeadStockItem[]>(initialDeadStock);
  const [setup, setSetup] = useState<RojmelAccountSetup | null>(null);
  const [setupsList, setSetupsList] = useState<RojmelAccountSetup[]>([]);
  const [heads, setHeads] = useState<HeadItem[]>([]);
  const [existingVouchers, setExistingVouchers] = useState<Voucher[]>([]);
  const [teacherCanEditLimits, setTeacherCanEditLimits] = useState(true);

  const [activeTab, setActiveTab] = useState<'rojmel' | 'deadstock' | 'grants'>('rojmel');
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isHeadManagerOpen, setIsHeadManagerOpen] = useState(false);
  const [isParishishtModalOpen, setIsParishishtModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);

  // Selected Triggers
  const [editingEntry, setEditingEntry] = useState<RojmelEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<RojmelEntry | null>(null);
  const [autoVoucherSourceEntry, setAutoVoucherSourceEntry] = useState<RojmelEntry | null>(null);
  const [printingParishishtNo, setPrintingParishishtNo] = useState<{ num: ParishishtNumber; date: string; forcedVersion?: number; orientation?: 'landscape' | 'portrait' } | null>(null);

  // Daily Grant Reminder Popup State
  const [showDailyReminder, setShowDailyReminder] = useState(false);
  const [dailyRemindersList, setDailyRemindersList] = useState<GrantHeadStatus[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | TransactionType>('All');
  const [paymentModeFilter, setPaymentModeFilter] = useState<'All' | PaymentMode>('All');
  const [headFilter, setHeadFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'ThisMonth' | 'Custom'>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Initial Data Load
  const loadModuleData = async () => {
    const updatedEntries = await rojmelRepo.getEntries();
    const updatedStock = await rojmelRepo.getDeadStockItems();
    const activeSetup = await rojmelRepo.getActiveSetup();
    const allSetups = await rojmelRepo.getSetups();
    const loadedHeads = await rojmelRepo.getHeads();
    const loadedVouchers = await voucherRepo.getVouchers();
    const canEdit = await rojmelRepo.getAdminTeacherCanEditLimits();

    setEntries(updatedEntries);
    setDeadStockItems(updatedStock);
    setSetup(activeSetup);
    setSetupsList(allSetups);
    setHeads(loadedHeads);
    setExistingVouchers(loadedVouchers);
    setTeacherCanEditLimits(canEdit);

    // Compute grant head statuses
    const headStatuses = computeHeadGrantStatus(updatedEntries, loadedHeads, activeSetup?.financialYear || '2026-27');
    const reminderRes = getDailyGrantReminders(headStatuses);
    
    if (reminderRes.shouldShow && reminderRes.reminders.length > 0) {
      setDailyRemindersList(reminderRes.reminders);
      setShowDailyReminder(true);
    }
  };

  useEffect(() => {
    loadModuleData();
  }, []);

  const handleCloseReminder = () => {
    markReminderSeenToday();
    setShowDailyReminder(false);
  };

  // Accounting Calculation
  const openingBalance = setup ? setup.openingBalance : 25000;
  const summary = calculateRojmelSummary(entries, openingBalance);
  const headStatuses = computeHeadGrantStatus(entries, heads, setup?.financialYear || '2026-27');

  const filteredEntries = filterRojmelEntries(
    entries, 
    searchQuery, 
    typeFilter, 
    paymentModeFilter, 
    dateFilter, 
    dateFrom, 
    dateTo,
    headFilter
  );

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (entry: RojmelEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (
    data: Omit<RojmelEntry, 'id' | 'balanceAfter' | 'createdAt'>, 
    autoLinkDeadStock: boolean
  ) => {
    if (editingEntry) {
      await rojmelRepo.updateEntry(editingEntry.id, data, autoLinkDeadStock);
    } else {
      await onAddEntry(data, autoLinkDeadStock);
    }
    await loadModuleData();
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const handleDuplicate = async (id: string) => {
    await rojmelRepo.duplicateEntry(id);
    await loadModuleData();
  };

  const handleConfirmDelete = async () => {
    if (deletingEntry) {
      await rojmelRepo.deleteEntrySafely(deletingEntry.id);
      await loadModuleData();
      setDeletingEntry(null);
    }
  };

  const handleCreateVoucherFromEntry = (entry: RojmelEntry) => {
    setAutoVoucherSourceEntry(entry);
    setIsVoucherModalOpen(true);
  };

  const handleVoucherFormSubmit = async (vData: Omit<Voucher, 'id' | 'createdAt'>) => {
    await voucherRepo.createVoucher(vData);
    await loadModuleData();
    setIsVoucherModalOpen(false);
    setAutoVoucherSourceEntry(null);
  };

  const handleRestoreSuccess = async (newEntries: RojmelEntry[], newDeadStock: DeadStockItem[]) => {
    localStorage.setItem('ss_rojmel_entries', JSON.stringify(newEntries));
    localStorage.setItem('ss_dead_stock', JSON.stringify(newDeadStock));
    await loadModuleData();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('All');
    setPaymentModeFilter('All');
    setHeadFilter('All');
    setDateFilter('All');
    setDateFrom('');
    setDateTo('');
  };

  // Render Modes
  if (isPrintViewOpen) {
    return (
      <RojmelPrintRenderer
        entries={filteredEntries}
        summary={summary}
        teacher={teacher}
        setup={setup}
        onClose={() => setIsPrintViewOpen(false)}
      />
    );
  }

  if (printingParishishtNo) {
    return (
      <RojmelParishishtPrintRenderer
        parishishtNo={printingParishishtNo.num}
        documentDate={printingParishishtNo.date}
        forcedVersion={printingParishishtNo.forcedVersion}
        orientation={printingParishishtNo.orientation}
        rojmelEntries={entries}
        heads={heads}
        teacher={teacher}
        onClose={() => setPrintingParishishtNo(null)}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>૧૦૦% સત્તાવાર રોજમેળ, બજેટ લિમિટ અને પરિશિષ્ટ ૦૧ થી ૧૨ સત્તાવાર પત્રકો</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            {setup?.rojmelNameGuj || 'શાળા રોજમેળ અને સ્ટોક રજિસ્ટર'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            શાળા: <strong className="text-slate-800">{setup?.schoolNameGuj || teacher.school.schoolNameGuj}</strong> | નાણાકીય વર્ષ: <strong className="text-brand-700">{setup?.financialYear || '2026-27'}</strong> | બેંક: {setup?.bankName || 'SBI'}
          </p>
        </div>

        {/* Banner Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsParishishtModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>📑 સત્તાવાર પરિશિષ્ટ ૦૧–૧૨</span>
          </button>

          <button
            onClick={() => setIsSetupOpen(true)}
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold px-3 py-2 rounded-xl border border-amber-300 flex items-center gap-1.5 transition-all"
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>રોજમેળ સેટઅપ (Setup)</span>
          </button>

          <button
            onClick={() => setIsHeadManagerOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 flex items-center gap-1.5 transition-all"
          >
            <FolderKanban className="w-3.5 h-3.5 text-brand-600" />
            <span>બજેટ હેડ (Heads)</span>
          </button>

          <button
            onClick={() => setIsAdminPanelOpen(true)}
            className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>એડમિન કંટ્રોલ</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>નવી એન્ટ્રી</span>
          </button>

          <button
            onClick={() => setIsPrintViewOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>A4 પ્રિન્ટ</span>
          </button>
        </div>
      </div>

      {/* Accounting Summary Cards */}
      <RojmelSummaryCards summary={summary} isMobile={isMobile} />

      {/* Tabs (Ledger vs Dead Stock vs Grant Status) */}
      <div className="flex border-b border-slate-200 text-sm font-bold">
        <button
          onClick={() => setActiveTab('rojmel')}
          className={`px-6 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'rojmel'
              ? 'border-brand-600 text-brand-600 bg-brand-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>રોજમેળ પત્રક (Rojmel Ledger)</span>
        </button>

        <button
          onClick={() => setActiveTab('deadstock')}
          className={`px-6 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'deadstock'
              ? 'border-brand-600 text-brand-600 bg-brand-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>ડેડ સ્ટોક રજિસ્ટર (Dead Stock Register)</span>
          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
            Auto-Linked ({deadStockItems.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('grants')}
          className={`px-6 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'grants'
              ? 'border-brand-600 text-brand-600 bg-brand-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>ગ્રાન્ટ વપરાશ વિગત (Grant Limits)</span>
        </button>
      </div>

      {/* TAB 1: ROJMEL LEDGER */}
      {activeTab === 'rojmel' && (
        <div className="space-y-4 font-sans">
          {/* Advanced Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="વિગત, હેડ, વાઉચર કે બિલથી શોધો..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold w-full md:w-auto">
                {(['All', 'income', 'expense', 'purchase'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-xl border whitespace-nowrap ${
                      typeFilter === t
                        ? 'bg-slate-900 text-white border-slate-900 shadow'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {t === 'All' ? 'બધા' : t === 'income' ? '+ આવક' : t === 'expense' ? '- ખર્ચ' : '🛒 ખરીદી'}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Range & Head Filter */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">ગ્રાન્ટ હેડ:</span>
                <select
                  value={headFilter}
                  onChange={e => setHeadFilter(e.target.value)}
                  className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                >
                  <option value="All">બધા હેડ (All Heads)</option>
                  {heads.map(h => (
                    <option key={h.id} value={h.id}>{h.headNameGuj}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">ચુકવણી મોડ:</span>
                <select
                  value={paymentModeFilter}
                  onChange={e => setPaymentModeFilter(e.target.value as PaymentMode | 'All')}
                  className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                >
                  <option value="All">બધા મોડ</option>
                  <option value="Cash">રોકડ</option>
                  <option value="Bank">બેંક ટ્રાન્સફર</option>
                  <option value="UPI">UPI</option>
                  <option value="Cheque">ચેક</option>
                </select>
              </div>

              {(searchQuery || typeFilter !== 'All' || paymentModeFilter !== 'All' || headFilter !== 'All') && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ફિલ્ટર્સ સાફ કરો</span>
                </button>
              )}
            </div>
          </div>

          {/* Table vs Mobile View */}
          {filteredEntries.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 font-sans">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">હજુ કોઈ એન્ટ્રી નથી</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  તમારી પ્રથમ રોજમેળ એન્ટ્રી નોંધાવવા માટે નીચે બટન દબાવો.
                </p>
              </div>
              <button
                onClick={handleOpenAdd}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ નવી એન્ટ્રી ઉમેરો</span>
              </button>
            </div>
          ) : isMobile ? (
            <RojmelMobileCards
              entries={filteredEntries}
              onEdit={handleOpenEdit}
              onDuplicate={handleDuplicate}
              onDelete={setDeletingEntry}
              onCreateVoucher={handleCreateVoucherFromEntry}
            />
          ) : (
            <RojmelWebLedger
              entries={filteredEntries}
              onEdit={handleOpenEdit}
              onDuplicate={handleDuplicate}
              onDelete={setDeletingEntry}
              onCreateVoucher={handleCreateVoucherFromEntry}
            />
          )}
        </div>
      )}

      {/* TAB 2: DEAD STOCK REGISTER */}
      {activeTab === 'deadstock' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4 font-sans">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">શાળા ડેડ સ્ટોક રજિસ્ટર (Dead Stock Inventory)</h3>
              <p className="text-xs text-slate-500">રોજમેળ ખરીદીથી ઓટો-લિંક થયેલ તમામ ઉપકરણો અને સાધનો.</p>
            </div>
            <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
              કુલ {deadStockItems.length} સાધનો
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ખરીદી તારીખ</th>
                  <th className="py-3 px-4">સાધન / ઉપકરણ નામ (Item)</th>
                  <th className="py-3 px-4">કેટેગરી</th>
                  <th className="py-3 px-4 text-center">નંગ (Qty)</th>
                  <th className="py-3 px-4 text-right">રકમ (₹)</th>
                  <th className="py-3 px-4 text-center">વાઉચર રીફરન્સ</th>
                  <th className="py-3 px-4">રોજમેળ સોર્સ લિંક</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deadStockItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.purchaseDate}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">{item.itemNameGuj}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">{item.category}</td>
                    <td className="py-3.5 px-4 text-center font-bold">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">₹{item.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-purple-700">{item.voucherRef || '-'}</td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-500">
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                        <LinkIcon className="w-3 h-3 text-amber-600" />
                        <span>{item.sourceRojmelEntryId || 'Linked'}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: GRANT HEAD STATUS & LIMITS */}
      {activeTab === 'grants' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 font-sans">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">ગ્રાન્ટ વપરાશ અને મંજૂર લિમિટ સ્ટેટસ</h3>
              <p className="text-xs text-slate-500">નાણાકીય વર્ષ {setup?.financialYear || '2026-27'} મુજબનું બજેટ ટ્રેકિંગ</p>
            </div>
            <button
              onClick={() => setIsHeadManagerOpen(true)}
              className="bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>હેડ ઉમેરો / લિમિટ સેટ કરો</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {headStatuses.map(hs => {
              const percent = Math.min(100, Math.round((hs.usedAmount / hs.limit) * 100));
              return (
                <div key={hs.headId} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{hs.headNameGuj}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{hs.grantCategory}</div>
                    </div>
                    {hs.overspentAmount > 0 && (
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-300">
                        ⚠️ ઓવરસ્પેન્ડ: ₹{hs.overspentAmount.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>વપરાયેલ: ₹{hs.usedAmount.toLocaleString('en-IN')} ({percent}%)</span>
                      <span>લિમિટ: ₹{hs.limit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          hs.overspentAmount > 0 ? 'bg-rose-600' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-slate-500 text-right font-bold">
                      બાકી ગ્રાન્ટ: <strong className="text-emerald-700">₹{hs.remainingAmount.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODALS */}
      <RojmelFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEntry(null);
        }}
        onSubmit={handleFormSubmit}
        initialEntry={editingEntry}
        heads={heads}
        isMobile={isMobile}
      />

      <RojmelSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        setup={setup}
        onSaveSuccess={loadModuleData}
      />

      <RojmelHeadManagerModal
        isOpen={isHeadManagerOpen}
        onClose={() => setIsHeadManagerOpen(false)}
        heads={heads}
        financialYear={setup?.financialYear || '2026-27'}
        onRefresh={loadModuleData}
        teacherCanEditLimits={teacherCanEditLimits}
      />

      <RojmelDailyGrantReminderModal
        isOpen={showDailyReminder}
        onClose={handleCloseReminder}
        reminders={dailyRemindersList}
        onOpenPurchase={handleOpenAdd}
      />

      <RojmelParishishtReportsModal
        isOpen={isParishishtModalOpen}
        onClose={() => setIsParishishtModalOpen(false)}
        rojmelEntries={entries}
        heads={heads}
        teacher={teacher}
        onPrintParishisht={(num, date, forcedVersion, orientation) => setPrintingParishishtNo({ num, date, forcedVersion, orientation })}
      />

      <RojmelAdminControlModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        setups={setupsList}
        onRefresh={loadModuleData}
      />

      <RojmelMonthlyYearlyModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        entries={entries}
        academicYear={setup?.financialYear || teacher.academicYear}
      />

      <RojmelBackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        entries={entries}
        deadStockItems={deadStockItems}
        onRestoreSuccess={handleRestoreSuccess}
      />

      {/* Auto-Voucher Form Modal Triggered from Rojmel Entry */}
      {isVoucherModalOpen && (
        <VoucherFormModal
          isOpen={isVoucherModalOpen}
          onClose={() => {
            setIsVoucherModalOpen(false);
            setAutoVoucherSourceEntry(null);
          }}
          onSubmit={handleVoucherFormSubmit}
          existingVouchers={existingVouchers}
          heads={heads}
          teacher={teacher}
          autoFillSource={autoVoucherSourceEntry ? {
            payeeNameGuj: autoVoucherSourceEntry.particularGuj,
            particularGuj: autoVoucherSourceEntry.particularGuj,
            amount: autoVoucherSourceEntry.amount,
            headNameGuj: autoVoucherSourceEntry.headNameGuj,
            paymentMode: autoVoucherSourceEntry.paymentMode as any,
            billNumber: autoVoucherSourceEntry.voucherNo,
            remarksGuj: autoVoucherSourceEntry.remarksGuj,
            billImageBase64: autoVoucherSourceEntry.billImageBase64,
            sourceRojmelEntryId: autoVoucherSourceEntry.id
          } : null}
          isMobile={isMobile}
        />
      )}

      {/* Safe Delete Warning Modal */}
      {deletingEntry && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-bold text-slate-900 text-base">એન્ટ્રી ડિલીટ કરવાની ખાતરી?</h3>
              <p className="text-xs text-slate-600 font-medium">
                આ વિગત: <strong className="text-slate-900">{deletingEntry.particularGuj}</strong> (₹{deletingEntry.amount.toLocaleString('en-IN')})
              </p>

              {deletingEntry.isDeadStockLinked && (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-900 text-xs font-bold text-left space-y-1">
                  ⚠️ <span>આ ખરીદી સાથે Dead Stock entry જોડાયેલી છે.</span>
                  <div className="text-[10px] text-rose-700 font-normal">
                    ડિલીટ કરવાથી સંબંધિત ડેડ સ્ટોક રેકોર્ડ પણ સુરક્ષિત રીતે દૂર થશે.
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingEntry(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                રદ કરો
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                હા, ડિલીટ કરો
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
