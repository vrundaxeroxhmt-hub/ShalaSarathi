import React, { useState, useEffect } from 'react';
import { WebSidebar, NavModuleId } from './WebSidebar';
import { WebHeader } from './WebHeader';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { ViewToggleBadge } from './ViewToggleBadge';
import { TeacherProfile } from '@/types/user';
import { PatrakTemplate, PatrakDocument } from '@/types/patrak';
import { RojmelEntry, DeadStockItem } from '@/types/rojmel';
import { Voucher } from '@/types/voucher';
import { PaperTemplate } from '@/types/paperGenerator';
import { SavedDocumentItem } from '@/types/documentLibrary';

// Module Components
import { WebDashboard } from '../modules/Dashboard/WebDashboard';
import { MobileDashboard } from '../modules/Dashboard/MobileDashboard';
import { TeacherProfileModule } from '../modules/TeacherProfile/TeacherProfileModule';
import { PatrakModule } from '../modules/Patrak/PatrakModule';
import { AhevalModule } from '../modules/Aheval/AhevalModule';
import { RojmelModule } from '../modules/Rojmel/RojmelModule';
import { PayableModule } from '../modules/Payable/PayableModule';
import { VoucherModule } from '../modules/Voucher/VoucherModule';
import { PackagesModule } from '../modules/Packages/PackagesModule';
import { AdminPanelModule } from '../modules/Admin/AdminPanelModule';
import { PaperGenModule } from '../modules/PaperGen/PaperGenModule';
import { MyDocsModule } from '../modules/MyDocs/MyDocsModule';
import { GenericModulePlaceholder } from '../modules/Placeholders/GenericModulePlaceholder';
import { VoiceInputModal } from '../voice/VoiceInputModal';

import { AhevalPatrakModule } from '../modules/AhevalPatrak/AhevalPatrakModule';

// Icons
import { Building2, FileOutput, Bell, Settings } from 'lucide-react';

interface Props {
  teacher: TeacherProfile;
  templates: PatrakTemplate[];
  rojmelEntries: RojmelEntry[];
  deadStockItems: DeadStockItem[];
  vouchers: Voucher[];
  paperTemplates: PaperTemplate[];
  savedDocuments: SavedDocumentItem[];
  onSaveProfile: (profile: TeacherProfile) => Promise<void>;
  onSavePatrakDoc: (doc: Omit<PatrakDocument, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onAddRojmelEntry: (entry: Omit<RojmelEntry, 'id' | 'balanceAfter' | 'createdAt'>, linkDeadStock: boolean) => Promise<void>;
  onCreateVoucher: (voucher: Omit<Voucher, 'id' | 'createdAt'>) => Promise<void>;
  onToggleLibFavorite: (id: string) => Promise<void>;
  onDeleteLibDoc: (id: string) => Promise<void>;
  onDuplicateLibDoc: (id: string) => Promise<void>;
}

export const ResponsiveShell: React.FC<Props> = ({
  teacher,
  templates,
  rojmelEntries,
  deadStockItems,
  vouchers,
  paperTemplates,
  savedDocuments,
  onSaveProfile,
  onSavePatrakDoc,
  onAddRojmelEntry,
  onCreateVoucher,
  onToggleLibFavorite,
  onDeleteLibDoc,
  onDuplicateLibDoc
}) => {
  const [activeModule, setActiveModule] = useState<NavModuleId>('dashboard');
  const [viewMode, setViewMode] = useState<'mobile' | 'web'>('web');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Auto-detect mobile screen width on mount
  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth < 768) {
        setViewMode('mobile');
      } else {
        setViewMode('web');
      }
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const getModuleTitle = (): string => {
    switch (activeModule) {
      case 'dashboard': return 'ડેશબોર્ડ (Dashboard)';
      case 'profile': return 'શિક્ષક પ્રોફાઇલ (Teacher Profile)';
      case 'school': return 'શાળા પ્રોફાઇલ (School Profile)';
      case 'aheval_patrak': return '📑 અહેવાલ / પત્રક (Aheval & Patrak)';
      case 'patrak': return '📑 અહેવાલ / પત્રક';
      case 'aheval': return '📑 અહેવાલ / પત્રક';
      case 'rojmel': return 'રોજમેળ અને ડેડ સ્ટોક (Rojmel Ledger)';
      case 'payable': return 'ઉધારી વ્યવસ્થા (Payable Credit Purchases)';
      case 'voucher': return 'વાઉચર જનરેટર (Voucher Module)';
      case 'paper': return 'પેપર જનરેટર (Paper Generator)';
      case 'docgen': return 'દસ્તાવેજ નમૂના (Document Generator)';
      case 'mydocs': return 'મારા સેવ થયેલ ફાઇલો (My Documents)';
      case 'packages': return 'સબ્સ્ક્રિપ્શન પ્લાન (Subscription Packages)';
      case 'notifications': return 'સિસ્ટમ નોટિફિકેશન (Notifications)';
      case 'settings': return 'સેટિંગ્સ (Settings)';
      case 'admin': return 'એડમિન માસ્ટર સેન્ટર (Admin Control)';
      default: return 'શાળા સારથિ v2';
    }
  };

