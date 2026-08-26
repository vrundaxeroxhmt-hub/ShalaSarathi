export type DocumentCategory = 'Patrak' | 'Aheval' | 'Rojmel' | 'Voucher' | 'Paper';
export type DocumentStatus = 'draft' | 'completed';

export interface SavedDocumentItem {
  id: string;
  category: DocumentCategory;
  titleGuj: string;
  subtitleGuj?: string;
  status: DocumentStatus;
  isFavorite?: boolean;
  versionCode?: string;
  createdAt: string;
  updatedAt: string;
  payload: any;
}
