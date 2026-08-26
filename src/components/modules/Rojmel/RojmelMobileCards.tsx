import React from 'react';
import { 
  Edit3, 
  Trash2, 
  Copy, 
  Link as LinkIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShoppingCart,
  Receipt,
  Camera
} from 'lucide-react';
import { RojmelEntry, CATEGORY_LABELS, PAYMENT_MODE_LABELS } from '@/types/rojmel';
import { formatGujaratiDate } from '@/lib/services/rojmelService';

interface Props {
  entries: RojmelEntry[];
  onEdit: (entry: RojmelEntry) => void;
  onDuplicate: (id: string) => void;
  onDelete: (entry: RojmelEntry) => void;
  onCreateVoucher?: (entry: RojmelEntry) => void;
}

export const RojmelMobileCards: React.FC<Props> = ({
  entries,
  onEdit,
  onDuplicate,
  onDelete,
  onCreateVoucher
}) => {
  return (
    <div className="space-y-3 font-sans pb-24">
      {entries.map(e => {
        const isIncome = e.type === 'income';
        const isPurchase = e.type === 'purchase';

        return (
          <div
            key={e.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm active:scale-99 transition-all space-y-3"
          >
            {/* Top Row: Date & Type Badge */}
            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-500">{formatGujaratiDate(e.date)}</span>

              {isIncome && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full text-[10px]">
                  <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                  <span>આવક (Income)</span>
                </span>
              )}
              {e.type === 'expense' && (
                <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 font-extrabold px-2.5 py-0.5 rounded-full text-[10px]">
                  <ArrowDownRight className="w-3 h-3 text-rose-600" />
                  <span>ખર્ચ (Expense)</span>
                </span>
              )}
              {isPurchase && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full text-[10px]">
                  <ShoppingCart className="w-3 h-3 text-amber-600" />
                  <span>ખરીદી (Purchase)</span>
                </span>
              )}
            </div>

            {/* Middle Row: Particular & Amount */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="font-bold text-brand-700 text-[11px] truncate max-w-[200px]">
                  {e.headNameGuj || e.category}
                </div>
                <div className="font-extrabold text-slate-900 text-sm leading-snug">
                  {e.particularGuj}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  ચુકવણી: {PAYMENT_MODE_LABELS[e.paymentMode]?.guj || e.paymentMode}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className={`text-base font-black ${
                  isIncome ? 'text-emerald-600' : isPurchase ? 'text-amber-700' : 'text-slate-900'
                }`}>
                  {isIncome ? '+' : '-'}₹{e.amount.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                  બાકી: ₹{e.balanceAfter.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Dead Stock & Bill Attachment Pills */}
            <div className="flex flex-wrap gap-2 text-[10px] font-extrabold">
              {e.isDeadStockLinked && (
                <div className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-xl flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-amber-600" />
                  <span>✓ Dead Stock Linked</span>
                </div>
              )}
              {e.billImageBase64 && (
                <div className="bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-0.5 rounded-xl flex items-center gap-1">
                  <Camera className="w-3 h-3 text-purple-600" />
                  <span>✓ બિલ ઇમેજ જોડાયેલ</span>
                </div>
              )}
            </div>

            {/* Touch Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              {onCreateVoucher && !isIncome && (
                <button
                  onClick={() => onCreateVoucher(e)}
                  className="px-2.5 py-1.5 bg-purple-50 active:bg-purple-100 text-purple-700 font-bold rounded-xl flex items-center gap-1"
                >
                  <Receipt className="w-3.5 h-3.5 text-purple-600" />
                  <span>વાઉચર</span>
                </button>
              )}

              <button
                onClick={() => onDuplicate(e.id)}
                className="px-2.5 py-1.5 bg-slate-100 active:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5 text-purple-600" />
                <span>કોપી</span>
              </button>

              <button
                onClick={() => onEdit(e)}
                className="px-2.5 py-1.5 bg-slate-100 active:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-600" />
                <span>સુધારો</span>
              </button>

              <button
                onClick={() => onDelete(e)}
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
