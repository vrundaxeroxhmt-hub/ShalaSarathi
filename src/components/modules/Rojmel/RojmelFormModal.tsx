import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Check, 
  Sparkles, 
  ShoppingCart, 
  ArrowUpRight, 
  ArrowDownRight,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { 
  RojmelEntry, 
  TransactionType, 
  PaymentMode, 
  RojmelCategory, 
  HeadItem,
  PAYMENT_MODE_LABELS, 
  CATEGORY_LABELS 
} from '@/types/rojmel';
import { useGujaratiVoice } from '@/hooks/useGujaratiVoice';
import { validateTransactionGrantLimit } from '@/lib/services/rojmelService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<RojmelEntry, 'id' | 'balanceAfter' | 'createdAt'>, 
    autoLinkDeadStock: boolean
  ) => Promise<void>;
  initialEntry?: RojmelEntry | null;
  heads: HeadItem[];
  isMobile?: boolean;
}

export const RojmelFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialEntry = null,
  heads = [],
  isMobile = false
}) => {
  const [type, setType] = useState<TransactionType>(initialEntry?.type || 'expense');
  const [date, setDate] = useState(initialEntry?.date || new Date().toISOString().split('T')[0]);
  const [headId, setHeadId] = useState(initialEntry?.headId || (heads[0]?.id || ''));
  const [particularGuj, setParticularGuj] = useState(initialEntry?.particularGuj || '');
  const [amount, setAmount] = useState(initialEntry?.amount ? String(initialEntry.amount) : '');
  const [quantity, setQuantity] = useState(initialEntry?.quantity ? String(initialEntry.quantity) : '1');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(initialEntry?.paymentMode || 'Bank');
  const [category, setCategory] = useState<RojmelCategory>(initialEntry?.category || 'Stationery');
  const [remarksGuj, setRemarksGuj] = useState(initialEntry?.remarksGuj || '');
  const [voucherNo, setVoucherNo] = useState(initialEntry?.voucherNo || `V-${Math.floor(100 + Math.random() * 900)}`);
  const [autoLinkDeadStock, setAutoLinkDeadStock] = useState(initialEntry?.isDeadStockLinked ?? true);
  
  // Image Attachment State
  const [billImageBase64, setBillImageBase64] = useState<string | undefined>(initialEntry?.billImageBase64);
  const [billFileName, setBillFileName] = useState<string | undefined>(initialEntry?.billFileName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Overspent Warning State
  const [overspentError, setOverspentError] = useState<string | null>(null);
  const [activeVoiceField, setActiveVoiceField] = useState<'particular' | 'remarks' | null>(null);

  useEffect(() => {
    if (initialEntry) {
      setType(initialEntry.type);
      setDate(initialEntry.date);
      setHeadId(initialEntry.headId || (heads[0]?.id || ''));
      setParticularGuj(initialEntry.particularGuj);
      setAmount(String(initialEntry.amount));
      setQuantity(String(initialEntry.quantity || 1));
      setPaymentMode(initialEntry.paymentMode || 'Bank');
      setCategory(initialEntry.category || 'Stationery');
      setRemarksGuj(initialEntry.remarksGuj || '');
      setVoucherNo(initialEntry.voucherNo || '');
      setAutoLinkDeadStock(!!initialEntry.isDeadStockLinked);
      setBillImageBase64(initialEntry.billImageBase64);
      setBillFileName(initialEntry.billFileName);
    } else {
      setType('expense');
      setDate(new Date().toISOString().split('T')[0]);
      setHeadId(heads[0]?.id || '');
      setParticularGuj('');
      setAmount('');
      setQuantity('1');
      setPaymentMode('Bank');
      setCategory('Stationery');
      setRemarksGuj('');
      setVoucherNo(`V-${Math.floor(100 + Math.random() * 900)}`);
      setAutoLinkDeadStock(true);
      setBillImageBase64(undefined);
      setBillFileName(undefined);
    }
  }, [initialEntry, isOpen, heads]);

  // Gujarati Voice Recognition
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
    setOverspentError(null);
    if (!particularGuj || !amount) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setOverspentError('કૃપા કરીને માન્ય ધનાત્મક રકમ દાખલ કરો.');
      return;
    }

    // Grant Limit Validation for Expense and Purchase
    const selectedHead = heads.find(h => h.id === headId);
    if (selectedHead && (type === 'expense' || type === 'purchase')) {
      const limitRes = validateTransactionGrantLimit(selectedHead, numAmount, 0);
      if (!limitRes.allowed) {
        setOverspentError(limitRes.errorMsgGuj || 'ગ્રાન્ટ મર્યાદા કરતાં વધુ ખર્ચ કરી શકાતો નથી.');
        return;
      }
    }

    await onSubmit(
      {
        date,
        type,
        headId,
        headNameGuj: selectedHead?.headNameGuj,
        particularGuj,
        amount: numAmount,
        quantity: type === 'purchase' ? parseInt(quantity || '1', 10) : undefined,
        paymentMode,
        category,
        remarksGuj,
        voucherNo: voucherNo || undefined,
        billImageBase64,
        billFileName,
        isDeadStockLinked: type === 'purchase' && autoLinkDeadStock
      },
      type === 'purchase' && autoLinkDeadStock
    );

    onClose();
  };

  const paymentModes: PaymentMode[] = ['Cash', 'Bank', 'UPI', 'Cheque', 'Other'];
  const categories: RojmelCategory[] = [
    'Stationery', 'Equipment', 'Repair & Maintenance', 'Electricity', 'Water', 
    'Cleaning', 'Teaching Material', 'Sports', 'Library', 'Other'
  ];

  return (
    <div className={`fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex ${
      isMobile ? 'items-end' : 'items-center justify-center p-4'
    }`}>
      <div className={`bg-white w-full shadow-2xl border border-slate-200 font-sans ${
        isMobile 
          ? 'rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200' 
          : 'rounded-3xl max-w-lg p-6 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {initialEntry ? 'રોજમેળ એન્ટ્રી સુધારો (Edit Entry)' : 'નવી રોજમેળ નોંધણી (New Entry)'}
            </h3>
            <p className="text-[10px] text-slate-400">દૈનિક શાળા હિસાબ નોંધણી પત્રક</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction Type Selector */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">વ્યવહાર પ્રકાર (Transaction Type)</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-xl font-extrabold text-xs transition-all border flex items-center justify-center gap-1 ${
                type === 'income'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+ આવક</span>
            </button>

            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-xl font-extrabold text-xs transition-all border flex items-center justify-center gap-1 ${
                type === 'expense'
                  ? 'bg-rose-600 text-white border-rose-600 shadow'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>- ખર્ચ</span>
            </button>

            <button
              type="button"
              onClick={() => setType('purchase')}
              className={`py-2 rounded-xl font-extrabold text-xs transition-all border flex items-center justify-center gap-1 ${
                type === 'purchase'
                  ? 'bg-amber-600 text-white border-amber-600 shadow'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>🛒 ખરીદી</span>
            </button>
          </div>
        </div>

        {/* Overspent Warning Alert */}
        {overspentError && (
          <div className="bg-rose-100 border border-rose-300 p-3 rounded-2xl text-xs text-rose-900 font-bold flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{overspentError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Head & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ગ્રાન્ટ હેડ (Grant Head)</label>
              <select
                value={headId}
                onChange={e => setHeadId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              >
                {heads.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.headNameGuj} (₹{h.grantLimit.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">તારીખ (Date)</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
              />
            </div>
          </div>

          {/* Particular Description + Voice Button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">વિગત (Particular Description)</label>
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
              placeholder="દા.ત. શાળા કાર્યાલય સ્ટેશનરી અથવા પ્રિન્ટર ખરીદી..."
              value={particularGuj}
              onChange={e => setParticularGuj(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
            />
          </div>

          {/* Amount & Voucher No */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">રકમ (Amount ₹)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="14500"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">વાઉચર નંબર (Voucher No)</label>
              <input
                type="text"
                value={voucherNo}
                onChange={e => setVoucherNo(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Category & Payment Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">કેટેગરી (Category)</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as RojmelCategory)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat].guj}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ચુકવણી પદ્ધતિ (Payment Mode)</label>
              <select
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
              >
                {paymentModes.map(pm => (
                  <option key={pm} value={pm}>{PAYMENT_MODE_LABELS[pm].guj}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Bill Attachment Block */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 text-xs flex items-center justify-between">
              <span>બિલ / વાઉચર ઇમેજ અપલોડ (Bill Image Attachment)</span>
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
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-4 h-4 text-brand-600" />
                  <span>કેમેરા / ગેલેરીમાંથી અપલોડ</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <img src={billImageBase64} alt="Preview" className="w-10 h-10 object-cover rounded-lg" />
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

          {/* Auto-link Dead Stock Toggle */}
          {type === 'purchase' && (
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="autoLinkStock"
                checked={autoLinkDeadStock}
                onChange={e => setAutoLinkDeadStock(e.target.checked)}
                className="mt-1 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <label htmlFor="autoLinkStock" className="text-amber-950 font-bold text-xs cursor-pointer leading-snug">
                <div>[✓] ડેડ સ્ટોક રજિસ્ટરમાં આપોઆપ લિંક કરો (Auto-link to Dead Stock)</div>
              </label>
            </div>
          )}

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
              <span>{initialEntry ? 'અપડેટ કરો' : 'સેવ કરો'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
