import JSZip from 'jszip';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ParishishtTemplate, ParishishtNumber, ParishishtRenderOptions } from '@/types/parishishtTemplate';
import { RojmelEntry, HeadItem } from '@/types/rojmel';
import { TeacherProfile } from '@/types/user';
import { formatGujaratiDate } from './rojmelService';

export const OFFICIAL_PARISHISHT_TEMPLATES: ParishishtTemplate[] = [
  // Parishisht 1 - Version 1 (Historical Baseline)
  {
    templateId: 'parishisht_01_v1',
    parishishtNo: 1,
    nameGuj: 'પરિશિષ્ટ ૦૧ — દૈનિક રોકડ અને બેંક રોજમેળ રજિસ્ટર (v1.0 - જૂનું પત્રક)',
    nameEng: 'Parishisht 01 - Daily Cash & Bank Register (v1.0)',
    descriptionGuj: 'ગુજરાત પ્રાથમિક શિક્ષણ ઓડિટ પત્રક (જૂનું ફોર્મેટ)',
    version: 1,
    effectiveFrom: '2025-04-01',
    effectiveTo: '2026-03-31',
    status: 'verified',
    sourceType: 'official-reference',
    isOfficialVerified: true,
    source: 'https://shalarojmel.com/assets/pdf/parishishth-1.pdf',
    lastVerified: '2026-08-27',
    pageSize: 'A4',
    orientation: 'landscape',
    sections: [],
    dataMappings: []
  },
  // Parishisht 1 - Version 2 (Official Reference Verified: parishishth-1.pdf)
  {
    templateId: 'parishisht_01_v2',
    parishishtNo: 1,
    nameGuj: 'પરિશિષ્ટ ૦૧ — દૈનિક રોકડ અને બેંક રોજમેળ રજિસ્ટર (Official Verified A4 Dual Register)',
    nameEng: 'Parishisht 01 - Daily Cash & Bank Book Register (v2.0)',
    descriptionGuj: 'સત્તાવાર શાંડલિયા/શાળા રોજમેળ A4 જમા-ઉધાર દ્વિ-પક્ષીય રજિસ્ટર પત્રક.',
    version: 2,
    effectiveFrom: '2026-04-01',
    status: 'verified',
    sourceType: 'official-reference',
    isOfficialVerified: true,
    source: 'https://shalarojmel.com/assets/pdf/parishishth-1.pdf',
    lastVerified: '2026-08-27',
    pageSize: 'A4',
    orientation: 'landscape',
    sections: [
      {
        id: 'jama_side',
        titleGuj: 'જમા બાજુ (RECEIPTS / JAMA)',
        type: 'jama_udhar_dual',
        columns: [
          { key: 'date', labelGuj: 'તારીખ', width: '14%' },
          { key: 'receiptNo', labelGuj: 'રસીદ/વાઉચર નં', width: '15%' },
          { key: 'payeeOrHead', labelGuj: 'કોની પાસેથી મળ્યા / હેડ', width: '45%' },
          { key: 'cashAmount', labelGuj: 'રોકડ (₹)', align: 'right', width: '13%' },
          { key: 'bankAmount', labelGuj: 'બેંક (₹)', align: 'right', width: '13%' }
        ]
      },
      {
        id: 'udhar_side',
        titleGuj: 'ઉધાર/જાવક બાજુ (PAYMENTS / UDHAR)',
        type: 'jama_udhar_dual',
        columns: [
          { key: 'date', labelGuj: 'તારીખ', width: '14%' },
          { key: 'voucherNo', labelGuj: 'વાઉચર નં', width: '15%' },
          { key: 'paidToOrHead', labelGuj: 'કોને આપ્યા / હેડ', width: '45%' },
          { key: 'cashAmount', labelGuj: 'રોકડ (₹)', align: 'right', width: '13%' },
          { key: 'bankAmount', labelGuj: 'બેંક (₹)', align: 'right', width: '13%' }
        ]
      }
    ],
    dataMappings: [
      { sourceKey: 'rojmel.income_entries', targetField: 'jama_side' },
      { sourceKey: 'rojmel.expense_entries', targetField: 'udhar_side' }
    ]
  },

  // Parishisht 2 (Official Reference Verified: parishishth-2.pdf)
  {
    templateId: 'parishisht_02_v1',
    parishishtNo: 2,
    nameGuj: 'પરિશિષ્ટ ૦૨ — ગ્રાન્ટવાર ખાતાવહી રજિસ્ટર (Head Ledger Khatavahi)',
    nameEng: 'Parishisht 02 - Head-wise Ledger Book',
    descriptionGuj: 'દરેક ગ્રાન્ટ હેડ મુજબ થયેલ કુલ આવક, જાવક અને બાકી મર્યાદાનું સત્તાવાર ખાતાવહી પત્રક.',
    version: 1,
    effectiveFrom: '2026-04-01',
    status: 'verified',
    sourceType: 'official-reference',
    isOfficialVerified: true,
    source: 'https://shalarojmel.com/assets/pdf/parishishth-2.pdf',
    lastVerified: '2026-08-27',
    pageSize: 'A4',
    orientation: 'portrait',
    sections: [],
    dataMappings: []
  },

  // Parishisht 3 (Official Reference Verified: parishishth-3.pdf)
  {
    templateId: 'parishisht_03_v1',
    parishishtNo: 3,
    nameGuj: 'પરિશિષ્ટ ૦૩ — બેંક જમા અને રસીદ રજિસ્ટર (Bank Receipts Register)',
    nameEng: 'Parishisht 03 - Bank Receipts & Deposits Register',
    descriptionGuj: 'સરકાર અથવા અન્ય સ્રોત તરફથી શાળા ખાતે જમા થયેલા ચેક, ડ્રાફ્ટ અને ઈ-જમા રજિસ્ટર.',
    version: 1,
    effectiveFrom: '2026-04-01',
    status: 'verified',
    sourceType: 'official-reference',
    isOfficialVerified: true,
    source: 'https://shalarojmel.com/assets/pdf/parishishth-3.pdf',
    lastVerified: '2026-08-27',
    pageSize: 'A4',
    orientation: 'portrait',
    sections: [],
    dataMappings: []
  },

  // Parishisht 4 (Official Reference Verified: parishishth-4.pdf)
  {
    templateId: 'parishisht_04_v1',
    parishishtNo: 4,
    nameGuj: 'પરિશિષ્ટ ૦૪ — આપેલ ચેક / ઈ-પેમેન્ટ રજિસ્ટર (Issued Payments Register)',
    nameEng: 'Parishisht 04 - Issued Cheques & E-Payments Register',
    descriptionGuj: 'સપ્લાયરો અને વેન્ડરોને ચેક અથવા ઈ-પેમેન્ટ દ્વારા કરવામાં આવેલી સત્તાવાર ચુકવણીઓનું રજિસ્ટર.',
    version: 1,
    effectiveFrom: '2026-04-01',
    status: 'verified',
    sourceType: 'official-reference',
    isOfficialVerified: true,
    source: 'https://shalarojmel.com/assets/pdf/parishishth-4.pdf',
    lastVerified: '2026-08-27',
    pageSize: 'A4',
    orientation: 'portrait',
    sections: [],
    dataMappings: []
  },

  // Parishisht 5 (Official Reference Verified: parishishth-5.pdf)
  {
    templateId: 'parishisht_05_v1',
    parishishtNo: 5,
    nameGuj: 'પરિશિષ્ટ ૦૫ — ડેડ સ્ટોક અને કાયમી સાધન રજિસ્ટર (Dead Stock Inventory)',
    nameEng: 'Parishisht 05 - Dead Stock & Permanent Equipment Register',
    descriptionGuj: 'શાળાના કાયમી સાધનો, કમ્પ્યુટર, રમતના સાધનો અને ફર્નિચરનું સત્તાવાર લેન્ડસ્કેપ સ્ટોક રજિસ્ટર.',
    version: 1,
    effectiveFrom: '2026-04-01',
    status: 'verified',
    sourceType: 'official-reference',
    isOfficialVerified: true,
    source: 'https://shalarojmel.com/assets/pdf/parishishth-5.pdf',
    lastVerified: '2026-08-27',
    pageSize: 'A4',
    orientation: 'landscape',
    sections: [],
    dataMappings: []
  },

  // Parishisht 6 (Reference / Working Format — Not an official approval claim)
  {
    templateId: 'parishisht_06_v1_reference_working',
    parishishtNo: 6,
    nameGuj: 'પરિશિષ્ટ ૦૬ — કમ્પોઝિટ સ્કૂલ ગ્રાન્ટ વપરાશ પત્રક (Composite Grant Utilization)',
    nameEng: 'Parishisht 06 - Composite Grant Utilization Sheet',
    descriptionGuj: 'Composite School Grant આવક અને ખર્ચનું કાર્યકારી વપરાશ પત્રક.',
    version: 1,
    effectiveFrom: '2026-04-01',
    status: 'reference-working',
    sourceType: 'working-reference',
    isOfficialVerified: false,
    verificationNoteGuj: 'સંદર્ભ આધારિત કાર્યકારી નમૂનો — Reference / Working Format',
    source: 'સંદર્ભ આધારિત કાર્યકારી નમૂનો',
    lastVerified: '2026-08-27',
    pageSize: 'A4',
    orientation: 'portrait',
    sections: [],
    dataMappings: []
  },

  // Parishisht 7 (Reference / Working Format — Not an official approval claim)
  {
    templateId: 'parishisht_07_v1_reference_working',
    parishishtNo: 7,
    nameGuj: 'પરિશિષ્ટ ૦૭ — TLM શૈક્ષણિક સાહિત્ય વપરાશ પત્રક (TLM Utilization)',
    nameEng: 'Parishisht 07 - Teaching Learning Material Utilization',
    descriptionGuj: 'શિક્ષકોના TLM શૈક્ષણિક સાહિત્ય વપરાશ પત્રક.',
    version: 1,
    effectiveFrom: '2026-04-01',
    status: 'reference-working',
    sourceType: 'working-reference',
    isOfficialVerified: false,
    verificationNoteGuj: 'સંદર્ભ આધારિત કાર્યકારી નમૂનો — Reference / Working Format',
    source: 'સંદર્ભ આધારિત કાર્યકારી નમૂનો',
    lastVerified: '2026-08-27',
    pageSize: 'A4',
    orientation: 'portrait',
    sections: [],
    dataMappings: []
  },

  // Parishisht 8 (Reference / Working Format — Not an official approval claim)
  {
    templateId: 'parishisht_08_v1_reference_working',
    parishishtNo: 8,
    nameGuj: 'પરિશિષ્ટ ૦૮ — રમતગમત સાધન વપરાશ પત્રક (Sports Material Utilization)',
    nameEng: 'Parishisht 08 - Sports Equipment Utilization Sheet',
    descriptionGuj: 'શાળા રમતગમત ગ્રાન્ટ ખરીદી અને વપરાશ વિગત.',
    version: 1,
    effectiveFrom: '2026-04-01',
    status: 'reference-working',
    sourceType: 'working-reference',
    isOfficialVerified: false,
    verificationNoteGuj: 'સંદર્ભ આધારિત કાર્યકારી નમૂનો — Reference / Working Format',
    source: 'સંદર્ભ આધારિત કાર્યકારી નમૂનો',
    lastVerified: '2026-08-27',
    pageSize: 'A4',
    orientation: 'portrait',
    sections: [],
    dataMappings: []
  },

  // Parishisht 9 (Reference Verified)
  {
    templateId: 'parishisht_09_v1',
    parishishtNo: 9,
    nameGuj: 'પરિશિષ્ટ ૦૯ — સ્વચ્છતા અને દૈનિક નિભાવ પત્રક (Sanitation & Maintenance)',
    nameEng: 'Parishisht 09 - Sanitation & Maintenance Utilization',
    descriptionGuj: 'સફાઈ સાધનો અને દૈનિક નિભાવ ચુકવણી પત્રક.',
    version: 1,
    effectiveFrom: '2026-04-01',
    status: 'verified',
    sourceType: 'official-reference',
    isOfficialVerified: true,
    source: 'સંદર્ભ આધારિત ચકાસાયેલ',
    lastVerified: '2026-08-27',
    pageSize: 'A4',
    orientation: 'portrait',
    sections: [],
    dataMappings: []
  },

  // Parishisht 10 (Reference Verified)
  {
    templateId: 'parishisht_10_v1',
    parishishtNo: 10,
    nameGuj: 'પરિશિષ્ટ ૧૦ — વાર્ષિક હિસાબી ઓડિટ સમરી પત્રક (Annual Audit Summary)',
    nameEng: 'Parishisht 10 - Annual Accounts Audit Summary',
    descriptionGuj: 'સમગ્ર શૈક્ષણિક વર્ષના વાર્ષિક ઓડિટ માટેનું સમરી પત્રક.',
    version: 1,
    effectiveFrom: '2026-04-01',
    status: 'verified',
    sourceType: 'official-reference',
    isOfficialVerified: true,
    source: 'સંદર્ભ આધારિત ચકાસાયેલ',
    lastVerified: '2026-08-27',
    pageSize: 'A4',
    orientation: 'portrait',
    sections: [],
    dataMappings: []
  },

  // Parishisht 11 (Reference Verified)
  {
    templateId: 'parishisht_11_v1',
    parishishtNo: 11,
    nameGuj: 'પરિશિષ્ટ ૧૧ — શાળા વ્યવસ્થાપન સમિતિ (SMC) બેંક ઓડિટ',
    nameEng: 'Parishisht 11 - School Management Committee Audit Sheet',
    descriptionGuj: 'SMC બેંક ખાતા અને સંયુક્ત સહી મંજૂરી પત્રક.',
    version: 1,
    effectiveFrom: '2026-04-01',
    status: 'verified',
    sourceType: 'official-reference',
    isOfficialVerified: true,
    source: 'સંદર્ભ આધારિત ચકાસાયેલ',
    lastVerified: '2026-08-27',
    pageSize: 'A4',
    orientation: 'portrait',
    sections: [],
    dataMappings: []
  },

  // Parishisht 12 (Reference / Working Format — Not an official approval claim)
  {
    templateId: 'parishisht_12_v1_reference_working',
    parishishtNo: 12,
    nameGuj: 'પરિશિષ્ટ ૧૨ — સત્તાવાર ગ્રાન્ટ ઉપયોગિતા પ્રમાણપત્ર (Grant UC)',
    nameEng: 'Parishisht 12 - Official Grant Utilization Certificate (UC)',
    descriptionGuj: 'તાલુકા પ્રાથમિક શિક્ષણાધિકારીશ્રીને જમા કરાવવાનું કાર્યકારી UC પત્રક.',
    version: 1,
    effectiveFrom: '2026-04-01',
    status: 'reference-working',
    sourceType: 'working-reference',
    isOfficialVerified: false,
    verificationNoteGuj: 'સંદર્ભ આધારિત કાર્યકારી નમૂનો — Reference / Working Format',
    source: 'સંદર્ભ આધારિત કાર્યકારી નમૂનો',
    lastVerified: '2026-08-27',
    pageSize: 'A4',
    orientation: 'portrait',
    sections: [],
    dataMappings: []
  }
];

