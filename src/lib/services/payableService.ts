import { 
  PayableItem, 
  PayablePayment, 
  Supplier, 
  PayableStatus, 
  SupplierSummary, 
  HeadPayableSummary, 
  MonthlyPayableSummary, 
  YearlyPayableSummary, 
  PayableBackupData,
  PAYABLE_STATUS_LABELS,
  PAYABLE_PAYMENT_MODE_LABELS
} from '@/types/payable';
import { GUJARATI_MONTH_NAMES, formatGujaratiDate } from './rojmelService';

/**
 * Pure function to calculate dynamic Payable Status.
 * Formula:
 * 1. Remaining = Total Amount - Paid Amount
 * 2. If Remaining === 0 => 'paid'
 * 3. Else if Today > Due Date AND Remaining > 0 => 'overdue'
 * 4. Else if Paid Amount > 0 => 'partially_paid'
 * 5. Else => 'unpaid'
 */
export function calculatePayableStatus(
  totalAmount: number,
  paidAmount: number,
  dueDate: string,
  todayStr: string = new Date().toISOString().split('T')[0]
): PayableStatus {
  const remaining = Math.max(0, totalAmount - paidAmount);

  if (remaining === 0) {
    return 'paid';
  }

  if (dueDate && todayStr > dueDate && remaining > 0) {
    return 'overdue';
  }

  if (paidAmount > 0) {
    return 'partially_paid';
  }

  return 'unpaid';
}

/**
 * Computes paid amount, remaining amount, and status for a Payable record based on its payments.
 */
export function computePayableItemBalances(
  payable: PayableItem,
  todayStr: string = new Date().toISOString().split('T')[0]
): PayableItem {
  const payments = Array.isArray(payable.payments) ? payable.payments : [];
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = Math.max(0, payable.totalAmount - paidAmount);
  const status = calculatePayableStatus(payable.totalAmount, paidAmount, payable.dueDate, todayStr);

  return {
    ...payable,
    payments,
    paidAmount,
    remainingAmount,
    status
  };
}

/**
 * Computes Supplier-wise Outstanding breakdown totals.
 */
export function computeSupplierSummaries(
  payables: PayableItem[],
  suppliers: Supplier[]
): SupplierSummary[] {
  const map: Record<string, SupplierSummary> = {};

  for (const s of suppliers) {
    map[s.id] = {
      supplierId: s.id,
      supplierNameGuj: s.nameGuj,
      supplierMobile: s.mobile,
      totalBillsCount: 0,
      totalAmount: 0,
      totalPaid: 0,
      totalOutstanding: 0,
      overdueCount: 0
    };
  }

  for (const p of payables) {
    const computed = computePayableItemBalances(p);
    if (!map[p.supplierId]) {
      map[p.supplierId] = {
        supplierId: p.supplierId,
        supplierNameGuj: p.supplierNameGuj,
        supplierMobile: p.supplierMobile,
        totalBillsCount: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalOutstanding: 0,
        overdueCount: 0
      };
    }

    const item = map[p.supplierId];
    item.totalBillsCount += 1;
    item.totalAmount += computed.totalAmount;
    item.totalPaid += computed.paidAmount;
    item.totalOutstanding += computed.remainingAmount;
    if (computed.status === 'overdue') {
      item.overdueCount += 1;
    }
  }

  return Object.values(map).sort((a, b) => b.totalOutstanding - a.totalOutstanding);
}

/**
 * Computes Head-wise Outstanding breakdown totals.
 */
