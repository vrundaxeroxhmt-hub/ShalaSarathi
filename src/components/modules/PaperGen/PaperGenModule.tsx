import React, { useState } from 'react';
import { FileQuestion, Printer, Plus, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { PaperTemplate, PaperType } from '@/types/paperGenerator';
import { TeacherProfile } from '@/types/user';

interface Props {
  templates: PaperTemplate[];
  teacher: TeacherProfile;
}

export const PaperGenModule: React.FC<Props> = ({ templates, teacher }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PaperTemplate>(templates[0]);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const paperTypes: string[] = ['All', 'Question Paper', 'Worksheet', 'Notice', 'Certificate', 'Letter'];

  const filtered = templates.filter(t => activeFilter === 'All' || t.type === activeFilter);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>સ્માર્ટ શાળા પેપર અને દસ્તાવેજ જનરેટર</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">પ્રશ્નપત્ર, વર્કશીટ અને નોટિસ જનરેટર</h2>
          <p className="text-xs text-slate-500 mt-1">
            પરીક્ષા પ્રશ્નપત્રો, FLN વર્કશીટ, SMC નોટિસ અને શાળા સર્ટિફિકેટ્સ સ્ટાન્ડર્ડ ફોર્મેટમાં તૈયાર કરો.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>પેપર પ્રિન્ટ / PDF</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {paperTypes.map(t => (
          <button
            key={t}
            onClick={() => setActiveFilter(t)}
            className={`px-4 py-2 rounded-xl transition-all border ${
              activeFilter === t
                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t === 'All' ? 'બધા ટેમ્પ્લેટ્સ' : t}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Template Selector */}
        <div className="lg:col-span-4 space-y-3">
          {filtered.map(tmpl => (
            <button
              key={tmpl.id}
              onClick={() => setSelectedTemplate(tmpl)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                tmpl.id === selectedTemplate?.id
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950 font-semibold'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded">
                  {tmpl.type}
                </span>
                {tmpl.standardGuj && (
                  <span className="text-[10px] text-slate-500">{tmpl.standardGuj}</span>
                )}
              </div>
              <div className="text-xs font-bold text-slate-900 mt-1">{tmpl.titleGuj}</div>
              <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">{tmpl.descriptionGuj}</div>
            </button>
          ))}
        </div>

        {/* Right Side: Printable Paper Workspace */}
        <div className="lg:col-span-8">
          {selectedTemplate && (
            <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-2xl space-y-6 print-container font-sans">
              {/* Exam Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <div className="text-xs font-bold text-slate-600">{teacher.school.schoolNameGuj} - {teacher.school.village}</div>
                <h1 className="text-xl font-black text-slate-900">{selectedTemplate.titleGuj}</h1>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 pt-2 px-4">
                  <span>ધોરણ / વિષય: {selectedTemplate.standardGuj || 'સામાન્ય'} - {selectedTemplate.subjectGuj || ''}</span>
                  {selectedTemplate.totalMarks && <span>કુલ ગુણ: {selectedTemplate.totalMarks}</span>}
                  {selectedTemplate.timeDurationGuj && <span>સમય: {selectedTemplate.timeDurationGuj}</span>}
                </div>
              </div>

              {/* Student Metadata Box */}
              <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 rounded-xl text-xs font-bold">
                <div>વિદ્યાર્થીનું નામ: _____________________________________</div>
                <div>રોલ નંબર / હાજરી ક્રમાંક: __________</div>
              </div>

              {/* Sections & Questions */}
              <div className="space-y-6 text-xs text-slate-900">
                {selectedTemplate.sectionsGuj.map((sec, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="font-extrabold text-sm text-slate-900 bg-slate-100 p-2 rounded-lg border border-slate-200">
                      {sec.headingGuj}
                    </div>
                    <div className="space-y-2.5 pl-2">
                      {sec.questionsGuj.map((q, qIdx) => (
                        <div key={qIdx} className="font-semibold leading-relaxed">
                          ({qIdx + 1}) {q}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t-2 border-slate-900 pt-8 mt-12 flex justify-between text-xs font-bold text-slate-900">
                <div>વિષય શિક્ષકની સહી</div>
                <div>મુખ્ય શિક્ષક / આચાર્ય સહી</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
