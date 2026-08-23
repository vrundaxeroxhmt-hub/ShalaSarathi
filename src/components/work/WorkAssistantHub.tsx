import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubFeatureType } from '../../types';
import { PatrakView } from '../patrak/PatrakView';
import { RojmelView } from '../rojmel/RojmelView';
import { PurchasesView } from '../purchases/PurchasesView';
import { PmPoshanView } from '../pmposhan/PmPoshanView';
import { LettersCertificatesView } from '../letters/LettersCertificatesView';
import { DownloadableResourcesView } from './DownloadableResourcesView';
import { UploadResourceView } from './UploadResourceView';
import { UploadResourceModal } from './UploadResourceModal';
import { MonthlyLessonPlanView } from './MonthlyLessonPlanView';
import { AiLessonPlanGeneratorView } from './AiLessonPlanGeneratorView';
import { AiLessonPlanGeneratorModal } from './AiLessonPlanGeneratorModal';
import { PdfDocumentViewerModal, PreviewDocType } from './PdfDocumentViewerModal';
import { 
  FileSpreadsheet, 
  Wallet, 
  Landmark, 
  ShoppingCart, 
  UtensilsCrossed, 
  FileText, 
  ArrowLeft,
  Sparkles,
  ArrowRight,
  FolderDown,
  Download,
  BookOpen,
  Calendar,
  Layers,
  FileCheck,
  Upload,
  Share2,
  Users,
  ListChecks,
  Eye,
  Printer
} from 'lucide-react';

