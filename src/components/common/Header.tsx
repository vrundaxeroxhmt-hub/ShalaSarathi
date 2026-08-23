import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  School, 
  User, 
  Users, 
  Download, 
  Upload, 
  HelpCircle, 
  Bell, 
  Search,
  Sparkles,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  Megaphone,
  LogIn,
  LogOut,
  CheckCircle,
  Cloud
} from 'lucide-react';
import { StudentRosterModal } from '../students/StudentRosterModal';
import { AuthModal } from '../auth/AuthModal';

export const Header: React.FC = () => {
  const { 
    schoolProfile, 
    teacherProfile, 
    setActiveTab, 
    setActiveSubFeature,
    exportBackupJson,
    importBackupJson,
    resetToDemoData,
    setIsAdminModalOpen,
    firebaseUser,
    isAuthLoading,
    isAuthModalOpen,
    setIsAuthModalOpen,
    logOut,
    toast 
  } = useApp();

  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) importBackupJson(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo and Brand */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => {
                setActiveTab('home');
                setActiveSubFeature('dashboard');
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-sm font-bold text-xl group-hover:scale-105 transition-transform">
                શ
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">ShalaSarathi</span>
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    ગુજરાત
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  શિક્ષક કમ્યુનિટી અને શાળા કાર્ય સહાયક
                </p>
              </div>
            </div>

            {/* School and Teacher Status */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right border-r border-slate-200 pr-4">
                <p className="text-xs font-medium text-slate-900 truncate max-w-[200px]">
                  {schoolProfile.schoolName}
                </p>
                <p className="text-[11px] text-slate-500">
                  UDISE: <span className="font-mono">{schoolProfile.udiseCode}</span> • {schoolProfile.taluka}
                </p>
              </div>

              <div 
                className="flex items-center space-x-2.5 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer transition-colors"
                onClick={() => {
                  setActiveTab('profile');
                }}
              >
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                  {teacherProfile.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                    {teacherProfile.name}
                  </p>
                  <p className="text-[10px] text-amber-700 font-medium">
                    {teacherProfile.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Bar & Auth Toggle */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowStudentsModal(true)}
                className="inline-flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                title="વિદ્યાર્થી યાદી (Student Database)"
              >
                <Users className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">વિદ્યાર્થી યાદી</span>
              </button>

              <button
                type="button"
                onClick={exportBackupJson}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="ડેટા બેકઅપ ડાઉનલોડ (Export Backup)"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleImport}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="બેકઅપ ફાઈલ લોડ કરો (Import Backup)"
              >
                <Upload className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="માર્ગદર્શિકા (Help & Guide)"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Firebase Auth Sign In / Sign Out Toggle Button */}
              {firebaseUser ? (
                <div className="flex items-center pl-1 sm:pl-2 border-l border-slate-200 space-x-1 sm:space-x-2">
                  <div className="hidden lg:flex items-center space-x-1 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-1 rounded-lg text-[11px] font-medium" title={firebaseUser.email || 'સક્રિય સત્ર (Active Session)'}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="truncate max-w-[100px]">{firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Logged In'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={logOut}
                    className="inline-flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95"
                    title="Firebase સત્રમાંથી લૉગ આઉટ કરો"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pl-1 sm:pl-2 border-l border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 animate-in fade-in"
                    title="Firebase Auth શિક્ષક સાઇન ઇન"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-sm font-medium flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Student Roster Modal */}
      {showStudentsModal && (
        <StudentRosterModal onClose={() => setShowStudentsModal(false)} />
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-lg text-slate-900">ShalaSarathi માર્ગદર્શિકા</h3>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-900">
                “શિક્ષકનું કામ સરળ બનાવવાનું, શિક્ષણ માટે સમય બચાવવાનું.”
              </p>
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1.5">
                <p className="font-bold">મુખ્ય ત્રણ વિભાગો:</p>
                <p>૧. <span className="font-semibold">Teacher Community:</span> સમગ્ર ગુજરાતના શિક્ષકો દ્વારા શેર કરાયેલા પ્રશ્નપત્રો, વર્કશીટ અને પત્રકો શોધો અને શેર કરો.</p>
                <p>૨. <span className="font-semibold">School Work Assistant:</span> પત્રક A, B, C ઓટોમેશન, રોજમેળ હિસાબ, ગ્રાન્ટ બેલેન્સ, સ્ટેશનરી ખરીદી, PM પોષણ અને પ્રમાણપત્રો.</p>
                <p>૩. <span className="font-semibold">Teaching Tools:</span> GCERT બ્લૂપ્રિન્ટ મુજબ પ્રશ્નપત્ર જનરેટર, પ્રશ્નબેંક અને શિક્ષક દૈનિક નોંધપોથી.</p>
              </div>

              <div className="pt-2">
                <p className="text-xs text-slate-500 mb-2 font-medium">ટેસ્ટિંગ અથવા ફરીથી શરૂ કરવા માટે:</p>
                <button
                  type="button"
                  onClick={() => {
                    resetToDemoData();
                    setShowHelpModal(false);
                  }}
                  className="w-full inline-flex items-center justify-center space-x-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ડેમો ડેટા પુનઃસ્થાપિત કરો (Reset Demo Data)</span>
                </button>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium"
              >
                સમજાયું
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
