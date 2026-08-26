import { TeacherProfile } from '@/types/user';
import { PatrakTemplate, PatrakVersionConfig } from '@/types/patrak';
import { RojmelEntry, DeadStockItem, HeadItem, RojmelAccountSetup } from '@/types/rojmel';
import { Voucher } from '@/types/voucher';
import { PaperTemplate } from '@/types/paperGenerator';
import { SavedDocumentItem } from '@/types/documentLibrary';
import { Supplier, PayableItem } from '@/types/payable';

export const INITIAL_TEACHER_PROFILE: TeacherProfile = {
  id: 'tch_1001',
  nameGuj: 'વિજયભાઈ રમેશચંદ્ર પટેલ',
  nameEng: 'Vijaykumar R. Patel',
  mobile: '98765 43210',
  email: 'vijay.patel@gujarat.gov.in',
  designation: 'Head Teacher / Acharya (મુખ્ય શિક્ષક / આચાર્ય)',
  photoUrl: '',
  academicYear: '2026-27',
  school: {
    id: 'sch_3001',
    schoolNameGuj: 'અંબાજી પ્રાથમિક શાળા નંબર ૧',
    schoolNameEng: 'Ambaji Primary School No. 1',
    udiseCode: '24020104501',
    village: 'અંબાજી (Ambaji)',
    taluka: 'દાંતા (Danta)',
    district: 'Banaskantha (બનાસકાંઠા)',
    address: 'મુ. પો. અંબાજી, તા. દાંતા, જી. બનાસકાંઠા - 385110',
    payCenterSchool: 'દાંતા પે સેન્ટર શાળા',
    clusterName: 'અંબાજી સી.આર.સી.'
  },
  updatedAt: new Date().toISOString()
};

export const SAMPLE_ROJMEL_SETUP: RojmelAccountSetup = {
  id: 'setup_001',
  schoolNameGuj: 'અંબાજી પ્રાથમિક શાળા નંબર ૧',
  schoolNameEng: 'Ambaji Primary School No. 1',
  rojmelNameGuj: 'શાળા કાર્યાલય મુખ્ય રોજમેળ રજિસ્ટર',
  rojmelNameEng: 'School Office Main Rojmel Register',
  financialYear: '2026-27',
  bankName: 'State Bank of India (એસ.બી.આઈ. અંબાજી)',
  accountNumber: '••••••••4892',
  ifsc: 'SBIN0001234',
  branch: 'અંબાજી શાખા',
  openingBalance: 25000,
  isLocked: true,
  editRequestStatus: 'none',
  createdAt: '2026-04-01T00:00:00Z',
  updatedAt: '2026-04-01T00:00:00Z'
};

export const SAMPLE_HEADS: HeadItem[] = [
  {
    id: 'head_01',
    headNameGuj: 'કમ્પોઝિટ સ્કૂલ ગ્રાન્ટ (Composite Grant)',
    headNameEng: 'Composite School Grant',
    grantCategory: 'Composite School Grant',
    grantLimit: 25000,
    financialYear: '2026-27',
    overspentAllowed: false,
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z'
  },
  {
    id: 'head_02',
    headNameGuj: 'TLM શૈક્ષણિક સાધન સાહિત્ય ગ્રાન્ટ (TLM Grant)',
    headNameEng: 'TLM Learning Material Grant',
    grantCategory: 'Teaching Material',
    grantLimit: 10000,
    financialYear: '2026-27',
    overspentAllowed: false,
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z'
  },
  {
    id: 'head_03',
    headNameGuj: 'રમતગમત ગ્રાન્ટ (Sports Grant)',
    headNameEng: 'Sports Equipment Grant',
    grantCategory: 'Sports',
    grantLimit: 5000,
    financialYear: '2026-27',
    overspentAllowed: true,
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z'
  },
  {
    id: 'head_04',
    headNameGuj: 'સ્વાચછતા અને દૈનિક નિભાવ ગ્રાન્ટ (Cleaning & Maintenance)',
    headNameEng: 'Cleaning & Maintenance Grant',
    grantCategory: 'Cleaning',
    grantLimit: 8000,
    financialYear: '2026-27',
    overspentAllowed: false,
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z'
  }
];

