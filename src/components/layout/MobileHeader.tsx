import React from 'react';
import { Crown, Mic, School } from 'lucide-react';
import { TeacherProfile } from '@/types/user';

interface Props {
  teacher: TeacherProfile;
  onOpenVoice: () => void;
}

export const MobileHeader: React.FC<Props> = ({ teacher, onOpenVoice }) => {
  return (
    <header className="bg-slate-900 text-white px-4 pt-3 pb-4 sticky top-0 z-30 shadow-md font-sans border-b border-slate-800">
      <div className="flex items-center justify-between">
        {/* Brand & Teacher */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-gujarat-saffron flex items-center justify-center font-black text-lg text-white shadow-md ring-2 ring-white/10">
            શા
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base leading-tight">શાળા સારથિ</h1>
              <span className="bg-amber-400/20 text-amber-300 text-[9px] font-extrabold px-1.5 py-0.2 rounded border border-amber-400/30">VIP</span>
            </div>
            <p className="text-[11px] text-slate-300 truncate max-w-[180px] font-medium">{teacher.school.schoolNameGuj}</p>
          </div>
        </div>

        {/* Header Voice Shortcut Button */}
        <button
          onClick={onOpenVoice}
          className="flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white px-3 py-1.5 rounded-full shadow-lg shadow-brand-900/50 text-xs font-bold ring-2 ring-brand-400/40 active:scale-95 transition-all"
        >
          <Mic className="w-4 h-4 animate-bounce" />
          <span>બોલો</span>
        </button>
      </div>
    </header>
  );
};