export const WorkAssistantHub: React.FC = () => {
  const { activeSubFeature, setActiveSubFeature, uploadedTemplates, monthlyLessonPlans } = useApp();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState<PreviewDocType | undefined>(undefined);

  const modules = [
    {
      id: 'ai-lesson-plan' as SubFeatureType,
      title: 'AI પાઠ આયોજન જનરેટર (AI Lesson Plan Generator)',
      desc: 'Gemini AI દ્વારા ધોરણ અને વિષય પસંદ કરીને GCERT 5E માળખું, અધ્યયન નિષ્પત્તિઓ (LOs), TLM અને દૈનિક ચેકલિસ્ટ સેકન્ડોમાં બનાવો',
      icon: Sparkles,
      badge: 'Gemini AI ⚡',
      color: 'bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white',
      cardBg: 'hover:border-purple-400 ring-2 ring-purple-500/25 bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/40'
    },
    {
      id: 'monthly-lesson-plan' as SubFeatureType,
      title: 'માસિક પાઠ આયોજન & દૈનિક ચેકલિસ્ટ (Daily Lesson Breakdown)',
      desc: 'માસિક પાઠ આયોજનને તાસવાર દૈનિક વર્ગખંડ પ્રવૃત્તિઓ, TLM અને ચેક કરી શકાય તેવા પેટા-કાર્યો (Sub-tasks) માં વિભાજિત કરો',
      icon: ListChecks,
      badge: 'દૈનિક ચેકલિસ્ટ 📋',
      color: 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white',
      cardBg: 'hover:border-indigo-300 ring-1 ring-indigo-500/20'
    },
    {
      id: 'upload-resource' as SubFeatureType,
      title: 'સંસાધન અપલોડ & શેરિંગ (Upload Resource)',
      desc: 'તમારા પોતાના લેસન પ્લાન, વર્કશીટ અને શાળા દસ્તાવેજો અપલોડ કરો અને ગુજરાત શિક્ષક સમુદાય સાથે લાઈવ શેર કરો',
      icon: Upload,
      badge: 'શેરિંગ સક્રિય 🌐',
      color: 'bg-gradient-to-r from-rose-600 to-amber-600 text-white',
      cardBg: 'hover:border-amber-300 ring-1 ring-amber-500/20'
    },
    {
      id: 'downloadable-resources' as SubFeatureType,
      title: 'ડાઉનલોડેબલ સાધન ભંડાર (Downloadable Resources)',
      desc: 'તૈયાર પાઠ આયોજન (Lesson Plans), વર્ગખંડ હાજરી & સમયપત્રક નમૂનાઓ, SMC ઠરાવ પત્રકો અને FLN સાહિત્ય',
      icon: FolderDown,
      badge: 'પ્રિન્ટ રેડી / A4',
      color: 'bg-rose-600 text-white',
      cardBg: 'hover:border-rose-300'
    },
    {
      id: 'patrak-automation' as SubFeatureType,
      title: 'પત્રક ઓટોમેશન (Patrak Automation)',
      desc: 'પત્રક A (રચનાત્મક મૂલ્યાંકન), પત્રક B (વ્યક્તિત્વ વિકાસ), પત્રક C (પરિણામ પત્રક)',
      icon: FileSpreadsheet,
      badge: 'ઓટોમેટેડ',
      color: 'bg-emerald-500 text-white',
      cardBg: 'hover:border-emerald-300'
    },
    {
      id: 'rojmel' as SubFeatureType,
      title: 'રોજમેળ અને વાઉચર્સ (Rojmel & Vouchers)',
      desc: 'દૈનિક રોકડમેળ, આવક-જાવક નોંધ, ઓડિટ-સેફ વાઉચર્સ અને બેલેન્સ હિસાબ',
      icon: Wallet,
      badge: 'ઓડિટ-સેફ',
      color: 'bg-blue-600 text-white',
      cardBg: 'hover:border-blue-300'
    },
    {
      id: 'grants' as SubFeatureType,
      title: 'શાળા ગ્રાન્ટ એકાઉન્ટ્સ (School Grants)',
      desc: 'કોમ્પોઝીટ સ્કૂલ ગ્રાન્ટ, સ્પોર્ટ્સ, સ્વચ્છતા, TLM અને પુસ્તકાલય ગ્રાન્ટ',
      icon: Landmark,
      badge: 'PFMS લિંક્ડ',
      color: 'bg-purple-600 text-white',
      cardBg: 'hover:border-purple-300'
    },
    {
      id: 'purchases' as SubFeatureType,
      title: 'સ્ટેશનરી ખરીદી રજિસ્ટર (Purchases)',
      desc: 'ઝેરોક્ષ, પેપર, સ્ટેશનરી બિલ એન્ટ્રી અને આપોઆપ રોજમેળ એન્ટ્રી',
      icon: ShoppingCart,
      badge: 'ઓટો-વાઉચર',
      color: 'bg-amber-600 text-white',
      cardBg: 'hover:border-amber-300'
    },
    {
      id: 'pm-poshan' as SubFeatureType,
      title: 'PM પોષણ દૈનિક કેલ્ક્યુલેટર (MDM Register)',
      desc: 'પ્રાથમિક અને ઉચ્ચ પ્રાથમિક દૈનિક અનાજ વપરાશ (કિગ્રા) અને કુકિંગ કોસ્ટ',
      icon: UtensilsCrossed,
      badge: 'સરકારી નિયમો',
      color: 'bg-orange-600 text-white',
      cardBg: 'hover:border-orange-300'
    },
    {
      id: 'letters-certificates' as SubFeatureType,
      title: 'લેટર્સ અને પ્રમાણપત્રો (Certificates)',
      desc: 'બોનાફાઈડ સર્ટિફિકેટ, SMC નોટિસ, રજા અરજી અને શાળા લેટરપેડ',
      icon: FileText,
      badge: 'A4 પ્રિન્ટેબલ',
      color: 'bg-cyan-600 text-white',
      cardBg: 'hover:border-cyan-300'
    }
  ];

  // Render specific sub-view if selected
  if (activeSubFeature === 'ai-lesson-plan') {
    return (
      <AiLessonPlanGeneratorView
        onBackToHub={() => setActiveSubFeature('work-hub')}
        onOpenMonthlyPlans={() => setActiveSubFeature('monthly-lesson-plan')}
      />
    );
  }

  if (activeSubFeature === 'monthly-lesson-plan') {
    return (
      <div>
        <div className="mb-4 no-print">
          <button
            type="button"
            onClick={() => setActiveSubFeature('work-hub')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>પાછા સહાયક મેનૂમાં જાઓ (Back to Hub)</span>
          </button>
        </div>
        <MonthlyLessonPlanView onBack={() => setActiveSubFeature('work-hub')} />
      </div>
    );
  }

  if (activeSubFeature === 'upload-resource') {
    return (
      <div>
        <UploadResourceView onBack={() => setActiveSubFeature('work-hub')} />
      </div>
    );
  }

  if (activeSubFeature === 'downloadable-resources') {
    return (
      <div>
        <div className="mb-4 no-print">
          <button
            type="button"
            onClick={() => setActiveSubFeature('work-hub')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>પાછા સહાયક મેનૂમાં જાઓ</span>
          </button>
        </div>
        <DownloadableResourcesView />
      </div>
    );
  }

  if (activeSubFeature === 'patrak-automation') {
    return (
      <div>
        <div className="mb-4 no-print">
          <button
            type="button"
            onClick={() => setActiveSubFeature('work-hub')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>પાછા સહાયક મેનૂમાં જાઓ</span>
          </button>
        </div>
        <PatrakView />
      </div>
    );
  }

  if (activeSubFeature === 'rojmel' || activeSubFeature === 'grants') {
    return (
      <div>
        <div className="mb-4 no-print">
          <button
            type="button"
            onClick={() => setActiveSubFeature('work-hub')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>પાછા સહાયક મેનૂમાં જાઓ</span>
          </button>
        </div>
        <RojmelView />
      </div>
    );
  }

  if (activeSubFeature === 'purchases') {
    return (
      <div>
        <div className="mb-4 no-print">
          <button
            type="button"
            onClick={() => setActiveSubFeature('work-hub')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>પાછા સહાયક મેનૂમાં જાઓ</span>
          </button>
        </div>
        <PurchasesView />
      </div>
    );
  }

  if (activeSubFeature === 'pm-poshan') {
    return (
      <div>
        <div className="mb-4 no-print">
          <button
            type="button"
            onClick={() => setActiveSubFeature('work-hub')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>પાછા સહાયક મેનૂમાં જાઓ</span>
          </button>
        </div>
        <PmPoshanView />
      </div>
    );
  }

  if (activeSubFeature === 'letters-certificates') {
    return (
      <div>
        <div className="mb-4 no-print">
          <button
            type="button"
            onClick={() => setActiveSubFeature('work-hub')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>પાછા સહાયક મેનૂમાં જાઓ</span>
          </button>
        </div>
        <LettersCertificatesView />
      </div>
    );
  }

  // Otherwise render Work Assistant Hub menu
  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <FileSpreadsheet className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              શાળા કાર્ય સહાયક (School Work Assistant)
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            શિક્ષકોના દૈનિક કાગળકામ, પત્રકો, તૈયાર પાઠ આયોજન અને હિસાબી કામગીરીને મિનિટોમાં આસાન બનાવતું સંપૂર્ણ ઓટોમેશન પ્લેટફોર્મ.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubFeature('ai-lesson-plan')}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer"
            id="hub-ai-lesson-plan-btn"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>✨ AI લેસન પ્લાન (Gemini 3.7)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (monthlyLessonPlans.length > 0) {
                setSelectedPdfDoc({ type: 'monthly_plan', plan: monthlyLessonPlans[0] });
              }
              setIsPdfViewerOpen(true);
            }}
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xs transition-all cursor-pointer border border-slate-750"
            title="લેસન પ્લાન & ટેમ્પ્લેટ્સ PDF પ્રિવ્યૂઅરમાં જુઓ"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>PDF પ્રિવ્યૂઅર</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubFeature('upload-resource')}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            id="hub-upload-resource-btn"
          >
            <Upload className="w-4 h-4" />
            <span>+ સંસાધન અપલોડ કરો</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubFeature('downloadable-resources')}
            className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <FolderDown className="w-4 h-4 text-rose-600" />
            <span>સાધન ભંડાર ({uploadedTemplates.length + 8})</span>
          </button>
        </div>
      </div>

      {/* Featured AI Lesson Plan Generator Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-indigo-700/50 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/30 backdrop-blur-xs border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>નવું ફીચર: Gemini AI સંચાલિત GCERT લેસન પ્લાનિંગ</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            કોઈપણ ધોરણ અને વિષય માટે ક્ષણવારમાં સચોટ પાઠ આયોજન બનાવો
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            અધ્યયન નિષ્પત્તિઓ (LO Codes), 5E પદ્ધતિ મુજબ તાસવાર વિભાજન, વર્ગખંડ TLM અને દૈનિક ચેકલિસ્ટ સહિતનું પ્રમાણિત આયોજન.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubFeature('ai-lesson-plan')}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>AI પાઠ આયોજન બનાવો →</span>
          </button>
        </div>
      </div>

      {/* Featured Banner Callout for Upload Resource & Community Sharing */}
      <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-orange-50 border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md text-[10px] font-bold mb-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>ગુજરાત શિક્ષક સમુદાય સહયોગ</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              તમારા લેસન પ્લાન અને શાળા દસ્તાવેજો કમ્યુનિટી સાથે શેર કરો!
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
              તમે જાતે બનાવેલા ગણિત, વિજ્ઞાન, ભાષાના પાઠ આયોજન, વર્કશીટ્સ અને SMC ઠરાવ પત્રકો અપલોડ કરી અન્ય શિક્ષકોને મદદરૂપ બનો.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubFeature('upload-resource')}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>સાધન અપલોડ કરો</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveSubFeature('downloadable-resources')}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-xs"
          >
            <span>બધા સાધનો</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Work Assistant Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              onClick={() => setActiveSubFeature(mod.id)}
              className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${mod.cardBg}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${mod.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {mod.badge}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {mod.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>મોડ્યુલ ખોલો</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Built-in PDF Document Viewer Modal */}
      <PdfDocumentViewerModal
        isOpen={isPdfViewerOpen}
        onClose={() => setIsPdfViewerOpen(false)}
        initialDoc={selectedPdfDoc}
      />

    </div>
  );
};
