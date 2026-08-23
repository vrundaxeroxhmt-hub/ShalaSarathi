export type NavTab = 'home' | 'community' | 'work-assistant' | 'create' | 'my-work' | 'profile';

export type PortalMode = 'app' | 'admin';

export interface DynamicHomeCard {
  id: string;
  title: string;
  gujaratiTitle: string;
  subtitle: string;
  iconName: string;
  colorScheme: 'amber' | 'blue' | 'emerald' | 'purple' | 'rose' | 'indigo' | 'orange';
  targetTab: NavTab;
  targetSubFeature?: SubFeature;
  isVisible: boolean;
  order: number;
  badge?: string;
  isPremium?: boolean;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  gujaratiName: string;
  description: string;
  isEnabled: boolean;
  category: 'core' | 'tools' | 'monetization' | 'experimental';
}

export interface FeaturePack {
  id: string;
  name: string;
  gujaratiName: string;
  featureKey: string;
  price: number;
  originalPrice: number;
  durationDays: number;
  durationLabel: string;
  usageLimit?: number;
  usageType: 'templates' | 'generations' | 'unlimited';
  description: string;
  benefits: string[];
  isActive: boolean;
  badge?: string;
}

export interface UserSubscription {
  planId: string;
  planName: string;
  status: 'active' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  entitlements: string[];
}

export type SubFeature = 
  | 'dashboard'
  | 'community-feed'
  | 'work-hub'
  | 'creator-hub'
  | 'patrak-automation'
  | 'rojmel'
  | 'grants'
  | 'purchases'
  | 'pm-poshan'
  | 'question-paper'
  | 'question-bank'
  | 'lesson-planning'
  | 'monthly-lesson-plan'
  | 'ai-lesson-plan'
  | 'letters-certificates'
  | 'student-roster'
  | 'downloadable-resources'
  | 'upload-resource';

export type SubFeatureType = SubFeature;

export interface AppBanner {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeColor?: 'amber' | 'emerald' | 'blue' | 'rose' | 'purple' | 'indigo' | 'orange';
  imageUrl?: string;
  bgGradient: string;
  ctaText?: string;
  ctaLinkType?: 'tab' | 'subfeature' | 'external';
  ctaTarget?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  expiresAt?: string;
}

