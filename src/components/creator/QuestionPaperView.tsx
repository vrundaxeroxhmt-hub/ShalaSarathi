import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { STANDARDS_LIST, SUBJECTS_LIST } from '../../data/initialData';
import { 
  FileText, 
  Printer, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Edit3,
  HelpCircle,
  Share2
} from 'lucide-react';

interface QuestionItem {
  id: string;
  type: 'mcq' | 'blank' | 'truefalse' | 'short' | 'long';
  question: string;
  options?: string[];
  marks: number;
}

export const QuestionPaperView: React.FC = () => {
  const { schoolProfile, teacherProfile, showToast, addCommunityPost } = useApp();

  const [standard, setStandard] = useState('ધોરણ ૬');
  const [subject, setSubject] = useState('ગણિત');
  const [examName, setExamName] = useState('પ્રથમ સત્ર એકમ કસોટી - ૨૦૨૬');
  const [duration, setDuration] = useState('૧ કલાક (60 મિનિટ)');
  const [totalMarks, setTotalMarks] = useState(25);

  // Initial Question list prefilled with standard Gujarat textbook questions
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: 'q1',
      type: 'mcq',
      question: 'સૌથી નાની પ્રાકૃતિક સંખ્યા કઈ છે?',
      options: ['A. 0', 'B. 1', 'C. -1', 'D. 10'],
      marks: 1
    },
    {
      id: 'q2',
      type: 'mcq',
      question: 'જે ખૂણાનું માપ ૯૦ અંશ હોય તેને શું કહેવાય?',
      options: ['A. લઘુકોણ', 'B. કાટકોણ', 'C. ગુરુકોણ', 'D. સરળકોણ'],
      marks: 1
    },
    {
      id: 'q3',
      type: 'blank',
      question: 'બે અવિભાજ્ય સંખ્યાઓનો ગુ.સા.અ. હંમેશા ______ હોય છે.',
      marks: 1
    },
    {
      id: 'q4',
      type: 'truefalse',
      question: 'દરેક પૂર્ણ સંખ્યા એ પ્રાકૃતિક સંખ્યા પણ છે. (ખરું / ખોટું)',
      marks: 1
    },
    {
      id: 'q5',
      type: 'short',
      question: 'સંખ્યા રેખા પર (-૩) અને (+૫) વચ્ચેનું અંતર શોધો.',
      marks: 2
    },
    {
      id: 'q6',
      type: 'short',
      question: 'વિભાજ્યતાની ૫ ની ચાવી ઉદાહરણ આપી સમજાવો.',
      marks: 2
    },
    {
      id: 'q7',
      type: 'long',
      question: 'એક લંબચોરસ ખેતરની લંબાઈ ૨૫ મીટર અને પહોળાઈ ૧૨ મીટર હોય તો તેની પરિમિતિ અને ક્ષેત્રફળ શોધો.',
      marks: 4
    },
    {
      id: 'q8',
      type: 'long',
      question: 'ચોરસ અને લંબચોરસના ગુણધર્મો વચ્ચેનો તફાવત આકૃતિ દોરી સ્પષ્ટ કરો.',
      marks: 4
    }
  ]);

  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState<'mcq' | 'blank' | 'truefalse' | 'short' | 'long'>('short');
  const [newQuestionMarks, setNewQuestionMarks] = useState(2);

  const calculatedMarksSum = questions.reduce((sum, q) => sum + q.marks, 0);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: QuestionItem = {
      id: `q-${Date.now()}`,
      type: newQuestionType,
      question: newQuestionText,
      marks: newQuestionMarks,
      options: newQuestionType === 'mcq' ? ['A. ', 'B. ', 'C. ', 'D. '] : undefined
    };

    setQuestions([...questions, newQ]);
    setNewQuestionText('');
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleShareToCommunity = () => {
    addCommunityPost({
      creatorName: teacherProfile.name,
      creatorRole: teacherProfile.role,
      creatorSchool: teacherProfile.schoolName,
      creatorDistrict: teacherProfile.district,
      type: 'questionPaper',
      title: `${standard} ${subject} - ${examName}`,
      description: `GCERT અભ્યાસક્રમ આધારિત પ્રશ્નપત્ર. કુલ ગુણ: ${calculatedMarksSum}, સમય: ${duration}`,
      standard,
      subject,
      medium: 'ગુજરાતી',
      tags: [subject, standard, 'એકમ કસોટી', 'પ્રશ્નપત્ર'],
      fileSnippet: `${standard}_${subject}_Paper.pdf`
    });
    showToast('પ્રશ્નપત્ર કમ્યુનિટીમાં સફળતાપૂર્વક શેર કરવામાં આવ્યું!');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <FileText className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              પ્રશ્નપત્ર નિર્માણ (Question Paper Generator)
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            GCERT બ્લૂપ્રિન્ટ અનુસાર એકમ કસોટી, સત્રાંત પરીક્ષા કે રિવિઝન માટે આદર્શ પ્રશ્નપત્ર તૈયાર કરો અને પ્રિન્ટ મેળવો.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleShareToCommunity}
            className="inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>કમ્યુનિટીમાં શેર કરો</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>A4 પેપર પ્રિન્ટ</span>
          </button>
        </div>
      </div>

      {/* Configuration & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 no-print">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">ધોરણ (Standard)</label>
            <select
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            >
              {STANDARDS_LIST.map(std => (
                <option key={std} value={std}>{std}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">વિષય (Subject)</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            >
              {SUBJECTS_LIST.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">પરીક્ષાનું નામ</label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">સમય મર્યાદા</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">કુલ ગુણ</label>
            <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-200 rounded-lg p-2 font-bold text-indigo-900">
              <span>{calculatedMarksSum} ગુણ</span>
              <span className="text-[10px] text-indigo-600 font-normal">({questions.length} પ્રશ્નો)</span>
            </div>
          </div>

        </div>

        {/* Add Question Inline */}
        <form onSubmit={handleAddQuestion} className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5 items-end text-xs">
          <div className="w-full sm:w-40">
            <label className="block font-semibold text-slate-700 mb-1">પ્રશ્ન પ્રકાર</label>
            <select
              value={newQuestionType}
              onChange={(e) => setNewQuestionType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
            >
              <option value="mcq">વિકલ્પ (MCQ)</option>
              <option value="blank">ખાલી જગ્યા</option>
              <option value="truefalse">ખરાં-ખોટાં</option>
              <option value="short">ટૂંકો પ્રશ્ન</option>
              <option value="long">મુદ્દાસર પ્રશ્ન</option>
            </select>
          </div>

          <div className="flex-1 w-full">
            <label className="block font-semibold text-slate-700 mb-1">પ્રશ્નનું લખાણ</label>
            <input
              type="text"
              required
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="અહીં નવો પ્રશ્ન ટાઈપ કરો..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            />
          </div>

          <div className="w-20">
            <label className="block font-semibold text-slate-700 mb-1">ગુણ</label>
            <input
              type="number"
              min={1}
              max={10}
              value={newQuestionMarks}
              onChange={(e) => setNewQuestionMarks(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold text-center"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold shadow-xs whitespace-nowrap h-[38px]"
          >
            <Plus className="w-4 h-4" />
            <span>પ્રશ્ન ઉમેરો</span>
          </button>
        </form>
      </div>

      {/* Printable Question Paper Layout */}
      <div className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-sm max-w-4xl mx-auto min-h-[700px]">
        
        {/* Official Paper Header */}
        <div className="text-center border-b-2 border-slate-900 pb-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">{schoolProfile.schoolName}</h2>
          <p className="text-xs text-slate-700 mt-0.5">
            તા. {schoolProfile.taluka}, જિ. {schoolProfile.district} • UDISE: {schoolProfile.udiseCode}
          </p>
          <div className="mt-2 text-sm font-extrabold text-slate-900 uppercase tracking-wide">
            {examName} (શૈક્ષણિક વર્ષ {schoolProfile.academicYear})
          </div>

          {/* Paper Info Matrix */}
          <div className="grid grid-cols-4 text-xs font-bold text-slate-900 mt-3 pt-2 border-t border-slate-300">
            <div>ધોરણ: <strong>{standard}</strong></div>
            <div>વિષય: <strong>{subject}</strong></div>
            <div>સમય: <strong>{duration}</strong></div>
            <div>કુલ ગુણ: <strong>{calculatedMarksSum}</strong></div>
          </div>
        </div>

        {/* Student Name and Roll No Filling Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-800 my-4 py-2 border-b border-slate-200">
          <div>વિદ્યાર્થીનું નામ: ................................................................................</div>
          <div className="text-right">રોલ નંબર: [............] • વર્ગ: [.....]</div>
        </div>

        {/* General Instructions */}
        <div className="text-[11px] text-slate-600 italic mb-4">
          સૂચના: (૧) તમામ પ્રશ્નોના ઉત્તર સ્વચ્છ અને સુવાચ્ય અક્ષરે લખવા. (૨) જમણી બાજુ દર્શાવેલ અંક પ્રશ્નના ગુણ દર્શાવે છે.
        </div>

        {/* Questions Body */}
        <div className="space-y-4 text-xs text-slate-900">
          {questions.map((q, idx) => (
            <div key={q.id} className="group relative border-b border-slate-100 pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-2 flex-1">
                  <span className="font-bold text-slate-900">પ્રશ્ન {idx + 1}.</span>
                  <div className="flex-1">
                    <p className="font-semibold leading-relaxed">{q.question}</p>
                    
                    {/* MCQ Options */}
                    {q.options && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 font-medium text-slate-700">
                        {q.options.map((opt, oIdx) => (
                          <span key={oIdx}>{opt}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pl-4">
                  <span className="font-bold font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    [{q.marks} ગુણ]
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity no-print"
                    title="પ્રશ્ન કાઢી નાખો"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paper End Stamp */}
        <div className="mt-12 pt-6 border-t border-slate-300 text-center text-xs font-bold text-slate-700">
          --- ★ પરીક્ષા સંપન્ન ★ ---
        </div>

      </div>

    </div>
  );
};
