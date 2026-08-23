import { 
  SchoolProfile, 
  TeacherProfile, 
  Student, 
  GrantAccount, 
  RojmelTransaction, 
  PurchaseItem, 
  PmPoshanDailyRecord, 
  Question, 
  QuestionPaper, 
  LessonPlan,
  MonthlyLessonPlan,
  DailyLessonActivity,
  DailySubTask,
  CommunityPost,
  OfficialDocument,
  AppBanner,
  DynamicHomeCard,
  FeatureFlag,
  FeaturePack,
  AdminCredentials,
  AdminAuditLog,
  TeacherUploadedTemplate,
  ResourceReview,
  WeeklyClassPeriod,
  SchoolWeeklyEvent,
  TeacherStory,
  TeachingReel,
  TeacherGroup
} from '../types';

export const INITIAL_SCHOOL_PROFILE: SchoolProfile = {
  id: 'sch-001',
  schoolName: 'શ્રી પ્રાથમિક શાળા, હિંમતનગર',
  village: 'હિંમતનગર',
  taluka: 'હિંમતનગર',
  district: 'સાબરકાંઠા',
  udiseCode: '24050101501',
  schoolIndexNo: 'SK-HMT-084',
  address: 'સ્ટેશન રોડ, હિંમતનગર, જિ. સાબરકાંઠા - ૩૮૩૦૦૧',
  phone: '02772-245890',
  email: 'prathmik.shala.hmt@gujgov.edu.in',
  principalName: 'હરેશભાઈ એન. પટેલ (HTAT)',
  academicYear: '૨૦૨૫-૨૬',
  medium: 'ગુજરાતી'
};

export const INITIAL_TEACHER_PROFILE: TeacherProfile = {
  id: 'tch-101',
  name: 'ભાવિનકુમાર એમ. પરમાર',
  mobile: '9876543210',
  role: 'શિક્ષક',
  standardsTaught: ['ધોરણ ૬', 'ધોરણ ૭', 'ધોરણ ૮'],
  subjectsTaught: ['ગણિત', 'વિજ્ઞાન', 'સામાજિક વિજ્ઞાન'],
  experienceYears: 12,
  schoolName: 'શ્રી પ્રાથમિક શાળા, હિંમતનગર',
  district: 'સાબરકાંઠા',
  taluka: 'હિંમતનગર',
  contributionsCount: 8,
  savedResourcesCount: 14,
  badges: ['સહાયક શિક્ષક (Helpful Teacher)', 'પ્રશ્ન રચયિતા (Question Creator)', 'સત્યાપિત શિક્ષક (Verified)']
};

export const GUJARAT_DISTRICTS = [
  'સાબરકાંઠા', 'અમદાવાદ', 'ગાંધીનગર', 'મહેસાણા', 'બનાસકાંઠા', 'પાટણ', 'અરવલ્લી',
  'રાજકોટ', 'સુરત', 'વડોદરા', 'ભાવનગર', 'જામનગર', 'જૂનાગઢ', 'કચ્છ', 'ખેડા',
  'આણંદ', 'ભરૂચ', 'નર્મદા', 'નવસારી', 'વલસાડ', 'ડાંગ', 'તાપી', 'અમરેલી',
  'સુરેન્દ્રનગર', 'મોરબી', 'પોરબંદર', 'ગીર સોમનાથ', 'દેવભૂમિ દ્વારકા', 'બોટાદ',
  'મહીસાગર', 'દાહોદ', 'પંચમહાલ', 'છોટા ઉદેપુર'
];

export const STANDARDS_LIST = [
  'ધોરણ ૧', 'ધોરણ ૨', 'ધોરણ ૩', 'ધોરણ ૪', 
  'ધોરણ ૫', 'ધોરણ ૬', 'ધોરણ ૭', 'ધોરણ ૮'
];

export const SUBJECTS_LIST = [
  'ગુજરાતી (પ્રથમ ભાષા)', 'ગણિત', 'વિજ્ઞાન', 'સામાજિક વિજ્ઞાન', 
  'અંગ્રેજી (દ્વિતીય ભાષા)', 'હિન્દી', 'સંસ્કૃત', 'પર્યાવરણ / આસપાસ', 'શારીરિક શિક્ષણ'
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    grNo: '1420',
    rollNo: 1,
    fullName: 'પટેલ આયુષ સંજયભાઈ',
    gender: 'કુમાર',
    dob: '2013-05-14',
    standard: '6',
    division: 'A',
    parentName: 'સંજયભાઈ પટેલ',
    mobile: '9825011223',
    category: 'સામાન્ય',
    medium: 'ગુજરાતી',
    isActive: true,
    patrakAMarks: { 'ગણિત': 38, 'વિજ્ઞાન': 36, 'ગુજરાતી': 35 },
    patrakBGrades: { 'નિયમિતતા': 'A', 'સ્વચ્છતા': 'A', 'સહકાર': 'A' },
    patrakCMarks: { 'ગણિત': 74, 'વિજ્ઞાન': 71, 'ગુજરાતી': 68 }
  },
  {
    id: 'std-2',
    grNo: '1421',
    rollNo: 2,
    fullName: 'પ્રજાપતિ દિયા મહેશભાઈ',
    gender: 'કન્યા',
    dob: '2013-08-22',
    standard: '6',
    division: 'A',
    parentName: 'મહેશભાઈ પ્રજાપતિ',
    mobile: '9825122334',
    category: 'ઓ.બી.સી.',
    medium: 'ગુજરાતી',
    isActive: true,
    patrakAMarks: { 'ગણિત': 39, 'વિજ્ઞાન': 38, 'ગુજરાતી': 37 },
    patrakBGrades: { 'નિયમિતતા': 'A', 'સ્વચ્છતા': 'A', 'સહકાર': 'A' },
    patrakCMarks: { 'ગણિત': 78, 'વિજ્ઞાન': 76, 'ગુજરાતી': 72 }
  },
  {
    id: 'std-3',
    grNo: '1422',
    rollNo: 3,
    fullName: 'સોલંકી હર્ષ રાજેશભાઈ',
    gender: 'કુમાર',
    dob: '2013-01-10',
    standard: '6',
    division: 'A',
    parentName: 'રાજેશભાઈ સોલંકી',
    mobile: '9825233445',
    category: 'એસ.સી.',
    medium: 'ગુજરાતી',
    isActive: true,
    patrakAMarks: { 'ગણિત': 32, 'વિજ્ઞાન': 34, 'ગુજરાતી': 30 },
    patrakBGrades: { 'નિયમિતતા': 'B', 'સ્વચ્છતા': 'A', 'સહકાર': 'B' },
    patrakCMarks: { 'ગણિત': 62, 'વિજ્ઞાન': 65, 'ગુજરાતી': 59 }
  },
  {
    id: 'std-4',
    grNo: '1423',
    rollNo: 4,
    fullName: 'પરમાર પ્રિયા વિનોદભાઈ',
    gender: 'કન્યા',
    dob: '2013-11-04',
    standard: '6',
    division: 'A',
    parentName: 'વિનોદભાઈ પરમાર',
    mobile: '9825344556',
    category: 'ઓ.બી.સી.',
    medium: 'ગુજરાતી',
    isActive: true,
    patrakAMarks: { 'ગણિત': 35, 'વિજ્ઞાન': 37, 'ગુજરાતી': 36 },
    patrakBGrades: { 'નિયમિતતા': 'A', 'સ્વચ્છતા': 'A', 'સહકાર': 'A' },
    patrakCMarks: { 'ગણિત': 69, 'વિજ્ઞાન': 73, 'ગુજરાતી': 70 }
  },
  {
    id: 'std-5',
    grNo: '1424',
    rollNo: 5,
    fullName: 'વાઘેલા ધૈર્ય મુકેશભાઈ',
    gender: 'કુમાર',
    dob: '2013-03-19',
    standard: '6',
    division: 'A',
    parentName: 'મુકેશભાઈ વાઘેલા',
    mobile: '9825455667',
    category: 'સામાન્ય',
    medium: 'ગુજરાતી',
    isActive: true,
    patrakAMarks: { 'ગણિત': 36, 'વિજ્ઞાન': 35, 'ગુજરાતી': 34 },
    patrakBGrades: { 'નિયમિતતા': 'A', 'સ્વચ્છતા': 'B', 'સહકાર': 'A' },
    patrakCMarks: { 'ગણિત': 70, 'વિજ્ઞાન': 68, 'ગુજરાતી': 66 }
  },
  {
    id: 'std-6',
    grNo: '1425',
    rollNo: 6,
    fullName: 'જોષી વૈદેહી જીતેન્દ્રભાઈ',
    gender: 'કન્યા',
    dob: '2013-09-30',
    standard: '6',
    division: 'A',
    parentName: 'જીતેન્દ્રભાઈ જોષી',
    mobile: '9825566778',
    category: 'સામાન્ય',
    medium: 'ગુજરાતી',
    isActive: true,
    patrakAMarks: { 'ગણિત': 40, 'વિજ્ઞાન': 39, 'ગુજરાતી': 39 },
    patrakBGrades: { 'નિયમિતતા': 'A', 'સ્વચ્છતા': 'A', 'સહકાર': 'A' },
    patrakCMarks: { 'ગણિત': 79, 'વિજ્ઞાન': 78, 'ગુજરાતી': 77 }
  },
  {
    id: 'std-7',
    grNo: '1380',
    rollNo: 1,
    fullName: 'રાવલ કરણ દીપકભાઈ',
    gender: 'કુમાર',
    dob: '2012-04-15',
    standard: '7',
    division: 'A',
    parentName: 'દીપકભાઈ રાવલ',
    mobile: '9825677889',
    category: 'સામાન્ય',
    medium: 'ગુજરાતી',
    isActive: true,
    patrakAMarks: { 'ગણિત': 37, 'વિજ્ઞાન': 36, 'સામાજિક વિજ્ઞાન': 35 },
    patrakBGrades: { 'નિયમિતતા': 'A', 'સ્વચ્છતા': 'A', 'સહકાર': 'A' },
    patrakCMarks: { 'ગણિત': 72, 'વિજ્ઞાન': 70, 'સામાજિક વિજ્ઞાન': 68 }
  },
  {
    id: 'std-8',
    grNo: '1381',
    rollNo: 2,
    fullName: 'ચૌધરી રિદ્ધિ અશોકભાઈ',
    gender: 'કન્યા',
    dob: '2012-07-28',
    standard: '7',
    division: 'A',
    parentName: 'અશોકભાઈ ચૌધરી',
    mobile: '9825788990',
    category: 'ઓ.બી.સી.',
    medium: 'ગુજરાતી',
    isActive: true,
    patrakAMarks: { 'ગણિત': 38, 'વિજ્ઞાન': 39, 'સામાજિક વિજ્ઞાન': 38 },
    patrakBGrades: { 'નિયમિતતા': 'A', 'સ્વચ્છતા': 'A', 'સહકાર': 'A' },
    patrakCMarks: { 'ગણિત': 75, 'વિજ્ઞાન': 77, 'સામાજિક વિજ્ઞાન': 74 }
  },
  {
    id: 'std-9',
    grNo: '1320',
    rollNo: 1,
    fullName: 'મકવાણા આકાશ કલ્પેશભાઈ',
    gender: 'કુમાર',
    dob: '2011-06-12',
    standard: '8',
    division: 'A',
    parentName: 'કલ્પેશભાઈ મકવાણા',
    mobile: '9825899001',
    category: 'એસ.સી.',
    medium: 'ગુજરાતી',
    isActive: true,
    patrakAMarks: { 'ગણિત': 34, 'વિજ્ઞાન': 35, 'ગુજરાતી': 33 },
    patrakBGrades: { 'નિયમિતતા': 'A', 'સ્વચ્છતા': 'A', 'સહકાર': 'A' },
    patrakCMarks: { 'ગણિત': 66, 'વિજ્ઞાન': 68, 'ગુજરાતી': 64 }
  },
  {
    id: 'std-10',
    grNo: '1321',
    rollNo: 2,
    fullName: 'શાહ માનસી નિલેશભાઈ',
    gender: 'કન્યા',
    dob: '2011-12-05',
    standard: '8',
    division: 'A',
    parentName: 'નિલેશભાઈ શાહ',
    mobile: '9825900112',
    category: 'સામાન્ય',
    medium: 'ગુજરાતી',
    isActive: true,
    patrakAMarks: { 'ગણિત': 40, 'વિજ્ઞાન': 40, 'ગુજરાતી': 38 },
    patrakBGrades: { 'નિયમિતતા': 'A', 'સ્વચ્છતા': 'A', 'સહકાર': 'A' },
    patrakCMarks: { 'ગણિત': 80, 'વિજ્ઞાન': 79, 'ગુજરાતી': 76 }
  }
];

export const INITIAL_GRANTS: GrantAccount[] = [
  {
    id: 'grnt-1',
    grantName: 'Composite School Grant',
    gujaratiName: 'કોમ્પોઝીટ સ્કૂલ ગ્રાન્ટ',
    sanctionedAmount: 50000,
    openingBalance: 50000,
    currentBalance: 29500,
    description: 'શાળા સુધારણા, સ્ટેશનરી, સમારકામ અને વીજળી ખર્ચ માટે'
  },
  {
    id: 'grnt-2',
    grantName: 'Sports Grant',
    gujaratiName: 'રમત-ગમત સાધન ગ્રાન્ટ (Sports)',
    sanctionedAmount: 10000,
    openingBalance: 10000,
    currentBalance: 8200,
    description: 'વિદ્યાર્થીઓ માટે સ્પોર્ટ્સ સાધન સામગ્રી ખરીદી'
  },
  {
    id: 'grnt-3',
    grantName: 'Swachhata Action Plan Grant',
    gujaratiName: 'સ્વચ્છતા એક્શન પ્લાન ગ્રાન્ટ',
    sanctionedAmount: 7500,
    openingBalance: 7500,
    currentBalance: 4750,
    description: 'શાળા અને શૌચાલય સ્વચ્છતા, સાબુ, ફિનાઈલ સાધનો'
  },
  {
    id: 'grnt-4',
    grantName: 'TLM / Teaching Aid Grant',
    gujaratiName: 'TLM શૈક્ષણિક સાધન સહાય ગ્રાન્ટ',
    sanctionedAmount: 8000,
    openingBalance: 8000,
    currentBalance: 6300,
    description: 'શિક્ષકો માટે પ્રવૃત્તિ અને TLM ચાર્ટ્સ ખરીદી'
  },
  {
    id: 'grnt-5',
    grantName: 'Library Grant',
    gujaratiName: 'પુસ્તકાલય ગ્રાન્ટ (Library)',
    sanctionedAmount: 6000,
    openingBalance: 6000,
    currentBalance: 5000,
    description: 'વાર્તા પુસ્તકો, બાળ સાહિત્ય તથા સંદર્ભ પુસ્તકો'
  }
];

export const INITIAL_ROJMEL_TRANSACTIONS: RojmelTransaction[] = [
  {
    id: 'roj-1',
    accountId: 'grnt-1',
    grantHead: 'કોમ્પોઝીટ સ્કૂલ ગ્રાન્ટ',
    date: '2026-08-01',
    voucherNo: 'V-2026-01',
    description: 'વાર્ષિક કોમ્પોઝિટ ગ્રાન્ટ જમા (બેંક ખાતામાં)',
    income: 50000,
    expense: 0,
    paymentMode: 'બેંક ટ્રાન્સફર',
    referenceNo: 'PFMS-TR-90812',
    remarks: 'SSA ગાંધીનગર તરફથી ફાળવણી',
    createdBy: 'હરેશભાઈ પટેલ',
    status: 'સક્રિય'
  },
  {
    id: 'roj-2',
    accountId: 'grnt-1',
    grantHead: 'કોમ્પોઝીટ સ્કૂલ ગ્રાન્ટ',
    date: '2026-08-05',
    voucherNo: 'V-2026-02',
    description: 'A4 ઝેરોક્ષ પેપર રીમ (૫ નંગ) અને પરીક્ષા સ્ટેશનરી',
    income: 0,
    expense: 1450,
    paymentMode: 'ચેક',
    referenceNo: 'CHQ-554201',
    remarks: 'વૃંદા ઝેરોક્ષ એન્ડ સ્ટેશનરી, બિલ નં. 1204',
    createdBy: 'ભાવિનકુમાર પરમાર',
    status: 'સક્રિય'
  },
  {
    id: 'roj-3',
    accountId: 'grnt-1',
    grantHead: 'કોમ્પોઝીટ સ્કૂલ ગ્રાન્ટ',
    date: '2026-08-10',
    voucherNo: 'V-2026-03',
    description: 'વર્ગખંડ ટ્યુબલાઇટ અને પંખા રિપેરિંગ મજૂરી',
    income: 0,
    expense: 1850,
    paymentMode: 'રોકડ',
    referenceNo: 'REC-341',
    remarks: 'જય અંબે ઇલેક્ટ્રિકલ્સ, હિંમતનગર',
    createdBy: 'હરેશભાઈ પટેલ',
    status: 'સક્રિય'
  },
  {
    id: 'roj-4',
    accountId: 'grnt-2',
    grantHead: 'રમત-ગમત સાધન ગ્રાન્ટ (Sports)',
    date: '2026-08-12',
    voucherNo: 'V-2026-04',
    description: 'વોલીબોલ, કેરમ બોર્ડ અને સ્કીપિંગ રોપ ખરીદી',
    income: 0,
    expense: 1800,
    paymentMode: 'ચેક',
    referenceNo: 'CHQ-554202',
    remarks: 'નેશનલ સ્પોર્ટ્સ હિંમતનગર, બિલ નં. 892',
    createdBy: 'ભાવિનકુમાર પરમાર',
    status: 'સક્રિય'
  },
  {
    id: 'roj-5',
    accountId: 'grnt-3',
    grantHead: 'સ્વચ્છતા એક્શન પ્લાન ગ્રાન્ટ',
    date: '2026-08-15',
    voucherNo: 'V-2026-05',
    description: 'ટોયલેટ ક્લીનર, ફિનાઈલ કેન (૫ લિટર) અને ઝાડુ',
    income: 0,
    expense: 2750,
    paymentMode: 'રોકડ',
    referenceNo: 'REC-552',
    remarks: 'શ્રીજી એન્ટરપ્રાઈઝ, હિંમતનગર',
    createdBy: 'હરેશભાઈ પટેલ',
    status: 'સક્રિય'
  },
  {
    id: 'roj-6',
    accountId: 'grnt-4',
    grantHead: 'TLM શૈક્ષણિક સાધન સહાય ગ્રાન્ટ',
    date: '2026-08-18',
    voucherNo: 'V-2026-06',
    description: 'વિજ્ઞાન મોડેલ ચાર્ટ્સ અને ગણિત કીટ સામગ્રી',
    income: 0,
    expense: 1700,
    paymentMode: 'ડિજિટલ/PFMS',
    referenceNo: 'UPI-98440122',
    remarks: 'સરસ્વતી બુક ડેપો, બિલ નં. 441',
    createdBy: 'ભાવિનકુમાર પરમાર',
    status: 'સક્રિય'
  }
];

