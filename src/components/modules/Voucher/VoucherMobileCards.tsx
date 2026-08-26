import React from 'react';
import { 
  Edit3, 
  Trash2, 
  Copy, 
  Printer, 
  Camera 
} from 'lucide-react';
import { Voucher, VOUCHER_TYPE_LABELS } from '@/types/voucher';
import { formatGujaratiDate } from '@/lib/services/rojmelService';

interface Props {
  vouchers: Voucher[];
  onEdit: (item: Voucher) => void;
  onDuplicate: (id: string) => void;
  onDelete: (item: Voucher) => void;
  onPrintDocument: (item: Voucher) => void;
}

export const VoucherMobileCards: React.FC<Props> = ({
  vouchers,
  onEdit,
  onDuplicate,
  onDelete,
  onPrintDocument
}) => {
  return (
    <div className="space-y-3 font-sans pb-24">
      {vouchers.map(v => {
        const typeInfo = VOUCHER_TYPE_LABELS[v.voucherType || 'expense'];

        return (
          <div
            key={v.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm active:scale-99 transition-all space-y-3"
          >
            {/* Top Row: Voucher No & Type */}
            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
              <span className="font-mono font-black text-purple-700 text-sm">{v.voucherNo}</span>
              <span className={`inline-block font-extrabold px-2.5 py-0.5 rounded-full text-[10px] border ${typeInfo.color}`}>
                {typeInfo.guj}
              </span>
            </div>

            {/* Middle Row: Payee, Particular & Amount */}
            <div className="flex items-start justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-sm">{v.payeeNameGuj}</div>
                <div className="font-semibold text-slate-800 leading-snug">{v.particularGuj}</div>
                <div className="text-[10px] text-slate-500 font-medium">
                  તારીખ: {formatGujaratiDate(v.date)} | હેડ: {v.grantTypeGuj || 'Composite'}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-base font-black text-slate-900">
                  ₹{v.amount.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-purple-700 font-bold">
                  {v.paymentMode}
                </div>
              </div>
            </div>

            {/* Attachment Badge */}
            {v.billImageBase64 && (
              <div className="bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-0.5 rounded-xl text-[10px] font-bold w-fit flex items-center gap-1">
                <Camera className="w-3 h-3 text-purple-600" />
                <span>✓ બિલ ઇમેજ બીડાણ (Page 2)</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => onPrintDocument(v)}
                className="px-3 py-1.5 bg-slate-900 text-white font-extrabold rounded-xl shadow flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>પ્રિન્ટ</span>
              </button>

              <button
                onClick={() => onEdit(v)}
                className="px-2.5 py-1.5 bg-slate-100 active:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                <span>સુધારો</span>
              </button>

              <button
                onClick={() => onDelete(v)}
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