  const renderModuleContent = () => {
    const isMobile = viewMode === 'mobile';

    switch (activeModule) {
      case 'dashboard':
        return isMobile ? (
          <MobileDashboard
            teacher={teacher}
            onNavigate={setActiveModule}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            rojmelEntries={rojmelEntries}
          />
        ) : (
          <WebDashboard
            teacher={teacher}
            onNavigate={setActiveModule}
            rojmelEntries={rojmelEntries}
          />
        );

      case 'profile':
        return <TeacherProfileModule profile={teacher} onSaveProfile={onSaveProfile} />;

      case 'aheval_patrak':
      case 'patrak':
      case 'aheval':
        return (
          <AhevalPatrakModule
            teacher={teacher}
            rojmelEntries={rojmelEntries}
            isMobile={isMobile}
            onOpenParishishtModal={() => setActiveModule('rojmel')}
          />
        );

      case 'rojmel':
        return (
          <RojmelModule
            entries={rojmelEntries}
            deadStockItems={deadStockItems}
            teacher={teacher}
            onAddEntry={onAddRojmelEntry}
          />
        );

      case 'payable':
        return <PayableModule teacher={teacher} isMobile={isMobile} />;

      case 'voucher':
        return <VoucherModule vouchers={vouchers} teacher={teacher} onCreateVoucher={onCreateVoucher} isMobile={isMobile} />;

      case 'paper':
        return <PaperGenModule templates={paperTemplates} teacher={teacher} />;

      case 'mydocs':
        return (
          <MyDocsModule
            documents={savedDocuments}
            onToggleFavorite={onToggleLibFavorite}
            onDeleteDocument={onDeleteLibDoc}
            onDuplicateDocument={onDuplicateLibDoc}
          />
        );

      case 'packages':
        return <PackagesModule />;

      case 'admin':
        return <AdminPanelModule />;

      case 'school':
        return (
          <GenericModulePlaceholder
            titleGuj="શાળા પ્રોફાઇલ અને યુ-ડાયસ મેનેજમેન્ટ"
            titleEng="School Profile & UDISE Management"
            descriptionGuj="શાળાનું સરનામું, પે-સેન્ટર, ક્લસ્ટર વિગત અને સ્ટાફ લિસ્ટ એક જ જગ્યાએ સેટઅપ કરો."
            icon={Building2}
          />
        );

      case 'docgen':
        return (
          <GenericModulePlaceholder
            titleGuj="દસ્તાવેજ અને પ્રમાણપત્ર જનરેટર"
            titleEng="Certificate & Notice Generator"
            descriptionGuj="દાખલા, પ્રમાણપત્રો, નોટિસ અને સત્તાવાર પત્રોના તૈયાર ફોર્મેટ્સ."
            icon={FileOutput}
          />
        );

      case 'notifications':
        return (
          <GenericModulePlaceholder
            titleGuj="સરકારી પરિપત્ર નોટિફિકેશન"
            titleEng="Government Notifications & Updates"
            descriptionGuj="શિક્ષણ વિભાગના લેટેસ્ટ પરિપત્રો અને એપ્લિકેશન અપડેટ્સ."
            icon={Bell}
          />
        );

      case 'settings':
        return (
          <GenericModulePlaceholder
            titleGuj="સિસ્ટમ અને એપ્લિકેશન સેટિંગ્સ"
            titleEng="App Settings & Backup"
            descriptionGuj="લોકલ ડેટાબેઝ બેકઅપ, ગુજરાતી ફોન્ટ સાઇઝ અને પ્રિન્ટ કોન્ફિગરેશન."
            icon={Settings}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased">
      {/* Floating View Switcher Badge (Mobile UI vs Web UI toggle) */}
      <ViewToggleBadge currentViewMode={viewMode} onToggle={setViewMode} />

      {/* Voice Assistant Dialog */}
      <VoiceInputModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />

      {/* Layout Mode Rendering */}
      {viewMode === 'web' ? (
        /* WEB DESKTOP LAYOUT (Left Sidebar + Header + SaaS Workspace) */
        <div className="flex flex-1 min-h-screen">
          <WebSidebar activeModule={activeModule} onSelectModule={setActiveModule} teacher={teacher} />
          
          <div className="flex-1 flex flex-col min-w-0">
            <WebHeader
              teacher={teacher}
              activeModuleTitle={getModuleTitle()}
              onOpenNotifications={() => setActiveModule('notifications')}
            />
            <main className="flex-1 overflow-y-auto">
              {renderModuleContent()}
            </main>
          </div>
        </div>
      ) : (
        /* MOBILE APP LAYOUT (Header + Touch Workspace + Bottom Tab Bar) */
        <div className="flex flex-1 flex-col min-h-screen">
          <MobileHeader teacher={teacher} onOpenVoice={() => setIsVoiceModalOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            {renderModuleContent()}
          </main>
          <MobileBottomNav activeModule={activeModule} onSelectModule={setActiveModule} />
        </div>
      )}
    </div>
  );
};
