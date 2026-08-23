import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab, SubFeature } from '../../types';
import { 
  Home, 
  Users, 
  Briefcase, 
  BookOpen, 
  FolderArchive, 
  UserCircle,
  PlusCircle
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  subLabel: string;
  icon: React.ElementType;
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, setActiveSubFeature } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: 'હોમ', subLabel: 'Home', icon: Home },
    { id: 'community', label: 'કમ્યુનિટી', subLabel: 'Community', icon: Users },
    { id: 'work-assistant', label: 'શાળા કાર્ય', subLabel: 'Work Assistant', icon: Briefcase },
    { id: 'create', label: 'શિક્ષણ સાધનો', subLabel: 'Teaching Tools', icon: BookOpen },
    { id: 'my-work', label: 'મારું કાર્ય', subLabel: 'My Work', icon: FolderArchive },
    { id: 'profile', label: 'પ્રોફાઇલ', subLabel: 'Profile', icon: UserCircle },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'home') setActiveSubFeature('dashboard');
    if (tab === 'community') setActiveSubFeature('community-feed');
    if (tab === 'work-assistant') setActiveSubFeature('patrak-automation');
    if (tab === 'create') setActiveSubFeature('question-paper');
  };

  return (
    <>
      {/* Desktop Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 hidden md:block no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="font-semibold">{item.label}</span>
                  <span className={`text-[11px] font-normal ${isActive ? 'text-amber-100' : 'text-slate-400'}`}>
                    ({item.subLabel})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-1.5 px-2 md:hidden shadow-lg no-print">
        <div className="grid grid-cols-6 gap-1 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors ${
                  isActive ? 'text-amber-600 font-bold' : 'text-slate-500'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-600' : 'text-slate-500'}`} />
                <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
