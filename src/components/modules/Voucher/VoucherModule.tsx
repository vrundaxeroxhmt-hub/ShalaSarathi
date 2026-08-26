import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Download, 
  RotateCcw, 
  AlertTriangle, 
  Sparkles, 
  Printer, 
  Calendar,
  Lock,
  Camera
} from 'lucide-react';
import { Voucher, VoucherType, VoucherPaymentMode } from '@/types/voucher';
import { HeadItem } from '@/types/rojmel';
import { TeacherProfile } from '@/types/user';
import { voucherRepo, rojmelRepo } from '@/lib/repositories/LocalStorageRepository';
import { VoucherWebLedger } from './VoucherWebLedger';
import { VoucherMobileCards } from './VoucherMobileCards';
import { VoucherFormModal } from './VoucherFormModal';
import { VoucherPrintRenderer } from './VoucherPrintRenderer';
import { VoucherBackupRestoreModal } from './VoucherBackupRestoreModal';

interface Props {
  vouchers: Voucher[];
  teacher: TeacherProfile;
  onCreateVoucher: (voucher: Omit<Voucher, 'id' | 'createdAt'>) => Promise<void>;
  isMobile?: boolean;
}

export const VoucherModule: React.FC<Props> = ({ 
  vouchers: initialVouchers, 
  teacher, 
  onCreateVoucher,
  isMobile = false 
}) => {
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [heads, setHeads] = useState<HeadItem[]>([]);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Active Selections
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [printingVoucher, setPrintingVoucher] = useState<Voucher | null>(null);
  const [deletingVoucher, setDeletingVoucher] = useState<Voucher | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | VoucherType>('All');
  const [headFilter, setHeadFilter] = useState<string>('All');
  const [modeFilter, setModeFilter] = useState<string>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadModuleData = async () => {
    const loadedVouchers = await voucherRepo.getVouchers();
    const loadedHeads = await rojmelRepo.getHeads();
    setVouchers(loadedVouchers);
    setHeads(loadedHeads);
  };

  useEffect(() => {
    loadModuleData();
  }, []);

  useEffect(() => {
    setVouchers(initialVouchers);
  }, [initialVouchers]);

  // Summary Metrics
  const totalAmount = vouchers.reduce((sum, v) => sum + v.amount, 0);
  const attachedBillsCount = vouchers.filter(v => !!v.billImageBase64).length;
  const expenseCount = vouchers.filter(v => v.voucherType === 'expense' || !v.voucherType).length;
  const purchaseCount = vouchers.filter(v => v.voucherType === 'purchase').length;

  // Filter Logic
  const filteredVouchers = vouchers.filter(v => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (v.voucherNo && v.voucherNo.toLowerCase().includes(q)) || 
      (v.payeeNameGuj && v.payeeNameGuj.toLowerCase().includes(q)) || 
      (v.particularGuj && v.particularGuj.toLowerCase().includes(q)) ||
      (v.billNumber && v.billNumber.toLowerCase().includes(q));

    const matchesType = typeFilter === 'All' || (v.voucherType || 'expense') === typeFilter;
    const matchesHead = headFilter === 'All' || v.grantTypeGuj === headFilter;
    const matchesMode = modeFilter === 'All' || v.paymentMode === modeFilter;
    const matchesDateFrom = !dateFrom || v.date >= dateFrom;
    const matchesDateTo = !dateTo || v.date <= dateTo;

    return matchesSearch && matchesType && matchesHead && matchesMode && matchesDateFrom && matchesDateTo;
  });

  const handleOpenAdd = () => {
    setEditingVoucher(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: Voucher) => {
    setEditingVoucher(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: Omit<Voucher, 'id' | 'createdAt'>) => {
    if (editingVoucher) {
      await voucherRepo.updateVoucher(editingVoucher.id, data);
    } else {
      await onCreateVoucher(data);
    }
    await loadModuleData();
    setIsFormOpen(false);
    setEditingVoucher(null);
  };

  const handleDuplicate = async (id: string) => {
    await voucherRepo.duplicateVoucher(id);
    await loadModuleData();
  };

  const handleConfirmDelete = async () => {
    if (deletingVoucher) {
      await voucherRepo.deleteVoucher(deletingVoucher.id);
      await loadModuleData();
      setDeletingVoucher(null);
    }
  };

  const handleRestoreSuccess = async (newVouchers: Voucher[]) => {
    localStorage.setItem('ss_vouchers', JSON.stringify(newVouchers));
    await loadModuleData();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('All');
    setHeadFilter('All');
    setModeFilter('All');
    setDateFrom('');
    setDateTo('');
  };

  if (printingVoucher) {
    return (
      <VoucherPrintRenderer
        voucher={printingVoucher}
        teacher={teacher}
        onClose={() => setPrintingVoucher(null)}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>સત્તાવાર સ્કૂલ પાવતી અને ચુકવણી વાઉચર જનરેટર</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">શાળા વાઉચર મેનેજમેન્ટ (Voucher Module)</h2>
          <p className="text-xs text-slate-500 mt-1">
            ગ્રાન્ટ ચુકવણી, ખરીદી કે ખર્ચ માટેના સત્તાવાર સ્ટાન્ડર્ડ વાઉચર્સ જનરેટ કરો અને બિલ ઈમેજ સાથે A4 પ્રિન્ટ કરો.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsBackupOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-300 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>બેકઅપ / રીસ્ટોર</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ નવું વાઉચર જનરેટ કરો</span>
          </button>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">કુલ વાઉચર્સ</span>
          <div className="text-xl font-black text-slate-900">{vouchers.length} વાઉચર રેકોર્ડ્સ</div>
          <div className="text-[10px] text-slate-400 font-semibold">{expenseCount} ખર્ચ / {purchaseCount} ખરીદી</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">કુલ વાઉચર રકમ</span>
          <div className="text-xl font-extrabold text-purple-700">₹{totalAmount.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-purple-600 font-semibold">જનરેટ થયેલ ચુકવણી સ્લિપ</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">બીડાણ બિલ ઈમેજ</span>
          <div className="text-xl font-black text-emerald-600">{attachedBillsCount} ફાઇલો</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Page 2 ઓરિજિનલ પુરાવો</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">શાળા યુડીઆઇએસ (UDISE)</span>
          <div className="text-sm font-mono font-black text-slate-900">{teacher.school.udiseCode}</div>
          <div className="text-[10px] text-slate-500 font-semibold truncate">{teacher.school.schoolNameGuj}</div>
        </div>
      </div>

      {/* SEARCH & FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 font-sans">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="વાઉચર નંબર, નાણાં મેળવનાર કે વિગતથી શોધો..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          {/* Type Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold w-full md:w-auto">
            {(['All', 'expense', 'purchase', 'other_payment', 'receipt'] as const).map(tp => (
              <button
                key={tp}
                onClick={() => setTypeFilter(tp)}
                className={`px-3 py-1.5 rounded-xl border whitespace-nowrap ${
                  typeFilter === tp
                    ? 'bg-slate-900 text-white border-slate-900 shadow'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {tp === 'All' ? 'બધા' : tp === 'expense' ? 'ખર્ચ' : tp === 'purchase' ? 'ખરીદી' : tp === 'other_payment' ? 'અન્ય' : 'રસીદ'}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">તારીખથી:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="p-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">તારીખ સુધી:</span>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="p-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">હેડ:</span>
            <select
              value={headFilter}
              onChange={e => setHeadFilter(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
            >
              <option value="All">બધા હેડ</option>
              {heads.map(h => (
                <option key={h.id} value={h.headNameGuj}>{h.headNameGuj}</option>
              ))}
            </select>
          </div>

          {(searchQuery || typeFilter !== 'All' || headFilter !== 'All' || modeFilter !== 'All' || dateFrom || dateTo) && (
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
      {filteredVouchers.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 font-sans">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center border border-purple-200">
            <Receipt className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">હજુ કોઈ વાઉચર જનરેટ થયેલ નથી</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              તમારું પ્રથમ સત્તાવાર સ્કૂલ ચુકવણી વાઉચર જનરેટ કરવા માટે નીચે બટન દબાવો.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ નવું વાઉચર બનાવો</span>
          </button>
        </div>
      ) : isMobile ? (
        <VoucherMobileCards
          vouchers={filteredVouchers}
          onEdit={handleOpenEdit}
          onDuplicate={handleDuplicate}
          onDelete={setDeletingVoucher}
          onPrintDocument={setPrintingVoucher}
        />
      ) : (
        <VoucherWebLedger
          vouchers={filteredVouchers}
          onEdit={handleOpenEdit}
          onDuplicate={handleDuplicate}
          onDelete={setDeletingVoucher}
          onPrintDocument={setPrintingVoucher}
        />
      )}

      {/* MODALS */}
      <VoucherFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingVoucher(null);
        }}
        onSubmit={handleFormSubmit}
        existingVouchers={vouchers}
        heads={heads}
        teacher={teacher}
        initialVoucher={editingVoucher}
        isMobile={isMobile}
      />

      <VoucherBackupRestoreModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        vouchers={vouchers}
        onRestoreSuccess={handleRestoreSuccess}
      />

      {/* Safety Confirmation Modal for Delete */}
      {deletingVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-bold text-slate-900 text-base">વાઉચર રેકોર્ડ ડિલીટ કરવાની ખાતરી?</h3>
              <p className="text-xs text-slate-600 font-medium">
                વાઉચર નંબર: <strong className="text-slate-900">{deletingVoucher.voucherNo}</strong> ({deletingVoucher.payeeNameGuj})
              </p>
              <p className="text-[11px] text-rose-700 bg-rose-50 p-2.5 rounded-xl font-semibold">
                ⚠️ ડિલીટ કરવાથી વાઉચર રેકોર્ડ અને જોડાયેલ બિલ ઈમેજ કાયમી ધોરણે દૂર થશે.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                onClick={() => setDeletingVoucher(null)}
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
