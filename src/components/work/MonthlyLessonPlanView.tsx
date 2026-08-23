import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MonthlyLessonPlan, DailyLessonActivity, DailySubTask } from '../../types';
import { CreateMonthlyPlanModal } from './CreateMonthlyPlanModal';
import { CreateDailyActivityModal } from './CreateDailyActivityModal';
import { PrintMonthlyLessonPlanModal } from './PrintMonthlyLessonPlanModal';
import { PdfDocumentViewerModal, PreviewDocType } from './PdfDocumentViewerModal';
import { AiLessonPlanGeneratorModal } from './AiLessonPlanGeneratorModal';
import {
  Calendar,
  BookOpen,
  ListChecks,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit3,
  Printer,
  Search,
  Filter,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  CheckSquare,
  Award,
  TrendingUp,
  RotateCcw,
  ArrowRight,
  BookMarked,
  FileCheck,
  AlertCircle,
  Eye,
  Download,
  Bell,
  BellRing,
  BellOff
} from 'lucide-react';

interface MonthlyLessonPlanViewProps {
  onBack?: () => void;
}

export const MonthlyLessonPlanView: React.FC<MonthlyLessonPlanViewProps> = ({ onBack }) => {
  const {
    monthlyLessonPlans,
    addMonthlyLessonPlan,
    updateMonthlyLessonPlan,
    deleteMonthlyLessonPlan,
    toggleDailySubTask,
    toggleSubTaskNotification,
    toggleAllSubTasksNotification,
    addDailyActivity,
    updateDailyActivity,
    deleteDailyActivity,
    addDailySubTask,
    deleteDailySubTask,
    toggleDailyActivityStatus,
    resetMonthlyPlansToDefault,
    setActiveSubFeature
  } = useApp();

  // Active Plan Selection
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    monthlyLessonPlans.length > 0 ? monthlyLessonPlans[0].id : ''
  );

  // Filters and Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Modals state
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<MonthlyLessonPlan | null>(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState<boolean>(false);
  const [editingActivity, setEditingActivity] = useState<DailyLessonActivity | null>(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState<boolean>(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState<boolean>(false);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState<PreviewDocType | undefined>(undefined);

  // Inline subtask input per activity
  const [inlineSubTaskInputs, setInlineSubTaskInputs] = useState<{ [activityId: string]: string }>({});

  // Expanded LOs toggle
  const [isLoAccordionOpen, setIsLoAccordionOpen] = useState<boolean>(true);

  // Active Plan
  const currentPlan = useMemo(() => {
    return monthlyLessonPlans.find(p => p.id === selectedPlanId) || monthlyLessonPlans[0] || null;
  }, [monthlyLessonPlans, selectedPlanId]);

  // Filtered Plans list
  const filteredPlans = useMemo(() => {
    return monthlyLessonPlans.filter(plan => {
      if (selectedStandard !== 'all' && plan.standard !== selectedStandard) return false;
      if (selectedSubject !== 'all' && plan.subject !== selectedSubject) return false;
      if (selectedMonth !== 'all' && plan.month !== selectedMonth) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSubject = plan.subject.toLowerCase().includes(q);
        const matchesMonth = plan.month.toLowerCase().includes(q);
        const matchesUnits = plan.unitsCovered.some(u => u.toLowerCase().includes(q));
        const matchesActivities = plan.dailyActivities.some(
          a => a.title.toLowerCase().includes(q) || a.topic.toLowerCase().includes(q)
        );
        if (!matchesSubject && !matchesMonth && !matchesUnits && !matchesActivities) {
          return false;
        }
      }
      return true;
    });
  }, [monthlyLessonPlans, selectedStandard, selectedSubject, selectedMonth, searchQuery]);

  // Overall Statistics across all plans
  const stats = useMemo(() => {
    const totalPlans = monthlyLessonPlans.length;
    let totalActivities = 0;
    let completedActivities = 0;
    let totalSubTasks = 0;
    let completedSubTasks = 0;

    monthlyLessonPlans.forEach(p => {
      totalActivities += p.dailyActivities.length;
      p.dailyActivities.forEach(act => {
        if (act.status === 'પૂર્ણ') completedActivities++;
        totalSubTasks += act.subTasks.length;
        completedSubTasks += act.subTasks.filter(st => st.isCompleted).length;
      });
    });

    const completionRate = totalSubTasks > 0 ? Math.round((completedSubTasks / totalSubTasks) * 100) : 0;

    return {
      totalPlans,
      totalActivities,
      completedActivities,
      totalSubTasks,
      completedSubTasks,
      completionRate
    };
  }, [monthlyLessonPlans]);

  // Active Plan Specific Stats
  const currentPlanStats = useMemo(() => {
    if (!currentPlan) return { totalDays: 0, completedDays: 0, totalTasks: 0, completedTasks: 0, percent: 0 };
    const totalDays = currentPlan.dailyActivities.length;
    const completedDays = currentPlan.dailyActivities.filter(a => a.status === 'પૂર્ણ').length;
    let totalTasks = 0;
    let completedTasks = 0;
    currentPlan.dailyActivities.forEach(a => {
      totalTasks += a.subTasks.length;
      completedTasks += a.subTasks.filter(t => t.isCompleted).length;
    });
    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { totalDays, completedDays, totalTasks, completedTasks, percent };
  }, [currentPlan]);

  const handleInlineAddSubTask = (activityId: string) => {
    const text = inlineSubTaskInputs[activityId]?.trim();
    if (!text || !currentPlan) return;
    addDailySubTask(currentPlan.id, activityId, text);
    setInlineSubTaskInputs(prev => ({ ...prev, [activityId]: '' }));
  };

  const handleSaveMonthlyPlan = (planData: Omit<MonthlyLessonPlan, 'id' | 'createdAt'>) => {
    if (editingPlan) {
      updateMonthlyLessonPlan(editingPlan.id, planData);
    } else {
      addMonthlyLessonPlan(planData);
    }
    setEditingPlan(null);
  };

  const handleSaveDailyActivity = (activityData: Omit<DailyLessonActivity, 'id'>) => {
    if (!currentPlan) return;
    if (editingActivity) {
      updateDailyActivity(currentPlan.id, editingActivity.id, activityData);
    } else {
      addDailyActivity(currentPlan.id, activityData);
    }
    setEditingActivity(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-200 text-xs font-semibold mb-2 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>માસિક પાઠ આયોજન & દૈનિક પ્રવૃત્તિ વિભાજન (Daily Lesson Breakdown)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              માસિક પાઠ આયોજન અને દૈનિક ચેકલિસ્ટ
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
              માસિક પાઠ્યક્રમને તાસવાર દૈનિક વર્ગખંડ પ્રવૃત્તિઓ, TLM, અધ્યયન નિષ્પત્તિઓ અને ચેક કરી શકાય તેવા પેટા-કાર્યો (Checkable Sub-tasks) માં વિભાજિત કરો.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAiGeneratorOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-900/30 cursor-pointer transition-all hover:scale-102"
              title="Gemini AI દ્વારા પાઠ આયોજન બનાવો"
              id="monthly-plan-ai-generator-btn"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>✨ AI આયોજન સૂચનો (Gemini)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingPlan(null);
                setIsCreatePlanModalOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/30 cursor-pointer transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>+ નવું માસિક આયોજન</span>
            </button>

            {currentPlan && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPdfDoc({ type: 'monthly_plan', plan: currentPlan });
                    setIsPdfViewerOpen(true);
                  }}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md cursor-pointer transition-colors"
                  title="બિલ્ટ-ઇન PDF પ્રિવ્યૂઅરમાં દસ્તાવેજ જુઓ અને ડાઉનલોડ કરો"
                >
                  <Eye className="w-4 h-4 text-slate-950" />
                  <span>PDF પ્રિવ્યૂઅર</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold backdrop-blur-xs cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4 text-emerald-300" />
                  <span>A4 પ્રિન્ટ રજિસ્ટર</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={resetMonthlyPlansToDefault}
              className="p-2.5 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs cursor-pointer transition-colors"
              title="ડિફોલ્ટ ડેમો આયોજનો પુનઃસ્થાપિત કરો"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Aggregate Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-[11px] text-slate-300 block">કુલ માસિક આયોજનો</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-white">{stats.totalPlans} પ્લાન</span>
              <BookMarked className="w-5 h-5 text-indigo-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-[11px] text-slate-300 block">આયોજિત દૈનિક તાસ/દિવસો</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-white">{stats.totalActivities} દિવસો</span>
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-[11px] text-slate-300 block">પેટા-કાર્યો પૂર્ણતા (Sub-tasks)</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-emerald-400">
                {stats.completedSubTasks} / {stats.totalSubTasks}
              </span>
              <ListChecks className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-[11px] text-slate-300 block">સમગ્ર વર્ગખંડ પ્રગતિ</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-amber-300">{stats.completionRate}%</span>
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Left/Top Selector + Right/Bottom Plan Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Plan Selector & Filters (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>માસિક આયોજન સૂચિ ({filteredPlans.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingPlan(null);
                  setIsCreatePlanModalOpen(true);
                }}
                className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
              >
                + નવું ઉમેરો
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="પ્રકરણ, વિષય અથવા મહિનો શોધો..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50"
              />
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedStandard}
                onChange={e => setSelectedStandard(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-hidden bg-white text-slate-700 font-medium"
              >
                <option value="all">બધા ધોરણ (All)</option>
                <option value="ધોરણ ૩">ધોરણ ૩</option>
                <option value="ધોરણ ૪">ધોરણ ૪</option>
                <option value="ધોરણ ૫">ધોરણ ૫</option>
                <option value="ધોરણ ૬">ધોરણ ૬</option>
                <option value="ધોરણ ૭">ધોરણ ૭</option>
                <option value="ધોરણ ૮">ધોરણ ૮</option>
              </select>

              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-hidden bg-white text-slate-700 font-medium"
              >
                <option value="all">બધા વિષયો (All)</option>
                <option value="ગણિત">ગણિત</option>
                <option value="વિજ્ઞાન">વિજ્ઞાન</option>
                <option value="સામાજિક વિજ્ઞાન">સામાજિક વિજ્ઞાન</option>
                <option value="ગુજરાતી">ગુજરાતી</option>
                <option value="અંગ્રેજી">અંગ્રેજી</option>
                <option value="હિન્દી">હિન્દી</option>
                <option value="સંસ્કૃત">સંસ્કૃત</option>
              </select>
            </div>

            {/* Plans List */}
            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1 pt-1">
              {filteredPlans.length === 0 ? (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl p-4">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs">કોઈ માસિક આયોજન મળ્યું નથી</p>
                </div>
              ) : (
                filteredPlans.map(plan => {
                  const isSelected = plan.id === (currentPlan?.id || '');
                  const planTotalTasks = plan.dailyActivities.reduce((acc, a) => acc + a.subTasks.length, 0);
                  const planDoneTasks = plan.dailyActivities.reduce(
                    (acc, a) => acc + a.subTasks.filter(t => t.isCompleted).length,
                    0
                  );
                  const planPercent = planTotalTasks > 0 ? Math.round((planDoneTasks / planTotalTasks) * 100) : 0;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                              {plan.standard} ({plan.division})
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">
                              {plan.subject}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 mt-1.5">
                            {plan.month} • {plan.subject}
                          </h4>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          plan.status === 'પૂર્ણ' ? 'bg-emerald-100 text-emerald-800' :
                          plan.status === 'સક્રિય' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {plan.status}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-600 line-clamp-1">
                        {plan.unitsCovered.join(', ')}
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">
                          {plan.dailyActivities.length} દિવસો • {planDoneTasks}/{planTotalTasks} કાર્યો
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPlanId(plan.id);
                              setSelectedPdfDoc({ type: 'monthly_plan', plan });
                              setIsPdfViewerOpen(true);
                            }}
                            className="p-1 hover:bg-amber-100 text-amber-800 rounded-md text-[10px] font-bold flex items-center space-x-0.5 cursor-pointer"
                            title="આ પ્લાન PDF પ્રિવ્યૂઅરમાં જુઓ"
                          >
                            <Eye className="w-3 h-3 text-amber-700" />
                            <span>PDF</span>
                          </button>
                          <span className="font-bold text-blue-700">{planPercent}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${planPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Plan Detailed Breakdown (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {currentPlan ? (
            <>
              {/* Active Plan Header Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-100 text-blue-900 rounded-lg">
                        {currentPlan.standard} ({currentPlan.division})
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 bg-indigo-100 text-indigo-900 rounded-lg">
                        {currentPlan.subject}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-lg">
                        {currentPlan.month}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        વર્ષ {currentPlan.academicYear}
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-slate-900">
                      {currentPlan.month} - {currentPlan.subject} માસિક પાઠ આયોજન
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      શિક્ષક: <span className="font-bold text-slate-700">{currentPlan.teacherName}</span> • શાળા:{' '}
                      <span className="font-bold text-slate-700">{currentPlan.schoolName}</span>
                    </p>
                  </div>

                  {/* Actions for this plan */}
                  <div className="flex items-center space-x-2 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPdfDoc({ type: 'monthly_plan', plan: currentPlan });
                        setIsPdfViewerOpen(true);
                      }}
                      className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors cursor-pointer shadow-2xs"
                      title="બિલ્ટ-ઇન PDF પ્રિવ્યૂઅરમાં દસ્તાવેજ જુઓ (iframe / object tag)"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-700" />
                      <span>PDF પ્રિવ્યૂ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPlan(currentPlan);
                        setIsCreatePlanModalOpen(true);
                      }}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                      title="આયોજન વિગત સુધારો"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPrintModalOpen(true)}
                      className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>પ્રિન્ટ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`શું તમે "${currentPlan.month} - ${currentPlan.subject}" નું માસિક આયોજન રદ કરવા માંગો છો?`)) {
                          deleteMonthlyLessonPlan(currentPlan.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                      title="આયોજન દૂર કરો"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Plan Metadata: Units & Progress */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      સમાવિષ્ટ પ્રકરણો / એકમો (Units Covered):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentPlan.unitsCovered.map((unit, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 shadow-2xs"
                        >
                          {unit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        આયોજન પૂર્ણતા દર
                      </span>
                      <span className="text-sm font-black text-emerald-700">{currentPlanStats.percent}%</span>
                    </div>
                    <div className="w-full bg-emerald-200 h-2 rounded-full my-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${currentPlanStats.percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-emerald-900 font-medium">
                      {currentPlanStats.completedTasks} / {currentPlanStats.totalTasks} પેટા-કાર્યો પૂર્ણ
                    </span>
                  </div>
                </div>

                {/* Collapsible Learning Outcomes Section */}
                {currentPlan.targetLearningOutcomes.length > 0 && (
                  <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsLoAccordionOpen(!isLoAccordionOpen)}
                      className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      <span className="flex items-center space-x-1.5">
                        <Award className="w-3.5 h-3.5 text-blue-600" />
                        <span>લક્ષિત અધ્યયન નિષ્પત્તિઓ (Learning Outcomes) ({currentPlan.targetLearningOutcomes.length})</span>
                      </span>
                      {isLoAccordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {isLoAccordionOpen && (
                      <div className="p-3 bg-white text-xs text-slate-700 space-y-1.5 border-t border-slate-200">
                        {currentPlan.targetLearningOutcomes.map((lo, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <span className="text-blue-600 font-bold mt-0.5">•</span>
                            <span className="leading-relaxed">{lo}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Daily Activities Section Header */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>દૈનિક વર્ગખંડ પ્રવૃત્તિઓ અને પેટા-કાર્યો ({currentPlan.dailyActivities.length} દિવસો)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    દરેક દિવસની પ્રવૃત્તિ સાથે જોડાયેલ ચેકલિસ્ટ પર ક્લિક કરીને પ્રગતિ ચિહ્નિત કરો
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingActivity(null);
                    setIsActivityModalOpen(true);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ દૈનિક પ્રવૃત્તિ ઉમેરો</span>
                </button>
              </div>

              {/* Day-by-Day Activities List with Checkable Sub-tasks */}
              <div className="space-y-4">
                {currentPlan.dailyActivities.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
                    <ListChecks className="w-12 h-12 text-slate-300 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-800">
                      હજુ કોઈ દૈનિક પ્રવૃત્તિ ઉમેરાઈ નથી
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      આ માસિક આયોજનમાં દૈનિક વર્ગખંડ શિક્ષણ કાર્યો અને ચેકલિસ્ટ ઉમેરવા માટે ઉપર આપેલ બટન પર ક્લિક કરો.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingActivity(null);
                        setIsActivityModalOpen(true);
                      }}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>દિવસ ૧ ની પ્રવૃત્તિ ઉમેરો</span>
                    </button>
                  </div>
                ) : (
                  currentPlan.dailyActivities.map((activity, actIdx) => {
                    const completedCount = activity.subTasks.filter(t => t.isCompleted).length;
                    const totalCount = activity.subTasks.length;
                    const dayPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                    return (
                      <div
                        key={activity.id}
                        className={`bg-white rounded-2xl border transition-all shadow-2xs overflow-hidden ${
                          activity.status === 'પૂર્ણ'
                            ? 'border-emerald-200 ring-1 ring-emerald-500/10'
                            : activity.status === 'ચાલુ'
                            ? 'border-amber-300 ring-1 ring-amber-500/10'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Day Card Header */}
                        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-2.5">
                            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                              {activity.dayNumber}
                            </span>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="text-xs font-bold text-slate-900">
                                  {activity.title}
                                </h4>
                                <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                                  તાસ {activity.periodNumber}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{activity.date}</span>
                                </span>
                                <span>•</span>
                                <span className="font-medium text-slate-700">{activity.topic}</span>
                              </div>
                            </div>
                          </div>

                          {/* Day Status & Card Controls */}
                          <div className="flex items-center space-x-2">
                            {/* Toggleable Status Button */}
                            <button
                              type="button"
                              onClick={() => toggleDailyActivityStatus(currentPlan.id, activity.id)}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center space-x-1 ${
                                activity.status === 'પૂર્ણ'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                                  : activity.status === 'ચાલુ'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                              }`}
                              title="સ્થિતિ બદલવા ક્લિક કરો"
                            >
                              <span className="w-2 h-2 rounded-full bg-current inline-block" />
                              <span>{activity.status}</span>
                            </button>

                            {/* Edit Activity */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingActivity(activity);
                                setIsActivityModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="પ્રવૃત્તિ સુધારો"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Activity */}
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`શું તમે દિવસ ${activity.dayNumber} ની પ્રવૃત્તિ દૂર કરવા માંગો છો?`)) {
                                  deleteDailyActivity(currentPlan.id, activity.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="પ્રવૃત્તિ દૂર કરો"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Day Card Body */}
                        <div className="p-4 space-y-3.5">
                          {/* Learning Outcome & Activity Details */}
                          {activity.learningOutcome && (
                            <div className="text-[11px] bg-blue-50/70 border border-blue-100 rounded-xl px-3 py-1.5 text-blue-900 flex items-start space-x-1.5">
                              <span className="font-bold shrink-0">અધ્યયન નિષ્પત્તિ:</span>
                              <span>{activity.learningOutcome}</span>
                            </div>
                          )}

                          <div className="text-xs text-slate-800 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                            <span className="font-bold text-slate-700 block mb-1">
                              અધ્યયન-અધ્યાપન પદ્ધતિ / પ્રક્રિયા:
                            </span>
                            {activity.teachingActivity}
                          </div>

                          {/* TLM & Homework Tags */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {activity.tlmUsed && (
                              <div className="bg-amber-50/50 border border-amber-100 rounded-lg px-2.5 py-1.5 text-amber-900">
                                <span className="font-bold text-[11px]">TLM: </span>
                                <span className="text-[11px]">{activity.tlmUsed}</span>
                              </div>
                            )}
                            {activity.homework && (
                              <div className="bg-purple-50/50 border border-purple-100 rounded-lg px-2.5 py-1.5 text-purple-900">
                                <span className="font-bold text-[11px]">ગૃહકાર્ય: </span>
                                <span className="text-[11px]">{activity.homework}</span>
                              </div>
                            )}
                          </div>

                          {/* Teacher Remarks if any */}
                          {activity.teacherNotes && (
                            <div className="text-[11px] text-slate-600 bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 italic">
                              <span className="font-semibold not-italic">શિક્ષક નોંધ:</span> {activity.teacherNotes}
                            </div>
                          )}

                          {/* CHECKABLE SUB-TASKS (The core interactive feature!) */}
                          <div className="pt-2 border-t border-slate-100 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <ListChecks className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-xs font-bold text-slate-800">
                                  વર્ગખંડ પેટા-કાર્યો (Classroom Sub-Tasks):
                                </span>
                                {activity.subTasks.filter(t => !t.isCompleted && t.notifyReminder).length > 0 && (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-[10px] font-bold">
                                    <BellRing className="w-2.5 h-2.5 text-amber-600 animate-pulse" />
                                    <span>{activity.subTasks.filter(t => !t.isCompleted && t.notifyReminder).length} રિમાઇન્ડર</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {activity.subTasks.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const anyActive = activity.subTasks.some(t => t.notifyReminder);
                                      toggleAllSubTasksNotification(currentPlan.id, activity.id, !anyActive);
                                    }}
                                    className="text-[10px] text-slate-500 hover:text-amber-700 hover:underline flex items-center space-x-1 cursor-pointer"
                                    title="આ પ્રવૃત્તિના તમામ કાર્યો માટે રિમાઇન્ડર ચાલુ/બંધ કરો"
                                  >
                                    <Bell className="w-2.5 h-2.5 text-slate-400" />
                                    <span>રિમાઇન્ડર ટૉગલ</span>
                                  </button>
                                )}
                                <span className="text-[11px] font-semibold text-slate-500">
                                  {completedCount} / {totalCount} પૂર્ણ ({dayPercent}%)
                                </span>
                              </div>
                            </div>

                            {/* Subtasks List */}
                            <div className="space-y-1.5">
                              {activity.subTasks.length === 0 ? (
                                <p className="text-[11px] text-slate-400 italic py-1">
                                  આ દિવસ માટે હજુ કોઈ પેટા-કાર્યો ઉમેરાયા નથી. નીચેથી ઉમેરો.
                                </p>
                              ) : (
                                activity.subTasks.map((subTask) => (
                                  <div
                                    key={subTask.id}
                                    className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                                      subTask.isCompleted
                                        ? 'bg-emerald-50/70 border-emerald-200 text-slate-600'
                                        : subTask.notifyReminder
                                          ? 'bg-amber-50/40 border-amber-200/90 hover:border-amber-300 text-slate-800 shadow-2xs'
                                          : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800 shadow-2xs'
                                    }`}
                                  >
                                    <div
                                      onClick={() => toggleDailySubTask(currentPlan.id, activity.id, subTask.id)}
                                      className="flex items-center space-x-2.5 flex-1 min-w-0 cursor-pointer select-none"
                                    >
                                      <div
                                        className={`w-4 h-4 rounded-md flex items-center justify-center transition-all shrink-0 ${
                                          subTask.isCompleted
                                            ? 'bg-emerald-600 text-white shadow-2xs'
                                            : 'border-2 border-slate-300 bg-white hover:border-blue-500'
                                        }`}
                                      >
                                        {subTask.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                                      </div>
                                      <span
                                        className={`text-xs ${
                                          subTask.isCompleted
                                            ? 'line-through text-slate-500 font-normal'
                                            : 'font-medium text-slate-800'
                                        }`}
                                      >
                                        {subTask.taskTitle}
                                      </span>
                                    </div>

                                    {/* Actions: Notification toggle & Delete */}
                                    <div className="flex items-center space-x-1 shrink-0 ml-2">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleSubTaskNotification(currentPlan.id, activity.id, subTask.id);
                                        }}
                                        className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer flex items-center space-x-1 ${
                                          subTask.notifyReminder
                                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300 font-semibold shadow-2xs'
                                            : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
                                        }`}
                                        title={
                                          subTask.notifyReminder
                                            ? '🔔 રિમાઇન્ડર ચાલુ છે (Home Dashboard પર દર્શાવાશે) - બંધ કરવા ક્લિક કરો'
                                            : '🔕 Home Dashboard પર રિમાઇન્ડર નોટિફિકેશન ચાલુ કરો'
                                        }
                                      >
                                        {subTask.notifyReminder ? (
                                          <>
                                            <BellRing className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                                            <span className="text-[10px] hidden sm:inline">સક્રિય</span>
                                          </>
                                        ) : (
                                          <Bell className="w-3.5 h-3.5" />
                                        )}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => deleteDailySubTask(currentPlan.id, activity.id, subTask.id)}
                                        className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                                        title="પેટા-કાર્ય દૂર કરો"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Inline Quick Add Subtask Input */}
                            <div className="flex items-center space-x-2 pt-1">
                              <input
                                type="text"
                                placeholder="+ નવું પેટા-કાર્ય ઉમેરો (દા.ત. TLM નિદર્શન, દાખલા પ્રેક્ટિસ...)"
                                value={inlineSubTaskInputs[activity.id] || ''}
                                onChange={e =>
                                  setInlineSubTaskInputs(prev => ({ ...prev, [activity.id]: e.target.value }))
                                }
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleInlineAddSubTask(activity.id);
                                  }
                                }}
                                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50 focus:bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => handleInlineAddSubTask(activity.id)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                              >
                                ઉમેરો
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                કોઈ માસિક પાઠ આયોજન પસંદ થયેલ નથી
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                ડાબી બાજુની સૂચિમાંથી કોઈપણ માસિક આયોજન પસંદ કરો અથવા નવું આયોજન બનાવો.
              </p>
              <button
                type="button"
                onClick={() => {
                  setEditingPlan(null);
                  setIsCreatePlanModalOpen(true);
                }}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>નવું માસિક આયોજન બનાવો</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Monthly Plan Modal */}
      <CreateMonthlyPlanModal
        isOpen={isCreatePlanModalOpen}
        onClose={() => setIsCreatePlanModalOpen(false)}
        onSave={handleSaveMonthlyPlan}
        initialPlan={editingPlan}
      />

      {/* Create / Edit Daily Activity Modal */}
      {currentPlan && (
        <CreateDailyActivityModal
          isOpen={isActivityModalOpen}
          onClose={() => setIsActivityModalOpen(false)}
          onSave={handleSaveDailyActivity}
          initialActivity={editingActivity}
          nextDayNumber={currentPlan.dailyActivities.length + 1}
          subjectName={currentPlan.subject}
        />
      )}

      {/* Inspection Printable Format Modal */}
      {currentPlan && (
        <PrintMonthlyLessonPlanModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          plan={currentPlan}
        />
      )}

      {/* Built-in PDF Document Viewer Modal (iframe & object tag viewer) */}
      <PdfDocumentViewerModal
        isOpen={isPdfViewerOpen}
        onClose={() => setIsPdfViewerOpen(false)}
        initialDoc={selectedPdfDoc || (currentPlan ? { type: 'monthly_plan', plan: currentPlan } : undefined)}
      />

      {/* AI Lesson Plan Generator Modal (Gemini AI Powered) */}
      <AiLessonPlanGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        initialStandard={currentPlan?.standard}
        initialSubject={currentPlan?.subject}
      />
    </div>
  );
};
