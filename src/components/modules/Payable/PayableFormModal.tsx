import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Check, 
  Camera, 
  Trash2, 
  Mic, 
  MicOff, 
  UserPlus, 
  AlertTriangle 
} from 'lucide-react';
import { PayableItem, Supplier } from '@/types/payable';
import { HeadItem } from '@/types/rojmel';
import { useGujaratiVoice } from '@/hooks/useGujaratiVoice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<PayableItem, 'id' | 'paidAmount' | 'remainingAmount' | 'status' | 'payments' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  suppliers: Supplier[];
  heads: HeadItem[];
  onOpenAddSupplier: () => void;
  initialPayable?: PayableItem | null;
  isMobile?: boolean;
}

export const PayableFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  suppliers,
  heads,
  onOpenAddSupplier,
  initialPayable = null,
  isMobile = false
}) => {
  const [supplierId, setSupplierId] = useState(initialPayable?.supplierId || (suppliers[0]?.id || ''));
  const [supplierMobile, setSupplierMobile] = useState(initialPayable?.supplierMobile || '');
  const [billNumber, setBillNumber] = useState(initialPayable?.billNumber || `BILL-${Math.floor(1000 + Math.random() * 9000)}`);
  const [purchaseDate, setPurchaseDate] = useState(initialPayable?.purchaseDate || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(initialPayable?.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [financialYear, setFinancialYear] = useState(initialPayable?.financialYear || '2026-27');
  const [headId, setHeadId] = useState(initialPayable?.headId || (heads[0]?.id || ''));
  const [particularGuj, setParticularGuj] = useState(initialPayable?.particularGuj || '');
  const [quantity, setQuantity] = useState(initialPayable?.quantity ? String(initialPayable.quantity) : '1');
  const [unit, setUnit] = useState(initialPayable?.unit || 'નંગ (Pcs)');
  const [totalAmount, setTotalAmount] = useState(initialPayable?.totalAmount ? String(initialPayable.totalAmount) : '');
  const [remarksGuj, setRemarksGuj] = useState(initialPayable?.remarksGuj || '');
  
  const [billImageBase64, setBillImageBase64] = useState<string | undefined>(initialPayable?.billImageBase64);
  const [billFileName, setBillFileName] = useState<string | undefined>(initialPayable?.billFileName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeVoiceField, setActiveVoiceField] = useState<'particular' | 'remarks' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialPayable) {
      setSupplierId(initialPayable.supplierId);
      setSupplierMobile(initialPayable.supplierMobile || '');
      setBillNumber(initialPayable.billNumber);
      setPurchaseDate(initialPayable.purchaseDate);
      setDueDate(initialPayable.dueDate);
      setFinancialYear(initialPayable.financialYear);
      setHeadId(initialPayable.headId || (heads[0]?.id || ''));
      setParticularGuj(initialPayable.particularGuj);
      setQuantity(String(initialPayable.quantity || 1));
      setUnit(initialPayable.unit || 'નંગ (Pcs)');
      setTotalAmount(String(initialPayable.totalAmount));
      setRemarksGuj(initialPayable.remarksGuj || '');
      setBillImageBase64(initialPayable.billImageBase64);
      setBillFileName(initialPayable.billFileName);
    } else {
      setSupplierId(suppliers[0]?.id || '');
      setSupplierMobile(suppliers[0]?.mobile || '');
      setBillNumber(`BILL-${Math.floor(1000 + Math.random() * 9000)}`);
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setDueDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
      setFinancialYear('2026-27');
      setHeadId(heads[0]?.id || '');
      setParticularGuj('');
      setQuantity('1');
      setUnit('નંગ (Pcs)');
      setTotalAmount('');
      setRemarksGuj('');
      setBillImageBase64(undefined);
      setBillFileName(undefined);
    }
  }, [initialPayable, isOpen, suppliers, heads]);

  // Sync supplier mobile when selected supplier changes
  useEffect(() => {
    const s = suppliers.find(sup => sup.id === supplierId);
    if (s) {
      setSupplierMobile(s.mobile);
    }
  }, [supplierId, suppliers]);

  const { isListening, startListening, stopListening } = useGujaratiVoice((recognizedText) => {
    if (activeVoiceField === 'particular') {
      setParticularGuj(prev => (prev ? prev + ' ' + recognizedText : recognizedText));
    } else if (activeVoiceField === 'remarks') {
      setRemarksGuj(prev => (prev ? prev + ' ' + recognizedText : recognizedText));
    }
  });

  if (!isOpen) return null;

  const handleVoiceToggle = (field: 'particular' | 'remarks') => {
    if (isListening && activeVoiceField === field) {
      stopListening();
      setActiveVoiceField(null);
    } else {
      setActiveVoiceField(field);
      startListening();
    }
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBillFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setBillImageBase64(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const selSupplier = suppliers.find(s => s.id === supplierId);
    if (!selSupplier) {
      setErrorMsg('કૃપા કરીને વેપારી/સપ્લાયર પસંદ કરો.');
      return;
    }

    const numAmount = parseFloat(totalAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('કૃપા કરીને રકમ > 0 દાખલ કરો.');
      return;
    }

    const selHead = heads.find(h => h.id === headId);

    await onSubmit({
      supplierId: selSupplier.id,
      supplierNameGuj: selSupplier.nameGuj,
      supplierMobile: supplierMobile || selSupplier.mobile,
      billNumber,
      purchaseDate,
      dueDate,
      financialYear,
      headId: selHead?.id,
      headNameGuj: selHead?.headNameGuj,
      particularGuj,
      quantity: parseInt(quantity || '1', 10),
      unit,
      totalAmount: numAmount,
      billImageBase64,
      billFileName,
      remarksGuj
    });

    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex ${
      isMobile ? 'items-end' : 'items-center justify-center p-4'
    }`}>
      <div className={`bg-white w-full shadow-2xl border border-slate-200 font-sans ${
        isMobile 
          ? 'rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200' 
          : 'rounded-3xl max-w-xl p-6 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {initialPayable ? 'ઉધારી નોંધણી સુધારો (Edit Credit Purchase)' : '+ નવી ઉધારી નોંધણી (New Credit Purchase)'}
            </h3>
            <p className="text-[10px] text-slate-400">રોજમેળ સિવાયની સ્વતંત્ર ઉધારી ખરીદી રેકોર્ડ પત્રક</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-900 font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Supplier Selection + Add New Supplier Button */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700">વેપારી / સપ્લાયર (Supplier)</label>
              <button
                type="button"
                onClick={onOpenAddSupplier}
                className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ નવો સપ્લાયર</span>
              </button>
            </div>

            <select
              required
              value={supplierId}
              onChange={e => setSupplierId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nameGuj} ({s.mobile})
                </option>
              ))}
            </select>
          </div>

          {/* Bill Number & Mobile */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">બિલ નંબર (Bill No)</label>
              <input
                type="text"
                required
                value={billNumber}
                onChange={e => setBillNumber(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">મોબાઈલ નંબર</label>
              <input
                type="text"
                value={supplierMobile}
                onChange={e => setSupplierMobile(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Purchase Date & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ખરીદી તારીખ (Purchase Date)</label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ચુકવણી મુદત તારીખ (Due Date)</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Head & Financial Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ગ્રાન્ટ / બજેટ હેડ</label>
              <select
                value={headId}
                onChange={e => setHeadId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              >
                {heads.map(h => (
                  <option key={h.id} value={h.id}>{h.headNameGuj}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">નાણાકીય વર્ષ (Financial Year)</label>
              <select
                value={financialYear}
                onChange={e => setFinancialYear(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              >
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
                <option value="2027-28">2027-28</option>
              </select>
            </div>
          </div>

          {/* Particular & Gujarati Voice */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">ખરીદી સામાન વિગત (Particular Description)</label>
              <button
                type="button"
                onClick={() => handleVoiceToggle('particular')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                  isListening && activeVoiceField === 'particular'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-brand-50 text-brand-700 border border-brand-200'
                }`}
              >
                {isListening && activeVoiceField === 'particular' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                <span>🎤 બોલો</span>
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="દા.ત. શાળા માટે સ્પોર્ટ્સ સાધન કિટ અથવા પ્રિન્ટિંગ સાહિત્ય ઉધાર ખરીદી..."
              value={particularGuj}
              onChange={e => setParticularGuj(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
            />
          </div>

          {/* Quantity, Unit & Total Amount */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">જથ્થો (Qty)</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">એકમ (Unit)</label>
              <input
                type="text"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">કુલ રકમ (Total ₹)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="10000"
                value={totalAmount}
                onChange={e => setTotalAmount(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-slate-900 text-sm"
              />
            </div>
          </div>

          {/* Bill Image Attachment */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 text-xs flex items-center justify-between">
              <span>ઉધારી બિલ ઈમેજ અપલોડ (Bill Attachment)</span>
              {billImageBase64 && <span className="text-emerald-600 font-bold">✓ અપલોડ થયેલ</span>}
            </span>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleImageFileSelect}
              className="hidden"
            />

            {!billImageBase64 ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4 text-brand-600" />
                <span>કેમેરા / ગેલેરીમાંથી બિલ અપલોડ કરો</span>
              </button>
            ) : (
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <img src={billImageBase64} alt="Bill Preview" className="w-10 h-10 object-cover rounded-lg" />
                  <span className="font-bold text-slate-800 text-[11px] truncate max-w-[180px]">{billFileName || 'bill.jpg'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBillImageBase64(undefined);
                    setBillFileName(undefined);
                  }}
                  className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              <span>{initialPayable ? 'અપડેટ કરો' : 'ઉધારી સેવ કરો'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
