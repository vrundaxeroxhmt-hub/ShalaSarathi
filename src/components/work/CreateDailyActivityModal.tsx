import React, { useState } from 'react';
import { DailyLessonActivity, DailySubTask } from '../../types';
import { X, Plus, Trash2, CheckCircle2, ListChecks, Calendar, Clock, BookOpen, Sparkles, Bell, BellRing } from 'lucide-react';

interface CreateDailyActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<DailyLessonActivity, 'id'>) => void;
  initialActivity?: DailyLessonActivity | null;
  nextDayNumber: number;
  subjectName?: string;
}

const COMMON_SUBTASK_SUGGESTIONS = [
  'પૂર્વજ્ઞાન ચકાસણી અને પરિચય પ્રશ્નોત્તરી',
  'TLM અને શૈક્ષણિક ચાર્ટનું નિદર્શન',
  'મુખ્ય વિભાવનાનું બોર્ડ વર્ક અને સમજૂતી',
  'વિદ્યાર્થીઓ દ્વારા જોડીમાં / જૂથમાં પ્રવૃત્તિ',
  'સ્વાધ્યાયના દાખલા / પ્રશ્નોત્તરી મહાવરો',
  'નબળા વિદ્યાર્થીઓ માટે ઉપચારાત્મક માર્ગદર્શન',
  'મૂલ્યાંકન અને સ્લેટ કાર્ય / વર્કશીટ',
  'ગૃહકાર્ય નોંધ અને શિક્ષક ડાયરી લેખન'
];

