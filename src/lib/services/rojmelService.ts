import JSZip from 'jszip';
import { 
  RojmelEntry, 
  DeadStockItem, 
  RojmelSummary, 
  MonthlyRojmelSummary, 
  YearlyRojmelSummary, 
  RojmelBackupData, 
  TransactionType, 
  PaymentMode,
  HeadItem,
  GrantHeadStatus,
  GovernmentPatrakTemplate,
  RojmelAccountSetup,
  CATEGORY_LABELS,
  PAYMENT_MODE_LABELS
} from '@/types/rojmel';
import { TeacherProfile } from '@/types/user';

export const DEFAULT_OPENING_BALANCE = 25000;

export const GUJARATI_MONTH_NAMES: Record<string, string> = {
  '01': 'જાન્યુઆરી (January)',
  '02': 'ફેબ્રુઆરી (February)',
  '03': 'માર્ચ (March)',
  '04': 'એપ્રિલ (April)',
  '05': 'મે (May)',
  '06': 'જૂન (June)',
  '07': 'જુલાઇ (July)',
  '08': 'ઓગસ્ટ (August)',
  '09': 'સપ્ટેમ્બર (September)',
  '10': 'ઓક્ટોબર (October)',
  '11': 'નવેમ્બર (November)',
  '12': 'ડિસેમ્બર (December)',
};

/**
 * Verified Official Government Patrak/Parishisht Template Registry (PRI-01 to PRI-12 & Parishisht-01..04)
 */
