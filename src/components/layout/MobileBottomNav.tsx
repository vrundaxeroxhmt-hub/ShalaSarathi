import React from 'react';
import { Home, FileSpreadsheet, BookOpen, CreditCard, FileText, User } from 'lucide-react';
import { NavModuleId } from './WebSidebar';

interface Props {
  activeModule: NavModuleId;
  onSelectModule: (id: NavModuleId) => void;
}

export const MobileBottomNav: React.FC<Props> = ({ activeModule, onSelectModule }) => {
  const tabs = [
    { id: 'dashboard' as NavModuleId, label: 'ડેશબોર્ડ', icon: Home },
    { id: 'patrak' as NavModuleId, label: 'પત્રક ૭૩', icon: FileSpreadsheet },
    { id: 'rojmel' as NavModuleId, label: 'રોજમેળ', icon: BookOpen },
    { id: 'payable' as NavModuleId, label: 'ઉધારી', icon: CreditCard },
    { id: 'aheval' as NavModuleId, label: 'અહેવાલ', icon: FileText },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1 shadow-2xl font-sans">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectModule(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 min-w-[56px] ${
                isActive
                  ? 'text-brand-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className={`p-1 rounded-xl ${isActive ? 'bg-brand-50 text-brand-600' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 leading-none tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
