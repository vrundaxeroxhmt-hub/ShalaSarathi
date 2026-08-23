import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { STANDARDS_LIST } from '../../data/initialData';
import { Users, Plus, Trash2, Edit2, Check, X, Search, GraduationCap } from 'lucide-react';

interface StudentRosterModalProps {
  onClose: () => void;
}

export const StudentRosterModal: React.FC<StudentRosterModalProps> = ({ onClose }) => {
  const { students, addStudent, updateStudent, deleteStudent } = useApp();
  const [selectedStd, setSelectedStd] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New Student Form state
  const [formData, setFormData] = useState({
    grNo: '',
    rollNo: 1,
    fullName: '',
    gender: 'કુમાર' as 'કુમાર' | 'કન્યા',
    dob: '2013-06-01',
    standard: '6',
    division: 'A',
    parentName: '',
    mobile: '',
    category: 'સામાન્ય' as 'સામાન્ય' | 'ઓ.બી.સી.' | 'એસ.સી.' | 'એસ.ટી.' | 'ઈ.ડબલ્યુ.એસ.',
    medium: 'ગુજરાતી',
    isActive: true
  });

  const filteredStudents = students.filter(s => {
    const matchesStd = selectedStd === 'all' || s.standard === selectedStd;
    const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.grNo.includes(searchQuery) ||
                          s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStd && matchesSearch;
  });

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.grNo.trim()) return;

    addStudent(formData);
    setFormData({
      grNo: '',
      rollNo: students.length + 1,
      fullName: '',
      gender: 'કુમાર',
      dob: '2013-06-01',
      standard: formData.standard,
      division: 'A',
      parentName: '',
      mobile: '',
      category: 'સામાન્ય',
      medium: 'ગુજરાતી',
      isActive: true
    });
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">શાળા વિદ્યાર્થી યાદી (Student Database)</h3>
              <p className="text-xs text-slate-500">
                પત્રક A, B, C, પ્રમાણપત્રો અને પરિણામો માટે આપમેળે વિદ્યાર્થીઓની વિગત ઉમેરાશે.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="py-3 flex flex-wrap gap-3 items-center justify-between border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="નામ / જી.આર. નં. થી શોધો..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 w-52 sm:w-64"
              />
            </div>

            <select
              value={selectedStd}
              onChange={(e) => setSelectedStd(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">બધા ધોરણ ({students.length})</option>
              {STANDARDS_LIST.map((std, idx) => (
                <option key={std} value={String(idx + 1)}>
                  {std}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>નવો વિદ્યાર્થી ઉમેરો</span>
          </button>
        </div>

        {/* Add Student Form */}
        {isAdding && (
          <form onSubmit={handleSubmitNew} className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 my-3 text-xs">
            <div className="font-bold text-amber-900 mb-3 flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>વિદ્યાર્થીની નવી નોંધણી</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">જી.આર. નંબર (G.R. No.) *</label>
                <input
                  type="text"
                  required
                  value={formData.grNo}
                  onChange={(e) => setFormData({ ...formData, grNo: e.target.value })}
                  placeholder="દા.ત. 1426"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">રોલ નંબર (Roll No.) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: parseInt(e.target.value) || 1 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">વિદ્યાર્થીનું પૂરું નામ *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="અટક નામ પિતાનું નામ"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">જાતિ (Gender)</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="કુમાર">કુમાર (Boy)</option>
                  <option value="કન્યા">કન્યા (Girl)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">ધોરણ (Standard)</label>
                <select
                  value={formData.standard}
                  onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500"
                >
                  {STANDARDS_LIST.map((std, idx) => (
                    <option key={std} value={String(idx + 1)}>{std}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">વર્ગ (Division)</label>
                <input
                  type="text"
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">પિતા/વાલીનું નામ</label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="વાલીનું નામ"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">મોબાઇલ નંબર</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="98XXXXXXXX"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="mt-3 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
              >
                રદ કરો
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold"
              >
                સાચવો (Save Student)
              </button>
            </div>
          </form>
        )}

        {/* Student Table */}
        <div className="flex-1 overflow-y-auto mt-2 border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
              <tr>
                <th className="py-2.5 px-3">રોલ નં.</th>
                <th className="py-2.5 px-3">જી.આર. નં.</th>
                <th className="py-2.5 px-3">વિદ્યાર્થીનું નામ</th>
                <th className="py-2.5 px-3">ધોરણ-વર્ગ</th>
                <th className="py-2.5 px-3">જાતિ</th>
                <th className="py-2.5 px-3">કેટેગરી</th>
                <th className="py-2.5 px-3">વાલી અને મોબાઇલ</th>
                <th className="py-2.5 px-3 text-right">ક્રિયા</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    કોઈ વિદ્યાર્થી મળ્યા નથી.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-2 px-3 font-semibold text-slate-800">{s.rollNo}</td>
                    <td className="py-2 px-3 font-mono text-slate-600">{s.grNo}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">{s.fullName}</td>
                    <td className="py-2 px-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[11px] font-medium">
                        ધોરણ {s.standard} - {s.division}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        s.gender === 'કન્યા' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {s.gender}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-600">{s.category}</td>
                    <td className="py-2 px-3 text-slate-600">
                      <div>{s.parentName || '-'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.mobile}</div>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => deleteStudent(s.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-sm hover:bg-red-50"
                        title="દૂર કરો"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>કુલ વિદ્યાર્થીઓ: <strong className="text-slate-800">{students.length}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
          >
            બંધ કરો (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
