import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  FileText, 
  CheckCircle, 
  Archive, 
  Copy, 
  Edit3, 
  Eye, 
  Send, 
  X, 
  Trash2, 
  Layers, 
  HelpCircle,
  FolderPlus,
  ShieldCheck,
  Info
} from 'lucide-react';
import { 
  AhevalPatrakTemplate, 
  AhevalPatrakCategory, 
  TemplateSection, 
  TemplateField, 
  FieldType 
} from '@/types/ahevalPatrak';
import { ahevalPatrakService } from '@/lib/services/ahevalPatrakService';

export const AhevalPatrakTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<AhevalPatrakTemplate[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [editingTemplate, setEditingTemplate] = useState<AhevalPatrakTemplate | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSubCatInput, setNewSubCatInput] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<AhevalPatrakTemplate | null>(null);

  const loadData = () => {
    setTemplates(ahevalPatrakService.getAllTemplates());
    setSubCategories(ahevalPatrakService.getSubCategories());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSubCategory = () => {
    if (!newSubCatInput.trim()) return;
    const updated = ahevalPatrakService.addSubCategory(newSubCatInput.trim());
    setSubCategories(updated);
    setNewSubCatInput('');
  };

  const handleStartCreate = () => {
    const newTpl: AhevalPatrakTemplate = {
      templateId: `tpl_${Date.now()}`,
      titleGuj: 'નવું અહેવાલ / પત્રક નમૂનો',
      titleEng: 'New Aheval / Patrak Template',
      category: 'અહેવાલ',
      subCategory: subCategories[0] || 'નાણાકીય',
      version: 1,
      status: 'draft',
      sourceType: 'working-reference',
      effectiveFrom: new Date().toISOString().split('T')[0],
      orientation: 'portrait',
      pageSize: 'A4',
      margins: '10mm',
      sections: [
        {
          id: 'sec_1',
          titleGuj: '૧. પ્રાથમિક વિગતો',
          order: 1,
          fields: [
            { id: 'f_school', labelGuj: 'શાળાનું નામ', type: 'school_profile', required: true, editableByTeacher: false, autoFillSource: 'school.schoolNameGuj', order: 1 }
          ]
        }
      ],
      autoFillMappings: [],
      requiredFields: ['f_school'],
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };
    setEditingTemplate(newTpl);
    setIsCreatingNew(true);
  };

  const handleSaveEditing = () => {
    if (!editingTemplate) return;
    ahevalPatrakService.saveTemplate(editingTemplate);
    setEditingTemplate(null);
    setIsCreatingNew(false);
    loadData();
  };

  const handlePublish = (id: string) => {
    ahevalPatrakService.publishTemplate(id);
    loadData();
  };

  const handleUnpublish = (id: string) => {
    ahevalPatrakService.unpublishTemplate(id);
    loadData();
  };

  const handleArchive = (id: string) => {
    ahevalPatrakService.archiveTemplate(id);
    loadData();
  };

  const handleDuplicate = (id: string) => {
    ahevalPatrakService.duplicateTemplate(id);
    loadData();
  };

  const handleCreateNewVersion = (id: string) => {
    const v = ahevalPatrakService.createNewVersion(id);
    if (v) setEditingTemplate(v);
    loadData();
  };

  const filteredTemplates = templates.filter(t => {
    if (filterCategory !== 'ALL' && t.category !== filterCategory) return false;
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & Category Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            <span>📑 અહેવાલ / પત્રક Templates મેનેજર (Schema Engine)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            શિક્ષકો માટે અહેવાલ અને પત્રક ટેમ્પલેટ બનાવવું, વર્ઝન સંચાલન, અને પબ્લિશ કરવું.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleStartCreate}
            className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>નવું ટેમ્પલેટ બનાવો</span>
          </button>
        </div>
      </div>

      {/* Subcategory Configurator & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">ટેમ્પલેટ ફિલ્ટર્સ:</span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="text-slate-500">કેટેગરી:</span>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs text-slate-900 font-extrabold"
              >
                <option value="ALL">તમામ કેટેગરી</option>
                <option value="અહેવાલ">અહેવાલ</option>
                <option value="પત્રક">પત્રક</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="text-slate-500">સ્થિતિ:</span>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs text-slate-900 font-extrabold"
              >
                <option value="ALL">તમામ સ્થિતિ</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add Sub-category Box */}
        <div className="lg:col-span-4 bg-purple-50/60 p-4 rounded-2xl border border-purple-200 space-y-2">
          <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
            <FolderPlus className="w-3.5 h-3.5 text-purple-700" />
            <span>નવી સબ-કેટેગરી ઉમેરો:</span>
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubCatInput}
              onChange={e => setNewSubCatInput(e.target.value)}
              placeholder="દા.ત. સ્કોલરશીપ"
              className="flex-1 bg-white border border-purple-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-bold focus:outline-none"
            />
            <button
              onClick={handleAddSubCategory}
              className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-3 py-1 rounded-lg"
            >
              ઉમેરો
            </button>
          </div>
        </div>
      </div>

      {/* Template Builder Modal / Drawer */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {isCreatingNew ? 'નવું ટેમ્પલેટ બિલ્ડર' : `ટેમ્પલેટ એડિટર (v${editingTemplate.version}.0)`}
              </h3>
              <button onClick={() => setEditingTemplate(null)} className="text-slate-400 hover:text-slate-700 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Form Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700">ટેમ્પલેટ શીર્ષક (ગુજરાતી)</label>
                  <input
                    type="text"
                    value={editingTemplate.titleGuj}
                    onChange={e => setEditingTemplate({ ...editingTemplate, titleGuj: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">મુખ્ય કેટેગરી</label>
                  <select
                    value={editingTemplate.category}
                    onChange={e => setEditingTemplate({ ...editingTemplate, category: e.target.value as AhevalPatrakCategory })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                  >
                    <option value="અહેવાલ">અહેવાલ</option>
                    <option value="પત્રક">પત્રક</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">સબ-કેટેગરી</label>
                  <select
                    value={editingTemplate.subCategory}
                    onChange={e => setEditingTemplate({ ...editingTemplate, subCategory: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                  >
                    {subCategories.map(sc => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">ઓરિએન્ટેશન</label>
                  <select
                    value={editingTemplate.orientation}
                    onChange={e => setEditingTemplate({ ...editingTemplate, orientation: e.target.value as any })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                  >
                    <option value="portrait">A4 Portrait (ઉભું)</option>
                    <option value="landscape">A4 Landscape (લેન્ડસ્કેપ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">સંદર્ભ પ્રકાર</label>
                  <select
                    value={editingTemplate.sourceType}
                    onChange={e => setEditingTemplate({ ...editingTemplate, sourceType: e.target.value as any })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                  >
                    <option value="working-reference">સંદર્ભ આધારિત કાર્યકારી નમૂનો (Working Format)</option>
                    <option value="official-reference">સત્તાવાર સંદર્ભ ચકાસાયેલ (Reference Verified)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">અમલ તારીખ</label>
                  <input
                    type="date"
                    value={editingTemplate.effectiveFrom}
                    onChange={e => setEditingTemplate({ ...editingTemplate, effectiveFrom: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Sections & Fields Editor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">
                    સેક્શન્સ અને ક્ષેત્રો (Form Fields Builder)
                  </span>
                  <button
                    onClick={() => {
                      const newSec: TemplateSection = {
                        id: `sec_${Date.now()}`,
                        titleGuj: `નવો સેક્શન ${editingTemplate.sections.length + 1}`,
                        order: editingTemplate.sections.length + 1,
                        fields: []
                      };
                      setEditingTemplate({
                        ...editingTemplate,
                        sections: [...editingTemplate.sections, newSec]
                      });
                    }}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>નવો સેક્શન ઉમેરો</span>
                  </button>
                </div>

                {editingTemplate.sections.map((sec, sIdx) => (
                  <div key={sec.id} className="border border-slate-300 rounded-2xl p-4 space-y-3 bg-slate-50/50">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <input
                        type="text"
                        value={sec.titleGuj}
                        onChange={e => {
                          const secs = [...editingTemplate.sections];
                          secs[sIdx].titleGuj = e.target.value;
                          setEditingTemplate({ ...editingTemplate, sections: secs });
                        }}
                        className="font-bold text-slate-900 text-xs bg-white border border-slate-300 rounded px-2 py-1 w-64"
                      />
                      <button
                        onClick={() => {
                          const secs = editingTemplate.sections.filter((_, i) => i !== sIdx);
                          setEditingTemplate({ ...editingTemplate, sections: secs });
                        }}
                        className="text-rose-600 hover:text-rose-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Fields List */}
                    <div className="space-y-2">
                      {sec.fields.map((f, fIdx) => (
                        <div key={f.id} className="bg-white p-2.5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-2 items-center text-xs">
                          <input
                            type="text"
                            value={f.labelGuj}
                            onChange={e => {
                              const secs = [...editingTemplate.sections];
                              secs[sIdx].fields[fIdx].labelGuj = e.target.value;
                              setEditingTemplate({ ...editingTemplate, sections: secs });
                            }}
                            placeholder="ફીલ્ડ લેબલ"
                            className="bg-slate-50 border border-slate-300 rounded px-2 py-1 font-bold text-slate-900"
                          />

                          <select
                            value={f.type}
                            onChange={e => {
                              const secs = [...editingTemplate.sections];
                              secs[sIdx].fields[fIdx].type = e.target.value as FieldType;
                              setEditingTemplate({ ...editingTemplate, sections: secs });
                            }}
                            className="bg-slate-50 border border-slate-300 rounded px-2 py-1 font-bold text-slate-900"
                          >
                            <option value="text">Text (લખાણ)</option>
                            <option value="multiline">Multiline Text (પેરેગ્રાફ)</option>
                            <option value="number">Number (સંખ્યા)</option>
                            <option value="currency">Currency (રકમ ₹)</option>
                            <option value="date">Date (તારીખ)</option>
                            <option value="dropdown">Dropdown (પસંદગી)</option>
                            <option value="yes_no">Yes / No (હા / ના)</option>
                            <option value="school_profile">School Profile Field</option>
                            <option value="teacher_profile">Teacher Profile Field</option>
                            <option value="signature">Signature Block</option>
                          </select>

                          <div className="flex items-center gap-2 font-bold text-[11px]">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={f.editableByTeacher}
                                onChange={e => {
                                  const secs = [...editingTemplate.sections];
                                  secs[sIdx].fields[fIdx].editableByTeacher = e.target.checked;
                                  setEditingTemplate({ ...editingTemplate, sections: secs });
                                }}
                              />
                              <span>Editable</span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={f.required}
                                onChange={e => {
                                  const secs = [...editingTemplate.sections];
                                  secs[sIdx].fields[fIdx].required = e.target.checked;
                                  setEditingTemplate({ ...editingTemplate, sections: secs });
                                }}
                              />
                              <span>Required</span>
                            </label>
                          </div>

                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                const secs = [...editingTemplate.sections];
                                secs[sIdx].fields = secs[sIdx].fields.filter((_, i) => i !== fIdx);
                                setEditingTemplate({ ...editingTemplate, sections: secs });
                              }}
                              className="text-rose-500 hover:text-rose-700"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          const secs = [...editingTemplate.sections];
                          const newF: TemplateField = {
                            id: `f_${Date.now()}`,
                            labelGuj: `નવું ફીલ્ડ ${secs[sIdx].fields.length + 1}`,
                            type: 'text',
                            required: false,
                            editableByTeacher: true,
                            order: secs[sIdx].fields.length + 1
                          };
                          secs[sIdx].fields.push(newF);
                          setEditingTemplate({ ...editingTemplate, sections: secs });
                        }}
                        className="text-brand-600 hover:text-brand-800 text-xs font-bold flex items-center gap-1 pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>આ સેક્શનમાં ફીલ્ડ ઉમેરો</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingTemplate(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                રદ કરો
              </button>
              <button
                onClick={handleSaveEditing}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl text-xs shadow"
              >
                સેવ કરો (Save Template)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(t => (
          <div key={t.templateId} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  t.category === 'અહેવાલ' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {t.category} • {t.subCategory}
                </span>

                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  t.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {t.status.toUpperCase()} (v{t.version}.0)
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">{t.titleGuj}</h3>

              {t.sourceType === 'working-reference' ? (
                <div className="text-[10px] text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                  ⚠️ સંદર્ભ આધારિત કાર્યકારી નમૂનો
                </div>
              ) : (
                <div className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Reference Verified</span>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold">
              <div className="flex items-center gap-1">
                {t.status === 'published' ? (
                  <button
                    onClick={() => handleUnpublish(t.templateId)}
                    className="text-amber-600 hover:text-amber-800 px-2 py-1 rounded bg-amber-50 border border-amber-200 text-[10px]"
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    onClick={() => handlePublish(t.templateId)}
                    className="text-emerald-700 hover:text-emerald-900 px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-[10px] flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Publish</span>
                  </button>
                )}

                <button
                  onClick={() => handleCreateNewVersion(t.templateId)}
                  className="text-purple-700 hover:text-purple-900 px-2 py-1 rounded bg-purple-50 border border-purple-200 text-[10px]"
                >
                  + New Ver
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingTemplate(t);
                    setIsCreatingNew(false);
                  }}
                  className="p-1.5 text-slate-600 hover:text-brand-600 rounded"
                  title="એડિટ કરો"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicate(t.templateId)}
                  className="p-1.5 text-slate-600 hover:text-purple-600 rounded"
                  title="ડુપ્લિકેટ કરો"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleArchive(t.templateId)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  title="આર્કાઇવ કરો"
                >
                  <Archive className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
