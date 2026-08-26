import React from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  BookOpen, 
  Receipt, 
  FileQuestion, 
  Mic, 
  Plus, 
  Sparkles, 
  ArrowRight,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { TeacherProfile } from '@/types/user';
import { NavModuleId } from '@/components/layout/WebSidebar';
import { RojmelEntry } from '@/types/rojmel';

interface Props {
  teacher: TeacherProfile;
  onNavigate: (module: NavModuleId) => void;
  onOpenVoiceModal: () => void;
  rojmelEntries: RojmelEntry[];
}

export const MobileDashboard: React.FC<Props> = ({ teacher, onNavigate, onOpenVoiceModal, rojmelEntries }) => {
  const currentBalance = rojmelEntries.length > 0 ? rojmelEntries[0].balanceAfter : 0;

  const quickActions = [
    { labelGuj: 'પત્રક બનાવો', labelEng: 'Create Patrak', icon: FileSpreadsheet, color: 'bg-emerald-500 text-white', module: 'patrak' as NavModuleId },
    { labelGuj: 'અહેવાલ (Voice)', labelEng: 'Create Aheval', icon: FileText, color: 'bg-brand-600 text-white', module: 'aheval' as NavModuleId },
    { labelGuj: 'રોજમેળ નોંધ', labelEng: 'Rojmel Entry', icon: BookOpen, color: 'bg-amber-600 text-white', module: 'rojmel' as NavModuleId },
    { labelGuj: 'વાઉચર પ્રિન્ટ', labelEng: 'Voucher', icon: Receipt, color: 'bg-purple-600 text-white', module: 'voucher' as NavModuleId },
  ];

  return (
    <div className="p-4 pb-24 space-y-5 font-sans">
      {/* Mobile Greeting Card */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800 text-white p-5 rounded-3xl shadow-lg shadow-brand-950/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="space-y-1 relative z-10">
          <span className="text-[11px] font-semibold text-brand-200 uppercase tracking-wide">શિક્ષક ડેશબોર્ડ</span>
          <h2 className="text-xl font-bold">{teacher.nameGuj}</h2>
          <p className="text-xs text-brand-100 font-medium truncate">{teacher.school.schoolNameGuj}</p>
        </div>

        {/* Balance pill */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-brand-200">રોજમેળ સિલક (Balance)</div>
            <div className="text-lg font-black text-white">₹{currentBalance.toLocaleString('en-IN')}</div>
          </div>
          <button 
            onClick={() => onNavigate('rojmel')}
            className="bg-white text-brand-900 text-xs font-bold px-3 py-1.5 rounded-full shadow hover:bg-brand-50 active:scale-95 transition-all flex items-center gap-1"
          >
            <span>રોજમેળ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Voice Assistant Shortcut Card */}
      <div 
        onClick={onOpenVoiceModal}
        className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 rounded-2xl shadow-md flex items-center justify-between cursor-pointer active:scale-98 transition-transform"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-bold">ગુજરાતી વોઇસ સ્માર્ટ ટાઇપિંગ</div>
            <div className="text-[11px] text-white/90">બોલીને અહેવાલ કે પત્રક વિગત ભરો</div>
          </div>
        </div>
        <div className="bg-white/20 p-2 rounded-xl">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Touch-Friendly Quick Action Grid (Large 2-column touch targets) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">ઝડપી સેવાઓ (Quick Actions)</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigate(act.module)}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm active:scale-95 transition-all flex flex-col justify-between h-28 text-left group"
              >
                <div className={`w-10 h-10 rounded-xl ${act.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 leading-snug">{act.labelGuj}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{act.labelEng}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured 73 Patrak Engine Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              ૭૩
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">ગુણોત્સવ ૨.૦ અને પત્રકો</div>
              <div className="text-[10px] text-slate-500">પ્રમાણિત ૨-૩ વર્ઝન ઓપ્શન સાથે</div>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            રેડી
          </span>
        </div>

        <p className="text-xs text-slate-600">
          સત્તાવાર ગવર્નમેન્ટ સીલ Version A, કલર લેઆઉટ Version B, અથવા કોમ્પેક્ટ સમરી સમર્થન.
        </p>

        <button
          onClick={() => onNavigate('patrak')}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
        >
          <span>પત્રકો ટેમ્પ્લેટ બ્રાઉઝ કરો</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Action Button (FAB) for Instant Voice Input */}
      <button
        onClick={onOpenVoiceModal}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-tr from-brand-600 to-gujarat-saffron text-white rounded-full shadow-2xl flex items-center justify-center ring-4 ring-white active:scale-90 transition-transform"
        title="બોલીને લખાણ ઉમેરો"
      >
        <Mic className="w-6 h-6 animate-pulse" />
      </button>
    </div>
  );
};