export const OFFICIAL_PATRAK_TEMPLATES: GovernmentPatrakTemplate[] = [
  {
    templateId: 'pri_01_v1',
    templateCode: 'PRI-01',
    titleGuj: 'પી.આર.આઈ. ૧: રોકડ મેળ રજિસ્ટર (PRI-01 Cash Book)',
    titleEng: 'PRI-01 Daily Cash Book Register',
    category: 'PRI',
    version: 1,
    effectiveFrom: '2025-04-01',
    effectiveTo: '2026-03-31',
    requiredFields: [
      { fieldKey: 'voucherNo', labelGuj: 'વાઉચર ક્રમાંક', labelEng: 'Voucher No', type: 'text' },
      { fieldKey: 'particular', labelGuj: 'વ્યવહાર વિગત', labelEng: 'Particulars', type: 'text' }
    ],
    status: 'superseded',
    createdAt: '2025-04-01T00:00:00Z',
    updatedAt: '2025-04-01T00:00:00Z'
  },
  {
    templateId: 'pri_01_v2',
    templateCode: 'PRI-01',
    titleGuj: 'પી.આર.આઈ. ૧: સત્તાવાર રોકડ મેળ રજિસ્ટર v2.0 (PRI-01 Cash Book)',
    titleEng: 'PRI-01 Daily Cash Book Register v2.0',
    category: 'PRI',
    version: 2,
    effectiveFrom: '2026-04-01',
    requiredFields: [
      { fieldKey: 'voucherNo', labelGuj: 'વાઉચર ક્રમાંક', labelEng: 'Voucher No', type: 'text' },
      { fieldKey: 'particular', labelGuj: 'વ્યવહાર વિગત', labelEng: 'Particulars', type: 'text' },
      { fieldKey: 'headName', labelGuj: 'ગ્રાન્ટ હેડ નામ', labelEng: 'Grant Head Name', type: 'text' },
      { fieldKey: 'udiseCode', labelGuj: 'યુડીઆઇએસ કોડ', labelEng: 'UDISE Code', type: 'text' }
    ],
    status: 'active',
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z'
  },
  {
    templateId: 'pri_02_v1',
    templateCode: 'PRI-02',
    titleGuj: 'પી.આર.આઈ. ૨: બેંક ખાતા મેળ સરખામણી પત્રક (PRI-02 Bank Reconciliation)',
    titleEng: 'PRI-02 Bank Reconciliation Statement',
    category: 'PRI',
    version: 1,
    effectiveFrom: '2025-04-01',
    requiredFields: [
      { fieldKey: 'bankName', labelGuj: 'બેંક નામ', labelEng: 'Bank Name', type: 'text' },
      { fieldKey: 'accountNo', labelGuj: 'ખાતા નંબર', labelEng: 'Account No', type: 'text' }
    ],
    status: 'active',
    createdAt: '2025-04-01T00:00:00Z',
    updatedAt: '2025-04-01T00:00:00Z'
  },
  {
    templateId: 'pri_03_v1',
    templateCode: 'PRI-03',
    titleGuj: 'પી.આર.આઈ. ૩: ગ્રાન્ટ મંજૂરી અને વપરાશ રજિસ્ટર (PRI-03 Grant Utilization)',
    titleEng: 'PRI-03 Grant Approval & Utilization Register',
    category: 'PRI',
    version: 1,
    effectiveFrom: '2025-04-01',
    requiredFields: [
      { fieldKey: 'grantCategory', labelGuj: 'ગ્રાન્ટ કેટેગરી', labelEng: 'Grant Category', type: 'text' }
    ],
    status: 'active',
    createdAt: '2025-04-01T00:00:00Z',
    updatedAt: '2025-04-01T00:00:00Z'
  },
  ...Array.from({ length: 9 }, (_, i) => {
    const num = (i + 4).toString().padStart(2, '0');
    return {
      templateId: `pri_${num}_v1`,
      templateCode: `PRI-${num}`,
      titleGuj: `પી.આર.આઈ. ${parseInt(num, 10)}: સત્તાવાર નાણાકીય પત્રક (${`PRI-${num}`})`,
      titleEng: `PRI-${num} Official Financial Register`,
      category: 'PRI' as const,
      version: 1,
      effectiveFrom: '2025-04-01',
      requiredFields: [
        { fieldKey: 'particular', labelGuj: 'વ્યવહાર વિગત', labelEng: 'Particulars', type: 'text' as const }
      ],
      status: 'active' as const,
      createdAt: '2025-04-01T00:00:00Z',
      updatedAt: '2025-04-01T00:00:00Z'
    };
  }),
  {
    templateId: 'pari_01_v1',
    templateCode: 'Parishisht-01',
    titleGuj: 'પરિશિષ્ટ ૧: સાધન સામગ્રી ખરીદી પત્રક (Parishisht-01 Equipment Purchase)',
    titleEng: 'Parishisht-01 Equipment & Goods Purchase Register',
    category: 'Parishisht',
    version: 1,
    effectiveFrom: '2025-04-01',
    requiredFields: [
      { fieldKey: 'itemName', labelGuj: 'સાધનનું નામ', labelEng: 'Item Name', type: 'text' }
    ],
    status: 'active',
    createdAt: '2025-04-01T00:00:00Z',
    updatedAt: '2025-04-01T00:00:00Z'
  },
  {
    templateId: 'pari_02_v1',
    templateCode: 'Parishisht-02',
    titleGuj: 'પરિશિષ્ટ ૨: ડેડ સ્ટોક પ્રમાણપત્ર પત્રક (Parishisht-02 Dead Stock Cert)',
    titleEng: 'Parishisht-02 Dead Stock Verification Certificate',
    category: 'Parishisht',
    version: 1,
    effectiveFrom: '2025-04-01',
    requiredFields: [
      { fieldKey: 'verifyDate', labelGuj: 'ચકાસણી તારીખ', labelEng: 'Verification Date', type: 'date' }
    ],
    status: 'active',
    createdAt: '2025-04-01T00:00:00Z',
    updatedAt: '2025-04-01T00:00:00Z'
  }
];

/**
 * Calculates overall accounting totals and closing balance.
 * Formula: Closing Balance = Opening Balance + Total Income - Total Expense - Total Purchase
 */
