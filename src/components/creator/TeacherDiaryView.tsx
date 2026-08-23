import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { STANDARDS_LIST, SUBJECTS_LIST } from '../../data/initialData';
import { 
  BookOpen, 
  Printer, 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';

interface DiaryEntry {
  id: string;
  date: string;
  period: string;
  standard: string;
  subject: string;
  chapter: string;
  learningOutcome: string;
  tlmActivity: string;
  homework: string;
}

export const TeacherDiaryView: React.FC = () => {
  const { schoolProfile, teacherProfile } = useApp();

  const [entries, setEntries] = useState<DiaryEntry[]>([
    {
      id: 'd1',
      date: new Date().toISOString().split('T')[0],
      period: 'તાસ - ૧',
      standard: 'ધોરણ ૬',
      subject: 'ગણિત',
      chapter: 'પ્રકરણ ૨: પૂર્ણ સંખ્યાઓ',
      learningOutcome: 'M601: પૂર્ણ સંખ્યાઓના સરવાળા અને ગુણાકારના નિયમો સમજે છે.',
      tlmActivity: 'સંખ્યાપટ્ટી અને મણકાઘોડી દ્વારા ક્રમનો ગુણધર્મ સમજાવ્યો.',
      homework: 'સ્વાધ્યાય ૨.૧ ના પ્રશ્ન ૧ થી ૪ ગણવા.'
    },
    {
      id: 'd2',
      date: new Date().toISOString().split('T')[0],
      period: 'તાસ - ૨',
      standard: 'ધોરણ ૭',
      subject: 'વિજ્ઞાન',
      chapter: 'પ્રકરણ ૧: વનસ્પતિમાં પોષણ',
      learningOutcome: 'SC701: પ્રકાશસંશ્લેષણની પ્રક્રિયા અને હરિતદ્રવ્યનું મહત્વ વર્ણવે છે.',
      tlmActivity: 'પર્ણ પર આયોડિન કસોટી પ્રયોગ નિદર્શન કરાવ્યું.',
      homework: 'પ્રકાશસંશ્લેષણનું નામનિર્દેશનવાળું રેખાચિત્ર દોરવું.'
    },
    {
      id: 'd3',
      date: new Date().toISOString().split('T')[0],
      period: 'તાસ - ૩',
      standard: 'ધોરણ ૮',
      subject: 'સામાજિક વિજ્ઞાન',
      chapter: 'પ્રકરણ ૩: ભારતમાં રાષ્ટ્રવાદ',
      learningOutcome: 'SS804: અસહકાર આંદોલન અને દાંડીકૂચના બનાવોનું વિશ્લેષણ કરે છે.',
      tlmActivity: 'ગુજરાતના નકશામાં દાંડી યાત્રાનો રૂટ દર્શાવ્યો.',
      homework: 'ગાંધીજીના રચનાત્મક કાર્યો વિશે ૫ વાક્ય લખવા.'
    }
  ]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    period: 'તાસ - ૧',
    standard: 'ધોરણ ૬',
    subject: 'ગણિત',
    chapter: '',
    learningOutcome: '',
    tlmActivity: '',
    homework: ''
  });

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.chapter.trim()) return;

    setEntries([
      ...entries,
      {
        id: `d-${Date.now()}`,
        ...formData
      }
    ]);

    setShowAddModal(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      period: 'તાસ - ૨',
      standard: formData.standard,
      subject: formData.subject,
      chapter: '',
      learningOutcome: '',
      tlmActivity: '',
      homework: ''
    });
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-rose-100 text-rose-800">
              <BookOpen className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              શિક્ષક દૈનિક ડાયરી (Teacher Diary & Lesson Notes)
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            દૈનિક તાસ મુજબ શૈક્ષણિક કાર્ય નોંધ, અધ્યયન નિષ્પત્તિ, TLM પ્રવૃત્તિ અને ગૃહકાર્યની અધિકૃત ડાયરી.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>નવો તાસ / નોંધ ઉમેરો</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>A4 ડાયરી પ્રિન્ટ</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet View */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        
        {/* Official Header */}
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">{schoolProfile.schoolName}</h2>
          <p className="text-xs text-slate-700 mt-0.5">
            {schoolProfile.address} • UDISE: <span className="font-mono font-bold">{schoolProfile.udiseCode}</span>
          </p>
          <div className="mt-2 inline-block bg-rose-100 px-4 py-1 rounded-full text-xs font-bold text-rose-950 border border-rose-300">
            શિક્ષક દૈનિક કાર્ય નોંધવહી (TEACHER'S DAILY DIARY) — શૈક્ષણિક વર્ષ {schoolProfile.academicYear}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 text-xs font-semibold text-slate-800 mt-3 pt-2 border-t border-slate-200">
            <div>શિક્ષકનું નામ: <strong>{teacherProfile.name}</strong></div>
            <div>હોદ્દો: <strong>{teacherProfile.role}</strong></div>
            <div>તારીખ: <strong>{new Date().toISOString().split('T')[0]}</strong></div>
          </div>
        </div>

        {/* Entries Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-300">
              <tr>
                <th className="p-2.5 border-r border-slate-300 w-16 text-center">તાસ</th>
                <th className="p-2.5 border-r border-slate-300 w-24">ધોરણ / વિષય</th>
                <th className="p-2.5 border-r border-slate-300 w-36">પ્રકરણ / એકમ</th>
                <th className="p-2.5 border-r border-slate-300">અધ્યયન નિષ્પત્તિ (Learning Outcome)</th>
                <th className="p-2.5 border-r border-slate-300">શિક્ષણ પદ્ધતિ / TLM પ્રવૃત્તિ</th>
                <th className="p-2.5 border-r border-slate-300 w-44">સ્વાધ્યાય / ગૃહકાર્ય</th>
                <th className="p-2.5 text-center w-12 no-print">ક્રિયા</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {entries.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-2.5 border-r border-slate-200 text-center font-bold text-slate-800 bg-slate-50">
                    {item.period}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-900">
                    <div>{item.standard}</div>
                    <div className="text-[11px] text-slate-500">{item.subject}</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 font-medium text-slate-800">
                    {item.chapter}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-slate-700 leading-relaxed">
                    {item.learningOutcome || '-'}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-slate-700 leading-relaxed">
                    {item.tlmActivity || '-'}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-slate-700">
                    {item.homework || '-'}
                  </td>
                  <td className="p-2.5 text-center no-print">
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                      title="દૂર કરો"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="mt-12 pt-8 grid grid-cols-2 text-center text-xs font-bold text-slate-800">
          <div>
            <p className="border-t border-slate-400 pt-1 inline-block px-8">વર્ગ શિક્ષકની સહી</p>
          </div>
          <div>
            <p className="border-t border-slate-400 pt-1 inline-block px-8">આચાર્ય / સી.આર.સી. કક્ષાએ ચકાસણી સહી</p>
          </div>
        </div>

      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">ડાયરીમાં નવો તાસ ઉમેરો</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3 text-xs">
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">તાસ (Period)</label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="તાસ - ૧">તાસ - ૧</option>
                    <option value="તાસ - ૨">તાસ - ૨</option>
                    <option value="તાસ - ૩">તાસ - ૩</option>
                    <option value="તાસ - ૪">તાસ - ૪</option>
                    <option value="તાસ - ૫">તાસ - ૫</option>
                    <option value="તાસ - ૬">તાસ - ૬</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ધોરણ</label>
                  <select
                    value={formData.standard}
                    onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    {STANDARDS_LIST.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">વિષય</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    {SUBJECTS_LIST.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">પ્રકરણ / એકમનું નામ *</label>
                <input
                  type="text"
                  required
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                  placeholder="દા.ત. પ્રકરણ ૩: પૂર્ણ સંખ્યાઓ"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">અધ્યયન નિષ્પત્તિ (Learning Outcome)</label>
                <input
                  type="text"
                  value={formData.learningOutcome}
                  onChange={(e) => setFormData({ ...formData, learningOutcome: e.target.value })}
                  placeholder="દા.ત. M602: સંખ્યાઓ વચ્ચેની તુલના સમજે છે"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">શિક્ષણ પદ્ધતિ / TLM પ્રવૃત્તિ</label>
                <input
                  type="text"
                  value={formData.tlmActivity}
                  onChange={(e) => setFormData({ ...formData, tlmActivity: e.target.value })}
                  placeholder="દા.ત. ફ્લેશ કાર્ડ અને ચાર્ટ દ્વારા પ્રવૃત્તિ કરાવી"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ગૃહકાર્ય / સ્વાધ્યાય</label>
                <input
                  type="text"
                  value={formData.homework}
                  onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
                  placeholder="દા.ત. સ્વાધ્યાય પ્રશ્ન ૧ થી ૫"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-xs"
                >
                  ડાયરીમાં સાચવો
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
