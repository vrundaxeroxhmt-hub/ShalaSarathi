export interface AhevalSection {
  id: string;
  titleGuj: string;
  masterContentGuj: string; // Admin created text
  teacherCustomGuj?: string; // Voice/typed custom content
  photos?: string[];
}

export interface AhevalTemplate {
  id: string;
  titleGuj: string;
  titleEng: string;
  category: 'Event Aheval' | 'Celebration' | 'School Inspection' | 'Workshop' | 'SMC Meeting';
  sections: AhevalSection[];
  version: number;
}

export interface AhevalDocument {
  id: string;
  templateId: string;
  teacherId: string;
  titleGuj: string;
  eventDate: string;
  sections: AhevalSection[];
  photos: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
}