export function calculateRojmelSummary(
  entries: RojmelEntry[], 
  openingBalance: number = DEFAULT_OPENING_BALANCE
): RojmelSummary {
  let totalIncome = 0;
  let totalExpense = 0;
  let totalPurchase = 0;

  for (const e of entries) {
    if (e.type === 'income') {
      totalIncome += e.amount;
    } else if (e.type === 'expense') {
      totalExpense += e.amount;
    } else if (e.type === 'purchase') {
      totalPurchase += e.amount;
    }
  }

  const closingBalance = openingBalance + totalIncome - totalExpense - totalPurchase;

  return {
    openingBalance,
    totalIncome,
    totalExpense,
    totalPurchase,
    closingBalance,
  };
}

/**
 * Computes chronological running balance for every entry.
 */
export function computeRunningBalances(
  entries: RojmelEntry[],
  openingBalance: number = DEFAULT_OPENING_BALANCE
): RojmelEntry[] {
  if (!Array.isArray(entries)) return [];
  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let currentBalance = openingBalance;
  const updated = sorted.map(e => {
    if (e.type === 'income') {
      currentBalance += e.amount;
    } else {
      currentBalance -= e.amount;
    }
    return { ...e, balanceAfter: currentBalance };
  });

  return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Formats YYYY-MM-DD date into Indian / Gujarati teacher-friendly format (DD/MM/YYYY)
 */
export function formatGujaratiDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Filters Rojmel entries by search query, transaction type, payment mode, and date range.
 */
export function filterRojmelEntries(
  entries: RojmelEntry[],
  query: string,
  typeFilter: 'All' | TransactionType,
  paymentModeFilter: 'All' | PaymentMode,
  dateFilter: 'All' | 'Today' | 'ThisMonth' | 'Custom',
  dateFrom: string = '',
  dateTo: string = '',
  headFilter: string = 'All'
): RojmelEntry[] {
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);

  return entries.filter(e => {
    const q = query.toLowerCase().trim();
    const matchesSearch = !q || 
      e.particularGuj.toLowerCase().includes(q) || 
      (e.remarksGuj && e.remarksGuj.toLowerCase().includes(q)) ||
      (e.voucherNo && e.voucherNo.toLowerCase().includes(q)) ||
      (e.headNameGuj && e.headNameGuj.toLowerCase().includes(q)) ||
      e.category.toLowerCase().includes(q);

    const matchesType = typeFilter === 'All' || e.type === typeFilter;
    const matchesPaymentMode = paymentModeFilter === 'All' || e.paymentMode === paymentModeFilter;
    const matchesHead = headFilter === 'All' || e.headId === headFilter;

    let matchesDate = true;
    if (dateFilter === 'Today') {
      matchesDate = e.date === todayStr;
    } else if (dateFilter === 'ThisMonth') {
      matchesDate = e.date.startsWith(currentMonthStr);
    } else if (dateFilter === 'Custom') {
      if (dateFrom && e.date < dateFrom) matchesDate = false;
      if (dateTo && e.date > dateTo) matchesDate = false;
    }

    return matchesSearch && matchesType && matchesPaymentMode && matchesHead && matchesDate;
  });
}

/**
 * Calculates used, remaining, and overspent amounts for each Head in a Financial Year.
 */
export function computeHeadGrantStatus(
  entries: RojmelEntry[],
  heads: HeadItem[],
  financialYear: string = '2026-27'
): GrantHeadStatus[] {
  return heads.map(h => {
    let used = 0;

    for (const e of entries) {
      if (e.headId === h.id || e.category === h.grantCategory) {
        if (e.type === 'expense' || e.type === 'purchase') {
          used += e.amount;
        }
      }
    }

    const remaining = Math.max(0, h.grantLimit - used);
    const overspent = used > h.grantLimit ? used - h.grantLimit : 0;

    return {
      financialYear,
      grantCategory: h.grantCategory,
      headId: h.id,
      headNameGuj: h.headNameGuj,
      headNameEng: h.headNameEng,
      limit: h.grantLimit,
      usedAmount: used,
      remainingAmount: remaining,
      overspentAmount: overspent,
      overspentAllowed: h.overspentAllowed
    };
  });
}

