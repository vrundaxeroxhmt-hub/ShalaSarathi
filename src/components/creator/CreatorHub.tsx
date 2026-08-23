import React from 'react';
import { useApp } from '../../context/AppContext';
import { SubFeatureType } from '../../types';
import { QuestionPaperView } from './QuestionPaperView';
import { TeacherDiaryView } from './TeacherDiaryView';
import { 
  FileText, 
  BookOpen, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  Layers,
  Award
} from 'lucide-react';

export const CreatorHub: React.FC = () => {
  const { activeSubFeature, setActiveSubFeature } = useApp();

  const creatorTools = [
    {
      id: 'question-paper' as SubFeatureType,
      title: 'પ્રશ્નપત્ર નિર્માણ (Question Paper Generator)',
      desc: 'GCERT બ્લૂપ્રિન્ટ અનુસાર એકમ કસોટી, પ્રથમ સત્ર અને દ્વિતીય સત્ર પરીક્ષા માટેના પ્રશ્નપત્રો અને ગુણ વિભાજન.',
      icon: FileText,
      badge: 'GCERT ફોર્મેટ',
      color: 'bg-indigo-600 text-white'
    },
    {
      id: 'lesson-planning' as SubFeatureType,
      title: 'શિક્ષક ડાયરી અને અધ્યયન નિષ્પત્તિ (Teacher Diary)',
      desc: 'દૈનિક તાસ મુજબ શૈક્ષણિક કાર્ય નોંધ, અધ્યયન નિષ્પત્તિઓ (Learning Outcomes) અને TLM પ્રવૃત્તિઓ.',
      icon: BookOpen,
      badge: 'દૈનિક નોંધ',
      color: 'bg-rose-600 text-white'
    }
  ];

  if (activeSubFeature === 'question-paper') {
    return (
      <div>
        <div className="mb-4 no-print">
          <button
            type="button"
            onClick={() => setActiveSubFeature('creator-hub')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>પાછા ટૂલ્સ મેનૂમાં જાઓ</span>
          </button>
        </div>
        <QuestionPaperView />
      </div>
    );
  }

  if (activeSubFeature === 'lesson-planning') {
    return (
      <div>
        <div className="mb-4 no-print">
          <button
            type="button"
            onClick={() => setActiveSubFeature('creator-hub')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>પાછા ટૂલ્સ મેનૂમાં જાઓ</span>
          </button>
        </div>
        <TeacherDiaryView />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <Sparkles className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              શિક્ષણ સામગ્રી નિર્માણ સાધનો (Teaching Creator Tools)
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            પ્રશ્નપત્રો, બ્લૂપ્રિન્ટ, દૈનિક શિક્ષક ડાયરી અને અધ્યયન નિષ્પત્તિઓનું આયોજન સરળતાથી કરો.
          </p>
        </div>
      </div>

      {/* Grid of Creator Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {creatorTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => setActiveSubFeature(tool.id)}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tool.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {tool.badge}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
                <span>સાધન ખોલો</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
