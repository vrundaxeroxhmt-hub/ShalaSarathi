import React from 'react';
import { 
  Edit3, 
  Trash2, 
  Copy, 
  CreditCard, 
  Printer, 
  Camera, 
  AlertCircle, 
  CheckCircle2, 
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

export const PayableWebLedger: React.FC<Props> = ({
  payables,
  onEdit,
  onPayment,
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
              <th className="py-3.5 px-4">ખરીદી તારીખ</th>
              <th className="py-3.5 px-4">મુદત (Due Date)</th>
              <th className="py-3.5 px-4">વેપારી (Supplier)</th>
              <th className="py-3.5 px-4">બિલ નં</th>
              <th className="py-3.5 px-4">વિગત (Particulars)</th>
              <th className="py-3.5 px-4 text-right">કુલ રકમ (Total ₹)</th>
              <th className="py-3.5 px-4 text-right">ચુકવેલ (Paid ₹)</th>
              <th className="py-3.5 px-4 text-right">બાકી રકમ (Balance ₹)</th>
              <th className="py-3.5 px-4 text-center">સ્થિતિ (Status)</th>
              <th className="py-3.5 px-4 text-center">એક્શન (Actions)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 font-medium">
            {payables.map(p => {
              const statusInfo = PAYABLE_STATUS_LABELS[p.status] || PAYABLE_STATUS_LABELS.unpaid;

              return (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Purchase Date */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {formatGujaratiDate(p.purchaseDate)}
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4 font-bold whitespace-nowrap text-slate-600">
                    {formatGujaratiDate(p.dueDate)}
                  </td>

                  {/* Supplier */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{p.supplierNameGuj}</div>
                    {p.supplierMobile && (
                      <div className="text-[10px] text-slate-400 font-mono">{p.supplierMobile}</div>
                    )}
                  </td>

                  {/* Bill Number */}
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-700 whitespace-nowrap">
                    {p.billNumber}
                  </td>

                  {/* Particulars & Head */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 leading-snug">{p.particularGuj}</div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      ગ્રાન્ટ: {p.headNameGuj || 'General'}
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 text-sm whitespace-nowrap">
                    ₹{p.totalAmount.toLocaleString('en-IN')}
                  </td>

                  {/* Paid Amount */}
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-600 text-sm whitespace-nowrap">
                    ₹{p.paidAmount.toLocaleString('en-IN')}
                  </td>

                  {/* Remaining Amount */}
                  <td className="py-3.5 px-4 text-right font-black text-rose-700 text-sm whitespace-nowrap bg-rose-50/30">
                    ₹{p.remainingAmount.toLocaleString('en-IN')}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className={`inline-block font-extrabold px-2.5 py-1 rounded-full text-[10px] border ${statusInfo.color}`}>
                      {statusInfo.guj}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {p.remainingAmount > 0 && (
                        <button
                          onClick={() => onPayment(p)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg shadow flex items-center gap-1"
                          title="ચુકવણી (Record Payment)"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>+ ચુકવણી</span>
                        </button>
                      )}

                      <button
                        onClick={() => onPrintDocument(p)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="સ્ટેટમેન્ટ પ્રિન્ટ કરો (Print Statement)"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onEdit(p)}
                        className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="સુધારો (Edit)"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDuplicate(p.id)}
                        className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="નકલ બનાવો (Duplicate)"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDelete(p)}
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
