import React from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  BookOpen, 
  Receipt, 
  FileQuestion, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ShieldAlert,
  Download,
  Printer
} from 'lucide-react';
import { TeacherProfile } from '@/types/user';
import { NavModuleId } from '@/components/layout/WebSidebar';
import { RojmelEntry } from '@/types/rojmel';

interface Props {
  teacher: TeacherProfile;
  onNavigate: (module: NavModuleId) => void;
  rojmelEntries: RojmelEntry[];
}

export const WebDashboard: React.FC<Props> = ({ teacher, onNavigate, rojmelEntries }) => {
  const currentBalance = rojmelEntries.length > 0 ? rojmelEntries[0].balanceAfter : 0;

  const quickActions = [
    { labelGuj: 'નવું પત્રક બનાવો', labelEng: 'Create Patrak', icon: FileSpreadsheet, color: 'bg-emerald-500 hover:bg-emerald-600', module: 'patrak' as NavModuleId },
    { labelGuj: 'અહેવાલ લખો (Voice)', labelEng: 'Create Aheval', icon: FileText, color: 'bg-brand-600 hover:bg-brand-700', module: 'aheval' as NavModuleId },
    { labelGuj: 'રોજમેળ એન્ટ્રી', labelEng: 'Rojmel Entry', icon: BookOpen, color: 'bg-amber-600 hover:bg-amber-700', module: 'rojmel' as NavModuleId },
    { labelGuj: 'વાઉચર પ્રિન્ટ', labelEng: 'Create Voucher', icon: Receipt, color: 'bg-purple-600 hover:bg-purple-700', module: 'voucher' as NavModuleId },
    { labelGuj: 'પેપર જનરેટર', labelEng: 'Generate Paper', icon: FileQuestion, color: 'bg-indigo-600 hover:bg-indigo-700', module: 'paper' as NavModuleId },
  ];

  return (
    <div className="p-8 space-y-8 font-sans max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
              <span>નમસ્તે, શિક્ષકશ્રી!</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-ping"></span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {teacher.nameGuj}
            </h1>
            <p className="text-slate-300 text-sm flex items-center gap-2">
              <span>{teacher.designation}</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">{teacher.school.schoolNameGuj}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('patrak')}
              className="bg-gujarat-saffron hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-orange-950/50 flex items-center gap-2 text-sm transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>પત્રક શરૂ કરો</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 tracking-wide uppercase">ઝડપી કાર્યો (Quick Actions)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigate(action.module)}
                className={`${action.color} text-white p-4 rounded-2xl shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl text-left flex flex-col justify-between h-32 group border border-white/10`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold leading-snug">{action.labelGuj}</div>
                  <div className="text-[10px] text-white/80">{action.labelEng}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dashboard KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patrak Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">ગુણોત્સવ પત્રક પ્રગતિ</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">૭૩ પત્રકો</div>
            <div className="text-xs text-slate-500 mt-1">બધા ૭૩ પત્રક ટેમ્પ્લેટ તૈયાર છે</div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[85%] rounded-full"></div>
          </div>
          <button 
            onClick={() => onNavigate('patrak')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>પત્રકોની યાદી જુઓ</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Rojmel Ledger Balance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">રોજમેળ ઉપલબ્ધ બાકી (Balance)</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <BookOpen className="w-5 h-5" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">₹{currentBalance.toLocaleString('en-IN')}</div>
            <div className="text-xs text-slate-500 mt-1">છેલ્લી એન્ટ્રી: {rojmelEntries[0]?.date || 'હાલમાં'}</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>ડેડ સ્ટોક રજિસ્ટર ઓટો-લિંક્ડ</span>
          </div>
          <button 
            onClick={() => onNavigate('rojmel')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>રોજમેળ ખોલો</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Saved Documents */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">તાજેતરના દસ્તાવેજો</span>
            <span className="p-2 rounded-lg bg-brand-50 text-brand-600">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">૧૨ ફાઇલો</div>
            <div className="text-xs text-slate-500 mt-1">આ મહિને જનરેટ કરેલ PDF</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>છેલ્લું ડાઉનલોડ: પત્રક-૧ અંબાજી પ્રાથમિક શાળા</span>
          </div>
          <button 
            onClick={() => onNavigate('mydocs')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>મારા દસ્તાવેજો</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Rojmel Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">તાજેતરની રોજમેળ નોંધણી (Rojmel Ledger)</h3>
            <p className="text-xs text-slate-500">સ્વચાલિત ડેડ સ્ટોક લિંકિંગ સાથેની વ્યવહારોની વિગત</p>
          </div>
          <button 
            onClick={() => onNavigate('rojmel')}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            બધી એન્ટ્રી જુઓ
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">તારીખ</th>
                <th className="py-3 px-4">વિગત (Particular)</th>
                <th className="py-3 px-4">પ્રકાર</th>
                <th className="py-3 px-4 text-right">રકમ (₹)</th>
                <th className="py-3 px-4 text-right">બાકી રકમ (Balance)</th>
                <th className="py-3 px-4 text-center">ડેડ સ્ટોક લિંક</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rojmelEntries.slice(0, 4).map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{entry.date}</td>
                  <td className="py-3 px-4 font-medium max-w-xs truncate">{entry.particularGuj}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      entry.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {entry.type === 'income' ? 'આવક (Income)' : 'ખર્ચ (Expense)'}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right font-extrabold ${entry.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {entry.type === 'income' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-800">
                    ₹{entry.balanceAfter.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {entry.isDeadStockLinked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-brand-50 text-brand-700 font-bold px-2 py-0.5 rounded-full border border-brand-200">
                        ✓ લિંક્ડ (Printer)
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
