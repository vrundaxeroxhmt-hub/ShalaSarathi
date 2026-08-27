import { 
  AhevalPatrakTemplate, 
  AhevalPatrakDocument, 
  SubCategoryOption 
} from '@/types/ahevalPatrak';
import { TeacherProfile } from '@/types/user';
import { RojmelEntry } from '@/types/rojmel';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TEMPLATES_STORAGE_KEY = 'shalasarathi_v2_aheval_patrak_templates';
const DOCUMENTS_STORAGE_KEY = 'shalasarathi_v2_aheval_patrak_documents';
const SUBCATEGORIES_STORAGE_KEY = 'shalasarathi_v2_aheval_patrak_subcategories';

export const DEFAULT_SUBCATEGORIES: SubCategoryOption[] = [
  'નાણાકીય',
  'શૈક્ષણિક',
  'વહીવટી',
  'વિદ્યાર્થી',
  'શાળા વ્યવસ્થાપન',
  'ગ્રાન્ટ',
  'SMC',
  'અન્ય'
];

export const INITIAL_SEED_TEMPLATES: AhevalPatrakTemplate[] = [
  // 1. Annual School Report
  {
    templateId: 'tpl_aheval_01_annual_school_report',
    titleGuj: '📘 વાર્ષિક શાળા અહેવાલ (Annual School Report)',
    titleEng: 'Annual School Report',
    category: 'અહેવાલ',
    subCategory: 'શાળા વ્યવસ્થાપન',
    version: 1,
    status: 'published',
    sourceType: 'working-reference',
    effectiveFrom: '2026-04-01',
    orientation: 'portrait',
    pageSize: 'A4',
    margins: '10mm',
    createdDate: '2026-08-27',
    updatedDate: '2026-08-27',
    sections: [
      {
        id: 'sec_basic_info',
        titleGuj: '૧. શાળાની સામાન્ય માહિતી',
        order: 1,
        fields: [
          { id: 'schoolName', labelGuj: 'શાળાનું નામ', type: 'school_profile', required: true, editableByTeacher: false, autoFillSource: 'school.schoolNameGuj', order: 1 },
          { id: 'udiseCode', labelGuj: 'UDISE કોડ', type: 'udise', required: true, editableByTeacher: false, autoFillSource: 'school.udiseCode', order: 2 },
          { id: 'academicYear', labelGuj: 'શૈક્ષણિક વર્ષ', type: 'academic_year', required: true, editableByTeacher: false, autoFillSource: 'academicYear', order: 3 },
          { id: 'principalName', labelGuj: 'મુખ્ય શિક્ષક / આચાર્યનું નામ', type: 'teacher_profile', required: true, editableByTeacher: true, autoFillSource: 'teacher.nameGuj', order: 4 }
        ]
      },
      {
        id: 'sec_enrollment_summary',
        titleGuj: '૨. વિદ્યાર્થી સંખ્યા અને શૈક્ષણિક સિદ્ધિઓ',
        order: 2,
        fields: [
          { id: 'totalBoys', labelGuj: 'કુલ કુમાર (Boys Enrollment)', type: 'number', required: true, editableByTeacher: true, defaultValue: 0, order: 1 },
          { id: 'totalGirls', labelGuj: 'કુલ કન્યા (Girls Enrollment)', type: 'number', required: true, editableByTeacher: true, defaultValue: 0, order: 2 },
          { id: 'overallResultPct', labelGuj: 'વાર્ષિક પરિણામ ટકાવારી (%)', type: 'number', required: true, editableByTeacher: true, defaultValue: 95, order: 3 },
          { id: 'keyAchievements', labelGuj: 'મુખ્ય શૈક્ષણિક અને સહ-શૈક્ષણિક સિદ્ધિઓ', type: 'multiline', required: false, editableByTeacher: true, placeholder: 'રમતગમત, વિજ્ઞાન મેળો, અને સંસ્કાર પ્રવૃત્તિઓ...', order: 4 }
        ]
      },
      {
        id: 'sec_signatures',
        titleGuj: '૩. ચકાસણી અને પ્રમાણીકરણ',
        order: 3,
        fields: [
          { id: 'teacherSign', labelGuj: 'અહેવાલ તૈયાર કરનાર સહી', type: 'signature', required: true, editableByTeacher: false, order: 1 },
          { id: 'principalSign', labelGuj: 'મુખ્ય શિક્ષક સહી અને સિક્કો', type: 'signature', required: true, editableByTeacher: false, order: 2 }
        ]
      }
    ],
    autoFillMappings: [
      { targetFieldId: 'schoolName', sourceKey: 'school.schoolNameGuj' },
      { targetFieldId: 'udiseCode', sourceKey: 'school.udiseCode' },
      { targetFieldId: 'academicYear', sourceKey: 'academicYear' }
    ],
    requiredFields: ['schoolName', 'udiseCode', 'academicYear']
  },

  // 2. School Inspection Report
  {
    templateId: 'tpl_aheval_02_school_inspection',
    titleGuj: '🏫 શાળા મુલાકાત / નિરીક્ષણ અહેવાલ',
    titleEng: 'School Visit & Inspection Report',
    category: 'અહેવાલ',
    subCategory: 'વહીવટી',
    version: 1,
    status: 'published',
    sourceType: 'working-reference',
    effectiveFrom: '2026-04-01',
    orientation: 'portrait',
    pageSize: 'A4',
    margins: '10mm',
    createdDate: '2026-08-27',
    updatedDate: '2026-08-27',
    sections: [
      {
        id: 'sec_visit_details',
        titleGuj: '૧. મુલાકાત વિગત',
        order: 1,
        fields: [
          { id: 'schoolName', labelGuj: 'શાળાનું નામ', type: 'school_profile', required: true, editableByTeacher: false, autoFillSource: 'school.schoolNameGuj', order: 1 },
          { id: 'visitDate', labelGuj: 'મુલાકાત તારીખ', type: 'date', required: true, editableByTeacher: true, order: 2 },
          { id: 'visitorNameDesignation', labelGuj: 'નિરીક્ષકનું નામ અને હોદ્દો', type: 'text', required: true, editableByTeacher: true, placeholder: 'સીઆરસી સી-કોઓર્ડિનેટર / બીઆરસી સીએમ', order: 3 },
          { id: 'visitPurpose', labelGuj: 'મુલાકાતનો હેતુ', type: 'text', required: true, editableByTeacher: true, defaultValue: 'શૈક્ષણિક અને વહીવટી તપાસણી', order: 4 }
        ]
      },
      {
        id: 'sec_observations',
        titleGuj: '૨. અવલોકન અને સૂચનો',
        order: 2,
        fields: [
          { id: 'academicObservations', labelGuj: 'શૈક્ષણિક કક્ષા અંગેના અવલોકનો', type: 'multiline', required: true, editableByTeacher: true, order: 1 },
          { id: 'infrastructureObservations', labelGuj: 'ભૌતિક સુવિધાઓ અને સફાઈ સ્થિતિ', type: 'multiline', required: true, editableByTeacher: true, order: 2 },
          { id: 'recommendations', labelGuj: 'સુધારાત્મક સૂચનો', type: 'multiline', required: false, editableByTeacher: true, order: 3 }
        ]
      }
    ],
    autoFillMappings: [
      { targetFieldId: 'schoolName', sourceKey: 'school.schoolNameGuj' }
    ],
    requiredFields: ['schoolName', 'visitDate', 'visitorNameDesignation']
  },

  // 3. Academic Evaluation Report
  {
    templateId: 'tpl_aheval_03_academic_eval',
    titleGuj: '📚 શૈક્ષણિક પ્રગતિ / મૂલ્યાંકન અહેવાલ',
    titleEng: 'Academic Progress Evaluation Report',
    category: 'અહેવાલ',
    subCategory: 'શૈક્ષણિક',
    version: 1,
    status: 'published',
    sourceType: 'working-reference',
    effectiveFrom: '2026-04-01',
    orientation: 'portrait',
    pageSize: 'A4',
    margins: '10mm',
    createdDate: '2026-08-27',
    updatedDate: '2026-08-27',
    sections: [
      {
        id: 'sec_eval_header',
        titleGuj: '૧. શૈક્ષણિક મૂલ્યાંકન સત્ર વિગત',
        order: 1,
        fields: [
          { id: 'schoolName', labelGuj: 'શાળાનું નામ', type: 'school_profile', required: true, editableByTeacher: false, autoFillSource: 'school.schoolNameGuj', order: 1 },
          { id: 'evalTerm', labelGuj: 'મૂલ્યાંકન સત્ર', type: 'dropdown', required: true, editableByTeacher: true, options: ['પ્રથમ સત્ર', 'દ્વિતીય સત્ર', 'વાર્ષિક મૂલ્યાંકન'], order: 2 },
          { id: 'standardClass', labelGuj: 'ધોરણ', type: 'dropdown', required: true, editableByTeacher: true, options: ['ધોરણ ૧ થી ૫', 'ધોરણ ૬ થી ૮', 'ધોરણ ૧ થી ૮'], order: 3 }
        ]
      },
      {
        id: 'sec_subject_grades',
        titleGuj: '૨. વિષયવાર પરિણામ અને ગ્રેડ વિગત',
        order: 2,
        fields: [
          { id: 'gradeAStudents', labelGuj: 'A ગ્રેડ મેળવનાર વિદ્યાર્થીઓ', type: 'number', required: true, editableByTeacher: true, defaultValue: 0, order: 1 },
          { id: 'gradeBStudents', labelGuj: 'B ગ્રેડ મેળવનાર વિદ્યાર્થીઓ', type: 'number', required: true, editableByTeacher: true, defaultValue: 0, order: 2 },
          { id: 'gradeCStudents', labelGuj: 'C ગ્રેડ મેળવનાર વિદ્યાર્થીઓ (નિદાન લક્ષી કાર્ય)', type: 'number', required: true, editableByTeacher: true, defaultValue: 0, order: 3 },
          { id: 'remedialActionPlan', labelGuj: 'નબળા વિદ્યાર્થીઓ માટે ઉપચારાત્મક કાર્ય યોજના', type: 'multiline', required: false, editableByTeacher: true, order: 4 }
        ]
      }
    ],
    autoFillMappings: [{ targetFieldId: 'schoolName', sourceKey: 'school.schoolNameGuj' }],
    requiredFields: ['schoolName', 'evalTerm']
  },

  // 4. Activity & Program Report
  {
    templateId: 'tpl_aheval_04_activity_event',
    titleGuj: '🎯 પ્રવૃત્તિ / કાર્યક્રમ અહેવાલ',
    titleEng: 'School Activity & Event Report',
    category: 'અહેવાલ',
    subCategory: 'શૈક્ષણિક',
    version: 1,
    status: 'published',
    sourceType: 'working-reference',
    effectiveFrom: '2026-04-01',
    orientation: 'portrait',
    pageSize: 'A4',
    margins: '10mm',
    createdDate: '2026-08-27',
    updatedDate: '2026-08-27',
    sections: [
      {
        id: 'sec_event_info',
        titleGuj: '૧. કાર્યક્રમ માહિતી',
        order: 1,
        fields: [
          { id: 'eventName', labelGuj: 'કાર્યક્રમનું નામ', type: 'text', required: true, editableByTeacher: true, placeholder: 'સ્વાતંત્ર્ય દિન / વિજ્ઞાન મેળો / સાંસ્કૃતિક પ્રોગ્રામ', order: 1 },
          { id: 'eventDate', labelGuj: 'તારીખ', type: 'date', required: true, editableByTeacher: true, order: 2 },
          { id: 'participantCount', labelGuj: 'ભાગ લેનાર કુલ વિદ્યાર્થીઓ', type: 'number', required: true, editableByTeacher: true, defaultValue: 50, order: 3 },
          { id: 'chiefGuest', labelGuj: 'મુખ્ય અતિથિશ્રીઓ', type: 'text', required: false, editableByTeacher: true, order: 4 }
        ]
      },
      {
        id: 'sec_event_summary',
        titleGuj: '૨. કાર્યક્રમ સંક્ષિપ્ત વિગત અને અહેવાલ',
        order: 2,
        fields: [
          { id: 'eventSummary', labelGuj: 'કાર્યક્રમની વિગતવાર માહિતી', type: 'multiline', required: true, editableByTeacher: true, order: 1 },
          { id: 'outcomes', labelGuj: 'પ્રાપ્ત થયેલ પરિણામો / લાભ', type: 'multiline', required: false, editableByTeacher: true, order: 2 }
        ]
      }
    ],
    autoFillMappings: [],
    requiredFields: ['eventName', 'eventDate', 'eventSummary']
  },

  // 5. School Self-Evaluation Report
  {
    templateId: 'tpl_aheval_05_self_evaluation',
    titleGuj: '🔍 શાળા સ્વમૂલ્યાંકન અહેવાલ',
    titleEng: 'School Self Evaluation Report',
    category: 'અહેવાલ',
    subCategory: 'શાળા વ્યવસ્થાપન',
    version: 1,
    status: 'published',
    sourceType: 'working-reference',
    effectiveFrom: '2026-04-01',
    orientation: 'portrait',
    pageSize: 'A4',
    margins: '10mm',
    createdDate: '2026-08-27',
    updatedDate: '2026-08-27',
    sections: [
      {
        id: 'sec_self_eval_header',
        titleGuj: '૧. સ્વમૂલ્યાંકન માહિતી',
        order: 1,
        fields: [
          { id: 'schoolName', labelGuj: 'શાળાનું નામ', type: 'school_profile', required: true, editableByTeacher: false, autoFillSource: 'school.schoolNameGuj', order: 1 },
          { id: 'evalPeriod', labelGuj: 'મૂલ્યાંકન અવધિ', type: 'text', required: true, editableByTeacher: true, defaultValue: 'વાર્ષિક ૨૦૨૬-૨૭', order: 2 }
        ]
      },
      {
        id: 'sec_domains',
        titleGuj: '૨. મુખ્ય ક્ષેત્રોમાં સ્વમૂલ્યાંકન ગ્રેડ',
        order: 2,
        fields: [
          { id: 'domain1Grade', labelGuj: 'શાળા સંસાધનો અને સુવિધાઓ', type: 'dropdown', required: true, editableByTeacher: true, options: ['ગ્રેડ A (ઉત્કૃષ્ટ)', 'ગ્રેડ B (સારું)', 'ગ્રેડ C (સુધારાપાત્ર)'], order: 1 },
          { id: 'domain2Grade', labelGuj: 'શિક્ષણ પ્રક્રિયા અને મૂલ્યાંકન', type: 'dropdown', required: true, editableByTeacher: true, options: ['ગ્રેડ A (ઉત્કૃષ્ટ)', 'ગ્રેડ B (સારું)', 'ગ્રેડ C (સુધારાપાત્ર)'], order: 2 },
          { id: 'domain3Grade', labelGuj: 'SMC ભાગીદારી અને સમુદાય સહયોગ', type: 'dropdown', required: true, editableByTeacher: true, options: ['ગ્રેડ A (ઉત્કૃષ્ટ)', 'ગ્રેડ B (સારું)', 'ગ્રેડ C (સુધારાપાત્ર)'], order: 3 },
          { id: 'overallSelfRemarks', labelGuj: 'સમગ્ર સ્વમૂલ્યાંકન નોંધ', type: 'multiline', required: false, editableByTeacher: true, order: 4 }
        ]
      }
    ],
    autoFillMappings: [{ targetFieldId: 'schoolName', sourceKey: 'school.schoolNameGuj' }],
    requiredFields: ['schoolName', 'evalPeriod']
  },

  // 6. School Development Plan Report
  {
    templateId: 'tpl_aheval_06_dev_plan',
    titleGuj: '📋 શાળા વિકાસ / વાર્ષિક આયોજન અહેવાલ',
    titleEng: 'School Development & Annual Plan Report',
    category: 'અહેવાલ',
    subCategory: 'વહીવટી',
    version: 1,
    status: 'published',
    sourceType: 'working-reference',
    effectiveFrom: '2026-04-01',
    orientation: 'portrait',
    pageSize: 'A4',
    margins: '10mm',
    createdDate: '2026-08-27',
    updatedDate: '2026-08-27',
    sections: [
      {
        id: 'sec_plan_header',
        titleGuj: '૧. વાર્ષિક આયોજન હેડર',
        order: 1,
        fields: [
          { id: 'schoolName', labelGuj: 'શાળાનું નામ', type: 'school_profile', required: true, editableByTeacher: false, autoFillSource: 'school.schoolNameGuj', order: 1 },
          { id: 'udiseCode', labelGuj: 'UDISE કોડ', type: 'udise', required: true, editableByTeacher: false, autoFillSource: 'school.udiseCode', order: 2 },
          { id: 'planYear', labelGuj: 'આયોજન વર્ષ', type: 'academic_year', required: true, editableByTeacher: false, autoFillSource: 'academicYear', order: 3 }
        ]
      },
      {
        id: 'sec_plan_targets',
        titleGuj: '૨. લક્ષ્યાંકો અને અપેક્ષિત બજેટ',
        order: 2,
        fields: [
          { id: 'infrastructureTarget', labelGuj: 'ભૌતિક સુવિધા વિકાસ લક્ષ્યાંક', type: 'multiline', required: true, editableByTeacher: true, placeholder: 'નવા શૌચાલય મકાન સફાઈ, કમ્પ્યુટર લેબ સેટઅપ...', order: 1 },
          { id: 'academicTarget', labelGuj: 'શૈક્ષણિક ગુણવત્તા લક્ષ્યાંક', type: 'multiline', required: true, editableByTeacher: true, placeholder: 'વાંચન, ગણન અને લેખન 100% સિદ્ધિ...', order: 2 },
          { id: 'estimatedBudget', labelGuj: 'અંદાજિત વાર્ષિક બજેટ (₹)', type: 'currency', required: false, editableByTeacher: true, defaultValue: 50000, order: 3 }
        ]
      }
    ],
    autoFillMappings: [
      { targetFieldId: 'schoolName', sourceKey: 'school.schoolNameGuj' },
      { targetFieldId: 'udiseCode', sourceKey: 'school.udiseCode' },
      { targetFieldId: 'planYear', sourceKey: 'academicYear' }
    ],
    requiredFields: ['schoolName', 'udiseCode', 'planYear']
  }
];