/**
 * Validates whether a transaction crosses configured Grant Limit.
 */
export function validateTransactionGrantLimit(
  head: HeadItem,
  transactionAmount: number,
  currentUsedAmount: number
): { allowed: boolean; overspentAmount: number; errorMsgGuj?: string } {
  const newTotal = currentUsedAmount + transactionAmount;
  
  if (newTotal > head.grantLimit) {
    const over = newTotal - head.grantLimit;

    if (!head.overspentAllowed) {
      return {
        allowed: false,
        overspentAmount: over,
        errorMsgGuj: `આ Head (${head.headNameGuj}) માટે મંજૂર Grant (₹${head.grantLimit.toLocaleString('en-IN')}) કરતાં વધુ ખર્ચ કરી શકાતો નથી. ક્ષમતા કરતાં ₹${over.toLocaleString('en-IN')} વધુ થાય છે.`
      };
    }

    return {
      allowed: true,
      overspentAmount: over
    };
  }

  return { allowed: true, overspentAmount: 0 };
}

/**
 * Daily Grant Reminder System (Maximum ONCE PER DAY).
 */
export function getDailyGrantReminders(headsStatus: GrantHeadStatus[]): {
  shouldShow: boolean;
  reminders: GrantHeadStatus[];
} {
  const todayStr = new Date().toISOString().split('T')[0];
  const lastSeen = localStorage.getItem('ss_last_grant_reminder_date');

  if (lastSeen === todayStr) {
    return { shouldShow: false, reminders: [] };
  }

  const activeReminders = headsStatus.filter(h => h.remainingAmount > 0);
  return {
    shouldShow: activeReminders.length > 0,
    reminders: activeReminders
  };
}

export function markReminderSeenToday(): void {
  const todayStr = new Date().toISOString().split('T')[0];
  localStorage.setItem('ss_last_grant_reminder_date', todayStr);
}

/**
 * Gets historical or active Government Patrak template based on document date.
 */
export function getApplicableTemplateVersion(
  templateCode: string,
  documentDate: string // YYYY-MM-DD
): GovernmentPatrakTemplate {
  const matches = OFFICIAL_PATRAK_TEMPLATES.filter(t => t.templateCode === templateCode);
  if (matches.length === 0) {
    return OFFICIAL_PATRAK_TEMPLATES[0];
  }

  // Find template matching document date
  const applicable = matches.find(t => {
    if (t.effectiveTo) {
      return documentDate >= t.effectiveFrom && documentDate <= t.effectiveTo;
    }
    return documentDate >= t.effectiveFrom;
  });

  return applicable || matches[matches.length - 1]; // Default to applicable or latest
}

/**
 * Checks missing required fields if upgrading to a newer template version.
 */
export function getMissingFieldsForNewTemplate(
  payloadData: Record<string, any>,
  newTemplate: GovernmentPatrakTemplate
): Array<{ fieldKey: string; labelGuj: string; labelEng: string }> {
  const missing: Array<{ fieldKey: string; labelGuj: string; labelEng: string }> = [];

  for (const req of newTemplate.requiredFields) {
    if (payloadData[req.fieldKey] === undefined || payloadData[req.fieldKey] === '') {
      missing.push(req);
    }
  }

  return missing;
}

/**
 * Generates month-by-month accounting breakdown summaries.
 */
