import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Check, 
  Camera, 
  Trash2, 
  Mic, 
  MicOff, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { Voucher, VoucherType, VoucherPaymentMode, VOUCHER_TYPE_LABELS, VOUCHER_PAYMENT_MODE_LABELS } from '@/types/voucher';
import { HeadItem } from '@/types/rojmel';
import { TeacherProfile } from '@/types/user';
import { useGujaratiVoice } from '@/hooks/useGujaratiVoice';
import { generateNextVoucherNumber, convertAmountToGujaratiWords } from '@/lib/services/voucherService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Voucher, 'id' | 'createdAt'>) => Promise<void>;
  existingVouchers: Voucher[];
  heads: HeadItem[];
  teacher: TeacherProfile;
  initialVoucher?: Voucher | null;
  autoFillSource?: {
    payeeNameGuj?: string;
    particularGuj?: string;
    amount?: number;
    headNameGuj?: string;
    paymentMode?: VoucherPaymentMode;
    billNumber?: string;
    remarksGuj?: string;
    billImageBase64?: string;
    sourceRojmelEntryId?: string;
    sourcePayableId?: string;
  } | null;
  isMobile?: boolean;
}

export const VoucherFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  existingVouchers,
  heads,
  teacher,
  initialVoucher = null,
  autoFillSource = null,
  isMobile = false
}) => {
  const [voucherNo, setVoucherNo] = useState('');
  const [voucherType, setVoucherType] = useState<VoucherType>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Profile auto-fill fields
  const [schoolNameGuj, setSchoolNameGuj] = useState(teacher.school.schoolNameGuj);
  const [udiseCode, setUdiseCode] = useState(teacher.school.udiseCode);
  const [academicYear, setAcademicYear] = useState(teacher.academicYear || '2026-27');

  // Payee & Payment fields
  const [payeeNameGuj, setPayeeNameGuj] = useState('');
  const [payeeMobile, setPayeeMobile] = useState('');
  const [particularGuj, setParticularGuj] = useState('');
  const [amount, setAmount] = useState('');
  const [amountInWordsGuj, setAmountInWordsGuj] = useState('');
  const [headId, setHeadId] = useState(heads[0]?.id || '');
  const [grantTypeGuj, setGrantTypeGuj] = useState(heads[0]?.headNameGuj || 'Composite School Grant');
  const [paymentMode, setPaymentMode] = useState<VoucherPaymentMode>('Bank');
  const [billNumber, setBillNumber] = useState('');
  const [remarksGuj, setRemarksGuj] = useState('');

  // Bill Image attachment state
  const [billImageBase64, setBillImageBase64] = useState<string | undefined>(undefined);
  const [billFileName, setBillFileName] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeVoiceField, setActiveVoiceField] = useState<'particular' | 'remarks' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialVoucher) {
      setVoucherNo(initialVoucher.voucherNo);
      setVoucherType(initialVoucher.voucherType || 'expense');
      setDate(initialVoucher.date);
      setSchoolNameGuj(initialVoucher.schoolNameGuj || teacher.school.schoolNameGuj);
      setUdiseCode(initialVoucher.udiseCode || teacher.school.udiseCode);
      setAcademicYear(initialVoucher.academicYear || teacher.academicYear);
      setPayeeNameGuj(initialVoucher.payeeNameGuj);
      setPayeeMobile(initialVoucher.payeeMobile || '');
      setParticularGuj(initialVoucher.particularGuj);
      setAmount(String(initialVoucher.amount));
      setAmountInWordsGuj(initialVoucher.amountInWordsGuj);
      setHeadId(initialVoucher.headId || (heads[0]?.id || ''));
      setGrantTypeGuj(initialVoucher.grantTypeGuj || (heads[0]?.headNameGuj || 'Composite School Grant'));
      setPaymentMode(initialVoucher.paymentMode || 'Bank');
      setBillNumber(initialVoucher.billNumber || '');
      setRemarksGuj(initialVoucher.remarksGuj || '');
      setBillImageBase64(initialVoucher.billImageBase64);
      setBillFileName(initialVoucher.billFileName);
    } else {
      const autoNo = generateNextVoucherNumber(existingVouchers, teacher.academicYear);
      setVoucherNo(autoNo);
      setVoucherType('expense');
      setDate(new Date().toISOString().split('T')[0]);
      setSchoolNameGuj(teacher.school.schoolNameGuj);
      setUdiseCode(teacher.school.udiseCode);
      setAcademicYear(teacher.academicYear || '2026-27');
      
      if (autoFillSource) {
        setPayeeNameGuj(autoFillSource.payeeNameGuj || '');
        setParticularGuj(autoFillSource.particularGuj || '');
        setAmount(autoFillSource.amount ? String(autoFillSource.amount) : '');
        if (autoFillSource.amount) {
          setAmountInWordsGuj(convertAmountToGujaratiWords(autoFillSource.amount));
        }
        setGrantTypeGuj(autoFillSource.headNameGuj || (heads[0]?.headNameGuj || 'Composite School Grant'));
        setPaymentMode(autoFillSource.paymentMode || 'Bank');
        setBillNumber(autoFillSource.billNumber || '');
        setRemarksGuj(autoFillSource.remarksGuj || '');
        setBillImageBase64(autoFillSource.billImageBase64);
      } else {
        setPayeeNameGuj('');
        setPayeeMobile('');
        setParticularGuj('');
        setAmount('');
        setAmountInWordsGuj('');
        setHeadId(heads[0]?.id || '');
        setGrantTypeGuj(heads[0]?.headNameGuj || 'Composite School Grant');
        setPaymentMode('Bank');
        setBillNumber('');
        setRemarksGuj('');
        setBillImageBase64(undefined);
        setBillFileName(undefined);
      }
    }
  }, [initialVoucher, autoFillSource, isOpen, existingVouchers, teacher, heads]);

  // Auto convert amount to Gujarati words when amount changes
  const handleAmountChange = (val: string) => {
    setAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setAmountInWordsGuj(convertAmountToGujaratiWords(num));
    } else {
      setAmountInWordsGuj('');
    }
  };

  // Sync grantTypeGuj when headId changes
  const handleHeadSelect = (hId: string) => {
    setHeadId(hId);
    const h = heads.find(item => item.id === hId);
    if (h) {
      setGrantTypeGuj(h.headNameGuj);
    }
  };

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

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('કૃપા કરીને રકમ > 0 દાખલ કરો.');
      return;
    }

    if (!payeeNameGuj || !particularGuj) {
      setErrorMsg('કૃપા કરીને નાણાં મેળવનારનું નામ અને ખરીદી વિગત દાખલ કરો.');
      return;
    }

    await onSubmit({
      voucherNo,
      voucherType,
      date,
      schoolNameGuj,
      udiseCode,
      academicYear,
      payeeNameGuj,
      payeeMobile: payeeMobile || undefined,
      particularGuj,
      amount: numAmount,
      amountInWordsGuj: amountInWordsGuj || convertAmountToGujaratiWords(numAmount),
      headId: headId || undefined,
      grantTypeGuj,
      paymentMode,
      billNumber: billNumber || undefined,
      remarksGuj: remarksGuj || undefined,
      billImageBase64,
      billFileName,
      sourceRojmelEntryId: autoFillSource?.sourceRojmelEntryId || initialVoucher?.sourceRojmelEntryId,
      sourcePayableId: autoFillSource?.sourcePayableId || initialVoucher?.sourcePayableId
    });

    onClose();
  };

  const types: VoucherType[] = ['expense', 'purchase', 'other_payment', 'receipt'];
  const modes: VoucherPaymentMode[] = ['Cash', 'Bank', 'UPI', 'Cheque', 'Other'];

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
              {initialVoucher ? 'સત્તાવાર વાઉચર સુધારો (Edit Voucher)' : '+ નવું સત્તાવાર વાઉચર જનરેટ (New Voucher)'}
            </h3>
            <p className="text-[10px] text-slate-400">સ્કૂલ ચુકવણી અને ખર્ચ પાવતી સ્લિપ</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rojmel Isolation Warning Banner */}
        <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl text-purple-950 text-xs font-semibold space-y-0.5">
          <div className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            <span>માત્ર સત્તાવાર પ્રિન્ટેબલ વાઉચર દસ્તાવેજ</span>
          </div>
          <p className="text-[11px] text-purple-900">
            ⚠️ વાઉચર બનાવવાથી Rojmelમાં કોઈ automatic entry થતી નથી. Rojmel હિસાબ માટે Rojmel મોડ્યુલનો ઉપયોગ કરવો.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-900 font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs font-sans">
          {/* Voucher Type & Auto Voucher Number */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">વાઉચર પ્રકાર (Voucher Type)</label>
              <select
                value={voucherType}
                onChange={e => setVoucherType(e.target.value as VoucherType)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              >
                {types.map(t => (
                  <option key={t} value={t}>{VOUCHER_TYPE_LABELS[t].guj}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">વાઉચર નંબર (Voucher No)</label>
              <input
                type="text"
                required
                value={voucherNo}
                onChange={e => setVoucherNo(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-black text-purple-700"
              />
            </div>
          </div>

          {/* Date & Payee Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">વાઉચર તારીખ (Date)</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">નાણાં મેળવનાર (Payee / Supplier)</label>
              <input
                type="text"
                required
                placeholder="દા.ત. શ્રી રામદેવ સ્ટેશનરી એન્ડ પ્રિન્ટર્સ"
                value={payeeNameGuj}
                onChange={e => setPayeeNameGuj(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Particular & Voice Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">ચુકવણીની વિગત (Particular Description)</label>
              <button
                type="button"
                onClick={() => handleVoiceToggle('particular')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                  isListening && activeVoiceField === 'particular'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}
              >
                {isListening && activeVoiceField === 'particular' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                <span>🎤 બોલો</span>
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="દા.ત. શાળા કાર્યાલય માટે એચ.પી. પ્રિન્ટર ખરીદી અથવા દૈનિક સ્ટેશનરી ચુકવણી..."
              value={particularGuj}
              onChange={e => setParticularGuj(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
            />
          </div>

          {/* Amount & Amount in Words */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">કુલ રકમ (Amount ₹)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="14500"
                value={amount}
                onChange={e => handleAmountChange(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ગ્રાન્ટ / બજેટ હેડ</label>
              <select
                value={headId}
                onChange={e => handleHeadSelect(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              >
                {heads.map(h => (
                  <option key={h.id} value={h.id}>{h.headNameGuj}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">રકમ અક્ષરે (Amount in Gujarati Words)</label>
            <input
              type="text"
              value={amountInWordsGuj}
              onChange={e => setAmountInWordsGuj(e.target.value)}
              placeholder="અક્ષરે રૂપિયા ચૌદ હજાર પાંચસો પુરા"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
            />
          </div>

          {/* Payment Mode & Bill Number */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ચુકવણી મોડ (Payment Mode)</label>
              <select
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value as VoucherPaymentMode)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
              >
                {modes.map(m => (
                  <option key={m} value={m}>{VOUCHER_PAYMENT_MODE_LABELS[m].guj}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">બિલ નંબર (Bill No - Optional)</label>
              <input
                type="text"
                placeholder="HP-88902"
                value={billNumber}
                onChange={e => setBillNumber(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">વિશેષ નોંધ (Remarks)</label>
            <input
              type="text"
              placeholder="દા.ત. શાળા કમ્પ્યુટર પ્રિન્ટર સાધન સાહિત્ય."
              value={remarksGuj}
              onChange={e => setRemarksGuj(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
            />
          </div>

          {/* Bill / Receipt Image Attachment */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 text-xs flex items-center justify-between">
              <span>ઓરિજિનલ બિલ / પાવતી ઈમેજ (Bill Image Attachment)</span>
              {billImageBase64 && <span className="text-purple-600 font-bold">✓ ઈમેજ જોડાયેલ (Page 2)</span>}
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
                <Camera className="w-4 h-4 text-purple-600" />
                <span>કેમેરા / ગેલેરીમાંથી બિલ ઈમેજ અપલોડ કરો</span>
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
                  className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg font-bold"
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
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              <span>{initialVoucher ? 'અપડેટ કરો' : 'વાઉચર જનરેટ કરો'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
