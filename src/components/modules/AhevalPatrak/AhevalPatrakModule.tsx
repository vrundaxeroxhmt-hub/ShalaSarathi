import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  FileText, 
  FileSpreadsheet, 
  Plus, 
  Eye, 
  Printer, 
  FileDown, 
  Share2, 
  Save, 
  CheckCircle, 
  Lock, 
  RefreshCw, 
  Calendar, 
  Filter, 
  X, 
  ChevronRight,
  ExternalLink,
  Info,
  Loader2
} from 'lucide-react';
import { 
  AhevalPatrakTemplate, 
  AhevalPatrakDocument, 
  AhevalPatrakCategory 
} from '@/types/ahevalPatrak';
import { TeacherProfile } from '@/types/user';
import { RojmelEntry } from '@/types/rojmel';
import { ahevalPatrakService, downloadAhevalPatrakPDF } from '@/lib/services/ahevalPatrakService';
import { TemplateRenderer } from './TemplateRenderer';

interface Props {
  teacher: TeacherProfile;
  rojmelEntries: RojmelEntry[];
  isMobile?: boolean;
  onOpenParishishtModal?: () => void;
}

export const AhevalPatrakModule: React.FC<Props> = ({
  teacher,
  rojmelEntries,
  isMobile = false,
  onOpenParishishtModal
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'mydocs'>('templates');
  const [templates, setTemplates] = useState<AhevalPatrakTemplate[]>([]);
  const [myDocs, setMyDocs] = useState<AhevalPatrakDocument[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('ALL');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>(teacher?.academicYear || '2026-27');

  // Active Document Editor / Viewer state
  const [activeTemplate, setActiveTemplate] = useState<AhevalPatrakTemplate | null>(null);
  const [activeDocument, setActiveDocument] = useState<AhevalPatrakDocument | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const documentPrintRef = useRef<HTMLDivElement>(null);

  const loadData = () => {
    setTemplates(ahevalPatrakService.getPublishedTemplates());
    setMyDocs(ahevalPatrakService.getAllDocuments());
    setSubCategories(ahevalPatrakService.getSubCategories());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartNewDocument = (template: AhevalPatrakTemplate) => {
    setActiveTemplate(template);
    const autoVals = ahevalPatrakService.generateAutoFilledValues(template, teacher, rojmelEntries);
    setFieldValues(autoVals);

    const draftDoc = ahevalPatrakService.saveDocument({
      templateId: template.templateId,
      templateVersion: template.version,
      titleGuj: template.titleGuj,
      category: template.category,
      subCategory: template.subCategory,
      status: 'DRAFT',
      academicYear: teacher.academicYear || '2026-27',
      financialYear: teacher.academicYear || '2026-27',
      fieldValues: autoVals
    });

    setActiveDocument(draftDoc);
    setActiveTab('mydocs');
  };

  const handleSaveDraft = () => {
    if (!activeDocument || !activeTemplate) return;
    const updated = ahevalPatrakService.saveDocument({
      ...activeDocument,
      fieldValues
    });
    setActiveDocument(updated);
    loadData();
    alert('સેવ ડ્રાફ્ટ સફળતાપૂર્વક સંગ્રહિત થયો!');
  };

  const handleFinalise = () => {
    if (!activeDocument) return;
    if (confirm('શું તમે આ દસ્તાવેજ Finalize કરવા માંગો છો? ફાઈનલ થયા પછી લૉક થઈ જશે.')) {
      const fin = ahevalPatrakService.finaliseDocument(activeDocument.documentId);
      if (fin) setActiveDocument(fin);
      loadData();
    }
  };

  const handleCreateRevised = (docId: string) => {
    const rev = ahevalPatrakService.createRevisedDocument(docId);
    if (rev) {
      const tmpl = ahevalPatrakService.getTemplateById(rev.templateId);
      if (tmpl) setActiveTemplate(tmpl);
      setActiveDocument(rev);
      setFieldValues(rev.fieldValues);
      loadData();
    }
  };

  const handleDownloadPDF = async () => {
    if (!documentPrintRef.current || !activeTemplate) return;
    setIsGeneratingPDF(true);
    try {
      await downloadAhevalPatrakPDF(
        documentPrintRef.current,
        activeTemplate.titleGuj,
        activeTemplate.category,
        teacher.academicYear || '2026-27',
        activeTemplate.orientation
      );
    } catch (err) {
      console.error(err);
      alert('PDF ડાઉનલોડ કરવામાં ક્ષતિ આવી.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    if (!documentPrintRef.current) return;
    const content = documentPrintRef.current.innerHTML;
    const printWin = window.open('', '', 'width=900,height=700');
    if (printWin) {
      printWin.document.write(`
        <html>
          <head>
            <title>${activeTemplate?.titleGuj || 'Document'}</title>
            <style>
              @page { size: A4 ${activeTemplate?.orientation || 'portrait'}; margin: 10mm; }
              body { font-family: 'Hind Vadodara', 'Noto Sans Gujarati', sans-serif; background: white; color: black; margin: 0; padding: 0; }
              .no-print { display: none !important; }
            </style>
            <link href="https://fonts.googleapis.com/css2?family=Hind+Vadodara:wght@400;600;700&display=swap" rel="stylesheet">
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
        printWin.close();
      }, 500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({
        title: activeTemplate?.titleGuj || 'અહેવાલ / પત્રક',
        text: `શાળા સારથિ - ${activeTemplate?.titleGuj} (શાળા: ${teacher.school.schoolNameGuj})`
      }).catch(() => {});
    } else {
      alert(`દસ્તાવેજ લિંક કોપી થઈ: ${activeTemplate?.titleGuj}`);
    }
  };

  const filteredTemplates = templates.filter(t => {
    if (selectedCategory !== 'ALL' && t.category !== selectedCategory) return false;
    if (selectedSubCategory !== 'ALL' && t.subCategory !== selectedSubCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.titleGuj.toLowerCase().includes(q) || t.subCategory.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans max-w-7xl mx-auto">
      
      {/* Module Title & Top Toolbar Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center font-bold shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">📑 અહેવાલ / પત્રક (Centralized Template System)</h1>
            <p className="text-xs text-slate-500 mt-0.5">શાળા અહેવાલો અને પત્રકોનું સત્તાવાર રીયુઝેબલ ફોર્મેટ એન્જિન</p>
          </div>
        </div>

        {/* Parishisht Shortcut Button */}
        {onOpenParishishtModal && (
          <button
            onClick={onOpenParishishtModal}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow flex items-center gap-2"
          >
            <span>📑 સત્તાવાર પરિશિષ્ટ ૦૧–૧૨ (Rojmel)</span>
            <ExternalLink className="w-4 h-4 text-brand-400" />
          </button>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'templates'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-950/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>ઉપલબ્ધ ટેમ્પલેટો ({filteredTemplates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mydocs')}
          className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'mydocs'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-950/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>મારા સેવ થયેલ દસ્તાવેજ ({myDocs.length})</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="અહેવાલ કે પત્રક શોધો..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none"
          >
            <option value="ALL">તમામ શ્રેણી (અહેવાલ / પત્રક)</option>
            <option value="અહેવાલ">અહેવાલ</option>
            <option value="પત્રક">પત્રક</option>
          </select>
        </div>

        <div>
          <select
            value={selectedSubCategory}
            onChange={e => setSelectedSubCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none"
          >
            <option value="ALL">તમામ સબ-કેટેગરી</option>
            {subCategories.map(sc => (
              <option key={sc} value={sc}>{sc}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedAcademicYear}
            onChange={e => setSelectedAcademicYear(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none"
          >
            <option value="2026-27">શૈક્ષણિક વર્ષ: ૨૦૨૬-૨૭</option>
            <option value="2025-26">શૈક્ષણિક વર્ષ: ૨૦૨૫-૨૬</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map(t => (
            <div key={t.templateId} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                    t.category === 'અહેવાલ' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {t.category} • {t.subCategory}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">v{t.version}.0</span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{t.titleGuj}</h3>

                {t.sourceType === 'working-reference' && (
                  <div className="text-[10px] text-amber-900 font-semibold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                    ⚠️ સંદર્ભ આધારિત કાર્યકારી નમૂનો
                  </div>
                )}
              </div>

              <button
                onClick={() => handleStartNewDocument(t)}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs py-2.5 rounded-xl shadow flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>નવો બનાવવો (Create Document)</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'mydocs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Saved Documents List */}
          <div className="lg:col-span-4 border border-slate-200 rounded-3xl p-4 space-y-3 bg-white">
            <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wide border-b border-slate-100 pb-2 block">
              મારા સાચવેલ દસ્તાવેજો ({myDocs.length})
            </span>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {myDocs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-bold">
                  કોઈ સેવ થયેલ દસ્તાવેજ નથી.
                </div>
              ) : (
                myDocs.map(doc => {
                  const isSelected = activeDocument?.documentId === doc.documentId;

                  return (
                    <div
                      key={doc.documentId}
                      onClick={() => {
                        setActiveDocument(doc);
                        const tmpl = ahevalPatrakService.getTemplateById(doc.templateId);
                        if (tmpl) setActiveTemplate(tmpl);
                        setFieldValues(doc.fieldValues || {});
                      }}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2 cursor-pointer ${
                        isSelected
                          ? 'bg-brand-50 border-brand-600 shadow-sm ring-2 ring-brand-500/20'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded">
                          {doc.category}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          doc.status === 'FINAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {doc.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs leading-snug">{doc.titleGuj}</h4>
                      <div className="text-[10px] text-slate-400 font-medium">તારીખ: {doc.updatedDate}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Document Editor & Live Preview Pane */}
          <div className="lg:col-span-8 border border-slate-200 rounded-3xl p-5 space-y-4 bg-white flex flex-col">
            {activeDocument && activeTemplate ? (
              <div className="space-y-4 flex-1">
                {/* Document Status Header Toolbar */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{activeDocument.titleGuj}</h3>
                    <p className="text-xs text-slate-500">સ્થિતિ: <strong>{activeDocument.status}</strong> | Version: v{activeDocument.templateVersion}.0</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {activeDocument.status === 'DRAFT' && (
                      <>
                        <button
                          onClick={handleSaveDraft}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>ડ્રાફ્ટ સાચવો</span>
                        </button>
                        <button
                          onClick={handleFinalise}
                          className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow flex items-center gap-1"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>ફાઇનલાઇઝ (Lock)</span>
                        </button>
                      </>
                    )}

                    {activeDocument.status === 'FINAL' && (
                      <button
                        onClick={() => handleCreateRevised(activeDocument.documentId)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>સુધારેલ આવૃત્તિ (Revised Version)</span>
                      </button>
                    )}

                    <button
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPDF}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow flex items-center gap-1"
                    >
                      {isGeneratingPDF ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                      <span>PDF</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>પ્રિન્ટ</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-extrabold text-xs px-3 py-2 rounded-xl flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>શેર</span>
                    </button>
                  </div>
                </div>

                {/* Printable Document Renderer */}
                <div ref={documentPrintRef} className="overflow-y-auto">
                  <TemplateRenderer
                    template={activeTemplate}
                    fieldValues={fieldValues}
                    onChangeFieldValue={(id, val) => setFieldValues({ ...fieldValues, [id]: val })}
                    isReadOnly={activeDocument.status === 'FINAL'}
                    teacher={teacher}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-3">
                <FileText className="w-12 h-12 text-slate-300" />
                <div className="font-bold text-sm text-slate-600">ડાબી બાજુમાંથી ટેમ્પલેટ પસંદ કરીને નવો દસ્તાવેજ શરૂ કરો.</div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