export const INITIAL_PURCHASES: PurchaseItem[] = [
  {
    id: 'pur-1',
    date: '2026-08-05',
    itemName: 'A4 પેપર રીમ (JK Copier 75 GSM)',
    quantity: 5,
    unit: 'રીમ',
    rate: 290,
    total: 1450,
    grantHead: 'કોમ્પોઝીટ સ્કૂલ ગ્રાન્ટ',
    vendorName: 'વૃંદા ઝેરોક્ષ એન્ડ સ્ટેશનરી, હિંમતનગર',
    billNo: '1204',
    remarks: 'એકમ કસોટી અને પત્રક પ્રિન્ટ માટે',
    voucherCreated: true
  },
  {
    id: 'pur-2',
    date: '2026-08-12',
    itemName: 'વોલીબોલ (Nivia) + નેટ સેટ',
    quantity: 2,
    unit: 'નંગ',
    rate: 900,
    total: 1800,
    grantHead: 'રમત-ગમત સાધન ગ્રાન્ટ (Sports)',
    vendorName: 'નેશનલ સ્પોર્ટ્સ, હિંમતનગર',
    billNo: '892',
    remarks: 'પ્રાથમિક વિભાગ રમત સ્પર્ધા તૈયારી',
    voucherCreated: true
  },
  {
    id: 'pur-3',
    date: '2026-08-15',
    itemName: 'ફિનાઈલ કેન (૫ લિટર) + હાર્પિક + હેન્ડવોશ',
    quantity: 1,
    unit: 'સેટ',
    rate: 2750,
    total: 2750,
    grantHead: 'સ્વચ્છતા એક્શન પ્લાન ગ્રાન્ટ',
    vendorName: 'શ્રીજી એન્ટરપ્રાઈઝ, હિંમતનગર',
    billNo: '552',
    remarks: 'શાળા સંકુલ સ્વચ્છતા પખવાડિયું',
    voucherCreated: true
  },
  {
    id: 'pur-4',
    date: '2026-08-18',
    itemName: 'વિજ્ઞાન ચાર્ટ્સ અને લેમિનેટેડ નકશા સેટ',
    quantity: 1,
    unit: 'સેટ',
    rate: 1700,
    total: 1700,
    grantHead: 'TLM શૈક્ષણિક સાધન સહાય ગ્રાન્ટ',
    vendorName: 'સરસ્વતી બુક ડેપો, હિંમતનગર',
    billNo: '441',
    remarks: 'ધોરણ ૬ થી ૮ પ્રયોગશાળા માટે',
    voucherCreated: true
  },
  {
    id: 'pur-5',
    date: '2026-08-20',
    itemName: 'વાર્ષિક હાજરી પત્રક અને સાદા રજિસ્ટર',
    quantity: 12,
    unit: 'નંગ',
    rate: 65,
    total: 780,
    grantHead: 'કોમ્પોઝીટ સ્કૂલ ગ્રાન્ટ',
    vendorName: 'વૃંદા ઝેરોક્ષ એન્ડ સ્ટેશનરી, હિંમતનગર',
    billNo: '1288',
    remarks: 'વર્ગ શિક્ષક હાજરી પત્રક',
    voucherCreated: false
  }
];

export const INITIAL_PM_POSHAN_LOGS: PmPoshanDailyRecord[] = [
  {
    id: 'pm-1',
    date: '2026-08-16',
    primaryCount: 42,
    upperPrimaryCount: 38,
    totalStudents: 80,
    grainRatePrimary: 0.100,
    grainRateUpperPrimary: 0.150,
    cookingRatePrimary: 5.45,
    cookingRateUpperPrimary: 8.17,
    grainUsedKg: (42 * 0.100) + (38 * 0.150), // 4.2 + 5.7 = 9.9 kg
    totalCookingCost: Number(((42 * 5.45) + (38 * 8.17)).toFixed(2)), // 228.9 + 310.46 = 539.36
    menuItem: 'વેજ પુલાવ + છાશ + સુખડી',
    remarks: 'બાળકોએ ઉત્સાહપૂર્વક ભોજન લીધું'
  },
  {
    id: 'pm-2',
    date: '2026-08-17',
    primaryCount: 40,
    upperPrimaryCount: 36,
    totalStudents: 76,
    grainRatePrimary: 0.100,
    grainRateUpperPrimary: 0.150,
    cookingRatePrimary: 5.45,
    cookingRateUpperPrimary: 8.17,
    grainUsedKg: (40 * 0.100) + (36 * 0.150), // 4.0 + 5.4 = 9.4 kg
    totalCookingCost: Number(((40 * 5.45) + (36 * 8.17)).toFixed(2)), // 218.0 + 294.12 = 512.12
    menuItem: 'દાળ-ભાત + ચણા ચાટ',
    remarks: 'સ્વચ્છતા સાથે વિતરણ'
  },
  {
    id: 'pm-3',
    date: '2026-08-18',
    primaryCount: 44,
    upperPrimaryCount: 39,
    totalStudents: 83,
    grainRatePrimary: 0.100,
    grainRateUpperPrimary: 0.150,
    cookingRatePrimary: 5.45,
    cookingRateUpperPrimary: 8.17,
    grainUsedKg: (44 * 0.100) + (39 * 0.150), // 4.4 + 5.85 = 10.25 kg
    totalCookingCost: Number(((44 * 5.45) + (39 * 8.17)).toFixed(2)),
    menuItem: 'થેપલાં + બટાટા શાક',
    remarks: 'ગુણવત્તા ઉત્તમ'
  },
  {
    id: 'pm-4',
    date: '2026-08-19',
    primaryCount: 41,
    upperPrimaryCount: 37,
    totalStudents: 78,
    grainRatePrimary: 0.100,
    grainRateUpperPrimary: 0.150,
    cookingRatePrimary: 5.45,
    cookingRateUpperPrimary: 8.17,
    grainUsedKg: (41 * 0.100) + (37 * 0.150),
    totalCookingCost: Number(((41 * 5.45) + (37 * 8.17)).toFixed(2)),
    menuItem: 'દાળ-ઢોકળી + લીલી ડુંગળી',
    remarks: 'બાળકોની સંપૂર્ણ હાજરી'
  },
  {
    id: 'pm-5',
    date: '2026-08-20',
    primaryCount: 45,
    upperPrimaryCount: 40,
    totalStudents: 85,
    grainRatePrimary: 0.100,
    grainRateUpperPrimary: 0.150,
    cookingRatePrimary: 5.45,
    cookingRateUpperPrimary: 8.17,
    grainUsedKg: (45 * 0.100) + (40 * 0.150),
    totalCookingCost: Number(((45 * 5.45) + (40 * 8.17)).toFixed(2)),
    menuItem: 'ખીચડી-કઢી + મોહનથાળ (શુક્રવાર સ્પેશિયલ)',
    remarks: 'SMC સભ્યો દ્વારા નિરીક્ષણ'
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // Std 6 Maths
  {
    id: 'q-1',
    standard: 'ધોરણ ૬',
    subject: 'ગણિત',
    chapter: 'પ્રકરણ ૧: સંખ્યા પરિચય',
    topic: 'સંખ્યાઓની સરખામણી અને સ્થાનકિંમત',
    learningOutcome: 'વિદ્યાર્થી મોટી સંખ્યાઓનું વાચન-લેખન અને સ્થાનકિંમત સમજે છે.',
    type: 'mcq',
    difficulty: 'સરળ',
    marks: 1,
    questionText: 'સંખ્યા ૭૫,૮૨,૪૧૬ માં અંક "૮" ની સ્થાનકિંમત કેટલી થાય?',
    options: ['૮૦૦', '૮,૦૦૦', '૮૦,૦૦૦', '૮,૦૦,૦૦૦'],
    answer: '૮૦,૦૦૦',
    source: 'GCERT પાઠ્યપુસ્તક'
  },
  {
    id: 'q-2',
    standard: 'ધોરણ ૬',
    subject: 'ગણિત',
    chapter: 'પ્રકરણ ૨: પૂર્ણ સંખ્યાઓ',
    learningOutcome: 'વિદ્યાર્થી પૂર્ણ સંખ્યાઓના સરવાળા અને ગુણાકારના ગુણધર્મો જાણે છે.',
    type: 'true_false',
    difficulty: 'સરળ',
    marks: 1,
    questionText: 'સૌથી નાની પ્રાકૃતિક સંખ્યા ૦ છે.',
    answer: 'ખોટું (સૌથી નાની પ્રાકૃતિક સંખ્યા ૧ છે, ૦ એ પૂર્ણ સંખ્યા છે)',
    source: 'GCERT પાઠ્યપુસ્તક'
  },
  {
    id: 'q-3',
    standard: 'ધોરણ ૬',
    subject: 'ગણિત',
    chapter: 'પ્રકરણ ૩: સંખ્યા સાથે રમત',
    learningOutcome: 'લ.સા.અ. અને ગુ.સા.અ. ની ગણતરી કરે છે.',
    type: 'short',
    difficulty: 'મધ્યમ',
    marks: 2,
    questionText: 'સંખ્યા ૧૨, ૧૬ અને ૨૪ નો લઘુતમ સામાન્ય અવયવી (લ.સા.અ.) શોધો.',
    answer: '૧૨ = ૨ × ૨ × ૩, ૧૬ = ૨ × ૨ × ૨ × ૨, ૨૪ = ૨ × ૨ × ૨ × ૩. લ.સા.અ. = ૨ × ૨ × ૨ × ૨ × ૩ = ૪૮.',
    source: 'એકમ કસોટી બેંક'
  },
  {
    id: 'q-4',
    standard: 'ધોરણ ૬',
    subject: 'ગણિત',
    chapter: 'પ્રકરણ ૪: ભૂમિતિના પાયાના ખ્યાલો',
    type: 'fill_blank',
    difficulty: 'સરળ',
    marks: 1,
    questionText: 'રેખાખંડને બંને છેડે _______ અંત્યબિંદુઓ હોય છે.',
    answer: 'બે (૨)',
    source: 'GCERT પાઠ્યપુસ્તક'
  },
  {
    id: 'q-5',
    standard: 'ધોરણ ૬',
    subject: 'ગણિત',
    chapter: 'પ્રકરણ ૮: દશાંશ સંખ્યાઓ',
    type: 'long',
    difficulty: 'કઠિન',
    marks: 3,
    questionText: 'રમેશે ૪ કિગ્રા ૫૦૦ ગ્રામ બટાટા, ૨ કિગ્રા ૨૫૦ ગ્રામ ટામેટા અને ૧ કિગ્રા ૫૦ ગ્રામ મરચાં ખરીદ્યા. તો તેણે ખરીદેલા શાકભાજીનું કુલ વજન કિલોગ્રામમાં શોધો.',
    answer: 'કુલ વજન = ૪.૫૦૦ + ૨.૨૫૦ + ૧.૦૫૦ = ૭.૮૦૦ કિગ્રા (૭ કિગ્રા ૮૦૦ ગ્રામ).',
    source: 'GCERT પાઠ્યપુસ્તક'
  },

  // Std 6 Science
  {
    id: 'q-6',
    standard: 'ધોરણ ૬',
    subject: 'વિજ્ઞાન',
    chapter: 'પ્રકરણ ૧: ખોરાક: ક્યાંથી મળે છે?',
    type: 'mcq',
    difficulty: 'સરળ',
    marks: 1,
    questionText: 'નીચેનામાંથી કયો ઘટક વનસ્પતિજન્ય સ્ત્રોત નથી?',
    options: ['ઘઉં', 'દૂધ', 'તેલ', 'ચોખા'],
    answer: 'દૂધ',
    source: 'GCERT પાઠ્યપુસ્તક'
  },
  {
    id: 'q-7',
    standard: 'ધોરણ ૬',
    subject: 'વિજ્ઞાન',
    chapter: 'પ્રકરણ ૨: આહારના ઘટકો',
    learningOutcome: 'વિટામિન અને ખનીજક્ષારોની ઊણપથી થતા રોગો વર્ણવે છે.',
    type: 'short',
    difficulty: 'મધ્યમ',
    marks: 2,
    questionText: 'વિટામિન-A અને વિટામિન-C ની ખામીથી કયા રોગ થાય છે? તે જણાવો.',
    answer: 'વિટામિન-A ની ખામીથી રતાંધળાપણું (દ્રષ્ટિહીનતા) અને વિટામિન-C ની ખામીથી સ્કર્વી રોગ થાય છે.',
    source: 'GCERT પાઠ્યપુસ્તક'
  },
  {
    id: 'q-8',
    standard: 'ધોરણ ૬',
    subject: 'વિજ્ઞાન',
    chapter: 'પ્રકરણ ૪: વસ્તુઓના જૂથ બનાવવા',
    type: 'true_false',
    difficulty: 'સરળ',
    marks: 1,
    questionText: 'તેલ પાણીમાં સંપૂર્ણપણે ઓગળી જાય છે.',
    answer: 'ખોટું (તેલ અને પાણી મિશ્ર થતા નથી, તેલ પાણી પર તરે છે)',
    source: 'GCERT પાઠ્યપુસ્તક'
  },
  {
    id: 'q-9',
    standard: 'ધોરણ ૬',
    subject: 'વિજ્ઞાન',
    chapter: 'પ્રકરણ ૭: વનસ્પતિની જાણકારી મેળવીએ',
    type: 'long',
    difficulty: 'કઠિન',
    marks: 3,
    questionText: 'મૂળના મુખ્ય બે પ્રકારો જણાવી તેમના તફાવત ઉદાહરણ સાથે સમજાવો.',
    answer: '૧. સોટીમૂળ: જેમાં એક મુખ્ય મૂળ અને બાજુમાં પાતળા ઉપમૂળ હોય (દા.ત. લીમડો, વડ). ૨. તંતુમૂળ: જેમાં મુખ્ય મૂળ ન હોય પરંતુ એક જ જગ્યાએથી પાતળા તંતુઓ નીકળે (દા.ત. ઘઉં, મકાઈ, ઘાસ).',
    source: 'GCERT પાઠ્યપુસ્તક'
  },

  // Std 7 Maths & Science
  {
    id: 'q-10',
    standard: 'ધોરણ ૭',
    subject: 'ગણિત',
    chapter: 'પ્રકરણ ૧: પૂર્ણાંક સંખ્યાઓ',
    type: 'mcq',
    difficulty: 'સરળ',
    marks: 1,
    questionText: '(-૨૦) + (-૧૫) ની કિંમત કેટલી થાય?',
    options: ['-૫', '+૩૫', '-૩૫', '+૫'],
    answer: '-૩૫',
    source: 'GCERT પાઠ્યપુસ્તક'
  },
  {
    id: 'q-11',
    standard: 'ધોરણ ૭',
    subject: 'વિજ્ઞાન',
    chapter: 'પ્રકરણ ૨: પ્રાણીઓમાં પોષણ',
    type: 'short',
    difficulty: 'મધ્યમ',
    marks: 2,
    questionText: 'અમીબામાં ખોરાક ગ્રહણ અને પાચનની પ્રક્રિયા ટૂંકમાં સમજાવો.',
    answer: 'અમીબા ખોટા પગ (Pseudopodia) ફેલાવી ખોરાકના કણને ઘેરી લે છે અને અન્નધાની રચે છે, જ્યાં પાચક રસો દ્વારા ખોરાકનું પાચન થાય છે.',
    source: 'GCERT પાઠ્યપુસ્તક'
  },

  // Std 8 Gujarati & Social Science
  {
    id: 'q-12',
    standard: 'ધોરણ ૮',
    subject: 'ગુજરાતી (પ્રથમ ભાષા)',
    chapter: 'કાવ્ય ૧: તેરી હૈ ઝમીં / એક જ દે ચિનગારી',
    type: 'short',
    difficulty: 'સરળ',
    marks: 2,
    questionText: 'કવિ મહાનલ પાસે શું માંગે છે? શા માટે?',
    answer: 'કવિ મહાનલ (પરમાત્મા) પાસે માત્ર એક જ ચિનગારી (જ્ઞાન રૂપી પ્રકાશ) માંગે છે, જેથી તેમનું જીવન જ્ઞાનમય બની સાર્થક થાય.',
    source: 'GCERT પાઠ્યપુસ્તક'
  },
  {
    id: 'q-13',
    standard: 'ધોરણ ૮',
    subject: 'સામાજિક વિજ્ઞાન',
    chapter: 'પ્રકરણ ૧: ભારતમાં યુરોપિયનોનું આગમન',
    type: 'short',
    difficulty: 'મધ્યમ',
    marks: 2,
    questionText: 'ભારત આવવાનો જળમાર્ગ શોધનાર પોર્ટુગીઝ નાવિક કોણ હતો? તે ક્યારે ભારત પહોંચ્યો?',
    answer: 'ભારત આવવાનો જળમાર્ગ શોધનાર પોર્ટુગીઝ નાવિક વાસ્કો-દ-ગામા હતો. તે ઈ.સ. ૧૪૯૮ માં કાલીકટ બંદરે પહોંચ્યો હતો.',
    source: 'GCERT પાઠ્યપુસ્તક'
  },
  {
    id: 'q-14',
    standard: 'ધોરણ ૭',
    subject: 'સામાજિક વિજ્ઞાન',
    chapter: 'પ્રકરણ ૫: વનવાસી, વિચરતી જાતિઓ અને સમુદાય',
    type: 'fill_blank',
    difficulty: 'સરળ',
    marks: 1,
    questionText: 'ગોંડ રાજ્યના શાસક અમનદાસે _______ ની પદવી ધારણ કરી હતી.',
    answer: 'સંગ્રામ શાહ',
    source: 'GCERT પાઠ્યપુસ્તક'
  }
];

export const INITIAL_QUESTION_PAPERS: QuestionPaper[] = [
  {
    id: 'qp-001',
    title: 'ધોરણ ૬ ગણિત - એકમ કસોટી (PAT)',
    schoolName: 'શ્રી પ્રાથમિક શાળા, હિંમતનગર',
    standard: 'ધોરણ ૬',
    subject: 'ગણિત',
    examName: 'એકમ કસોટી (સામાયિક મૂલ્યાંકન)',
    academicYear: '૨૦૨૫-૨૬',
    totalMarks: 25,
    durationMinutes: 60,
    date: '2026-08-25',
    instructions: [
      'તમામ પ્રશ્નોના જવાબ આપવા ફરજિયાત છે.',
      'જમણી બાજુ દર્શાવેલ અંક પ્રશ્નના ગુણ દર્શાવે છે.',
      'સ્વચ્છ અને સુંદર અક્ષરે ઉત્તરો લખવા.'
    ],
    sections: [
      {
        sectionTitle: 'વિભાગ A: હેતુલક્ષી પ્રશ્નો (પ્રત્યેકનો ૧ ગુણ)',
        marksPerQuestion: 1,
        questions: [
          INITIAL_QUESTIONS[0],
          INITIAL_QUESTIONS[1],
          INITIAL_QUESTIONS[3]
        ]
      },
      {
        sectionTitle: 'વિભાગ B: ટૂંકજવાબી પ્રશ્નો (પ્રત્યેકના ૨ ગુણ)',
        marksPerQuestion: 2,
        questions: [
          INITIAL_QUESTIONS[2]
        ]
      },
      {
        sectionTitle: 'વિભાગ C: વિસ્તૃત પ્રશ્નો / દાખલા (પ્રત્યેકના ૩ ગુણ)',
        marksPerQuestion: 3,
        questions: [
          INITIAL_QUESTIONS[4]
        ]
      }
    ],
    createdAt: '2026-08-20'
  }
];

export const INITIAL_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'lp-1',
    date: '2026-08-23',
    standard: 'ધોરણ ૬',
    division: 'A',
    subject: 'ગણિત',
    unitNo: 3,
    chapterName: 'સંખ્યા સાથે રમત (અવિભાજ્ય અને વિભાજ્ય સંખ્યાઓ)',
    learningOutcome: 'વિદ્યાર્થીઓ અવિભાજ્ય અને વિભાજ્ય સંખ્યાઓનું વર્ગીકરણ કરે છે અને લ.સા.અ. ની સંકલ્પના સ્પષ્ટ કરે છે.',
    activity: 'કાંકરા / રંગીન પત્થરોની મદદથી જૂથ બનાવી અવયવ શોધવાની પ્રવૃત્તિ કરાવવી.',
    tlmUsed: 'સંખ્યા ચાર્ટ, રંગીન ગોળીઓ, ગણિત કીટ',
    homework: 'સ્વાધ્યાય ૩.૨ ના પ્રશ્ન ૧ થી ૫ નોટબુકમાં ગણવા.',
    remarks: 'તમામ વિદ્યાર્થીઓએ પ્રવૃત્તિમાં સક્રિય રસ લીધો.',
    status: 'પૂર્ણ'
  },
  {
    id: 'lp-2',
    date: '2026-08-24',
    standard: 'ધોરણ ૬',
    division: 'A',
    subject: 'વિજ્ઞાન',
    unitNo: 7,
    chapterName: 'વનસ્પતિની જાણકારી મેળવીએ',
    learningOutcome: 'સોટીમૂળ અને તંતુમૂળ વચ્ચેનો તફાવત પ્રત્યક્ષ છોડનું નિરીક્ષણ કરી વર્ણવે છે.',
    activity: 'શાળાના બગીચામાંથી ઘાસ અને નાના છોડ લાવી મૂળનું સૂક્ષ્મ નિરીક્ષણ કરાવવું.',
    tlmUsed: 'બિલોરી કાચ (મેગ્નિફાઇંગ ગ્લાસ), પ્રત્યક્ષ વનસ્પતિ નમૂના',
    homework: 'કોઈપણ બે સોટીમૂળ અને બે તંતુમૂળ ધરાવતી વનસ્પતિઓના પાન અને મૂળના ચિત્ર દોરવા.',
    remarks: 'આયોજન મુજબ સફળ રહ્યું.',
    status: 'આયોજિત'
  }
];