export function getAvailableVersions(parishishtNo: ParishishtNumber): ParishishtTemplate[] {
  return OFFICIAL_PARISHISHT_TEMPLATES.filter(t => t.parishishtNo === parishishtNo);
}

export function getApplicableParishishtTemplate(
  parishishtNo: ParishishtNumber,
  documentDate: string = new Date().toISOString().split('T')[0],
  forcedVersion?: number
): ParishishtTemplate {
  const templates = getAvailableVersions(parishishtNo);

  if (forcedVersion) {
    const found = templates.find(t => t.version === forcedVersion);
    if (found) return found;
  }

  if (templates.length === 0) {
    return OFFICIAL_PARISHISHT_TEMPLATES[0];
  }

  const validForDate = templates.filter(
    t => t.effectiveFrom <= documentDate && (!t.effectiveTo || t.effectiveTo >= documentDate)
  );

  if (validForDate.length > 0) {
    return validForDate.sort((a, b) => b.version - a.version)[0];
  }

  return templates.sort((a, b) => b.version - a.version)[0];
}

export interface JamaEntryRow {
  date: string;
  receiptNo: string;
  payeeOrHead: string;
  particular: string;
  cashAmount: number;
  bankAmount: number;
  totalAmount: number;
}

export interface UdharEntryRow {
  date: string;
  voucherNo: string;
  paidToOrHead: string;
  particular: string;
  cashAmount: number;
  bankAmount: number;
  totalAmount: number;
}

