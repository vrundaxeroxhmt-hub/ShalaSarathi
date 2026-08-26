import React from 'react';
import { Calendar, Search, Bell, Sparkles, School } from 'lucide-react';
import { TeacherProfile } from '@/types/user';

interface Props {
  teacher: TeacherProfile;
  activeModuleTitle: string;
  onOpenNotifications: () => void;
}

export const WebHeader: React.FC<Props> = ({ teacher, activeModuleTitle, onOpenNotifications }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm font-sans">
      {/* Module Title & School Context */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{activeModuleTitle}</h2>
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-100/80 rounded-lg text-slate-600 text-xs border border-slate-200">
          <School className="w-3.5 h-3.5 text-brand-600" />
          <span className="font-semibold text-slate-700">{teacher.school.schoolNameGuj}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">UDISE: {teacher.school.udiseCode}</span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="પત્રક અથવા અહેવાલ શોધો..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Academic Year Selector Badge */}
        <div className="flex items-center gap-1.5 bg-brand-50 border border-brand-200/80 text-brand-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-brand-600" />
          <span>શૈક્ષણિક વર્ષ: {teacher.academicYear}</span>
        </div>

        {/* Notification Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="નોટિફિકેશન"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
};
