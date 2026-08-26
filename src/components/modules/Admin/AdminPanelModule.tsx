import React from 'react';
import { ShieldCheck, Layers, GitBranch, Sparkles, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';

export const AdminPanelModule: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto font-sans space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>એડમિન કંટ્રોલ અને પત્રક માસ્ટર ટેમ્પ્લેટ મેનેજર</span>
          </div>
          <h2 className="text-2xl font-bold">માસ્ટર ટેમ્પ્લેટ્સ અને વર્ઝન કંટ્રોલ (Admin Master Center)</h2>
          <p className="text-xs text-slate-400 mt-1">
            તમામ ૭૩ પત્રક અને અહેવાલોના માસ્ટર ટેમ્પ્લેટ અપડેટ કરો.
          </p>
        </div>
      </div>

      {/* Architecture Visual Diagram */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-brand-600" />
          <span>માસ્ટર ટેમ્પ્લેટ અને શિક્ષક કોપી આઇસોલેશન આર્કિટેક્ચર (Non-Destructive Versioning)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-700">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-brand-700">૧. એડમિન માસ્ટર ટેમ્પ્લેટ</div>
            <div className="text-[11px] text-slate-500">મુખ્ય સરકારી નિયમો મુજબનું સર્વર ટેમ્પ્લેટ</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-purple-700">૨. વર્ઝન કંટ્રોલ (A / B / C)</div>
            <div className="text-[11px] text-slate-500">વર્ઝન 1.0, 1.1, 2.0 આર્કાઇવ સાચવાય છે</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-amber-700">૩. શિક્ષકની પોતાની કોપી</div>
            <div className="text-[11px] text-slate-500">શિક્ષક વર્ઝન પસંદ કરી પોતાની કોપી બનાવે છે</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-1">
            <div className="font-bold text-emerald-800">૪. ઓવરરાઇટ પ્રોટેક્શન</div>
            <div className="text-[11px] text-emerald-900 font-semibold">માસ્ટર અપડેટથી શિક્ષકનો ડેટા ક્યારેય નષ્ટ નથી થતો</div>
          </div>
        </div>
      </div>

      {/* Admin Master List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">સક્રિય ૭૩ માસ્ટર પત્રકો (Master Patrak Templates)</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">પત્રક નંબર</th>
                <th className="py-3 px-4">માસ્ટર શીર્ષક</th>
                <th className="py-3 px-4">કેટેગરી</th>
                <th className="py-3 px-4">ઉપલબ્ધ ફોર્મેટ વર્ઝન</th>
                <th className="py-3 px-4 text-center">સ્થિતિ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr>
                <td className="py-3 px-4 font-bold text-brand-600">પત્રક ૧</td>
                <td className="py-3 px-4 font-bold text-slate-900">પ્રગતિ પત્રક - વિષયવાર સિદ્ધિ</td>
                <td className="py-3 px-4">Gunotsav 2.0</td>
                <td className="py-3 px-4">
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono">Version A, B, C</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Active v1.2
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-brand-600">પત્રક ૨</td>
                <td className="py-3 px-4 font-bold text-slate-900">વ્યક્તિત્વ અને સામાજિક વિકાસ પત્રક</td>
                <td className="py-3 px-4">SCE Evaluation</td>
                <td className="py-3 px-4">
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono">Version A, B</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Active v1.0
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-brand-600">પત્રક ૧૨</td>
                <td className="py-3 px-4 font-bold text-slate-900">નિપુણ ભારત - FLN અધ્યયન પત્રક</td>
                <td className="py-3 px-4">NIPUN Bharat</td>
                <td className="py-3 px-4">
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono">Version A</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Active v1.1
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
