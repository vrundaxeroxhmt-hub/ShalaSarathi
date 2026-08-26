import React from 'react';
import { 
  Edit3, 
  Trash2, 
  Copy, 
  CreditCard, 
  Printer, 
  Camera, 
  Clock 
} from 'lucide-react';
import { PayableItem, PAYABLE_STATUS_LABELS } from '@/types/payable';
import { formatGujaratiDate } from '@/lib/services/rojmelService';

interface Props {
  payables: PayableItem[];
  onEdit: (item: PayableItem) => void;
  onPayment: (item: PayableItem) => void;
  onDuplicate: (id: string) => void;
  onDelete: (item: PayableItem) => void;
  onPrintDocument: (item: PayableItem) => void;
}

export const PayableMobileCards: React.FC<Props> = ({
  payables,
  onEdit,
  onPayment,
  onDuplicate,
  onDelete,
  onPrintDocument
}) => {
  return (
    <div className="space-y-3 font-sans pb-24">
      {payables.map(p => {
        const statusInfo = PAYABLE_STATUS_LABELS[p.status] || PAYABLE_STATUS_LABELS.unpaid;

        return (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm active:scale-99 transition-all space-y-3"
          >
            {/* Top Row: Supplier & Status */}
            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
              <div>
                <span className="font-extrabold text-slate-900">{p.supplierNameGuj}</span>
                <div className="text-[10px] text-slate-400 font-mono">બિલ: {p.billNumber}</div>
              </div>

              <span className={`inline-block font-extrabold px-2.5 py-0.5 rounded-full text-[10px] border ${statusInfo.color}`}>
                {statusInfo.guj}
              </span>
            </div>

            {/* Middle Row: Particular & Financial Summary */}
            <div className="flex items-start justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-800 leading-snug">{p.particularGuj}</div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  ખરીદી: {formatGujaratiDate(p.purchaseDate)} | મુદત: {formatGujaratiDate(p.dueDate)}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-black text-rose-700">
                  બાકી: ₹{p.remainingAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400 font-bold">
                  કુલ: ₹{p.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Bill Attachment Badge if present */}
            {p.billImageBase64 && (
              <div className="bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-0.5 rounded-xl text-[10px] font-bold w-fit flex items-center gap-1">
                <Camera className="w-3 h-3 text-purple-600" />
                <span>✓ બિલ ઇમેજ જોડાયેલ</span>
              </div>
            )}

            {/* Touch Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              {p.remainingAmount > 0 && (
                <button
                  onClick={() => onPayment(p)}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-extrabold rounded-xl shadow flex items-center gap-1"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>+ ચુકવણી</span>
                </button>
              )}

              <button
                onClick={() => onPrintDocument(p)}
                className="px-2.5 py-1.5 bg-slate-100 active:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5 text-slate-700" />
                <span>પ્રિન્ટ</span>
              </button>

              <button
                onClick={() => onEdit(p)}
                className="px-2.5 py-1.5 bg-slate-100 active:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-600" />
                <span>સુધારો</span>
              </button>

              <button
                onClick={() => onDelete(p)}
                className="px-2.5 py-1.5 bg-rose-50 active:bg-rose-100 text-rose-700 font-bold rounded-xl flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>ડિલીટ</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