const DEFAULT_PATRAK_VERSIONS: PatrakVersionConfig[] = [
  {
    versionCode: 'Version A',
    titleGuj: 'Version A (સત્તાવાર ગવર્નમેન્ટ સીલ)',
    descriptionGuj: 'સત્તાવાર શિક્ષણ વિભાગ લોગો અને ગવર્નમેન્ટ સીલ સાથે.',
    headerStyle: 'government_seal',
    photoPlacement: 'top_right',
    columnLayout: 'single'
  },
  {
    versionCode: 'Version B',
    titleGuj: 'Version B (કલર લેઆઉટ સીલ)',
    descriptionGuj: 'આકર્ષક કલર હાઇલાઇટિંગ અને ફોટો ડિસ્પ્લે સાથે.',
    headerStyle: 'standard',
    photoPlacement: 'top_right',
    columnLayout: 'double'
  },
  {
    versionCode: 'Version C',
    titleGuj: 'Version C (કોમ્પેક્ટ સમરી)',
    descriptionGuj: '૧ પાનામાં પ્રિન્ટ કરી શકાય તેવું કોમ્પેક્ટ ફોર્મેટ.',
    headerStyle: 'compact_badge',
    photoPlacement: 'footer',
    columnLayout: 'grid'
  }
];

export const SAMPLE_PATRAK_TEMPLATES: PatrakTemplate[] = Array.from({ length: 73 }, (_, i) => {
  const num = i + 1;
  let category: PatrakTemplate['category'] = 'Gunotsav';
  let titleGuj = `પત્રક - ${num} (ગુણોત્સવ ૨.૦ મૂલ્યાંકન)`;
  let titleEng = `Patrak ${num} - Gunotsav 2.0 Evaluation`;
  let descGuj = `ધોરણ ૧ થી ૮ માટેનું સત્તાવાર શિક્ષણ વિભાગ ગુણોત્સવ પત્રક નંબર ${num}.`;
  let isPremium = false;

  if (num <= 15) {
    category = 'Gunotsav';
    if (num === 1) {
      titleGuj = 'પત્રક - અ (પ્રગતિ પત્રક - વિષયવાર સિદ્ધિ)';
      titleEng = 'Patrak A - Subjectwise Progress Sheet';
      descGuj = 'ધોરણ ૧ થી ૮ ના વિદ્યાર્થીઓનું વિષયવાર ગુણોત્સવ ૨.૦ અને SCE આધારિત મૂલ્યાંકન પત્રક.';
    } else if (num === 2) {
      titleGuj = 'પત્રક - બ (વ્યક્તિત્વ અને સામાજિક વિકાસ)';
      titleEng = 'Patrak B - Personality & Social Development';
      descGuj = 'વિદ્યાર્થીઓની સહ-અભ્યાસિક પ્રવૃત્તિઓ, શિસ્ત, નેતૃત્વ અને રમતગમત મૂલ્યાંકન પત્રક.';
    } else if (num === 3) {
      titleGuj = 'પત્રક - ક (રચનાત્મક મૂલ્યાંકન પત્રક Formative Assessment)';
      titleEng = 'Patrak C - Formative Assessment Record';
      descGuj = 'દૈનિક નિરીક્ષણ, સ્વાધ્યાય કાર્ય, મૌખિક પ્રશ્નો અને પ્રવૃત્તિઓનું નોંધણી પત્રક.';
    }
  } else if (num <= 30) {
    category = 'NIPUN Bharat';
    if (num === 12) {
      titleGuj = 'નિપુણ ભારત - FLN પાયાની સાક્ષરતા મૂલ્યાંકન પત્રક';
      titleEng = 'NIPUN Bharat FLN Competency Sheet';
      descGuj = 'ધોરણ ૧ થી ૩ ના બાળકોની પાયાની સાક્ષરતા અને સંખ્યા જ્ઞાન ચકાસણી.';
    }
  } else if (num <= 45) {
    category = 'SCE Evaluation';
  } else if (num <= 60) {
    category = 'School Administration';
  } else {
    category = 'Mid-day Meal';
  }

  return {
    id: `patrak_${num}`,
    patrakNumber: num,
    category,
    titleGuj,
    titleEng,
    descriptionGuj: descGuj,
    versions: DEFAULT_PATRAK_VERSIONS,
    fields: [
      { id: 'f1', labelGuj: 'શિક્ષકનું નામ', labelEng: 'Teacher Name', type: 'text', autoFillSource: 'teacherName' },
      { id: 'f2', labelGuj: 'શાળાનું નામ', labelEng: 'School Name', type: 'text', autoFillSource: 'schoolName' },
      { id: 'f3', labelGuj: 'નોંધ વિગત', labelEng: 'Remarks', type: 'textarea' }
    ],
    isPremium,
    version: 1
  };
});