export interface SchoolProfile {
  id: string;
  schoolName: string;
  village: string;
  taluka: string;
  district: string;
  udiseCode: string;
  schoolIndexNo: string;
  address: string;
  phone: string;
  email: string;
  principalName: string;
  academicYear: string;
  medium: 'ગુજરાતી' | 'English';
  pinCode?: string;
  bankAccountNo?: string;
  bankName?: string;
  ifscCode?: string;
  createdByUid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolMember {
  id: string;
  schoolId: string;
  uid: string;
  teacherName: string;
  teacherEmail?: string;
  roleInSchool: 'principal' | 'teacher' | 'htat' | 'admin';
  status: 'active' | 'pending' | 'invited';
  joinedAt: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  role: string;
  standardsTaught: string[];
  subjectsTaught: string[];
  experienceYears: number;
  schoolId?: string;
  schoolName: string;
  district: string;
  taluka: string;
  contributionsCount: number;
  savedResourcesCount: number;
  badges: string[];
  updatedAt?: string;
}

export interface Student {
  id: string;
  grNo: string;
  rollNo: number;
  fullName: string;
  gender: 'કુમાર' | 'કન્યા';
  dob: string;
  standard: string; // "1" to "8"
  division: string; // "A", "B"
  parentName: string;
  mobile: string;
  category: 'સામાન્ય' | 'ઓ.બી.સી.' | 'એસ.સી.' | 'એસ.ટી.' | 'ઈ.ડબલ્યુ.એસ.';
  medium: string;
  isActive: boolean;
  // Performance metrics for Patrak
  patrakAMarks?: Record<string, number>; // subject -> score (out of 40)
  patrakBGrades?: Record<string, string>; // trait -> 'A'|'B'|'C'
  patrakCMarks?: Record<string, number>; // subject -> score (out of 80)
}

export type CommunityPostType = 
  | 'questionPaper'
  | 'worksheet'
  | 'lessonPlan'
  | 'activity'
  | 'patrak'
  | 'paripatra'
  | 'letter'
  | 'certificate'
  | 'resource'
  | 'statusCard'
  | 'poll';

export type CommunityReactionType = 'like' | 'heart' | 'clap' | 'insight' | 'laugh';

export interface CommunityComment {
  id: string;
  authorName: string;
  authorRole: string;
  authorSchool?: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface PostPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PostPollData {
  question: string;
  options: PostPollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface CommunityPost {
  id: string;
  creatorId?: string;
  creatorName: string;
  creatorRole: string;
  creatorSchool: string;
  creatorDistrict: string;
  creatorAvatar?: string;
  creatorBadge?: string;
  isFollowed?: boolean;
  type: CommunityPostType;
  title: string;
  description: string;
  standard: string; // e.g. "ધોરણ 6", "તમામ ધોરણ"
  subject: string;  // e.g. "ગણિત", "વિજ્ઞાન", "બધા વિષયો"
  medium: string;
  likesCount: number;
  downloadsCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  userReaction?: CommunityReactionType | null;
  reactionCounts?: Record<CommunityReactionType, number>;
  comments?: CommunityComment[];
  tags: string[];
  createdAt: string;
  fileSnippet?: string;
  resourceContent?: string; // Preview or structured payload
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'pdf' | 'textCard';
  bgGradient?: string; // e.g. "from-purple-600 via-pink-600 to-amber-500"
  pollData?: PostPollData;
  groupId?: string;
  groupName?: string;
}

export interface TeacherStory {
  id: string;
  teacherName: string;
  teacherRole: string;
  teacherSchool: string;
  teacherAvatar: string;
  title: string;
  caption?: string;
  mediaUrl?: string;
  bgGradient?: string;
  timestamp: string;
  isSeen?: boolean;
  likesCount: number;
  isLiked?: boolean;
}

export interface TeachingReel {
  id: string;
  teacherName: string;
  teacherRole: string;
  teacherSchool: string;
  teacherAvatar: string;
  title: string;
  caption: string;
  videoThumbnail: string;
  videoDuration: string;
  videoUrl?: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowed?: boolean;
  musicTrack?: string;
  category: string;
}

export interface TeacherGroup {
  id: string;
  name: string;
  gujaratiName: string;
  description: string;
  category: string;
  membersCount: number;
  postsCount: number;
  iconName: string;
  bgGradient: string;
  isJoined: boolean;
  tags: string[];
  bannerImage?: string;
}

export interface GrantAccount {
  id: string;
  grantName: string;
  gujaratiName: string;
  sanctionedAmount: number;
  openingBalance: number;
  currentBalance: number;
  description: string;
}

export interface RojmelTransaction {
  id: string;
  accountId: string;
  grantHead: string;
  date: string;
  voucherNo: string;
  description: string;
  income: number;
  expense: number;
  paymentMode: 'રોકડ' | 'ચેક' | 'ડિજિટલ/PFMS' | 'બેંક ટ્રાન્સફર';
  referenceNo: string;
  remarks: string;
  createdBy: string;
  status: 'સક્રિય' | 'રદ કરેલ (Void)';
  voidReason?: string;
}

export interface PurchaseItem {
  id: string;
  date: string;
  itemName: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number; // quantity * rate
  grantHead: string;
  vendorName: string;
  billNo: string;
  remarks: string;
  voucherCreated: boolean;
}

export interface PmPoshanDailyRecord {
  id: string;
  date: string;
  primaryCount: number;       // Std 1 to 5 (Rate: 100g grain, ₹5.45 cooking)
  upperPrimaryCount: number;  // Std 6 to 8 (Rate: 150g grain, ₹8.17 cooking)
  totalStudents: number;
  grainRatePrimary: number;        // in kg, default 0.100 kg
  grainRateUpperPrimary: number;   // in kg, default 0.150 kg
  cookingRatePrimary: number;      // ₹ default 5.45
  cookingRateUpperPrimary: number; // ₹ default 8.17
  grainUsedKg: number;
  totalCookingCost: number;
  menuItem: string;
  remarks: string;
}

export type QuestionType = 'mcq' | 'true_false' | 'fill_blank' | 'very_short' | 'short' | 'long' | 'match';

export interface Question {
  id: string;
  standard: string;
  subject: string;
  chapter: string;
  topic?: string;
  learningOutcome?: string;
  type: QuestionType;
  difficulty: 'સરળ' | 'મધ્યમ' | 'કઠિન';
  marks: number;
  questionText: string;
  options?: string[]; // for mcq
  answer: string;
  source: string;
  isCommunityPublished?: boolean;
}

export interface QuestionPaper {
  id: string;
  title: string;
  schoolName: string;
  standard: string;
  subject: string;
  examName: string;
  academicYear: string;
  totalMarks: number;
  durationMinutes: number;
  date: string;
  instructions: string[];
  sections: {
    sectionTitle: string; // e.g. "વિભાગ A: હેતુલક્ષી પ્રશ્નો"
    marksPerQuestion: number;
    questions: Question[];
  }[];
  createdAt: string;
}

export interface DailySubTask {
  id: string;
  taskTitle: string; // e.g. "વિદ્યાર્થીઓનું પૂર્વજ્ઞાન ચકાસવું (Warm-up / Review)"
  isCompleted: boolean;
  notifyReminder?: boolean; // Notification toggle for classroom reminder & HomeDashboard badge
  notes?: string;
}

export interface DailyLessonActivity {
  id: string;
  dayNumber: number; // e.g. 1, 2, 3...
  date?: string; // e.g. "2026-08-01"
  periodNumber?: number; // 1 to 8
  title: string; // e.g. "દિવસ ૧: પૂર્ણાંક સંખ્યાઓ - સંખ્યારેખા નિરૂપણ"
  topic: string;
  learningOutcome?: string; // LO code e.g. M701
  teachingActivity: string;
  tlmUsed: string;
  assessmentMethod: string;
  homework?: string;
  subTasks: DailySubTask[];
  status: 'આયોજિત' | 'ચાલુ' | 'પૂર્ણ';
  teacherNotes?: string;
}

export interface MonthlyLessonPlan {
  id: string;
  month: string; // e.g. "ઓગસ્ટ ૨૦૨૬"
  academicYear: string; // e.g. "૨૦૨૬-૨૭"
  standard: string; // e.g. "ધોરણ ૭"
  division?: string; // e.g. "અ"
  subject: string; // e.g. "ગણિત"
  teacherName: string;
  schoolName: string;
  unitsCovered: string[]; // List of chapters/units
  totalPlannedDays: number;
  targetLearningOutcomes: string[];
  dailyActivities: DailyLessonActivity[];
  generalObjectives?: string;
  status: 'ખરડો' | 'સક્રિય' | 'પૂર્ણ';
  createdAt: string;
  updatedAt?: string;
}

export interface LessonPlan {
  id: string;
  date: string;
  standard: string;
  division: string;
  subject: string;
  unitNo: number;
  chapterName: string;
  learningOutcome: string; // અધ્યયન નિષ્પત્તિ
  activity: string;        // શૈક્ષણિક પ્રવૃત્તિ
  tlmUsed: string;         // સાધન સામગ્રી
  homework: string;        // ગૃહકાર્ય
  remarks: string;
  status: 'આયોજિત' | 'પૂર્ણ';
}

export interface AiPedagogicalStep {
  phase: string;
  durationMin: number;
  teacherActivity: string;
  studentActivity: string;
  blackboardWork?: string;
  subTasks: string[];
}

export interface AiFormativeAssessment {
  question: string;
  type?: string;
  expectedAnswer: string;
}

export interface AiLessonPlanResult {
  title: string;
  englishTitle?: string;
  standard: string;
  subject: string;
  unitName: string;
  durationMinutes: number;
  totalPeriods: number;
  planType: 'single_period' | 'weekly_block' | 'monthly_breakdown';
  learningOutcomes: {
    code: string;
    description: string;
  }[];
  generalObjectives: string[];
  prerequisites: string[];
  tlmAndResources: string[];
  pedagogicalSteps: AiPedagogicalStep[];
  formativeAssessment: AiFormativeAssessment[];
  flnAndRemedialGuidance: {
    flnLevel: string;
    remedialStrategy: string;
    extensionForAdvanced: string;
  };
  homeworkAndAssignment: string;
  teacherReflectiveNotes: string;
  dailyActivities?: {
    dayNumber: number;
    title: string;
    topic: string;
    learningOutcome?: string;
    teachingActivity: string;
    tlmUsed?: string;
    assessmentMethod?: string;
    homework?: string;
    subTasks: string[];
  }[];
}

export interface OfficialDocument {
  id: string;
  type: 'bonafide' | 'leaving_cert' | 'appreciation' | 'notice' | 'order' | 'custom_letter';
  title: string;
  studentName?: string;
  grNo?: string;
  standard?: string;
  date: string;
  referenceNo: string;
  content: string;
  recipient?: string;
  subject?: string;
}

export interface AdminCredentials {
  username: string;
  passwordHash: string; // Stored password or hash
  recoveryPin: string;   // Master recovery code (e.g. 2026-SARATHI-SECURE)
  lastLoginAt?: string;
  failedAttempts: number;
  lockoutUntil?: number | null; // Timestamp in ms
  sessionTimeoutMinutes: number;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  action: 'login_success' | 'login_failed' | 'password_changed' | 'recovery_used' | 'logout' | 'settings_updated';
  details: string;
  status: 'success' | 'warning' | 'danger';
}

export interface ResourceReview {
  id: string;
  resourceId: string;
  teacherName: string;
  schoolName?: string;
  district?: string;
  rating: number; // 1 to 5
  comment: string;
  teachingContext?: string;
  createdAt: string;
  helpfulCount: number;
  helpfulVotedUserIds?: string[];
  tags?: string[];
}

export interface DownloadableResource {
  id: string;
  title: string;
  gujaratiTitle: string;
  description: string;
  category: 'lesson_plan' | 'classroom_template' | 'admin_register' | 'fln_remedial' | 'exam_evaluation';
  categoryLabel: string;
  standard: string;
  subject?: string;
  fileFormat: 'PDF' | 'Excel' | 'Word' | 'Print';
  fileSize: string;
  downloadCount: number;
  tags: string[];
  isFeatured?: boolean;
  baseRating?: number;
  baseReviewCount?: number;
  contentStructure: {
    header: string;
    subHeader?: string;
    instructions: string[];
    columns?: string[];
    sampleRows?: string[][];
    sections?: {
      title: string;
      items: string[];
    }[];
    notes?: string;
  };
}

export interface TeacherUploadedTemplate {
  id: string;
  title: string;
  description: string;
  category: 'lesson_plan' | 'classroom_template' | 'admin_register' | 'fln_remedial' | 'exam_evaluation' | 'custom';
  categoryLabel: string;
  standard: string;
  subject?: string;
  fileType: 'pdf' | 'image';
  mimeType: string;
  fileName: string;
  fileSize: string;
  fileSizeBytes: number;
  dataUrl: string;
  uploadedAt: string;
  uploadedBy?: string;
  tags: string[];
  isFavorite?: boolean;
  baseRating?: number;
  baseReviewCount?: number;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface WeeklyClassPeriod {
  id: string;
  day: DayOfWeek;
  periodNumber: number; // 1 to 8
  startTime: string;    // e.g. "10:45 AM"
  endTime: string;      // e.g. "11:30 AM"
  standard: string;     // e.g. "ધોરણ ૭"
  division?: string;    // e.g. "અ"
  subject: string;      // e.g. "ગણિત"
  topic?: string;       // e.g. "પ્રકરણ ૫: રેખા અને ખૂણા"
  room?: string;        // e.g. "રૂમ નં. ૪"
  isCompleted?: boolean;
  learningOutcome?: string;
  notes?: string;
}

export interface SchoolWeeklyEvent {
  id: string;
  day: DayOfWeek;
  dateStr?: string;     // e.g. "2026-08-24"
  title: string;
  category: 'assembly' | 'exam' | 'meeting' | 'holiday' | 'special_duty' | 'activity' | 'training';
  categoryLabel: string;
  time: string;         // e.g. "10:30 AM - 10:45 AM"
  location?: string;    // e.g. "પ્રાર્થના હોલ" / "સ્ટાફ રૂમ"
  description?: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted?: boolean;
  assignedTo?: string;  // e.g. "શિક્ષક સ્ટાફ" / "ભાવિનકુમાર પરમાર"
}


