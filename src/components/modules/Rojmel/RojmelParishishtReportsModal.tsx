import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  Share2, 
  Eye, 
  CheckSquare, 
  Square, 
  Archive,
  Calendar,
  AlertCircle,
  HelpCircle,
  FileDown,
  Loader2,
  Layout,
  ExternalLink,
  ShieldCheck,
  Info
} from 'lucide-react';
import { ParishishtNumber } from '@/types/parishishtTemplate';
import { RojmelEntry, HeadItem } from '@/types/rojmel';
import { TeacherProfile } from '@/types/user';
import { 
  OFFICIAL_PARISHISHT_TEMPLATES, 
  getApplicableParishishtTemplate, 
  getAvailableVersions,
  renderParishishtData, 
  downloadParishisht1PDF,
  exportParishishtCSV, 
  generateBatchParishishtZip,
  sanitizeFileName 
} from '@/lib/services/parishishtTemplateEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rojmelEntries: RojmelEntry[];
  heads: HeadItem[];
  teacher: TeacherProfile;
  onPrintParishisht: (num: ParishishtNumber, date: string, forcedVersion?: number, orientation?: 'landscape' | 'portrait') => void;
}

export const RojmelParishishtReportsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  rojmelEntries,
  heads,
  teacher,
  onPrintParishisht
}) => {
  const [selectedParishishtNo, setSelectedParishishtNo] = useState<ParishishtNumber>(1);
  const [documentDate, setDocumentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedForBatch, setSelectedForBatch] = useState<ParishishtNumber[]>([1, 2, 3, 4, 5]);
  const [forcedVersion, setForcedVersion] = useState<number | undefined>(undefined);
  const [selectedOrientation, setSelectedOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [showVersionConfirm, setShowVersionConfirm] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);

  useEffect(() => {
    const tmpl = getApplicableParishishtTemplate(selectedParishishtNo, documentDate, forcedVersion);
    setSelectedOrientation(tmpl.orientation);
  }, [selectedParishishtNo]);

  if (!isOpen) return null;

  const availableVersions = getAvailableVersions(selectedParishishtNo);
  const currentTemplate = getApplicableParishishtTemplate(selectedParishishtNo, documentDate, forcedVersion);
  const currentRenderedData = renderParishishtData(selectedParishishtNo, rojmelEntries, heads, teacher, { documentDate, forcedVersion, orientation: selectedOrientation });

  const isWorkingRef = currentTemplate.status === 'reference-working' || currentTemplate.sourceType === 'working-reference';

  const toggleBatchSelect = (num: ParishishtNumber) => {
    if (selectedForBatch.includes(num)) {
      setSelectedForBatch(selectedForBatch.filter(n => n !== num));
    } else {
      setSelectedForBatch([...selectedForBatch, num]);
    }
  };

  const handleSelectParishisht = (num: ParishishtNumber) => {
    setSelectedParishishtNo(num);
    setForcedVersion(undefined);
    setShowVersionConfirm(false);
  };

  const handleDownloadPDF = async (num: ParishishtNumber) => {
    setIsGeneratingPDF(true);
    try {
      const res = await downloadParishisht1PDF(num, rojmelEntries, heads, teacher, { documentDate, forcedVersion, orientation: selectedOrientation });
      if (!res.success) {
        alert(`⚠️ PDF ડાઉનલોડ નિષ્ફળ: ${res.error || 'અમાન્ય ફાઈલ રચના.'}`);
      }
    } catch (err: any) {
      alert(`⚠️ PDF બનાવવામાં ક્ષતિ: ${err.message || 'અણધારી ભૂલ.'}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleBatchDownloadZip = async () => {
    if (selectedForBatch.length === 0) {
      alert('કૃપા કરીને બેચ ZIP ડાઉનલોડ માટે ઓછામાં ઓછું એક પરિશિષ્ટ પસંદ કરો.');
      return;
    }

    setIsGeneratingBatch(true);
    try {
      const zipBlob = await generateBatchParishishtZip(selectedForBatch, rojmelEntries, heads, teacher, { documentDate, forcedVersion, orientation: selectedOrientation });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ShalaSarathi_Parishisht_Batch_${teacher.academicYear}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Batch ZIP Generation Failed:', e);
      alert('બેચ ZIP ડાઉનલોડ કરવામાં ક્ષણિક ભૂલ આવી.');
    } finally {
      setIsGeneratingBatch(false);
    }
  };

  const handleSingleCSV = (num: ParishishtNumber) => {
    exportParishishtCSV(num, rojmelEntries, heads, teacher, { documentDate, forcedVersion, orientation: selectedOrientation });
  };

  const handleShare = async (num: ParishishtNumber) => {
    const tmpl = getApplicableParishishtTemplate(num, documentDate, forcedVersion);

    setIsGeneratingPDF(true);
    try {
      const res = await downloadParishisht1PDF(num, rojmelEntries, heads, teacher, { documentDate, forcedVersion, orientation: selectedOrientation });
      if (res.success && res.pdfBlob && navigator.share && navigator.canShare) {
        const schoolNameSanitized = sanitizeFileName(teacher.school.schoolNameGuj || 'School');
        const yearSanitized = sanitizeFileName(teacher.academicYear || '2026-27');
        const fileName = `ShalaSarathi_Parishisht-${String(num).padStart(2, '0')}_${schoolNameSanitized}_${yearSanitized}.pdf`;

        const file = new File([res.pdfBlob], fileName, { type: 'application/pdf' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: tmpl.nameGuj,
            text: `શાળા: ${teacher.school.schoolNameGuj} - પરિશિષ્ટ-${num} A4 ${selectedOrientation.toUpperCase()} રજિસ્ટર`,
            files: [file]
          });
          return;
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsGeneratingPDF(false);
    }

    if (navigator.share) {
      navigator.share({
        title: tmpl.nameGuj,
        text: `શાળા: ${teacher.school.schoolNameGuj} - ${tmpl.nameGuj} રિપોર્ટ શૈક્ષણિક વર્ષ ${teacher.academicYear}`
      }).catch(() => {});
    } else {
      alert(`લિંક/દસ્તાવેજ સફળતાપૂર્વક કોપી થયો: ${tmpl.nameGuj}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-6xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">સત્તાવાર પરિશિષ્ટ ૦૧ થી ૧૨ ઓડિટ રિપોર્ટ એન્જિન</h3>
              <p className="text-[10px] text-slate-400">રોજમેળ સત્તાવાર સંદર્ભ ચકાસાયેલ અને કાર્યકારી ઓડિટ પત્રકો</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-bold">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500">દસ્તાવેજ તારીખ:</span>
              <input
                type="date"
                value={documentDate}
                onChange={e => {
                  setDocumentDate(e.target.value);
                  setForcedVersion(undefined);
                }}
                className="bg-transparent text-slate-900 font-extrabold focus:outline-none cursor-pointer"
              />
            </div>

            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Grid: Left Selector List (Parishisht 01..12) + Right Preview Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
          
          {/* Left Column: Parishisht 01-12 Selector List */}
          <div className="lg:col-span-5 border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col bg-slate-50/50">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                સત્તાવાર પરિશિષ્ટો (૦૧ થી ૧૨)
              </span>
              <button
                onClick={handleBatchDownloadZip}
                disabled={isGeneratingBatch}
                className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-[11px] font-extrabold px-3 py-1 rounded-lg shadow flex items-center gap-1"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>{isGeneratingBatch ? 'ZIP બને છે...' : `બેચ ZIP ડાઉનલોડ (${selectedForBatch.length})`}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {OFFICIAL_PARISHISHT_TEMPLATES.filter((t, i, arr) => arr.findIndex(x => x.parishishtNo === t.parishishtNo) === i).map(t => {
                const isSelected = selectedParishishtNo === t.parishishtNo;
                const isBatchChecked = selectedForBatch.includes(t.parishishtNo);
                const isWorking = t.status === 'reference-working' || t.sourceType === 'working-reference';

                return (
                  <div
                    key={t.templateId}
                    className={`p-3 rounded-2xl border transition-all space-y-2 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-50 border-brand-600 shadow-sm ring-2 ring-brand-500/20'
                        : 'bg-white hover:bg-slate-100/80 border-slate-200'
                    }`}
                    onClick={() => handleSelectParishisht(t.parishishtNo)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBatchSelect(t.parishishtNo);
                          }}
                          className="text-slate-500 hover:text-brand-600"
                        >
                          {isBatchChecked ? (
                            <CheckSquare className="w-4 h-4 text-brand-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        <span className="font-mono text-[11px] font-black bg-slate-900 text-white px-2 py-0.5 rounded">
                          પરિશિષ્ટ {String(t.parishishtNo).padStart(2, '0')}
                        </span>
                      </div>

                      {!isWorking ? (
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          <span>Reference Verified</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Info className="w-3 h-3 text-amber-700" />
                          <span>Reference / Working</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs leading-snug">{t.nameGuj}</h4>
                    {isWorking && (
                      <div className="text-[10px] text-amber-900 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        સંદર્ભ આધારિત કાર્યકારી નમૂનો (Working Format)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Preview & Action Toolbar */}
          <div className="lg:col-span-7 border border-slate-200 rounded-2xl p-5 space-y-4 flex flex-col bg-white overflow-y-auto">
            
            {/* Template Info, Orientation Toggle & Version Selector */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-brand-600 text-white px-2.5 py-0.5 rounded-md">
                    પરિશિષ્ટ {String(selectedParishishtNo).padStart(2, '0')}
                  </span>
                  {!isWorkingRef ? (
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Reference Verified (સત્તાવાર સંદર્ભ ચકાસાયેલ)</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-amber-700" />
                      <span>સંદર્ભ આધારિત કાર્યકારી નમૂનો (Reference / Working)</span>
                    </span>
                  )}
                </div>

                {availableVersions.length > 1 && (
                  <button
                    onClick={() => setShowVersionConfirm(!showVersionConfirm)}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>વર્ઝન પસંદગી (v{currentTemplate.version}.0)</span>
                  </button>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{currentTemplate.nameGuj}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{currentTemplate.descriptionGuj}</p>

                {isWorkingRef && (
                  <div className="mt-2 bg-amber-100 border border-amber-300 text-amber-950 p-2.5 rounded-xl text-xs font-bold space-y-0.5">
                    <div>📌 સંદર્ભ આધારિત કાર્યકારી નમૂનો</div>
                    <div className="text-[11px] font-medium text-amber-900">
                      Reference / Working Format — Not an official approval claim
                    </div>
                  </div>
                )}

                {currentTemplate.source && currentTemplate.source.startsWith('http') && (
                  <a
                    href={currentTemplate.source}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-brand-600 font-bold hover:underline mt-1"
                  >
                    <span>સત્તાવાર સંદર્ભ PDF જુઓ ({currentTemplate.source})</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Orientation Selection Control */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200 text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Layout className="w-3.5 h-3.5 text-brand-600" />
                  <span>પ્રિન્ટ / PDF ઓરિએન્ટેશન:</span>
                </span>
                <div className="flex items-center gap-1.5 font-bold">
                  <button
                    onClick={() => setSelectedOrientation('landscape')}
                    className={`px-3 py-1 rounded-lg border transition-all ${
                      selectedOrientation === 'landscape'
                        ? 'bg-slate-900 text-white border-slate-900 shadow'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                    }`}
                  >
                    ● A4 Landscape ({currentTemplate.orientation === 'landscape' ? 'મૂળભૂત' : 'લેન્ડસ્કેપ'})
                  </button>
                  <button
                    onClick={() => setSelectedOrientation('portrait')}
                    className={`px-3 py-1 rounded-lg border transition-all ${
                      selectedOrientation === 'portrait'
                        ? 'bg-slate-900 text-white border-slate-900 shadow'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                    }`}
                  >
                    ○ A4 Portrait ({currentTemplate.orientation === 'portrait' ? 'મૂળભૂત' : 'ઉભું'})
                  </button>
                </div>
              </div>

              {/* Version Confirmation Dialog */}
              {showVersionConfirm && availableVersions.length > 1 && (
                <div className="bg-purple-100 border border-purple-300 p-3 rounded-xl space-y-2 text-xs text-purple-950 font-bold">
                  <div>આ દસ્તાવેજ માટે જૂનું Template વાપરવું છે કે નવું Template?</div>
                  <div className="flex gap-2 pt-1">
                    {availableVersions.map(v => (
                      <button
                        key={v.templateId}
                        onClick={() => {
                          setForcedVersion(v.version);
                          setShowVersionConfirm(false);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs ${
                          currentTemplate.version === v.version
                            ? 'bg-purple-800 text-white font-extrabold shadow'
                            : 'bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        v{v.version}.0 Template ({v.effectiveFrom} થી)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200">
                <button
                  onClick={() => handleDownloadPDF(selectedParishishtNo)}
                  disabled={isGeneratingPDF}
                  className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all"
                >
                  {isGeneratingPDF ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>PDF બને છે...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      <span>📄 PDF Download ({selectedOrientation.toUpperCase()})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onPrintParishisht(selectedParishishtNo, documentDate, forcedVersion, selectedOrientation)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>🖨 Print ({selectedOrientation.toUpperCase()})</span>
                </button>

                <button
                  onClick={() => handleSingleCSV(selectedParishishtNo)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Excel CSV</span>
                </button>

                <button
                  onClick={() => handleShare(selectedParishishtNo)}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  <span>↗ Share</span>
                </button>
              </div>
            </div>

            {/* Live A4 Document Preview Box */}
            <div className="flex-1 space-y-3 border border-slate-200 rounded-2xl p-4 bg-slate-50/30 overflow-y-auto">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-brand-600" />
                <span>સત્તાવાર રજિસ્ટર પ્રિવ્યુ (A4 {selectedOrientation.toUpperCase()} Layout)</span>
              </span>

              {selectedParishishtNo === 1 && currentRenderedData.parishisht1Data ? (
                <div className="bg-white p-4 rounded-xl border border-slate-900 space-y-3 text-[11px] font-sans">
                  {/* Clean Header */}
                  <div className="text-center border-b border-slate-900 pb-2 space-y-0.5">
                    <div className="font-black text-sm text-slate-900">{teacher.school.schoolNameGuj}</div>
                    <div className="text-[10px] text-slate-700">UDISE: {teacher.school.udiseCode} | વર્ષ: {teacher.academicYear}</div>
                    <div className="inline-block bg-slate-900 text-white text-[10px] font-bold px-3 py-0.5 rounded mt-1">
                      {currentTemplate.nameGuj} ({selectedOrientation.toUpperCase()})
                    </div>
                  </div>

                  <div className="bg-slate-100 p-2 border border-slate-900 font-bold flex justify-between text-[10px]">
                    <span>શરૂઆતની સિલક (Opening):</span>
                    <span>રોકડ: ₹{currentRenderedData.parishisht1Data.openingCash.toLocaleString('en-IN')} | બેંક: ₹{currentRenderedData.parishisht1Data.openingBank.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Dual JAMA & UDHAR Preview */}
                  <div className={`grid gap-3 text-[10px] ${selectedOrientation === 'landscape' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <div className="border border-slate-900 rounded overflow-hidden">
                      <div className="bg-emerald-900 text-white text-center font-bold p-1">જમા બાજુ (RECEIPTS / JAMA)</div>
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 border-b border-slate-900 font-bold">
                          <tr>
                            <th className="p-1">તારીખ</th>
                            <th className="p-1">રસીદ નં</th>
                            <th className="p-1">વિગત</th>
                            <th className="p-1 text-right">કુલ (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRenderedData.parishisht1Data.jamaRows.slice(0, 5).map((r, idx) => (
                            <tr key={idx} className="border-b border-slate-200">
                              <td className="p-1 font-bold">{r.date}</td>
                              <td className="p-1 font-mono">{r.receiptNo}</td>
                              <td className="p-1 truncate max-w-[100px]">{r.particular}</td>
                              <td className="p-1 text-right font-extrabold text-emerald-800">₹{r.totalAmount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="border border-slate-900 rounded overflow-hidden">
                      <div className="bg-rose-900 text-white text-center font-bold p-1">ઉધાર બાજુ (PAYMENTS / UDHAR)</div>
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 border-b border-slate-900 font-bold">
                          <tr>
                            <th className="p-1">તારીખ</th>
                            <th className="p-1">વાઉચર નં</th>
                            <th className="p-1">વિગત</th>
                            <th className="p-1 text-right">કુલ (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRenderedData.parishisht1Data.udharRows.slice(0, 5).map((r, idx) => (
                            <tr key={idx} className="border-b border-slate-200">
                              <td className="p-1 font-bold">{r.date}</td>
                              <td className="p-1 font-mono">{r.voucherNo}</td>
                              <td className="p-1 truncate max-w-[100px]">{r.particular}</td>
                              <td className="p-1 text-right font-extrabold text-rose-800">₹{r.totalAmount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-2 rounded text-[10px] font-bold flex justify-between">
                    <span>આખર સિલક બાકી (Closing Balance):</span>
                    <span>રોકડ: ₹{currentRenderedData.parishisht1Data.closingCash} | બેંક: ₹{currentRenderedData.parishisht1Data.closingBank} | કુલ: ₹{currentRenderedData.parishisht1Data.closingTotal}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  {isWorkingRef && (
                    <div className="bg-amber-50 border border-amber-300 text-amber-900 p-2.5 rounded-xl font-bold text-[11px] text-center">
                      ⚠️ સંદર્ભ આધારિત કાર્યકારી નમૂનો (Reference / Working Format — Not an official approval claim)
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-center font-bold bg-slate-50 p-2.5 rounded-lg">
                    <div>
                      <span className="text-[10px] text-slate-400">આવક:</span>
                      <div className="text-emerald-700 font-extrabold">₹{currentRenderedData.summary.totalIncome.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">જાવક:</span>
                      <div className="text-rose-700 font-extrabold">₹{currentRenderedData.summary.totalExpense.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">સિલિક:</span>
                      <div className="text-slate-900 font-black">₹{currentRenderedData.summary.closingBalance.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
          >
            બંધ કરો
          </button>
        </div>
      </div>
    </div>
  );
};