export function computeHeadPayableSummaries(payables: PayableItem[]): HeadPayableSummary[] {
  const map: Record<string, HeadPayableSummary> = {};

  for (const p of payables) {
    const computed = computePayableItemBalances(p);
    const key = p.headId || p.headNameGuj || 'General';
    const name = p.headNameGuj || 'સામાન્ય ખર્ચ હેડ';

    if (!map[key]) {
      map[key] = {
        headId: key,
        headNameGuj: name,
        totalPayableCount: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalOutstanding: 0
      };
    }

    const item = map[key];
    item.totalPayableCount += 1;
    item.totalAmount += computed.totalAmount;
    item.totalPaid += computed.paidAmount;
    item.totalOutstanding += computed.remainingAmount;
  }

  return Object.values(map).sort((a, b) => b.totalOutstanding - a.totalOutstanding);
}

/**
 * Computes Monthly Payable Summaries.
 */
export function computeMonthlyPayableSummaries(payables: PayableItem[]): MonthlyPayableSummary[] {
  const monthlyMap: Record<string, { purchases: number; payments: number; count: number }> = {};

  for (const p of payables) {
    const computed = computePayableItemBalances(p);
    const monthKey = p.purchaseDate.substring(0, 7);

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { purchases: 0, payments: 0, count: 0 };
    }

    monthlyMap[monthKey].purchases += computed.totalAmount;
    monthlyMap[monthKey].payments += computed.paidAmount;
    monthlyMap[monthKey].count += 1;
  }

  const monthKeys = Object.keys(monthlyMap).sort();
  const result: MonthlyPayableSummary[] = [];

  for (const k of monthKeys) {
    const item = monthlyMap[k];
    const monthCode = k.split('-')[1];
    const monthNameGuj = GUJARATI_MONTH_NAMES[monthCode] || k;

    result.push({
      monthKey: k,
      monthNameGuj,
      totalCreditPurchases: item.purchases,
      totalPayments: item.payments,
      totalOutstanding: Math.max(0, item.purchases - item.payments),
      count: item.count
    });
  }

  return result.reverse();
}

/**
 * Computes Yearly Payable Summary.
 */
export function computeYearlyPayableSummary(
  payables: PayableItem[],
  financialYear: string = '2026-27'
): YearlyPayableSummary {
  const fyPayables = payables.filter(p => p.financialYear === financialYear);
  const monthlyBreakdown = computeMonthlyPayableSummaries(fyPayables);

  let purchases = 0;
  let payments = 0;

  for (const p of fyPayables) {
    const computed = computePayableItemBalances(p);
    purchases += computed.totalAmount;
    payments += computed.paidAmount;
  }

  return {
    financialYear,
    totalCreditPurchases: purchases,
    totalPayments: payments,
    totalOutstanding: Math.max(0, purchases - payments),
    monthlyBreakdown
  };
}

/**
 * Validates whether a payment amount is valid and <= remainingAmount.
 */
export function validatePaymentAmount(
  remainingAmount: number,
  paymentAmount: number
): { valid: boolean; errorMsgGuj?: string } {
  if (isNaN(paymentAmount) || paymentAmount <= 0) {
    return { valid: false, errorMsgGuj: 'કૃપા કરીને માન્ય ધનાત્મક રકમ દાખલ કરો.' };
  }

  if (paymentAmount > remainingAmount) {
    return { 
      valid: false, 
      errorMsgGuj: `ચુકવણી રકમ (₹${paymentAmount.toLocaleString('en-IN')}) બાકી રકમ (₹${remainingAmount.toLocaleString('en-IN')}) કરતાં વધુ હોઈ શકે નહીં.` 
    };
  }

  return { valid: true };
}

/**
 * Validates whether a new Total Amount during edit is >= already Paid Amount.
 */
export function validateTotalAmountEdit(
  currentPaidAmount: number,
  newTotalAmount: number
): { valid: boolean; errorMsgGuj?: string } {
  if (isNaN(newTotalAmount) || newTotalAmount <= 0) {
    return { valid: false, errorMsgGuj: 'કૃપા કરીને માન્ય કુલ રકમ દાખલ કરો.' };
  }

  if (newTotalAmount < currentPaidAmount) {
    return {
      valid: false,
      errorMsgGuj: `કુલ રકમ (₹${newTotalAmount.toLocaleString('en-IN')}) પહેલેથી ચુકવેલ રકમ (₹${currentPaidAmount.toLocaleString('en-IN')}) કરતાં ઓછી કરી શકાય નહીં.`
    };
  }

  return { valid: true };
}

