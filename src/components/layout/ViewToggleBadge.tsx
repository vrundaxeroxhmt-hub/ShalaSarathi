import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface Props {
  currentViewMode: 'mobile' | 'web';
  onToggle: (mode: 'mobile' | 'web') => void;
}

export const ViewToggleBadge: React.FC<Props> = ({ currentViewMode, onToggle }) => {
  return (
    <div className="fixed top-3 right-3 z-50 bg-slate-900/90 text-white backdrop-blur-md rounded-full shadow-2xl p-1.5 flex items-center border border-slate-700/50 transition-all hover:scale-105">
      <span className="text-[11px] font-medium px-2.5 text-slate-300 hidden sm:inline">
        UI મોડ સ્વચાલિત:
      </span>
      <div className="flex bg-slate-800 rounded-full p-0.5">
        <button
          onClick={() => onToggle('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            currentViewMode === 'mobile'
              ? 'bg-brand-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
          title="મોબાઇલ આઇફોન/એન્ડ્રોઇડ અનુભવ જુઓ"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile UI</span>
        </button>
        
        <button
          onClick={() => onToggle('web')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            currentViewMode === 'web'
              ? 'bg-brand-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
          title="ડેસ્કટોપ SaaS વેબ વર્કસ્પેસ જુઓ"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Web UI</span>
        </button>
      </div>
    </div>
  );
};