export const SAMPLE_ROJMEL_ENTRIES: RojmelEntry[] = [
  {
    id: 'roj_01',
    date: '2026-08-20',
    type: 'income',
    headId: 'head_01',
    headNameGuj: 'કમ્પોઝિટ સ્કૂલ ગ્રાન્ટ (Composite Grant)',
    particularGuj: 'કમ્પોઝિટ સ્કૂલ ગ્રાન્ટ પ્રથમ હપ્તો બેંક જમા',
    particularEng: 'Composite School Grant 1st Installment',
    amount: 10000,
    paymentMode: 'Bank',
    category: 'Equipment',
    balanceAfter: 35000,
    remarksGuj: 'સરકારી ગ્રાન્ટ શૈક્ષણિક વર્ષ ૨૦૨૬-૨૭ જમા.',
    voucherNo: 'V-001',
    createdAt: '2026-08-20T10:00:00Z'
  },
  {
    id: 'roj_02',
    date: '2026-08-22',
    type: 'purchase',
    headId: 'head_01',
    headNameGuj: 'કમ્પોઝિટ સ્કૂલ ગ્રાન્ટ (Composite Grant)',
    particularGuj: 'શાળા ઓફિસ માટે એચ.પી. મલ્ટીફંક્શન લેઝર પ્રિન્ટર ખરીદી',
    particularEng: 'HP LaserJet Printer Purchase',
    amount: 14500,
    quantity: 1,
    paymentMode: 'Bank',
    category: 'Equipment',
    balanceAfter: 20500,
    remarksGuj: 'બિલ નંબર HP-88902 સાથે ડેડ સ્ટોક ઓટો-લિંક.',
    voucherNo: 'V-002',
    isDeadStockLinked: true,
    linkedDeadStockId: 'ds_001',
    createdAt: '2026-08-22T14:30:00Z'
  },
  {
    id: 'roj_03',
    date: '2026-08-24',
    type: 'purchase',
    headId: 'head_03',
    headNameGuj: 'રમતગમત ગ્રાન્ટ (Sports Grant)',
    particularGuj: 'રમતગમત સાધનો ખરીદી (કિક બોર્ડ, બોલ, નેટ ખરીદી)',
    particularEng: 'Sports Material Kit',
    amount: 3200,
    quantity: 1,
    paymentMode: 'Bank',
    category: 'Sports',
    balanceAfter: 17300,
    remarksGuj: 'પ્રાથમિક રમતો માટે સાધન ખરીદી.',
    voucherNo: 'V-003',
    isDeadStockLinked: true,
    linkedDeadStockId: 'ds_002',
    createdAt: '2026-08-24T09:15:00Z'
  },
  {
    id: 'roj_04',
    date: '2026-08-25',
    type: 'expense',
    headId: 'head_04',
    headNameGuj: 'સ્વાચછતા અને દૈનિક નિભાવ ગ્રાન્ટ (Cleaning & Maintenance)',
    particularGuj: 'સ્ટેશનરી ખરીદી (દૈનિક રજિસ્ટર, પેન, A4 પેપર બોક્સ)',
    particularEng: 'Stationery Items',
    amount: 1250,
    paymentMode: 'Cash',
    category: 'Stationery',
    balanceAfter: 16050,
    remarksGuj: 'શાળા કાર્યાલય દૈનિક વપરાશ સ્ટેશનરી.',
    voucherNo: 'V-004',
    createdAt: '2026-08-25T11:15:00Z'
  }
];

