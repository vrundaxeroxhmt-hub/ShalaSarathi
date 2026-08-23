import React, { useEffect } from 'react';
import { Sparkles, CheckCircle, X, School, ShieldCheck, UserCheck } from 'lucide-react';

interface WelcomeBackNotificationProps {
  name: string;
  role?: string;
  schoolName?: string;
  email?: string;
  onDismiss: () => void;
}

export const WelcomeBackNotification: React.FC<WelcomeBackNotificationProps> = ({
  name,
  role,
  schoolName,
  email,
  onDismiss
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-auto animate-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-amber-500/30 ring-1 ring-white/10 relative overflow-hidden">
        
        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex items-start space-x-3.5">
          {/* Avatar / Icon */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md ring-2 ring-white/20">
            <UserCheck className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Firebase Auth Verified
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5 truncate">
              Welcome back, {name}! 👋
            </h4>

            <p className="text-xs text-slate-300 mt-0.5 truncate">
              પાછા ફરવા બદલ સ્વાગત છે! તમારું સત્ર સક્રિય છે.
            </p>

            {(role || schoolName) && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                {role && (
                  <span className="bg-slate-800 text-amber-200 px-2 py-0.5 rounded-md font-medium">
                    {role}
                  </span>
                )}
                {schoolName && (
                  <span className="text-slate-400 flex items-center gap-1 truncate max-w-[200px]">
                    <School className="w-3 h-3 shrink-0 text-slate-500" />
                    <span className="truncate">{schoolName}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 -mr-1 -mt-1"
            title="બંધ કરો"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Progress Bar (5.5s) */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-5500 ease-linear"
            style={{ width: '100%', animation: 'shrink 5.5s linear forwards' }}
          />
        </div>
      </div>
    </div>
  );
};