export const INITIAL_MONTHLY_LESSON_PLANS: MonthlyLessonPlan[] = [
  {
    id: 'mlp-001',
    month: 'ઓગસ્ટ ૨૦૨૬',
    academicYear: '૨૦૨૬-૨૭',
    standard: 'ધોરણ ૭',
    division: 'અ',
    subject: 'ગણિત',
    teacherName: 'ભાવિનકુમાર એમ. પરમાર',
    schoolName: 'શ્રી પ્રાથમિક શાળા, હિંમતનગર',
    unitsCovered: [
      'પ્રકરણ ૧: પૂર્ણાંક સંખ્યાઓ (Integers)',
      'પ્રકરણ ૨: અપૂર્ણાંક અને દશાંશ સંખ્યાઓ (Fractions & Decimals)'
    ],
    totalPlannedDays: 10,
    targetLearningOutcomes: [
      'M701: સંખ્યારેખા પર પૂર્ણાંક સંખ્યા દર્શાવે છે અને સરખામણી કરે છે.',
      'M702: પૂર્ણાંક સંખ્યાઓના સરવાળા અને બાદબાકીના નિયમોનો વ્યવહારમાં ઉપયોગ કરે છે.',
      'M703: પૂર્ણાંક સંખ્યાઓના ગુણાકાર અને ભાગાકારના ચિહ્ન નિયમો તારવે છે.',
      'M704: અપૂર્ણાંક સંખ્યાઓના ગુણાકાર અને ભાગાકારની સંકલ્પના સ્પષ્ટ કરે છે.'
    ],
    generalObjectives: 'વિદ્યાર્થીઓ પૂર્ણાંક અને અપૂર્ણાંક સંખ્યાઓની વ્યવહારિક સમજ મેળવે, TLM અને સંખ્યારેખા ચાર્ટ દ્વારા સંકલ્પના દ્રઢ કરે અને સત્રાંત કસોટી માટે સજ્જ બને.',
    status: 'સક્રિય',
    createdAt: '2026-08-01',
    updatedAt: '2026-08-22',
    dailyActivities: [
      {
        id: 'da-101',
        dayNumber: 1,
        date: '2026-08-03',
        periodNumber: 2,
        title: 'દિવસ ૧: પૂર્ણાંક સંખ્યાઓ - સંખ્યારેખા અને પરિચય',
        topic: 'ધન પૂર્ણાંકો, ઋણ પૂર્ણાંકો અને શૂન્યનું સ્થાન',
        learningOutcome: 'M701: સંખ્યારેખા પર પૂર્ણાંકો દર્શાવે છે.',
        teachingActivity: 'જમીન પર સંખ્યારેખા દોરી વિદ્યાર્થીઓને શૂન્યથી જમણી બાજુ (+) અને ડાબી બાજુ (-) ડગલાં ભરાવી પ્રત્યક્ષ અનુભવ આપવો.',
        tlmUsed: 'સંખ્યારેખા ચાર્ટ, ફ્લોર ગ્રીડ, નંબર કાર્ડ્સ',
        assessmentMethod: 'મૌખિક પ્રશ્નોત્તરી & બોર્ડ પર સંખ્યા નિરૂપણ',
        homework: 'પાઠ્યપુસ્તકના પાના નં. ૪ પરના પ્રયત્ન કરો ના ૫ પ્રશ્નો',
        status: 'પૂર્ણ',
        teacherNotes: 'તમામ બાળકોએ ઉત્સાહપૂર્વક સંખ્યારેખા પર કૂદકા લગાવી ઋણ સંખ્યાઓની સમજ મેળવી.',
        subTasks: [
          { id: 'st-101-1', taskTitle: 'પાછલા ધોરણના પૂર્વજ્ઞાનની ચકાસણી (પ્રાકૃતિક & પૂર્ણ સંખ્યાઓ)', isCompleted: true },
          { id: 'st-101-2', taskTitle: 'સંખ્યારેખા ચાર્ટનું વર્ગખંડમાં પ્રદર્શન અને ઋણ સંખ્યા સ્પષ્ટીકરણ', isCompleted: true },
          { id: 'st-101-3', taskTitle: 'વિદ્યાર્થીઓ પાસે બોર્ડ પર (-૫, +૩, ૦) સંખ્યાઓ અંકિત કરાવવી', isCompleted: true },
          { id: 'st-101-4', taskTitle: 'સ્વાધ્યાય ૧.૧ ના પ્રશ્ન ૧ અને ૨ નું વર્ગખંડ સોલ્યુશન', isCompleted: true },
          { id: 'st-101-5', taskTitle: 'દૈનિક શિક્ષક ડાયરી અને નોંધપોથીમાં એન્ટ્રી', isCompleted: true }
        ]
      },
      {
        id: 'da-102',
        dayNumber: 2,
        date: '2026-08-04',
        periodNumber: 2,
        title: 'દિવસ ૨: પૂર્ણાંક સંખ્યાઓના સરવાળા અને બાદબાકીના નિયમો',
        topic: 'સમાન ચિહ્ન અને વિરુદ્ધ ચિહ્ન વાળી સંખ્યાઓનો સરવાળો',
        learningOutcome: 'M702: પૂર્ણાંક સંખ્યાઓના સરવાળા-બાદબાકી નિયમોનો ઉપયોગ કરે છે.',
        teachingActivity: 'લાલ રંગના બટન (ઋણ) અને લીલા રંગના બટન (ધન) દ્વારા જોડી બનાવી શૂન્ય જોડી પદ્ધતિથી સરવાળા સમજાવવા.',
        tlmUsed: 'દ્વિરંગી ટોકન (લાલ/લીલા બટનો), ફ્લેશકાર્ડ',
        assessmentMethod: 'જોડી કાર્ય મૂલ્યાંકન (Peer evaluation)',
        homework: 'સ્વાધ્યાય ૧.૧ દાખલા ૩ અને ૪',
        status: 'પૂર્ણ',
        teacherNotes: 'બટન પદ્ધતિથી ઋણ સંખ્યાનો સરવાળો સરળતાથી સમજાયો.',
        subTasks: [
          { id: 'st-102-1', taskTitle: 'દ્વિરંગી ટોકન્સ (લાલ = ઋણ, લીલો = ધન) નું વિતરણ', isCompleted: true },
          { id: 'st-102-2', taskTitle: '(-૩) + (+૫) = +૨ ની ટોકન પ્રવૃત્તિ કરાવવી', isCompleted: true },
          { id: 'st-102-3', taskTitle: 'ચિહ્નોના નિયમનું બોર્ડ પર લેખન અને સૂત્ર ચાર્ટ', isCompleted: true },
          { id: 'st-102-4', taskTitle: 'વિદ્યાર્થીઓ દ્વારા પાંચ દાખલાની સ્લેટ પ્રેક્ટિસ', isCompleted: true },
          { id: 'st-102-5', taskTitle: 'ગૃહકાર્ય નોંધ અને તપાસણી', isCompleted: true }
        ]
      },
      {
        id: 'da-103',
        dayNumber: 3,
        date: '2026-08-06',
        periodNumber: 3,
        title: 'દિવસ ૩: પૂર્ણાંક સંખ્યાઓના સરવાળાના ગુણધર્મો',
        topic: 'સંવૃતતા, ક્રમનો નિયમ અને જૂથનો નિયમ',
        learningOutcome: 'M702: સરવાળાના વિવિધ ગુણધર્મો ચકાસે છે.',
        teachingActivity: 'વિદ્યાર્થીઓને ૩-૩ ના જૂથમાં વહેંચી અલગ અલગ સંખ્યાઓ આપી a+b = b+a ની સત્યાર્થતા ચકાસવા કહેવું.',
        tlmUsed: 'ગુણધર્મ ચાર્ટ, સંખ્યા પાસા (Dice)',
        assessmentMethod: 'ગ્રૂપ પ્રેઝન્ટેશન & ક્વિઝ',
        homework: 'સ્વાધ્યાય ૧.૨ ના પ્રશ્ન ૧ થી ૩',
        status: 'પૂર્ણ',
        teacherNotes: 'જૂથમાં ક્રમના નિયમની સરસ ચર્ચા થઈ.',
        subTasks: [
          { id: 'st-103-1', taskTitle: 'ગત દિવસના ગૃહકાર્યની ઝડપી ચકાસણી', isCompleted: true },
          { id: 'st-103-2', taskTitle: 'ક્રમના નિયમ (Commutative property) નું નિદર્શન', isCompleted: true },
          { id: 'st-103-3', taskTitle: 'જૂથ પ્રવૃત્તિ: પાસા ફેંકી મેળવેલ સંખ્યાઓ પર ગુણધર્મ ચકાસવો', isCompleted: true },
          { id: 'st-103-4', taskTitle: 'તટસ્થ ઘટક (શૂન્ય) ની વિભાવના સ્પષ્ટ કરવી', isCompleted: false, notifyReminder: true },
          { id: 'st-103-5', taskTitle: 'પત્રક A દૈનિક ઓબ્ઝર્વેશન માર્કિંગ', isCompleted: false, notifyReminder: true }
        ]
      },
      {
        id: 'da-104',
        dayNumber: 4,
        date: '2026-08-08',
        periodNumber: 2,
        title: 'દિવસ ૪: પૂર્ણાંક સંખ્યાઓનો ગુણાકાર',
        topic: 'ધન અને ઋણ સંખ્યાઓનો ગુણાકાર અને ચિહ્નોના નિયમ',
        learningOutcome: 'M703: પૂર્ણાંક ગુણાકારના નિયમો તારવે છે.',
        teachingActivity: 'પુનરાવર્તિત સરવાળા તરીકે ગુણાકાર સમજાવવો: ૩ × (-૪) = (-૪) + (-૪) + (-૪) = -૧૨.',
        tlmUsed: 'પૂર્ણાંક ગુણાકાર ગ્રીડ ચાર્ટ, પ્રોજેક્ટર સ્લાઈડ',
        assessmentMethod: 'સ્પીડ ટેસ્ટ (૨ મિનિટ રેપિડ ફાયર)',
        homework: 'સ્વાધ્યાય ૧.૩ ના પ્રશ્ન ૧ ના તમામ પેટા પ્રશ્નો',
        status: 'ચાલુ',
        teacherNotes: 'ઋણ ગુણ્યા ઋણ બરાબર ધન (+ ) ની વિભાવના પેટર્ન દ્વારા સમજાવી.',
        subTasks: [
          { id: 'st-104-1', taskTitle: 'પુનરાવર્તિત સરવાળાના ઉદાહરણોથી ગુણાકારની શરૂઆત', isCompleted: true },
          { id: 'st-104-2', taskTitle: 'પેટર્ન અવલોકન: ૩×(-૨)=-૬, ૨×(-૨)=-૪, ૧×(-૨)=-૨, ૦×(-૨)=૦, -૧×(-૨)=+૨', isCompleted: true },
          { id: 'st-104-3', taskTitle: 'સ્માર્ટબોર્ડ / ડિજિટલ એનિમેશન દ્વારા ગુણાકાર નિદર્શન', isCompleted: false, notifyReminder: true },
          { id: 'st-104-4', taskTitle: 'વિદ્યાર્થીઓ દ્વારા પાઠ્યપુસ્તકના ઉદાહરણોની ગણતરી', isCompleted: false, notifyReminder: true },
          { id: 'st-104-5', taskTitle: 'મુશ્કેલી અનુભવતા વિદ્યાર્થીઓ માટે ઉપચારાત્મક માર્ગદર્શન', isCompleted: false, notifyReminder: true }
        ]
      },
      {
        id: 'da-105',
        dayNumber: 5,
        date: '2026-08-10',
        periodNumber: 2,
        title: 'દિવસ ૫: પૂર્ણાંક સંખ્યાઓનો ભાગાકાર અને વ્યવહારિક કોયડા',
        topic: 'ભાગાકારના નિયમો અને રોજિંદા જીવનમાં તાપમાન/ઊંડાઈના દાખલા',
        learningOutcome: 'M703: પૂર્ણાંક ભાગાકાર અને વ્યવહારિક પ્રશ્નો ઉકેલે છે.',
        teachingActivity: 'લક્ષદ્વીપ અને કાશ્મીરના તાપમાનના તફાવત, ખાણની ઊંડાઈ આધારિત વ્યવહારિક કોયડા રચવા.',
        tlmUsed: 'થર્મોમીટર મોડેલ, વ્યવહારિક કાર્ડ્સ',
        assessmentMethod: 'વ્યવહારિક કોયડા ઉકેલ કસોટી',
        homework: 'સ્વાધ્યાય ૧.૪ પ્રશ્ન ૫, ૬ અને ૭',
        status: 'આયોજિત',
        subTasks: [
          { id: 'st-105-1', taskTitle: 'ભાગાકારના ચિહ્ન નિયમો (+ ÷ - = -, - ÷ - = +) નું પુનરાવર્તન', isCompleted: false, notifyReminder: true },
          { id: 'st-105-2', taskTitle: 'દર મિનિટે ૬ મીટર ખાણમાં ઉતરતી લિફ્ટનો વ્યવહારિક દાખલો ગણાવવો', isCompleted: false, notifyReminder: true },
          { id: 'st-105-3', taskTitle: 'વિદ્યાર્થીઓ દ્વારા જોડીમાં કૂટપ્રશ્નોનું વિશ્લેષણ', isCompleted: false },
          { id: 'st-105-4', taskTitle: 'પ્રકરણ ૧ નું સારાંશ રિવિઝન અને મુખ્ય સૂત્રોની ડાયરી નોંધ', isCompleted: false }
        ]
      },
      {
        id: 'da-106',
        dayNumber: 6,
        date: '2026-08-12',
        periodNumber: 3,
        title: 'દિવસ ૬: પ્રકરણ ૧ એકમ કસોટી (PAT) & મુશ્કેલી નિવારણ',
        topic: 'પ્રકરણ ૧ નું રચનાત્મક મૂલ્યાંકન (Formative Assessment)',
        learningOutcome: 'M701-M703: પ્રકરણ ૧ ના તમામ આઉટકમના મુલ્યાંકન',
        teachingActivity: '૧૫ ગુણની વર્ગખંડ ક્વિઝ અને ત્યારબાદ વિદ્યાર્થીઓની મુશ્કેલીઓનું બોર્ડ પર નિવારણ.',
        tlmUsed: 'પ્રશ્નપત્રિકા, મૂલ્યાંકન રુબ્રિક્સ',
        assessmentMethod: 'લેખિત એકમ કસોટી (૧૫ ગુણ)',
        homework: 'ભૂલો સુધારીને ફરીથી ગણતરી કરવી',
        status: 'આયોજિત',
        subTasks: [
          { id: 'st-106-1', taskTitle: '૧૫ ગુણની મોડેલ ટેસ્ટ પેપરની વહેંચણી', isCompleted: false },
          { id: 'st-106-2', taskTitle: 'સમયમર્યાદામાં શાંત વાતાવરણમાં કસોટી લેવી', isCompleted: false },
          { id: 'st-106-3', taskTitle: 'પેપર ચકાસણી અને ગુણ પત્રકમાં નોંધ', isCompleted: false },
          { id: 'st-106-4', taskTitle: 'નબળા પરિણામ વાળા બાળકો માટે રેમેડિયલ પ્લાન નક્કી કરવો', isCompleted: false }
        ]
      },
      {
        id: 'da-107',
        dayNumber: 7,
        date: '2026-08-14',
        periodNumber: 2,
        title: 'દિવસ ૭: પ્રકરણ ૨ અપૂર્ણાંક સંખ્યાઓ - શુદ્ધ, અશુદ્ધ અને મિશ્ર અપૂર્ણાંક',
        topic: 'અપૂર્ણાંકના પ્રકારો અને કાગળ કટિંગ દ્વારા નિરૂપણ',
        learningOutcome: 'M704: અપૂર્ણાંક સંખ્યાઓનું વર્ગીકરણ કરે છે.',
        teachingActivity: 'કાગળની ગોળાકાર પ્લેટ અને પટ્ટીઓ કાપી ૧/૨, ૧/૪, ૩/૪ અને ૫/૪ નું પ્રત્યક્ષ નિદર્શન કરાવવું.',
        tlmUsed: 'રંગીન કાગળ, કાતર, અપૂર્ણાંક કીટ, પિઝા મોડેલ',
        assessmentMethod: 'પ્રવૃત્તિ આધારિત ઓબ્ઝર્વેશન',
        homework: 'કોઈપણ ૫ અશુદ્ધ અપૂર્ણાંકોને મિશ્ર અપૂર્ણાંકમાં ફેરવો',
        status: 'આયોજિત',
        subTasks: [
          { id: 'st-107-1', taskTitle: 'ધોરણ ૬ ના અપૂર્ણાંક પૂર્વજ્ઞાનની ચકાસણી', isCompleted: false },
          { id: 'st-107-2', taskTitle: 'કાગળ કટિંગ પ્રવૃત્તિ દ્વારા શુદ્ધ અને અશુદ્ધ અપૂર્ણાંક સમજૂતી', isCompleted: false },
          { id: 'st-107-3', taskTitle: 'મિશ્ર અપૂર્ણાંક (દા.ત. ૨ પૂર્ણાંક ૧/૩) ની રચના સ્પષ્ટ કરવી', isCompleted: false },
          { id: 'st-107-4', taskTitle: 'સ્વાધ્યાય ૨.૧ નો પ્રશ્ન ૧ નો મહાવરો', isCompleted: false },
          { id: 'st-107-5', taskTitle: 'દૈનિક શિક્ષણ નોંધપોથી અપડેટ', isCompleted: false }
        ]
      },
      {
        id: 'da-108',
        dayNumber: 8,
        date: '2026-08-18',
        periodNumber: 2,
        title: 'દિવસ ૮: અપૂર્ણાંક સંખ્યાઓનો ગુણાકાર',
        topic: 'પૂર્ણાંક સાથે અપૂર્ણાંકનો ગુણાકાર અને ‘નો’ (of) તરીકે ગુણાકાર',
        learningOutcome: 'M704: અપૂર્ણાંકોનો ગુણાકાર અને સરળ રૂપ આપે છે.',
        teachingActivity: 'લંબચોરસ કાગળને ઊભી અને આડી ગડી વાળી ૧/૨ × ૧/૩ = ૧/૬ નું ક્ષેત્રફળ મોડેલ સમજાવવું.',
        tlmUsed: 'ગ્રીડ શીટ્સ, સ્માર્ટ વિઝ્યુઅલ એઇડ્સ',
        assessmentMethod: 'બોર્ડ વર્ક અને સ્લેટ પ્રેક્ટિસ',
        homework: 'સ્વાધ્યાય ૨.૨ ના પ્રશ્ન ૩ થી ૬',
        status: 'આયોજિત',
        subTasks: [
          { id: 'st-108-1', taskTitle: 'અંશનો અંશ સાથે અને છેદનો છેદ સાથે ગુણાકાર નિયમ સમજાવવો', isCompleted: false },
          { id: 'st-108-2', taskTitle: 'ગ્રીડ પેપર પર છેદન બિંદુઓ દ્વારા ગુણાકાર પ્રવૃત્તિ', isCompleted: false },
          { id: 'st-108-3', taskTitle: 'સરળ રૂપ (Simplest form) આપવાનો મહાવરો', isCompleted: false },
          { id: 'st-108-4', taskTitle: 'વિદ્યાર્થીઓ પાસે પરસ્પર દાખલા ચકાસણી કરાવવી', isCompleted: false }
        ]
      },
      {
        id: 'da-109',
        dayNumber: 9,
        date: '2026-08-20',
        periodNumber: 3,
        title: 'દિવસ ૯: દશાંશ સંખ્યાઓ - દશાંશ, શતાંશ, સહસ્ત્રાંશ અને સરવાળા-બાદબાકી',
        topic: 'દશાંશ સ્થળ કિંમત અને વ્યવહારમાં નાણાં/વજનમાં ઉપયોગ',
        learningOutcome: 'M707: દશાંશ સંખ્યાઓની સરખામણી અને ગણતરી કરે છે.',
        teachingActivity: 'રૂપિયા-પૈસા અને મીટર-સેમી ના વ્યવહારિક ઉદાહરણો આપી દશાંશ ચિહ્નની અગત્યતા સમજાવવી.',
        tlmUsed: 'ચલણી નોટો / સિક્કા મોડેલ, મીટર પટ્ટી',
        assessmentMethod: 'વ્યવહારિક માપન પ્રવૃત્તિ',
        homework: 'સ્વાધ્યાય ૨.૫ ના પ્રશ્ન ૧ થી ૪',
        status: 'આયોજિત',
        subTasks: [
          { id: 'st-109-1', taskTitle: 'દશાંશ સ્થાનકિંમત ચાર્ટનું વર્ગખંડમાં વિશ્લેષણ', isCompleted: false },
          { id: 'st-109-2', taskTitle: 'દશાંશ ચિહ્નની નીચે દશાંશ ચિહ્ન રાખી સરવાળા કરવાની ટ્રીક', isCompleted: false },
          { id: 'st-109-3', taskTitle: 'મીટર-સેમી રૂપાંતરણના વ્યવહારિક દાખલા ગણાવવા', isCompleted: false },
          { id: 'st-109-4', taskTitle: 'બાળકોની ગણિત નોટબુક ઇન્સ્પેક્શન', isCompleted: false }
        ]
      },
      {
        id: 'da-110',
        dayNumber: 10,
        date: '2026-08-22',
        periodNumber: 2,
        title: 'દિવસ ૧૦: માસિક પુનરાવર્તન અને સત્રાંત તૈયારી ક્વિઝ',
        topic: 'ઓગસ્ટ માસના તમામ પ્રકરણોનું સમગ્રલક્ષી રિવિઝન',
        learningOutcome: 'M701-M707: તમામ અધ્યયન નિષ્પત્તિઓનું દ્રઢીકરણ',
        teachingActivity: 'કૌન બનેગા ગણિત ચેમ્પિયન (KBGC) ટીમ ક્વિઝનું આયોજન કરવું.',
        tlmUsed: 'બઝર / ઘંટડી, ક્વિઝ પ્રશ્નબેંક, વિજેતા બેજ',
        assessmentMethod: 'ટીમ સ્પર્ધા & સ્કોરબોર્ડ',
        homework: 'માસિક સંગ્રહપોથી પૂર્ણ કરવી',
        status: 'આયોજિત',
        subTasks: [
          { id: 'st-110-1', taskTitle: 'વર્ગખંડને ૪ ટીમો (આર્યભટ્ટ, ભાસ્કરાચાર્ય, રામાનુજન, વરાહમિહિર) માં વહેંચવો', isCompleted: false },
          { id: 'st-110-2', taskTitle: 'પૂર્ણાંક અને અપૂર્ણાંકના ૨૦ રેપિડ પ્રશ્નોની ક્વિઝ', isCompleted: false },
          { id: 'st-110-3', taskTitle: 'વિજેતા ટીમને ઉત્સાહવર્ધક પુરસ્કાર / તાળીઓથી બિરદાવવી', isCompleted: false },
          { id: 'st-110-4', taskTitle: 'આચાર્યશ્રી પાસેથી માસિક આયોજન રજિસ્ટર પર સહી-સિક્કો મેળવવો', isCompleted: false },
          { id: 'st-110-5', taskTitle: 'ઓગસ્ટ માસનું સંપૂર્ણ પત્રક A અને B ઓનલાઇન અપડેટ કરવું', isCompleted: false }
        ]
      }
    ]
  },
  {
    id: 'mlp-002',
    month: 'ઓગસ્ટ ૨૦૨૬',
    academicYear: '૨૦૨૬-૨૭',
    standard: 'ધોરણ ૮',
    division: 'અ',
    subject: 'વિજ્ઞાન',
    teacherName: 'ભાવિનકુમાર એમ. પરમાર',
    schoolName: 'શ્રી પ્રાથમિક શાળા, હિંમતનગર',
    unitsCovered: [
      'પ્રકરણ ૧: પાક ઉત્પાદન અને વ્યવસ્થાપન (Crop Production & Management)',
      'પ્રકરણ ૨: સૂક્ષ્મજીવો: મિત્ર અને શત્રુ (Microorganisms: Friend & Foe)'
    ],
    totalPlannedDays: 8,
    targetLearningOutcomes: [
      'SC801: કૃષિ પદ્ધતિઓના વિવિધ તબક્કા વર્ણવે છે અને સમજાવે છે.',
      'SC802: કુદરતી અને કૃત્રિમ ખાતર વચ્ચેનો તફાવત સ્પષ્ટ કરે છે.',
      'SC803: સૂક્ષ્મજીવોના પ્રકારો (બેક્ટેરિયા, ફૂગ, પ્રજીવ, લીલ) નું વર્ગીકરણ કરે છે.',
      'SC804: ખોરાકની જાળવણીની પદ્ધતિઓ પ્રયોગ દ્વારા દર્શાવે છે.'
    ],
    generalObjectives: 'વિદ્યાર્થીઓ આધુનિક ખેતી પદ્ધતિઓ, સૂક્ષ્મજીવોની ઉપયોગિતા અને રોગોથી બચવાના ઉપાયો પ્રત્યક્ષ પ્રયોગો દ્વારા શીખે.',
    status: 'સક્રિય',
    createdAt: '2026-08-01',
    updatedAt: '2026-08-21',
    dailyActivities: [
      {
        id: 'da-201',
        dayNumber: 1,
        date: '2026-08-04',
        periodNumber: 4,
        title: 'દિવસ ૧: પાક પદ્ધતિઓ અને જમીન તૈયાર કરવી',
        topic: 'ખરીફ પાક, રવિ પાક અને હળ/દાંતી દ્વારા ખેડ',
        learningOutcome: 'SC801: ખરીફ અને રવિ પાકનું વર્ગીકરણ કરે છે.',
        teachingActivity: 'વિવિધ અનાજ અને કઠોળના નમૂના ટેબલ પર મૂકી વાવણીની ઋતુ મુજબ વર્ગીકરણ કરાવવું.',
        tlmUsed: 'અનાજના નમૂના (મકાઈ, ડાંગર, ઘઉં, ચણા), કૃષિ સાધનોના ચિત્રો',
        assessmentMethod: 'નમૂના ઓળખ અને વર્ગીકરણ ચાર્ટ',
        homework: 'તમારા વિસ્તારમાં લેવાતા ખરીફ અને રવિ પાકની યાદી બનાવો',
        status: 'પૂર્ણ',
        teacherNotes: 'બાળકોએ પોતાના ખેતરના અનુભવો સુંદર રીતે રજૂ કર્યા.',
        subTasks: [
          { id: 'st-201-1', taskTitle: 'પાકની વ્યાખ્યા અને ઋતુ આધારિત વર્ગીકરણ ચાર્ટ બોર્ડ પર રજૂ કરવો', isCompleted: true },
          { id: 'st-201-2', taskTitle: 'વાસ્તવિક બીજના નમૂના દર્શાવી ખરીફ/રવિ પાકની ઓળખ કરાવવી', isCompleted: true },
          { id: 'st-201-3', taskTitle: 'જમીન ખેડવાથી થતા ફાયદા (પોચી જમીન, અળસિયાનો વિકાસ) ની ચર્ચા', isCompleted: true },
          { id: 'st-201-4', taskTitle: 'સ્વાધ્યાય પ્રશ્નોની નોટબુક નોંધ', isCompleted: true }
        ]
      },
      {
        id: 'da-202',
        dayNumber: 2,
        date: '2026-08-07',
        periodNumber: 4,
        title: 'દિવસ ૨: બીજની પસંદગી પ્રયોગ અને વાવણી પદ્ધતિઓ',
        topic: 'સ્વસ્થ બીજની ઓળખ (પાણીમાં ડૂબતા બીજ) અને વાવણીયા (Seed drill)',
        learningOutcome: 'SC801: સારા બીજની પસંદગીનો પ્રયોગ જાતે કરે છે.',
        teachingActivity: 'બીકરમાં પાણી ભરી ઘઉંના દાણા નાખી ક્ષતિગ્રસ્ત (તરતા) અને સ્વસ્થ (બેસી જતા) બીજ જુદા પાડવા.',
        tlmUsed: 'બીકર, પાણી, ઘઉંના દાણા, વાવણીયા મોડેલ',
        assessmentMethod: 'પ્રયોગશાળા પ્રવૃત્તિ અવલોકન',
        homework: 'ઘરે વાટકીમાં ચણા પલાળી પ્રયોગનું અવલોકન લખો',
        status: 'પૂર્ણ',
        teacherNotes: 'પ્રયોગશાળામાં તમામ વિદ્યાર્થીઓએ ઉત્સાહપૂર્વક ભાગ લીધો.',
        subTasks: [
          { id: 'st-202-1', taskTitle: 'પ્રયોગશાળામાં સાધન સામગ્રીની ગોઠવણ', isCompleted: true },
          { id: 'st-202-2', taskTitle: 'પાણીમાં તરતા હલકા અને ક્ષતિગ્રસ્ત બીજનું નિરીક્ષણ કરાવવું', isCompleted: true },
          { id: 'st-202-3', taskTitle: 'વાવણીયા વડે યોગ્ય ઊંડાઈ અને અંતરે વાવણીના ફાયદા સમજાવવા', isCompleted: true },
          { id: 'st-202-4', taskTitle: 'વિજ્ઞાન પ્રયોગપોથીમાં પ્રયોગ નોંધ લખાવવી', isCompleted: true }
        ]
      },
      {
        id: 'da-203',
        dayNumber: 3,
        date: '2026-08-11',
        periodNumber: 4,
        title: 'દિવસ ૩: ખાતર અને સિંચાઈ પદ્ધતિઓ',
        topic: 'સેન્દ્રિય (કુદરતી) ખાતર વિ. રાસાયણિક ખાતર, ટપક અને ફુવારા પદ્ધતિ',
        learningOutcome: 'SC802: ખાતરના તફાવત અને પાણી બચાવતી પદ્ધતિઓ વર્ણવે છે.',
        teachingActivity: 'શાળાના બગીચામાં ટપક સિંચાઈ પાઇપલાઇનનું પ્રત્યક્ષ નિદર્શન અને વર્મીકમ્પોસ્ટ ખાતર બતાવવું.',
        tlmUsed: 'વર્મીકમ્પોસ્ટ નમૂનો, ટપક સિંચાઈ ડ્રિપર મોડેલ',
        assessmentMethod: 'તફાવત કોષ્ટક લેખન',
        homework: 'ટપક પદ્ધતિના ૩ મુખ્ય ફાયદા લખો',
        status: 'ચાલુ',
        subTasks: [
          { id: 'st-203-1', taskTitle: 'કુદરતી ખાતર અને રાસાયણિક ખાતર વચ્ચેનો તુલનાત્મક ચાર્ટ તૈયાર કરવો', isCompleted: true },
          { id: 'st-203-2', taskTitle: 'શાળા ગાર્ડનમાં ટપક સિંચાઈ પાઇપનું નિદર્શન', isCompleted: true },
          { id: 'st-203-3', taskTitle: 'પાણીની બચત અને ખેડૂત મિત્ર અળસિયા પર જૂથ ચર્ચા', isCompleted: false },
          { id: 'st-203-4', taskTitle: 'વિજ્ઞાન ડાયરી નોંધ', isCompleted: false }
        ]
      },
      {
        id: 'da-204',
        dayNumber: 4,
        date: '2026-08-14',
        periodNumber: 4,
        title: 'દિવસ ૪: સૂક્ષ્મજીવો - સૂક્ષ્મદર્શક યંત્ર દ્વારા અવલોકન',
        topic: 'બેક્ટેરિયા, ફૂગ, પ્રજીવ અને લીલ ની ઓળખ',
        learningOutcome: 'SC803: સૂક્ષ્મજીવોનું વર્ગીકરણ કરે છે.',
        teachingActivity: 'બ્રેડ પર ઉગેલી ફૂગ (રાઇઝોપસ) અને તળાવના પાણીનું સંયુક્ત સૂક્ષ્મદર્શક યંત્ર (Compound Microscope) માં સ્લાઇડ બનાવી અવલોકન કરાવવું.',
        tlmUsed: 'સૂક્ષ્મદર્શક યંત્ર, સ્લાઇડ, કવરસસ્લિપ, બ્રેડ ફૂગ, દહીંનું ટીપું',
        assessmentMethod: 'સ્લાઇડ અવલોકન અને આકૃતિ દોરવી',
        homework: 'સૂક્ષ્મજીવોના ૪ મુખ્ય વર્ગોના નામ અને ચિત્રો દોરો',
        status: 'આયોજિત',
        subTasks: [
          { id: 'st-204-1', taskTitle: 'સૂક્ષ્મદર્શક યંત્રનું યોગ્ય ફોકસિંગ અને સેટિંગ', isCompleted: false },
          { id: 'st-204-2', taskTitle: 'દહીંમાંથી લેક્ટોબેસિલસ બેક્ટેરિયાની સ્લાઇડ તૈયાર કરવી', isCompleted: false },
          { id: 'st-204-3', taskTitle: 'વિદ્યાર્થીઓ દ્વારા વારાફરતી ફૂગ અને પ્રજીવનું નિરીક્ષણ', isCompleted: false },
          { id: 'st-204-4', taskTitle: 'સૂક્ષ્મજીવોના ઉપયોગી પાસાં (દહીં, ચીઝ, એન્ટિબાયોટિક્સ) ની સમજૂતી', isCompleted: false }
        ]
      }
    ]
  }
];

