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

export const RojmelWebLedger: React.FC<Props> = ({
  entries,
  onEdit,
  onDuplicate,
  onDelete,
  onCreateVoucher
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 font-bold uppercase sticky top-0 z-10">
            <tr>
              <th className="py-3.5 px-4">તારીખ (Date)</th>
              <th className="py-3.5 px-4 text-center">પ્રકાર (Type)</th>
              <th className="py-3.5 px-4">ગ્રાન્ટ / હેડ</th>
              <th className="py-3.5 px-4">વિગત (Particular)</th>
              <th className="py-3.5 px-4 text-right">આવક (Income ₹)</th>
              <th className="py-3.5 px-4 text-right">ખર્ચ/ખરીદી (Expense ₹)</th>
              <th className="py-3.5 px-4 text-right">સિલિક (Balance ₹)</th>
              <th className="py-3.5 px-4 text-center">ડેડ સ્ટોક / બિલ</th>
              <th className="py-3.5 px-4 text-center">કાર્યો (Actions)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 font-medium">
            {entries.map(e => {
              const isIncome = e.type === 'income';
              const isPurchase = e.type === 'purchase';

              return (
                <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Date */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {formatGujaratiDate(e.date)}
                  </td>

                  {/* Type Badge */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {isIncome && (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full text-[10px]">
                        <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                        <span>આવક</span>
                      </span>
                    )}
                    {e.type === 'expense' && (
                      <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 font-extrabold px-2.5 py-0.5 rounded-full text-[10px]">
                        <ArrowDownRight className="w-3 h-3 text-rose-600" />
                        <span>ખર્ચ</span>
                      </span>
                    )}
                    {isPurchase && (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full text-[10px]">
                        <ShoppingCart className="w-3 h-3 text-amber-600" />
                        <span>ખરીદી</span>
                      </span>
                    )}
                  </td>

                  {/* Head Name */}
                  <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                    {e.headNameGuj || e.category}
                  </td>

                  {/* Particular Description */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 leading-snug">{e.particularGuj}</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>ચુકવણી: {PAYMENT_MODE_LABELS[e.paymentMode]?.guj || e.paymentMode}</span>
                      {e.voucherNo && <span>• વાઉચર: {e.voucherNo}</span>}
                    </div>
                  </td>

                  {/* Income Amount */}
                  <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600 text-sm whitespace-nowrap">
                    {isIncome ? `+₹${e.amount.toLocaleString('en-IN')}` : '-'}
                  </td>

                  {/* Expense / Purchase Amount */}
                  <td className={`py-3.5 px-4 text-right font-extrabold text-sm whitespace-nowrap ${
                    isPurchase ? 'text-amber-700' : 'text-slate-900'
                  }`}>
                    {!isIncome ? `-₹${e.amount.toLocaleString('en-IN')}` : '-'}
                  </td>

                  {/* Running Balance */}
                  <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm whitespace-nowrap bg-slate-50/50">
                    ₹{e.balanceAfter.toLocaleString('en-IN')}
                  </td>

                  {/* Dead Stock & Bill Attachment Badges */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center gap-1">
                      {e.isDeadStockLinked && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
                          <LinkIcon className="w-3 h-3 text-amber-600" />
                          <span>Dead Stock</span>
                        </span>
                      )}
                      {e.billImageBase64 && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-purple-50 text-purple-800 font-extrabold px-2 py-0.5 rounded-full border border-purple-200">
                          <Camera className="w-3 h-3 text-purple-600" />
                          <span>બિલ જોડેલ</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {onCreateVoucher && !isIncome && (
                        <button
                          onClick={() => onCreateVoucher(e)}
                          className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold border border-purple-200 rounded-lg text-[10px] flex items-center gap-1"
                          title="આ એન્ટ્રી પરથી વાઉચર જનરેટ કરો"
                        >
                          <Receipt className="w-3 h-3 text-purple-600" />
                          <span>🧾 વાઉચર</span>
                        </button>
                      )}

                      <button
                        onClick={() => onEdit(e)}
                        className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="સુધારો (Edit)"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDuplicate(e.id)}
                        className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="નકલ બનાવો (Duplicate)"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDelete(e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="ડિલીટ (Delete)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