export const SAMPLE_DEAD_STOCK: DeadStockItem[] = [
  {
    id: 'ds_001',
    itemNameGuj: 'એચ.પી. મલ્ટીફંક્શન લેઝર પ્રિન્ટર (HP Laser Printer)',
    itemNameEng: 'HP LaserJet Printer',
    purchaseDate: '2026-08-22',
    amount: 14500,
    quantity: 1,
    category: 'Equipment',
    sourceRojmelEntryId: 'roj_02',
    voucherRef: 'V-002',
    billNo: 'HP-88902',
    remarksGuj: 'રોજમેળ એન્ટ્રી રોજ-02 માંથી ઓટો-લિંક્ડ ડેડ સ્ટોક સાધન.',
    createdAt: '2026-08-22T14:30:00Z'
  },
  {
    id: 'ds_002',
    itemNameGuj: 'રમતગમત સાધનો કિટ (Sports Equipment Kit)',
    itemNameEng: 'Sports Equipment Kit',
    purchaseDate: '2026-08-24',
    amount: 3200,
    quantity: 1,
    category: 'Sports',
    sourceRojmelEntryId: 'roj_03',
    voucherRef: 'V-003',
    billNo: 'SPT-4410',
    remarksGuj: 'રોજમેળ એન્ટ્રી રોજ-03 માંથી ઓટો-લિંક્ડ ડેડ સ્ટોક સાધન.',
    createdAt: '2026-08-24T09:15:00Z'
  }
];

export const SAMPLE_SUPPLIERS: Supplier[] = [
  {
    id: 'sup_001',
    nameGuj: 'શ્રી રામદેવ સ્ટેશનરી એન્ડ બુક ડેપો, અંબાજી',
    nameEng: 'Shree Ramdev Stationery & Book Depot',
    mobile: '98250 12345',
    addressGuj: 'સ્ટેશન રોડ, બસ સ્ટેન્ડ પાસે, અંબાજી',
    notesGuj: 'શાળા કાર્યાલય સ્ટેશનરી અને પ્રિન્ટિંગ પેપર સપ્લાયર.',
    createdAt: '2026-04-01T00:00:00Z'
  },
  {
    id: 'sup_002',
    nameGuj: 'ગુજરાત સ્પોટ્સ એન્ડ ફર્નિચર વર્ક્સ, પાલનપુર',
    nameEng: 'Gujarat Sports & Furniture Works',
    mobile: '94260 67890',
    addressGuj: 'હાઇવે રોડ, પાલનપુર, જી. બનાસકાંઠા',
    notesGuj: 'રમતગમત સાધનો અને કમ્પ્યુટર ટેબલ સપ્લાયર.',
    createdAt: '2026-04-01T00:00:00Z'
  }
];

export const SAMPLE_PAYABLES: PayableItem[] = [
  {
    id: 'pay_001',
    supplierId: 'sup_001',
    supplierNameGuj: 'શ્રી રામદેવ સ્ટેશનરી એન્ડ બુક ડેપો, અંબાજી',
    supplierMobile: '98250 12345',
    billNumber: 'BILL-1245',
    purchaseDate: '2026-08-10',
    dueDate: '2026-09-10',
    financialYear: '2026-27',
    headId: 'head_02',
    headNameGuj: 'TLM શૈક્ષણિક સાધન સાહિત્ય ગ્રાન્ટ (TLM Grant)',
    particularGuj: 'શાળા કાર્યાલય માટે પ્રિન્ટિંગ પેપર બોક્સ અને રજિસ્ટર ઉધાર ખરીદી',
    quantity: 10,
    unit: 'Box',
    totalAmount: 10000,
    paidAmount: 7000,
    remainingAmount: 3000,
    status: 'partially_paid',
    remarksGuj: 'પ્રથમ આંશિક ચુકવણી UPI દ્વારા થયેલ.',
    payments: [
      {
        id: 'pay_sub_101',
        payableId: 'pay_001',
        paymentDate: '2026-08-15',
        amount: 3000,
        paymentMode: 'UPI',
        referenceNo: 'UPI-99081234',
        remarksGuj: 'પ્રથમ આંશિક હપ્તો જમા',
        createdAt: '2026-08-15T10:00:00Z'
      },
      {
        id: 'pay_sub_102',
        payableId: 'pay_001',
        paymentDate: '2026-08-20',
        amount: 4000,
        paymentMode: 'Bank',
        referenceNo: 'NEFT-441029',
        remarksGuj: 'બીજો હપ્તો બેંક ટ્રાન્સફર',
        createdAt: '2026-08-20T14:00:00Z'
      }
    ],
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-08-20T14:00:00Z'
  },
  {
    id: 'pay_002',
    supplierId: 'sup_002',
    supplierNameGuj: 'ગુજરાત સ્પોટ્સ એન્ડ ફર્નિચર વર્ક્સ, પાલનપુર',
    supplierMobile: '94260 67890',
    billNumber: 'SPT-9081',
    purchaseDate: '2026-07-01',
    dueDate: '2026-08-01',
    financialYear: '2026-27',
    headId: 'head_03',
    headNameGuj: 'રમતગમત ગ્રાન્ટ (Sports Grant)',
    particularGuj: 'પ્રાથમિક શાળા રમતગમત કિટ અને કિકબોર્ડ ઉધાર ખરીદી',
    quantity: 1,
    unit: 'Kit',
    totalAmount: 15000,
    paidAmount: 5000,
    remainingAmount: 10000,
    status: 'overdue', // Past due date & remaining > 0
    remarksGuj: 'સમયમર્યાદા પૂર્ણ થયેલ ઓવરડ્યુ ઉધારી.',
    payments: [
      {
        id: 'pay_sub_201',
        payableId: 'pay_002',
        paymentDate: '2026-07-15',
        amount: 5000,
        paymentMode: 'Cash',
        remarksGuj: 'એડવાન્સ ચુકવણી',
        createdAt: '2026-07-15T11:00:00Z'
      }
    ],
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-15T11:00:00Z'
  }
];