export const CreateDailyActivityModal: React.FC<CreateDailyActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialActivity,
  nextDayNumber,
  subjectName = 'ગણિત'
}) => {
  const [dayNumber, setDayNumber] = useState<number>(initialActivity?.dayNumber || nextDayNumber);
  const [date, setDate] = useState<string>(initialActivity?.date || new Date().toISOString().split('T')[0]);
  const [periodNumber, setPeriodNumber] = useState<number>(initialActivity?.periodNumber || 2);
  const [title, setTitle] = useState<string>(initialActivity?.title || `દિવસ ${initialActivity?.dayNumber || nextDayNumber}: `);
  const [topic, setTopic] = useState<string>(initialActivity?.topic || '');
  const [learningOutcome, setLearningOutcome] = useState<string>(initialActivity?.learningOutcome || '');
  const [teachingActivity, setTeachingActivity] = useState<string>(initialActivity?.teachingActivity || '');
  const [tlmUsed, setTlmUsed] = useState<string>(initialActivity?.tlmUsed || '');
  const [assessmentMethod, setAssessmentMethod] = useState<string>(initialActivity?.assessmentMethod || 'મૌખિક પ્રશ્નોત્તરી & વર્ગખંડ અવલોકન');
  const [homework, setHomework] = useState<string>(initialActivity?.homework || '');
  const [teacherNotes, setTeacherNotes] = useState<string>(initialActivity?.teacherNotes || '');
  const [status, setStatus] = useState<'આયોજિત' | 'ચાલુ' | 'પૂર્ણ'>(initialActivity?.status || 'આયોજિત');

  // Subtasks
  const [subTasks, setSubTasks] = useState<DailySubTask[]>(
    initialActivity?.subTasks || [
      { id: `st-init-1`, taskTitle: 'પૂર્વજ્ઞાન ચકાસણી અને પરિચય પ્રશ્નોત્તરી', isCompleted: false, notifyReminder: true },
      { id: `st-init-2`, taskTitle: 'TLM અને શૈક્ષણિક ચાર્ટનું નિદર્શન', isCompleted: false, notifyReminder: true },
      { id: `st-init-3`, taskTitle: 'વિદ્યાર્થીઓ દ્વારા પાઠ્યપુસ્તક આધારિત સ્વાધ્યાય કાર્ય', isCompleted: false, notifyReminder: true },
      { id: `st-init-4`, taskTitle: 'ગૃહકાર્ય નોંધ અને શિક્ષક ડાયરી લેખન', isCompleted: false, notifyReminder: true }
    ]
  );
  const [newSubTaskInput, setNewSubTaskInput] = useState<string>('');
  const [newSubTaskNotify, setNewSubTaskNotify] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleAddSubTask = (textToAdd?: string) => {
    const text = (textToAdd || newSubTaskInput).trim();
    if (!text) return;
    const newTask: DailySubTask = {
      id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      taskTitle: text,
      isCompleted: false,
      notifyReminder: newSubTaskNotify
    };
    setSubTasks(prev => [...prev, newTask]);
    if (!textToAdd) setNewSubTaskInput('');
  };

  const handleRemoveSubTask = (id: string) => {
    setSubTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleSubTask = (id: string) => {
    setSubTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const handleToggleSubTaskNotification = (id: string) => {
    setSubTasks(prev => prev.map(t => t.id === id ? { ...t, notifyReminder: !t.notifyReminder } : t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      dayNumber,
      date,
      periodNumber,
      title: title.trim(),
      topic: topic.trim(),
      learningOutcome: learningOutcome.trim(),
      teachingActivity: teachingActivity.trim(),
      tlmUsed: tlmUsed.trim(),
      assessmentMethod: assessmentMethod.trim(),
      homework: homework.trim(),
      teacherNotes: teacherNotes.trim(),
      status,
      subTasks
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20">
              <Calendar className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {initialActivity ? 'દૈનિક પ્રવૃત્તિ સુધારો (Edit Daily Activity)' : 'નવી દૈનિક પ્રવૃત્તિ ઉમેરો (Add Daily Activity)'}
              </h3>
              <p className="text-xs text-blue-100">
                {subjectName} • દિવસ ક્રમાંક {dayNumber} • તાસ (Period) {periodNumber}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Day, Date, Period, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">દિવસ ક્રમાંક (Day #) *</label>
              <input
                type="number"
                min="1"
                max="31"
                required
                value={dayNumber}
                onChange={e => {
                  const val = parseInt(e.target.value) || 1;
                  setDayNumber(val);
                  if (title.startsWith('દિવસ ')) {
                    setTitle(`દિવસ ${val}: ${topic || ''}`);
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">તારીખ (Date) *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">તાસ ક્રમાંક (Period) *</label>
              <select
                value={periodNumber}
                onChange={e => setPeriodNumber(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                  <option key={p} value={p}>તાસ {p} (Period {p})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">સ્થિતિ (Status)</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                <option value="આયોજિત">આયોજિત (Planned)</option>
                <option value="ચાલુ">ચાલુ (In Progress)</option>
                <option value="પૂર્ણ">પૂર્ણ (Completed)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Title & Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">પ્રવૃત્તિ શીર્ષક (Activity Title) *</label>
              <input
                type="text"
                required
                placeholder="દા.ત. દિવસ ૧: પૂર્ણાંક સંખ્યાઓ - પરિચય"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">મુદ્દો / વિષયવસ્તુ (Topic / Subtopic) *</label>
              <input
                type="text"
                required
                placeholder="દા.ત. સંખ્યારેખા પર ઋણ પૂર્ણાંકોનું નિરૂપણ"
                value={topic}
                onChange={e => {
                  setTopic(e.target.value);
                  if (title.startsWith('દિવસ ')) {
                    setTitle(`દિવસ ${dayNumber}: ${e.target.value}`);
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Row 3: Learning Outcome Code & Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">અધ્યયન નિષ્પત્તિ (Learning Outcome)</label>
            <input
              type="text"
              placeholder="દા.ત. M701: સંખ્યારેખા પર પૂર્ણાંક સંખ્યા દર્શાવે છે અને સરખામણી કરે છે."
              value={learningOutcome}
              onChange={e => setLearningOutcome(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Row 4: Teaching-Learning Activity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">અધ્યયન-અધ્યાપન પ્રક્રિયા / પદ્ધતિ (Teaching Activity) *</label>
            <textarea
              rows={2}
              required
              placeholder="દા.ત. જમીન પર સંખ્યારેખા દોરી વિદ્યાર્થીઓને ડગલાં ભરાવી ઋણ અને ધન સંખ્યાઓની પ્રત્યક્ષ સમજ આપવી."
              value={teachingActivity}
              onChange={e => setTeachingActivity(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Row 5: TLM & Assessment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ઉપયોગમાં લીધેલ TLM / સાધનો</label>
              <input
                type="text"
                placeholder="દા.ત. સંખ્યારેખા ચાર્ટ, ફ્લેશકાર્ડ્સ, સ્માર્ટબોર્ડ"
                value={tlmUsed}
                onChange={e => setTlmUsed(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">મૂલ્યાંકન પદ્ધતિ (Assessment)</label>
              <input
                type="text"
                placeholder="દા.ત. મૌખિક પ્રશ્નોત્તરી, સ્લેટ કાર્ય, જોડી મૂલ્યાંકન"
                value={assessmentMethod}
                onChange={e => setAssessmentMethod(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Row 6: Homework & Teacher Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ગૃહકાર્ય / સ્વાધ્યાય (Homework)</label>
              <input
                type="text"
                placeholder="દા.ત. સ્વાધ્યાય ૧.૧ ના પ્રશ્ન ૧ થી ૪ નોટબુકમાં ગણવા"
                value={homework}
                onChange={e => setHomework(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">શિક્ષકની વિશેષ નોંધ (Remarks)</label>
              <input
                type="text"
                placeholder="દા.ત. બાળકોએ ઉત્સાહપૂર્વક ભાગ લીધો"
                value={teacherNotes}
                onChange={e => setTeacherNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Row 7: Checkable Sub-Tasks List Builder (Crucial Feature) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ListChecks className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-800">
                  ચેક કરી શકાય તેવા પેટા-કાર્યો (Checkable Classroom Sub-Tasks) ({subTasks.length})
                </h4>
              </div>
              <span className="text-[11px] text-slate-500">
                {subTasks.filter(t => t.isCompleted).length} / {subTasks.length} પૂર્ણ
              </span>
            </div>

            {/* Quick Suggestions Chips */}
            <div>
              <p className="text-[10px] font-semibold text-slate-500 mb-1.5 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>ઝડપી પસંદગી (Quick Add Preset):</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SUBTASK_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddSubTask(sug)}
                    className="text-[11px] px-2 py-0.5 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtasks List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {subTasks.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2 text-center">
                  હજુ કોઈ પેટા-કાર્યો ઉમેરાયા નથી. નીચેથી નવું કાર્ય ઉમેરો.
                </p>
              ) : (
                subTasks.map((st, idx) => (
                  <div
                    key={st.id}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
                      st.isCompleted 
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-700' 
                        : st.notifyReminder
                          ? 'bg-amber-50/40 border-amber-200 text-slate-800'
                          : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleToggleSubTask(st.id)}
                        className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          st.isCompleted ? 'bg-emerald-600 text-white' : 'border border-slate-400 bg-white hover:border-blue-500'
                        }`}
                      >
                        {st.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <span className={`text-xs truncate ${st.isCompleted ? 'line-through text-slate-500' : 'font-medium'}`}>
                        {idx + 1}. {st.taskTitle}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSubTaskNotification(st.id)}
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          st.notifyReminder
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'text-slate-300 hover:text-amber-600 hover:bg-slate-100'
                        }`}
                        title={st.notifyReminder ? 'નોટિફિકેશન સક્રિય (Home Dashboard રિમાઇન્ડર)' : 'નોટિફિકેશન ચાલુ કરો'}
                      >
                        {st.notifyReminder ? <BellRing className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> : <Bell className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveSubTask(st.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                        title="દૂર કરો"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Custom Subtask Input with Notification Checkbox */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="નવું કસ્ટમ પેટા-કાર્ય લખો..."
                  value={newSubTaskInput}
                  onChange={e => setNewSubTaskInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubTask();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddSubTask()}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ઉમેરો</span>
                </button>
              </div>
              <label className="flex items-center space-x-1.5 text-[11px] text-slate-600 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={newSubTaskNotify}
                  onChange={e => setNewSubTaskNotify(e.target.checked)}
                  className="rounded-sm text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <Bell className="w-3 h-3 text-amber-600" />
                <span>આ કાર્ય માટે Home Dashboard પર રિમાઇન્ડર નોટિફિકેશન સેટ કરો</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              રદ કરો (Cancel)
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md cursor-pointer"
            >
              {initialActivity ? 'પ્રવૃત્તિ સાચવો (Update Activity)' : 'પ્રવૃત્તિ ઉમેરો (Add Activity)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