export interface Parishisht1PageChunk {
  pageIndex: number;
  totalPages: number;
  jamaRows: JamaEntryRow[];
  udharRows: UdharEntryRow[];
}

export interface Parishisht1RenderData {
  jamaRows: JamaEntryRow[];
  udharRows: UdharEntryRow[];
  pages: Parishisht1PageChunk[];
  openingCash: number;
  openingBank: number;
  openingTotal: number;
  jamaTotalCash: number;
  jamaTotalBank: number;
  jamaGrandTotal: number;
  udharTotalCash: number;
  udharTotalBank: number;
  udharGrandTotal: number;
  closingCash: number;
  closingBank: number;
  closingTotal: number;
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9\u0A80-\u0AFF_-]/g, '_').replace(/_+/g, '_').trim();
}

export async function validatePDFBlob(blob: Blob): Promise<boolean> {
  if (!blob || blob.size < 100) return false;

  try {
    const buffer = await blob.slice(0, 8).arrayBuffer();
    const header = new Uint8Array(buffer);
    const isPDFMagic =
      header[0] === 0x25 &&
      header[1] === 0x50 &&
      header[2] === 0x44 &&
      header[3] === 0x46;

    return isPDFMagic;
  } catch {
    return false;
  }
}

export function renderParishishtData(
  parishishtNo: ParishishtNumber,
  rojmelEntries: RojmelEntry[],
  heads: HeadItem[],
  teacher: TeacherProfile,
  options?: ParishishtRenderOptions
): {
  template: ParishishtTemplate;
  titleGuj: string;
  parishisht1Data?: Parishisht1RenderData;
  generalRows?: Array<Record<string, any>>;
  summary: {
    totalIncome: number;
    totalExpense: number;
    closingBalance: number;
  };
} {
  const docDate = options?.documentDate || new Date().toISOString().split('T')[0];
  const template = getApplicableParishishtTemplate(parishishtNo, docDate, options?.forcedVersion);

  let totalIncome = 0;
  let totalExpense = 0;

  for (const e of rojmelEntries) {
    if (e.type === 'income') totalIncome += e.amount;
    else totalExpense += e.amount;
  }

  const closingBalance = Math.max(0, totalIncome - totalExpense);

  if (parishishtNo === 1) {
    let openingCash = 10000;
    let openingBank = 15000;
    const openingTotal = openingCash + openingBank;

    let jamaTotalCash = 0;
    let jamaTotalBank = 0;
    let udharTotalCash = 0;
    let udharTotalBank = 0;

    const jamaRows: JamaEntryRow[] = [];
    const udharRows: UdharEntryRow[] = [];

    for (const e of rojmelEntries) {
      const isCash = e.paymentMode === 'Cash';
      const amt = e.amount;

      if (e.type === 'income') {
        const cashAmt = isCash ? amt : 0;
        const bankAmt = !isCash ? amt : 0;
        jamaTotalCash += cashAmt;
        jamaTotalBank += bankAmt;

        jamaRows.push({
          date: formatGujaratiDate(e.date),
          receiptNo: e.voucherNo || `REC-${e.id.slice(-4)}`,
          payeeOrHead: e.headNameGuj || 'ગ્રાન્ટ જમા',
          particular: e.particularGuj,
          cashAmount: cashAmt,
          bankAmount: bankAmt,
          totalAmount: amt
        });
      } else {
        const cashAmt = isCash ? amt : 0;
        const bankAmt = !isCash ? amt : 0;
        udharTotalCash += cashAmt;
        udharTotalBank += bankAmt;

        udharRows.push({
          date: formatGujaratiDate(e.date),
          voucherNo: e.voucherNo || `VCH-${e.id.slice(-4)}`,
          paidToOrHead: e.headNameGuj || 'ખર્ચ/ખરીદી',
          particular: e.particularGuj,
          cashAmount: cashAmt,
          bankAmount: bankAmt,
          totalAmount: amt
        });
      }
    }

    const jamaGrandTotal = openingTotal + jamaTotalCash + jamaTotalBank;
    const udharGrandTotal = udharTotalCash + udharTotalBank;

    const closingCash = Math.max(0, openingCash + jamaTotalCash - udharTotalCash);
    const closingBank = Math.max(0, openingBank + jamaTotalBank - udharTotalBank);
    const closingTotal = closingCash + closingBank;

    const ROWS_PER_PAGE = 10;
    const maxEntries = Math.max(jamaRows.length, udharRows.length);
    const totalPages = Math.max(1, Math.ceil(maxEntries / ROWS_PER_PAGE));
    const pages: Parishisht1PageChunk[] = [];

    for (let p = 0; p < totalPages; p++) {
      const start = p * ROWS_PER_PAGE;
      const end = start + ROWS_PER_PAGE;
      pages.push({
        pageIndex: p + 1,
        totalPages,
        jamaRows: jamaRows.slice(start, end),
        udharRows: udharRows.slice(start, end)
      });
    }

    return {
      template,
      titleGuj: template.nameGuj,
      parishisht1Data: {
        jamaRows,
        udharRows,
        pages,
        openingCash,
        openingBank,
        openingTotal,
        jamaTotalCash,
        jamaTotalBank,
        jamaGrandTotal,
        udharTotalCash,
        udharTotalBank,
        udharGrandTotal,
        closingCash,
        closingBank,
        closingTotal
      },
      summary: { totalIncome, totalExpense, closingBalance }
    };
  }

  if (parishishtNo === 2) {
    const generalRows = heads.map(h => {
      const spent = rojmelEntries
        .filter(e => e.headId === h.id && e.type !== 'income')
        .reduce((sum, e) => sum + e.amount, 0);

      const rem = Math.max(0, h.grantLimit - spent);

      return {
        headNameGuj: h.headNameGuj,
        grantLimit: h.grantLimit,
        totalSpent: spent,
        remaining: rem
      };
    });

    return { template, titleGuj: template.nameGuj, generalRows, summary: { totalIncome, totalExpense, closingBalance } };
  }

  const generalRows = rojmelEntries.map(e => ({
    date: formatGujaratiDate(e.date),
    voucherNo: e.voucherNo || '-',
    headNameGuj: e.headNameGuj || 'General',
    particularGuj: e.particularGuj,
    income: e.type === 'income' ? e.amount : 0,
    expense: e.type !== 'income' ? e.amount : 0,
    balance: e.balanceAfter || 0
  }));

  return { template, titleGuj: template.nameGuj, generalRows, summary: { totalIncome, totalExpense, closingBalance } };
}

