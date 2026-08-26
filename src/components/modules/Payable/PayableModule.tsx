import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Users, 
  BarChart3, 
  Download, 
  RotateCcw, 
  AlertTriangle, 
  Sparkles, 
  Calendar,
  Clock,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { PayableItem, Supplier, PayableStatus, PayablePaymentMode } from '@/types/payable';
import { HeadItem } from '@/types/rojmel';
import { TeacherProfile } from '@/types/user';
import { payableRepo, rojmelRepo } from '@/lib/repositories/LocalStorageRepository';
import { computeSupplierSummaries, computeHeadPayableSummaries } from '@/lib/services/payableService';
import { PayableWebLedger } from './PayableWebLedger';
import { PayableMobileCards } from './PayableMobileCards';
import { PayableFormModal } from './PayableFormModal';
import { PayablePaymentModal } from './PayablePaymentModal';
import { PayableSupplierModal } from './PayableSupplierModal';
import { PayablePrintRenderer } from './PayablePrintRenderer';
import { PayableReportsModal } from './PayableReportsModal';
import { PayableBackupRestoreModal } from './PayableBackupRestoreModal';

interface Props {
  teacher: TeacherProfile;
  isMobile?: boolean;
}

export const PayableModule: React.FC<Props> = ({ teacher, isMobile = false }) => {
  const [payables, setPayables] = useState<PayableItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [heads, setHeads] = useState<HeadItem[]>([]);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSupplierOpen, setIsSupplierOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Active Selections
  const [editingPayable, setEditingPayable] = useState<PayableItem | null>(null);
  const [payingPayable, setPayingPayable] = useState<PayableItem | null>(null);
  const [printingPayable, setPrintingPayable] = useState<PayableItem | null>(null);
  const [deletingPayable, setDeletingPayable] = useState<PayableItem | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PayableStatus>('All');
  const [supplierFilter, setSupplierFilter] = useState<string>('All');
  const [headFilter, setHeadFilter] = useState<string>('All');
  const [financialYear, setFinancialYear] = useState<string>('2026-27');

  const loadModuleData = async () => {
    const loadedPayables = await payableRepo.getPayables();
    const loadedSuppliers = await payableRepo.getSuppliers();
    const loadedHeads = await rojmelRepo.getHeads();

    setPayables(loadedPayables);
    setSuppliers(loadedSuppliers);
    setHeads(loadedHeads);
  };

  useEffect(() => {
    loadModuleData();
  }, []);

  // Summary Metrics
  const totalPayableAmount = payables.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPaidAmount = payables.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalOutstandingAmount = payables.reduce((sum, p) => sum + p.remainingAmount, 0);
  const overdueCount = payables.filter(p => p.status === 'overdue').length;

  const supplierSummaries = computeSupplierSummaries(payables, suppliers);
  const headSummaries = computeHeadPayableSummaries(payables);

  // Filter Logic
  const filteredPayables = payables.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      p.supplierNameGuj.toLowerCase().includes(q) || 
      p.billNumber.toLowerCase().includes(q) ||
      p.particularGuj.toLowerCase().includes(q) ||
      (p.remarksGuj && p.remarksGuj.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesSupplier = supplierFilter === 'All' || p.supplierId === supplierFilter;
    const matchesHead = headFilter === 'All' || p.headId === headFilter;
    const matchesFY = !financialYear || p.financialYear === financialYear;

    return matchesSearch && matchesStatus && matchesSupplier && matchesHead && matchesFY;
  });

  const handleOpenAdd = () => {
    setEditingPayable(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: PayableItem) => {
    setEditingPayable(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: Omit<PayableItem, 'id' | 'paidAmount' | 'remainingAmount' | 'status' | 'payments' | 'createdAt' | 'updatedAt'>) => {
    if (editingPayable) {
      await payableRepo.updatePayable(editingPayable.id, data);
    } else {
      await payableRepo.savePayable(data);
    }
    await loadModuleData();
    setIsFormOpen(false);
    setEditingPayable(null);
  };

  const handleOpenPayment = (item: PayableItem) => {
    setPayingPayable(item);
    setIsPaymentOpen(true);
  };

  const handleRecordPaymentSubmit = async (payableId: string, paymentData: any) => {
    await payableRepo.recordPayment(payableId, paymentData);
    await loadModuleData();
    setIsPaymentOpen(false);
    setPayingPayable(null);
  };

  const handleAddSupplier = async (supplierData: any) => {
    await payableRepo.saveSupplier(supplierData);
    await loadModuleData();
  };

  const handleDuplicate = async (id: string) => {
    await payableRepo.duplicatePayable(id);
    await loadModuleData();
  };

  const handleConfirmDelete = async () => {
    if (deletingPayable) {
      await payableRepo.deletePayableSafely(deletingPayable.id);
      await loadModuleData();
      setDeletingPayable(null);
    }
  };

  const handleRestoreSuccess = async (newPayables: PayableItem[], newSuppliers: Supplier[]) => {
    localStorage.setItem('ss_payables', JSON.stringify(newPayables));
    localStorage.setItem('ss_suppliers', JSON.stringify(newSuppliers));
    await loadModuleData();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setSupplierFilter('All');
    setHeadFilter('All');
  };

  if (printingPayable) {
    return (
      <PayablePrintRenderer
        payable={printingPayable}
        teacher={teacher}
        onClose={() => setPrintingPayable(null)}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200 mb-2">
            <Lock className="w-3.5 h-3.5 text-rose-600" />
            <span>રોજમેળ સિવાયની સ્વતંત્ર ઉધારી વ્યવસ્થા (100% Separate from Rojmel)</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">શાળા ઉધારી અને સપ્લાયર ચુકવણી વ્યવસ્થા</h2>
          <p className="text-xs text-slate-500 mt-1">
            વેપારી ઉધાર ખરીદી નોંધણી, હપ્તાવાર ચુકવણી ઇતિહાસ, ઓવરડ્યુ એલર્ટ અને સત્તાવાર બિલ પ્રિન્ટિંગ.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsSupplierOpen(true)}
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold px-3 py-2 rounded-xl border border-amber-300 flex items-center gap-1.5 transition-all"
          >
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span>સપ્લાયર સેટઅપ ({suppliers.length})</span>
          </button>

          <button
            onClick={() => setIsReportsOpen(true)}
            className="bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold px-3 py-2 rounded-xl border border-purple-300 flex items-center gap-1.5 transition-all"
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-700" />
            <span>ઉધારી અહેવાલ</span>
          </button>

          <button
            onClick={() => setIsBackupOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>બેકઅપ / રીસ્ટોર</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ નવી ઉધારી નોંધણી</span>
          </button>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">કુલ ઉધાર ખરીદી</span>
          <div className="text-xl font-extrabold text-slate-900">₹{totalPayableAmount.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-400 font-semibold">{payables.length} કુલ બિલ રેકોર્ડ્સ</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">કુલ ચુકવેલ રકમ</span>
          <div className="text-xl font-extrabold text-emerald-600">₹{totalPaidAmount.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">ચુકવણી રેકોર્ડ્સ સક્રિય</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">કુલ બાકી ઉધારી</span>
          <div className="text-xl font-extrabold text-rose-600">₹{totalOutstandingAmount.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-rose-600 font-semibold">સપ્લાયરોને ચુકવવા પાત્ર</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">સમયમર્યાદા પૂર્ણ (Overdue)</span>
          <div className="text-xl font-extrabold text-amber-600">{overdueCount} બિલ રેકોર્ડ્સ</div>
          <div className="text-[10px] text-amber-600 font-semibold">તત્કાલ ચુકવણી જરૂરી</div>
        </div>
      </div>

      {/* SEARCH & FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 font-sans">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="વેપારી, બિલ નંબર કે સામાન વિગતથી શોધો..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          {/* Status Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold w-full md:w-auto">
            {(['All', 'unpaid', 'partially_paid', 'paid', 'overdue'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl border whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white border-slate-900 shadow'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {st === 'All' ? 'બધા' : st === 'unpaid' ? 'બાકી' : st === 'partially_paid' ? 'આંશિક' : st === 'paid' ? 'સંપૂર્ણ' : 'ઓવરડ્યુ'}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">સપ્લાયર:</span>
            <select
              value={supplierFilter}
              onChange={e => setSupplierFilter(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
            >
              <option value="All">બધા વેપારીઓ</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.nameGuj}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">ગ્રાન્ટ હેડ:</span>
            <select
              value={headFilter}
              onChange={e => setHeadFilter(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
            >
              <option value="All">બધા હેડ</option>
              {heads.map(h => (
                <option key={h.id} value={h.id}>{h.headNameGuj}</option>
              ))}
            </select>
          </div>

          {(searchQuery || statusFilter !== 'All' || supplierFilter !== 'All' || headFilter !== 'All') && (
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

      {/* LEDGER CONTENT */}
      {filteredPayables.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 font-sans">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-200">
            <CreditCard className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">હજુ કોઈ ઉધારી ખરીદી નથી</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              તમારી પ્રથમ ઉધારી નોંધણી દાખલ કરવા માટે નીચે બટન દબાવો.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ નવી ઉધારી ઉમેરો</span>
          </button>
        </div>
      ) : isMobile ? (
        <PayableMobileCards
          payables={filteredPayables}
          onEdit={handleOpenEdit}
          onPayment={handleOpenPayment}
          onDuplicate={handleDuplicate}
          onDelete={setDeletingPayable}
          onPrintDocument={setPrintingPayable}
        />
      ) : (
        <PayableWebLedger
          payables={filteredPayables}
          onEdit={handleOpenEdit}
          onPayment={handleOpenPayment}
          onDuplicate={handleDuplicate}
          onDelete={setDeletingPayable}
          onPrintDocument={setPrintingPayable}
        />
      )}

      {/* MODALS */}
      <PayableFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPayable(null);
        }}
        onSubmit={handleFormSubmit}
        suppliers={suppliers}
        heads={heads}
        onOpenAddSupplier={() => setIsSupplierOpen(true)}
        initialPayable={editingPayable}
        isMobile={isMobile}
      />

      {payingPayable && (
        <PayablePaymentModal
          isOpen={isPaymentOpen}
          onClose={() => {
            setIsPaymentOpen(false);
            setPayingPayable(null);
          }}
          payable={payingPayable}
          onSubmitPayment={handleRecordPaymentSubmit}
          isMobile={isMobile}
        />
      )}

      <PayableSupplierModal
        isOpen={isSupplierOpen}
        onClose={() => setIsSupplierOpen(false)}
        suppliers={suppliers}
        supplierSummaries={supplierSummaries}
        onAddSupplier={handleAddSupplier}
      />

      <PayableReportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
        payables={payables}
        suppliers={suppliers}
        financialYear={financialYear}
      />

      <PayableBackupRestoreModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        payables={payables}
        suppliers={suppliers}
        onRestoreSuccess={handleRestoreSuccess}
      />

      {/* Safety Confirmation Modal for Delete */}
      {deletingPayable && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-bold text-slate-900 text-base">ઉધારી રેકોર્ડ ડિલીટ કરવાની ખાતરી?</h3>
              <p className="text-xs text-slate-600 font-medium">
                બિલ નંબર: <strong className="text-slate-900">{deletingPayable.billNumber}</strong> ({deletingPayable.supplierNameGuj})
              </p>

              {deletingPayable.payments.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-950 text-xs font-bold text-left space-y-1">
                  ⚠️ <span>આ ઉધારી સાથે {deletingPayable.payments.length} ચુકવણીનો ઇતિહાસ જોડાયેલો છે.</span>
                  <div className="text-[10px] text-rose-700 font-normal">
                    ડિલીટ કરવાથી તમામ ચુકવણી રેકોર્ડ્સ અને ઈમેજ પણ સુરક્ષિત રીતે દૂર થશે.
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                onClick={() => setDeletingPayable(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                રદ કરો
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md"
              >
                હા, ખરેખર ડિલીટ કરો
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