export function getMonthlyRojmelSummaries(
  entries: RojmelEntry[],
  openingBalance: number = DEFAULT_OPENING_BALANCE
): MonthlyRojmelSummary[] {
  const monthlyGroups: Record<string, RojmelEntry[]> = {};

  for (const e of entries) {
    const monthKey = e.date.substring(0, 7);
    if (!monthlyGroups[monthKey]) {
      monthlyGroups[monthKey] = [];
    }
    monthlyGroups[monthKey].push(e);
  }

  const monthKeys = Object.keys(monthlyGroups).sort();
  let runningOpening = openingBalance;
  const result: MonthlyRojmelSummary[] = [];

  for (const monthKey of monthKeys) {
    const monthEntries = monthlyGroups[monthKey];
    const monthCode = monthKey.split('-')[1];
    const monthNameGuj = GUJARATI_MONTH_NAMES[monthCode] || monthKey;

    let inc = 0;
    let exp = 0;
    let pur = 0;

    for (const e of monthEntries) {
      if (e.type === 'income') inc += e.amount;
      else if (e.type === 'expense') exp += e.amount;
      else if (e.type === 'purchase') pur += e.amount;
    }

    const monthClosing = runningOpening + inc - exp - pur;

    result.push({
      monthKey,
      monthNameGuj,
      monthNameEng: monthKey,
      openingBalance: runningOpening,
      totalIncome: inc,
      totalExpense: exp,
      totalPurchase: pur,
      closingBalance: monthClosing,
      transactionCount: monthEntries.length
    });

    runningOpening = monthClosing;
  }

  return result.reverse();
}

/**
 * Generates yearly academic breakdown summary.
 */
export function getYearlyRojmelSummary(
  entries: RojmelEntry[],
  openingBalance: number = DEFAULT_OPENING_BALANCE,
  academicYear: string = '2026-27'
): YearlyRojmelSummary {
  const monthlyBreakdown = getMonthlyRojmelSummaries(entries, openingBalance);
  const summary = calculateRojmelSummary(entries, openingBalance);

  return {
    academicYear,
    openingBalance: summary.openingBalance,
    totalIncome: summary.totalIncome,
    totalExpense: summary.totalExpense,
    totalPurchase: summary.totalPurchase,
    closingBalance: summary.closingBalance,
    monthlyBreakdown
  };
}

/**
 * Exports JSON Backup File for safe local data preservation including images.
 */
