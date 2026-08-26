import React, { useState } from 'react';
import { X, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { RojmelEntry } from '@/types/rojmel';
import { getMonthlyRojmelSummaries, getYearlyRojmelSummary, DEFAULT_OPENING_BALANCE } from '@/lib/services/rojmelService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entries: RojmelEntry[];
  academicYear?: string;
}

export const RojmelMonthlyYearlyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  entries,
  academicYear = '2026-27'
}) => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const monthlySummaries = getMonthlyRojmelSummaries(entries, DEFAULT_OPENING_BALANCE);
  const yearlySummary = getYearlyRojmelSummary(entries, DEFAULT_OPENING_BALANCE, academicYear);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">માસિક અને વાર્ષિક હિસાબ સારાંશ (Rojmel Summaries)</h3>
              <p className="text-[10px] text-slate-400">મહિનાવાર અને શૈક્ષણિક વર્ષ હિસાબ ચકાસણી પત્રક</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-6 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'monthly'
                ? 'border-brand-600 text-brand-600 bg-brand-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>માસિક સારાંશ / Monthly Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('yearly')}
            className={`px-6 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'yearly'
                ? 'border-brand-600 text-brand-600 bg-brand-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>વાર્ષિક સારાંશ / Yearly Summary ({academicYear})</span>
          </button>
        </div>

        {/* Tab 1: Monthly Summary Table */}
        {activeTab === 'monthly' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-500 font-medium">
              દરેક મહિનાની પ્રારંભિક સિલક, જમા આવક, ખર્ચ, સાધન ખરીદી અને અંતિમ બાકી.
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-[400px]">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-900 text-slate-200 font-bold uppercase sticky top-0">
                  <tr>
                    <th className="py-3 px-4">મહિનો (Month)</th>
                    <th className="py-3 px-4 text-center">એન્ટ્રીઓ</th>
                    <th className="py-3 px-4 text-right">પ્રારંભિક સિલક</th>
                    <th className="py-3 px-4 text-right text-emerald-400">કુલ આવક (₹)</th>
                    <th className="py-3 px-4 text-right text-rose-400">કુલ ખર્ચ (₹)</th>
                    <th className="py-3 px-4 text-right text-amber-400">કુલ ખરીદી (₹)</th>
                    <th className="py-3 px-4 text-right">અંતિમ સિલક (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {monthlySummaries.map(m => (
                    <tr key={m.monthKey} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{m.monthNameGuj}</td>
                      <td className="py-3 px-4 text-center font-bold">{m.transactionCount}</td>
                      <td className="py-3 px-4 text-right font-semibold">₹{m.openingBalance.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-emerald-600">+₹{m.totalIncome.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-rose-600">-₹{m.totalExpense.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-amber-600">-₹{m.totalPurchase.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right font-black text-slate-900 bg-slate-50">₹{m.closingBalance.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Yearly Summary Cards & Breakdown */}
        {activeTab === 'yearly' && (
          <div className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">વર્ષ શરૂઆત સિલક</div>
                <div className="text-base font-extrabold text-slate-900 mt-1">₹{yearlySummary.openingBalance.toLocaleString('en-IN')}</div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">વાર્ષિક કુલ આવક</div>
                <div className="text-base font-extrabold text-emerald-700 mt-1">+₹{yearlySummary.totalIncome.toLocaleString('en-IN')}</div>
              </div>

              <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200">
                <div className="text-[10px] text-rose-800 font-bold uppercase">વાર્ષિક કુલ ખર્ચ/ખરીદી</div>
                <div className="text-base font-extrabold text-rose-700 mt-1">-₹{(yearlySummary.totalExpense + yearlySummary.totalPurchase).toLocaleString('en-IN')}</div>
              </div>

              <div className="bg-slate-900 text-white p-3 rounded-2xl shadow">
                <div className="text-[10px] text-slate-300 font-bold uppercase">વાર્ષિક આખરી સિલક</div>
                <div className="text-base font-black text-emerald-400 mt-1">₹{yearlySummary.closingBalance.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="font-bold text-slate-800">શૈક્ષણિક વર્ષ {academicYear} નોંધણી નિષ્કર્ષ:</div>
              <p className="text-slate-600 leading-relaxed font-medium">
                કુલ પત્રક વ્યવહારોની સંખ્યા {entries.length} છે. સરકારી ગ્રાન્ટ અને ખરીદીઓના તમામ વાઉચર ઓટો-લિંક થયેલા છે.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs shadow"
          >
            બંધ કરો (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