/**
 * Exports JSON Backup file for Payable module.
 */
export function exportPayableBackup(payables: PayableItem[], suppliers: Supplier[]): void {
  const totalOutstandingAmount = payables.reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0);

  const backupData: PayableBackupData = {
    version: '2.0',
    timestamp: new Date().toISOString(),
    suppliers,
    payables,
    metadata: {
      appName: 'ShalaSarathi v2 Payable System',
      totalSuppliers: suppliers.length,
      totalPayables: payables.length,
      totalOutstandingAmount
    }
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `ShalaSarathi_Payable_Backup_${today}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports Excel-compatible UTF-8 BOM CSV file for Payable Ledger.
 */
export function exportPayableCSV(payables: PayableItem[]): void {
  const headers = [
    'Purchase Date / ખરીદી તારીખ',
    'Due Date / મુદત તારીખ',
    'Supplier / વેપારી',
    'Bill No / બિલ નં',
    'Head / હેડ',
    'Particulars / વિગત',
    'Total Amount / કુલ રકમ (INR)',
    'Paid Amount / ચુકવેલ રકમ (INR)',
    'Remaining / બાકી રકમ (INR)',
    'Status / સ્થિતિ',
    'Remarks / નોંધ'
  ];

  const rows = payables.map(p => {
    const computed = computePayableItemBalances(p);
    return [
      formatGujaratiDate(p.purchaseDate),
      formatGujaratiDate(p.dueDate),
      `"${(p.supplierNameGuj || '').replace(/"/g, '""')}"`,
      p.billNumber || '-',
      `"${(p.headNameGuj || '-').replace(/"/g, '""')}"`,
      `"${(p.particularGuj || '').replace(/"/g, '""')}"`,
      computed.totalAmount,
      computed.paidAmount,
      computed.remainingAmount,
      `"${(PAYABLE_STATUS_LABELS[computed.status]?.guj || computed.status).replace(/"/g, '""')}"`,
      `"${(p.remarksGuj || '').replace(/"/g, '""')}"`
    ];
  });

  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `ShalaSarathi_Payable_Ledger_${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Validates and parses uploaded JSON backup string safely for Payable.
 */
export function validateAndParsePayableBackup(jsonStr: string): {
  isValid: boolean;
  data?: PayableBackupData;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonStr);

    if (!parsed || typeof parsed !== 'object') {
      return { isValid: false, error: 'અમાન્ય ફાઇલો (Not a valid JSON object).' };
    }

    if (!Array.isArray(parsed.payables)) {
      return { isValid: false, error: 'બેકઅપ ફાઇલમાં ઉધારી રેકોર્ડ મળતા નથી (Missing payables array).' };
    }

    for (const p of parsed.payables) {
      if (!p.id || !p.supplierNameGuj || typeof p.totalAmount !== 'number') {
        return { isValid: false, error: 'ખરાબ અથવા અપૂર્ણ ઉધારી રેકોર્ડ (Corrupted payable record).' };
      }
    }

    return {
      isValid: true,
      data: {
        version: parsed.version || '2.0',
        timestamp: parsed.timestamp || new Date().toISOString(),
        suppliers: Array.isArray(parsed.suppliers) ? parsed.suppliers : [],
        payables: parsed.payables,
        metadata: parsed.metadata || { appName: 'ShalaSarathi v2 Payable', totalSuppliers: 0, totalPayables: parsed.payables.length, totalOutstandingAmount: 0 }
      }
    };
  } catch {
    return { isValid: false, error: 'JSON પારસિંગ ભૂલ (Invalid JSON syntax).' };
  }
}
