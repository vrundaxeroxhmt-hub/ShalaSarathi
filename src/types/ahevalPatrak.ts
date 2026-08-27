export type AhevalPatrakCategory = 'અહેવાલ' | 'પત્રક';

export type SubCategoryOption =
  | 'નાણાકીય'
  | 'શૈક્ષણિક'
  | 'વહીવટી'
  | 'વિદ્યાર્થી'
  | 'શાળા વ્યવસ્થાપન'
  | 'ગ્રાન્ટ'
  | 'SMC'
  | 'અન્ય';

export type FieldType =
  | 'text'
  | 'multiline'
  | 'number'
  | 'currency'
  | 'date'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'yes_no'
  | 'table'
  | 'signature'
  | 'image'
  | 'school_profile'
  | 'teacher_profile'
  | 'academic_year'
  | 'financial_year'
  | 'udise'
  | 'address'
  | 'rojmel_mapped';

export interface TableColumnConfig {
  key: string;
  labelGuj: string;
  labelEng?: string;
  type?: 'text' | 'number' | 'currency' | 'date';
  width?: string;
}

export interface TemplateField {
  id: string;
  labelGuj: string;
  labelEng?: string;
  type: FieldType;
  required: boolean;
  editableByTeacher: boolean;
  autoFillSource?: string;
  defaultValue?: any;
  validation?: string;
  placeholder?: string;
  order: number;
  options?: string[]; // for dropdown, radio, checkbox
  columns?: TableColumnConfig[]; // for table field type
}

export interface TemplateSection {
  id: string;
  titleGuj: string;
  titleEng?: string;
  order: number;
  fields: TemplateField[];
}

export interface AutoFillMappingConfig {
  targetFieldId: string;
  sourceKey: string; // e.g. 'school.schoolNameGuj', 'school.udiseCode', 'rojmel.closingBalance', etc.
}

export interface AhevalPatrakTemplate {
  templateId: string;
  titleGuj: string;
  titleEng: string;
  category: AhevalPatrakCategory;
  subCategory: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  sourceType: 'official-reference' | 'working-reference';
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo?: string; // YYYY-MM-DD
  orientation: 'portrait' | 'landscape';
  pageSize: 'A4';
  margins: string; // e.g. '10mm'
  sections: TemplateSection[];
  autoFillMappings: AutoFillMappingConfig[];
  requiredFields: string[];
  createdDate: string;
  updatedDate: string;
}

export interface AhevalPatrakDocument {
  documentId: string;
  templateId: string;
  templateVersion: number;
  titleGuj: string;
  category: AhevalPatrakCategory;
  subCategory: string;
  status: 'DRAFT' | 'FINAL' | 'REVISED';
  academicYear: string;
  financialYear: string;
  fieldValues: Record<string, any>;
  createdDate: string;
  updatedDate: string;
  originalDocId?: string; // linkage for revised document versions
}
