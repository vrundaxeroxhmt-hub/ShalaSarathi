export type ParishishtNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface DataMappingConfig {
  sourceKey: string;
  targetField: string;
  transformRule?: string;
}

export interface TemplateColumn {
  key: string;
  labelGuj: string;
  labelEng?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TemplateSection {
  id: string;
  titleGuj: string;
  titleEng?: string;
  type: 'header' | 'jama_udhar_dual' | 'table' | 'summary_box' | 'signature_block';
  columns?: TemplateColumn[];
}

export interface ParishishtTemplate {
  templateId: string;
  parishishtNo: ParishishtNumber;
  nameGuj: string;
  nameEng: string;
  descriptionGuj: string;
  version: number;
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo?: string; // YYYY-MM-DD
  status: 'verified' | 'pending_verification';
  source: string;
  lastVerified: string;
  pageSize: 'A4';
  orientation: 'portrait' | 'landscape';
  isOfficialVerified?: boolean;
  verificationNoteGuj?: string;
  sections: TemplateSection[];
  dataMappings: DataMappingConfig[];
  requiredFields?: string[];
}

export interface ParishishtRenderOptions {
  documentDate: string;
  forcedVersion?: number;
  orientation?: 'landscape' | 'portrait';
}

export interface ParishishtDocumentSnapshot {
  templateId: string;
  parishishtNo: ParishishtNumber;
  templateVersion: number;
  documentDate: string;
  generatedAt: string;
  sourceDataSnapshot: {
    schoolNameGuj: string;
    udiseCode: string;
    academicYear: string;
    financialYear: string;
    totalEntriesCount: number;
    totalIncomeAmount: number;
    totalExpenseAmount: number;
    closingBalance: number;
  };
}
