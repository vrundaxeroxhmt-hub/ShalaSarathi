import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Printer, 
  Award, 
  CheckCircle2, 
  Users, 
  Calendar, 
  School,
  Sparkles,
  Edit3
} from 'lucide-react';

export const LettersCertificatesView: React.FC = () => {
  const { schoolProfile, teacherProfile, students } = useApp();

  const [selectedTemplate, setSelectedTemplate] = useState<'bonafide' | 'smc' | 'leave' | 'letterhead' | 'character'>('bonafide');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [purpose, setPurpose] = useState('બેંક ખાતું ખોલાવવા તેમજ સરકારી શિષ્યવૃત્તિ અર્થે');
  const [customBody, setCustomBody] = useState('');
  const [smcDate, setSmcDate] = useState(new Date().toISOString().split('T')[0]);
  const [smcAgenda, setSmcAgenda] = useState('૧. શાળા ગ્રાન્ટ આયોજન, ૨. શાળા સ્વચ્છતા અભિયાન, ૩. વાર્ષિક ઉત્સવ ઉજવણી');

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const templates = [
    { id: 'bonafide', label: '🎓 બોનાફાઈડ પ્રમાણપત્ર (Bonafide)', icon: Award },
    { id: 'smc', label: '📋 SMC મીટિંગ નોટિસ (SMC Notice)', icon: Users },
    { id: 'leave', label: '📝 શિક્ષક રજા અરજી (Leave App)', icon: FileText },
    { id: 'character', label: '🌟 વર્તણૂક પ્રમાણપત્ર (Character)', icon: Award },
    { id: 'letterhead', label: '🏫 શાળા લેટરપેડ (Letterhead)', icon: School },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-cyan-100 text-cyan-800">
              <FileText className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              લેટર્સ અને પ્રમાણપત્રો (Letters & Certificates)
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            બોનાફાઈડ પ્રમાણપત્ર, SMC નોટિસ, રજા અરજી અને શાળા લેટરપેડ આપમેળે તૈયાર કરો અને A4 પ્રિન્ટ મેળવો.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>A4 પ્રિન્ટ / PDF ડાઉનલોડ</span>
        </button>
      </div>

      {/* Template Selector Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4 no-print">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {templates.map(t => {
            const Icon = t.icon;
            const isSelected = selectedTemplate === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTemplate(t.id as any)}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-cyan-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Controls based on selected template */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          
          {selectedTemplate === 'bonafide' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">વિદ્યાર્થી પસંદ કરો (Auto-fill)</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} (ધો. {s.standard} - જી.આર. {s.grNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">પ્રમાણપત્ર આપ્યા તારીખ</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ઉપયોગ હેતુ (Purpose)</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>
            </>
          )}

          {selectedTemplate === 'smc' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">મીટિંગ તારીખ</label>
                <input
                  type="date"
                  value={smcDate}
                  onChange={(e) => setSmcDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">મીટિંગ એજન્ડા / ચર્ચાના મુદ્દા</label>
                <input
                  type="text"
                  value={smcAgenda}
                  onChange={(e) => setSmcAgenda(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>
            </>
          )}

          {(selectedTemplate === 'leave' || selectedTemplate === 'letterhead' || selectedTemplate === 'character') && (
            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">લખાણ સંપાદિત કરો (Editable Content)</label>
              <input
                type="text"
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                placeholder="લખાણમાં ફેરફાર કરવા માટે અહીં લખો..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
              />
            </div>
          )}

        </div>
      </div>

      {/* Printable Official Document */}
      <div className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-sm max-w-3xl mx-auto min-h-[600px] flex flex-col justify-between">
        
        {/* Document Header */}
        <div>
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{schoolProfile.schoolName}</h2>
            <p className="text-xs text-slate-700 mt-1">
              તા. {schoolProfile.taluka}, જિ. {schoolProfile.district} • પિન કોડ: {schoolProfile.pinCode}
            </p>
            <div className="flex justify-between items-center text-[11px] text-slate-600 mt-2 font-semibold">
              <span>UDISE કોડ: <strong className="font-mono">{schoolProfile.udiseCode}</strong></span>
              <span>શાળા ઇમેઇલ: {schoolProfile.email}</span>
              <span>ફોન: {schoolProfile.phone}</span>
            </div>
          </div>

          {/* BONAFIDE CERTIFICATE */}
          {selectedTemplate === 'bonafide' && selectedStudent && (
            <div className="mt-8 space-y-6">
              <div className="text-center">
                <span className="inline-block border-2 border-slate-800 px-6 py-1 rounded-full text-base font-extrabold text-slate-900 tracking-wide bg-slate-50">
                  બોનાફાઈડ પ્રમાણપત્ર (BONAFIDE CERTIFICATE)
                </span>
              </div>

              <div className="flex justify-between text-xs text-slate-700 pt-2 font-semibold">
                <span>જાવક નંબર: SS/BON/{new Date().getFullYear()}/{selectedStudent.grNo}</span>
                <span>તારીખ: {issueDate}</span>
              </div>

              <div className="text-sm leading-loose text-slate-900 text-justify pt-4 space-y-4">
                <p>
                  આથી પ્રમાણપત્ર આપવામાં આવે છે કે કુમાર/કન્યા શ્રી <strong className="font-extrabold underline decoration-slate-400 underline-offset-4">{selectedStudent.fullName}</strong>, 
                  પિતાશ્રી <strong className="underline decoration-slate-400 underline-offset-4">{selectedStudent.parentName || 'શ્રી'}</strong>, 
                  અમારી શાળામાં ધોરણ <strong className="underline decoration-slate-400 underline-offset-4">{selectedStudent.standard} (વર્ગ {selectedStudent.division})</strong> માં 
                  શૈક્ષણિક વર્ષ <strong>{schoolProfile.academicYear}</strong> દરમિયાન નિયમિત અભ્યાસ કરે છે.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-3 grid grid-cols-2 gap-2 text-xs">
                  <div>જનરલ રજિસ્ટર (G.R.) નંબર: <strong className="font-mono font-bold text-sm">{selectedStudent.grNo}</strong></div>
                  <div>રોલ નંબર: <strong className="font-mono font-bold">{selectedStudent.rollNo}</strong></div>
                  <div>જન્મ તારીખ: <strong className="font-mono">{selectedStudent.dob}</strong></div>
                  <div>કેટેગરી / જાતિ: <strong>{selectedStudent.category} ({selectedStudent.gender})</strong></div>
                </div>

                <p>
                  શાળાના જનરલ રજિસ્ટર રેકોર્ડ મુજબ વિદ્યાર્થીનું વર્તન અને શિસ્ત <strong>ઉત્તમ અને સંતોષકારક</strong> છે. 
                  આ પ્રમાણપત્ર વિદ્યાર્થીના વાલીની વિનંતીથી <strong>{purpose}</strong> અર્થે આપવામાં આવેલ છે.
                </p>
              </div>
            </div>
          )}

          {/* SMC NOTICE */}
          {selectedTemplate === 'smc' && (
            <div className="mt-8 space-y-6">
              <div className="text-center">
                <span className="inline-block border-2 border-slate-800 px-6 py-1 rounded-full text-base font-extrabold text-slate-900 tracking-wide bg-slate-50">
                  શાળા વ્યવસ્થાપન સમિતિ (SMC) મીટિંગ નોટિસ
                </span>
              </div>

              <div className="flex justify-between text-xs text-slate-700 pt-2 font-semibold">
                <span>જાવક નં.: SMC/{new Date().getFullYear()}/04</span>
                <span>તારીખ: {issueDate}</span>
              </div>

              <div className="text-sm leading-relaxed text-slate-900 space-y-4 pt-4">
                <p className="font-bold">પ્રતિ, સમિતિના તમામ સભ્યશ્રીઓ (SMC Members),</p>
                <p>
                  સવિનય જણાવવાનું કે આપણી શાળાના વિકાસ તેમજ શૈક્ષણિક પ્રવૃત્તિઓના આયોજન અર્થે શાળા વ્યવસ્થાપન સમિતિ (SMC) ની માસિક સાધારણ સભા તારીખ <strong>{smcDate}</strong> ના રોજ <strong>બપોરે ૧૨:૩૦ કલાકે</strong> શાળાના સભાખંડમાં યોજવામાં આવેલ છે.
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-900 mb-2">સભાના ચર્ચાના મુદ્દાઓ (Agenda):</p>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">{smcAgenda}</p>
                </div>

                <p className="text-xs text-slate-700">
                  સર્વે સભ્યશ્રીઓને સમયસર ઉપસ્થિત રહી શાળા ઉત્કર્ષના કાર્યોમાં સહભાગી થવા વિનંતી છે.
                </p>
              </div>
            </div>
          )}

          {/* LEAVE APPLICATION */}
          {selectedTemplate === 'leave' && (
            <div className="mt-8 space-y-6">
              <div className="text-center">
                <span className="inline-block border-2 border-slate-800 px-6 py-1 rounded-full text-base font-extrabold text-slate-900 tracking-wide bg-slate-50">
                  શિક્ષક રજા અરજી (CASUAL LEAVE APPLICATION)
                </span>
              </div>

              <div className="flex justify-between text-xs text-slate-700 pt-2 font-semibold">
                <span>અરજી તારીખ: {issueDate}</span>
                <span>સ્થળ: {schoolProfile.taluka}</span>
              </div>

              <div className="text-sm leading-relaxed text-slate-900 space-y-4 pt-4">
                <p className="font-bold">
                  પ્રતિ શ્રીમાન,<br />
                  મુખ્ય શિક્ષક / આચાર્યશ્રી,<br />
                  {schoolProfile.schoolName}
                </p>

                <p className="font-bold">વિષય: કેઝ્યુઅલ રજા (C.L.) મંજૂર કરવા બાબત.</p>

                <p className="leading-loose">
                  સાદર પ્રણામ સાથે જણાવવાનું કે મારે અંગત અને અનિવાર્ય પારિવારિક કામકાજ હોવાના કારણે આગામી તારીખ <strong>{issueDate}</strong> ના રોજ શાળામાં ઉપસ્થિત રહી શકું તેમ નથી. માટે મારી <strong>૧ (એક) દિવસની C.L. રજા</strong> મંજૂર કરવા વિનંતી છે.
                </p>

                {customBody && (
                  <p className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">{customBody}</p>
                )}

                <p className="text-xs text-slate-600">
                  મારી ગેરહાજરી દરમિયાન મારા વર્ગનું શૈક્ષણિક કાર્ય અન્ય શિક્ષકશ્રીને સોંપેલ છે.
                </p>
              </div>
            </div>
          )}

          {/* CHARACTER CERTIFICATE */}
          {selectedTemplate === 'character' && selectedStudent && (
            <div className="mt-8 space-y-6">
              <div className="text-center">
                <span className="inline-block border-2 border-slate-800 px-6 py-1 rounded-full text-base font-extrabold text-slate-900 tracking-wide bg-slate-50">
                  વર્તણૂક અને ચારિત્ર્ય પ્રમાણપત્ર (CHARACTER CERTIFICATE)
                </span>
              </div>

              <div className="flex justify-between text-xs text-slate-700 pt-2 font-semibold">
                <span>જાવક નં.: SS/CHAR/{selectedStudent.grNo}</span>
                <span>તારીખ: {issueDate}</span>
              </div>

              <div className="text-sm leading-loose text-slate-900 text-justify pt-4 space-y-4">
                <p>
                  આથી પ્રમાણિત કરવામાં આવે છે કે વિદ્યાર્થી શ્રી <strong className="underline decoration-slate-400">{selectedStudent.fullName}</strong> 
                  અમારી શાળામાં ધોરણ <strong>{selectedStudent.standard}</strong> માં અભ્યાસ કરે છે. શાળામાં તેમના અભ્યાસકાળ દરમિયાન તેમનું સામાન્ય વર્તન, શિસ્ત, નૈતિક ચારિત્ર્ય અને શિક્ષકો પ્રત્યેનો આદરભાવ <strong>ઉત્તમ અને પ્રશંસનીય</strong> રહ્યો છે.
                </p>
                <p>
                  તેઓ શાળાના રમતગમત તેમજ સાંસ્કૃતિક કાર્યક્રમોમાં ઉત્સાહપૂર્વક ભાગ લે છે. અમે તેમના ઉજ્જવળ ભવિષ્યની શુભકામનાઓ પાઠવીએ છીએ.
                </p>
              </div>
            </div>
          )}

          {/* SCHOOL LETTERHEAD */}
          {selectedTemplate === 'letterhead' && (
            <div className="mt-8 space-y-6">
              <div className="flex justify-between text-xs text-slate-700 pt-2 font-semibold border-b border-slate-200 pb-2">
                <span>જાવક નંબર: ....................</span>
                <span>તારીખ: {issueDate}</span>
              </div>

              <div className="text-sm text-slate-900 space-y-4 pt-6 min-h-[220px]">
                <p className="text-xs text-slate-400 italic">
                  [અધિકૃત શાળા લેટરપેડ — અહીં સત્તાવાર પત્રવ્યવહાર / પ્રમાણપત્ર / સૂચના પ્રિન્ટ કરી શકાય છે]
                </p>
                {customBody ? (
                  <p className="leading-relaxed">{customBody}</p>
                ) : (
                  <p className="leading-loose">
                    આથી સર્વે સંબંધિતોને જણાવવામાં આવે છે કે......................................................................................................................................................................................................................................................................................................................................................................................................................................................
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Document Footer Signatures */}
        <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-2 text-center text-xs font-bold text-slate-900">
          <div>
            <p className="text-slate-600 font-normal">સ્થળ: {schoolProfile.taluka}</p>
            <p className="text-slate-600 font-normal">તારીખ: {issueDate}</p>
          </div>
          <div>
            <div className="inline-block text-center">
              <p className="font-bold text-sm">આચાર્ય / મુખ્ય શિક્ષક</p>
              <p className="text-[11px] text-slate-600">{schoolProfile.schoolName}</p>
              <p className="text-[10px] text-slate-400 mt-1">(સહી અને ગોળ સિક્કો)</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
