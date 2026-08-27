import React, { useState } from 'react';
import { ShieldCheck, Layers, GitBranch, Sparkles, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { AhevalPatrakTemplateManager } from './AhevalPatrakTemplateManager';

export const AdminPanelModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'aheval_patrak_builder' | 'master_overview'>('aheval_patrak_builder');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>એડમિન કંટ્રોલ અને પત્રક માસ્ટર સેન્ટર</span>
          </div>
          <h2 className="text-2xl font-bold">માસ્ટર ટેમ્પ્લેટ્સ અને વર્ઝન કંટ્રોલ (Admin Control Panel)</h2>
          <p className="text-xs text-slate-400 mt-1">
            તમામ અહેવાલ અને પત્રકના માસ્ટર ટેમ્પ્લેટ અપડેટ કરો, વર્ઝન સેટ કરો અને પબ્લિશ કરો.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab('aheval_patrak_builder')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'aheval_patrak_builder'
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            📑 અહેવાલ / પત્રક Templates
          </button>
          <button
            onClick={() => setActiveTab('master_overview')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'master_overview'
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            માસ્ટર સિસ્ટમ ઓવરવ્યૂ
          </button>
        </div>
      </div>

      {activeTab === 'aheval_patrak_builder' ? (
        <AhevalPatrakTemplateManager />
      ) : (
        <div className="space-y-6">
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
                <div className="font-bold text-purple-700">૨. વર્ઝન કંટ્રોલ (v1.0 / v2.0)</div>
                <div className="text-[11px] text-slate-500">વર્ઝન આર્કાઇવ સાચવાય છે</div>
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
        </div>
      )}
    </div>
  );
};