export const INITIAL_TEACHER_STORIES: TeacherStory[] = [
  {
    id: 'story-1',
    teacherName: 'મહેશભાઈ વ્યાસ',
    teacherRole: 'મુખ્ય શિક્ષક (HTAT)',
    teacherSchool: 'શ્રી કન્યા શાળા, માણસા',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'બાળમેળો ૨૦૨૬ ઉજવણી',
    caption: 'આજે અમારી શાળામાં બાળકોએ બનાવેલા ૪૦+ વેસ્ટમાંથી બેસ્ટ સાધનોનું પ્રદર્શન યોજાયું!',
    bgGradient: 'from-amber-600 via-orange-500 to-rose-600',
    timestamp: '૨ કલાક પહેલાં',
    isSeen: false,
    likesCount: 38
  },
  {
    id: 'story-2',
    teacherName: 'દિપીકાબેન પટેલ',
    teacherRole: 'FLN ભાષા શિક્ષિકા',
    teacherSchool: 'પ્રાથમિક શાળા, વસ્ત્રાલ',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'ધોરણ ૨ પ્રજ્ઞા કવિતા ગાન',
    caption: 'અભિનય ગીત "ચકીબેન ચકીબેન મારી સાથે રમવા આવશો કે નહિ" સાથે આનંદમય શિક્ષણ!',
    bgGradient: 'from-pink-600 via-rose-500 to-purple-600',
    timestamp: '૪ કલાક પહેલાં',
    isSeen: false,
    likesCount: 52
  },
  {
    id: 'story-3',
    teacherName: 'પ્રવિણભાઈ ચૌહાણ',
    teacherRole: 'ગણિત-વિજ્ઞાન શિક્ષક',
    teacherSchool: 'મોડેલ પ્રાથમિક શાળા, રાજકોટ',
    teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'ધોરણ ૭ લેબ પ્રયોગ',
    caption: 'એસિડ-બેઇઝ લિટમસ કસોટી: વિદ્યાર્થીઓએ જાતે જાસુદના ફૂલના રસથી સૂચક બનાવ્યું.',
    bgGradient: 'from-blue-600 via-indigo-600 to-purple-700',
    timestamp: '૬ કલાક પહેલાં',
    isSeen: false,
    likesCount: 44
  },
  {
    id: 'story-4',
    teacherName: 'હરેશભાઈ પટેલ',
    teacherRole: 'HTAT આચાર્ય',
    teacherSchool: 'શ્રી પ્રાથમિક શાળા, હિંમતનગર',
    teacherAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'SMC માસિક બેઠક & વૃક્ષારોપણ',
    caption: 'ગામના સરપંચ અને વાલીઓની ઉપસ્થિતિમાં શાળા સંકુલમાં ૫૧ ઔષધીય રોપાઓનું વાવેતર.',
    bgGradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    timestamp: '૮ કલાક પહેલાં',
    isSeen: false,
    likesCount: 65
  },
  {
    id: 'story-5',
    teacherName: 'રેખાબેન શાહ',
    teacherRole: 'સામાજિક વિજ્ઞાન શિક્ષિકા',
    teacherSchool: 'અનુપમ શાળા, વડોદરા',
    teacherAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'ભારતનો 3D નકશો પ્રોજેક્ટ',
    caption: 'ધોરણ ૮ ના બાળકોએ માટી અને કાગળના માવા વડે ભારતનું પ્રાકૃતિક ભૂપૃષ્ઠ તૈયાર કર્યું!',
    bgGradient: 'from-purple-600 via-indigo-600 to-sky-600',
    timestamp: '૧૨ કલાક પહેલાં',
    isSeen: false,
    likesCount: 31
  }
];