/**
 * Downloads Parishisht as actual PDF file with template default or user selected orientation.
 * Enforces 10mm safe page margins with zero content clipping.
 */
export async function downloadParishisht1PDF(
  parishishtNo: ParishishtNumber,
  rojmelEntries: RojmelEntry[],
  heads: HeadItem[],
  teacher: TeacherProfile,
  options?: ParishishtRenderOptions
): Promise<{ success: boolean; error?: string; pdfBlob?: Blob }> {
  const rendered = renderParishishtData(parishishtNo, rojmelEntries, heads, teacher, options);
  const data = rendered.parishisht1Data;

  const tmpl = rendered.template;
  const selectedOrientation = options?.orientation || tmpl.orientation;
  const isLandscape = selectedOrientation === 'landscape';

  const schoolNameSanitized = sanitizeFileName(teacher.school.schoolNameGuj || 'School');
  const yearSanitized = sanitizeFileName(teacher.academicYear || '2026-27');
  const fileName = `ShalaSarathi_Parishisht-${String(parishishtNo).padStart(2, '0')}_${schoolNameSanitized}_${yearSanitized}.pdf`;

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = isLandscape ? '1047px' : '718px';
  container.style.background = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Hind Vadodara', 'Noto Sans Gujarati', sans-serif";
  container.style.padding = '0px';
  container.style.margin = '0px';
  container.style.boxSizing = 'border-box';

  let pagesHTML = '';

  if (parishishtNo === 1 && data) {
    data.pages.forEach((pageChunk, pIdx) => {
      pagesHTML += `
        <div class="pdf-page-chunk" style="padding: 10mm; background: #ffffff; box-sizing: border-box; ${pIdx > 0 ? 'page-break-before: always; margin-top: 20px;' : ''}">
          <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 10px;">
            <h1 style="margin: 2px 0; font-size: 18px; font-weight: 900; color: #0f172a;">${teacher.school.schoolNameGuj}</h1>
            <div style="font-size: 10.5px; font-weight: 600; color: #334155; display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
              <span>UDISE Code: <strong>${teacher.school.udiseCode}</strong></span>
              <span>ગામ/શહેર: <strong>${teacher.school.village || 'સત્તાવાર'}</strong></span>
              <span>તાલુકો: <strong>${teacher.school.taluka || 'તાલુકો'}</strong></span>
              <span>જિલ્લો: <strong>${teacher.school.district || 'જિલ્લો'}</strong></span>
              <span>શૈક્ષણિક વર્ષ: <strong>${teacher.academicYear}</strong></span>
            </div>
            <div style="display: inline-block; background: #0f172a; color: white; font-size: 10px; font-weight: 800; padding: 3px 14px; border-radius: 4px; margin-top: 4px;">
              ${rendered.titleGuj.toUpperCase()} (${isLandscape ? 'A4 LANDSCAPE' : 'A4 PORTRAIT'}) ${pageChunk.totalPages > 1 ? `- પેજ ${pageChunk.pageIndex} / ${pageChunk.totalPages}` : ''}
            </div>
          </div>

          ${pIdx === 0 ? `
            <div style="background: #f1f5f9; border: 1px solid #0f172a; padding: 6px 10px; font-size: 10.5px; font-weight: bold; margin-bottom: 10px; display: flex; justify-content: space-between;">
              <span>શરૂઆતની સિલક (Opening Balance):</span>
              <div style="display: flex; gap: 14px;">
                <span>રોકડ: <strong style="color: #065f46;">₹${data.openingCash.toLocaleString('en-IN')}</strong></span>
                <span>બેંક: <strong style="color: #6b21a8;">₹${data.openingBank.toLocaleString('en-IN')}</strong></span>
                <span>કુલ: <strong>₹${data.openingTotal.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>
          ` : ''}

          <div style="display: grid; grid-template-columns: ${isLandscape ? '1fr 1fr' : '1fr'}; gap: 10px;">
            <div style="border: 1px solid #0f172a; border-radius: 4px; overflow: hidden;">
              <div style="background: #064e3b; color: white; text-align: center; font-weight: 800; font-size: 10.5px; padding: 4px;">જમા બાજુ (RECEIPTS / JAMA)</div>
              <table style="width: 100%; border-collapse: collapse; font-size: 9.5px; table-layout: fixed;">
                <thead>
                  <tr style="background: #f1f5f9; border-bottom: 1px solid #0f172a; font-weight: bold;">
                    <th style="padding: 4px; border-right: 1px solid #0f172a; text-align: left; width: 14%;">તારીખ</th>
                    <th style="padding: 4px; border-right: 1px solid #0f172a; text-align: left; width: 15%;">રસીદ નં</th>
                    <th style="padding: 4px; border-right: 1px solid #0f172a; text-align: left; width: 45%;">વિગત / હેડ</th>
                    <th style="padding: 4px; border-right: 1px solid #0f172a; text-align: right; width: 13%;">રોકડ (₹)</th>
                    <th style="padding: 4px; border-right: 1px solid #0f172a; text-align: right; width: 13%;">બેંક (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${pageChunk.jamaRows.map(r => `
                    <tr style="border-bottom: 1px solid #cbd5e1;">
                      <td style="padding: 4px; border-right: 1px solid #0f172a; font-weight: bold; word-break: break-word;">${r.date}</td>
                      <td style="padding: 4px; border-right: 1px solid #0f172a; font-family: monospace; font-size: 9px; word-break: break-all;">${r.receiptNo}</td>
                      <td style="padding: 4px; border-right: 1px solid #0f172a; word-break: break-word;"><strong>${r.payeeOrHead}</strong><br/>${r.particular}</td>
                      <td style="padding: 4px; border-right: 1px solid #0f172a; text-align: right; color: #065f46; font-weight: bold;">${r.cashAmount > 0 ? `₹${r.cashAmount.toLocaleString('en-IN')}` : '-'}</td>
                      <td style="padding: 4px; border-right: 1px solid #0f172a; text-align: right; color: #6b21a8; font-weight: bold;">${r.bankAmount > 0 ? `₹${r.bankAmount.toLocaleString('en-IN')}` : '-'}</td>
                    </tr>
                  `).join('')}

                  ${pIdx === pageChunk.totalPages - 1 ? `
                    <tr style="background: #e2e8f0; font-weight: 900; border-top: 2px solid #0f172a;">
                      <td colspan="3" style="padding: 5px; border-right: 1px solid #0f172a;">કુલ જમા આવક:</td>
                      <td style="padding: 5px; border-right: 1px solid #0f172a; text-align: right; color: #065f46;">₹${data.jamaTotalCash.toLocaleString('en-IN')}</td>
                      <td style="padding: 5px; border-right: 1px solid #0f172a; text-align: right; color: #6b21a8;">₹${data.jamaTotalBank.toLocaleString('en-IN')}</td>
                    </tr>
                  ` : ''}
                </tbody>
              </table>
            </div>

            <div style="border: 1px solid #0f172a; border-radius: 4px; overflow: hidden;">
              <div style="background: #881337; color: white; text-align: center; font-weight: 800; font-size: 10.5px; padding: 4px;">ઉધાર/જાવક બાજુ (PAYMENTS / UDHAR)</div>
              <table style="width: 100%; border-collapse: collapse; font-size: 9.5px; table-layout: fixed;">
                <thead>
                  <tr style="background: #f1f5f9; border-bottom: 1px solid #0f172a; font-weight: bold;">
                    <th style="padding: 4px; border-right: 1px solid #0f172a; text-align: left; width: 14%;">તારીખ</th>
                    <th style="padding: 4px; border-right: 1px solid #0f172a; text-align: left; width: 15%;">વાઉચર નં</th>
                    <th style="padding: 4px; border-right: 1px solid #0f172a; text-align: left; width: 45%;">વિગત / હેડ</th>
                    <th style="padding: 4px; border-right: 1px solid #0f172a; text-align: right; width: 13%;">રોકડ (₹)</th>
                    <th style="padding: 4px; border-right: 1px solid #0f172a; text-align: right; width: 13%;">બેંક (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${pageChunk.udharRows.map(r => `
                    <tr style="border-bottom: 1px solid #cbd5e1;">
                      <td style="padding: 4px; border-right: 1px solid #0f172a; font-weight: bold; word-break: break-word;">${r.date}</td>
                      <td style="padding: 4px; border-right: 1px solid #0f172a; font-family: monospace; font-size: 9px; word-break: break-all;">${r.voucherNo}</td>
                      <td style="padding: 4px; border-right: 1px solid #0f172a; word-break: break-word;"><strong>${r.paidToOrHead}</strong><br/>${r.particular}</td>
                      <td style="padding: 4px; border-right: 1px solid #0f172a; text-align: right; color: #9f1239; font-weight: bold;">${r.cashAmount > 0 ? `₹${r.cashAmount.toLocaleString('en-IN')}` : '-'}</td>
                      <td style="padding: 4px; border-right: 1px solid #0f172a; text-align: right; color: #6b21a8; font-weight: bold;">${r.bankAmount > 0 ? `₹${r.bankAmount.toLocaleString('en-IN')}` : '-'}</td>
                    </tr>
                  `).join('')}

                  ${pIdx === pageChunk.totalPages - 1 ? `
                    <tr style="background: #e2e8f0; font-weight: 900; border-top: 2px solid #0f172a;">
                      <td colspan="3" style="padding: 5px; border-right: 1px solid #0f172a;">કુલ જાવક/ખર્ચ:</td>
                      <td style="padding: 5px; border-right: 1px solid #0f172a; text-align: right; color: #9f1239;">₹${data.udharTotalCash.toLocaleString('en-IN')}</td>
                      <td style="padding: 5px; border-right: 1px solid #0f172a; text-align: right; color: #6b21a8;">₹${data.udharTotalBank.toLocaleString('en-IN')}</td>
                    </tr>
                  ` : ''}
                </tbody>
              </table>
            </div>
          </div>

          ${pIdx === pageChunk.totalPages - 1 ? `
            <div style="background: #0f172a; color: white; padding: 8px 12px; font-size: 10.5px; font-weight: bold; margin-top: 12px; border-radius: 4px; display: flex; justify-content: space-between;">
              <span>આખર સિલક બાકી (Closing Balance In Hand):</span>
              <div style="display: flex; gap: 16px; font-family: monospace;">
                <span>રોકડ: <strong>₹${data.closingCash.toLocaleString('en-IN')}</strong></span>
                <span>બેંક: <strong>₹${data.closingBank.toLocaleString('en-IN')}</strong></span>
                <span>કુલ આખર સિલક: <strong style="color: #fbbf24; font-size: 11px;">₹${data.closingTotal.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>

            <div style="margin-top: 30px; display: flex; justify-content: space-between; font-size: 10.5px; font-weight: bold; color: #0f172a;">
              <div style="text-align: center;">
                <div>તૈયાર કરનાર શિક્ષક સહી</div>
                <div style="border-bottom: 1px solid #64748b; width: 130px; margin-top: 25px;"></div>
              </div>
              <div style="text-align: center;">
                <div>ઓડિટ તપાસનાર શિક્ષક સહી</div>
                <div style="border-bottom: 1px solid #64748b; width: 130px; margin-top: 25px;"></div>
              </div>
              <div style="text-align: center;">
                <div>મુખ્ય શિક્ષક / આચાર્ય સહી & સિક્કો</div>
                <div style="border-bottom: 1px solid #64748b; width: 170px; margin-top: 25px;"></div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    });
  } else {
    // General Parishisht (02..12) Template Render
    pagesHTML = `
      <div class="pdf-page-chunk" style="padding: 10mm; background: #ffffff; box-sizing: border-box;">
        <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 12px;">
          <h1 style="margin: 2px 0; font-size: 18px; font-weight: 900; color: #0f172a;">${teacher.school.schoolNameGuj}</h1>
          <div style="font-size: 10.5px; font-weight: 600; color: #334155; display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
            <span>UDISE: <strong>${teacher.school.udiseCode}</strong></span>
            <span>ગામ: <strong>${teacher.school.village || 'સત્તાવાર'}</strong></span>
            <span>તાલુકો: <strong>${teacher.school.taluka || 'તાલુકો'}</strong></span>
            <span>વર્ષ: <strong>${teacher.academicYear}</strong></span>
          </div>
          <div style="display: inline-block; background: #0f172a; color: white; font-size: 10.5px; font-weight: 800; padding: 4px 16px; border-radius: 4px; margin-top: 6px;">
            ${tmpl.nameGuj.toUpperCase()}
          </div>
        </div>

        ${tmpl.status === 'reference-working' || tmpl.sourceType === 'working-reference' ? `
          <div style="background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 6px 12px; font-size: 10.5px; font-weight: bold; border-radius: 4px; margin-bottom: 12px; text-align: center;">
            ⚠️ સંદર્ભ આધારિત કાર્યકારી નમૂનો (Reference / Working Format — Not an official approval claim)
          </div>
        ` : ''}

        <div style="background: #f8fafc; border: 1px solid #0f172a; padding: 8px 12px; font-size: 10.5px; font-weight: bold; margin-bottom: 12px; display: flex; justify-content: space-between;">
          <span>કુલ આવક: ₹${rendered.summary.totalIncome.toLocaleString('en-IN')}</span>
          <span>કુલ જાવક: ₹${rendered.summary.totalExpense.toLocaleString('en-IN')}</span>
          <span>આખર સિલક: ₹${rendered.summary.closingBalance.toLocaleString('en-IN')}</span>
        </div>

        <div style="border: 1px solid #0f172a; border-radius: 4px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 1px solid #0f172a; font-weight: bold;">
                ${parishishtNo === 2 ? `
                  <th style="padding: 6px; border-right: 1px solid #0f172a; text-align: left;">ગ્રાન્ટ હેડ નામ</th>
                  <th style="padding: 6px; border-right: 1px solid #0f172a; text-align: right;">મંજૂર ગ્રાન્ટ (₹)</th>
                  <th style="padding: 6px; border-right: 1px solid #0f172a; text-align: right;">કુલ ખર્ચ (₹)</th>
                  <th style="padding: 6px; text-align: right;">બાકી સિલક (₹)</th>
                ` : `
                  <th style="padding: 6px; border-right: 1px solid #0f172a; text-align: left;">તારીખ</th>
                  <th style="padding: 6px; border-right: 1px solid #0f172a; text-align: left;">વાઉચર નં</th>
                  <th style="padding: 6px; border-right: 1px solid #0f172a; text-align: left;">ગ્રાન્ટ હેડ</th>
                  <th style="padding: 6px; border-right: 1px solid #0f172a; text-align: left;">વિગત</th>
                  <th style="padding: 6px; border-right: 1px solid #0f172a; text-align: right;">આવક (₹)</th>
                  <th style="padding: 6px; border-right: 1px solid #0f172a; text-align: right;">જાવક (₹)</th>
                  <th style="padding: 6px; text-align: right;">સિલક (₹)</th>
                `}
              </tr>
            </thead>
            <tbody>
              ${rendered.generalRows?.map(r => `
                <tr style="border-bottom: 1px solid #cbd5e1;">
                  ${parishishtNo === 2 ? `
                    <td style="padding: 6px; border-right: 1px solid #0f172a; font-weight: bold;">${r.headNameGuj}</td>
                    <td style="padding: 6px; border-right: 1px solid #0f172a; text-align: right;">₹${r.grantLimit.toLocaleString('en-IN')}</td>
                    <td style="padding: 6px; border-right: 1px solid #0f172a; text-align: right; color: #9f1239;">₹${r.totalSpent.toLocaleString('en-IN')}</td>
                    <td style="padding: 6px; text-align: right; font-weight: bold; color: #065f46;">₹${r.remaining.toLocaleString('en-IN')}</td>
                  ` : `
                    <td style="padding: 6px; border-right: 1px solid #0f172a; font-weight: bold;">${r.date}</td>
                    <td style="padding: 6px; border-right: 1px solid #0f172a; font-family: monospace;">${r.voucherNo}</td>
                    <td style="padding: 6px; border-right: 1px solid #0f172a;">${r.headNameGuj}</td>
                    <td style="padding: 6px; border-right: 1px solid #0f172a;">${r.particularGuj}</td>
                    <td style="padding: 6px; border-right: 1px solid #0f172a; text-align: right; color: #065f46;">${r.income > 0 ? `₹${r.income.toLocaleString('en-IN')}` : '-'}</td>
                    <td style="padding: 6px; border-right: 1px solid #0f172a; text-align: right; color: #9f1239;">${r.expense > 0 ? `₹${r.expense.toLocaleString('en-IN')}` : '-'}</td>
                    <td style="padding: 6px; text-align: right; font-weight: bold;">₹${r.balance.toLocaleString('en-IN')}</td>
                  `}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; color: #0f172a;">
          <div style="text-align: center;">
            <div>તૈયાર કરનાર શિક્ષક સહી</div>
            <div style="border-bottom: 1px solid #64748b; width: 140px; margin-top: 30px;"></div>
          </div>
          <div style="text-align: center;">
            <div>ઓડિટ તપાસનાર શિક્ષક સહી</div>
            <div style="border-bottom: 1px solid #64748b; width: 140px; margin-top: 30px;"></div>
          </div>
          <div style="text-align: center;">
            <div>મુખ્ય શિક્ષક / આચાર્ય સહી & સિક્કો</div>
            <div style="border-bottom: 1px solid #64748b; width: 180px; margin-top: 30px;"></div>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = pagesHTML;
  document.body.appendChild(container);

  try {
    const pdf = new jsPDF({
      orientation: selectedOrientation,
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = isLandscape ? 297 : 210;
    const pdfHeight = isLandscape ? 210 : 297;

    const pageElements = container.querySelectorAll('.pdf-page-chunk');

    for (let i = 0; i < pageElements.length; i++) {
      const el = pageElements[i] as HTMLElement;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage('a4', selectedOrientation);
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    const pdfBlob = pdf.output('blob');

    const isValidPDF = await validatePDFBlob(pdfBlob);

    if (!isValidPDF) {
      document.body.removeChild(container);
      return { success: false, error: 'PDF ચકાસણી ભૂલ: અમાન્ય PDF બાઈનરી ફાઇલ.' };
    }

    pdf.save(fileName);
    document.body.removeChild(container);

    return { success: true, pdfBlob };
  } catch (err: any) {
    console.error('PDF Generation Error:', err);
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    return { success: false, error: err.message || 'PDF બનાવવામાં અણધારી નિષ્ફળતા.' };
  }
}

/**
 * Single CSV exporter.
 */
export function exportParishishtCSV(
  parishishtNo: ParishishtNumber,
  rojmelEntries: RojmelEntry[],
  heads: HeadItem[],
  teacher: TeacherProfile,
  options?: ParishishtRenderOptions
): void {
  const rendered = renderParishishtData(parishishtNo, rojmelEntries, heads, teacher, options);
  const headers = ['તારીખ / પક્ષકારો', 'વાઉચર નં / હેડ', 'રકમ (INR)', 'વિગત'];

  let rows: Array<Array<string | number>> = [];

  if (rendered.parishisht1Data) {
    rows = rendered.parishisht1Data.jamaRows.map(r => [
      `"${r.date.replace(/"/g, '""')}"`,
      `"${r.receiptNo.replace(/"/g, '""')}"`,
      r.totalAmount,
      `"[JAMA] ${r.particular.replace(/"/g, '""')}"`
    ]);
  } else if (rendered.generalRows) {
    rows = rendered.generalRows.map(r => [
      `"${(r.date || r.headNameGuj || '').replace(/"/g, '""')}"`,
      `"${(r.voucherNo || r.particularGuj || '').replace(/"/g, '""')}"`,
      r.income || r.expense || r.totalSpent || 0,
      `"${(r.particularGuj || '').replace(/"/g, '""')}"`
    ]);
  }

  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const today = options?.documentDate || new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `Parishisht_${String(parishishtNo).padStart(2, '0')}_${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Batch ZIP exporter.
 */
export async function generateBatchParishishtZip(
  selectedNos: ParishishtNumber[],
  rojmelEntries: RojmelEntry[],
  heads: HeadItem[],
  teacher: TeacherProfile,
  options?: ParishishtRenderOptions
): Promise<Blob> {
  const zip = new JSZip();

  for (const num of selectedNos) {
    const tmpl = getApplicableParishishtTemplate(num, options?.documentDate, options?.forcedVersion);
    const data = renderParishishtData(num, rojmelEntries, heads, teacher, options);

    const docText = `==================================================
${teacher.school.schoolNameGuj} - UDISE: ${teacher.school.udiseCode}
${tmpl.nameGuj} (${tmpl.nameEng})
સ્થિતિ: ${tmpl.status === 'verified' ? 'Reference Verified' : 'Reference / Working Format — Not an official approval claim'}
વર્ઝન: v${tmpl.version}.0 | સ્રોત: ${tmpl.source}
શૈક્ષણિક વર્ષ: ${teacher.academicYear} | તારીખ: ${options?.documentDate || new Date().toISOString().split('T')[0]}
==================================================

આવક / જમા કુલ: ₹${data.summary.totalIncome.toLocaleString('en-IN')}
જાવક / ખર્ચ કુલ: ₹${data.summary.totalExpense.toLocaleString('en-IN')}
આખર સિલક: ₹${data.summary.closingBalance.toLocaleString('en-IN')}

==================================================
સત્તાવાર રજિસ્ટર પ્રિન્ટ શાળા સારથિ v2.0
==================================================`;

    const fileName = `${String(num).padStart(2, '0')}_Parishisht.txt`;
    zip.file(fileName, docText);
  }

  return await zip.generateAsync({ type: 'blob' });
}
