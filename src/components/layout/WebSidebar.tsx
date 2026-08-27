import React from 'react';
import { 
  LayoutDashboard, 
  UserCheck, 
  Building2, 
  FileSpreadsheet, 
  FileText, 
  BookOpen, 
  CreditCard,
  Receipt, 
  FileQuestion, 
  FileOutput, 
  FolderArchive, 
  Package, 
  Bell, 
  Settings, 
  ShieldCheck,
  ChevronRight,
  Crown
} from 'lucide-react';
import { TeacherProfile } from '@/types/user';

export type NavModuleId = 
  | 'dashboard' 
  | 'profile' 
  | 'school' 
  | 'aheval_patrak'
  | 'patrak' 
  | 'aheval' 
  | 'rojmel' 
  | 'payable'
  | 'voucher' 
  | 'paper' 
  | 'docgen' 
  | 'mydocs' 
  | 'packages' 
  | 'notifications' 
  | 'settings' 
  | 'admin';

interface Props {
  activeModule: NavModuleId;
  onSelectModule: (module: NavModuleId) => void;
  teacher: TeacherProfile;
}

export const WebSidebar: React.FC<Props> = ({ activeModule, onSelectModule, teacher }) => {
  const navItems: Array<{ id: NavModuleId; labelGuj: string; labelEng: string; icon: any; badge?: string }> = [
    { id: 'dashboard', labelGuj: 'ડેશબોર્ડ', labelEng: 'Dashboard', icon: LayoutDashboard },
    { id: 'aheval_patrak', labelGuj: '📑 અહેવાલ / પત્રક', labelEng: 'Aheval & Patrak Engine', icon: FileSpreadsheet, badge: 'New' },
    { id: 'profile', labelGuj: 'શિક્ષક પ્રોફાઇલ', labelEng: 'Teacher Profile', icon: UserCheck },
    { id: 'school', labelGuj: 'શાળા પ્રોફાઇલ', labelEng: 'School Profile', icon: Building2 },
    { id: 'rojmel', labelGuj: 'રોજમેળ અને ડેડ સ્ટોક', labelEng: 'Rojmel & Dead Stock', icon: BookOpen, badge: 'VIP' },
    { id: 'payable', labelGuj: 'ઉધારી વ્યવસ્થા (Payable)', labelEng: 'Credit Purchases', icon: CreditCard },
    { id: 'voucher', labelGuj: 'વાઉચર જનરેટર', labelEng: 'Voucher Module', icon: Receipt },
    { id: 'paper', labelGuj: 'પેપર જનરેટર', labelEng: 'Paper Generator', icon: FileQuestion },
    { id: 'docgen', labelGuj: 'દસ્તાવેજ નમૂના', labelEng: 'Doc Generator', icon: FileOutput },
    { id: 'mydocs', labelGuj: 'મારા સેવ થયેલ ફાઇલો', labelEng: 'My Documents', icon: FolderArchive },
    { id: 'packages', labelGuj: 'પ્લાન / સબ્સ્ક્રિપ્શન', labelEng: 'Subscription Plans', icon: Package },
    { id: 'notifications', labelGuj: 'નોટિફિકેશન', labelEng: 'Notifications', icon: Bell },
    { id: 'settings', labelGuj: 'સેટિંગ્સ', labelEng: 'Settings', icon: Settings },
    { id: 'admin', labelGuj: 'એડમિન કંટ્રોલ', labelEng: 'Admin Panel', icon: ShieldCheck }
  ];

  // Robust fallback for initial avatar letter
  const avatarLetter = (teacher?.nameEng?.trim() || teacher?.nameGuj?.trim() || 'V')[0] || 'V';

  return (
    <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 font-sans shadow-xl border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-gujarat-saffron flex items-center justify-center font-black text-xl text-white shadow-lg">
            શા
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-wide leading-none">શાળા સારથિ</h1>
            <span className="text-[10px] text-brand-400 font-semibold uppercase tracking-wider">v2.0 Premium SaaS</span>
          </div>
        </div>
      </div>

      {/* Subscription Status Card */}
      <div className="mx-4 mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
          <Crown className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <div className="font-bold text-white">આચાર્ય અલ્ટ્રા પ્લાન</div>
          <div className="text-[10px] text-amber-300/80 font-medium">તમામ ૭૩ પત્રકો અનલિમિટેડ</div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-950/50'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <div className="text-left">
                  <div className="leading-snug">{item.labelGuj}</div>
                  <div className={`text-[10px] font-normal ${isActive ? 'text-brand-200' : 'text-slate-400'}`}>
                    {item.labelEng}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-brand-400 border border-brand-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Teacher Footer Card */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm shrink-0">
            {avatarLetter}
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-white truncate">{teacher?.nameGuj || 'શિક્ષકશ્રી'}</div>
            <div className="text-[10px] text-slate-400 truncate">{teacher?.school?.schoolNameGuj || 'શાળા પ્રોફાઇલ'}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
