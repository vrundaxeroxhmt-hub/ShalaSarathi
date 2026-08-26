import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Layers, 
  Check, 
  Crown, 
  Printer, 
  Camera, 
  Plus, 
  Sparkles, 
  Eye, 
  Edit3, 
  Save, 
  Copy,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { PatrakTemplate, PatrakVersionCode, PatrakDocument } from '@/types/patrak';
import { TeacherProfile } from '@/types/user';
import { PatrakPhotoBlock } from './PatrakPhotoBlock';
import { canAccessVersion } from '@/lib/access-control/subscriptionManager';

interface Props {
  template: PatrakTemplate;
  teacher: TeacherProfile;
  onBack: () => void;
  onSaveDocument: (doc: Omit<PatrakDocument, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isMobile: boolean;
}

export const PatrakEditor: React.FC<Props> = ({ template, teacher, onBack, onSaveDocument, isMobile }) => {
  const [selectedVersion, setSelectedVersion] = useState<PatrakVersionCode>('Version A');
  const [photos, setPhotos] = useState<string[]>([]);
  const [mobileStep, setMobileStep] = useState<1 | 2 | 3 | 4>(1); // Mobile 4-step wizard
  const [formData, setFormData] = useState<Record<string, any>>({
    std: '5',
    div: 'A',
    subject: 'ગુજરાતી',
    totalStudents: 34,
    remarks: 'બાળકોનું વાચન અને ગણન કૌશલ્ય સારું છે. દૈનિક મહાવરો ચાલે છે.'
  });
  const [isSaved, setIsSaved] = useState(false);

  const currentVersionConfig = template.versions.find(v => v.versionCode === selectedVersion) || template.versions[0];

  const handleSave = async (status: 'draft' | 'completed' = 'completed') => {
    await onSaveDocument({
      templateId: template.id,
      patrakNumber: template.patrakNumber,
      selectedVersion,
      teacherId: teacher.id,
      titleGuj: template.titleGuj,
      formData,
      photoUrls: photos,
      status
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Mobile 4-Step Wizard Render
  if (isMobile) {
    return (
      <div className="p-4 pb-28 space-y-4 font-sans max-w-xl mx-auto">
        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <ArrowLeft className="w-4 h-4" />
            <span>પાછા (Catalog)</span>
          </button>
          <span className="text-xs font-black bg-brand-600 text-white px-2.5 py-0.5 rounded-lg">
            પત્રક {template.patrakNumber}
          </span>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-amber-300">પગલું {mobileStep} ઓફ ૪:</span>
            <span>
              {mobileStep === 1 && '૧. વિગતો અને વર્ઝન'}
              {mobileStep === 2 && '૨. પ્રવૃત્તિ ફોટોગ્રાફ્સ'}
              {mobileStep === 3 && '૩. લાઇન પ્રિવ્યૂ'}
              {mobileStep === 4 && '૪. સેવ અને પ્રિન્ટ'}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map(st => (
              <div
                key={st}
                className={`h-1.5 rounded-full transition-all ${
                  mobileStep >= st ? 'bg-brand-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Details & Version Selector */}
        {mobileStep === 1 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">{template.titleGuj}</h3>

            {/* Version Switcher */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">ફોર્મેટ વર્ઝન પસંદ કરો</label>
              <div className="grid grid-cols-3 gap-2">
                {template.versions.map(v => (
                  <button
                    key={v.versionCode}
                    type="button"
                    onClick={() => setSelectedVersion(v.versionCode)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedVersion === v.versionCode
                        ? 'bg-brand-600 text-white border-brand-600 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{v.versionCode}</div>
                    <div className="text-[9px] truncate opacity-90">{v.titleGuj}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ધોરણ (Class)</label>
                <input
                  type="number"
                  value={formData.std || ''}
                  onChange={e => setFormData({ ...formData, std: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">વિષય (Subject)</label>
                <input
                  type="text"
                  value={formData.subject || ''}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">વિશેષ નોંધ (Remarks)</label>
                <textarea
                  rows={2}
                  value={formData.remarks || ''}
                  onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Photo Attachment */}
        {mobileStep === 2 && (
          <PatrakPhotoBlock photos={photos} onChangePhotos={setPhotos} />
        )}

        {/* Step 3: Live Preview */}
        {mobileStep === 3 && (
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-md space-y-4 text-xs font-sans print-container">
            <div className="text-center border-b border-slate-900 pb-2">
              <div className="font-bold text-slate-600">{teacher.school.schoolNameGuj}</div>
              <h3 className="font-black text-slate-900 text-base">{template.titleGuj}</h3>
              <div className="text-[10px] text-slate-500 font-semibold">{selectedVersion}</div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg text-[10px] space-y-1">
              <div><strong>શિક્ષક:</strong> {teacher.nameGuj}</div>
              <div><strong>UDISE:</strong> {teacher.school.udiseCode}</div>
              <div><strong>તાલુકો:</strong> {teacher.school.taluka} | <strong>જિલ્લો:</strong> {teacher.school.district}</div>
            </div>

            <div><strong>ધોરણ:</strong> {formData.std} | <strong>વિષય:</strong> {formData.subject}</div>
            <div><strong>નોંધ:</strong> {formData.remarks}</div>
          </div>
        )}

        {/* Step 4: Save & Print */}
        {mobileStep === 4 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">પત્રક તૈયાર છે!</h3>
              <p className="text-xs text-slate-500">સાચવો અથવા સત્તાવાર PDF માં પ્રિન્ટ કરો.</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleSave('completed')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl text-xs shadow"
              >
                સંપૂર્ણ સાચવો (Save Completed Document)
              </button>
              <button
                onClick={handlePrint}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs shadow flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>પ્રિન્ટ / PDF ડાઉનલોડ</span>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Controls */}
        <div className="flex justify-between gap-3 pt-2">
          {mobileStep > 1 && (
            <button
              type="button"
              onClick={() => setMobileStep((mobileStep - 1) as any)}
              className="px-4 py-2.5 bg-slate-100 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>પાછળ</span>
            </button>
          )}

          {mobileStep < 4 && (
            <button
              type="button"
              onClick={() => setMobileStep((mobileStep + 1) as any)}
              className="ml-auto px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow"
            >
              <span>આગળ વધો</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // WEB DESKTOP SPLIT-PANE WORKSPACE (Left = Form Editor, Right = Printable Live Document Preview)
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans space-y-6">
      {/* Top Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          <span>બધા ૭૩ પત્રકો (Catalog Browser)</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave('draft')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl border border-slate-300"
          >
            ડ્રાફ્ટ સાચવો (Save Draft)
          </button>
          <button
            onClick={() => handleSave('completed')}
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>સેવ કરો (Save)</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>પ્રિન્ટ / PDF</span>
          </button>
        </div>
      </div>

      {/* Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Columns: Field Form Editor */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-black bg-brand-600 text-white px-2.5 py-0.5 rounded">
              પત્રક {template.patrakNumber}
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-2">{template.titleGuj}</h2>
            <p className="text-xs text-slate-500 mt-1">{template.descriptionGuj}</p>
          </div>

          {/* Version Selector Tabs */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">ફોર્મેટ વર્ઝન પસંદગી (Versions)</label>
            <div className="grid grid-cols-3 gap-2">
              {template.versions.map(v => (
                <button
                  key={v.versionCode}
                  type="button"
                  onClick={() => setSelectedVersion(v.versionCode)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedVersion === v.versionCode
                      ? 'bg-brand-600 text-white border-brand-600 font-bold shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-extrabold">{v.versionCode}</div>
                  <div className="text-[9px] opacity-90 truncate mt-0.5">{v.titleGuj}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Auto-filled Metadata Notice */}
          <div className="bg-brand-50 border border-brand-200 p-3 rounded-xl text-xs space-y-1 text-brand-900">
            <div className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>પ્રોફાઇલમાંથી ઓટો-ફિલ થયેલ ડેટા:</span>
            </div>
            <div className="text-[11px] text-brand-800">
              {teacher.nameGuj} • {teacher.school.schoolNameGuj} (UDISE: {teacher.school.udiseCode})
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ધોરણ (Standard)</label>
              <input
                type="number"
                value={formData.std || ''}
                onChange={e => setFormData({ ...formData, std: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">વર્ગ (Division)</label>
              <input
                type="text"
                value={formData.div || ''}
                onChange={e => setFormData({ ...formData, div: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
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

            <div>
              <label className="block font-bold text-slate-700 mb-1">વિશેષ નોંધ અને મૂલ્યાંકન સારાંશ</label>
              <textarea
                rows={3}
                value={formData.remarks || ''}
                onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Photo Component */}
          <PatrakPhotoBlock photos={photos} onChangePhotos={setPhotos} />
        </div>

        {/* Right 7 Columns: Printable Live Document Preview */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-2xl space-y-6 print-container font-sans">
            {/* Header Style based on selected version */}
            {currentVersionConfig.headerStyle === 'government_seal' && (
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <div className="text-xs font-bold text-slate-600">ગુજરાત સરકાર - પ્રાથમિક શિક્ષણ નિયામક કચેરી</div>
                <h1 className="text-xl font-black text-slate-900">{template.titleGuj}</h1>
                <div className="text-xs font-semibold text-slate-700">{currentVersionConfig.titleGuj}</div>
              </div>
            )}

            {currentVersionConfig.headerStyle === 'standard' && (
              <div className="bg-brand-900 text-white p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold">{template.titleGuj}</h1>
                  <div className="text-xs text-brand-200">ગુણોત્સવ ૨.૦ મૂલ્યાંકન પત્રક</div>
                </div>
                <span className="text-xs font-bold bg-brand-500 text-white px-3 py-1 rounded-full">
                  {selectedVersion}
                </span>
              </div>
            )}

            {currentVersionConfig.headerStyle === 'compact_badge' && (
              <div className="border border-amber-300 bg-amber-50 p-4 rounded-xl flex items-center justify-between">
                <h1 className="text-base font-bold text-slate-900">{template.titleGuj} (આચાર્ય સમરી)</h1>
                <span className="text-xs font-bold bg-amber-200 text-amber-900 px-3 py-1 rounded-full">
                  1-Page Compact
                </span>
              </div>
            )}

            {/* Auto-filled Teacher Metadata Grid */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium">શાળાનું નામ:</span>
                <div className="font-bold text-slate-900">{teacher.school.schoolNameGuj}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">યુ-ડાયસ કોડ:</span>
                <div className="font-bold font-mono text-slate-900">{teacher.school.udiseCode}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">શિક્ષકનું નામ:</span>
                <div className="font-bold text-slate-900">{teacher.nameGuj}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">તાલુકો / જિલ્લો:</span>
                <div className="font-bold text-slate-900">{teacher.school.taluka}, {teacher.school.district}</div>
              </div>
            </div>

            {/* Document Field Values */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-2 font-semibold">
                <span>ધોરણ: {formData.std}</span>
                <span>વર્ગ: {formData.div}</span>
                <span>વિષય: {formData.subject}</span>
              </div>

              <div>
                <span className="font-bold text-slate-700">શિક્ષકની નોંધ:</span>
                <p className="mt-1 text-slate-900 font-medium bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {formData.remarks}
                </p>
              </div>
            </div>

            {/* Photos */}
            {photos.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700">જોડાયેલ પ્રવૃત્તિ ફોટોગ્રાફ્સ:</span>
                <div className="grid grid-cols-2 gap-3">
                  {photos.map((p, idx) => (
                    <div key={idx} className="border border-slate-300 rounded-lg overflow-hidden h-36">
                      <img src={p} alt="Attachment" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Printable Signatures */}
            <div className="border-t-2 border-slate-900 pt-8 mt-12 flex justify-between text-xs font-bold text-slate-900">
              <div className="text-center space-y-6">
                <div>વર્ગ શિક્ષકની સહી</div>
                <div className="border-b border-slate-400 w-36"></div>
              </div>
              <div className="text-center space-y-6">
                <div>મુખ્ય શિક્ષક / આચાર્ય સહી અને સિક્કો</div>
                <div className="border-b border-slate-400 w-44"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