export const INITIAL_TEACHING_REELS: TeachingReel[] = [
  {
    id: 'reel-1',
    teacherName: 'પ્રવિણભાઈ ચૌહાણ',
    teacherRole: 'ગણિત શિક્ષક • રાજકોટ',
    teacherSchool: 'મોડેલ પ્રાથમિક શાળા, રાજકોટ',
    teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'વૈદિક ગણિત: ૯૯ વડે કોઈપણ સંખ્યાનો ૨ સેકન્ડમાં ગુણાકાર! ⚡',
    caption: 'ધોરણ ૬ થી ૮ ના બાળકો માટે આ અદભુત ટ્રીક શીખવો. ગણિતનો ડર દૂર થશે અને ઉત્સાહ વધશે! #MathsTricks #VedicMaths #GCERT',
    videoThumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    videoDuration: '0:45',
    tags: ['ગણિત', 'VedicMaths', 'શોર્ટ_ટ્રીક', 'ધોરણ૭'],
    likesCount: 842,
    commentsCount: 94,
    sharesCount: 312,
    musicTrack: 'સરસ્વતી વંદના • ગણિત સાધના ઓડિયો',
    category: 'ગણિત શોર્ટકટ્સ',
    isLiked: false,
    isSaved: false,
    isFollowed: false
  },
  {
    id: 'reel-2',
    teacherName: 'દિપીકાબેન પટેલ',
    teacherRole: 'પ્રજ્ઞા FLN શિક્ષિકા • અમદાવાદ',
    teacherSchool: 'પ્રાથમિક શાળા, વસ્ત્રાલ',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'FLN શબ્દ ચક્ર (Word Wheel) રમત: ૨ મિનિટમાં જોડાક્ષર વાંચન! 🎡',
    caption: 'પ્રજ્ઞા વર્ગખંડ માટે કાર્ડબોર્ડથી બનાવેલું આ ચક્ર બાળકોને ગમ્મત સાથે માત્રા અને કક્કો શીખવે છે. #FLNGujarat #PragnaTLM #ReadingJoy',
    videoThumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
    videoDuration: '0:52',
    tags: ['FLN', 'પ્રજ્ઞા', 'વાંચન_રમતો', 'ધોરણ૧_૨'],
    likesCount: 1240,
    commentsCount: 156,
    sharesCount: 520,
    musicTrack: 'બાળગીત મલ્હાર • આનંદમય શિક્ષણ',
    category: 'FLN & પ્રજ્ઞા',
    isLiked: true,
    isSaved: false,
    isFollowed: true
  },
  {
    id: 'reel-3',
    teacherName: 'અનિલભાઈ જોષી',
    teacherRole: 'વિજ્ઞાન શિક્ષક • બનાસકાંઠા',
    teacherSchool: 'પ્રાથમિક શાળા, વાવ',
    teacherAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'પાણીની ઘનતાનો જાદુઈ પ્રયોગ: લીંબુ અને મીઠું! 🧪',
    caption: 'સાદા પાણીમાં લીંબુ ડૂબી જાય છે પણ મીઠાવાળા પાણીમાં કેમ તરે છે? આ આર્કિમિડીઝનો સિદ્ધાંત બાળકોને લાઈવ બતાવ્યો! #ScienceTLM #STEM',
    videoThumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    videoDuration: '0:38',
    tags: ['વિજ્ઞાન_પ્રયોગ', 'STEM', 'પ્રાથમિક_વિજ્ઞાન'],
    likesCount: 960,
    commentsCount: 82,
    sharesCount: 290,
    musicTrack: 'સાયન્સ ઇન્સ્પિરેશન • એજ્યુકેશનલ બીટ્સ',
    category: 'વિજ્ઞાન પ્રયોગો',
    isLiked: false,
    isSaved: true,
    isFollowed: false
  },
  {
    id: 'reel-4',
    teacherName: 'રેખાબેન શાહ',
    teacherRole: 'કલા શિક્ષિકા • વડોદરા',
    teacherSchool: 'અનુપમ શાળા, વડોદરા',
    teacherAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'ઓરિગામિ ભૂમિતિ: કાગળની ગડીઓથી ૩D ઘન અને લંબઘન બનાવવાની રીત! 📐',
    caption: 'કાગળ વાળીને બાળકો ક્ષેત્રફળ અને ઘનફળના આકારો સરળતાથી સમજી શકે છે. વર્ગખંડમાં જરૂર ટ્રાય કરો. #OrigamiGeometry #MathsArt',
    videoThumbnail: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80',
    videoDuration: '0:58',
    tags: ['ઓરિગામિ', 'ભૂમિતિ', 'TLM', 'ArtIntegrated'],
    likesCount: 680,
    commentsCount: 45,
    sharesCount: 184,
    musicTrack: 'ક્લાસિકલ વાંસળી મ્યુઝિક',
    category: 'કલા & હસ્તકલા',
    isLiked: false,
    isSaved: false,
    isFollowed: false
  }
];

export const INITIAL_TEACHER_GROUPS: TeacherGroup[] = [
  {
    id: 'grp-1',
    name: 'FLN Pragna Teachers Gujarat',
    gujaratiName: 'ધોરણ ૧-૨ FLN & પ્રજ્ઞા શિક્ષક મંચ',
    description: 'નિપુણ ભારત મિશન અંતર્ગત પાયાની સાક્ષરતા અને સંખ્યાજ્ઞાન માટે દૈનિક રમતો, વર્કશીટ્સ અને પ્રવૃત્તિઓ શેર કરતું સક્રિય ગ્રૂપ.',
    category: 'FLN / પ્રજ્ઞા',
    membersCount: 18450,
    postsCount: 1240,
    iconName: 'Sparkles',
    bgGradient: 'from-pink-600 via-rose-500 to-amber-500',
    isJoined: true,
    tags: ['FLN', 'પ્રજ્ઞા', 'બાળવાટિકા', 'ધોરણ ૧-૨'],
    bannerImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'grp-2',
    name: 'Gujarat Upper Primary Science & Maths',
    gujaratiName: 'ધોરણ ૬ થી ૮ ગણિત-વિજ્ઞાન શિક્ષક સંઘ',
    description: 'STEM પ્રવૃત્તિઓ, વિજ્ઞાન મેળો મોડેલ્સ, એકમ કસોટી પ્રશ્નબેંક અને એનએમએમએસ (NMMS) પરીક્ષા તૈયારી મટીરીયલ.',
    category: 'ગણિત - વિજ્ઞાન',
    membersCount: 24800,
    postsCount: 3120,
    iconName: 'Atom',
    bgGradient: 'from-blue-600 via-indigo-600 to-cyan-600',
    isJoined: true,
    tags: ['ગણિત', 'વિજ્ઞાન', 'STEM', 'NMMS'],
    bannerImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'grp-3',
    name: 'Gujarat HTAT & Administrative Forum',
    gujaratiName: 'શાળા વહીવટ, ગ્રાન્ટ્સ & પરિપત્ર મંચ',
    description: 'શાળા કોમ્પોઝીટ ગ્રાન્ટ, રોજમેળ, PFMS, આધાર ડાયસ (UDISE+), સ્કોલરશિપ અને તાજા સરકારી પરિપત્રોનું સચોટ વિશ્લેષણ.',
    category: 'વહીવટી & નિયમો',
    membersCount: 14200,
    postsCount: 890,
    iconName: 'ShieldCheck',
    bgGradient: 'from-emerald-700 via-teal-700 to-cyan-800',
    isJoined: false,
    tags: ['HTAT', 'ગ્રાન્ટ્સ', 'રોજમેળ', 'પરિપત્ર'],
    bannerImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'grp-4',
    name: 'Gujarati Language & Literature Club',
    gujaratiName: 'ગુજરાતી ભાષા, કાવ્યગાન & વક્તૃત્વ ક્લબ',
    description: 'શાળા પ્રાર્થના સંમેલન, સુવિચાર, બાળવાર્તા, કવિતા ગાન, નિબંધ સ્પર્ધા અને વ્યાકરણ શુદ્ધિ માટેનું વિશેષ ફોરમ.',
    category: 'ભાષા & સંસ્કૃતિ',
    membersCount: 11300,
    postsCount: 750,
    iconName: 'BookOpen',
    bgGradient: 'from-amber-600 via-orange-600 to-red-600',
    isJoined: false,
    tags: ['ગુજરાતી', 'કાવ્યગાન', 'પ્રાર્થના', 'સાહિત્ય'],
    bannerImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    creatorName: 'મહેશભાઈ વ્યાસ',
    creatorRole: 'મુખ્ય શિક્ષક (HTAT)',
    creatorSchool: 'શ્રી કન્યા શાળા, માણસા',
    creatorDistrict: 'ગાંધીનગર',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    creatorBadge: 'રાજ્ય એવોર્ડ વિજેતા શિક્ષક',
    isFollowed: true,
    type: 'patrak',
    title: 'પત્રક A, B અને C નવીન ફોર્મેટ ૨૦૨૫-૨૬ (સરળ પ્રિન્ટેબલ)',
    description: 'ધોરણ ૩ થી ૮ ના રચનાત્મક અને સત્રાંત મૂલ્યાંકન માટેનું સંપૂર્ણ પત્રક A, B અને C. વિદ્યાર્થી ડેટા એન્ટ્રી કરીને સીધું A4 સાઇઝમાં પ્રિન્ટ કરી શકાય છે. તમામ વિષયોના ૪૦ ગુણ વિભાજન મુજબ.',
    standard: 'તમામ ધોરણ (૩ થી ૮)',
    subject: 'બધા વિષયો',
    medium: 'ગુજરાતી',
    likesCount: 142,
    downloadsCount: 389,
    savesCount: 95,
    isLiked: true,
    isSaved: true,
    userReaction: 'heart',
    reactionCounts: { like: 82, heart: 45, clap: 12, insight: 3, laugh: 0 },
    tags: ['પત્રક A', 'પત્રક B', 'પત્રક C', 'SCE મૂલ્યાંકન', 'A4 પ્રિન્ટ'],
    createdAt: '૨ કલાક પહેલાં',
    fileSnippet: 'Patrak_ABC_Gujarat_Primary_2025_26.pdf',
    resourceContent: 'રચનાત્મક મૂલ્યાંકન પત્રક (Patrak A) માં ૪૦ ગુણની વિગતવાર વિષયવાર એન્ટ્રી તથા વ્યક્તિત્વ વિકાસ પત્રક (Patrak B) ગ્રેડ સિસ્ટમ ઉપલબ્ધ છે.',
    mediaUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    groupId: 'grp-3',
    groupName: 'શાળા વહીવટ, ગ્રાન્ટ્સ & પરિપત્ર મંચ',
    comments: [
      {
        id: 'c-1',
        authorName: 'હરેશભાઈ પટેલ',
        authorRole: 'HTAT આચાર્ય • હિંમતનગર',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        content: 'ખૂબ જ ઉપયોગી ફોર્મેટ છે મહેશભાઈ! શાળામાં સત્રાંત કામગીરી ખૂબ જ સરળ બની જશે. આભાર!',
        createdAt: '૧ કલાક પહેલાં',
        likesCount: 8,
        isLiked: true
      },
      {
        id: 'c-2',
        authorName: 'દિપીકાબેન પટેલ',
        authorRole: 'શિક્ષિકા • અમદાવાદ',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        content: 'શું આમાં ધોરણ ૧-૨ ના પ્રજ્ઞા પત્રકો સામેલ છે કે અલગથી ડાઉનલોડ કરવા પડશે?',
        createdAt: '૪૫ મિનિટ પહેલાં',
        likesCount: 3,
        isLiked: false
      }
    ]
  },
  {
    id: 'post-poll-1',
    creatorName: 'રાજ્ય શૈક્ષણિક સંશોધન મંચ',
    creatorRole: 'GCERT રિસોર્સ પર્સન',
    creatorSchool: 'ડાયેટ (DIET), ગાંધીનગર',
    creatorDistrict: 'ગાંધીનગર',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    creatorBadge: 'સત્તાવાર સંશોધન પોલ',
    isFollowed: true,
    type: 'poll',
    title: '📊 શિક્ષક અભિપ્રાય પોલ: નવા સત્રમાં ગણિત વિષયમાં બાળકો માટે કઈ પદ્ધતિ સૌથી વધુ અસરકારક રહી?',
    description: 'સાથી શિક્ષકો, આપના વર્ગખંડના વાસ્તવિક અનુભવ આધારે તમારો મત નોંધાવો અને અન્ય શિક્ષકોનો અભિપ્રાય જુઓ:',
    standard: 'ધોરણ ૬ થી ૮',
    subject: 'ગણિત',
    medium: 'ગુજરાતી',
    likesCount: 215,
    downloadsCount: 0,
    savesCount: 38,
    isLiked: false,
    userReaction: 'insight',
    reactionCounts: { like: 110, heart: 40, clap: 25, insight: 40, laugh: 0 },
    tags: ['શિક્ષક પોલ', 'ગણિત પદ્ધતિ', 'સર્વેક્ષણ', 'GCERT'],
    createdAt: '૩ કલાક પહેલાં',
    pollData: {
      question: 'ગણિત શિક્ષણમાં બાળકોની સંકલ્પના સ્પષ્ટ કરવા શ્રેષ્ઠ માધ્યમ કયું?',
      options: [
        { id: 'opt-1', text: 'પ્રત્યક્ષ TLM / મોડેલ્સ અને રમકડાં દ્વારા નિદર્શન', votes: 142 },
        { id: 'opt-2', text: 'સ્માર્ટબોર્ડ અને 3D એનિમેશન વિડિયોઝ', votes: 89 },
        { id: 'opt-3', text: 'દૈનિક જીવનના વ્યવહારિક કૂટપ્રશ્નો અને જૂથકાર્ય', votes: 64 },
        { id: 'opt-4', text: 'પાઠ્યપુસ્તક અને બ્લેકબોર્ડ મહાવરો', votes: 19 }
      ],
      totalVotes: 314,
      userVotedOptionId: 'opt-1'
    },
    comments: [
      {
        id: 'cp-1',
        authorName: 'પ્રવિણભાઈ ચૌહાણ',
        authorRole: 'ગણિત શિક્ષક • રાજકોટ',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'હું મારા વર્ગમાં પાસા અને રંગીન બટનો વાપરીને પૂર્ણાંક સંખ્યાઓ શીખવું છું, ૧૦૦% પરિણામ મળે છે!',
        createdAt: '૨ કલાક પહેલાં',
        likesCount: 14
      }
    ]
  },
  {
    id: 'post-status-1',
    creatorName: 'દિપીકાબેન પટેલ',
    creatorRole: 'FLN ભાષા શિક્ષિકા',
    creatorSchool: 'પ્રાથમિક શાળા, વસ્ત્રાલ',
    creatorDistrict: 'અમદાવાદ',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    creatorBadge: 'FLN માસ્ટર ટ્રેનર',
    isFollowed: false,
    type: 'statusCard',
    title: '✨ "શિક્ષક એ દીવો છે જે પોતે બળીને સમગ્ર વર્ગખંડને જ્ઞાનનો પ્રકાશ આપે છે."',
    description: 'આજે ધોરણ ૨ ના વર્ગમાં જ્યારે બાળકે પહેલીવાર અટકેલા વગર "માતૃભાષા" શબ્દ વાંચ્યો ત્યારે શિક્ષક તરીકેનો સાચો સંતોષ મળ્યો! તમામ મહેનતુ શિક્ષકોને સલામ. ❤️📚',
    standard: 'ધોરણ ૨',
    subject: 'ગુજરાતી',
    medium: 'ગુજરાતી',
    likesCount: 310,
    downloadsCount: 0,
    savesCount: 42,
    isLiked: true,
    userReaction: 'heart',
    reactionCounts: { like: 120, heart: 160, clap: 30, insight: 0, laugh: 0 },
    bgGradient: 'from-purple-600 via-pink-600 to-rose-500',
    mediaType: 'textCard',
    tags: ['શિક્ષક પ્રેરણા', 'FLN ખુશી', 'પ્રજ્ઞા વાર્તા', 'સંતોષ'],
    createdAt: '૪ કલાક પહેલાં',
    comments: [
      {
        id: 'cs-1',
        authorName: 'અનિલભાઈ જોષી',
        authorRole: 'શિક્ષક • વાવ',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        content: 'એકદમ સાચી વાત દિપીકાબેન. બાળકના ચહેરા પરની ચમક જ શિક્ષકનો અસલ પગાર છે!',
        createdAt: '૩ કલાક પહેલાં',
        likesCount: 11
      }
    ]
  },
  {
    id: 'post-2',
    creatorName: 'પ્રવિણભાઈ ચૌહાણ',
    creatorRole: 'ગણિત-વિજ્ઞાન શિક્ષક',
    creatorSchool: 'મોડેલ પ્રાથમિક શાળા, રાજકોટ',
    creatorDistrict: 'રાજકોટ',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    creatorBadge: 'વિજ્ઞાન મેળો વિજેતા',
    isFollowed: false,
    type: 'questionPaper',
    title: 'ધોરણ ૭ વિજ્ઞાન પ્રથમ સત્રાંત પરીક્ષા સંપૂર્ણ પ્રશ્નપત્ર (૮૦ ગુણ)',
    description: 'GCERT પાઠ્યપુસ્તક આધારિત બ્લૂપ્રિન્ટ સાથેનું સુંદર પ્રશ્નપત્ર. વિભાગ A થી E, હેતુલક્ષી, ટૂંકા અને આકૃતિ આધારિત પ્રશ્નો સાથે ઉત્તરો પણ સામેલ છે.',
    standard: 'ધોરણ ૭',
    subject: 'વિજ્ઞાન',
    medium: 'ગુજરાતી',
    likesCount: 98,
    downloadsCount: 245,
    savesCount: 68,
    isLiked: false,
    reactionCounts: { like: 60, heart: 28, clap: 10, insight: 0, laugh: 0 },
    tags: ['પ્રશ્નપત્ર', 'સત્રાંત પરીક્ષા', 'વિજ્ઞાન', 'બ્લૂપ્રિન્ટ', 'ધોરણ ૭'],
    createdAt: '૫ કલાક પહેલાં',
    fileSnippet: 'Std_7_Science_Sem1_80Marks_Paper.pdf',
    mediaUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    groupId: 'grp-2',
    groupName: 'ધોરણ ૬ થી ૮ ગણિત-વિજ્ઞાન શિક્ષક સંઘ'
  },
  {
    id: 'post-3',
    creatorName: 'દિપીકાબેન પટેલ',
    creatorRole: 'ભાષા શિક્ષિકા',
    creatorSchool: 'પ્રાથમિક શાળા, વસ્ત્રાલ',
    creatorDistrict: 'અમદાવાદ',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    creatorBadge: 'FLN માસ્ટર ટ્રેનર',
    isFollowed: false,
    type: 'worksheet',
    title: 'ધોરણ ૬ ગુજરાતી: વ્યાકરણ અને લેખન વર્કશીટ (રૂઢિપ્રયોગો, સમાનાર્થી, વિરોધી)',
    description: 'વિદ્યાર્થીઓના સ્વ-અધ્યયન અને દ્રઢીકરણ માટે તૈયાર કરેલી ૧૦ પાનાની રંગીન વર્કશીટ. પ્રિન્ટ કરીને બાળકોને સીધું આપી શકાય.',
    standard: 'ધોરણ ૬',
    subject: 'ગુજરાતી (પ્રથમ ભાષા)',
    medium: 'ગુજરાતી',
    likesCount: 176,
    downloadsCount: 512,
    savesCount: 130,
    isLiked: false,
    reactionCounts: { like: 120, heart: 42, clap: 14, insight: 0, laugh: 0 },
    tags: ['વર્કશીટ', 'વ્યાકરણ', 'ગુજરાતી', 'લેખન'],
    createdAt: '૧ દિવસ પહેલાં',
    fileSnippet: 'Std_6_Gujarati_Grammar_Worksheet.pdf',
    mediaUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    groupId: 'grp-4',
    groupName: 'ગુજરાતી ભાષા, કાવ્યગાન & વક્તૃત્વ ક્લબ'
  },
  {
    id: 'post-4',
    creatorName: 'હરેશભાઈ પટેલ (HTAT)',
    creatorSchool: 'શ્રી પ્રાથમિક શાળા, હિંમતનગર',
    creatorRole: 'મુખ્ય શિક્ષક (HTAT)',
    creatorDistrict: 'સાબરકાંઠા',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    creatorBadge: 'શ્રેષ્ઠ આચાર્ય એવોર્ડ',
    isFollowed: true,
    type: 'paripatra',
    title: 'સમગ્ર શિક્ષા પરિપત્ર સંદર્ભ: શાળા ગ્રાન્ટ વપરાશ નિયમો અને રોકડમેળ ગાઈડલાઈન',
    description: 'કોમ્પોઝીટ ગ્રાન્ટ, સ્પોર્ટ્સ ગ્રાન્ટ અને સ્વચ્છતા ગ્રાન્ટના હિસાબો ઓડિટ-સેફ રાખવા માટેની સંપૂર્ણ માર્ગદર્શિકા અને વાઉચર ફોર્મેટ.',
    standard: 'શાળા વહીવટ',
    subject: 'રોકડમેળ / ગ્રાન્ટ',
    medium: 'ગુજરાતી',
    likesCount: 230,
    downloadsCount: 640,
    savesCount: 180,
    isLiked: false,
    reactionCounts: { like: 150, heart: 50, clap: 30, insight: 0, laugh: 0 },
    tags: ['પરિપત્ર', 'રોજમેળ', 'ગ્રાન્ટ નિયમો', 'ઓડિટ', 'વાઉચર'],
    createdAt: '૨ દિવસ પહેલાં',
    fileSnippet: 'School_Grant_Guidelines_Rojmel_Format.pdf',
    groupId: 'grp-3',
    groupName: 'શાળા વહીવટ, ગ્રાન્ટ્સ & પરિપત્ર મંચ'
  },
  {
    id: 'post-5',
    creatorName: 'અનિલભાઈ જોષી',
    creatorRole: 'પ્રાથમિક શિક્ષક',
    creatorSchool: 'પ્રાથમિક શાળા, વાવ',
    creatorDistrict: 'બનાસકાંઠા',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    creatorBadge: 'ગણિત-વિજ્ઞાન ઇનોવેટર',
    isFollowed: false,
    type: 'lessonPlan',
    title: 'ધોરણ ૮ ગણિત-વિજ્ઞાન દૈનિક શિક્ષણ નોંધ (Teacher Diary) - ઑગસ્ટ માસ',
    description: 'અધ્યયન નિષ્પત્તિ, TLM અને રસપ્રદ પ્રવૃત્તિઓ સાથેનું સંપૂર્ણ માસિક આયોજન. શિક્ષકો પોતાના વર્ગ મુજબ ફેરફાર કરી વાપરી શકે છે.',
    standard: 'ધોરણ ૮',
    subject: 'ગણિત',
    medium: 'ગુજરાતી',
    likesCount: 88,
    downloadsCount: 190,
    savesCount: 54,
    isLiked: false,
    reactionCounts: { like: 60, heart: 20, clap: 8, insight: 0, laugh: 0 },
    tags: ['શિક્ષક નોંધપોથી', 'લેસન પ્લાન', 'અધ્યયન નિષ્પત્તિ', 'ગણિત'],
    createdAt: '૩ દિવસ પહેલાં',
    fileSnippet: 'Teacher_Diary_Std8_Maths_August.pdf'
  }
];

