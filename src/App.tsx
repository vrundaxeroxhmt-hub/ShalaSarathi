import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { HomeDashboard } from './components/home/HomeDashboard';
import { CommunityView } from './components/community/CommunityView';
import { WorkAssistantHub } from './components/work/WorkAssistantHub';
import { CreatorHub } from './components/creator/CreatorHub';
import { MyWorkView } from './components/mywork/MyWorkView';
import { ProfileModal } from './components/profile/ProfileModal';
import { TeacherProfileView } from './components/profile/TeacherProfileView';
import { StudentRosterModal } from './components/students/StudentRosterModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { WelcomeBackNotification } from './components/common/WelcomeBackNotification';
import { CheckCircle, Shield } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    portalMode,
    setPortalMode,
    activeTab, 
    isProfileModalOpen, 
    setIsProfileModalOpen,
    isStudentModalOpen, 
    setIsStudentModalOpen,
    welcomeNotification,
    dismissWelcomeNotification,
    toastMessage 
  } = useApp();

  // If in Admin Portal Mode, render the dedicated secure Admin Portal
  if (portalMode === 'admin') {
    return (
      <>
        <AdminPortal />
        {welcomeNotification && (
          <WelcomeBackNotification
            name={welcomeNotification.name}
            role={welcomeNotification.role}
            schoolName={welcomeNotification.schoolName}
            email={welcomeNotification.email}
            onDismiss={dismissWelcomeNotification}
          />
        )}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-semibold border border-slate-700 animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  // Teacher Android App View
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-amber-200 selection:text-amber-900">
      
      {/* Top Header */}
      <Header />

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Bar */}
        <Navigation />

        {/* View Switcher */}
        <main className="mt-2">
          {activeTab === 'home' && <HomeDashboard />}
          {activeTab === 'community' && <CommunityView />}
          {activeTab === 'work-assistant' && <WorkAssistantHub />}
          {activeTab === 'create' && <CreatorHub />}
          {activeTab === 'my-work' && <MyWorkView />}
          {activeTab === 'profile' && <TeacherProfileView />}
        </main>
      </div>

      {/* Minimal Footer with discreet admin link */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 ShalaSarathi — શિક્ષકોનું પોતાનું Community. Made for Gujarat Primary Teachers.</p>
          <button
            onClick={() => setPortalMode('admin')}
            className="text-slate-400 hover:text-slate-600 flex items-center space-x-1 text-[11px] transition-colors py-1 px-2 rounded-md hover:bg-slate-100"
            title="સંચાલક / એડમિન લૉગિન"
          >
            <Shield className="w-3 h-3" />
            <span>એડમિન કંટ્રોલ</span>
          </button>
        </div>
      </footer>

      {/* Profile / School Setup Modal */}
      {isProfileModalOpen && (
        <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}

      {/* Student Roster Database Modal */}
      {isStudentModalOpen && (
        <StudentRosterModal onClose={() => setIsStudentModalOpen(false)} />
      )}

      {/* Automatic Welcome Back Notification on Firebase Auth event */}
      {welcomeNotification && (
        <WelcomeBackNotification
          name={welcomeNotification.name}
          role={welcomeNotification.role}
          schoolName={welcomeNotification.schoolName}
          email={welcomeNotification.email}
          onDismiss={dismissWelcomeNotification}
        />
      )}

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-semibold border border-slate-700 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
