import React from 'react';
import { 
  Edit3, 
  Trash2, 
  Copy, 
  Printer, 
  Camera, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { Voucher, VOUCHER_TYPE_LABELS, VOUCHER_PAYMENT_MODE_LABELS } from '@/types/voucher';
import { formatGujaratiDate } from '@/lib/services/rojmelService';

interface Props {
  vouchers: Voucher[];
  onEdit: (item: Voucher) => void;
  onDuplicate: (id: string) => void;
  onDelete: (item: Voucher) => void;
  onPrintDocument: (item: Voucher) => void;
}

export const VoucherWebLedger: React.FC<Props> = ({
  vouchers,
  onEdit,
  onDuplicate,
  onDelete,
  onPrintDocument
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 font-bold uppercase sticky top-0 z-10">
            <tr>
              <th className="py-3.5 px-4">વાઉચર નં</th>
              <th className="py-3.5 px-4">તારીખ</th>
              <th className="py-3.5 px-4">પ્રકાર</th>
              <th className="py-3.5 px-4">નાણાં મેળવનાર (Payee)</th>
              <th className="py-3.5 px-4">વિગત (Particulars)</th>
              <th className="py-3.5 px-4">ગ્રાન્ટ હેડ</th>
              <th className="py-3.5 px-4 text-right">રકમ (Amount ₹)</th>
              <th className="py-3.5 px-4 text-center">મોડ (Mode)</th>
              <th className="py-3.5 px-4 text-center">બીડાણ</th>
              <th className="py-3.5 px-4 text-center">એક્શન (Actions)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 font-medium">
            {vouchers.map(v => {
              const typeInfo = VOUCHER_TYPE_LABELS[v.voucherType || 'expense'];

              return (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Voucher Number */}
                  <td className="py-3.5 px-4 font-mono font-black text-purple-700 whitespace-nowrap">
                    {v.voucherNo}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {formatGujaratiDate(v.date)}
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-block font-extrabold px-2.5 py-1 rounded-full text-[10px] border ${typeInfo.color}`}>
                      {typeInfo.guj}
                    </span>
                  </td>

                  {/* Payee Name */}
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {v.payeeNameGuj}
                    {v.payeeMobile && (
                      <div className="text-[10px] text-slate-400 font-mono">{v.payeeMobile}</div>
                    )}
                  </td>

                  {/* Particulars */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 leading-snug">{v.particularGuj}</div>
                    {v.billNumber && (
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">બિલ નં: {v.billNumber}</div>
                    )}
                  </td>

                  {/* Head */}
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {v.grantTypeGuj || 'Composite Grant'}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm whitespace-nowrap">
                    ₹{v.amount.toLocaleString('en-IN')}
                  </td>

                  {/* Mode */}
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700 whitespace-nowrap">
                    {VOUCHER_PAYMENT_MODE_LABELS[v.paymentMode]?.guj || v.paymentMode}
                  </td>

                  {/* Attachment Indicator */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {v.billImageBase64 ? (
                      <span className="text-purple-600 font-bold bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        <span>ઇમેજ</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">-</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onPrintDocument(v)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] rounded-lg shadow flex items-center gap-1"
                        title="વાઉચર પ્રિન્ટ કરો"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>પ્રિન્ટ</span>
                      </button>

                      <button
                        onClick={() => onEdit(v)}
                        className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="સુધારો (Edit)"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDuplicate(v.id)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="નકલ બનાવો (Duplicate)"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDelete(v)}
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