export const INITIAL_OFFICIAL_DOCUMENTS: OfficialDocument[] = [
  {
    id: 'doc-1',
    type: 'bonafide',
    title: 'બોનાફાઈડ પ્રમાણપત્ર (Bonafide Certificate)',
    studentName: 'પટેલ આયુષ સંજયભાઈ',
    grNo: '1420',
    standard: 'ધોરણ ૬',
    date: '2026-08-20',
    referenceNo: 'HMT/BONA/2026/104',
    content: 'આથી પ્રમાણપત્ર આપવામાં આવે છે કે પટેલ આયુષ સંજયભાઈ અમારી શાળામાં શૈક્ષણિક વર્ષ ૨૦૨૫-૨૬ માં ધોરણ ૬-A માં જી.આર. નં. ૧૪૨૦ થી અભ્યાસ કરે છે. તેમની સામાન્ય વર્તણૂક સારી છે.'
  },
  {
    id: 'doc-2',
    type: 'notice',
    title: 'એસ.એમ.સી. (SMC) માસિક સભા નોટિસ',
    date: '2026-08-22',
    referenceNo: 'HMT/SMC/2026/08',
    subject: 'શાળા વ્યવસ્થાપન સમિતિ (SMC) ની માસિક બેઠક બાબત',
    content: 'શાળાના તમામ SMC સભ્યશ્રીઓને જણાવવાનું કે તારીખ ૨૮/૦૮/૨૦૨૬ ના રોજ બપોરે ૨:૦૦ કલાકે શાળા પરિસરમાં સ્વચ્છતા પખવાડિયું અને શાળા ગ્રાન્ટ આયોજન અંગે માસિક સભા યોજાનાર છે, જેમાં સમયસર ઉપસ્થિત રહેવા વિનંતી.'
  }
];

export const INITIAL_BANNERS: AppBanner[] = [
  {
    id: 'banner-1',
    title: 'શાળાકીય ગુણોત્સવ ૨.૦ અને એક્રેડિટેશન મૂલ્યાંકન માર્ગદર્શિકા',
    subtitle: 'શાળાના ભૌતિક, શૈક્ષણિક અને વહીવટી માપદંડોની સંપૂર્ણ ચેકલિસ્ટ તથા પત્રક A, B, C નું ઓટોમેશન ઉપલબ્ધ છે.',
    badgeText: 'મહત્વપૂર્ણ પરિપત્ર ૨૦૨૬',
    badgeColor: 'amber',
    bgGradient: 'from-amber-600 via-orange-600 to-red-600',
    ctaText: 'પત્રક ઓટોમેશન જુઓ',
    ctaLinkType: 'subfeature',
    ctaTarget: 'patrak-automation',
    isActive: true,
    order: 1,
    createdAt: '2026-08-20'
  },
  {
    id: 'banner-2',
    title: 'એકમ કસોટી અને સત્રાંત પરીક્ષા પેપર જનરેટર',
    subtitle: 'GCERT બ્લૂપ્રિન્ટ અનુસાર ધોરણ ૩ થી ૮ માટે વિષયવાર પ્રશ્નબેંકમાંથી મિનિટોમાં તૈયાર કરો A4 પ્રિન્ટેબલ પ્રશ્નપત્ર.',
    badgeText: 'નવું ફીચર',
    badgeColor: 'indigo',
    bgGradient: 'from-indigo-700 via-purple-700 to-pink-700',
    ctaText: 'પ્રશ્નપત્ર બનાવો',
    ctaLinkType: 'subfeature',
    ctaTarget: 'question-paper',
    isActive: true,
    order: 2,
    createdAt: '2026-08-21'
  },
  {
    id: 'banner-3',
    title: 'શાળા કોમ્પોઝીટ ગ્રાન્ટ, રોજમેળ અને PM પોષણ હિસાબ',
    subtitle: 'દૈનિક રોકડમેળ, ઓડિટ-સેફ વાઉચર્સ, સ્ટેશનરી ખરીદી રજિસ્ટર અને MDM દૈનિક અનાજ-કુકિંગ કોસ્ટ કેલ્ક્યુલેટર.',
    badgeText: 'ઓડિટ-સેફ હિસાબ',
    badgeColor: 'emerald',
    bgGradient: 'from-emerald-700 via-teal-700 to-cyan-800',
    ctaText: 'રોજમેળ & ગ્રાન્ટ્સ ખોલો',
    ctaLinkType: 'subfeature',
    ctaTarget: 'rojmel',
    isActive: true,
    order: 3,
    createdAt: '2026-08-21'
  },
  {
    id: 'banner-4',
    title: 'ગુજરાત શિક્ષક કમ્યુનિટી - ૧૦,૦૦૦+ TLM અને પ્રશ્નબેંક',
    subtitle: 'રાજ્યભરના પ્રતિભાશાળી શિક્ષકો સાથે જોડાઓ, વર્કશીટ્સ અને શિક્ષણ સામગ્રી ફ્રી શેર કરો તથા મેળવો.',
    badgeText: 'શિક્ષક સંગમ',
    badgeColor: 'blue',
    bgGradient: 'from-blue-700 via-sky-700 to-indigo-800',
    ctaText: 'કમ્યુનિટી ફીડ ખોલો',
    ctaLinkType: 'tab',
    ctaTarget: 'community',
    isActive: true,
    order: 4,
    createdAt: '2026-08-22'
  }
];

export const INITIAL_DYNAMIC_CARDS: DynamicHomeCard[] = [
  {
    id: 'card-community',
    title: 'Teacher Community',
    gujaratiTitle: 'શિક્ષક કમ્યુનિટી & TLM',
    subtitle: 'રાજ્યભરના શિક્ષકો દ્વારા શેર કરેલ ૧૦,૦૦૦+ TLM, પ્રશ્નો અને વર્કશીટ્સ',
    iconName: 'Users',
    colorScheme: 'blue',
    targetTab: 'community',
    targetSubFeature: 'community-feed',
    isVisible: true,
    order: 1,
    badge: 'મુખ્ય પ્લેટફોર્મ'
  },
  {
    id: 'card-patrak',
    title: 'Patrak Automation',
    gujaratiTitle: 'પત્રક ઓટોમેશન (A, B, C)',
    subtitle: 'વિદ્યાર્થી ગુણાંક ઓટો-ગ્રેડિંગ, સત્રાંત પરિણામ અને ઓનલાઈન એન્ટ્રી',
    iconName: 'FileSpreadsheet',
    colorScheme: 'indigo',
    targetTab: 'work-assistant',
    targetSubFeature: 'patrak-automation',
    isVisible: true,
    order: 2,
    badge: 'સૌથી લોકપ્રિય'
  },
  {
    id: 'card-rojmel',
    title: 'Digital Rojmel',
    gujaratiTitle: 'દૈનિક રોકડમેળ & વાઉચર્સ',
    subtitle: 'ઓડિટ-સેફ હિસાબ, ઓપનિંગ/ક્લોઝિંગ બેલેન્સ અને કેશમેમો',
    iconName: 'Wallet',
    colorScheme: 'emerald',
    targetTab: 'work-assistant',
    targetSubFeature: 'rojmel',
    isVisible: true,
    order: 3,
    badge: 'ઓડિટ-રેડી'
  },
  {
    id: 'card-grants',
    title: 'School Grants',
    gujaratiTitle: 'શાળા ગ્રાન્ટ્સ હિસાબ',
    subtitle: 'કોમ્પોઝીટ ગ્રાન્ટ, સ્પોર્ટ્સ, સ્વચ્છતા અને વાર્ષિક ખર્ચ વિશ્લેષણ',
    iconName: 'PiggyBank',
    colorScheme: 'amber',
    targetTab: 'work-assistant',
    targetSubFeature: 'grants',
    isVisible: true,
    order: 4
  },
  {
    id: 'card-purchases',
    title: 'Stationery Purchases',
    gujaratiTitle: 'સ્ટેશનરી & ખરીદી રજિસ્ટર',
    subtitle: 'શાળા સાધન ખરીદી, વાઉચર લિંકિંગ અને સ્ટોક બુક મેન્ટેનન્સ',
    iconName: 'ShoppingBag',
    colorScheme: 'purple',
    targetTab: 'work-assistant',
    targetSubFeature: 'purchases',
    isVisible: true,
    order: 5
  },
  {
    id: 'card-pm-poshan',
    title: 'PM Poshan MDM',
    gujaratiTitle: 'PM પોષણ મધ્યાહ્ન ભોજન',
    subtitle: 'દૈનિક અનાજ કેલ્ક્યુલેટર, કુકિંગ કોસ્ટ અને માસિક MDM રિપોર્ટ',
    iconName: 'Utensils',
    colorScheme: 'orange',
    targetTab: 'work-assistant',
    targetSubFeature: 'pm-poshan',
    isVisible: true,
    order: 6
  },
  {
    id: 'card-question-paper',
    title: 'Question Paper Generator',
    gujaratiTitle: 'પ્રશ્નપત્ર જનરેટર',
    subtitle: 'GCERT બ્લૂપ્રિન્ટ, પ્રશ્નબેંકમાંથી એકમ કસોટી અને સત્રાંત પેપર મેકર',
    iconName: 'FileText',
    colorScheme: 'rose',
    targetTab: 'create',
    targetSubFeature: 'question-paper',
    isVisible: true,
    order: 7,
    badge: 'A4 પ્રિન્ટ'
  },
  {
    id: 'card-lesson-plan',
    title: 'Teacher Diary',
    gujaratiTitle: 'દૈનિક શિક્ષક નોંધપોથી',
    subtitle: 'NEP ૨૦૨૦ અધ્યયન નિષ્પત્તિ, દૈનિક તાસ આયોજન અને TLM નોંધ',
    iconName: 'BookOpen',
    colorScheme: 'blue',
    targetTab: 'create',
    targetSubFeature: 'lesson-planning',
    isVisible: true,
    order: 8
  },
  {
    id: 'card-letters',
    title: 'Official Letters & Certificates',
    gujaratiTitle: 'સત્તાવાર પત્રો & પ્રમાણપત્રો',
    subtitle: 'SMC ઠરાવ, બોનાફાઇડ, રજા અરજી, શાળા પ્રમાણપત્ર ટેમ્પલેટ્સ',
    iconName: 'Award',
    colorScheme: 'emerald',
    targetTab: 'work-assistant',
    targetSubFeature: 'letters-certificates',
    isVisible: true,
    order: 9
  },
  {
    id: 'card-downloadable-resources',
    title: 'Downloadable Resources',
    gujaratiTitle: 'ડાઉનલોડેબલ સાધન ભંડાર',
    subtitle: 'તૈયાર પાઠ આયોજન, હાજરી પત્રક, સમયપત્રક & SMC ફોર્મેટ્સ',
    iconName: 'FolderDown',
    colorScheme: 'rose',
    targetTab: 'work-assistant',
    targetSubFeature: 'downloadable-resources',
    isVisible: true,
    order: 10,
    badge: 'A4 ડાઉનલોડ'
  }
];

export const INITIAL_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'flag-community',
    key: 'teacher_community',
    name: 'Teacher Community Module',
    gujaratiName: 'શિક્ષક કમ્યુનિટી ફીડ અને શેરિંગ',
    description: 'શિક્ષકો વચ્ચે TLM, પ્રશ્નો અને વર્કશીટ શેર કરવાની સુવિધા',
    isEnabled: true,
    category: 'core'
  },
  {
    id: 'flag-patrak',
    key: 'patrak_automation',
    name: 'Patrak Automation',
    gujaratiName: 'પત્રક ઓટોમેશન (A, B, C)',
    description: 'પરીક્ષા પરિણામ અને પત્રકો તૈયાર કરવાની ઓટો સિસ્ટમ',
    isEnabled: true,
    category: 'tools'
  },
  {
    id: 'flag-rojmel',
    key: 'digital_rojmel',
    name: 'Digital Rojmel & Grants',
    gujaratiName: 'રોકડમેળ અને શાળા ગ્રાન્ટ્સ હિસાબ',
    description: 'શાળાના નાણાકીય હિસાબ અને ઓડિટ-સેફ વાઉચર્સ',
    isEnabled: true,
    category: 'tools'
  },
  {
    id: 'flag-question-paper',
    key: 'question_paper_generator',
    name: 'Question Paper Maker',
    gujaratiName: 'પ્રશ્નપત્ર જનરેટર અને પ્રશ્નબેંક',
    description: 'GCERT અભ્યાસક્રમ મુજબ એકમ કસોટી પેપર નિર્માણ',
    isEnabled: true,
    category: 'tools'
  },
  {
    id: 'flag-pm-poshan',
    key: 'pm_poshan_mdm',
    name: 'PM Poshan MDM Calculator',
    gujaratiName: 'PM પોષણ (MDM) કેલ્ક્યુલેટર',
    description: 'દૈનિક અનાજ વપરાશ અને કુકિંગ કોસ્ટ હિસાબ',
    isEnabled: true,
    category: 'tools'
  },
  {
    id: 'flag-offline-sync',
    key: 'offline_sync',
    name: 'Offline-First Auto Backup',
    gujaratiName: 'ઓફલાઇન ડેટા સેવિંગ & બેકઅપ',
    description: 'ઇન્ટરનેટ વિના પણ શિક્ષકોનું કામ સુરક્ષિત સેવ રહે',
    isEnabled: true,
    category: 'core'
  }
];

