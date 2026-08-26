import React, { useState } from 'react';
import { X, FileText, Download, FileArchive, HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { RojmelEntry, GovernmentPatrakTemplate, RojmelAccountSetup } from '@/types/rojmel';
import { TeacherProfile } from '@/types/user';
import { 
  OFFICIAL_PATRAK_TEMPLATES, 
  getApplicableTemplateVersion, 
  getMissingFieldsForNewTemplate,
  generateBatchPatrakZip 
} from '@/lib/services/rojmelService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entries: RojmelEntry[];
  teacher: TeacherProfile;
  setup?: RojmelAccountSetup | null;
}

export const RojmelOfficialPatrakModal: React.FC<Props> = ({
  isOpen,
  onClose,
  entries,
  teacher,
  setup
}) => {
  const [selectedTemplateCode, setSelectedTemplateCode] = useState('PRI-01');
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedVersionChoice, setSelectedVersionChoice] = useState<'historical' | 'new'>('historical');
  const [showVersionPromptModal, setShowVersionPromptModal] = useState(false);
  const [missingFieldsList, setMissingFieldsList] = useState<Array<{ fieldKey: string; labelGuj: string }>>([]);
  const [filledMissingFields, setFilledMissingFields] = useState<Record<string, string>>({});
  const [isGeneratingBatchZip, setIsGeneratingBatchZip] = useState(false);

  if (!isOpen) return null;

  const activeTemplate = getApplicableTemplateVersion(selectedTemplateCode, documentDate);
  const latestTemplate = OFFICIAL_PATRAK_TEMPLATES.find(t => t.templateCode === selectedTemplateCode && t.status === 'active') || activeTemplate;

  const handleDateChange = (newDate: string) => {
    setDocumentDate(newDate);
    const applicable = getApplicableTemplateVersion(selectedTemplateCode, newDate);
    // If a newer version exists compared to historical version
    if (applicable.version < latestTemplate.version) {
      setShowVersionPromptModal(true);
    }
  };

  const handleChooseVersion = (choice: 'historical' | 'new') => {
    setSelectedVersionChoice(choice);
    setShowVersionPromptModal(false);

    if (choice === 'new') {
      const missing = getMissingFieldsForNewTemplate({}, latestTemplate);
      setMissingFieldsList(missing);
    } else {
      setMissingFieldsList([]);
    }
  };

  const handleDownloadSinglePDF = () => {
    const targetTemplate = selectedVersionChoice === 'new' ? latestTemplate : activeTemplate;
    
    // Validate missing fields if new template choice
    if (selectedVersionChoice === 'new' && missingFieldsList.length > 0) {
      for (const m of missingFieldsList) {
        if (!filledMissingFields[m.fieldKey]) {
          alert(`નવા Template માટે પૂર્તતા કરવી જરૂરી છે: ${m.labelGuj}`);
          return;
        }
      }
    }

    const content = `
      ======================================================
      ${targetTemplate.titleGuj} (Version ${targetTemplate.version})
      ======================================================
      શાળાનું નામ: ${setup?.schoolNameGuj || teacher.school.schoolNameGuj}
      દસ્તાવેજ તારીખ: ${documentDate}
      નાણાકીય વર્ષ: ${setup?.financialYear || teacher.academicYear}
      અસરકારક તારીખ: ${targetTemplate.effectiveFrom}
      ------------------------------------------------------
      કુલ સત્તાવાર વ્યવહારો: ${entries.length}
      ======================================================
    `;

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${targetTemplate.templateCode}_v${targetTemplate.version}_${documentDate}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadBatchZIP = async () => {
    try {
      setIsGeneratingBatchZip(true);
      const zipBlob = await generateBatchPatrakZip(OFFICIAL_PATRAK_TEMPLATES, entries, teacher, setup || undefined);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ShalaSarathi_Rojmel_${setup?.financialYear || '2026-27'}_Batch_PDFs.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('ZIP ફાઇલ બનાવવા માં ભૂલ આવી.');
    } finally {
      setIsGeneratingBatchZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">સત્તાવાર સરકારી પત્રક એન્જિન (PRI-01 to PRI-12)</h3>
              <p className="text-[10px] text-slate-400">તારીખ આધારિત વર્ઝનિંગ અને સ્વચાલિત દસ્તાવેજ જનરેશન</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Selector & Date Picker */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">પત્રક પસંદ કરો (Select Register)</label>
            <select
              value={selectedTemplateCode}
              onChange={e => setSelectedTemplateCode(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
            >
              {OFFICIAL_PATRAK_TEMPLATES.map(t => (
                <option key={t.templateId} value={t.templateCode}>
                  {t.titleGuj} (v{t.version})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">દસ્તાવેજ તારીખ (Document Date)</label>
            <input
              type="date"
              value={documentDate}
              onChange={e => handleDateChange(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
            />
          </div>
        </div>

        {/* Active Version Info Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">
              અસરકારક વર્ઝન: <span className="text-brand-600 font-mono">Version {activeTemplate.version}</span>
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              અસરકારક તારીખ: {activeTemplate.effectiveFrom}
            </span>
          </div>

          <p className="text-slate-600 leading-relaxed font-medium">
            તમે પસંદ કરેલ તારીખ ({documentDate}) મુજબ આ પત્રકનું સત્તાવાર Version {activeTemplate.version} આપોઆપ લાગુ થશે. જૂના રેકોર્ડ્સ ક્યારેય બદલાશે નહીં.
          </p>
        </div>

        {/* Missing Fields Inputs if New Version Selected */}
        {selectedVersionChoice === 'new' && missingFieldsList.length > 0 && (
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3 text-xs">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>નવા Template (Version {latestTemplate.version}) માટે નીચેની માહિતી જરૂરી છે:</span>
            </div>

            <div className="space-y-2">
              {missingFieldsList.map(m => (
                <div key={m.fieldKey} className="grid grid-cols-2 gap-2 items-center">
                  <label className="font-bold text-slate-700">{m.labelGuj}:</label>
                  <input
                    type="text"
                    required
                    placeholder={`દા.ત. ${m.labelGuj}`}
                    value={filledMissingFields[m.fieldKey] || ''}
                    onChange={e => setFilledMissingFields({ ...filledMissingFields, [m.fieldKey]: e.target.value })}
                    className="p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Download Actions (Single PDF vs Batch ZIP) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleDownloadSinglePDF}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3 rounded-2xl shadow flex items-center justify-center gap-2 text-xs"
          >
            <Download className="w-4 h-4" />
            <span>આ પત્રક ડાઉનલોડ કરો (Single PDF)</span>
          </button>

          <button
            onClick={handleDownloadBatchZIP}
            disabled={isGeneratingBatchZip}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-2xl shadow flex items-center justify-center gap-2 text-xs disabled:opacity-50"
          >
            <FileArchive className="w-4 h-4 text-amber-400" />
            <span>{isGeneratingBatchZip ? 'ZIP બની રહ્યું છે...' : 'બધા પત્રકો એકસાથે ડાઉનલોડ (Batch ZIP)'}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
          >
            બંધ કરો
          </button>
        </div>
      </div>

      {/* Historical vs New Template Confirmation Modal */}
      {showVersionPromptModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-center">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center font-bold">
              <HelpCircle className="w-6 h-6" />
            </div>

            <div className="space-y-2 text-xs">
              <h3 className="font-extrabold text-slate-900 text-base">Template વર્ઝન પસંદગી</h3>
              <p className="text-slate-600 font-semibold leading-relaxed">
                આ તારીખ ({documentDate}) માટે જૂનું Template (Version {activeTemplate.version}) ઉપલબ્ધ છે અને નવું Template (Version {latestTemplate.version}) પણ ઉપલબ્ધ છે. તમે કયું format બનાવવા માંગો છો?
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2 text-xs">
              <button
                onClick={() => handleChooseVersion('historical')}
                className="px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow"
              >
                [ જૂનું Template v{activeTemplate.version} ]
              </button>
              <button
                onClick={() => handleChooseVersion('new')}
                className="px-4 py-2.5 bg-brand-600 text-white font-bold rounded-xl shadow"
              >
                [ નવું Template v{latestTemplate.version} ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
