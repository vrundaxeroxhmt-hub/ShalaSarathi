import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  FileText, 
  Sparkles, 
  Mic, 
  MicOff, 
  Printer, 
  Download, 
  HelpCircle,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { PatrakTemplate, PatrakDocument, PatrakVersionCode } from '@/types/patrak';
import { TeacherProfile, Designation, DistrictGujarat } from '@/types/user';
import { useGujaratiVoice } from '@/hooks/useGujaratiVoice';
import { OFFICIAL_PATRAK_TEMPLATES, getApplicableTemplateVersion } from '@/lib/services/rojmelService';

interface Props {
  templates: PatrakTemplate[];
  teacher: TeacherProfile;
  initialTemplate?: PatrakTemplate | null;
  onBackToCatalog: () => void;
  onSaveDocument: (doc: Omit<PatrakDocument, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isMobile?: boolean;
}

export const PatrakAutoFillWizard: React.FC<Props> = ({
  templates,
  teacher,
  initialTemplate = null,
  onBackToCatalog,
  onSaveDocument,
  isMobile = false
}) => {
  // WORKFLOW STATE
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(initialTemplate ? 3 : 1);
  const [profileData, setProfileData] = useState<TeacherProfile>(teacher);
  const [selectedTemplate, setSelectedTemplate] = useState<PatrakTemplate>(initialTemplate || templates[0]);
  const [selectedVersion, setSelectedVersion] = useState<PatrakVersionCode>('Version A');
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Form fields state (preserved across steps)
  const [formData, setFormData] = useState<Record<string, any>>({
    std: '5',
    div: 'A',
    subject: 'ગુજરાતી',
    totalStudents: 34,
    remarks: 'બાળકોનું વાચન અને ગણન કૌશલ્ય સારું છે. દૈનિક મહાવરો ચાલે છે.'
  });

  // Voice State
  const [activeVoiceField, setActiveVoiceField] = useState<string | null>(null);

  // Auto-fill profile fields into formData whenever profileData or selectedTemplate changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      teacherName: profileData.nameGuj,
      schoolName: profileData.school.schoolNameGuj,
      udiseCode: profileData.school.udiseCode,
      village: profileData.school.village,
      taluka: profileData.school.taluka,
      district: profileData.school.district,
      designation: profileData.designation,
      academicYear: profileData.academicYear
    }));
  }, [profileData, selectedTemplate]);

  // Speech Recognition hook
  const { isListening, startListening, stopListening } = useGujaratiVoice((recognizedText) => {
    if (activeVoiceField) {
      setFormData(prev => ({
        ...prev,
        [activeVoiceField]: prev[activeVoiceField] ? prev[activeVoiceField] + ' ' + recognizedText : recognizedText
      }));
    }
  });

  const handleVoiceToggle = (fieldKey: string) => {
    if (isListening && activeVoiceField === fieldKey) {
      stopListening();
      setActiveVoiceField(null);
    } else {
      setActiveVoiceField(fieldKey);
      startListening();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDoc = async () => {
    await onSaveDocument({
      templateId: selectedTemplate.id,
      patrakNumber: selectedTemplate.patrakNumber,
      selectedVersion,
      teacherId: profileData.id,
      titleGuj: selectedTemplate.titleGuj,
      formData,
      photoUrls: [],
      status: 'completed'
    });
    alert('પત્રક સફળતાપૂર્વક સાચવવામાં આવ્યું!');
  };

  const stepTitles = [
    '૧. પ્રોફાઇલ ડેટા',
    '૨. પત્રક ટેમ્પ્લેટ',
    '૩. ઓટો-ફિલ ફોર્મ',
    '૪. વોઇસ/મેન્યુઅલ એડિટ',
    '૫. સત્તાવાર PDF / પ્રિન્ટ'
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto font-sans space-y-6">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between no-print">
        <button
          onClick={onBackToCatalog}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>બધા પત્રકો (Catalog Browser)</span>
        </button>

        <span className="text-xs font-extrabold bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-200">
          ૫-સ્ટેપ ઓટો-ફિલ વર્કફ્લો
        </span>
      </div>

      {/* 5-STEP INTERACTIVE PROGRESS INDICATOR (All Steps Clickable) */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800 space-y-4 no-print">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-amber-400">સ્ટેપ {currentStep} ઓફ ૫: {stepTitles[currentStep - 1]}</span>
          <span className="text-slate-400">પસંદ કરેલ: પત્રક {selectedTemplate.patrakNumber}</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {([1, 2, 3, 4, 5] as const).map(stepNum => (
            <button
              key={stepNum}
              onClick={() => setCurrentStep(stepNum)}
              className={`py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                currentStep === stepNum
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-lg scale-105'
                  : currentStep > stepNum
                  ? 'bg-emerald-800 text-emerald-100 border-emerald-700'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <span>{stepNum}</span>
              <span className="hidden md:inline">{stepTitles[stepNum - 1].split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: PROFILE DATA */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 font-sans no-print">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">પગલું ૧: શિક્ષક અને શાળા પ્રોફાઇલ ડેટા (Profile Data)</h3>
              <p className="text-xs text-slate-500">આ ડેટા તમામ પત્રકોમાં ઓટોમેટિક ઓટો-ફિલ થશે.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">શિક્ષકનું નામ (Teacher Name)</label>
              <input
                type="text"
                value={profileData.nameGuj}
                onChange={e => setProfileData({ ...profileData, nameGuj: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">શાળાનું નામ (School Name)</label>
              <input
                type="text"
                value={profileData.school.schoolNameGuj}
                onChange={e => setProfileData({ 
                  ...profileData, 
                  school: { ...profileData.school, schoolNameGuj: e.target.value } 
                })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">યુ-ડાયસ કોડ (UDISE Code)</label>
              <input
                type="text"
                value={profileData.school.udiseCode}
                onChange={e => setProfileData({ 
                  ...profileData, 
                  school: { ...profileData.school, udiseCode: e.target.value } 
                })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">હોદ્દો (Designation)</label>
              <input
                type="text"
                value={profileData.designation}
                onChange={e => setProfileData({ ...profileData, designation: e.target.value as Designation })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">તાલુકો / જિલ્લો</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={profileData.school.taluka}
                  onChange={e => setProfileData({ 
                    ...profileData, 
                    school: { ...profileData.school, taluka: e.target.value } 
                  })}
                  className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
                <input
                  type="text"
                  value={profileData.school.district}
                  onChange={e => setProfileData({ 
                    ...profileData, 
                    school: { ...profileData.school, district: e.target.value as DistrictGujarat } 
                  })}
                  className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">શૈક્ષણિક વર્ષ (Academic Year)</label>
              <input
                type="text"
                value={profileData.academicYear}
                onChange={e => setProfileData({ ...profileData, academicYear: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow flex items-center gap-1.5"
            >
              <span>આગળ → પત્રક Template</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PATRAK TEMPLATE SELECTION */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 font-sans no-print">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">પગલું ૨: પત્રક ટેમ્પ્લેટ પસંદ કરો (Patrak Template)</h3>
              <p className="text-xs text-slate-500">ઇચ્છિત પત્રક પર કલીક કરીને પસંદ કરો.</p>
            </div>
            <span className="text-xs font-black bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              ૭૩ ટેમ્પ્લેટો ઉપલબ્ધ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-1">
            {templates.slice(0, 15).map(tmpl => {
              const isSelected = selectedTemplate.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-brand-50 border-brand-600 shadow-md ring-2 ring-brand-500/20'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black bg-brand-600 text-white px-2 py-0.5 rounded">
                      પત્રક {tmpl.patrakNumber}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-brand-600 font-bold" />}
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs leading-snug">{tmpl.titleGuj}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2">{tmpl.descriptionGuj}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              ← પાછળ
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow flex items-center gap-1.5"
            >
              <span>આગળ → Auto-Fill Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AUTO-FILL FORM */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 font-sans no-print">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                પગલું ૩: ઓટો-ફિલ ફોર્મ ચકાસણી ({selectedTemplate.titleGuj})
              </h3>
              <p className="text-xs text-slate-500">પ્રોફાઇલમાંથી સ્વચાલિત પોપ્યુલેટ થયેલી ફોર્મ ફીલ્ડ્સ.</p>
            </div>
            <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              ✓ ઓટો-ફિલ્ડ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">શાળાનું નામ (Auto-Filled)</label>
              <input
                type="text"
                value={formData.schoolName || ''}
                onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">શિક્ષકનું નામ (Auto-Filled)</label>
              <input
                type="text"
                value={formData.teacherName || ''}
                onChange={e => setFormData({ ...formData, teacherName: e.target.value })}
                className="w-full p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">યુડીઆઇએસ કોડ (Auto-Filled)</label>
              <input
                type="text"
                value={formData.udiseCode || ''}
                onChange={e => setFormData({ ...formData, udiseCode: e.target.value })}
                className="w-full p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">તાલુકો અને જિલ્લો (Auto-Filled)</label>
              <input
                type="text"
                value={`${formData.taluka || ''}, ${formData.district || ''}`}
                onChange={e => setFormData({ ...formData, taluka: e.target.value })}
                className="w-full p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ધોરણ (Class)</label>
              <input
                type="number"
                value={formData.std || ''}
                onChange={e => setFormData({ ...formData, std: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">વિષય (Subject)</label>
              <input
                type="text"
                value={formData.subject || ''}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              ← પાછળ
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow flex items-center gap-1.5"
            >
              <span>આગળ → Voice / Manual Edit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: VOICE / MANUAL EDIT */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 font-sans no-print">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">પગલું ૪: ગુજરાતી વોઇસ અને મેન્યુઅલ એડિટ (Voice / Manual Edit)</h3>
              <p className="text-xs text-slate-500">ગુજરાતીમાં બોલીને અથવા ટાઇપ કરીને ફોર્મ ફીલ્ડ્સ સુધારો.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">વિશેષ નોંધ અને મૂલ્યાંકન સવિસ્તર વિગત</label>
                <button
                  type="button"
                  onClick={() => handleVoiceToggle('remarks')}
                  className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                    isListening && activeVoiceField === 'remarks'
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-brand-50 text-brand-700 border border-brand-200'
                  }`}
                >
                  {isListening && activeVoiceField === 'remarks' ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>🎤 ગુજરાતીમાં બોલો (Speech gu-IN)</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={formData.remarks || ''}
                onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              ← પાછળ
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow flex items-center gap-1.5"
            >
              <span>આગળ → Preview / PDF</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: OFFICIAL PDF / PRINT */}
      {currentStep === 5 && (
        <div className="space-y-4 font-sans">
          {/* Top Actions for Step 5 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between no-print">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              ← પાછળ (Edit)
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveDoc}
                className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow"
              >
                સંપૂર્ણ સેવ કરો
              </button>

              <button
                onClick={handlePrint}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2 rounded-xl shadow flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>સત્તાવાર A4 પ્રિન્ટ કરો</span>
              </button>
            </div>
          </div>

          {/* DEDICATED PRINT CONTAINER */}
          <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-2xl space-y-6 print-container font-sans text-slate-900">
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <div className="text-xs font-bold text-slate-600">ગુજરાત સરકાર - પ્રાથમિક શિક્ષણ વિભાગ સત્તાવાર પત્રક</div>
              <h1 className="text-2xl font-black">{selectedTemplate.titleGuj}</h1>
              <div className="text-xs font-semibold text-slate-700">
                શાળા: {formData.schoolName || profileData.school.schoolNameGuj} | UDISE: {formData.udiseCode || profileData.school.udiseCode}
              </div>
              <div className="text-xs font-extrabold text-brand-800 pt-1">
                શૈક્ષણિક વર્ષ: {formData.academicYear || profileData.academicYear} | તારીખ: {documentDate}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-900 rounded-xl p-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium">શિક્ષકનું નામ:</span>
                <div className="font-bold">{formData.teacherName || profileData.nameGuj}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">તાલુકો / જિલ્લો:</span>
                <div className="font-bold">{formData.taluka || profileData.school.taluka}, {formData.district || profileData.school.district}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">ધોરણ / વર્ગ:</span>
                <div className="font-bold">ધોરણ {formData.std || '૫'} - {formData.div || 'અ'}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">વિષય:</span>
                <div className="font-bold">{formData.subject || 'ગુજરાતી'}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900">મૂલ્યાંકન અને શિક્ષક નોંધ વિગત:</span>
              <div className="p-4 bg-slate-50 border border-slate-900 rounded-xl leading-relaxed font-medium">
                {formData.remarks}
              </div>
            </div>

            <div className="border-t-2 border-slate-900 pt-8 mt-12 flex justify-between text-xs font-bold">
              <div className="text-center space-y-6">
                <div>વર્ગ શિક્ષકની સહી</div>
                <div className="border-b border-slate-400 w-36"></div>
              </div>
              <div className="text-center space-y-6">
                <div>આચાર્ય સહી અને સિક્કો</div>
                <div className="border-b border-slate-400 w-44"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