export const INITIAL_FEATURE_PACKS: FeaturePack[] = [
  {
    id: 'pack-pro-all',
    name: 'ShalaSarathi Pro (All-App Access)',
    gujaratiName: 'શાળા સારથિ પ્રો (સંપૂર્ણ એપ્લિકેશન એક્સેસ)',
    featureKey: 'all_app_access',
    price: 499,
    originalPrice: 999,
    durationDays: 365,
    durationLabel: '૧ વર્ષ માટે (1 Year)',
    usageType: 'unlimited',
    description: 'શાળાના તમામ મોડ્યુલ્સ અનલિમિટેડ, એડ-ફ્રી અનુભવ અને ક્લાઉડ બેકઅપ',
    benefits: [
      'તમામ પત્રકો અનલિમિટેડ જનરેટ કરો',
      'સંપૂર્ણ વર્ષનું ડિજિટલ રોજમેળ & વાઉચર્સ',
      'અનલિમિટેડ પ્રશ્નપત્રો અને પ્રશ્નબેંક',
      'તમામ સત્તાવાર પત્રો અને પ્રમાણપત્રો',
      'સંપૂર્ણ એડ-ફ્રી (જાહેરાત મુક્ત) વપરાશ'
    ],
    isActive: true,
    badge: 'સર્વશ્રેષ્ઠ બચત'
  },
  {
    id: 'pack-patrak-annual',
    name: 'Patrak Automation Pack',
    gujaratiName: 'પત્રક ઓટોમેશન પેક (૫૦ ટેમ્પલેટ્સ)',
    featureKey: 'patrak_automation',
    price: 199,
    originalPrice: 399,
    durationDays: 365,
    durationLabel: '૧ વર્ષ માટે (1 Year)',
    usageLimit: 50,
    usageType: 'templates',
    description: 'પ્રાથમિક શાળાના પત્રક A, B, C અને પરિણામ શીટ્સ માટે ખાસ',
    benefits: [
      '૫૦ પ્રીમિયમ પત્રક ટેમ્પલેટ્સ',
      'ઓટો ગ્રેડ કેલ્ક્યુલેશન',
      'A4 પ્રિન્ટેબલ PDF એક્સપોર્ટ'
    ],
    isActive: true
  },
  {
    id: 'pack-question-paper',
    name: 'Question Paper Pack',
    gujaratiName: 'પ્રશ્નપત્ર જનરેટર પેક (૫૦ પેપર્સ)',
    featureKey: 'question_paper',
    price: 199,
    originalPrice: 350,
    durationDays: 365,
    durationLabel: '૧ વર્ષ માટે (1 Year)',
    usageLimit: 50,
    usageType: 'generations',
    description: 'ધોરણ ૩ થી ૮ તમામ વિષયોના ૫૦ કસોટી પેપર્સ બનાવો',
    benefits: [
      '૫૦ કસ્ટમ પ્રશ્નપત્રો નિર્માણ',
      'GCERT સ્ટાન્ડર્ડ બ્લૂપ્રિન્ટ',
      'સંપૂર્ણ ઉત્તરીય કૂંચી (Answer Key)'
    ],
    isActive: true
  },
  {
    id: 'pack-rojmel-grant',
    name: 'Rojmel & Grants Pro Pack',
    gujaratiName: 'રોજમેળ અને શાળા ગ્રાન્ટ્સ હિસાબ પેક',
    featureKey: 'rojmel_grants',
    price: 149,
    originalPrice: 299,
    durationDays: 365,
    durationLabel: '૧ વર્ષ માટે (1 Year)',
    usageType: 'unlimited',
    description: 'શાળાના આચાર્ય અને શિક્ષકો માટે ઓડિટ-સેફ વાઉચર્સ અને રોજમેળ',
    benefits: [
      'સંપૂર્ણ નાણાકીય વર્ષનો રોકડમેળ',
      'કોમ્પોઝીટ ગ્રાન્ટ હેડવાઇઝ બજેટ',
      'ઓડિટ વાઉચર્સ અને પ્રિન્ટેબલ બિલ'
    ],
    isActive: true
  }
];

export const INITIAL_ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  passwordHash: 'Admin@2026',
  recoveryPin: '2026-SARATHI-SECURE',
  failedAttempts: 0,
  lockoutUntil: null,
  sessionTimeoutMinutes: 60,
  lastLoginAt: '2026-08-22 09:00 AM'
};

export const INITIAL_UPLOADED_TEMPLATES: TeacherUploadedTemplate[] = [
  {
    id: 'custom-tpl-001',
    title: 'વર્ગખંડ નિરીક્ષણ & વિદ્યાર્થી પ્રોગ્રેસ ચાર્ટ',
    description: 'દૈનિક પ્રવૃત્તિ, રસ-રુચિ અને વર્ગ સહભાગિતા ચકાસણી માટેનું કસ્ટમ શિક્ષક મૂલ્યાંકન પત્રક.',
    category: 'classroom_template',
    categoryLabel: 'વર્ગખંડ ટેમ્પ્લેટ્સ',
    standard: 'ધોરણ ૫-૮',
    subject: 'સામાન્ય / તમામ વિષય',
    fileType: 'image',
    mimeType: 'image/svg+xml',
    fileName: 'classroom_observation_chart.svg',
    fileSize: '48 KB',
    fileSizeBytes: 49152,
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100" fill="white"><rect width="800" height="1100" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="4"/><rect x="40" y="40" width="720" height="90" rx="12" fill="%23fffbeb" stroke="%23f59e0b" stroke-width="2"/><text x="400" y="80" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="%2392400e" text-anchor="middle">શ્રી પ્રાથમિક શાળા - વર્ગખંડ નિરીક્ષણ પત્રક</text><text x="400" y="110" font-family="Arial, sans-serif" font-size="14" fill="%23b45309" text-anchor="middle">શિક્ષક અવલોકન અને વિદ્યાર્થી સર્વાંગી વિકાસ મૂલ્યાંકન</text><line x1="40" y1="160" x2="760" y2="160" stroke="%23e2e8f0" stroke-width="2"/><rect x="40" y="180" width="720" height="40" fill="%23f8fafc" stroke="%23cbd5e1"/><text x="60" y="206" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="%23334155">ક્રમ</text><text x="130" y="206" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="%23334155">વિદ્યાર્થીનું નામ</text><text x="360" y="206" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="%23334155">હાજરી</text><text x="460" y="206" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="%23334155">સ્વચ્છતા</text><text x="560" y="206" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="%23334155">જૂથકાર્ય</text><text x="670" y="206" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="%23334155">ગ્રેડ</text><line x1="40" y1="260" x2="760" y2="260" stroke="%23f1f5f9" stroke-width="2"/><text x="60" y="248" font-family="Arial, sans-serif" font-size="12" fill="%2364748b">૧</text><text x="130" y="248" font-family="Arial, sans-serif" font-size="12" fill="%231e293b">આર્યન પટેલ</text><text x="360" y="248" font-family="Arial, sans-serif" font-size="12" fill="%2316a34a">નિયમિત</text><text x="460" y="248" font-family="Arial, sans-serif" font-size="12" fill="%230284c7">ઉત્તમ</text><text x="560" y="248" font-family="Arial, sans-serif" font-size="12" fill="%230284c7">સક્રિય</text><text x="680" y="248" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="%23b45309">A+</text><line x1="40" y1="300" x2="760" y2="300" stroke="%23f1f5f9" stroke-width="2"/><text x="60" y="288" font-family="Arial, sans-serif" font-size="12" fill="%2364748b">૨</text><text x="130" y="288" font-family="Arial, sans-serif" font-size="12" fill="%231e293b">દિયા પરમાર</text><text x="360" y="288" font-family="Arial, sans-serif" font-size="12" fill="%2316a34a">નિયમિત</text><text x="460" y="288" font-family="Arial, sans-serif" font-size="12" fill="%230284c7">ઉત્તમ</text><text x="560" y="288" font-family="Arial, sans-serif" font-size="12" fill="%230284c7">સક્રિય</text><text x="680" y="288" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="%23b45309">A+</text><rect x="40" y="940" width="720" height="110" rx="8" fill="%23f8fafc" stroke="%23cbd5e1"/><text x="60" y="970" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="%23334155">શિક્ષકની વિશેષ નોંધ:</text><text x="60" y="995" font-family="Arial, sans-serif" font-size="12" fill="%2364748b">દર શુક્રવારે પ્રગતિ પત્રક વાલી સુધી પહોંચાડવું.</text><text x="100" y="1035" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="%23475569">વર્ગ શિક્ષકની સહી: ____________</text><text x="520" y="1035" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="%23475569">આચાર્યની સહી: ____________</text></svg>',
    uploadedAt: '૨૨ ઓગસ્ટ ૨૦૨૬',
    uploadedBy: 'શિક્ષક શ્રી',
    tags: ['અવલોકન', 'વર્ગખંડ', 'પ્રોગ્રેસ', 'A4'],
    isFavorite: true
  },
  {
    id: 'custom-tpl-002',
    title: 'ગણિત પઝલ & TLM વર્કશીટ ફોર્મેટ',
    description: 'અંક ગણિત, ગુણાકાર-ભાગાકાર અને કોયડા ઉકેલ માટે વિદ્યાર્થીઓ માટેની ખાસ વર્કશીટ ટેમ્પ્લેટ.',
    category: 'fln_remedial',
    categoryLabel: 'FLN & સુધારણા કાર્ય',
    standard: 'ધોરણ ૩-૫',
    subject: 'ગણિત',
    fileType: 'image',
    mimeType: 'image/svg+xml',
    fileName: 'math_puzzle_tlm_sheet.svg',
    fileSize: '54 KB',
    fileSizeBytes: 55296,
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100" fill="white"><rect width="800" height="1100" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="4"/><rect x="40" y="40" width="720" height="80" rx="10" fill="%23eff6ff" stroke="%233b82f6" stroke-width="2"/><text x="400" y="75" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="%231e40af" text-anchor="middle">ગણિત ગમ્મત - દૈનિક મહાવરો & કોયડા ઉકેલ</text><text x="400" y="102" font-family="Arial, sans-serif" font-size="13" fill="%232563eb" text-anchor="middle">FLN પાયાની ગણતરી ક્ષમતા વિકાસ શીટ</text><rect x="60" y="150" width="310" height="180" rx="10" fill="%23faf5ff" stroke="%23c084fc"/><text x="80" y="180" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="%236b21a8">પ્રવૃત્તિ ૧: ગુણાકાર ચક્ર</text><text x="80" y="210" font-family="Arial, sans-serif" font-size="12" fill="%23475569">• ૭ × ૮ = ______</text><text x="80" y="240" font-family="Arial, sans-serif" font-size="12" fill="%23475569">• ૯ × ૬ = ______</text><text x="80" y="270" font-family="Arial, sans-serif" font-size="12" fill="%23475569">• ૧૨ × ૪ = ______</text><rect x="430" y="150" width="310" height="180" rx="10" fill="%23f0fdf4" stroke="%234ade80"/><text x="450" y="180" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="%23166534">પ્રવૃત્તિ ૨: સ્થાનકિંમત ઓળખો</text><text x="450" y="210" font-family="Arial, sans-serif" font-size="12" fill="%23475569">• ૫૭૪ માં ૭ ની સ્થાનકિંમત = ______</text><text x="450" y="240" font-family="Arial, sans-serif" font-size="12" fill="%23475569">• ૮૨૯ માં ૮ ની સ્થાનકિંમત = ______</text><text x="450" y="270" font-family="Arial, sans-serif" font-size="12" fill="%23475569">• ૬૦૩ માં ૦ ની સ્થાનકિંમત = ______</text></svg>',
    uploadedAt: '૨૨ ઓગસ્ટ ૨૦૨૬',
    uploadedBy: 'શિક્ષક શ્રી',
    tags: ['ગણિત', 'FLN', 'વર્કશીટ', 'કોયડા'],
    isFavorite: false
  }
];

export const INITIAL_ADMIN_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-22T09:00:00.000Z',
    action: 'login_success',
    details: 'સુરક્ષિત એડમિન સેશન પ્રારંભ થયો (Default Admin)',
    status: 'success'
  }
];

export const INITIAL_RESOURCE_REVIEWS: ResourceReview[] = [
  {
    id: 'rev-001',
    resourceId: 'lp-maths-std-1-5',
    teacherName: 'રમેશભાઈ એચ. પટેલ',
    schoolName: 'મોડેલ પ્રાયમરી સ્કૂલ, હિંમતનગર',
    district: 'સાબરકાંઠા',
    rating: 5,
    comment: 'ધોરણ ૧ થી ૫ માટે ખૂબ જ વ્યવસ્થિત LO આધારિત આયોજન છે. મૂર્ત વસ્તુઓ અને સંખ્યાજ્ઞાન પ્રવૃત્તિઓથી બાળકોમાં ઝડપી સમજણ કેળવાઈ. આભાર!',
    teachingContext: 'ધોરણ ૩-૪ ગણિત શિક્ષક',
    createdAt: '૧૮ ઓગસ્ટ ૨૦૨૬',
    helpfulCount: 24,
    tags: ['LO આધારિત', 'સરળ સમજૂતી']
  },
  {
    id: 'rev-002',
    resourceId: 'lp-maths-std-1-5',
    teacherName: 'જિગ્નેશભાઈ સોલંકી',
    schoolName: 'શ્રી પ્રાથમિક શાળા વડગામ',
    district: 'બનાસકાંઠા',
    rating: 5,
    comment: 'દૈનિક પાઠ આયોજનમાં અબેકસ અને આકાર ચાર્ટની પ્રવૃત્તિ ખૂબ જ ઉપયોગી સાબિત થઈ. પ્રિન્ટ આઉટ લઈને સીધું વર્ગખંડમાં અમલ કરી શકાય છે.',
    teachingContext: 'પ્રાથમિક વિભાગ',
    createdAt: '૧૫ ઓગસ્ટ ૨૦૨૬',
    helpfulCount: 16,
    tags: ['TLM ઉપયોગી', 'A4 પ્રિન્ટ']
  },
  {
    id: 'rev-003',
    resourceId: 'lp-maths-std-1-5',
    teacherName: 'શર્મિષ્ઠાબેન દવે',
    schoolName: 'કન્યા શાળા ગાંધીનગર',
    district: 'ગાંધીનગર',
    rating: 4,
    comment: 'પાઠ આયોજન ઉત્તમ છે, સમયપત્રક મુજબ માઈક્રો પ્લાનિંગ પણ સરસ છે. સરવાળા-બાદબાકી માટે હજુ થોડી વધુ વર્કશીટ્સ જોડી શકાય.',
    teachingContext: 'ગણિત શિક્ષિકા',
    createdAt: '૧૦ ઓગસ્ટ ૨૦૨૬',
    helpfulCount: 9,
    tags: ['સારું માર્ગદર્શન']
  },
  {
    id: 'rev-004',
    resourceId: 'lp-science-std-6-8',
    teacherName: 'પ્રવીણભાઈ રાઠોડ',
    schoolName: 'અનુપમ પ્રાથમિક શાળા, મોડાસા',
    district: 'અરવલ્લી',
    rating: 5,
    comment: 'પ્રાયોગિક વિજ્ઞાન પાઠ આયોજન અદ્ભુત છે! વિદ્યુત પરિપથ અને ડુંગળીના કોષના અવલોકન માટેની વિધિ ખૂબ સ્પષ્ટ છે. તમામ વિજ્ઞાન શિક્ષકો માટે અનિવાર્ય સાધન.',
    teachingContext: 'ધોરણ ૬-૮ વિજ્ઞાન શિક્ષક',
    createdAt: '૨૦ ઓગસ્ટ ૨૦૨૬',
    helpfulCount: 31,
    tags: ['પ્રયોગો', 'ઉચ્ચ પ્રાથમિક']
  },
  {
    id: 'rev-005',
    resourceId: 'lp-science-std-6-8',
    teacherName: 'દિપીકાબેન મહેતા',
    schoolName: 'શ્રી સરદાર પટેલ પ્રા. શાળા, મહેસાણા',
    district: 'મહેસાણા',
    rating: 5,
    comment: 'પદાર્થોના ગુણધર્મો અને અલગીકરણની પ્રવૃત્તિઓ બાળકોને ખૂબ ગમી. પાઠ આયોજનમાં આપેલી પ્રશ્નોત્તરી પરીક્ષા લક્ષી છે.',
    teachingContext: 'વિજ્ઞાન & ટેકનોલોજી',
    createdAt: '૧૪ ઓગસ્ટ ૨૦૨૬',
    helpfulCount: 18,
    tags: ['પરીક્ષા લક્ષી']
  },
  {
    id: 'rev-006',
    resourceId: 'smc-meeting-register-format',
    teacherName: 'હરેશભાઈ પટેલ (HTAT)',
    schoolName: 'શ્રી પ્રાથમિક શાળા, હિંમતનગર',
    district: 'સાબરકાંઠા',
    rating: 5,
    comment: 'SMC માસિક બેઠક અને ગ્રાન્ટ ખર્ચ ઠરાવ માટેનું ફોર્મેટ નિયમોનુસાર અને પરિપૂર્ણ છે. શાળા ઓડિટમાં પણ આ ફોર્મેટ સ્વીકાર્ય રહ્યું.',
    teachingContext: 'મુખ્ય શિક્ષક (HTAT)',
    createdAt: '૧૯ ઓગસ્ટ ૨૦૨૬',
    helpfulCount: 27,
    tags: ['SMC નિયમ', 'ઓડિટ માન્ય']
  },
  {
    id: 'rev-007',
    resourceId: 'fln-pragna-reading-evaluation',
    teacherName: 'કિરણબેન પંડ્યા',
    schoolName: 'કેન્દ્રવર્તી શાળા પાલનપુર',
    district: 'બનાસકાંઠા',
    rating: 5,
    comment: 'વાંચન ગતિ અને શ્રુતલેખન ક્ષમતા માપવા માટેનું શ્રેષ્ઠ ટ્રેકિંગ ચાર્ટ! સુધારણા વર્ગના નબળા બાળકો માટે ખૂબ ફાયદાકારક રહ્યું.',
    teachingContext: 'ધોરણ ૧-૨ પ્રજ્ઞા શિક્ષિકા',
    createdAt: '૨૧ ઓગસ્ટ ૨૦૨૬',
    helpfulCount: 22,
    tags: ['FLN શ્રેષ્ઠ', 'સુધારણા કાર્ય']
  },
  {
    id: 'rev-008',
    resourceId: 'custom-tpl-001',
    teacherName: 'મહેશકુમાર વ્યાસ',
    schoolName: 'પ્રાથમિક શાળા ઇડર',
    district: 'સાબરકાંઠા',
    rating: 5,
    comment: 'કસ્ટમ વર્ગખંડ નિરીક્ષણ પત્રક ખૂબ સરસ રીતે તૈયાર થયેલું છે. વિદ્યાર્થીઓની સ્વચ્છતા અને જૂથકાર્યનું ચોક્કસ મૂલ્યાંકન થાય છે.',
    teachingContext: 'વર્ગ શિક્ષક',
    createdAt: '૨૨ ઓગસ્ટ ૨૦૨૬',
    helpfulCount: 8,
    tags: ['મૂલ્યાંકન']
  }
];

