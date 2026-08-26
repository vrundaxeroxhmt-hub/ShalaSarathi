import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { RojmelEntry, RojmelSummary, RojmelAccountSetup } from '@/types/rojmel';
import { TeacherProfile } from '@/types/user';
import { formatGujaratiDate } from '@/lib/services/rojmelService';

interface Props {
  entries: RojmelEntry[];
  summary: RojmelSummary;
  teacher: TeacherProfile;
  setup?: RojmelAccountSetup | null;
  onClose: () => void;
}

export const RojmelPrintRenderer: React.FC<Props> = ({
  entries,
  summary,
  teacher,
  setup,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto font-sans space-y-6">
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
          <span>A4 સત્તાવાર રોજમેળ રજિસ્ટર પ્રિન્ટ કરો</span>
        </button>
      </div>

      {/* DEDICATED A4 PRINT RENDERER */}
      <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-2xl space-y-6 print-container font-sans text-slate-900">
        
        {/* PAGE 1 HEADER */}
        <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
          <div className="text-xs font-bold text-slate-600">ગુજરાત પ્રાથમિક શિક્ષણ વિભાગ - શાળા દૈનિક રોજમેળ સત્તાવાર રજિસ્ટર</div>
          <h1 className="text-2xl font-black">{setup?.schoolNameGuj || teacher.school.schoolNameGuj}</h1>
          <div className="text-xs font-semibold text-slate-700">
            {setup?.rojmelNameGuj || 'શાળા કાર્યાલય મુખ્ય રોજમેળ રજિસ્ટર'} | UDISE: {teacher.school.udiseCode}
          </div>
          <div className="text-xs font-extrabold text-brand-800 pt-1">
            નાણાકીય વર્ષ: {setup?.financialYear || teacher.academicYear} | બેંક: {setup?.bankName || 'State Bank of India'} ({setup?.accountNumber || '••••4892'})
          </div>
        </div>

        {/* Summary Box */}
        <div className="bg-slate-50 border border-slate-900 rounded-xl p-3 grid grid-cols-5 gap-2 text-xs text-center font-bold">
          <div>
            <span className="text-slate-500 text-[10px]">પ્રારંભિક બેલેન્સ:</span>
            <div className="text-sm">₹{summary.openingBalance.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">કુલ આવક:</span>
            <div className="text-emerald-700 text-sm">+₹{summary.totalIncome.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">કુલ ખર્ચ:</span>
            <div className="text-rose-700 text-sm">-₹{summary.totalExpense.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">કુલ ખરીદી:</span>
            <div className="text-amber-700 text-sm">-₹{summary.totalPurchase.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-slate-900 text-white p-1.5 rounded-lg">
            <span className="text-slate-300 text-[10px]">આખરી સિલક:</span>
            <div className="text-emerald-400 text-sm font-black">₹{summary.closingBalance.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Cash Book / Ledger Table */}
        <table className="w-full text-left text-xs border border-slate-900 border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-900 font-bold">
              <th className="p-2 border-r border-slate-900">તારીખ</th>
              <th className="p-2 border-r border-slate-900">પ્રકાર</th>
              <th className="p-2 border-r border-slate-900">ગ્રાન્ટ / હેડ</th>
              <th className="p-2 border-r border-slate-900">વિગત (Particulars)</th>
              <th className="p-2 border-r border-slate-900 text-right">આવક (₹)</th>
              <th className="p-2 border-r border-slate-900 text-right">ખર્ચ / ખરીદી (₹)</th>
              <th className="p-2 text-right">બાકી સિલક (₹)</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-slate-400 font-medium">
                <td className="p-2 border-r border-slate-900 font-bold whitespace-nowrap">{formatGujaratiDate(e.date)}</td>
                <td className="p-2 border-r border-slate-900 text-center font-bold text-[10px]">
                  {e.type === 'income' ? 'આવક' : e.type === 'purchase' ? 'ખરીદી' : 'ખર્ચ'}
                </td>
                <td className="p-2 border-r border-slate-900 text-[10px] font-bold">{e.headNameGuj || e.category}</td>
                <td className="p-2 border-r border-slate-900">
                  <div className="font-bold">{e.particularGuj}</div>
                  {e.voucherNo && <div className="text-[10px] text-slate-600">વાઉચર: {e.voucherNo}</div>}
                </td>
                <td className="p-2 border-r border-slate-900 text-right font-bold text-emerald-700">
                  {e.type === 'income' ? `+₹${e.amount.toLocaleString('en-IN')}` : '-'}
                </td>
                <td className="p-2 border-r border-slate-900 text-right font-bold">
                  {e.type !== 'income' ? `-₹${e.amount.toLocaleString('en-IN')}` : '-'}
                </td>
                <td className="p-2 text-right font-extrabold bg-slate-50">
                  ₹{e.balanceAfter.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Signatures */}
        <div className="border-t-2 border-slate-900 pt-8 mt-12 flex justify-between text-xs font-bold">
          <div className="text-center space-y-6">
            <div>તૈયાર કરનાર શિક્ષક સહી</div>
            <div className="border-b border-slate-400 w-36"></div>
          </div>
          <div className="text-center space-y-6">
            <div>તપાસનાર સી.આર.સી. સહી</div>
            <div className="border-b border-slate-400 w-36"></div>
          </div>
          <div className="text-center space-y-6">
            <div>મુખ્ય શિક્ષક / આચાર્ય સહી અને સિક્કો</div>
            <div className="border-b border-slate-400 w-44"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
