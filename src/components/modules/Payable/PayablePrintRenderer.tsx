import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { PayableItem, PAYABLE_STATUS_LABELS, PAYABLE_PAYMENT_MODE_LABELS } from '@/types/payable';
import { TeacherProfile } from '@/types/user';
import { formatGujaratiDate } from '@/lib/services/rojmelService';

interface Props {
  payable: PayableItem;
  teacher: TeacherProfile;
  onClose: () => void;
}

export const PayablePrintRenderer: React.FC<Props> = ({
  payable,
  teacher,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const statusInfo = PAYABLE_STATUS_LABELS[payable.status] || PAYABLE_STATUS_LABELS.unpaid;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto font-sans space-y-6">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between no-print">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>પાછા (Back)</span>
        </button>

        <button
          onClick={handlePrint}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>સત્તાવાર ઉધારી પત્રક અને ચુકવણી હિસાબ પ્રિન્ટ કરો</span>
        </button>
      </div>

      {/* PAGE 1: DEDICATED A4 PRINT CONTAINER */}
      <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-2xl space-y-6 print-container font-sans text-slate-900">
        
        {/* Header Banner */}
        <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
          <div className="text-xs font-bold text-slate-600">ગુજરાત પ્રાથમિક શિક્ષણ વિભાગ - સત્તાવાર ઉધારી અને ચુકવણી રજિસ્ટર</div>
          <h1 className="text-2xl font-black">{teacher.school.schoolNameGuj}</h1>
          <div className="text-xs font-semibold text-slate-700">
            UDISE Code: {teacher.school.udiseCode} | શૈક્ષણિક વર્ષ: {payable.financialYear || teacher.academicYear}
          </div>
          <div className="inline-block bg-slate-900 text-white text-xs font-extrabold px-4 py-1 rounded-md mt-2">
            ઉધારી બિલ વિગત અને ચુકવણી ઇતિહાસ પત્રક (CREDIT PAYABLE STATEMENT)
          </div>
        </div>

        {/* Bill Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs font-bold border border-slate-900 p-4 rounded-xl">
          <div>
            <span className="text-slate-500">વેપારી / સપ્લાયર:</span>
            <div className="text-sm text-slate-900">{payable.supplierNameGuj}</div>
            <div className="text-[11px] font-mono text-slate-600">મોબાઈલ: {payable.supplierMobile || '-'}</div>
          </div>

          <div className="text-right">
            <span className="text-slate-500">બિલ નંબર:</span>
            <div className="text-sm font-mono font-black text-purple-700">{payable.billNumber}</div>
            <div className="text-[11px] text-slate-600">ગ્રાન્ટ હેડ: {payable.headNameGuj || 'General'}</div>
          </div>

          <div>
            <span className="text-slate-500">ખરીદી તારીખ:</span>
            <div className="text-slate-900">{formatGujaratiDate(payable.purchaseDate)}</div>
          </div>

          <div className="text-right">
            <span className="text-slate-500">ચુકવણી મુદત તારીખ (Due Date):</span>
            <div className="text-slate-900">{formatGujaratiDate(payable.dueDate)}</div>
          </div>
        </div>

        {/* Financial Totals Summary Box */}
        <div className="bg-slate-50 border border-slate-900 rounded-xl p-4 grid grid-cols-4 gap-3 text-xs text-center font-bold">
          <div>
            <span className="text-slate-500 text-[10px]">કુલ બિલ રકમ:</span>
            <div className="text-sm font-black text-slate-900">₹{payable.totalAmount.toLocaleString('en-IN')}</div>
          </div>

          <div>
            <span className="text-slate-500 text-[10px]">ચુકવેલ રકમ:</span>
            <div className="text-sm font-black text-emerald-700">₹{payable.paidAmount.toLocaleString('en-IN')}</div>
          </div>

          <div>
            <span className="text-slate-500 text-[10px]">કુલ બાકી રકમ:</span>
            <div className="text-sm font-black text-rose-700">₹{payable.remainingAmount.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-slate-900 text-white p-1 rounded-lg">
            <span className="text-slate-300 text-[10px]">વર્તમાન સ્થિતિ:</span>
            <div className="text-xs font-black text-amber-400 mt-0.5">{statusInfo.guj}</div>
          </div>
        </div>

        {/* Particular Item Description */}
        <div className="space-y-1 text-xs">
          <span className="font-bold text-slate-700">ખરીદી વિગત (Particular Description):</span>
          <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900">
            {payable.particularGuj} {payable.quantity ? `(જથ્થો: ${payable.quantity} ${payable.unit || ''})` : ''}
          </div>
        </div>

        {/* Complete Payment History Table */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-slate-900 text-xs">ચુકવણી ઇતિહાસ કોષ્ટક (Complete Payment History):</span>
          {payable.payments.length === 0 ? (
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-500 text-center font-semibold">
              હજુ કોઈ ચુકવણી થયેલ નથી (નિલ).
            </div>
          ) : (
            <table className="w-full text-left text-xs border border-slate-900 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-900 font-bold">
                  <th className="p-2 border-r border-slate-900">ચુકવણી તારીખ</th>
                  <th className="p-2 border-r border-slate-900">ચુકવણી મોડ</th>
                  <th className="p-2 border-r border-slate-900">રીફરન્સ નંબર</th>
                  <th className="p-2 border-r border-slate-900 text-right">ચુકવેલ રકમ (₹)</th>
                  <th className="p-2">નોંધ</th>
                </tr>
              </thead>
              <tbody>
                {payable.payments.map(p => (
                  <tr key={p.id} className="border-b border-slate-400 font-medium">
                    <td className="p-2 border-r border-slate-900 font-bold">{formatGujaratiDate(p.paymentDate)}</td>
                    <td className="p-2 border-r border-slate-900 font-semibold">{PAYABLE_PAYMENT_MODE_LABELS[p.paymentMode]?.guj || p.paymentMode}</td>
                    <td className="p-2 border-r border-slate-900 font-mono text-[11px]">{p.referenceNo || '-'}</td>
                    <td className="p-2 border-r border-slate-900 text-right font-black text-emerald-700">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-slate-700">{p.remarksGuj || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Signatures */}
        <div className="border-t-2 border-slate-900 pt-8 mt-12 flex justify-between text-xs font-bold text-slate-900">
          <div className="text-center space-y-6">
            <div>નાણાં ચૂકવનાર સહી</div>
            <div className="border-b border-slate-400 w-36"></div>
          </div>
          <div className="text-center space-y-6">
            <div>તપાસનાર શિક્ષક સહી</div>
            <div className="border-b border-slate-400 w-36"></div>
          </div>
          <div className="text-center space-y-6">
            <div>મુખ્ય શિક્ષક / આચાર્ય સહી અને સિક્કો</div>
            <div className="border-b border-slate-400 w-44"></div>
          </div>
        </div>
      </div>

      {/* PAGE 2+: Attached Bill Image (Rendered ONLY if present) */}
      {payable.billImageBase64 && (
        <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-2xl space-y-4 print-page-break font-sans">
          <div className="border-b border-slate-300 pb-2 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>ઉધારી બિલ ઓરિજિનલ પુરાવો (Original Bill Image)</span>
            <span>બિલ નં: {payable.billNumber}</span>
          </div>
          <div className="flex justify-center p-4 border border-slate-200 rounded-xl bg-slate-50">
            <img 
              src={payable.billImageBase64} 
              alt="Original Bill Image" 
              className="max-h-[600px] object-contain rounded-lg shadow-md" 
            />
          </div>
        </div>
      )}
    </div>
  );
};