export const INITIAL_WEEKLY_CLASSES: WeeklyClassPeriod[] = [
  // સોમવાર (Monday)
  {
    id: 'cls-mon-1',
    day: 'monday',
    periodNumber: 1,
    startTime: '10:45 AM',
    endTime: '11:30 AM',
    standard: 'ધોરણ ૮',
    division: 'અ',
    subject: 'ગણિત',
    topic: 'પ્રકરણ ૫: માહિતીનું નિયમન (સ્તંભ આલેખ)',
    room: 'રૂમ નં. ૮',
    learningOutcome: 'M805: આપેલ માહિતી પરથી આવૃત્તિ વિતરણ અને સ્તંભ આલેખ દોરી શકે છે.',
    isCompleted: true
  },
  {
    id: 'cls-mon-2',
    day: 'monday',
    periodNumber: 2,
    startTime: '11:30 AM',
    endTime: '12:15 PM',
    standard: 'ધોરણ ૭',
    division: 'અ',
    subject: 'વિજ્ઞાન',
    topic: 'પ્રકરણ ૬: સજીવોમાં શ્વસન (પ્રાયોગિક મોડેલ)',
    room: 'વિજ્ઞાન પ્રયોગશાળા',
    learningOutcome: 'SCI704: શ્વાસોચ્છવાસની પ્રક્રિયાનું મોડેલ દ્વારા નિદર્શન કરે છે.',
    isCompleted: true
  },
  {
    id: 'cls-mon-4',
    day: 'monday',
    periodNumber: 4,
    startTime: '01:35 PM',
    endTime: '02:20 PM',
    standard: 'ધોરણ ૬',
    division: 'બ',
    subject: 'સામાજિક વિજ્ઞાન',
    topic: 'પ્રકરણ ૪: ભારતની પ્રારંભિક રાજ્યવ્યવસ્થા (મહાજનપદ)',
    room: 'રૂમ નં. ૬',
    learningOutcome: 'SS602: પ્રાચીન ગણરાજ્યો અને મગધ સામ્રાજ્ય વચ્ચેનો તફાવત સમજે છે.',
    isCompleted: false
  },
  {
    id: 'cls-mon-6',
    day: 'monday',
    periodNumber: 6,
    startTime: '03:00 PM',
    endTime: '03:40 PM',
    standard: 'ધોરણ ૭',
    division: 'અ',
    subject: 'ગણિત (FLN સુધારણા)',
    topic: 'અપૂર્ણાંક અને દશાંશ સંખ્યાઓના ગુણાકાર-ભાગાકાર કૌશલ્ય',
    room: 'રૂમ નં. ૭',
    learningOutcome: 'FLN-NUM: દશાંશ ચિહ્નની સ્થાનકિંમત અને વ્યવહારુ ગણતરી.',
    isCompleted: false
  },

  // મંગળવાર (Tuesday)
  {
    id: 'cls-tue-1',
    day: 'tuesday',
    periodNumber: 1,
    startTime: '10:45 AM',
    endTime: '11:30 AM',
    standard: 'ધોરણ ૭',
    division: 'અ',
    subject: 'વિજ્ઞાન',
    topic: 'પ્રકરણ ૬: મનુષ્યનું શ્વસનતંત્ર (ચાર્ટ નિર્માણ)',
    room: 'રૂમ નં. ૭',
    learningOutcome: 'SCI705: શ્વસનતંત્રના અંગોનું કાર્ય વર્ણવે છે.',
    isCompleted: false
  },
  {
    id: 'cls-tue-2',
    day: 'tuesday',
    periodNumber: 2,
    startTime: '11:30 AM',
    endTime: '12:15 PM',
    standard: 'ધોરણ ૮',
    division: 'અ',
    subject: 'ગણિત',
    topic: 'સાપ્તાહિક એકમ કસોટી (Unit Test): પ્રકરણ ૪ અને ૫',
    room: 'રૂમ નં. ૮',
    learningOutcome: 'M801: સ્વાધ્યાય અને મૂલ્યાંકન પરિણામ વિશ્લેષણ.',
    isCompleted: false
  },
  {
    id: 'cls-tue-3',
    day: 'tuesday',
    periodNumber: 3,
    startTime: '12:15 PM',
    endTime: '01:00 PM',
    standard: 'ધોરણ ૬',
    division: 'અ',
    subject: 'સામાજિક વિજ્ઞાન',
    topic: 'નકશા પરિચય & ઉત્તર ભારતના ૧૬ મહાજનપદ',
    room: 'રૂમ નં. ૬',
    learningOutcome: 'SS608: ભારતના નકશામાં ઐતિહાસિક સ્થળોનું અંકન કરે છે.',
    isCompleted: false
  },
  {
    id: 'cls-tue-5',
    day: 'tuesday',
    periodNumber: 5,
    startTime: '02:20 PM',
    endTime: '03:00 PM',
    standard: 'ધોરણ ૮',
    division: 'અ',
    subject: 'વિજ્ઞાન',
    topic: 'પ્રકરણ ૭: કિશોરાવસ્થા તરફ (હૉર્મોન્સ અને ફેરફારો)',
    room: 'રૂમ નં. ૮',
    learningOutcome: 'SCI808: શારીરિક અને માનસિક વિકાસની પ્રક્રિયા સમજે છે.',
    isCompleted: false
  },

  // બુધવાર (Wednesday)
  {
    id: 'cls-wed-1',
    day: 'wednesday',
    periodNumber: 1,
    startTime: '10:45 AM',
    endTime: '11:30 AM',
    standard: 'ધોરણ ૬',
    division: 'અ',
    subject: 'ગણિત',
    topic: 'પ્રકરણ ૭: અપૂર્ણાંક સંખ્યાઓ (સમચ્છેદી સરવાળા)',
    room: 'રૂમ નં. ૬',
    learningOutcome: 'M603: સમઅપૂર્ણાંક અને અતિસંક્ષિપ્ત રૂપની સમજ મેળવે છે.',
    isCompleted: false
  },
  {
    id: 'cls-wed-2',
    day: 'wednesday',
    periodNumber: 2,
    startTime: '11:30 AM',
    endTime: '12:15 PM',
    standard: 'ધોરણ ૮',
    division: 'અ',
    subject: 'ગણિત',
    topic: 'પ્રકરણ ૬: વર્ગ અને વર્ગમૂળ (અવિભાજ્ય અવયવની રીત)',
    room: 'રૂમ નં. ૮',
    learningOutcome: 'M802: વર્ગમૂળ શોધવાની રીતોનો ઉપયોગ કરી કોયડા ઉકેલે છે.',
    isCompleted: false
  },
  {
    id: 'cls-wed-4',
    day: 'wednesday',
    periodNumber: 4,
    startTime: '01:35 PM',
    endTime: '02:20 PM',
    standard: 'ધોરણ ૭',
    division: 'બ',
    subject: 'સામાજિક વિજ્ઞાન',
    topic: 'પ્રકરણ ૫: વનવાસી, વિચરતી જાતિઓ અને સ્થાનિક સમુદાયો',
    room: 'રૂમ નં. ૭',
    learningOutcome: 'SS705: ભારતીય સંસ્કૃતિમાં આદિવાસી સમુદાયોના યોગદાનને બિરદાવે છે.',
    isCompleted: false
  },
  {
    id: 'cls-wed-7',
    day: 'wednesday',
    periodNumber: 7,
    startTime: '03:40 PM',
    endTime: '04:20 PM',
    standard: 'ધોરણ ૬-૮',
    division: 'સંયુક્ત',
    subject: 'રમતગમત / શારીરિક શિક્ષણ',
    topic: 'ખો-ખો અને કબ્બડી મેદાન કૌશલ્ય અભ્યાસ',
    room: 'શાળા રમત મેદાન',
    learningOutcome: 'PHY01: રમતગમતમાં ટીમવર્ક, સ્ફૂર્તિ અને ખેલદિલી કેળવે છે.',
    isCompleted: false
  },

  // ગુરુવાર (Thursday)
  {
    id: 'cls-thu-1',
    day: 'thursday',
    periodNumber: 1,
    startTime: '10:45 AM',
    endTime: '11:30 AM',
    standard: 'ધોરણ ૮',
    division: 'અ',
    subject: 'વિજ્ઞાન',
    topic: 'પ્રકરણ ૮: બળ અને દબાણ (પ્રાયોગિક ચકાસણી)',
    room: 'વિજ્ઞાન પ્રયોગશાળા',
    learningOutcome: 'SCI804: સંપર્ક બળ અને અસંપર્ક બળના ઉદાહરણો પ્રયોગ દ્વારા તારવે છે.',
    isCompleted: false
  },
  {
    id: 'cls-thu-3',
    day: 'thursday',
    periodNumber: 3,
    startTime: '12:15 PM',
    endTime: '01:00 PM',
    standard: 'ધોરણ ૭',
    division: 'અ',
    subject: 'ગણિત',
    topic: 'પ્રકરણ ૫: રેખા અને ખૂણા (યુગ્મકોણ, અનુકોણની જોડ)',
    room: 'રૂમ નં. ૭',
    learningOutcome: 'M703: સમાંતર રેખાઓની છેદિકાથી બનતા ખૂણાઓની ઓળખ કરે છે.',
    isCompleted: false
  },
  {
    id: 'cls-thu-5',
    day: 'thursday',
    periodNumber: 5,
    startTime: '02:20 PM',
    endTime: '03:00 PM',
    standard: 'ધોરણ ૬',
    division: 'અ',
    subject: 'વિજ્ઞાન',
    topic: 'પ્રકરણ ૭: વનસ્પતિની જાણકારી મેળવીએ (મૂળ અને પર્ણ)',
    room: 'શાળા પરિસર / બગીચો',
    learningOutcome: 'SCI603: સોટીમૂળ, તંતુમૂળ અને પર્ણ શિરાવિન્યાસનું અવલોકન કરે છે.',
    isCompleted: false
  },

  // શુક્રવાર (Friday)
  {
    id: 'cls-fri-1',
    day: 'friday',
    periodNumber: 1,
    startTime: '10:45 AM',
    endTime: '11:30 AM',
    standard: 'ધોરણ ૮',
    division: 'અ',
    subject: 'ગણિત',
    topic: 'પ્રકરણ ૬: વર્ગમૂળ શોધવા માટે ભાગાકારની રીત',
    room: 'રૂમ નં. ૮',
    learningOutcome: 'M802: મોટી સંખ્યાઓનું ભાગાકાર પદ્ધતિથી વર્ગમૂળ મેળવે છે.',
    isCompleted: false
  },
  {
    id: 'cls-fri-2',
    day: 'friday',
    periodNumber: 2,
    startTime: '11:30 AM',
    endTime: '12:15 PM',
    standard: 'ધોરણ ૭',
    division: 'અ',
    subject: 'વિજ્ઞાન',
    topic: 'પ્રકરણ ૭: પ્રાણીઓ અને વનસ્પતિઓમાં વહન',
    room: 'રૂમ નં. ૭',
    learningOutcome: 'SCI706: રુધિરાભિસરણ તંત્ર અને હૃદયના ધબકારાની સંકલ્પના સ્પષ્ટ કરે છે.',
    isCompleted: false
  },
  {
    id: 'cls-fri-4',
    day: 'friday',
    periodNumber: 4,
    startTime: '01:35 PM',
    endTime: '02:20 PM',
    standard: 'ધોરણ ૬',
    division: 'અ',
    subject: 'સામાજિક વિજ્ઞાન',
    topic: 'પ્રકરણ ૫: શાંતિની શોધમાં: બુદ્ધ અને મહાવીર',
    room: 'રૂમ નં. ૬',
    learningOutcome: 'SS604: ગૌતમ બુદ્ધ અને મહાવીર સ્વામીના ઉપદેશો અને જીવનમૂલ્યો સમજે છે.',
    isCompleted: false
  },
  {
    id: 'cls-fri-6',
    day: 'friday',
    periodNumber: 6,
    startTime: '03:00 PM',
    endTime: '03:40 PM',
    standard: 'ધોરણ ૬ થી ૮',
    division: 'સંયુક્ત',
    subject: 'પુસ્તકાલય / વાંચન પ્રવૃત્તિ',
    topic: 'વાંચન અભિયાન & બાળસાહિત્ય પુસ્તક સમીક્ષા',
    room: 'શાળા લાયબ્રેરી',
    learningOutcome: 'LANG05: સ્વતંત્ર વાંચન અને વાંચેલ પુસ્તકનો સારાંશ રજૂ કરે છે.',
    isCompleted: false
  },

  // શનિવાર (Saturday - Morning Session)
  {
    id: 'cls-sat-1',
    day: 'saturday',
    periodNumber: 1,
    startTime: '07:30 AM',
    endTime: '08:15 AM',
    standard: 'ધોરણ ૮',
    division: 'અ',
    subject: 'ગણિત / ક્વિઝ',
    topic: 'સાપ્તાહિક ગણિત કોયડા ક્વિઝ & સુધારણા કાર્ય',
    room: 'રૂમ નં. ૮',
    learningOutcome: 'M809: ઝડપી ગણતરી અને તાર્કિક ક્ષમતા વિકસાવે છે.',
    isCompleted: false
  },
  {
    id: 'cls-sat-2',
    day: 'saturday',
    periodNumber: 2,
    startTime: '08:15 AM',
    endTime: '09:00 AM',
    standard: 'ધોરણ ૭',
    division: 'અ',
    subject: 'ચિત્રકામ / હસ્તકલા',
    topic: 'કુદરતી દ્રશ્ય ચિત્રણ અને રંગપૂરણી કૌશલ્ય',
    room: 'રૂમ નં. ૭',
    learningOutcome: 'ART01: રંગોનું સંયોજન અને સર્જનાત્મક અભિવ્યક્તિ સાધે છે.',
    isCompleted: false
  },
  {
    id: 'cls-sat-3',
    day: 'saturday',
    periodNumber: 3,
    startTime: '09:00 AM',
    endTime: '09:45 AM',
    standard: 'ધોરણ ૬',
    division: 'અ',
    subject: 'પર્યાવરણ / વિજ્ઞાન પ્રોજેક્ટ',
    topic: 'પાણી બચાવો - જળસંચય મોડેલ નિર્માણ',
    room: 'રૂમ નં. ૬',
    learningOutcome: 'SCI609: જળસંરક્ષણની જરૂરિયાત સમજી પ્રોજેક્ટ તૈયાર કરે છે.',
    isCompleted: false
  }
];

export const INITIAL_SCHOOL_WEEKLY_EVENTS: SchoolWeeklyEvent[] = [
  {
    id: 'evt-001',
    day: 'monday',
    dateStr: '૨૪ ઓગસ્ટ ૨૦૨૬',
    title: 'વિશેષ સર્વધર્મ પ્રાર્થના સંમેલન & સાપ્તાહિક સંકલ્પ',
    category: 'assembly',
    categoryLabel: 'પ્રાર્થના સંમેલન',
    time: '10:30 AM - 10:45 AM',
    location: 'શાળા સેન્ટ્રલ હોલ',
    description: 'રાષ્ટ્રગીત, સુવિચાર, દૈનિક વર્તમાન પ્રવાહો અને સાપ્તાહિક સ્વચ્છતા સંકલ્પ.',
    priority: 'medium',
    assignedTo: 'શિક્ષક સ્ટાફ (પ્રાર્થના સમિતિ)',
    isCompleted: true
  },
  {
    id: 'evt-002',
    day: 'monday',
    dateStr: '૨૪ ઓગસ્ટ ૨૦૨૬',
    title: 'શિક્ષણ વિભાગ સાપ્તાહિક પરિપત્ર સમીક્ષા & શિષ્યવૃત્તિ ડેટા ચકાસણી',
    category: 'meeting',
    categoryLabel: 'સ્ટાફ મીટિંગ',
    time: '04:30 PM - 05:00 PM',
    location: 'સ્ટાફ રૂમ',
    description: 'ડિજિટલ ગુજરાત શિષ્યવૃત્તિ પોર્ટલ અને આધાર ડાયસ એન્ટ્રી પૂર્ણ કરવા અંગે ચર્ચા.',
    priority: 'high',
    assignedTo: 'હરેશભાઈ પટેલ (આચાર્ય) & તમામ શિક્ષકો',
    isCompleted: false
  },
  {
    id: 'evt-003',
    day: 'tuesday',
    dateStr: '૨૫ ઓગસ્ટ ૨૦૨૬',
    title: 'ધોરણ ૬ થી ૮ ગણિત-વિજ્ઞાન સાપ્તાહિક એકમ કસોટી (PAT)',
    category: 'exam',
    categoryLabel: 'એકમ કસોટી (PAT)',
    time: '11:30 AM - 12:30 PM',
    location: 'તમામ વર્ગખંડો',
    description: 'અધ્યયન નિષ્પત્તિ આધારિત ૧૫ ગુણની સાપ્તાહિક મૂલ્યાંકન કસોટી.',
    priority: 'high',
    assignedTo: 'ભાવિનકુમાર પરમાર (પરીક્ષા પ્રભારી)',
    isCompleted: false
  },
  {
    id: 'evt-004',
    day: 'wednesday',
    dateStr: '૨૬ ઓગસ્ટ ૨૦૨૬',
    title: 'પી.એમ. પોષણ (MDM) સ્વાદિષ્ટ ભોજન & દૂધ સંજીવની ગુણવત્તા નિરીક્ષણ',
    category: 'special_duty',
    categoryLabel: 'પી.એમ. પોષણ ફરજ',
    time: '01:00 PM - 01:35 PM',
    location: 'શાળા ડાઇનિંગ શેડ',
    description: 'દૈનિક અનાજ વપરાશ રજીસ્ટર નોંધણી, બાળકોના હાથ ધોવાની સ્વચ્છતા અને તાજગી ચકાસણી.',
    priority: 'medium',
    assignedTo: 'ભાવિનકુમાર પરમાર & સંચાલિકા બહેન',
    isCompleted: false
  },
  {
    id: 'evt-005',
    day: 'thursday',
    dateStr: '૨૭ ઓગસ્ટ ૨૦૨૬',
    title: 'શાળા વ્યવસ્થાપન સમિતિ (SMC) ઓગસ્ટ માસની સામાન્ય સભા',
    category: 'meeting',
    categoryLabel: 'SMC બેઠક',
    time: '03:00 PM - 04:30 PM',
    location: 'કોન્ફરન્સ રૂમ',
    description: 'શાળા સંયુક્ત ગ્રાન્ટ ખર્ચ ઠરાવ, મધ્યાહન ભોજન સમીક્ષા અને વિદ્યાર્થીઓની નિયમિત હાજરી પ્રોત્સાહન.',
    priority: 'high',
    assignedTo: 'SMC અધ્યક્ષ, આચાર્ય શ્રી અને સભ્યો',
    isCompleted: false
  },
  {
    id: 'evt-006',
    day: 'friday',
    dateStr: '૨૮ ઓગસ્ટ ૨૦૨૬',
    title: 'વિદ્યાર્થી આનંદ મેળો & બાલસભા (સાંસ્કૃતિક અને વક્તૃત્વ સ્પર્ધા)',
    category: 'activity',
    categoryLabel: 'બાલસભા & પ્રવૃત્તિ',
    time: '04:20 PM - 05:00 PM',
    location: 'શાળા રંગમંચ',
    description: 'દેશભક્તિ ગીત ગાન, બાળવાર્તા કથન અને "સ્વચ્છ ભારત" વિષય પર વક્તૃત્વ.',
    priority: 'low',
    assignedTo: 'સાંસ્કૃતિક સમિતિ (વર્ગ શિક્ષકો)',
    isCompleted: false
  },
  {
    id: 'evt-007',
    day: 'saturday',
    dateStr: '૨૯ ઓગસ્ટ ૨૦૨૬',
    title: 'રાષ્ટ્રીય ખેલ દિન (National Sports Day) ઉજવણી & યોગ અભ્યાસ',
    category: 'activity',
    categoryLabel: 'રમતોત્સવ & ઉત્સવ',
    time: '09:45 AM - 11:15 AM',
    location: 'શાળા ખેલ મેદાન',
    description: 'મેજર ધ્યાનચંદ જન્મજયંતિ નિમિત્તે વિવિધ દોડ સ્પર્ધા, લીંબુ-ચમચી અને સૂર્યનમસ્કાર સત્ર.',
    priority: 'medium',
    assignedTo: 'શારીરિક શિક્ષણ પ્રભારી & સ્ટાફ',
    isCompleted: false
  },
  {
    id: 'evt-008',
    day: 'saturday',
    dateStr: '૨૯ ઓગસ્ટ ૨૦૨૬',
    title: 'આગામી સપ્તાહ શૈક્ષણિક આયોજન & પત્રક-A એન્ટ્રી બેઠક',
    category: 'training',
    categoryLabel: 'આયોજન બેઠક',
    time: '11:30 AM - 12:30 PM',
    location: 'સ્ટાફ રૂમ',
    description: 'નવા સપ્તાહના પાઠ આયોજન, TLM તૈયારી અને વિદ્યા સમીક્ષા કેન્દ્ર ડેટા સિંક.',
    priority: 'medium',
    assignedTo: 'સમગ્ર શિક્ષક સ્ટાફ',
    isCompleted: false
  }
];