// Helper to sanitize filenames
export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9\u0A80-\u0AFF_-]/g, '_').replace(/_+/g, '_').trim();
}

// Service Methods for Templates & Documents
export const ahevalPatrakService = {
  // Configurable Sub-categories
  getSubCategories(): string[] {
    try {
      const stored = localStorage.getItem(SUBCATEGORIES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_SUBCATEGORIES;
  },

  addSubCategory(categoryName: string): string[] {
    const list = this.getSubCategories();
    if (!list.includes(categoryName)) {
      const updated = [...list, categoryName];
      localStorage.setItem(SUBCATEGORIES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }
    return list;
  },

  // Templates
  getAllTemplates(): AhevalPatrakTemplate[] {
    try {
      const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (stored) {
        const parsed: AhevalPatrakTemplate[] = JSON.parse(stored);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch {}

    // Seed defaults
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(INITIAL_SEED_TEMPLATES));
    return INITIAL_SEED_TEMPLATES;
  },

  getPublishedTemplates(): AhevalPatrakTemplate[] {
    return this.getAllTemplates().filter(t => t.status === 'published');
  },

  getTemplateById(templateId: string): AhevalPatrakTemplate | undefined {
    return this.getAllTemplates().find(t => t.templateId === templateId);
  },

  saveTemplate(template: AhevalPatrakTemplate): AhevalPatrakTemplate {
    const templates = this.getAllTemplates();
    const idx = templates.findIndex(t => t.templateId === template.templateId);

    const now = new Date().toISOString().split('T')[0];
    const updated = { ...template, updatedDate: now };

    if (idx >= 0) {
      templates[idx] = updated;
    } else {
      templates.push(updated);
    }

    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    return updated;
  },

  duplicateTemplate(templateId: string): AhevalPatrakTemplate | undefined {
    const orig = this.getTemplateById(templateId);
    if (!orig) return undefined;

    const newId = `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const copy: AhevalPatrakTemplate = {
      ...orig,
      templateId: newId,
      titleGuj: `${orig.titleGuj} (કોપી)`,
      titleEng: `${orig.titleEng} (Copy)`,
      status: 'draft',
      version: 1,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };

    return this.saveTemplate(copy);
  },

  createNewVersion(templateId: string): AhevalPatrakTemplate | undefined {
    const orig = this.getTemplateById(templateId);
    if (!orig) return undefined;

    const maxVer = this.getAllTemplates()
      .filter(t => t.titleGuj === orig.titleGuj)
      .reduce((max, t) => Math.max(max, t.version), orig.version);

    const newVersionNum = maxVer + 1;
    const newId = `tpl_${Date.now()}_v${newVersionNum}`;

    const newVersion: AhevalPatrakTemplate = {
      ...orig,
      templateId: newId,
      version: newVersionNum,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };

    return this.saveTemplate(newVersion);
  },

  publishTemplate(templateId: string): AhevalPatrakTemplate | undefined {
    const tmpl = this.getTemplateById(templateId);
    if (!tmpl) return undefined;
    tmpl.status = 'published';
    return this.saveTemplate(tmpl);
  },

  unpublishTemplate(templateId: string): AhevalPatrakTemplate | undefined {
    const tmpl = this.getTemplateById(templateId);
    if (!tmpl) return undefined;
    tmpl.status = 'draft';
    return this.saveTemplate(tmpl);
  },

  archiveTemplate(templateId: string): AhevalPatrakTemplate | undefined {
    const tmpl = this.getTemplateById(templateId);
    if (!tmpl) return undefined;
    tmpl.status = 'archived';
    return this.saveTemplate(tmpl);
  },

  // Documents (Teacher Saved Drafts & Finalized)
  getAllDocuments(): AhevalPatrakDocument[] {
    try {
      const stored = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  },

  getDocumentById(docId: string): AhevalPatrakDocument | undefined {
    return this.getAllDocuments().find(d => d.documentId === docId);
  },

  saveDocument(doc: Omit<AhevalPatrakDocument, 'documentId' | 'createdDate' | 'updatedDate'> & { documentId?: string }): AhevalPatrakDocument {
    const docs = this.getAllDocuments();
    const now = new Date().toISOString().split('T')[0];

    if (doc.documentId) {
      const idx = docs.findIndex(d => d.documentId === doc.documentId);
      if (idx >= 0) {
        const updated: AhevalPatrakDocument = {
          ...docs[idx],
          ...doc,
          documentId: doc.documentId,
          updatedDate: now
        };
        docs[idx] = updated;
        localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(docs));
        return updated;
      }
    }

    const newId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newDoc: AhevalPatrakDocument = {
      ...doc,
      documentId: newId,
      status: doc.status || 'DRAFT',
      createdDate: now,
      updatedDate: now
    };

    docs.push(newDoc);
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(docs));
    return newDoc;
  },

  finaliseDocument(docId: string): AhevalPatrakDocument | undefined {
    const doc = this.getDocumentById(docId);
    if (!doc) return undefined;
    doc.status = 'FINAL';
    return this.saveDocument(doc);
  },

  createRevisedDocument(docId: string): AhevalPatrakDocument | undefined {
    const orig = this.getDocumentById(docId);
    if (!orig) return undefined;

    return this.saveDocument({
      templateId: orig.templateId,
      templateVersion: orig.templateVersion,
      titleGuj: `${orig.titleGuj} (Revised / સુધારેલ)`,
      category: orig.category,
      subCategory: orig.subCategory,
      status: 'DRAFT',
      academicYear: orig.academicYear,
      financialYear: orig.financialYear,
      fieldValues: JSON.parse(JSON.stringify(orig.fieldValues)),
      originalDocId: orig.documentId
    });
  },

  // Auto-fill values generator from READ-ONLY sources
  generateAutoFilledValues(
    template: AhevalPatrakTemplate,
    teacher: TeacherProfile,
    rojmelEntries: RojmelEntry[]
  ): Record<string, any> {
    const values: Record<string, any> = {};

    template.sections.forEach(sec => {
      sec.fields.forEach(f => {
        if (f.autoFillSource || f.type === 'school_profile' || f.type === 'teacher_profile' || f.type === 'academic_year' || f.type === 'udise') {
          if (f.id === 'schoolName' || f.autoFillSource === 'school.schoolNameGuj') {
            values[f.id] = teacher.school.schoolNameGuj || '';
          } else if (f.id === 'udiseCode' || f.autoFillSource === 'school.udiseCode') {
            values[f.id] = teacher.school.udiseCode || '';
          } else if (f.id === 'academicYear' || f.autoFillSource === 'academicYear') {
            values[f.id] = teacher.academicYear || '2026-27';
          } else if (f.id === 'teacherName' || f.autoFillSource === 'teacher.nameGuj') {
            values[f.id] = teacher.nameGuj || '';
          } else if (f.autoFillSource === 'rojmel.closingBalance') {
            const inc = rojmelEntries.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
            const exp = rojmelEntries.filter(e => e.type !== 'income').reduce((s, e) => s + e.amount, 0);
            values[f.id] = Math.max(0, inc - exp);
          }
        } else if (f.defaultValue !== undefined) {
          values[f.id] = f.defaultValue;
        }
      });
    });

    return values;
  }
};

/**
 * PDF Generator for Aheval and Patrak documents.
 */
export async function downloadAhevalPatrakPDF(
  containerEl: HTMLElement,
  titleGuj: string,
  category: string,
  academicYear: string,
  orientation: 'portrait' | 'landscape' = 'portrait'
): Promise<{ success: boolean; error?: string; pdfBlob?: Blob }> {
  const isLandscape = orientation === 'landscape';
  const fileName = `ShalaSarathi_${sanitizeFileName(category)}_${sanitizeFileName(titleGuj)}_${sanitizeFileName(academicYear)}.pdf`;

  try {
    const canvas = await html2canvas(containerEl, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = isLandscape ? 297 : 210;
    const pdfHeight = isLandscape ? 210 : 297;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    const pdfBlob = pdf.output('blob');

    pdf.save(fileName);
    return { success: true, pdfBlob };
  } catch (err: any) {
    console.error('PDF Generation Error:', err);
    return { success: false, error: err.message || 'PDF બનાવવામાં અણધારી ભૂલ.' };
  }
}
