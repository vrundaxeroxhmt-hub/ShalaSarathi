export type VoucherType = 'expense' | 'purchase' | 'other_payment' | 'receipt';

export type VoucherPaymentMode = 'Cash' | 'Bank' | 'UPI' | 'Cheque' | 'Other';

export const VOUCHER_TYPE_LABELS: Record<VoucherType, { guj: string; eng: string; color: string }> = {
  expense: { guj: 'ખર્ચ વાઉચર (Expense)', eng: 'Expense Voucher', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  purchase: { guj: 'ખરીદી વાઉચર (Purchase)', eng: 'Purchase Voucher', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  other_payment: { guj: 'અન્ય ચુકવણી વાઉચર (Other Payment)', eng: 'Other Payment Voucher', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  receipt: { guj: 'આવક રસીદ / પહોંચ (Receipt)', eng: 'Income Receipt', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' }
};

export const VOUCHER_PAYMENT_MODE_LABELS: Record<VoucherPaymentMode, { guj: string; eng: string }> = {
  Cash: { guj: 'રોકડ (Cash)', eng: 'Cash' },
  Bank: { guj: 'બેંક ટ્રાન્સફર / NetBanking', eng: 'Bank Transfer' },
  UPI: { guj: 'UPI / ક્યુઆર કોડ', eng: 'UPI' },
  Cheque: { guj: 'ચેક (Cheque)', eng: 'Cheque' },
  Other: { guj: 'અન્ય (Other)', eng: 'Other' }
};

export interface Voucher {
  id: string;
  voucherNo: string; // e.g. "VCH-2026-0001"
  voucherType: VoucherType;
  date: string; // YYYY-MM-DD
  schoolNameGuj: string;
  udiseCode: string;
  academicYear: string;
  payeeNameGuj: string;
  payeeMobile?: string;
  particularGuj: string;
  amount: number;
  amountInWordsGuj: string;
  headId?: string;
  grantTypeGuj?: string; // e.g. Composite School Grant, Sports Grant
  paymentMode: VoucherPaymentMode;
  billNumber?: string;
  remarksGuj?: string;
  billImageBase64?: string;
  billFileName?: string;
  sourceRojmelEntryId?: string;
  sourcePayableId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VoucherBackupData {
  version: string;
  timestamp: string;
  vouchers: Voucher[];
  metadata: {
    appName: string;
    totalVouchers: number;
    totalAmount: number;
  };
}
