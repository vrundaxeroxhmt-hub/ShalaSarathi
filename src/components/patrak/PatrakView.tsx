import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { STANDARDS_LIST, SUBJECTS_LIST } from '../../data/initialData';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Users, 
  Sparkles, 
  CheckCircle, 
  Save, 
  Filter,
  Layers,
  Award
} from 'lucide-react';

export const PatrakView: React.FC = () => {
  const { schoolProfile, teacherProfile, students, updateStudent, showToast } = useApp();

  const [selectedPatrakType, setSelectedPatrakType] = useState<'A' | 'B' | 'C'>('A');
  const [selectedStandard, setSelectedStandard] = useState<string>('6');
  const [selectedDivision, setSelectedDivision] = useState<string>('A');
  const [selectedSubject, setSelectedSubject] = useState<string>('ગણિત');
  const [term, setTerm] = useState<'પ્રથમ સત્ર' | 'દ્વિતીય સત્ર'>('પ્રથમ સત્ર');

  // Filter students by selected standard
  const currentStudents = students.filter(s => s.standard === selectedStandard);

  // Score state overrides
  const [localScoresA, setLocalScoresA] = useState<Record<string, number>>({});
  const [localGradesB, setLocalGradesB] = useState<Record<string, Record<string, string>>>({});
  const [localScoresC, setLocalScoresC] = useState<Record<string, number>>({});

  const bTraits = [
    'નિયમિતતા', 'સ્વચ્છતા', 'સહકાર', 'નેતૃત્વ', 
    'જિજ્ઞાસા', 'સર્જનાત્મકતા', 'રમતગમત', 'શિસ્ત'
  ];

  const handleScoreAChange = (studentId: string, val: number) => {
    const clamped = Math.max(0, Math.min(40, val));
    setLocalScoresA(prev => ({ ...prev, [studentId]: clamped }));
  };

  const handleGradeBChange = (studentId: string, trait: string, grade: string) => {
    setLocalGradesB(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [trait]: grade
      }
    }));
  };

  const handleScoreCChange = (studentId: string, val: number) => {
    const clamped = Math.max(0, Math.min(80, val));
    setLocalScoresC(prev => ({ ...prev, [studentId]: clamped }));
  };

  const handleSaveAll = () => {
    currentStudents.forEach(s => {
      const scoreA = localScoresA[s.id] ?? s.patrakAMarks?.[selectedSubject] ?? 35;
      const gradesB = localGradesB[s.id] ?? s.patrakBGrades ?? {};
      const scoreC = localScoresC[s.id] ?? s.patrakCMarks?.[selectedSubject] ?? 70;

      updateStudent(s.id, {
        patrakAMarks: { ...(s.patrakAMarks || {}), [selectedSubject]: scoreA },
        patrakBGrades: { ...(s.patrakBGrades || {}), ...gradesB },
        patrakCMarks: { ...(s.patrakCMarks || {}), [selectedSubject]: scoreC }
      });
    });
    showToast(`પત્રક ${selectedPatrakType} નો ડેટા સાચવવામાં આવ્યો!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <FileSpreadsheet className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              પત્રક ઓટોમેશન એન્જિન (Patrak Automation)
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            વિદ્યાર્થીઓની માહિતી એકવાર દાખલ કરો, પત્રક A (રચનાત્મક), પત્રક B (વ્યક્તિત્વ વિકાસ) અને પત્રક C (પરિણામ પત્રક) આપોઆપ તૈયાર થઈ જશે.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>ડેટા સાચવો (Save)</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>A4 પ્રિન્ટ / PDF</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 no-print">
        
        {/* Patrak Type Tabs */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setSelectedPatrakType('A')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              selectedPatrakType === 'A'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>પત્રક A: રચનાત્મક મૂલ્યાંકન (૪૦ ગુણ)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPatrakType('B')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              selectedPatrakType === 'B'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>પત્રક B: વ્યક્તિત્વ વિકાસ (ગ્રેડ)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPatrakType('C')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              selectedPatrakType === 'C'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>પત્રક C: પરિણામ પત્રક (૮૦ ગુણ)</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">ધોરણ (Standard)</label>
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            >
              {STANDARDS_LIST.map((std, idx) => (
                <option key={std} value={String(idx + 1)}>{std}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">વર્ગ (Division)</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="A">વર્ગ - A</option>
              <option value="B">વર્ગ - B</option>
              <option value="C">વર્ગ - C</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">વિષય (Subject)</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            >
              {SUBJECTS_LIST.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">સત્ર (Academic Term)</label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="પ્રથમ સત્ર">પ્રથમ સત્ર (First Term)</option>
              <option value="દ્વિતીય સત્ર">દ્વિતીય સત્ર (Second Term)</option>
            </select>
          </div>

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
          <div className="mt-2 inline-block bg-slate-100 px-4 py-1 rounded-full text-xs font-bold text-slate-900 border border-slate-300">
            {selectedPatrakType === 'A' && `પત્રક - A: રચનાત્મક મૂલ્યાંકન પત્રક (${term})`}
            {selectedPatrakType === 'B' && `પત્રક - B: સર્વગ્રાહી વ્યક્તિત્વ વિકાસ પત્રક (${term})`}
            {selectedPatrakType === 'C' && `પત્રક - C: સત્રાંત પરિણામ પત્રક (${term})`}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 text-xs font-semibold text-slate-800 mt-3 pt-2 border-t border-slate-200">
            <div>ધોરણ: <strong>{selectedStandard} - {selectedDivision}</strong></div>
            <div>વિષય: <strong>{selectedSubject}</strong></div>
            <div>શૈક્ષણિક વર્ષ: <strong>{schoolProfile.academicYear}</strong></div>
            <div>વર્ગ શિક્ષક: <strong>{teacherProfile.name}</strong></div>
          </div>
        </div>

        {/* Data Table */}
        {currentStudents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            આ ધોરણમાં કોઈ વિદ્યાર્થી મળ્યા નથી. કૃપા કરીને ઉપરની યાદીમાંથી વિદ્યાર્થી ઉમેરો.
          </div>
        ) : (
          <div className="overflow-x-auto">
            
            {/* PATRAK A */}
            {selectedPatrakType === 'A' && (
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300 w-12 text-center">રોલ નં.</th>
                    <th className="p-2 border-r border-slate-300 w-20">જી.આર. નં.</th>
                    <th className="p-2 border-r border-slate-300">વિદ્યાર્થીનું નામ</th>
                    <th className="p-2 border-r border-slate-300 w-24 text-center">સ્વાધ્યાય (૧૦)</th>
                    <th className="p-2 border-r border-slate-300 w-24 text-center">પ્રવૃત્તિ (૧૦)</th>
                    <th className="p-2 border-r border-slate-300 w-24 text-center">પ્રોજેક્ટ (૧૦)</th>
                    <th className="p-2 border-r border-slate-300 w-24 text-center">મૌખિક (૧૦)</th>
                    <th className="p-2 border-r border-slate-300 w-24 text-center bg-emerald-50">કુલ ગુણ (૪૦)</th>
                    <th className="p-2 text-center w-16 bg-emerald-50">ગ્રેડ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentStudents.map((s) => {
                    const score = localScoresA[s.id] ?? s.patrakAMarks?.[selectedSubject] ?? 35;
                    const p1 = Math.round(score * 0.25);
                    const p2 = Math.round(score * 0.25);
                    const p3 = Math.round(score * 0.25);
                    const p4 = score - (p1 + p2 + p3);
                    const grade = score >= 36 ? 'A+' : score >= 32 ? 'A' : score >= 24 ? 'B' : score >= 16 ? 'C' : 'D';

                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-2 border-r border-slate-200 text-center font-semibold">{s.rollNo}</td>
                        <td className="p-2 border-r border-slate-200 font-mono text-slate-600">{s.grNo}</td>
                        <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{s.fullName}</td>
                        <td className="p-2 border-r border-slate-200 text-center font-mono">{p1}</td>
                        <td className="p-2 border-r border-slate-200 text-center font-mono">{p2}</td>
                        <td className="p-2 border-r border-slate-200 text-center font-mono">{p3}</td>
                        <td className="p-2 border-r border-slate-200 text-center font-mono">{p4}</td>
                        <td className="p-2 border-r border-slate-200 text-center font-bold font-mono bg-emerald-50/50">
                          <input
                            type="number"
                            min={0}
                            max={40}
                            value={score}
                            onChange={(e) => handleScoreAChange(s.id, parseInt(e.target.value) || 0)}
                            className="w-16 text-center border border-slate-300 rounded p-1 bg-white font-bold text-emerald-800"
                          />
                        </td>
                        <td className="p-2 text-center font-bold bg-emerald-50/50">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* PATRAK B */}
            {selectedPatrakType === 'B' && (
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300 w-12 text-center">રોલ નં.</th>
                    <th className="p-2 border-r border-slate-300">વિદ્યાર્થીનું નામ</th>
                    {bTraits.map(t => (
                      <th key={t} className="p-2 border-r border-slate-300 text-center">{t}</th>
                    ))}
                    <th className="p-2 text-center bg-emerald-50">સમગ્રલક્ષી ગ્રેડ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentStudents.map((s) => {
                    const studentGrades = localGradesB[s.id] || s.patrakBGrades || {};
                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-2 border-r border-slate-200 text-center font-semibold">{s.rollNo}</td>
                        <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{s.fullName}</td>
                        {bTraits.map(t => {
                          const val = studentGrades[t] || 'A';
                          return (
                            <td key={t} className="p-1.5 border-r border-slate-200 text-center">
                              <select
                                value={val}
                                onChange={(e) => handleGradeBChange(s.id, t, e.target.value)}
                                className="border border-slate-200 rounded px-1 py-0.5 text-xs font-bold text-slate-700 bg-white"
                              >
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                              </select>
                            </td>
                          );
                        })}
                        <td className="p-2 text-center font-bold bg-emerald-50 text-emerald-800">
                          A
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* PATRAK C */}
            {selectedPatrakType === 'C' && (
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300 w-12 text-center">રોલ નં.</th>
                    <th className="p-2 border-r border-slate-300 w-20">જી.આર. નં.</th>
                    <th className="p-2 border-r border-slate-300">વિદ્યાર્થીનું નામ</th>
                    <th className="p-2 border-r border-slate-300 text-center">રચનાત્મક (૪૦)</th>
                    <th className="p-2 border-r border-slate-300 text-center">સત્રાંત (૮૦)</th>
                    <th className="p-2 border-r border-slate-300 text-center bg-emerald-50">કુલ ગુણ (૧૨૦)</th>
                    <th className="p-2 border-r border-slate-300 text-center">ટકા (%)</th>
                    <th className="p-2 text-center bg-emerald-50">પરિણામ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentStudents.map((s) => {
                    const scoreA = s.patrakAMarks?.[selectedSubject] ?? 36;
                    const scoreC = localScoresC[s.id] ?? s.patrakCMarks?.[selectedSubject] ?? 72;
                    const total = scoreA + scoreC;
                    const percentage = Number(((total / 120) * 100).toFixed(1));

                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-2 border-r border-slate-200 text-center font-semibold">{s.rollNo}</td>
                        <td className="p-2 border-r border-slate-200 font-mono text-slate-600">{s.grNo}</td>
                        <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{s.fullName}</td>
                        <td className="p-2 border-r border-slate-200 text-center font-mono">{scoreA}</td>
                        <td className="p-2 border-r border-slate-200 text-center">
                          <input
                            type="number"
                            min={0}
                            max={80}
                            value={scoreC}
                            onChange={(e) => handleScoreCChange(s.id, parseInt(e.target.value) || 0)}
                            className="w-16 text-center border border-slate-300 rounded p-1 bg-white font-mono font-bold"
                          />
                        </td>
                        <td className="p-2 border-r border-slate-200 text-center font-bold font-mono bg-emerald-50/50">
                          {total}
                        </td>
                        <td className="p-2 border-r border-slate-200 text-center font-bold text-slate-800">
                          {percentage}%
                        </td>
                        <td className="p-2 text-center font-bold text-emerald-700 bg-emerald-50/50">
                          ઉત્તીર્ણ (Pass)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

          </div>
        )}

        {/* Official Signatures Footer */}
        <div className="mt-12 pt-8 grid grid-cols-3 text-center text-xs font-bold text-slate-800">
          <div>
            <p className="border-t border-slate-400 pt-1 inline-block px-4">તૈયાર કરનાર વર્ગ શિક્ષક</p>
          </div>
          <div>
            <p className="border-t border-slate-400 pt-1 inline-block px-4">ચકાસણી કરનાર શિક્ષક</p>
          </div>
          <div>
            <p className="border-t border-slate-400 pt-1 inline-block px-4">આચાર્ય / મુખ્ય શિક્ષક (સિક્કો)</p>
          </div>
        </div>

      </div>

    </div>
  );
};
