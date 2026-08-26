import React, { useState, useRef } from 'react';
import { 
  X, 
  Check, 
  CreditCard, 
  Camera, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react';
import { PayableItem, PayablePaymentMode, PAYABLE_PAYMENT_MODE_LABELS } from '@/types/payable';
import { validatePaymentAmount } from '@/lib/services/payableService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payable: PayableItem;
  onSubmitPayment: (
    payableId: string, 
    paymentData: {
      paymentDate: string;
      amount: number;
      paymentMode: PayablePaymentMode;
      referenceNo?: string;
      remarksGuj?: string;
      paymentProofBase64?: string;
    }
  ) => Promise<void>;
  isMobile?: boolean;
}

export const PayablePaymentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  payable,
  onSubmitPayment,
  isMobile = false
}) => {
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState(String(payable.remainingAmount));
  const [paymentMode, setPaymentMode] = useState<PayablePaymentMode>('Bank');
  const [referenceNo, setReferenceNo] = useState('');
  const [remarksGuj, setRemarksGuj] = useState('');
  const [paymentProofBase64, setPaymentProofBase64] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProofSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setPaymentProofBase64(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const numAmount = parseFloat(amount);
    const validRes = validatePaymentAmount(payable.remainingAmount, numAmount);
    if (!validRes.valid) {
      setErrorMsg(validRes.errorMsgGuj || 'અમાન્ય ચુકવણી રકમ.');
      return;
    }

    await onSubmitPayment(payable.id, {
      paymentDate,
      amount: numAmount,
      paymentMode,
      referenceNo: referenceNo || undefined,
      remarksGuj: remarksGuj || undefined,
      paymentProofBase64
    });

    onClose();
  };

  const modes: PayablePaymentMode[] = ['Cash', 'Bank', 'UPI', 'Cheque', 'Other'];

  return (
    <div className={`fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex ${
      isMobile ? 'items-end' : 'items-center justify-center p-4'
    }`}>
      <div className={`bg-white w-full shadow-2xl border border-slate-200 font-sans ${
        isMobile 
          ? 'rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200' 
          : 'rounded-3xl max-w-lg p-6 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">+ ચુકવણી નોંધાવો (Record Payment)</h3>
              <p className="text-[10px] text-slate-400">{payable.supplierNameGuj} - બિલ: {payable.billNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rojmel Isolation Warning Banner */}
        <div className="bg-amber-50 border border-amber-300 p-3 rounded-2xl text-amber-950 text-xs font-bold space-y-1">
          <div className="flex items-start gap-1.5">
            <span className="text-amber-600 text-sm">⚠️</span>
            <div>
              <div className="font-extrabold text-slate-900">આ ચુકવણીની Entry Rojmelમાં નહીં જાય.</div>
              <div className="text-[11px] font-medium text-amber-900">Rojmelમાં Entry કરવી હોય તો Rojmel → જાવક/ચુકવણીમાંથી Entry કરો.</div>
            </div>
          </div>
        </div>

        {/* Current Payable Summary Highlight */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl grid grid-cols-3 gap-2 text-center text-xs font-bold shadow">
          <div>
            <span className="text-slate-400 text-[10px]">કુલ બિલ રકમ:</span>
            <div className="text-sm">₹{payable.totalAmount.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px]">ચુકવેલ રકમ:</span>
            <div className="text-emerald-400 text-sm">₹{payable.paidAmount.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-amber-500/20 text-amber-300 p-1 rounded-xl border border-amber-500/40">
            <span className="text-amber-200 text-[10px]">બાકી રકમ:</span>
            <div className="text-sm font-black">₹{payable.remainingAmount.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Error Warning Alert */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-900 font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ચુકવણી તારીખ (Payment Date)</label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ચુકવણી રકમ (Amount ₹)</label>
              <input
                type="number"
                required
                min="1"
                max={payable.remainingAmount}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-slate-900 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ચુકવણી મોડ (Payment Mode)</label>
              <select
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value as PayablePaymentMode)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
              >
                {modes.map(m => (
                  <option key={m} value={m}>{PAYABLE_PAYMENT_MODE_LABELS[m].guj}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ચેક / UPI રીફરન્સ નંબર</label>
              <input
                type="text"
                placeholder="UPI-88901 / Cheque-001"
                value={referenceNo}
                onChange={e => setReferenceNo(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">ચુકવણી નોંધ (Payment Remarks)</label>
            <input
              type="text"
              placeholder="દા.ત. બેંક NEFT ટ્રાન્સફર અથવા રોકડ ચુકવણી..."
              value={remarksGuj}
              onChange={e => setRemarksGuj(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
            />
          </div>

          {/* Payment Proof Attachment */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 text-xs flex items-center justify-between">
              <span>ચુકવણી આધાર રસીદ (Payment Receipt Image - Optional)</span>
              {paymentProofBase64 && <span className="text-emerald-600 font-bold">✓ અપલોડ થયેલ</span>}
            </span>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleProofSelect}
              className="hidden"
            />

            {!paymentProofBase64 ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>ચુકવણી રસીદ અપલોડ કરો</span>
              </button>
            ) : (
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                <img src={paymentProofBase64} alt="Proof Preview" className="w-10 h-10 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setPaymentProofBase64(undefined)}
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
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              <span>ચુકવણી નોંધાવો (Record Payment)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
