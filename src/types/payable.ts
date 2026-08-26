export type PayableStatus = 'unpaid' | 'partially_paid' | 'paid' | 'overdue';

export type PayablePaymentMode = 'Cash' | 'Bank' | 'UPI' | 'Cheque' | 'Other';

export const PAYABLE_STATUS_LABELS: Record<PayableStatus, { guj: string; eng: string; color: string }> = {
  unpaid: { guj: 'બાકી (Unpaid)', eng: 'Unpaid', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  partially_paid: { guj: 'આંશિક ચુકવેલ (Partially Paid)', eng: 'Partially Paid', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  paid: { guj: 'સંપૂર્ણ ચુકવેલ (Paid)', eng: 'Paid', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  overdue: { guj: 'સમયમર્યાદા પૂર્ણ (Overdue)', eng: 'Overdue', color: 'bg-rose-100 text-rose-900 border-rose-300' }
};

export const PAYABLE_PAYMENT_MODE_LABELS: Record<PayablePaymentMode, { guj: string; eng: string }> = {
  Cash: { guj: 'રોકડ (Cash)', eng: 'Cash' },
  Bank: { guj: 'બેંક ટ્રાન્સફર / NetBanking', eng: 'Bank Transfer' },
  UPI: { guj: 'UPI / ક્યુઆર કોડ', eng: 'UPI' },
  Cheque: { guj: 'ચેક (Cheque)', eng: 'Cheque' },
  Other: { guj: 'અન્ય (Other)', eng: 'Other' }
};

export interface Supplier {
  id: string;
  nameGuj: string;
  nameEng?: string;
  mobile: string;
  addressGuj?: string;
  addressEng?: string;
  notesGuj?: string;
  createdAt: string;
}

export interface PayablePayment {
  id: string;
  payableId: string;
  paymentDate: string; // YYYY-MM-DD
  amount: number;
  paymentMode: PayablePaymentMode;
  referenceNo?: string;
  remarksGuj?: string;
  paymentProofBase64?: string;
  createdAt: string;
}

export interface PayableItem {
  id: string;
  supplierId: string;
  supplierNameGuj: string;
  supplierMobile?: string;
  billNumber: string;
  purchaseDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  financialYear: string; // e.g. "2026-27"
  headId?: string;
  headNameGuj?: string;
  particularGuj: string;
  quantity?: number;
  unit?: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: PayableStatus;
  billImageBase64?: string;
  billFileName?: string;
  remarksGuj?: string;
  payments: PayablePayment[];
  createdAt: string;
  updatedAt: string;
}

export interface SupplierSummary {
  supplierId: string;
  supplierNameGuj: string;
  supplierMobile?: string;
  totalBillsCount: number;
  totalAmount: number;
  totalPaid: number;
  totalOutstanding: number;
  overdueCount: number;
}

export interface HeadPayableSummary {
  headId: string;
  headNameGuj: string;
  totalPayableCount: number;
  totalAmount: number;
  totalPaid: number;
  totalOutstanding: number;
}

export interface MonthlyPayableSummary {
  monthKey: string; // YYYY-MM
  monthNameGuj: string;
  totalCreditPurchases: number;
  totalPayments: number;
  totalOutstanding: number;
  count: number;
}

export interface YearlyPayableSummary {
  financialYear: string;
  totalCreditPurchases: number;
  totalPayments: number;
  totalOutstanding: number;
  monthlyBreakdown: MonthlyPayableSummary[];
}

export interface PayableBackupData {
  version: string;
  timestamp: string;
  suppliers: Supplier[];
  payables: PayableItem[];
  metadata: {
    appName: string;
    totalSuppliers: number;
    totalPayables: number;
    totalOutstandingAmount: number;
  };
}
