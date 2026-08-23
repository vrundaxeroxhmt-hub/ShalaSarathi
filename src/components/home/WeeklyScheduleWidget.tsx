import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DayOfWeek, 
  WeeklyClassPeriod, 
  SchoolWeeklyEvent 
} from '../../types';
import { 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Circle, 
  MapPin, 
  BookOpen, 
  Users, 
  Award, 
  Printer, 
  Filter, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  FileText, 
  Layers, 
  CheckCheck,
  Compass,
  GraduationCap,
  CalendarDays,
  CalendarCheck2,
  ListTodo,
  Tag,
  ArrowRight,
  X,
  School,
  Activity,
  Flame,
  Check
} from 'lucide-react';

const DAYS_META: { key: DayOfWeek; gujaratiName: string; shortName: string; isWeekend?: boolean }[] = [
  { key: 'monday', gujaratiName: 'સોમવાર', shortName: 'સોમ' },
  { key: 'tuesday', gujaratiName: 'મંગળવાર', shortName: 'મંગળ' },
  { key: 'wednesday', gujaratiName: 'બુધવાર', shortName: 'બુધ' },
  { key: 'thursday', gujaratiName: 'ગુરુવાર', shortName: 'ગુરુ' },
  { key: 'friday', gujaratiName: 'શુક્રવાર', shortName: 'શુક્ર' },
  { key: 'saturday', gujaratiName: 'શનિવાર', shortName: 'શનિ' },
  { key: 'sunday', gujaratiName: 'રવિવાર', shortName: 'રવિ', isWeekend: true }
];

const PERIOD_TIMES: { periodNumber: number; time: string; gujaratiTime: string; isRecess?: boolean }[] = [
  { periodNumber: 1, time: '10:45 AM - 11:30 AM', gujaratiTime: '૧૦:૪૫ થી ૧૧:૩૦' },
  { periodNumber: 2, time: '11:30 AM - 12:15 PM', gujaratiTime: '૧૧:૩૦ થી ૧૨:૧૫' },
  { periodNumber: 3, time: '12:15 PM - 01:00 PM', gujaratiTime: '૧૨:૧૫ થી ૦૧:૦૦' },
  { periodNumber: 4, time: '01:35 PM - 02:20 PM', gujaratiTime: '૦૧:૩૫ થી ૦૨:૨૦' },
  { periodNumber: 5, time: '02:20 PM - 03:00 PM', gujaratiTime: '૦૨:૨૦ થી ૦૩:૦૦' },
  { periodNumber: 6, time: '03:00 PM - 03:40 PM', gujaratiTime: '૦૩:૦૦ થી ૦૩:૪૦' },
  { periodNumber: 7, time: '03:40 PM - 04:20 PM', gujaratiTime: '૦૩:૪૦ થી ૦૪:૨૦' },
  { periodNumber: 8, time: '04:20 PM - 05:00 PM', gujaratiTime: '૦૪:૨૦ થી ૦૫:૦૦' }
];