export const SAMPLE_VOUCHERS: Voucher[] = [
  {
    id: 'vch_101',
    voucherNo: 'VCH-2026-0001',
    voucherType: 'purchase',
    date: '2026-08-22',
    schoolNameGuj: 'અંબાજી પ્રાથમિક શાળા નંબર ૧',
    udiseCode: '24020104501',
    academicYear: '2026-27',
    payeeNameGuj: 'શ્રી રામદેવ કમ્પ્યુટર્સ, પાલનપુર',
    payeeMobile: '98250 12345',
    particularGuj: 'શાળા કાર્યાલય માટે પ્રિન્ટર ખરીદી પેટે ચુકવણી.',
    amount: 14500,
    amountInWordsGuj: 'અક્ષરે રૂપિયા ચૌદ હજાર પાંચસો પુરા',
    paymentMode: 'UPI',
    grantTypeGuj: 'કમ્પોઝિટ સ્કૂલ ગ્રાન્ટ (Composite Grant)',
    billNumber: 'HP-88902',
    remarksGuj: 'બિલ નંબર HP-88902 સાથે જોડાયેલ.',
    createdAt: '2026-08-22T14:30:00Z'
  }
];

export const SAMPLE_PAPER_TEMPLATES: PaperTemplate[] = [
  {
    id: 'paper_1',
    type: 'Question Paper',
    titleGuj: 'દ્વિતીય સત્રાંત પરીક્ષા પ્રશ્નપત્ર - ધોરણ ૫ ગુજરાતી',
    titleEng: 'Standard 5 Gujarati Exam Paper',
    descriptionGuj: 'પ્રાથમિક શાળા દ્વિતીય સત્રાંત કસોટી ૪૦ ગુણ માટેનું પ્રશ્નપત્ર.',
    standardGuj: 'ધોરણ ૫',
    subjectGuj: 'ગુજરાતી',
    totalMarks: 40,
    timeDurationGuj: '૨ કલાક',
    sectionsGuj: [
      {
        headingGuj: 'પ્રશ્ન ૧. નીચેના પ્રશ્નોના એક-બે વાક્યમાં ઉત્તર લખો. (ગુણ ૫)',
        questionsGuj: [
          'કવિએ પ્રકૃતિના કયા કયા તત્વોનો ઉલ્લેખ કર્યો છે?',
          'લોકમેળામાં બાળકો કયા રમકડાં ખરીદે છે?',
          'ગાંધીજીનું બાળપણ ક્યાં વીત્યું હતું?'
        ]
      }
    ]
  }
];

export const SAMPLE_SAVED_DOCUMENTS: SavedDocumentItem[] = [
  {
    id: 'doc_101',
    category: 'Patrak',
    titleGuj: 'પત્રક - અ (પ્રગતિ પત્રક - ધોરણ ૫ અંબાજી)',
    subtitleGuj: 'પત્રક ૧ • Version A',
    status: 'completed',
    isFavorite: true,
    versionCode: 'Version A',
    createdAt: '2026-08-24T10:00:00Z',
    updatedAt: '2026-08-24T10:00:00Z',
    payload: {}
  }
];
