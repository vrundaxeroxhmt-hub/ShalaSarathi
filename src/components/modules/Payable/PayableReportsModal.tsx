import React, { useState } from 'react';
import { X, BarChart3, Users, FolderKanban, Calendar, ArrowDownRight } from 'lucide-react';
import { 
  PayableItem, 
  Supplier, 
  SupplierSummary, 
  HeadPayableSummary, 
  MonthlyPayableSummary, 
  YearlyPayableSummary 
} from '@/types/payable';
import { 
  computeSupplierSummaries, 
  computeHeadPayableSummaries, 
  computeMonthlyPayableSummaries, 
  computeYearlyPayableSummary 
} from '@/lib/services/payableService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payables: PayableItem[];
  suppliers: Supplier[];
  financialYear: string;
}

export const PayableReportsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  payables,
  suppliers,
  financialYear
}) => {
  const [reportTab, setReportTab] = useState<'supplier' | 'head' | 'monthly' | 'yearly'>('supplier');

  if (!isOpen) return null;

  const supplierSummaries = computeSupplierSummaries(payables, suppliers);
  const headSummaries = computeHeadPayableSummaries(payables);
  const monthlySummaries = computeMonthlyPayableSummaries(payables);
  const yearlySummary = computeYearlyPayableSummary(payables, financialYear);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">ઉધારી અને ચુકવણી અહેવાલ (Payable Reports)</h3>
              <p className="text-[10px] text-slate-400">સ્વતંત્ર સપ્લાયર, હેડ, માસિક અને વાર્ષિક હિસાબ પત્રક</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Sub-Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setReportTab('supplier')}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              reportTab === 'supplier'
                ? 'border-brand-600 text-brand-600 bg-brand-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>વેપારી વાર બાકી (Supplier Outstanding)</span>
          </button>

          <button
            onClick={() => setReportTab('head')}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              reportTab === 'head'
                ? 'border-brand-600 text-brand-600 bg-brand-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>હેડ વાર સમરી (Head Summary)</span>
          </button>

          <button
            onClick={() => setReportTab('monthly')}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              reportTab === 'monthly'
                ? 'border-brand-600 text-brand-600 bg-brand-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>માસિક સમરી (Monthly)</span>
          </button>

          <button
            onClick={() => setReportTab('yearly')}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              reportTab === 'yearly'
                ? 'border-brand-600 text-brand-600 bg-brand-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>વાર્ષિક સમરી (Yearly {financialYear})</span>
          </button>
        </div>

        {/* REPORT CONTENT */}
        <div className="max-h-80 overflow-y-auto font-sans">
          {/* TAB 1: SUPPLIER-WISE */}
          {reportTab === 'supplier' && (
            <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-900 text-slate-200 font-bold uppercase sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">સપ્લાયર નામ</th>
                  <th className="py-2.5 px-3 text-center">કુલ બિલ</th>
                  <th className="py-2.5 px-3 text-right">કુલ રકમ</th>
                  <th className="py-2.5 px-3 text-right">ચુકવેલ</th>
                  <th className="py-2.5 px-3 text-right">બાકી રકમ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {supplierSummaries.map(s => (
                  <tr key={s.supplierId} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{s.supplierNameGuj}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{s.totalBillsCount}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">₹{s.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">₹{s.totalPaid.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-black text-rose-700 bg-rose-50/50">
                      ₹{s.totalOutstanding.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB 2: HEAD-WISE */}
          {reportTab === 'head' && (
            <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-900 text-slate-200 font-bold uppercase sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">ગ્રાન્ટ / બજેટ હેડ</th>
                  <th className="py-2.5 px-3 text-center">બિલ સંખ્યા</th>
                  <th className="py-2.5 px-3 text-right">કુલ રકમ</th>
                  <th className="py-2.5 px-3 text-right">ચુકવેલ</th>
                  <th className="py-2.5 px-3 text-right">બાકી રકમ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {headSummaries.map(h => (
                  <tr key={h.headId} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{h.headNameGuj}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{h.totalPayableCount}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">₹{h.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">₹{h.totalPaid.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-black text-rose-700 bg-rose-50/50">
                      ₹{h.totalOutstanding.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB 3: MONTHLY */}
          {reportTab === 'monthly' && (
            <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-900 text-slate-200 font-bold uppercase sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">મહિનો</th>
                  <th className="py-2.5 px-3 text-center">રેકોર્ડ્સ</th>
                  <th className="py-2.5 px-3 text-right">કુલ ઉધાર ખરીદી</th>
                  <th className="py-2.5 px-3 text-right">કુલ ચુકવેલ રકમ</th>
                  <th className="py-2.5 px-3 text-right">બાકી રકમ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {monthlySummaries.map(m => (
                  <tr key={m.monthKey} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{m.monthNameGuj}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{m.count}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">₹{m.totalCreditPurchases.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">₹{m.totalPayments.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-black text-rose-700 bg-rose-50/50">
                      ₹{m.totalOutstanding.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB 4: YEARLY */}
          {reportTab === 'yearly' && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-5 rounded-2xl grid grid-cols-3 gap-3 text-center font-bold text-xs">
                <div>
                  <span className="text-slate-400 text-[10px]">કુલ વાર્ષિક ઉધાર ખરીદી:</span>
                  <div className="text-base text-amber-400 font-black">₹{yearlySummary.totalCreditPurchases.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">કુલ ચુકવેલ રકમ:</span>
                  <div className="text-base text-emerald-400 font-black">₹{yearlySummary.totalPayments.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">કુલ વાર્ષિક બાકી રકમ:</span>
                  <div className="text-base text-rose-400 font-black">₹{yearlySummary.totalOutstanding.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">મહિનો</th>
                      <th className="py-2.5 px-3 text-right">ખરીદી</th>
                      <th className="py-2.5 px-3 text-right">ચુકવેલ</th>
                      <th className="py-2.5 px-3 text-right">બાકી</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {yearlySummary.monthlyBreakdown.map(mb => (
                      <tr key={mb.monthKey}>
                        <td className="py-2.5 px-3 font-bold">{mb.monthNameGuj}</td>
                        <td className="py-2.5 px-3 text-right">₹{mb.totalCreditPurchases.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">₹{mb.totalPayments.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-right text-rose-700 font-black">₹{mb.totalOutstanding.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
          >
            બંધ કરો
          </button>
        </div>
      </div>
    </div>
  );
};