const EVENT_CATEGORIES = [
  { id: 'assembly', label: 'પ્રાર્થના સંમેલન', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'exam', label: 'એકમ કસોટી / PAT', bg: 'bg-rose-100 text-rose-800 border-rose-300' },
  { id: 'meeting', label: 'SMC / સ્ટાફ મીટિંગ', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { id: 'activity', label: 'બાલસભા / પ્રવૃત્તિ', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'special_duty', label: 'પી.એમ. પોષણ / ફરજ', bg: 'bg-orange-100 text-orange-800 border-orange-300' },
  { id: 'training', label: 'CRC / આયોજન બેઠક', bg: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  { id: 'holiday', label: 'રજા / ઉત્સવ', bg: 'bg-purple-100 text-purple-800 border-purple-300' }
];

const SUBJECT_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  'ગણિત': { bg: 'bg-blue-50/90', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-800' },
  'ગણિત (FLN સુધારણા)': { bg: 'bg-sky-50/90', border: 'border-sky-200', text: 'text-sky-900', badge: 'bg-sky-100 text-sky-800' },
  'ગણિત / ક્વિઝ': { bg: 'bg-blue-50/90', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-800' },
  'વિજ્ઞાન': { bg: 'bg-emerald-50/90', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-800' },
  'સામાજિક વિજ્ઞાન': { bg: 'bg-amber-50/90', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-800' },
  'ગુજરાતી (પ્રથમ ભાષા)': { bg: 'bg-rose-50/90', border: 'border-rose-200', text: 'text-rose-900', badge: 'bg-rose-100 text-rose-800' },
  'અંગ્રેજી (દ્વિતીય ભાષા)': { bg: 'bg-purple-50/90', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-100 text-purple-800' },
  'હિન્દી': { bg: 'bg-orange-50/90', border: 'border-orange-200', text: 'text-orange-900', badge: 'bg-orange-100 text-orange-800' },
  'સંસ્કૃત': { bg: 'bg-amber-50/90', border: 'border-amber-300', text: 'text-amber-950', badge: 'bg-amber-200 text-amber-900' },
  'પર્યાવરણ / આસપાસ': { bg: 'bg-teal-50/90', border: 'border-teal-200', text: 'text-teal-900', badge: 'bg-teal-100 text-teal-800' },
  'પર્યાવરણ / વિજ્ઞાન પ્રોજેક્ટ': { bg: 'bg-teal-50/90', border: 'border-teal-200', text: 'text-teal-900', badge: 'bg-teal-100 text-teal-800' },
  'શારીરિક શિક્ષણ': { bg: 'bg-lime-50/90', border: 'border-lime-200', text: 'text-lime-900', badge: 'bg-lime-100 text-lime-800' },
  'રમતગમત / શારીરિક શિક્ષણ': { bg: 'bg-lime-50/90', border: 'border-lime-200', text: 'text-lime-900', badge: 'bg-lime-100 text-lime-800' },
  'ચિત્રકામ / હસ્તકલા': { bg: 'bg-pink-50/90', border: 'border-pink-200', text: 'text-pink-900', badge: 'bg-pink-100 text-pink-800' },
  'પુસ્તકાલય / વાંચન પ્રવૃત્તિ': { bg: 'bg-indigo-50/90', border: 'border-indigo-200', text: 'text-indigo-900', badge: 'bg-indigo-100 text-indigo-800' }
};

export const WeeklyScheduleWidget: React.FC = () => {
  const { 
    schoolProfile, 
    teacherProfile, 
    weeklyClasses, 
    schoolWeeklyEvents, 
    addWeeklyClass, 
    updateWeeklyClass, 
    deleteWeeklyClass, 
    toggleCompleteWeeklyClass,
    addSchoolWeeklyEvent,
    updateSchoolWeeklyEvent,
    deleteSchoolWeeklyEvent,
    toggleCompleteSchoolEvent,
    resetWeeklyScheduleToDefault,
    setActiveTab,
    setActiveSubFeature
  } = useApp();

  // Selected Day & View States
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [viewMode, setViewMode] = useState<'daily' | 'full_week' | 'events'>('daily');
  const [weekOffset, setWeekOffset] = useState<number>(0);
  
  // Filter States
  const [standardFilter, setStandardFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<WeeklyClassPeriod | null>(null);
  
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<SchoolWeeklyEvent | null>(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Form States for Class
  const [classForm, setClassForm] = useState<Omit<WeeklyClassPeriod, 'id'>>({
    day: 'monday',
    periodNumber: 1,
    startTime: '10:45 AM',
    endTime: '11:30 AM',
    standard: 'ધોરણ ૮',
    division: 'અ',
    subject: 'ગણિત',
    topic: '',
    room: 'રૂમ નં. ૮',
    learningOutcome: '',
    notes: '',
    isCompleted: false
  });

  // Form States for Event
  const [eventForm, setEventForm] = useState<Omit<SchoolWeeklyEvent, 'id'>>({
    day: 'monday',
    dateStr: '૨૪ ઓગસ્ટ ૨૦૨૬',
    title: '',
    category: 'assembly',
    categoryLabel: 'પ્રાર્થના સંમેલન',
    time: '10:30 AM - 10:45 AM',
    location: 'શાળા સેન્ટ્રલ હોલ',
    description: '',
    priority: 'medium',
    assignedTo: teacherProfile.name,
    isCompleted: false
  });

  // Calculate stats
  const totalClassesCount = weeklyClasses.length;
  const completedClassesCount = weeklyClasses.filter(c => c.isCompleted).length;
  const totalEventsCount = schoolWeeklyEvents.length;
  const completedEventsCount = schoolWeeklyEvents.filter(e => e.isCompleted).length;

  const totalItems = totalClassesCount + totalEventsCount;
  const totalCompleted = completedClassesCount + completedEventsCount;
  const completionPercentage = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  // Selected Day Items
  const dayClasses = useMemo(() => {
    return weeklyClasses
      .filter(c => c.day === selectedDay)
      .filter(c => standardFilter === 'all' || c.standard === standardFilter)
      .filter(c => subjectFilter === 'all' || c.subject.includes(subjectFilter))
      .filter(c => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          c.subject.toLowerCase().includes(q) ||
          c.standard.toLowerCase().includes(q) ||
          (c.topic && c.topic.toLowerCase().includes(q)) ||
          (c.learningOutcome && c.learningOutcome.toLowerCase().includes(q)) ||
          (c.room && c.room.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => a.periodNumber - b.periodNumber);
  }, [weeklyClasses, selectedDay, standardFilter, subjectFilter, searchQuery]);

  const dayEvents = useMemo(() => {
    return schoolWeeklyEvents
      .filter(e => e.day === selectedDay)
      .filter(e => eventCategoryFilter === 'all' || e.category === eventCategoryFilter)
      .filter(e => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          (e.location && e.location.toLowerCase().includes(q)) ||
          (e.assignedTo && e.assignedTo.toLowerCase().includes(q))
        );
      });
  }, [schoolWeeklyEvents, selectedDay, eventCategoryFilter, searchQuery]);

  // Unique Standards & Subjects for Filters
  const uniqueStandards = useMemo(() => {
    const set = new Set(weeklyClasses.map(c => c.standard));
    return Array.from(set);
  }, [weeklyClasses]);

  const uniqueSubjects = useMemo(() => {
    const set = new Set(weeklyClasses.map(c => c.subject));
    return Array.from(set);
  }, [weeklyClasses]);

  // Today's upcoming item banner
  const nextUpItem = useMemo(() => {
    const activeDayClasses = weeklyClasses.filter(c => c.day === selectedDay && !c.isCompleted);
    if (activeDayClasses.length > 0) {
      return { type: 'class', item: activeDayClasses[0] };
    }
    const activeDayEvents = schoolWeeklyEvents.filter(e => e.day === selectedDay && !e.isCompleted);
    if (activeDayEvents.length > 0) {
      return { type: 'event', item: activeDayEvents[0] };
    }
    return null;
  }, [weeklyClasses, schoolWeeklyEvents, selectedDay]);

  // Handle Edit Class Open
  const handleOpenEditClass = (cls: WeeklyClassPeriod) => {
    setEditingClass(cls);
    setClassForm({
      day: cls.day,
      periodNumber: cls.periodNumber,
      startTime: cls.startTime,
      endTime: cls.endTime,
      standard: cls.standard,
      division: cls.division || 'અ',
      subject: cls.subject,
      topic: cls.topic || '',
      room: cls.room || '',
      learningOutcome: cls.learningOutcome || '',
      notes: cls.notes || '',
      isCompleted: cls.isCompleted || false
    });
    setIsAddClassModalOpen(true);
  };

  // Handle Save Class
  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      updateWeeklyClass(editingClass.id, classForm);
    } else {
      addWeeklyClass(classForm);
    }
    setIsAddClassModalOpen(false);
    setEditingClass(null);
  };

  // Handle Edit Event Open
  const handleOpenEditEvent = (evt: SchoolWeeklyEvent) => {
    setEditingEvent(evt);
    setEventForm({
      day: evt.day,
      dateStr: evt.dateStr || '',
      title: evt.title,
      category: evt.category,
      categoryLabel: evt.categoryLabel,
      time: evt.time,
      location: evt.location || '',
      description: evt.description || '',
      priority: evt.priority,
      assignedTo: evt.assignedTo || teacherProfile.name,
      isCompleted: evt.isCompleted || false
    });
    setIsAddEventModalOpen(true);
  };

  // Handle Save Event
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = EVENT_CATEGORIES.find(c => c.id === eventForm.category);
    const payload = {
      ...eventForm,
      categoryLabel: catObj ? catObj.label : eventForm.categoryLabel
    };
    if (editingEvent) {
      updateSchoolWeeklyEvent(editingEvent.id, payload);
    } else {
      addSchoolWeeklyEvent(payload);
    }
    setIsAddEventModalOpen(false);
    setEditingEvent(null);
  };

  const getSubjectColor = (subject: string) => {
    return SUBJECT_COLORS[subject] || {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-900',
      badge: 'bg-slate-100 text-slate-800'
    };
  };

  const getPriorityBadge = (priority: SchoolWeeklyEvent['priority']) => {
    switch (priority) {
      case 'high':
        return <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Flame className="w-2.5 h-2.5" /> તાકીદનું</span>;
      case 'medium':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">મહત્વપૂર્ણ</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">સામાન્ય</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
              <CalendarDays className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">
                  સાપ્તાહિક સમયપત્રક & શાળા ઇવેન્ટ્સ (Weekly Schedule & Events)
                </h2>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  શિક્ષક આયોજન
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                વર્ગખંડ તાસ (Periods), સાપ્તાહિક વિષય અધ્યાયન, SMC/સ્ટાફ મીટિંગ્સ અને શાળા પ્રવૃત્તિઓનું આયોજન
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Week Selector */}
          <div className="inline-flex items-center bg-slate-100/90 rounded-xl p-1 text-xs border border-slate-200">
            <button
              type="button"
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
              title="પાછલું સપ્તાહ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-2.5 font-semibold text-slate-800">
              {weekOffset === 0 ? 'આ સપ્તાહ (૨૪ - ૩૦ ઓગસ્ટ)' : weekOffset > 0 ? `+${weekOffset} સપ્તાહ આગળ` : `${weekOffset} સપ્તાહ પાછળ`}
            </div>
            <button
              type="button"
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
              title="આગામી સપ્તાહ"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {weekOffset !== 0 && (
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                className="ml-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md hover:bg-amber-100"
              >
                આજે
              </button>
            )}
          </div>

          {/* Add Period Button */}
          <button
            type="button"
            onClick={() => {
              setEditingClass(null);
              setClassForm({
                day: selectedDay,
                periodNumber: dayClasses.length + 1 <= 8 ? (dayClasses.length + 1) : 1,
                startTime: '10:45 AM',
                endTime: '11:30 AM',
                standard: 'ધોરણ ૮',
                division: 'અ',
                subject: 'ગણિત',
                topic: '',
                room: 'રૂમ નં. ૮',
                learningOutcome: '',
                notes: '',
                isCompleted: false
              });
              setIsAddClassModalOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
            id="add-period-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ નવો તાસ ઉમેરો</span>
          </button>

          {/* Add Event Button */}
          <button
            type="button"
            onClick={() => {
              setEditingEvent(null);
              setEventForm({
                day: selectedDay,
                dateStr: '૨૪ ઓગસ્ટ ૨૦૨૬',
                title: '',
                category: 'assembly',
                categoryLabel: 'પ્રાર્થના સંમેલન',
                time: '10:30 AM - 10:45 AM',
                location: 'શાળા સેન્ટ્રલ હોલ',
                description: '',
                priority: 'medium',
                assignedTo: teacherProfile.name,
                isCompleted: false
              });
              setIsAddEventModalOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
            id="add-event-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ શાળા ઇવેન્ટ ઉમેરો</span>
          </button>

          {/* Print Timetable */}
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 transition-colors shadow-xs"
            title="સમયપત્રક પ્રિન્ટ / A4 PDF ડાઉનલોડ કરો"
            id="print-timetable-btn"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Status Pill Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">સાપ્તાહિક તાસ (Total Classes)</p>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5">{totalClassesCount} તાસ</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">શાળા ઇવેન્ટ્સ & ફરજો</p>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5">{totalEventsCount} ઇવેન્ટ્સ</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">પૂર્ણ થયેલ કાર્ય (Progress)</p>
            <p className="text-lg font-extrabold text-emerald-700 mt-0.5">
              {totalCompleted} / {totalItems} <span className="text-xs text-slate-500">({completionPercentage}%)</span>
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">શિક્ષક પ્રોફાઇલ વિષયો</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5 truncate max-w-[130px]">
              {teacherProfile.subjectsTaught.join(', ')}
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Next Up Live Banner */}
      {nextUpItem && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  {nextUpItem.type === 'class' ? 'આગામી તાસ (Next Class)' : 'આગામી ઇવેન્ટ (Next School Event)'}
                </span>
                <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {DAYS_META.find(d => d.key === selectedDay)?.gujaratiName}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {nextUpItem.type === 'class' ? (
                  <>
                    {(nextUpItem.item as WeeklyClassPeriod).standard} - {(nextUpItem.item as WeeklyClassPeriod).subject} (તાસ {(nextUpItem.item as WeeklyClassPeriod).periodNumber} • {(nextUpItem.item as WeeklyClassPeriod).startTime})
                    {(nextUpItem.item as WeeklyClassPeriod).topic && <span className="font-normal text-slate-600 text-xs ml-2">• {(nextUpItem.item as WeeklyClassPeriod).topic}</span>}
                  </>
                ) : (
                  <>
                    {(nextUpItem.item as SchoolWeeklyEvent).title} ({(nextUpItem.item as SchoolWeeklyEvent).time} • {(nextUpItem.item as SchoolWeeklyEvent).location})
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-center">
            {nextUpItem.type === 'class' ? (
              <button
                type="button"
                onClick={() => toggleCompleteWeeklyClass(nextUpItem.item.id)}
                className="inline-flex items-center space-x-1 bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
              >
                <Check className="w-3.5 h-3.5 text-amber-700" />
                <span>તાસ પૂર્ણ ચિહ્નિત કરો</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => toggleCompleteSchoolEvent(nextUpItem.item.id)}
                className="inline-flex items-center space-x-1 bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
              >
                <Check className="w-3.5 h-3.5 text-amber-700" />
                <span>ઇવેન્ટ પૂર્ણ ચિહ્નિત કરો</span>
              </button>
            )}
            
            <button
              type="button"
              onClick={() => {
                setActiveTab('work-assistant');
                setActiveSubFeature('lesson-planning');
              }}
              className="inline-flex items-center space-x-1 text-xs text-amber-800 hover:text-amber-900 font-semibold px-2 py-1.5"
            >
              <span>પાઠ આયોજન ખોલો</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Mode Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* View Mode Buttons */}
        <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 text-xs font-semibold self-start">
          <button
            type="button"
            onClick={() => setViewMode('daily')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
              viewMode === 'daily' 
                ? 'bg-white text-slate-900 shadow-xs font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>દૈનિક સમયપત્રક (Day View)</span>
          </button>
          
          <button
            type="button"
            onClick={() => setViewMode('full_week')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
              viewMode === 'full_week' 
                ? 'bg-white text-slate-900 shadow-xs font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>સમગ્ર સપ્તાહ ગ્રીડ (Full Week Matrix)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('events')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
              viewMode === 'events' 
                ? 'bg-white text-slate-900 shadow-xs font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>શાળા ઇવેન્ટ્સ & મીટિંગ્સ ({totalEventsCount})</span>
          </button>
        </div>

        {/* Quick Reset Demo Schedule */}
        <button
          type="button"
          onClick={resetWeeklyScheduleToDefault}
          className="inline-flex items-center space-x-1 text-slate-400 hover:text-slate-700 text-xs self-end sm:self-center transition-colors"
          title="મૂળભૂત ડેમો સમયપત્રક પુનઃસ્થાપિત કરો"
        >
          <RotateCcw className="w-3 h-3" />
          <span>ડિફોલ્ટ રીસેટ</span>
        </button>
      </div>

      {/* Day Selector Bar (Visible in Daily View) */}
      {viewMode === 'daily' && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {DAYS_META.map(day => {
            const countForDay = weeklyClasses.filter(c => c.day === day.key).length;
            const eventsForDay = schoolWeeklyEvents.filter(e => e.day === day.key).length;
            const isSelected = selectedDay === day.key;

            return (
              <button
                key={day.key}
                type="button"
                onClick={() => setSelectedDay(day.key)}
                className={`flex-1 min-w-[100px] p-3 rounded-2xl border text-left transition-all relative ${
                  isSelected 
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md -translate-y-0.5' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                    {day.shortName}
                  </span>
                  {eventsForDay > 0 && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-amber-800 text-amber-200' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {eventsForDay} ઇવેન્ટ
                    </span>
                  )}
                </div>
                <p className={`text-sm font-extrabold mt-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {day.gujaratiName}
                </p>
                <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-amber-200' : 'text-slate-400'}`}>
                  {countForDay > 0 ? `${countForDay} તાસ` : 'રજા / મુક્ત'}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative min-w-[180px]">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="શોધો (વિષય, પ્રકરણ, રૂમ, ઇવેન્ટ)..."
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Standard Filter */}
          {viewMode !== 'events' && (
            <select
              value={standardFilter}
              onChange={e => setStandardFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="all">બધા ધોરણ (All Standards)</option>
              {uniqueStandards.map(std => (
                <option key={std} value={std}>{std}</option>
              ))}
            </select>
          )}

          {/* Subject Filter */}
          {viewMode !== 'events' && (
            <select
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="all">બધા વિષયો (All Subjects)</option>
              {uniqueSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          )}

          {/* Event Category Filter */}
          {viewMode === 'events' && (
            <select
              value={eventCategoryFilter}
              onChange={e => setEventCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="all">બધી ઇવેન્ટ્સ કેટેગરી</option>
              {EVENT_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          )}
        </div>

        <div className="text-slate-500 font-medium text-xs">
          {viewMode === 'daily' && (
            <span>{dayClasses.length} તાસ • {dayEvents.length} શાળા ઇવેન્ટ્સ</span>
          )}
          {viewMode === 'full_week' && (
            <span>કુલ {totalClassesCount} તાસ • {DAYS_META.length} દિવસો</span>
          )}
          {viewMode === 'events' && (
            <span>કુલ {dayEvents.length || totalEventsCount} ઇવેન્ટ્સ</span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DAILY VIEW (દૈનિક સમયપત્રક & ઇવેન્ટ્સ) */}
      {/* ========================================================================= */}
      {viewMode === 'daily' && (
        <div className="space-y-5">
          
          {/* Day's Events Strip (if any) */}
          {dayEvents.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-600" />
                  <span>આજના દિવસની શાળા ઇવેન્ટ્સ & વિશેષ જવાબદારીઓ ({dayEvents.length})</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dayEvents.map(evt => {
                  const catObj = EVENT_CATEGORIES.find(c => c.id === evt.category);
                  return (
                    <div
                      key={evt.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        evt.isCompleted 
                          ? 'bg-slate-50 border-slate-200 opacity-75' 
                          : 'bg-amber-50/50 border-amber-200/80 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start space-x-2.5">
                          <button
                            type="button"
                            onClick={() => toggleCompleteSchoolEvent(evt.id)}
                            className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                            title={evt.isCompleted ? 'પૂર્ણ થયેલ' : 'પૂર્ણ ચિહ્નિત કરો'}
                          >
                            {evt.isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${catObj?.bg || 'bg-slate-100 text-slate-800'}`}>
                                {evt.categoryLabel}
                              </span>
                              {getPriorityBadge(evt.priority)}
                            </div>

                            <h5 className={`font-bold text-sm mt-1.5 ${evt.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                              {evt.title}
                            </h5>

                            {evt.description && (
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                {evt.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{evt.time}</span>
                              </span>
                              {evt.location && (
                                <span className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  <span>{evt.location}</span>
                                </span>
                              )}
                              {evt.assignedTo && (
                                <span className="flex items-center space-x-1 text-slate-600 font-medium">
                                  <Users className="w-3 h-3 text-slate-400" />
                                  <span>{evt.assignedTo}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Event Actions */}
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditEvent(evt)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white"
                            title="ઇવેન્ટ સંપાદિત કરો"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSchoolWeeklyEvent(evt.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white"
                            title="ઇવેન્ટ કાઢી નાખો"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day's Periods Schedule (Timeline View) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>શૈક્ષણિક તાસ / વર્ગ સમયપત્રક ({DAYS_META.find(d => d.key === selectedDay)?.gujaratiName})</span>
              </h4>

              <button
                type="button"
                onClick={() => {
                  setEditingClass(null);
                  setClassForm({
                    day: selectedDay,
                    periodNumber: dayClasses.length + 1 <= 8 ? (dayClasses.length + 1) : 1,
                    startTime: '10:45 AM',
                    endTime: '11:30 AM',
                    standard: 'ધોરણ ૮',
                    division: 'અ',
                    subject: 'ગણિત',
                    topic: '',
                    room: 'રૂમ નં. ૮',
                    learningOutcome: '',
                    notes: '',
                    isCompleted: false
                  });
                  setIsAddClassModalOpen(true);
                }}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>આ દિવસે તાસ ઉમેરો</span>
              </button>
            </div>

            {dayClasses.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">આ દિવસે કોઈ તાસ નક્કી કરેલ નથી</p>
                <p className="text-[11px] text-slate-400 mt-0.5">નવો તાસ ઉમેરવા માટે "+ નવો તાસ ઉમેરો" પર ક્લિક કરો.</p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingClass(null);
                    setIsAddClassModalOpen(true);
                  }}
                  className="mt-3 inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>તાસ ઉમેરો</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {dayClasses.map(cls => {
                  const colors = getSubjectColor(cls.subject);
                  const periodMeta = PERIOD_TIMES.find(p => p.periodNumber === cls.periodNumber);

                  return (
                    <div
                      key={cls.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        cls.isCompleted 
                          ? 'bg-slate-50/70 border-slate-200 opacity-80' 
                          : `${colors.bg} ${colors.border} shadow-2xs hover:shadow-xs`
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start space-x-3.5">
                          {/* Completion Checkbox */}
                          <button
                            type="button"
                            onClick={() => toggleCompleteWeeklyClass(cls.id)}
                            className="mt-1 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                            title={cls.isCompleted ? 'પૂર્ણ થયેલ' : 'પૂર્ણ ચિહ્નિત કરો'}
                          >
                            {cls.isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400" />
                            )}
                          </button>

                          {/* Period Badge */}
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center shrink-0">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">તાસ</span>
                            <span className="text-sm font-extrabold text-slate-900">{cls.periodNumber}</span>
                          </div>

                          {/* Class Details */}
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-lg ${colors.badge}`}>
                                {cls.standard} {cls.division && `(${cls.division})`}
                              </span>
                              <span className="font-bold text-sm text-slate-900">
                                {cls.subject}
                              </span>
                              <span className="text-slate-400 text-xs">•</span>
                              <span className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{cls.startTime} - {cls.endTime}</span>
                              </span>
                              {cls.room && (
                                <>
                                  <span className="text-slate-400 text-xs">•</span>
                                  <span className="text-xs text-slate-500 flex items-center space-x-1">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    <span>{cls.room}</span>
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Topic / Learning Outcome */}
                            {cls.topic && (
                              <div className="mt-2 text-xs font-medium text-slate-800 flex items-start space-x-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                <span><strong>અભ્યાસ મુદ્દો:</strong> {cls.topic}</span>
                              </div>
                            )}

                            {cls.learningOutcome && (
                              <div className="mt-1 text-[11px] text-slate-600 bg-white/70 border border-slate-200/60 rounded-lg p-2 leading-relaxed">
                                <span className="font-bold text-slate-700">અધ્યયન નિષ્પત્તિ:</span> {cls.learningOutcome}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Class Actions */}
                        <div className="flex items-center space-x-1.5 self-end sm:self-start shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditClass(cls)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg bg-white/60 hover:bg-white border border-slate-200/50 shadow-2xs"
                            title="તાસ વિગત સંપાદિત કરો"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteWeeklyClass(cls.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg bg-white/60 hover:bg-white border border-slate-200/50 shadow-2xs"
                            title="તાસ કાઢી નાખો"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FULL WEEK MATRIX VIEW (સમગ્ર સપ્તાહ ગ્રીડ ટાઇમટેબલ) */}
      {/* ========================================================================= */}
      {viewMode === 'full_week' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
            <table className="w-full text-xs text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3 w-28 text-center border-r border-slate-200 bg-slate-200/60">તાસ / સમય</th>
                  {DAYS_META.filter(d => d.key !== 'sunday').map(day => {
                    const eventsForDay = schoolWeeklyEvents.filter(e => e.day === day.key);
                    return (
                      <th key={day.key} className="p-3 border-r border-slate-200 last:border-r-0 text-center">
                        <div className="font-extrabold text-slate-900 text-sm">{day.gujaratiName}</div>
                        {eventsForDay.length > 0 && (
                          <div className="mt-1 text-[10px] font-semibold text-amber-800 bg-amber-100 rounded-md px-1.5 py-0.5 inline-block">
                            {eventsForDay.length} ઇવેન્ટ
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {PERIOD_TIMES.map(pt => {
                  const isRecessAfter = pt.periodNumber === 3;
                  return (
                    <React.Fragment key={pt.periodNumber}>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-2.5 text-center font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                          <div className="text-xs font-black text-amber-800">તાસ {pt.periodNumber}</div>
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5">{pt.time}</div>
                        </td>
                        {DAYS_META.filter(d => d.key !== 'sunday').map(day => {
                          const cls = weeklyClasses.find(c => c.day === day.key && c.periodNumber === pt.periodNumber);
                          if (!cls) {
                            return (
                              <td 
                                key={day.key} 
                                className="p-2 border-r border-slate-200 last:border-r-0 text-center hover:bg-amber-50/30 transition-colors cursor-pointer group"
                                onClick={() => {
                                  setEditingClass(null);
                                  setClassForm({
                                    day: day.key,
                                    periodNumber: pt.periodNumber,
                                    startTime: pt.time.split(' - ')[0],
                                    endTime: pt.time.split(' - ')[1],
                                    standard: 'ધોરણ ૮',
                                    division: 'અ',
                                    subject: 'ગણિત',
                                    topic: '',
                                    room: 'રૂમ નં. ૮',
                                    learningOutcome: '',
                                    notes: '',
                                    isCompleted: false
                                  });
                                  setIsAddClassModalOpen(true);
                                }}
                              >
                                <span className="text-slate-300 group-hover:text-amber-600 text-xs font-medium flex items-center justify-center space-x-1">
                                  <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                  <span>-</span>
                                </span>
                              </td>
                            );
                          }

                          const colors = getSubjectColor(cls.subject);
                          return (
                            <td 
                              key={day.key} 
                              className={`p-2 border-r border-slate-200 last:border-r-0 align-top transition-all ${colors.bg}`}
                              onClick={() => handleOpenEditClass(cls)}
                            >
                              <div className="p-1.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer">
                                <div className="flex items-center justify-between gap-1">
                                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${colors.badge}`}>
                                    {cls.standard} {cls.division && `(${cls.division})`}
                                  </span>
                                  {cls.isCompleted && (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  )}
                                </div>
                                <p className="font-bold text-xs text-slate-900 mt-1 truncate" title={cls.subject}>
                                  {cls.subject}
                                </p>
                                {cls.room && (
                                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                    {cls.room}
                                  </p>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Recess Row after Period 3 */}
                      {isRecessAfter && (
                        <tr className="bg-amber-500/10 text-amber-900 font-bold border-y border-amber-200">
                          <td colSpan={7} className="py-2 px-4 text-center text-xs tracking-wide">
                            🍱 પી.એમ. પોષણ ભોજન & મધ્યાહન રિસેસ (01:00 PM - 01:35 PM)
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            💡 કોષ્ટકમાં કોઈપણ ખાલી ખાના પર ક્લિક કરીને તે તાસ માટે નવો વિષય ઉમેરી શકાય છે.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SCHOOL EVENTS AGENDA (શાળા ઇવેન્ટ્સ & મીટિંગ્સ) */}
      {/* ========================================================================= */}
      {viewMode === 'events' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schoolWeeklyEvents
              .filter(e => eventCategoryFilter === 'all' || e.category === eventCategoryFilter)
              .map(evt => {
                const catObj = EVENT_CATEGORIES.find(c => c.id === evt.category);
                const dayObj = DAYS_META.find(d => d.key === evt.day);

                return (
                  <div
                    key={evt.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      evt.isCompleted 
                        ? 'bg-slate-50 border-slate-200 opacity-75' 
                        : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <button
                          type="button"
                          onClick={() => toggleCompleteSchoolEvent(evt.id)}
                          className="mt-1 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                          title={evt.isCompleted ? 'પૂર્ણ થયેલ' : 'પૂર્ણ ચિહ્નિત કરો'}
                        >
                          {evt.isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-400" />
                          )}
                        </button>

                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded-md">
                              {dayObj?.gujaratiName} {evt.dateStr && `• ${evt.dateStr}`}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${catObj?.bg || 'bg-slate-100 text-slate-800'}`}>
                              {evt.categoryLabel}
                            </span>
                            {getPriorityBadge(evt.priority)}
                          </div>

                          <h4 className={`font-bold text-sm mt-2 ${evt.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {evt.title}
                          </h4>

                          {evt.description && (
                            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                              {evt.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{evt.time}</span>
                            </span>
                            {evt.location && (
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span>{evt.location}</span>
                              </span>
                            )}
                            {evt.assignedTo && (
                              <span className="flex items-center space-x-1 text-slate-700 font-medium">
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                <span>{evt.assignedTo}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditEvent(evt)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                          title="ઇવેન્ટ સંપાદિત કરો"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSchoolWeeklyEvent(evt.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                          title="ઇવેન્ટ કાઢી નાખો"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT CLASS PERIOD */}
      {/* ========================================================================= */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {editingClass ? 'તાસ વિગત સંપાદિત કરો' : 'નવો શૈક્ષણિક તાસ ઉમેરો'}
                  </h3>
                  <p className="text-xs text-slate-500">સાપ્તાહિક સમયપત્રક વિગતો ભરો</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddClassModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* Day */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">દિવસ (Day of Week)</label>
                  <select
                    value={classForm.day}
                    onChange={e => setClassForm({ ...classForm, day: e.target.value as DayOfWeek })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                  >
                    {DAYS_META.map(d => (
                      <option key={d.key} value={d.key}>{d.gujaratiName}</option>
                    ))}
                  </select>
                </div>

                {/* Period Number */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">તાસ ક્રમાંક (Period No.)</label>
                  <select
                    value={classForm.periodNumber}
                    onChange={e => {
                      const pNum = Number(e.target.value);
                      const pTime = PERIOD_TIMES.find(p => p.periodNumber === pNum);
                      setClassForm({
                        ...classForm,
                        periodNumber: pNum,
                        startTime: pTime ? pTime.time.split(' - ')[0] : classForm.startTime,
                        endTime: pTime ? pTime.time.split(' - ')[1] : classForm.endTime
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>તાસ {num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Standard */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ધોરણ (Standard)</label>
                  <select
                    value={classForm.standard}
                    onChange={e => setClassForm({ ...classForm, standard: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                  >
                    {['ધોરણ ૧', 'ધોરણ ૨', 'ધોરણ ૩', 'ધોરણ ૪', 'ધોરણ ૫', 'ધોરણ ૬', 'ધોરણ ૭', 'ધોરણ ૮', 'ધોરણ ૬ થી ૮ સંયુક્ત'].map(std => (
                      <option key={std} value={std}>{std}</option>
                    ))}
                  </select>
                </div>

                {/* Division */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">વર્ગ / વર્ગખંડ (Division/Room)</label>
                  <input
                    type="text"
                    value={classForm.room || ''}
                    onChange={e => setClassForm({ ...classForm, room: e.target.value })}
                    placeholder="દા.ત. રૂમ નં. ૭ / વિજ્ઞાન લેબ"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">વિષય (Subject)</label>
                <input
                  type="text"
                  required
                  value={classForm.subject}
                  onChange={e => setClassForm({ ...classForm, subject: e.target.value })}
                  placeholder="દા.ત. ગણિત, વિજ્ઞાન, ગુજરાતી..."
                  list="subjects-datalist"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                />
                <datalist id="subjects-datalist">
                  {Object.keys(SUBJECT_COLORS).map(s => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">શરૂ સમય (Start Time)</label>
                  <input
                    type="text"
                    value={classForm.startTime}
                    onChange={e => setClassForm({ ...classForm, startTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">પૂર્ણ સમય (End Time)</label>
                  <input
                    type="text"
                    value={classForm.endTime}
                    onChange={e => setClassForm({ ...classForm, endTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">પાઠ / અધ્યાયન મુદ્દો (Topic / Chapter)</label>
                <input
                  type="text"
                  value={classForm.topic || ''}
                  onChange={e => setClassForm({ ...classForm, topic: e.target.value })}
                  placeholder="દા.ત. પ્રકરણ ૫: માહિતીનું નિયમન (સ્તંભ આલેખ)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Learning Outcome */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">અધ્યયન નિષ્પત્તિ (Learning Outcome)</label>
                <textarea
                  rows={2}
                  value={classForm.learningOutcome || ''}
                  onChange={e => setClassForm({ ...classForm, learningOutcome: e.target.value })}
                  placeholder="દા.ત. M805: આપેલ માહિતી પરથી આવૃત્તિ વિતરણ અને સ્તંભ આલેખ દોરી શકે છે."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs"
                >
                  {editingClass ? 'અપડેટ કરો' : 'તાસ સાચવો'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT SCHOOL EVENT */}
      {/* ========================================================================= */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {editingEvent ? 'શાળા ઇવેન્ટ સંપાદિત કરો' : 'નવી શાળા ઇવેન્ટ / મીટિંગ ઉમેરો'}
                  </h3>
                  <p className="text-xs text-slate-500">સાપ્તાહિક ઇવેન્ટ કેલેન્ડરમાં નોંધણી</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEventModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* Day */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">દિવસ (Day)</label>
                  <select
                    value={eventForm.day}
                    onChange={e => setEventForm({ ...eventForm, day: e.target.value as DayOfWeek })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                  >
                    {DAYS_META.map(d => (
                      <option key={d.key} value={d.key}>{d.gujaratiName}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">કેટેગરી (Event Type)</label>
                  <select
                    value={eventForm.category}
                    onChange={e => {
                      const cat = e.target.value as SchoolWeeklyEvent['category'];
                      const catObj = EVENT_CATEGORIES.find(c => c.id === cat);
                      setEventForm({
                        ...eventForm,
                        category: cat,
                        categoryLabel: catObj ? catObj.label : eventForm.categoryLabel
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                  >
                    {EVENT_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Event Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">ઇવેન્ટ શીર્ષક (Event Title)</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="દા.ત. SMC માસિક સામાન્ય સભા & ગ્રાન્ટ સમીક્ષા"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Time & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">સમય (Time)</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    placeholder="દા.ત. 03:00 PM - 04:30 PM"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">સ્થળ (Location)</label>
                  <input
                    type="text"
                    value={eventForm.location || ''}
                    onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="દા.ત. સ્ટાફ રૂમ / પ્રાર્થના હોલ"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Priority & Assigned To */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">પ્રાથમિકતા (Priority)</label>
                  <select
                    value={eventForm.priority}
                    onChange={e => setEventForm({ ...eventForm, priority: e.target.value as SchoolWeeklyEvent['priority'] })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="low">સામાન્ય (Normal)</option>
                    <option value="medium">મહત્વપૂર્ણ (Important)</option>
                    <option value="high">તાકીદનું (Urgent / Critical)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">જવાબદાર વ્યક્તિ / સ્ટાફ (Assigned)</label>
                  <input
                    type="text"
                    value={eventForm.assignedTo || ''}
                    onChange={e => setEventForm({ ...eventForm, assignedTo: e.target.value })}
                    placeholder="દા.ત. સમગ્ર સ્ટાફ / ભાવિનકુમાર"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">વિગતવાર એજન્ડા / નોંધ (Description)</label>
                <textarea
                  rows={3}
                  value={eventForm.description || ''}
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="ઇવેન્ટનો મુખ્ય ઉદ્દેશ્ય, ઠરાવ મુદ્દા અથવા જરૂરી તૈયારી..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs"
                >
                  {editingEvent ? 'અપડેટ કરો' : 'ઇવેન્ટ સાચવો'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRINTABLE A4 TIMETABLE SHEET */}
      {/* ========================================================================= */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  શિક્ષક સાપ્તાહિક સમયપત્રક & શાળા આયોજન પ્રિન્ટ
                </h3>
                <p className="text-xs text-slate-500">
                  ગુજરાત સરકાર શિક્ષણ વિભાગ માન્ય ફોર્મેટ • {schoolProfile.schoolName}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>પ્રિન્ટ / PDF સાચવો</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Preview Sheet */}
            <div className="mt-6 border border-slate-300 rounded-2xl p-6 bg-white space-y-6 text-slate-900" id="printable-weekly-timetable">
              {/* Sheet Header */}
              <div className="text-center border-b pb-4 border-slate-300">
                <h2 className="text-xl font-extrabold">{schoolProfile.schoolName}</h2>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  તાલુકો: {schoolProfile.taluka}, જિલ્લો: {schoolProfile.district} • UDISE કોડ: {schoolProfile.udiseCode}
                </p>
                <div className="inline-block bg-slate-100 text-slate-800 text-xs font-bold px-4 py-1 rounded-full mt-2 border border-slate-300">
                  શિક્ષક સાપ્તાહિક સમયપત્રક & શૈક્ષણિક કાર્ય આયોજન (શૈક્ષણિક વર્ષ: {schoolProfile.academicYear})
                </div>
              </div>

              {/* Teacher Details */}
              <div className="grid grid-cols-3 gap-4 text-xs font-semibold bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 font-normal">શિક્ષકનું નામ:</span> {teacherProfile.name}
                </div>
                <div>
                  <span className="text-slate-500 font-normal">અધ્યાપન ધોરણ:</span> {teacherProfile.standardsTaught.join(', ')}
                </div>
                <div>
                  <span className="text-slate-500 font-normal">મુખ્ય વિષયો:</span> {teacherProfile.subjectsTaught.join(', ')}
                </div>
              </div>

              {/* Weekly Timetable Table */}
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="p-2 border border-slate-300 text-center w-24">તાસ / સમય</th>
                    {DAYS_META.filter(d => d.key !== 'sunday').map(d => (
                      <th key={d.key} className="p-2 border border-slate-300 text-center">
                        {d.gujaratiName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERIOD_TIMES.map(pt => (
                    <React.Fragment key={pt.periodNumber}>
                      <tr>
                        <td className="p-2 border border-slate-300 text-center font-bold bg-slate-50">
                          <div>તાસ {pt.periodNumber}</div>
                          <div className="text-[9px] text-slate-500">{pt.time}</div>
                        </td>
                        {DAYS_META.filter(d => d.key !== 'sunday').map(d => {
                          const cls = weeklyClasses.find(c => c.day === d.key && c.periodNumber === pt.periodNumber);
                          return (
                            <td key={d.key} className="p-2 border border-slate-300 align-top">
                              {cls ? (
                                <div>
                                  <div className="font-extrabold text-[11px] text-slate-900">
                                    {cls.standard} {cls.division && `(${cls.division})`}
                                  </div>
                                  <div className="text-xs font-bold text-amber-900">{cls.subject}</div>
                                  {cls.topic && <div className="text-[10px] text-slate-600 truncate">{cls.topic}</div>}
                                </div>
                              ) : (
                                <div className="text-center text-slate-300">-</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                      {pt.periodNumber === 3 && (
                        <tr className="bg-amber-50 text-center font-bold text-xs text-amber-950">
                          <td colSpan={7} className="p-1.5 border border-slate-300">
                            🍱 મધ્યાહન ભોજન (પી.એમ. પોષણ) & રિસેસ (01:00 PM - 01:35 PM)
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {/* School Weekly Events Summary Box */}
              <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50">
                <h4 className="font-bold text-xs text-slate-800 mb-2">સાપ્તાહિક શાળા ઇવેન્ટ્સ & વિશેષ જવાબદારીઓ:</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {schoolWeeklyEvents.map(evt => (
                    <div key={evt.id} className="border-b border-slate-200 pb-1">
                      <span className="font-bold text-slate-900">{DAYS_META.find(d => d.key === evt.day)?.gujaratiName}: </span>
                      <span className="text-slate-700">{evt.title} ({evt.time})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 pt-8 text-xs font-bold text-center">
                <div>
                  <div className="border-t border-slate-400 w-44 mx-auto pt-1">
                    વર્ગ શિક્ષકની સહી
                  </div>
                </div>
                <div>
                  <div className="border-t border-slate-400 w-44 mx-auto pt-1">
                    મુખ્ય શિક્ષક / આચાર્યશ્રીની સહી
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
