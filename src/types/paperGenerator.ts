export type PaperType = 'Question Paper' | 'Worksheet' | 'Notice' | 'Certificate' | 'Letter';

export interface PaperTemplate {
  id: string;
  type: PaperType;
  titleGuj: string;
  titleEng: string;
  descriptionGuj: string;
  standardGuj?: string;
  subjectGuj?: string;
  totalMarks?: number;
  timeDurationGuj?: string;
  sectionsGuj: {
    headingGuj: string;
    questionsGuj: string[];
  }[];
  isPremium?: boolean;
}
