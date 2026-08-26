import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { Voucher, VOUCHER_TYPE_LABELS, VOUCHER_PAYMENT_MODE_LABELS } from '@/types/voucher';
import { TeacherProfile } from '@/types/user';
import { formatGujaratiDate } from '@/lib/services/rojmelService';

interface Props {
  voucher: Voucher;
  teacher: TeacherProfile;
  onClose: () => void;
}

export const VoucherPrintRenderer: React.FC<Props> = ({
  voucher,
  teacher,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const typeInfo = VOUCHER_TYPE_LABELS[voucher.voucherType || 'expense'];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto font-sans space-y-6">
      {/* Action Bar (Hidden on Print) */}
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
          <span>સત્તાવાર A4 વાઉચર પ્રિન્ટ કરો</span>
        </button>
      </div>

      {/* PAGE 1: DEDICATED A4 PRINT CONTAINER */}
      <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-2xl space-y-6 print-container font-sans text-slate-900">
        
        {/* Top Header Banner */}
        <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
          <div className="text-xs font-bold text-slate-600">ગુજરાત સરકાર - પ્રાથમિક શિક્ષણ વિભાગ સત્તાવાર ચુકવણી વાઉચર</div>
          <h1 className="text-2xl font-black">{voucher.schoolNameGuj || teacher.school.schoolNameGuj}</h1>
          <div className="text-xs font-semibold text-slate-700">
            UDISE Code: {voucher.udiseCode || teacher.school.udiseCode} | શૈક્ષણિક વર્ષ: {voucher.academicYear || teacher.academicYear}
          </div>
          <div className="inline-block bg-slate-900 text-white text-xs font-extrabold px-5 py-1 rounded-md mt-2">
            {typeInfo?.guj ? typeInfo.guj.toUpperCase() : 'PAYMENT VOUCHER / ચુકવણી વાઉચર'}
          </div>
        </div>

        {/* Voucher Metadata Bar */}
        <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-900 text-xs font-bold">
          <div>
            <span className="text-slate-500">વાઉચર ક્રમાંક: </span>
            <span className="font-mono text-purple-800 font-black text-sm">{voucher.voucherNo}</span>
          </div>

          <div>
            <span className="text-slate-500">વાઉચર તારીખ: </span>
            <span className="text-slate-900 font-bold">{formatGujaratiDate(voucher.date)}</span>
          </div>

          <div>
            <span className="text-slate-500">ગ્રાન્ટ / બજેટ હેડ: </span>
            <span className="text-purple-900 font-bold">{voucher.grantTypeGuj || 'Composite School Grant'}</span>
          </div>
        </div>

        {/* Particulars & Financial Details Grid */}
        <div className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-4 gap-2 border-b border-slate-300 pb-3">
            <span className="font-bold text-slate-600">નાણાં મેળવનારનું નામ (Payee):</span>
            <span className="col-span-3 font-bold text-slate-900 text-sm">{voucher.payeeNameGuj}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 border-b border-slate-300 pb-3">
            <span className="font-bold text-slate-600">ચુકવણીની વિગત (Particulars):</span>
            <span className="col-span-3 font-bold text-slate-900 leading-relaxed">{voucher.particularGuj}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 border-b border-slate-300 pb-3">
            <span className="font-bold text-slate-600">ચુકવણી મોડ (Payment Mode):</span>
            <span className="col-span-3 font-semibold text-slate-900">
              {VOUCHER_PAYMENT_MODE_LABELS[voucher.paymentMode]?.guj || voucher.paymentMode}
              {voucher.billNumber ? ` (બિલ નં: ${voucher.billNumber})` : ''}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 border-b border-slate-300 pb-3">
            <span className="font-bold text-slate-600">કુલ ચુકવેલ રકમ (Amount ₹):</span>
            <span className="col-span-3 font-black text-slate-900 text-base">
              ₹{voucher.amount.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-600 ml-3">({voucher.amountInWordsGuj})</span>
            </span>
          </div>

          {voucher.remarksGuj && (
            <div className="grid grid-cols-4 gap-2 border-b border-slate-300 pb-3">
              <span className="font-bold text-slate-600">વિશેષ નોંધ (Remarks):</span>
              <span className="col-span-3 font-medium text-slate-800">{voucher.remarksGuj}</span>
            </div>
          )}
        </div>

        {/* Official Signatures Grid */}
        <div className="border-t-2 border-slate-900 pt-8 mt-12 flex justify-between text-xs font-bold text-slate-900">
          <div className="text-center space-y-6">
            <div>તૈયાર કરનાર શિક્ષક સહી</div>
            <div className="border-b border-slate-400 w-36"></div>
          </div>

          <div className="text-center space-y-6">
            <div>તપાસનાર શિક્ષક સહી</div>
            <div className="border-b border-slate-400 w-36"></div>
          </div>

          <div className="text-center space-y-6">
            <div>મંજૂર કરનાર આચાર્ય સહી & સિક્કો</div>
            <div className="border-b border-slate-400 w-44"></div>
          </div>

          <div className="text-center space-y-6">
            <div>નાણાં મેળવનારની સહી</div>
            <div className="border-b border-slate-400 w-36"></div>
          </div>
        </div>
      </div>

      {/* PAGE 2+: Attached Bill Proof Image (Rendered ONLY if attached) */}
      {voucher.billImageBase64 && (
        <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-2xl space-y-4 print-page-break font-sans">
          <div className="border-b border-slate-300 pb-2 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>વાઉચર બીડાણ બિલ ઓરિજિનલ પુરાવો (Attached Bill / Receipt Image)</span>
            <span>વાઉચર નં: {voucher.voucherNo}</span>
          </div>
          <div className="flex justify-center p-4 border border-slate-200 rounded-xl bg-slate-50">
            <img 
              src={voucher.billImageBase64} 
              alt="Attached Bill Proof" 
              className="max-h-[600px] object-contain rounded-lg shadow-md" 
            />
          </div>
        </div>
      )}
    </div>
  );
};
