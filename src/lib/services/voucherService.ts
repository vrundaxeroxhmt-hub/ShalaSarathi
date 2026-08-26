import { Voucher, VoucherBackupData, VOUCHER_TYPE_LABELS, VOUCHER_PAYMENT_MODE_LABELS } from '@/types/voucher';
import { formatGujaratiDate } from './rojmelService';

/**
 * Generates sequential, non-duplicating Voucher numbers per Academic Year.
 * Pattern: VCH-YYYY-0001, VCH-YYYY-0002...
 */
export function generateNextVoucherNumber(
  existingVouchers: Voucher[],
  academicYear: string = '2026-27'
): string {
  const yearPrefix = academicYear.split('-')[0] || new Date().getFullYear().toString();
  const prefix = `VCH-${yearPrefix}-`;

  const numbersInYear = existingVouchers
    .map(v => v.voucherNo || '')
    .filter(no => no.startsWith(prefix))
    .map(no => {
      const parts = no.split('-');
      const lastPart = parts[parts.length - 1];
      const num = parseInt(lastPart, 10);
      return isNaN(num) ? 0 : num;
    });

  const maxNum = numbersInYear.length > 0 ? Math.max(...numbersInYear) : 0;
  const nextNum = maxNum + 1;
  const padded = String(nextNum).padStart(4, '0');

  return `${prefix}${padded}`;
}

/**
 * Converts numeric amount (INR) to formal Gujarati words.
 * Example: 14500 => "અક્ષરે રૂપિયા ચૌદ હજાર પાંચસો પુરા"
 */
export function convertAmountToGujaratiWords(num: number): string {
  if (isNaN(num) || num <= 0) return 'અક્ષરે રૂપિયા શૂન્ય પુરા';

  const units = ['', 'એક', 'બે', 'ત્રણ', 'ચાર', 'પાંચ', 'છ', 'સાત', 'આઠ', 'નવ'];
  const teens = ['દસ', 'અગિયાર', 'બાર', 'તેર', 'ચૌદ', 'પંદર', 'સોળ', 'સત્તર', 'અઢાર', 'ઓગણીસ'];
  const tens = ['', '', 'વીસ', 'ત્રીસ', 'ચાલીસ', 'પચાસ', 'સાઠ', 'સિત્તેર', 'એંસી', 'નેવુ'];

  function convertTwoDigits(n: number): string {
    if (n < 10) return units[n];
    if (n >= 10 && n < 20) return teens[n - 10];
    const tenDigit = Math.floor(n / 10);
    const unitDigit = n % 10;
    return `${tens[tenDigit]} ${units[unitDigit]}`.trim();
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let str = '';
    if (hundred > 0) {
      str += `${units[hundred]} સો `;
    }
    if (rest > 0) {
      str += convertTwoDigits(rest);
    }
    return str.trim();
  }

  let amountStr = '';
  const crore = Math.floor(num / 10000000);
  let rem = num % 10000000;

  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;

  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;

  if (crore > 0) {
    amountStr += `${convertTwoDigits(crore)} કરોડ `;
  }
  if (lakh > 0) {
    amountStr += `${convertTwoDigits(lakh)} લાખ `;
  }
  if (thousand > 0) {
    amountStr += `${convertTwoDigits(thousand)} હજાર `;
  }
  if (rem > 0) {
    amountStr += convertThreeDigits(rem);
  }

  return `અક્ષરે રૂપિયા ${amountStr.trim()} પુરા`;
}

/**
 * Exports JSON Backup for Voucher module.
 */
export function exportVoucherBackup(vouchers: Voucher[]): void {
  const totalAmount = vouchers.reduce((sum, v) => sum + v.amount, 0);

  const backupData: VoucherBackupData = {
    version: '2.0',
    timestamp: new Date().toISOString(),
    vouchers,
    metadata: {
      appName: 'ShalaSarathi v2 Voucher Module',
      totalVouchers: vouchers.length,
      totalAmount
    }
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `ShalaSarathi_Voucher_Backup_${today}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports UTF-8 BOM CSV for Voucher Ledger.
 */
export function exportVoucherCSV(vouchers: Voucher[]): void {
  const headers = [
    'Voucher No / વાઉચર નંબર',
    'Date / તારીખ',
    'Voucher Type / પ્રકાર',
    'Payee Name / નાણાં મેળવનાર',
    'Particulars / વિગત',
    'Amount / રકમ (INR)',
    'Amount in Words / રકમ અક્ષરે',
    'Grant Head / હેડ',
    'Payment Mode / મોડ',
    'Bill No / બિલ નંબર',
    'Remarks / નોંધ'
  ];

  const rows = vouchers.map(v => [
    v.voucherNo || '-',
    formatGujaratiDate(v.date),
    `"${(VOUCHER_TYPE_LABELS[v.voucherType]?.guj || v.voucherType || 'Expense').replace(/"/g, '""')}"`,
    `"${(v.payeeNameGuj || '').replace(/"/g, '""')}"`,
    `"${(v.particularGuj || '').replace(/"/g, '""')}"`,
    v.amount,
    `"${(v.amountInWordsGuj || '').replace(/"/g, '""')}"`,
    `"${(v.grantTypeGuj || '-').replace(/"/g, '""')}"`,
    `"${(VOUCHER_PAYMENT_MODE_LABELS[v.paymentMode]?.guj || v.paymentMode).replace(/"/g, '""')}"`,
    v.billNumber || '-',
    `"${(v.remarksGuj || '').replace(/"/g, '""')}"`
  ]);

  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `ShalaSarathi_Voucher_Ledger_${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Validates and parses uploaded JSON backup file safely.
 */
export function validateAndParseVoucherBackup(jsonStr: string): {
  isValid: boolean;
  data?: VoucherBackupData;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonStr);

    if (!parsed || typeof parsed !== 'object') {
      return { isValid: false, error: 'અમાન્ય ફાઇલો (Not a valid JSON object).' };
    }

    if (!Array.isArray(parsed.vouchers)) {
      return { isValid: false, error: 'બેકઅપ ફાઇલમાં વાઉચર રેકોર્ડ મળતા નથી (Missing vouchers array).' };
    }

    for (const v of parsed.vouchers) {
      if (!v.id || !v.voucherNo || typeof v.amount !== 'number') {
        return { isValid: false, error: 'ખરાબ અથવા અપૂર્ણ વાઉચર રેકોર્ડ (Corrupted voucher record).' };
      }
    }

    return {
      isValid: true,
      data: parsed as VoucherBackupData
    };
  } catch {
    return { isValid: false, error: 'JSON પારસિંગ ભૂલ (Invalid JSON syntax).' };
  }
}
