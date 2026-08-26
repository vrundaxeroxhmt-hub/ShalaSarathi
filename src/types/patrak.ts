export type PatrakFieldType = 
  | 'text' 
  | 'textarea'
  | 'heading' 
  | 'table' 
  | 'date' 
  | 'teacher_details' 
  | 'school_details' 
  | 'signature' 
  | 'photo' 
  | 'photo_multiple' 
  | 'checkbox' 
  | 'yes_no' 
  | 'number' 
  | 'select'
  | 'multiselect'
  | 'paragraph' 
  | 'custom';

export interface PatrakField {
  id: string;
  labelGuj: string;
  labelEng: string;
  type: PatrakFieldType;
  required?: boolean;
  defaultValue?: string | number | boolean;
  options?: string[];
  placeholder?: string;
  autoFillSource?: 'teacherName' | 'schoolName' | 'udiseCode' | 'taluka' | 'district' | 'designation' | 'academicYear';
}

export type PatrakVersionCode = 'Version A' | 'Version B' | 'Version C';

export interface PatrakVersionConfig {
  versionCode: PatrakVersionCode;
  titleGuj: string;
  descriptionGuj: string;
  headerStyle: 'standard' | 'government_seal' | 'compact_badge';
  photoPlacement: 'top_right' | 'top_center' | 'footer' | 'none';
  columnLayout: 'single' | 'double' | 'grid';
  isPremium?: boolean;
}

export interface PatrakTemplate {
  id: string;
  patrakNumber: number; // e.g. Patrak 1 to 73
  titleGuj: string;
  titleEng: string;
  category: 'Gunotsav' | 'NIPUN Bharat' | 'SCE Evaluation' | 'School Administration' | 'Mid-day Meal';
  descriptionGuj: string;
  versions: PatrakVersionConfig[];
  fields: PatrakField[];
  isPremium?: boolean;
  isFavorite?: boolean;
  version: number;
}

export interface PatrakDocument {
  id: string;
  templateId: string;
  patrakNumber: number;
  selectedVersion: PatrakVersionCode;
  teacherId: string;
  schoolId?: string;
  titleGuj: string;
  formData: Record<string, any>;
  photoUrls: string[];
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
}