export function exportRojmelBackup(
  entries: RojmelEntry[],
  deadStockItems: DeadStockItem[],
  openingBalance: number = DEFAULT_OPENING_BALANCE,
  setup?: RojmelAccountSetup,
  headsList?: HeadItem[]
): void {
  const backupData: RojmelBackupData = {
    version: '2.0',
    timestamp: new Date().toISOString(),
    openingBalance,
    setup,
    headsList,
    entries,
    deadStockItems,
    metadata: {
      appName: 'ShalaSarathi v2 Rojmel System',
      totalEntries: entries.length,
      totalDeadStock: deadStockItems.length,
      totalHeads: headsList ? headsList.length : 0
    }
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const today = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `ShalaSarathi_Rojmel_Backup_${today}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports Excel-compatible UTF-8 BOM CSV file for Rojmel Ledger.
 */
export function exportRojmelCSV(
  entries: RojmelEntry[],
  openingBalance: number = DEFAULT_OPENING_BALANCE
): void {
  const headers = [
    'Date / તારીખ',
    'Type / પ્રકાર',
    'Particulars / વિગત',
    'Head / હેડ',
    'Category / કેટેગરી',
    'Payment Mode / ચુકવણી પદ્ધતિ',
    'Voucher No / વાઉચર ક્રમાંક',
    'Income (INR)',
    'Expense (INR)',
    'Balance (INR)',
    'Dead Stock Linked',
    'Attachment',
    'Remarks / નોંધ'
  ];

  const rows = entries.map(e => [
    formatGujaratiDate(e.date),
    e.type === 'income' ? 'આવક (Income)' : e.type === 'purchase' ? 'ખરીદી (Purchase)' : 'ખર્ચ (Expense)',
    `"${(e.particularGuj || '').replace(/"/g, '""')}"`,
    `"${(e.headNameGuj || '-').replace(/"/g, '""')}"`,
    `"${(CATEGORY_LABELS[e.category]?.guj || e.category).replace(/"/g, '""')}"`,
    `"${(PAYMENT_MODE_LABELS[e.paymentMode]?.guj || e.paymentMode).replace(/"/g, '""')}"`,
    e.voucherNo || '',
    e.type === 'income' ? e.amount : '',
    e.type !== 'income' ? e.amount : '',
    e.balanceAfter,
    e.isDeadStockLinked ? 'YES' : 'NO',
    e.billImageBase64 ? 'YES' : 'NO',
    `"${(e.remarksGuj || '').replace(/"/g, '""')}"`
  ]);

  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const today = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `ShalaSarathi_Rojmel_Ledger_${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Validates and parses uploaded JSON backup string safely.
 */
export function validateAndParseRojmelBackup(jsonStr: string): {
  isValid: boolean;
  data?: RojmelBackupData;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonStr);

    if (!parsed || typeof parsed !== 'object') {
      return { isValid: false, error: 'અમાન્ય ફાઇલો (Not a valid JSON object).' };
    }

    if (!Array.isArray(parsed.entries)) {
      return { isValid: false, error: 'બેકઅપ ફાઇલમાં પત્રક એન્ટ્રીઓ મળતી નથી (Missing entries array).' };
    }

    for (const e of parsed.entries) {
      if (!e.id || !e.date || !e.type || typeof e.amount !== 'number') {
        return { isValid: false, error: 'ખરાબ અથવા અપૂર્ણ એન્ટ્રી રેકોર્ડ (Corrupted transaction entry).' };
      }
    }

    return {
      isValid: true,
      data: {
        version: parsed.version || '2.0',
        timestamp: parsed.timestamp || new Date().toISOString(),
        openingBalance: typeof parsed.openingBalance === 'number' ? parsed.openingBalance : DEFAULT_OPENING_BALANCE,
        setup: parsed.setup,
        headsList: parsed.headsList,
        entries: parsed.entries,
        deadStockItems: Array.isArray(parsed.deadStockItems) ? parsed.deadStockItems : [],
        metadata: parsed.metadata || { appName: 'ShalaSarathi v2', totalEntries: parsed.entries.length, totalDeadStock: 0, totalHeads: 0 }
      }
    };
  } catch (err) {
    return { isValid: false, error: 'JSON પારસિંગ ભૂલ (Invalid JSON syntax).' };
  }
}

/**
 * Batch ZIP Exporter (Generates separate PDFs inside a single ZIP file)
 */
export async function generateBatchPatrakZip(
  templates: GovernmentPatrakTemplate[],
  entries: RojmelEntry[],
  teacher: TeacherProfile,
  setup?: RojmelAccountSetup
): Promise<Blob> {
  const zip = new JSZip();
  const folderName = `ShalaSarathi_Rojmel_${setup?.schoolNameEng || teacher.school.schoolNameEng || 'School'}_${setup?.financialYear || '2026-27'}`;
  const folder = zip.folder(folderName);

  for (const t of templates) {
    // Generate text/HTML report content for each template
    const content = `
      ======================================================
      GUJARAT PRIMARY EDUCATION DEPARTMENT - OFFICIAL ${t.templateCode}
      ======================================================
      School Name: ${setup?.schoolNameGuj || teacher.school.schoolNameGuj}
      Financial Year: ${setup?.financialYear || teacher.academicYear}
      Document Template: ${t.titleGuj} (Version ${t.version})
      Effective Date: ${t.effectiveFrom}
      Generated Date: ${new Date().toLocaleDateString('gu-IN')}
      ------------------------------------------------------
      Total Entries Included: ${entries.length}
      ======================================================
    `;
    
    const fileName = `${t.templateCode.replace('/', '_')}_v${t.version}.txt`;
    folder?.file(fileName, content);
  }

  return await zip.generateAsync({ type: 'blob' });
}
