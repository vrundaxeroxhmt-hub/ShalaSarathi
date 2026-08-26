export type TransactionType = 'income' | 'expense' | 'purchase';

export type PaymentMode = 'Cash' | 'Bank' | 'UPI' | 'Cheque' | 'Other';

export type RojmelCategory = 
  | 'Stationery' 
  | 'Equipment' 
  | 'Repair & Maintenance' 
  | 'Electricity' 
  | 'Water' 
  | 'Cleaning' 
  | 'Teaching Material' 
  | 'Sports' 
  | 'Library' 
  | 'Other';

export const PAYMENT_MODE_LABELS: Record<PaymentMode, { guj: string; eng: string }> = {
  Cash: { guj: 'રોકડ (Cash)', eng: 'Cash' },
  Bank: { guj: 'બેંક ટ્રાન્સફર / NetBanking', eng: 'Bank Transfer' },
  UPI: { guj: 'UPI / ક્યુઆર કોડ', eng: 'UPI' },
  Cheque: { guj: 'ચેક (Cheque)', eng: 'Cheque' },
  Other: { guj: 'અન્ય (Other)', eng: 'Other' },
};

export const CATEGORY_LABELS: Record<RojmelCategory, { guj: string; eng: string }> = {
  Stationery: { guj: 'સ્ટેશનરી (Stationery)', eng: 'Stationery' },
  Equipment: { guj: 'સાધન / ઉપકરણ (Equipment)', eng: 'Equipment' },
  'Repair & Maintenance': { guj: 'રિપેરિંગ અને નિભાવ (Repair)', eng: 'Repair' },
  Electricity: { guj: 'વીજળી બિલ (Electricity)', eng: 'Electricity' },
  Water: { guj: 'પીવાનું પાણી (Water)', eng: 'Water' },
  Cleaning: { guj: 'સફાઇ ખર્ચ (Cleaning)', eng: 'Cleaning' },
  'Teaching Material': { guj: 'શૈક્ષણિક સાધન (TLM)', eng: 'Teaching Material' },
  Sports: { guj: 'રમતગમત (Sports)', eng: 'Sports' },
  Library: { guj: 'લાઇબ્રેરી પુસ્તકો (Library)', eng: 'Library' },
  Other: { guj: 'અન્ય ખર્ચ (Other)', eng: 'Other' },
};

export interface PackageRojmelQuota {
  packageId: 'basic' | 'pro' | 'premium';
  packageNameGuj: string;
  packageNameEng: string;
  maxRojmelAllowed: number;
}

export interface RojmelAccountSetup {
  id: string;
  schoolNameGuj: string;
  schoolNameEng: string;
  rojmelNameGuj: string;
  rojmelNameEng: string;
  financialYear: string; // e.g. "2026-27"
  bankName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  openingBalance: number;
  isLocked: boolean;
  editRequestStatus: 'none' | 'requested' | 'released_once';
  editRequestReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeadItem {
  id: string;
  headNameGuj: string;
  headNameEng: string;
  grantCategory: string; // e.g. "Composite School Grant", "TLM Grant", "Sports Grant"
  grantLimit: number;
  financialYear: string;
  overspentAllowed: boolean; // YES = true, NO = false
  createdAt: string;
  updatedAt: string;
}

export interface GrantHeadStatus {
  financialYear: string;
  grantCategory: string;
  headId: string;
  headNameGuj: string;
  headNameEng: string;
  limit: number;
  usedAmount: number;
  remainingAmount: number;
  overspentAmount: number;
  overspentAllowed: boolean;
}

export interface DeadStockItem {
  id: string;
  itemNameGuj: string;
  itemNameEng: string;
  purchaseDate: string;
  amount: number;
  quantity: number;
  category: RojmelCategory;
  sourceRojmelEntryId?: string;
  voucherRef?: string;
  billNo?: string;
  remarksGuj?: string;
  createdAt: string;
}

export interface RojmelEntry {
  id: string;
  rojmelSetupId?: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  headId?: string;
  headNameGuj?: string;
  particularGuj: string;
  particularEng?: string;
  amount: number;
  quantity?: number;
  paymentMode: PaymentMode;
  category: RojmelCategory;
  balanceAfter: number;
  remarksGuj?: string;
  voucherNo?: string;
  voucherGeneratedId?: string;
  billImageBase64?: string;
  billFileName?: string;
  isDeadStockLinked?: boolean;
  linkedDeadStockId?: string;
  templateVersionId?: string;
  createdAt: string;
}

export interface RojmelSummary {
  openingBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalPurchase: number;
  closingBalance: number;
}

export interface MonthlyRojmelSummary {
  monthKey: string; // YYYY-MM
  monthNameGuj: string;
  monthNameEng: string;
  openingBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalPurchase: number;
  closingBalance: number;
  transactionCount: number;
}

export interface YearlyRojmelSummary {
  academicYear: string;
  openingBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalPurchase: number;
  closingBalance: number;
  monthlyBreakdown: MonthlyRojmelSummary[];
}

export interface GovernmentPatrakTemplate {
  templateId: string;
  templateCode: string; // PRI-01 to PRI-12, Parishisht-01..04
  titleGuj: string;
  titleEng: string;
  category: 'PRI' | 'Parishisht' | 'SchoolAccount';
  version: number;
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo?: string; // YYYY-MM-DD if superseded
  requiredFields: Array<{
    fieldKey: string;
    labelGuj: string;
    labelEng: string;
    type: 'text' | 'number' | 'date';
  }>;
  status: 'active' | 'superseded';
  createdAt: string;
  updatedAt: string;
}

export interface RojmelBackupData {
  version: string;
  timestamp: string;
  openingBalance: number;
  setup?: RojmelAccountSetup;
  setupsList?: RojmelAccountSetup[];
  headsList?: HeadItem[];
  entries: RojmelEntry[];
  deadStockItems: DeadStockItem[];
  metadata: {
    appName: string;
    totalEntries: number;
    totalDeadStock: number;
    totalHeads: number;
  };
}
