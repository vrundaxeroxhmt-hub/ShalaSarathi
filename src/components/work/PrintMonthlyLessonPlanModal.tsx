import React from 'react';
import { MonthlyLessonPlan } from '../../types';
import { X, Printer, Download, BookOpen, CheckCircle2, Circle } from 'lucide-react';

interface PrintMonthlyLessonPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MonthlyLessonPlan;
}

export const PrintMonthlyLessonPlanModal: React.FC<PrintMonthlyLessonPlanModalProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalSubtasks = plan.dailyActivities.reduce((acc, act) => acc + act.subTasks.length, 0);
  const completedSubtasks = plan.dailyActivities.reduce(
    (acc, act) => acc + act.subTasks.filter(t => t.isCompleted).length, 
    0
  );
  const completionPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white no-print">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">
              માસિક પાઠ આયોજન & દૈનિક પ્રવૃત્તિ રજિસ્ટર (A4 Print Preview)
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>પ્રિન્ટ / PDF ડાઉનલોડ</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document Container */}
        <div className="p-8 max-h-[80vh] overflow-y-auto print:max-h-none print:p-0 bg-slate-100 print:bg-white">
          <div className="bg-white p-8 rounded-xl print:rounded-none shadow-sm print:shadow-none border border-slate-200 print:border-none mx-auto max-w-3xl text-slate-900 text-xs">
            {/* Gujarat Education Inspection Header */}
            <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
              <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                ગુજરાત પ્રાથમિક શિક્ષણ વિભાગ • GCERT પાઠ્યક્રમ આધારિત
              </p>
              <h1 className="text-lg font-black text-slate-900 mt-0.5">
                {plan.schoolName || 'શ્રી પ્રાથમિક શાળા'}
              </h1>
              <h2 className="text-sm font-bold text-slate-800 mt-0.5">
                માસિક પાઠ આયોજન અને દૈનિક વર્ગખંડ પ્રવૃત્તિ વિભાજન પત્રક
              </h2>
              <p className="text-[11px] text-slate-600 mt-1">
                શિક્ષકનું નામ: <span className="font-bold text-slate-900">{plan.teacherName}</span> • માસ:{' '}
                <span className="font-bold text-slate-900">{plan.month}</span> • શૈક્ષણિક વર્ષ:{' '}
                <span className="font-bold text-slate-900">{plan.academicYear}</span>
              </p>
            </div>

            {/* Plan Info Grid */}
            <div className="grid grid-cols-4 gap-2 bg-slate-50 border border-slate-300 rounded-lg p-2.5 mb-4 text-[11px]">
              <div>
                <span className="text-slate-500 block">ધોરણ અને વર્ગ:</span>
                <span className="font-bold text-slate-800">{plan.standard} ({plan.division})</span>
              </div>
              <div>
                <span className="text-slate-500 block">વિષય:</span>
                <span className="font-bold text-slate-800">{plan.subject}</span>
              </div>
              <div>
                <span className="text-slate-500 block">કુલ આયોજિત દિવસો:</span>
                <span className="font-bold text-slate-800">{plan.dailyActivities.length} દિવસો</span>
              </div>
              <div>
                <span className="text-slate-500 block">પ્રવૃત્તિ પૂર્ણતા:</span>
                <span className="font-bold text-emerald-700">{completionPercentage}% ({completedSubtasks}/{totalSubtasks} કાર્યો)</span>
              </div>
            </div>

            {/* Units & Learning Outcomes Box */}
            <div className="border border-slate-300 rounded-lg p-2.5 mb-4 bg-white text-[11px] space-y-2">
              <div>
                <span className="font-bold text-slate-900">સમાવિષ્ટ એકમો / પ્રકરણો:</span>{' '}
                <span className="text-slate-700">{plan.unitsCovered.join(' • ')}</span>
              </div>
              {plan.targetLearningOutcomes.length > 0 && (
                <div>
                  <span className="font-bold text-slate-900">મુખ્ય અધ્યયન નિષ્પત્તિઓ (LOs):</span>
                  <ul className="list-disc list-inside mt-0.5 text-slate-700 space-y-0.5 pl-1">
                    {plan.targetLearningOutcomes.map((lo, idx) => (
                      <li key={idx}>{lo}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Daily Activities Table */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                દૈનિક વર્ગખંડ પ્રવૃત્તિઓ અને ચેકલિસ્ટ વિગત (Daily Activities & Task Matrix):
              </h3>
              <table className="w-full border-collapse border border-slate-400 text-[10px]">
                <thead>
                  <tr className="bg-slate-200 text-slate-800 font-bold text-center">
                    <th className="border border-slate-400 p-1.5 w-10">દિવસ / તાસ</th>
                    <th className="border border-slate-400 p-1.5 w-20">તારીખ & મુદ્દો</th>
                    <th className="border border-slate-400 p-1.5">અધ્યયન-અધ્યાપન પ્રવૃત્તિ & TLM</th>
                    <th className="border border-slate-400 p-1.5 w-48">પેટા-કાર્યો ચેકલિસ્ટ (Sub-Tasks)</th>
                    <th className="border border-slate-400 p-1.5 w-16">સ્થિતિ / નોંધ</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.dailyActivities.map((act) => (
                    <tr key={act.id} className="border border-slate-400 align-top">
                      <td className="border border-slate-400 p-1.5 text-center font-bold bg-slate-50">
                        <div>દિવસ {act.dayNumber}</div>
                        <div className="text-[9px] text-slate-500 font-normal">તાસ {act.periodNumber}</div>
                      </td>
                      <td className="border border-slate-400 p-1.5 font-medium">
                        <div className="text-slate-600 text-[9px]">{act.date}</div>
                        <div className="font-bold text-slate-900 mt-0.5">{act.topic}</div>
                        {act.learningOutcome && (
                          <div className="text-[9px] text-blue-800 mt-0.5 bg-blue-50 p-0.5 rounded">
                            {act.learningOutcome}
                          </div>
                        )}
                      </td>
                      <td className="border border-slate-400 p-1.5">
                        <p className="text-slate-800 leading-tight">{act.teachingActivity}</p>
                        {act.tlmUsed && (
                          <div className="mt-1 text-[9px] text-slate-600">
                            <span className="font-semibold">TLM:</span> {act.tlmUsed}
                          </div>
                        )}
                        {act.homework && (
                          <div className="mt-0.5 text-[9px] text-slate-600">
                            <span className="font-semibold">ગૃહકાર્ય:</span> {act.homework}
                          </div>
                        )}
                      </td>
                      <td className="border border-slate-400 p-1.5 bg-slate-50/50">
                        <ul className="space-y-1">
                          {act.subTasks.map((st) => (
                            <li key={st.id} className="flex items-start space-x-1">
                              <span className="mt-0.5 text-slate-600">
                                {st.isCompleted ? '☑' : '☐'}
                              </span>
                              <span className={st.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}>
                                {st.taskTitle}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="border border-slate-400 p-1.5 text-center">
                        <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded ${
                          act.status === 'પૂર્ણ' ? 'bg-emerald-100 text-emerald-800' :
                          act.status === 'ચાલુ' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {act.status}
                        </span>
                        {act.teacherNotes && (
                          <p className="text-[8px] text-slate-500 mt-1 italic leading-tight">
                            {act.teacherNotes}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signature and Verification Footer */}
            <div className="grid grid-cols-3 gap-4 pt-8 mt-6 border-t border-slate-400 text-center text-[10px]">
              <div>
                <div className="h-8"></div>
                <p className="font-bold text-slate-800">વિષય શિક્ષકની સહી</p>
                <p className="text-[9px] text-slate-500">({plan.teacherName})</p>
              </div>
              <div>
                <div className="h-8"></div>
                <p className="font-bold text-slate-800">આચાર્યશ્રીની સહી & સિક્કો</p>
                <p className="text-[9px] text-slate-500">(શાળા મહોર સાથે)</p>
              </div>
              <div>
                <div className="h-8"></div>
                <p className="font-bold text-slate-800">CRC / BRC કો-ઓર્ડિનેટર સહી</p>
                <p className="text-[9px] text-slate-500">(તપાસણી શેરો)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
