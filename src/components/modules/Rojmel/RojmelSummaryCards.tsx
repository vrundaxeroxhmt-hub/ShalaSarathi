import React from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, ShoppingCart, Scale } from 'lucide-react';
import { RojmelSummary } from '@/types/rojmel';

interface Props {
  summary: RojmelSummary;
  isMobile?: boolean;
}

export const RojmelSummaryCards: React.FC<Props> = ({ summary, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="space-y-3 font-sans">
        {/* Main Closing Balance Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">ચાલુ બાકી સિલક (Closing Balance)</div>
            <div className="text-2xl font-black text-emerald-400">₹{summary.closingBalance.toLocaleString('en-IN')}</div>
            <div className="text-[9px] text-slate-400">પ્રારંભિક સિલક: ₹{summary.openingBalance.toLocaleString('en-IN')}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* 3 Compact Stacked Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-[9px] text-slate-500 font-bold uppercase">આવક (Income)</div>
            <div className="text-sm font-black text-emerald-600 mt-0.5">₹{summary.totalIncome.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-[9px] text-slate-500 font-bold uppercase">ખર્ચ (Expense)</div>
            <div className="text-sm font-black text-rose-600 mt-0.5">₹{summary.totalExpense.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-[9px] text-slate-500 font-bold uppercase">ખરીદી (Purchase)</div>
            <div className="text-sm font-black text-amber-600 mt-0.5">₹{summary.totalPurchase.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>
    );
  }

  // Web Desktop 5-Card Dashboard Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-sans">
      {/* 1. Opening Balance */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase">પ્રારંભિક સિલક</span>
          <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
            <Scale className="w-4 h-4" />
          </span>
        </div>
        <div className="text-xl font-extrabold text-slate-900">₹{summary.openingBalance.toLocaleString('en-IN')}</div>
        <div className="text-[10px] text-slate-400">ખાતાકીય શરૂઆત સ્ટોક</div>
      </div>

      {/* 2. Total Income */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase">કુલ આવક (Income)</span>
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
        <div className="text-xl font-extrabold text-emerald-600">+₹{summary.totalIncome.toLocaleString('en-IN')}</div>
        <div className="text-[10px] text-slate-400">ગ્રાન્ટ અને આવક જમા</div>
      </div>

      {/* 3. Total Expense */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase">કુલ ખર્ચ (Expense)</span>
          <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
            <ArrowDownRight className="w-4 h-4" />
          </span>
        </div>
        <div className="text-xl font-extrabold text-rose-600">-₹{summary.totalExpense.toLocaleString('en-IN')}</div>
        <div className="text-[10px] text-slate-400">સ્ટેશનરી અને દૈનિક ખર્ચ</div>
      </div>

      {/* 4. Total Purchase */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase">કુલ ખરીદી (Purchase)</span>
          <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <ShoppingCart className="w-4 h-4" />
          </span>
        </div>
        <div className="text-xl font-extrabold text-amber-600">-₹{summary.totalPurchase.toLocaleString('en-IN')}</div>
        <div className="text-[10px] text-slate-400">સાધનો અને ડેડ સ્ટોક</div>
      </div>

      {/* 5. Closing Balance */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-md space-y-1 border border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-300 uppercase">અંતિમ બાકી સિલક</span>
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Wallet className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-black text-emerald-400">₹{summary.closingBalance.toLocaleString('en-IN')}</div>
        <div className="text-[10px] text-slate-300">ઉપલબ્ધ શુદ્ધ બેલેન્સ</div>
      </div>
    </div>
  );
};
