import React from 'react';
import { Printer, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { RojmelEntry, RojmelAccountSetup } from '@/types/rojmel';
import { TeacherProfile } from '@/types/user';

interface Props {
  entry: RojmelEntry;
  teacher: TeacherProfile;
  setup?: RojmelAccountSetup | null;
  onClose: () => void;
}

export const RojmelVoucherPrintModal: React.FC<Props> = ({
  entry,
  teacher,
  setup,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto font-sans space-y-6">
      {/* Top Action Bar */}
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
          <span>વાઉચર અને બિલ પ્રિન્ટ કરો (Print Voucher & Proof)</span>
        </button>
      </div>

      {/* PAGE 1: Official Voucher Slip */}
      <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-2xl space-y-6 print-container font-sans">
        <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
          <div className="text-xs font-bold text-slate-600">ગુજરાત પ્રાથમિક શિક્ષણ વિભાગ - સત્તાવાર ચુકવણી વાઉચર</div>
          <h1 className="text-2xl font-black text-slate-900">{setup?.schoolNameGuj || teacher.school.schoolNameGuj}</h1>
          <div className="text-xs font-semibold text-slate-700">
            UDISE Code: {teacher.school.udiseCode} | શૈક્ષણિક વર્ષ: {setup?.financialYear || teacher.academicYear}
          </div>
          <div className="inline-block bg-slate-900 text-white text-xs font-extrabold px-4 py-1 rounded-md mt-2">
            ખર્ચ / ખરીદી ચુકવણી વાઉચર (VOUCHER)
          </div>
        </div>

        {/* Voucher Metadata Table */}
        <div className="grid grid-cols-2 gap-4 text-xs font-bold border border-slate-900 p-4 rounded-xl">
          <div>
            <span className="text-slate-500">વાઉચર નંબર:</span>
            <div className="text-sm font-mono font-black text-purple-700">{entry.voucherNo || `V-${entry.id}`}</div>
          </div>

          <div className="text-right">
            <span className="text-slate-500">ચુકવણી તારીખ:</span>
            <div className="text-sm font-black text-slate-900">{entry.date}</div>
          </div>

          <div>
            <span className="text-slate-500">ગ્રાન્ટ / હેડ:</span>
            <div className="text-slate-900">{entry.headNameGuj || entry.category}</div>
          </div>

          <div className="text-right">
            <span className="text-slate-500">ચુકવણી મોડ:</span>
            <div className="text-slate-900">{entry.paymentMode}</div>
          </div>
        </div>

        {/* Particulars & Amount Table */}
        <table className="w-full text-left text-xs border border-slate-900 border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-900 font-bold">
              <th className="p-3 border-r border-slate-900">વ્યવહાર વિગત (Particular Description)</th>
              <th className="p-3 border-r border-slate-900 text-center">જથ્થો</th>
              <th className="p-3 text-right">રકમ (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-900 font-semibold">
              <td className="p-3 border-r border-slate-900">{entry.particularGuj}</td>
              <td className="p-3 border-r border-slate-900 text-center">{entry.quantity || 1}</td>
              <td className="p-3 text-right font-black text-sm">₹{entry.amount.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        {/* Amount in words & Signatures */}
        <div className="space-y-4 pt-4 text-xs font-bold text-slate-900">
          <div className="bg-slate-50 border border-slate-300 p-3 rounded-xl">
            <span>અક્ષરે રકમ: </span>
            <span className="font-extrabold text-brand-700">રૂપિયા {entry.amount.toLocaleString('en-IN')} પુરા.</span>
          </div>

          <div className="pt-12 flex justify-between">
            <div className="text-center space-y-4">
              <div>નાણાં મેળવનાર સહી</div>
              <div className="border-b border-slate-400 w-36"></div>
            </div>
            <div className="text-center space-y-4">
              <div>તપાસનાર શિક્ષક સહી</div>
              <div className="border-b border-slate-400 w-36"></div>
            </div>
            <div className="text-center space-y-4">
              <div>મુખ્ય શિક્ષક / આચાર્ય સહી અને સિક્કો</div>
              <div className="border-b border-slate-400 w-44"></div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2+: Attached Bill / Proof Image */}
      {entry.billImageBase64 ? (
        <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-2xl space-y-4 print-page-break font-sans">
          <div className="border-b border-slate-300 pb-2 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>બિલ / વાઉચર આધાર પુરાવો (Attached Bill Proof)</span>
            <span>વાઉચર નં: {entry.voucherNo || entry.id}</span>
          </div>
          <div className="flex justify-center p-4 border border-slate-200 rounded-xl bg-slate-50">
            <img 
              src={entry.billImageBase64} 
              alt="Attached Bill Proof" 
              className="max-h-[600px] object-contain rounded-lg shadow-md" 
            />
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center text-xs font-semibold text-slate-500 space-y-2 no-print">
          <ImageIcon className="w-8 h-8 mx-auto text-slate-400" />
          <p>આ વાઉચર સાથે ડિજિટલ બિલ ઈમેજ અપલોડ કરેલ નથી. તમે પ્રિન્ટ પછી ઓરિજિનલ પેપર બિલ પણ સાથે પિન કરી શકો છો.</p>
        </div>
      )}
    </div>
  );
};
