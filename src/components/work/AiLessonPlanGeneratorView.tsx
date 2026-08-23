import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AiLessonPlanResult, MonthlyLessonPlan, DailyLessonActivity, DailySubTask } from '../../types';
import {
  GUJARAT_CURRICULUM_STANDARDS,
  GUJARAT_CURRICULUM_SUBJECTS,
  POPULAR_CURRICULUM_PRESETS,
  SAMPLE_CHAPTER_SUGGESTIONS
} from '../../data/gujaratCurriculumData';
import { PdfDocumentViewerModal, PreviewDocType } from './PdfDocumentViewerModal';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  ListChecks,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  FileText,
  Copy,
  Check,
  Printer,
  Download,
  RotateCw,
  Plus,
  Trash2,
  Edit3,
  Sliders,
  Eye,
  AlertCircle,
  Zap,
  HelpCircle,
  Target,
  Lightbulb,
  Boxes,
  Award,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Share2
} from 'lucide-react';

interface AiLessonPlanGeneratorViewProps {
  onBackToHub?: () => void;
  onOpenMonthlyPlans?: () => void;
  initialStandard?: string;
  initialSubject?: string;
}

export const AiLessonPlanGeneratorView: React.FC<AiLessonPlanGeneratorViewProps> = ({
  onBackToHub,
  onOpenMonthlyPlans,
  initialStandard,
  initialSubject,
}) => {
  const { schoolProfile, teacherProfile, addMonthlyLessonPlan, setActiveSubFeature } = useApp();

  // Form State
  const [selectedStandard, setSelectedStandard] = useState<string>(
    initialStandard || 'ધોરણ ૭ (Grade 7)'
  );
  const [selectedSubject, setSelectedSubject] = useState<string>(
    initialSubject || 'ગણિત (Mathematics)'
  );
  const [chapterName, setChapterName] = useState<string>('પ્રકરણ ૧: પૂર્ણાંક સંખ્યાઓ');
  const [topicName, setTopicName] = useState<string>('સંખ્યારેખા નિરૂપણ અને સરવાળા-બાદબાકી');
  const [planType, setPlanType] = useState<'single_period' | 'weekly_block' | 'monthly_breakdown'>('single_period');
  const [pedagogicalFocus, setPedagogicalFocus] = useState<string>('activity_based');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [totalDays, setTotalDays] = useState<number>(1);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Generation & Output State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState<number>(0);
  const [generatedPlan, setGeneratedPlan] = useState<AiLessonPlanResult | null>(null);
  const [planSource, setPlanSource] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedToMonthlyPlan, setSavedToMonthlyPlan] = useState<boolean>(false);

  // Subtask Checkbox state during live review
  const [checkedSubtasks, setCheckedSubtasks] = useState<Record<string, boolean>>({});

  // PDF Viewer Modal
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState<boolean>(false);
  const [pdfDocPreview, setPdfDocPreview] = useState<PreviewDocType | undefined>(undefined);

  // Dynamic subjects based on selected standard
  const availableSubjects = GUJARAT_CURRICULUM_SUBJECTS[selectedStandard] || [
    'ગણિત (Mathematics)',
    'વિજ્ઞાન (Science)',
    'સામાજિક વિજ્ઞાન (Social Science)',
    'ગુજરાતી',
    'અંગ્રેજી',
    'હિન્દી',
    'સંસ્કૃત',
    'પર્યાવરણ',
  ];

  // Subject-specific chapter recommendations
  const chapterSuggestions = React.useMemo(() => {
    for (const [key, list] of Object.entries(SAMPLE_CHAPTER_SUGGESTIONS)) {
      if (selectedSubject.includes(key)) {
        return list;
      }
    }
    return ['એકમ ૧: સંકલ્પના પરિચય', 'એકમ ૨: પ્રાયોગિક સમજ', 'એકમ ૩: સ્વાધ્યાય & મહાવરો'];
  }, [selectedSubject]);

  const loadingSteps = [
    'GCERT પ્રાથમિક અભ્યાસક્રમ ડેટાબેઝ વિશ્લેષણ...',
    'અધ્યયન નિષ્પત્તિઓ (Learning Outcomes - LO Codes) નિર્ધારણ...',
    '5E પદ્ધતિ મુજબ તાસવાર શૈક્ષણિક પ્રવૃત્તિઓ અને TLM ગોઠવણી...',
    'ચેકલિસ્ટ પેટા-કાર્યો (Sub-tasks) અને શ્યામપાટ કાર્ય નિર્માણ...',
    'રચનાત્મક મૂલ્યાંકન પ્રશ્નો અને FLN ઉપચારાત્મક માર્ગદર્શન તૈયાર...',
  ];

  // Handle standard change
  const handleStandardChange = (std: string) => {
    setSelectedStandard(std);
    const subjects = GUJARAT_CURRICULUM_SUBJECTS[std];
    if (subjects && subjects.length > 0) {
      setSelectedSubject(subjects[0]);
    }
  };

  // Handle Preset Click
  const handleApplyPreset = (preset: typeof POPULAR_CURRICULUM_PRESETS[0]) => {
    setSelectedStandard(preset.standard);
    setSelectedSubject(preset.subject);
    setChapterName(preset.chapter);
    setTopicName(preset.topic);
    setPedagogicalFocus(preset.pedagogicalFocus);
    setPlanType(preset.planType);
    setDurationMinutes(preset.durationMinutes);
    if (preset.planType === 'weekly_block') setTotalDays(5);
    else if (preset.planType === 'monthly_breakdown') setTotalDays(20);
    else setTotalDays(1);
  };

  // Trigger AI Generation
  const handleGenerate = async () => {
    setIsLoading(true);
    setLoadingStepIndex(0);
    setGeneratedPlan(null);
    setSavedToMonthlyPlan(false);
    setCheckedSubtasks({});

    const timer = setInterval(() => {
      setLoadingStepIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      const payload = {
        standard: selectedStandard,
        subject: selectedSubject,
        chapter: chapterName,
        topic: topicName,
        planType: planType,
        pedagogicalFocus: pedagogicalFocus,
        durationMinutes: durationMinutes,
        totalDays: planType === 'weekly_block' ? 5 : planType === 'monthly_breakdown' ? 20 : totalDays,
        additionalInstructions: additionalNotes,
      };

      const response = await fetch('/api/gemini/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      clearInterval(timer);

      if (resData.success && resData.data) {
        setGeneratedPlan(resData.data);
        setPlanSource(resData.source || 'gemini_ai');
        
        // Trigger celebratory confetti
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } else {
        throw new Error(resData.errorInfo || 'Failed to parse response');
      }
    } catch (err: any) {
      clearInterval(timer);
      console.error('Error generating lesson plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle checklist subtasks in generated plan
  const toggleSubtaskCheck = (key: string) => {
    setCheckedSubtasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Copy plan text
  const handleCopyText = () => {
    if (!generatedPlan) return;
    const textLines = [
      `=========================================`,
      `ગુજરાત પ્રાથમિક શિક્ષણ - પાઠ આયોજન (GCERT)`,
      `શાળા: ${schoolProfile.schoolName || 'પ્રાથમિક શાળા'}`,
      `શિક્ષક: ${teacherProfile.name || 'વર્ગ શિક્ષક'}`,
      `ધોરણ: ${generatedPlan.standard} | વિષય: ${generatedPlan.subject}`,
      `એકમ/પ્રકરણ: ${generatedPlan.unitName}`,
      `મુખ્ય શીર્ષક: ${generatedPlan.title}`,
      `સમયગાળો: ${generatedPlan.durationMinutes} મિનિટ (${generatedPlan.totalPeriods} તાસ)`,
      `=========================================`,
      `\n🎯 અધ્યયન નિષ્પત્તિઓ (Learning Outcomes):`,
      ...generatedPlan.learningOutcomes.map(lo => `• [${lo.code}] ${lo.description}`),
      `\n📌 સામાન્ય હેતુઓ:`,
      ...generatedPlan.generalObjectives.map(obj => `• ${obj}`),
      `\n🛠️ શૈક્ષણિક સાધન સામગ્રી (TLM):`,
      ...generatedPlan.tlmAndResources.map(tlm => `• ${tlm}`),
      `\n📖 5E પદ્ધતિ મુજબ તબક્કાવાર શિક્ષણ પ્રક્રિયા:`,
      ...generatedPlan.pedagogicalSteps.map(step => [
        `\n[${step.phase}] (${step.durationMin} મિનિટ)`,
        `શિક્ષક પ્રવૃત્તિ: ${step.teacherActivity}`,
        `વિદ્યાર્થી પ્રવૃત્તિ: ${step.studentActivity}`,
        step.blackboardWork ? `શ્યામપાટ કાર્ય: ${step.blackboardWork}` : '',
        `પેટા-કાર્યો (Checklist):`,
        ...step.subTasks.map(st => ` [✓] ${st}`)
      ].filter(Boolean).join('\n')),
      `\n❓ રચનાત્મક મૂલ્યાંકન (Formative Assessment):`,
      ...generatedPlan.formativeAssessment.map((fa, i) => `${i + 1}. ${fa.question}\n   અપેક્ષિત ઉત્તર: ${fa.expectedAnswer}`),
      `\n🌱 FLN & ઉપચારાત્મક માર્ગદર્શન (Remedial):`,
      `• FLN સ્તર: ${generatedPlan.flnAndRemedialGuidance.flnLevel}`,
      `• ઉપચારાત્મક પદ્ધતિ: ${generatedPlan.flnAndRemedialGuidance.remedialStrategy}`,
      `• તેજસ્વી બાળકો માટે: ${generatedPlan.flnAndRemedialGuidance.extensionForAdvanced}`,
      `\n🏠 ગૃહકાર્ય (Homework): ${generatedPlan.homeworkAndAssignment}`,
      `📝 શિક્ષક સ્વ-મૂલ્યાંકન નોંધ: ${generatedPlan.teacherReflectiveNotes}`,
      `=========================================`
    ].join('\n');

    navigator.clipboard.writeText(textLines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Save as Monthly Lesson Plan
  const handleSaveToMonthlyPlans = () => {
    if (!generatedPlan) return;

    const dailyActs: DailyLessonActivity[] = (generatedPlan.dailyActivities && generatedPlan.dailyActivities.length > 0)
      ? generatedPlan.dailyActivities.map((da, idx) => ({
          id: `ai-act-${Date.now()}-${idx}`,
          dayNumber: da.dayNumber || idx + 1,
          title: da.title || `દિવસ ${idx + 1}: ${da.topic || generatedPlan.unitName}`,
          topic: da.topic || generatedPlan.unitName,
          learningOutcome: da.learningOutcome || generatedPlan.learningOutcomes[0]?.code || 'LO-01',
          teachingActivity: da.teachingActivity || generatedPlan.pedagogicalSteps[1]?.teacherActivity || 'સંકલ્પના સ્પષ્ટીકરણ',
          tlmUsed: da.tlmUsed || generatedPlan.tlmAndResources.slice(0, 2).join(', '),
          assessmentMethod: da.assessmentMethod || 'મૌખિક પ્રશ્નોત્તરી & સ્વાધ્યાય તપાસ',
          homework: da.homework || generatedPlan.homeworkAndAssignment,
          subTasks: da.subTasks.map((st, sIdx) => ({
            id: `st-${Date.now()}-${idx}-${sIdx}`,
            taskTitle: st,
            isCompleted: false,
            notifyReminder: true,
          })),
          status: 'આયોજિત',
        }))
      : generatedPlan.pedagogicalSteps.map((step, idx) => ({
          id: `ai-step-${Date.now()}-${idx}`,
          dayNumber: idx + 1,
          title: step.phase,
          topic: generatedPlan.unitName,
          learningOutcome: generatedPlan.learningOutcomes[0]?.code || 'LO-01',
          teachingActivity: step.teacherActivity,
          tlmUsed: generatedPlan.tlmAndResources.slice(0, 3).join(', '),
          assessmentMethod: 'વર્ગખંડ નિરીક્ષણ & 5E મૂલ્યાંકન',
          homework: idx === generatedPlan.pedagogicalSteps.length - 1 ? generatedPlan.homeworkAndAssignment : undefined,
          subTasks: step.subTasks.map((st, sIdx) => ({
            id: `st-${Date.now()}-${idx}-${sIdx}`,
            taskTitle: st,
            isCompleted: false,
            notifyReminder: true,
          })),
          status: 'આયોજિત',
        }));

    const newMonthlyPlan: Omit<MonthlyLessonPlan, 'id' | 'createdAt'> = {
      month: 'ઓગસ્ટ ૨૦૨૬',
      academicYear: '૨૦૨૬-૨૭',
      standard: generatedPlan.standard.split(' ')[0] || generatedPlan.standard,
      division: 'અ',
      subject: generatedPlan.subject.split(' ')[0] || generatedPlan.subject,
      teacherName: teacherProfile.name || 'વર્ગ શિક્ષક',
      schoolName: schoolProfile.schoolName || 'શ્રી પ્રાથમિક શાળા',
      unitsCovered: [generatedPlan.unitName],
      totalPlannedDays: dailyActs.length,
      targetLearningOutcomes: generatedPlan.learningOutcomes.map(lo => `${lo.code}: ${lo.description}`),
      dailyActivities: dailyActs,
      generalObjectives: generatedPlan.generalObjectives.join(' | '),
      status: 'સક્રિય',
    };

    addMonthlyLessonPlan(newMonthlyPlan);
    setSavedToMonthlyPlan(true);

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  // Open PDF Viewer Modal with formatted HTML
  const handleOpenPdfViewer = () => {
    if (!generatedPlan) return;
    
    // Create a mock MonthlyLessonPlan structure to pass to PdfDocumentViewerModal
    const mockPlan: MonthlyLessonPlan = {
      id: `ai-preview-${Date.now()}`,
      month: 'ઓગસ્ટ ૨૦૨૬',
      academicYear: '૨૦૨૬-૨૭',
      standard: generatedPlan.standard,
      subject: generatedPlan.subject,
      teacherName: teacherProfile.name || 'વર્ગ શિક્ષક',
      schoolName: schoolProfile.schoolName || 'શ્રી પ્રાથમિક શાળા',
      unitsCovered: [generatedPlan.unitName],
      totalPlannedDays: generatedPlan.pedagogicalSteps.length,
      targetLearningOutcomes: generatedPlan.learningOutcomes.map(lo => `${lo.code}: ${lo.description}`),
      generalObjectives: generatedPlan.generalObjectives.join(' | '),
      status: 'સક્રિય',
      createdAt: new Date().toISOString(),
      dailyActivities: generatedPlan.pedagogicalSteps.map((step, idx) => ({
        id: `step-${idx}`,
        dayNumber: idx + 1,
        title: step.phase,
        topic: generatedPlan.unitName,
        learningOutcome: generatedPlan.learningOutcomes[0]?.code || 'LO-01',
        teachingActivity: `${step.teacherActivity} | ${step.studentActivity}`,
        tlmUsed: generatedPlan.tlmAndResources.join(', '),
        assessmentMethod: '5E મૂલ્યાંકન & પ્રશ્નોત્તરી',
        homework: idx === generatedPlan.pedagogicalSteps.length - 1 ? generatedPlan.homeworkAndAssignment : undefined,
        status: 'આયોજિત',
        subTasks: step.subTasks.map((st, sIdx) => ({
          id: `st-${idx}-${sIdx}`,
          taskTitle: st,
          isCompleted: !!checkedSubtasks[`${idx}-${sIdx}`]
        }))
      }))
    };

    setPdfDocPreview({
      type: 'monthly_plan',
      plan: mockPlan
    });
    setIsPdfViewerOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        {onBackToHub ? (
          <button
            type="button"
            onClick={onBackToHub}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>પાછા સહાયક હબમાં જાઓ (Back to Hub)</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActiveSubFeature('work-hub')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>પાછા વર્ક સહાયક મેનૂમાં જાઓ</span>
          </button>
        )}

        <div className="flex items-center space-x-2">
          {onOpenMonthlyPlans && (
            <button
              type="button"
              onClick={onOpenMonthlyPlans}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <ListChecks className="w-4 h-4 text-indigo-600" />
              <span>માસિક આયોજન રજિસ્ટર (Monthly Plans)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsPdfViewerOpen(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-amber-600" />
            <span>PDF પ્રિવ્યૂઅર</span>
          </button>
        </div>
      </div>

      {/* Hero Banner with Gemini Powered Badge */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-indigo-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/30 backdrop-blur-md border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span>Gemini AI Driven GCERT Lesson Plan Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI પાઠ આયોજન જનરેટર (AI Lesson Plan Generator)
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              તમારા વિષય અને ધોરણ પસંદ કરો. Gemini AI ક્ષણવારમાં GCERT માનક અનુસાર અધ્યયન નિષ્પત્તિઓ (LOs), 
              5E પદ્ધતિના તબક્કા, વર્ગખંડ TLM, રચનાત્મક પ્રશ્નો અને ચેકલિસ્ટ સહિતનું સંપૂર્ણ પાઠ આયોજન તૈયાર કરશે.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center min-w-[200px]">
              <div className="text-xs text-indigo-200 font-medium">સહાયક મોડ</div>
              <div className="text-base font-bold text-white flex items-center justify-center space-x-1.5 mt-0.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>GCERT 5E મોડેલ</span>
              </div>
              <div className="text-[11px] text-indigo-300 mt-1">સંપૂર્ણ ગુજરાતી પરિભાષા</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form / Generator on Left + Generated Layout on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Preset Quick Picks */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>ઝડપી પસંદગી (One-Click GCERT Presets)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">ક્લિક કરીને ઓટો-ફિલ કરો</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {POPULAR_CURRICULUM_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 group-hover:text-indigo-900">
                    <span>{preset.standard.split(' ')[0]} - {preset.subject.split(' ')[0]}</span>
                    <span className="text-[9px] bg-slate-200 group-hover:bg-indigo-200 text-slate-700 group-hover:text-indigo-800 px-1.5 py-0.5 rounded font-medium">
                      {preset.tag}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 group-hover:text-indigo-700 font-medium truncate mt-0.5">
                    {preset.chapter}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Input Form */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>પાઠ આયોજન વિગતો (Curriculum Configuration)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ધોરણ અને વિષય પસંદ કરી પ્રકરણ અથવા ટોપિક દાખલ કરો
              </p>
            </div>

            {/* 1. Grade / Standard Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>૧. ધોરણ પસંદ કરો (Select Grade Level):</span>
                <span className="text-[11px] text-indigo-600 font-medium">{selectedStandard}</span>
              </label>
              <select
                value={selectedStandard}
                onChange={e => handleStandardChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer"
              >
                {GUJARAT_CURRICULUM_STANDARDS.map(std => (
                  <option key={std} value={std}>
                    {std}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Subject Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>૨. વિષય પસંદ કરો (Select Subject):</span>
                <span className="text-[11px] text-indigo-600 font-medium">{selectedSubject}</span>
              </label>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer"
              >
                {availableSubjects.map(sub => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Chapter Name & Quick Suggestions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                ૩. એકમ / પ્રકરણનું નામ (Chapter / Unit):
              </label>
              <input
                type="text"
                value={chapterName}
                onChange={e => setChapterName(e.target.value)}
                placeholder="દા.ત. પ્રકરણ ૧: પૂર્ણાંક સંખ્યાઓ"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />

              {/* Quick Chapter Suggestions */}
              <div className="pt-1">
                <div className="text-[10px] text-slate-400 font-semibold mb-1">સુચવેલ પ્રકરણો (GCERT Syllabus):</div>
                <div className="flex flex-wrap gap-1">
                  {chapterSuggestions.slice(0, 4).map((ch, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setChapterName(ch)}
                      className="text-[10px] bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer"
                    >
                      {ch.split('(')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Topic / Sub-topic */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                ૪. મુખ્ય મુદ્દો / પેટા ટોપિક (Sub-topic / Concept):
              </label>
              <input
                type="text"
                value={topicName}
                onChange={e => setTopicName(e.target.value)}
                placeholder="દા.ત. સંખ્યારેખા નિરૂપણ, સરવાળા-બાદબાકી, TLM પ્રવૃત્તિ"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* 5. Plan Structure Scope */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                ૫. આયોજન પ્રકાર (Plan Structure Scope):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'single_period', label: '૧-દિવસીય તાસ', desc: '૪૫ મિનિટ વિગતવાર 5E', icon: Clock },
                  { id: 'weekly_block', label: 'સાપ્તાહિક બ્લોક', desc: '૫-દિવસીય એકમ આયોજન', icon: Calendar },
                  { id: 'monthly_breakdown', label: 'માસિક વિભાજન', desc: 'ચેકલિસ્ટ સહિત સંપૂર્ણ', icon: ListChecks },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPlanType(item.id as any);
                      if (item.id === 'weekly_block') setTotalDays(5);
                      else if (item.id === 'monthly_breakdown') setTotalDays(20);
                      else setTotalDays(1);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      planType === item.id
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 ring-2 ring-indigo-500/20 font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 mx-auto mb-1 ${planType === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div className="text-[11px] leading-tight">{item.label}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Pedagogical Focus */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                ૬. શિક્ષણ પદ્ધતિ ફોકસ (Pedagogical Focus):
              </label>
              <select
                value={pedagogicalFocus}
                onChange={e => setPedagogicalFocus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer"
              >
                <option value="activity_based">પ્રવૃત્તિ આધારિત & 5E મોડેલ (Activity-Based & 5E Model)</option>
                <option value="fln_remedial">FLN / પ્રજ્ઞા / ઉપચારાત્મક શિક્ષણ (FLN & Remedial Support)</option>
                <option value="learning_outcomes">GCERT અધ્યયન નિષ્પત્તિ લક્ષી (LO-Driven Pedagogy)</option>
                <option value="lab_experiment">પ્રાયોગિક & પ્રયોગશાળા મોડેલ્સ (Hands-on Lab Experiments)</option>
                <option value="assessment_heavy">રચનાત્મક મૂલ્યાંકન & ક્વિઝ (Assessment & Quiz Centric)</option>
              </select>
            </div>

            {/* 7. Additional Custom Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                ૭. વિશેષ શિક્ષક સૂચનાઓ (Additional Instructions - Optional):
              </label>
              <textarea
                value={additionalNotes}
                onChange={e => setAdditionalNotes(e.target.value)}
                rows={2}
                placeholder="દા.ત. સ્માર્ટ બોર્ડ TLM ઉમેરવું, FLN ધીમી ગતિવાળા બાળકો માટે સાદા દાખલા રાખવા..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Submit / Generate Button */}
            <button
              type="button"
              disabled={isLoading || !chapterName.trim()}
              onClick={handleGenerate}
              className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer ${
                isLoading
                  ? 'bg-indigo-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white active:scale-98 hover:shadow-indigo-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-5 h-5 animate-spin text-white" />
                  <span>Gemini AI પાઠ આયોજન બનાવી રહ્યું છે...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>✨ AI પાઠ આયોજન જનરેટ કરો (Generate Plan)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output / Live Lesson Plan Visualizer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {isLoading && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
              <div className="w-16 h-16 bg-indigo-50 border-2 border-indigo-200 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
                <Sparkles className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  {selectedStandard} {selectedSubject} માટે પાઠ આયોજન તૈયાર થઈ રહ્યું છે
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {loadingSteps[loadingStepIndex]}
                </p>
              </div>

              {/* Progress Steps List */}
              <div className="max-w-md mx-auto space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {loadingSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center space-x-2.5 text-xs font-medium ${
                      idx < loadingStepIndex
                        ? 'text-emerald-700'
                        : idx === loadingStepIndex
                        ? 'text-indigo-700 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {idx < loadingStepIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : idx === loadingStepIndex ? (
                      <RotateCw className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoading && !generatedPlan && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs text-center space-y-5">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto border border-indigo-100 text-indigo-600">
                <BookOpen className="w-10 h-10" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900">
                  પાઠ આયોજન વિગતો પસંદ કરો અને જનરેટ બટન દબાવો
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  ડાબી બાજુ આપેલા ફોર્મમાંથી ધોરણ, વિષય અને પ્રકરણ પસંદ કરો અથવા ઉપરના કોઈ પણ 
                  <strong className="text-indigo-600 font-bold"> "ઝડપી પસંદગી" </strong> કાર્ડ પર ક્લિક કરો.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center space-x-1">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span>GCERT LO કોડ્સ</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">અધ્યયન નિષ્પત્તિ લક્ષી આયોજન</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>5E શૈક્ષણિક તબક્કા</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">પ્રસ્તાવના થી મૂલ્યાંકન</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center space-x-1">
                    <ListChecks className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ચેકલિસ્ટ કાર્યો</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">વર્ગખંડ અમલીકરણ ચેક્સ</div>
                </div>
              </div>
            </div>
          )}

          {!isLoading && generatedPlan && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden space-y-6">
              {/* Output Action Header */}
              <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/60 border border-indigo-400/40 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xs text-indigo-200 font-medium">
                      {planSource === 'gemini_ai' ? 'Gemini 3.7 Flash Model' : 'GCERT Curriculum Engine'}
                    </div>
                    <div className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                      {generatedPlan.title}
                    </div>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveToMonthlyPlans}
                    disabled={savedToMonthlyPlan}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      savedToMonthlyPlan
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                    }`}
                    title="માસિક પાઠ આયોજન રજિસ્ટરમાં ઉમેરો"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{savedToMonthlyPlan ? 'રજિસ્ટરમાં ઉમેરાઈ ગયું ✓' : 'માસિક આયોજનમાં ઉમેરો'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenPdfViewer}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                    title="બિલ્ટ-ઇન PDF પ્રિવ્યૂઅરમાં જુઓ"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-950" />
                    <span>PDF પ્રિવ્યૂ</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                    title="ટેક્સ્ટ કોપી કરો"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-5 sm:p-7 space-y-6">
                {/* Meta Header Badge Box */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-900 text-sm">{generatedPlan.unitName}</div>
                    <div className="text-slate-600 font-medium flex items-center space-x-3">
                      <span><strong>ધોરણ:</strong> {generatedPlan.standard}</span>
                      <span>•</span>
                      <span><strong>વિષય:</strong> {generatedPlan.subject}</span>
                      <span>•</span>
                      <span><strong>સમય:</strong> {generatedPlan.durationMinutes} મિનિટ ({generatedPlan.totalPeriods} તાસ)</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-600 text-white font-bold px-2.5 py-1 rounded-lg text-[11px]">
                      5E Pedagogical
                    </span>
                    <span className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg text-[11px]">
                      GCERT માનક
                    </span>
                  </div>
                </div>

                {/* 1. Learning Outcomes Matrix (અધ્યયન નિષ્પત્તિઓ) */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <span>૧. અધ્યયન નિષ્પત્તિઓ (Target Learning Outcomes - LOs)</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {generatedPlan.learningOutcomes.map((lo, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start space-x-3 text-xs"
                      >
                        <span className="bg-indigo-100 text-indigo-900 font-extrabold px-2 py-0.5 rounded-md text-[11px] shrink-0 border border-indigo-200">
                          {lo.code}
                        </span>
                        <span className="text-slate-800 font-medium leading-relaxed">
                          {lo.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. General Objectives & Prerequisites */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <h5 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>સામાન્ય હેતુઓ (General Objectives):</span>
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {generatedPlan.generalObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <h5 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>પૂર્વજ્ઞાન ચકાસણી (Prerequisites):</span>
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {generatedPlan.prerequisites.map((req, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 3. TLM & Teaching Aids */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Boxes className="w-4 h-4 text-purple-600" />
                    <span>૨. શૈક્ષણિક સાધન સામગ્રી (TLM & Teaching Aids)</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedPlan.tlmAndResources.map((tlm, i) => (
                      <span
                        key={i}
                        className="bg-purple-50 border border-purple-200 text-purple-900 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                        <span>{tlm}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. 5E Pedagogical Timeline with Interactive Sub-tasks */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                      <Layers className="w-4 h-4 text-blue-600" />
                      <span>૩. તબક્કાવાર શૈક્ષણિક પ્રક્રિયા (5E Pedagogical Timeline)</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">વર્ગખંડ દરમિયાન ચેકબોક્સ ટીક કરો</span>
                  </div>

                  <div className="space-y-3">
                    {generatedPlan.pedagogicalSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-indigo-300 transition-all space-y-3"
                      >
                        {/* Step Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 font-extrabold text-xs flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-900">{step.phase}</span>
                          </div>
                          <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[11px] flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{step.durationMin} મિનિટ</span>
                          </span>
                        </div>

                        {/* Activities Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 space-y-1">
                            <span className="font-bold text-blue-900 block text-[11px]">શિક્ષકની પ્રવૃત્તિ:</span>
                            <p className="text-slate-800 leading-relaxed font-medium">{step.teacherActivity}</p>
                          </div>
                          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 space-y-1">
                            <span className="font-bold text-emerald-900 block text-[11px]">વિદ્યાર્થીઓની પ્રવૃત્તિ:</span>
                            <p className="text-slate-800 leading-relaxed font-medium">{step.studentActivity}</p>
                          </div>
                        </div>

                        {step.blackboardWork && (
                          <div className="bg-slate-900 text-slate-100 p-3 rounded-xl text-xs font-mono border border-slate-800 space-y-1">
                            <div className="text-[10px] text-amber-400 font-sans font-bold flex items-center space-x-1">
                              <span>📝 શ્યામપાટ નોંધ (Blackboard Summary):</span>
                            </div>
                            <div className="text-slate-200">{step.blackboardWork}</div>
                          </div>
                        )}

                        {/* Sub-tasks Checklist */}
                        {step.subTasks && step.subTasks.length > 0 && (
                          <div className="pt-1 space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-700">પેટા-કાર્યો (Sub-tasks Checklist):</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {step.subTasks.map((st, sIdx) => {
                                const checkKey = `${idx}-${sIdx}`;
                                const isChecked = !!checkedSubtasks[checkKey];
                                return (
                                  <label
                                    key={sIdx}
                                    onClick={() => toggleSubtaskCheck(checkKey)}
                                    className={`flex items-start space-x-2 p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                                      isChecked
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold line-through opacity-80'
                                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {}}
                                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    />
                                    <span className="leading-snug">{st}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Formative Assessment Questions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>૪. રચનાત્મક મૂલ્યાંકન પ્રશ્નોત્તરી (Formative Assessment)</span>
                  </h4>
                  <div className="space-y-2">
                    {generatedPlan.formativeAssessment.map((fa, i) => (
                      <div
                        key={i}
                        className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-3.5 text-xs space-y-1.5"
                      >
                        <div className="font-bold text-slate-900">{fa.question}</div>
                        <div className="text-slate-600 flex items-start space-x-1.5 text-[11.5px]">
                          <span className="font-bold text-amber-800 shrink-0">અપેક્ષિત જવાબ:</span>
                          <span className="font-medium">{fa.expectedAnswer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. FLN & Differentiated Learning */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>૫. FLN & ઉપચારાત્મક માર્ગદર્શન (Differentiated Learning)</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-indigo-900 block text-[11px]">FLN સ્તર અનુકૂલન:</span>
                      <p className="text-slate-700 leading-relaxed font-medium">{generatedPlan.flnAndRemedialGuidance.flnLevel}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-rose-900 block text-[11px]">ઉપચારાત્મક પદ્ધતિ (Remedial):</span>
                      <p className="text-slate-700 leading-relaxed font-medium">{generatedPlan.flnAndRemedialGuidance.remedialStrategy}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-emerald-900 block text-[11px]">તેજસ્વી બાળકો માટે વિસ્તરણ:</span>
                      <p className="text-slate-700 leading-relaxed font-medium">{generatedPlan.flnAndRemedialGuidance.extensionForAdvanced}</p>
                    </div>
                  </div>
                </div>

                {/* 7. Homework & Teacher Reflection Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 space-y-1.5">
                    <span className="font-bold text-blue-900 flex items-center space-x-1">
                      <span>🏠 ગૃહકાર્ય & સ્વાધ્યાય (Homework):</span>
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">{generatedPlan.homeworkAndAssignment}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
                    <span className="font-bold text-slate-800 flex items-center space-x-1">
                      <span>📝 શિક્ષકની સ્વ-મૂલ્યાંકન નોંધ (Reflective Notes):</span>
                    </span>
                    <p className="text-slate-700 leading-relaxed italic">{generatedPlan.teacherReflectiveNotes}</p>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="border-t border-slate-200 pt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 font-medium">
                    આ પાઠ આયોજન સરકારી નિરીક્ષણ અને દૈનિક ડાયરી માટે માન્ય છે.
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleSaveToMonthlyPlans}
                      disabled={savedToMonthlyPlan}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                        savedToMonthlyPlan
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{savedToMonthlyPlan ? 'રજિસ્ટરમાં સંગ્રહિત ✓' : 'માસિક પાઠ આયોજનમાં ઉમેરો'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenPdfViewer}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-md transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span>PDF પ્રિવ્યૂ & પ્રિન્ટ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Built-in PDF Document Viewer Modal */}
      <PdfDocumentViewerModal
        isOpen={isPdfViewerOpen}
        onClose={() => setIsPdfViewerOpen(false)}
        initialDoc={pdfDocPreview}
      />
    </div>
  );
};
