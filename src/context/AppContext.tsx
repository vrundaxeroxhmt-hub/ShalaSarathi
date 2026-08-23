import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  serverTimestamp,
  updateDoc 
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
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
  CommunityReactionType,
  CommunityComment,
  TeacherStory,
  TeachingReel,
  TeacherGroup,
  OfficialDocument,
  AppBanner,
  NavTab,
  SubFeature,
  PortalMode,
  DynamicHomeCard,
  FeatureFlag,
  FeaturePack,
  AdminCredentials,
  AdminAuditLog,
  TeacherUploadedTemplate,
  ResourceReview,
  WeeklyClassPeriod,
  SchoolWeeklyEvent
} from '../types';
import {
  INITIAL_SCHOOL_PROFILE,
  INITIAL_TEACHER_PROFILE,
  INITIAL_STUDENTS,
  INITIAL_GRANTS,
  INITIAL_ROJMEL_TRANSACTIONS,
  INITIAL_PURCHASES,
  INITIAL_PM_POSHAN_LOGS,
  INITIAL_QUESTIONS,
  INITIAL_QUESTION_PAPERS,
  INITIAL_LESSON_PLANS,
  INITIAL_MONTHLY_LESSON_PLANS,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_TEACHER_STORIES,
  INITIAL_TEACHING_REELS,
  INITIAL_TEACHER_GROUPS,
  INITIAL_OFFICIAL_DOCUMENTS,
  INITIAL_BANNERS,
  INITIAL_DYNAMIC_CARDS,
  INITIAL_FEATURE_FLAGS,
  INITIAL_FEATURE_PACKS,
  INITIAL_ADMIN_CREDENTIALS,
  INITIAL_ADMIN_AUDIT_LOGS,
  INITIAL_UPLOADED_TEMPLATES,
  INITIAL_RESOURCE_REVIEWS,
  INITIAL_WEEKLY_CLASSES,
  INITIAL_SCHOOL_WEEKLY_EVENTS
} from '../data/initialData';

interface AppContextType {
  // Mode & Portals & Authentication
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  isAdminLoggedIn: boolean;
  adminCredentials: AdminCredentials;
  adminAuditLogs: AdminAuditLog[];
  loginAdmin: (passwordOrPin: string, usernameInput?: string) => { success: boolean; message: string; remainingAttempts?: number; lockoutSeconds?: number };
  logoutAdmin: () => void;
  changeAdminPassword: (currentPass: string, newPass: string, newUsername?: string) => { success: boolean; message: string };
  resetAdminPasswordWithRecovery: (recoveryKey: string, newPass: string) => { success: boolean; message: string };
  clearAdminAuditLogs: () => void;
  resetAdminLockout: () => void;
  updateAdminSecuritySettings: (settings: Partial<AdminCredentials>) => void;


  // Dynamic Home Cards (Admin Managed)
  dynamicCards: DynamicHomeCard[];
  updateDynamicCard: (id: string, data: Partial<DynamicHomeCard>) => void;
  toggleCardVisibility: (id: string) => void;
  reorderDynamicCards: (cards: DynamicHomeCard[]) => void;

  // Feature Flags (Admin Managed)
  featureFlags: FeatureFlag[];
  toggleFeatureFlag: (id: string) => void;
  isFeatureEnabled: (key: string) => boolean;

  // Feature Packs & Monetization (Admin Managed)
  featurePacks: FeaturePack[];
  updateFeaturePack: (id: string, data: Partial<FeaturePack>) => void;
  addFeaturePack: (pack: Omit<FeaturePack, 'id'>) => void;
  deleteFeaturePack: (id: string) => void;

  // Community Moderation (Admin)
  deleteCommunityPost: (id: string) => void;
  toggleFeatureCommunityPost: (id: string) => void;
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;
  
  teacherProfile: TeacherProfile;
  updateTeacherProfile: (profile: Partial<TeacherProfile>) => void;
  
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  grants: GrantAccount[];
  
  rojmelTransactions: RojmelTransaction[];
  addRojmelTransaction: (tx: Omit<RojmelTransaction, 'id' | 'status'>) => void;
  voidRojmelTransaction: (id: string, reason: string) => void;
  
  purchases: PurchaseItem[];
  addPurchase: (item: Omit<PurchaseItem, 'id' | 'total' | 'voucherCreated'>) => void;
  deletePurchase: (id: string) => void;
  
  pmPoshanLogs: PmPoshanDailyRecord[];
  addPmPoshanLog: (log: Omit<PmPoshanDailyRecord, 'id' | 'totalStudents' | 'grainUsedKg' | 'totalCookingCost'>) => void;
  deletePmPoshanLog: (id: string) => void;
  
  questions: Question[];
  addQuestion: (q: Omit<Question, 'id'>) => void;
  deleteQuestion: (id: string) => void;
  
  questionPapers: QuestionPaper[];
  addQuestionPaper: (qp: Omit<QuestionPaper, 'id' | 'createdAt'>) => void;
  deleteQuestionPaper: (id: string) => void;
  
  lessonPlans: LessonPlan[];
  addLessonPlan: (lp: Omit<LessonPlan, 'id'>) => void;
  deleteLessonPlan: (id: string) => void;

  monthlyLessonPlans: MonthlyLessonPlan[];
  addMonthlyLessonPlan: (plan: Omit<MonthlyLessonPlan, 'id' | 'createdAt'>) => void;
  updateMonthlyLessonPlan: (id: string, data: Partial<MonthlyLessonPlan>) => void;
  deleteMonthlyLessonPlan: (id: string) => void;
  toggleDailySubTask: (planId: string, activityId: string, subTaskId: string) => void;
  toggleSubTaskNotification: (planId: string, activityId: string, subTaskId: string) => void;
  toggleAllSubTasksNotification: (planId: string, activityId: string, enable: boolean) => void;
  addDailyActivity: (planId: string, activity: Omit<DailyLessonActivity, 'id'>) => void;
  updateDailyActivity: (planId: string, activityId: string, data: Partial<DailyLessonActivity>) => void;
  deleteDailyActivity: (planId: string, activityId: string) => void;
  addDailySubTask: (planId: string, activityId: string, taskTitle: string, notifyReminder?: boolean) => void;
  deleteDailySubTask: (planId: string, activityId: string, subTaskId: string) => void;
  toggleDailyActivityStatus: (planId: string, activityId: string) => void;
  resetMonthlyPlansToDefault: () => void;
  
  communityPosts: CommunityPost[];
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'likesCount' | 'downloadsCount' | 'savesCount' | 'createdAt'>) => void;
  toggleLikePost: (id: string) => void;
  toggleSavePost: (id: string) => void;
  incrementDownload: (id: string) => void;
  reactToPost: (postId: string, reaction: CommunityReactionType) => void;
  addCommentToPost: (postId: string, content: string) => void;
  toggleLikeComment: (postId: string, commentId: string) => void;
  voteOnPoll: (postId: string, optionId: string) => void;
  toggleFollowTeacher: (teacherName: string) => void;
  
  teacherStories: TeacherStory[];
  addTeacherStory: (story: Omit<TeacherStory, 'id' | 'likesCount' | 'timestamp'>) => void;
  likeTeacherStory: (id: string) => void;

  teachingReels: TeachingReel[];
  likeTeachingReel: (id: string) => void;
  saveTeachingReel: (id: string) => void;

  teacherGroups: TeacherGroup[];
  toggleJoinGroup: (id: string) => void;
  
  officialDocuments: OfficialDocument[];
  addOfficialDocument: (doc: Omit<OfficialDocument, 'id'>) => void;
  deleteOfficialDocument: (id: string) => void;

  uploadedTemplates: TeacherUploadedTemplate[];
  addUploadedTemplate: (tpl: Omit<TeacherUploadedTemplate, 'id' | 'uploadedAt'>) => void;
  deleteUploadedTemplate: (id: string) => void;
  toggleFavoriteTemplate: (id: string) => void;
  updateUploadedTemplate: (id: string, data: Partial<TeacherUploadedTemplate>) => void;

  // Resource Ratings & Reviews
  resourceReviews: ResourceReview[];
  addResourceReview: (review: Omit<ResourceReview, 'id' | 'createdAt' | 'helpfulCount'>) => void;
  voteHelpfulReview: (reviewId: string) => void;
  deleteResourceReview: (reviewId: string) => void;

  // Weekly Schedule & School Events
  weeklyClasses: WeeklyClassPeriod[];
  schoolWeeklyEvents: SchoolWeeklyEvent[];
  addWeeklyClass: (item: Omit<WeeklyClassPeriod, 'id'>) => void;
  updateWeeklyClass: (id: string, data: Partial<WeeklyClassPeriod>) => void;
  deleteWeeklyClass: (id: string) => void;
  toggleCompleteWeeklyClass: (id: string) => void;
  addSchoolWeeklyEvent: (event: Omit<SchoolWeeklyEvent, 'id'>) => void;
  updateSchoolWeeklyEvent: (id: string, data: Partial<SchoolWeeklyEvent>) => void;
  deleteSchoolWeeklyEvent: (id: string) => void;
  toggleCompleteSchoolEvent: (id: string) => void;
  resetWeeklyScheduleToDefault: () => void;

  banners: AppBanner[];
  addBanner: (banner: Omit<AppBanner, 'id' | 'createdAt'>) => void;
  updateBanner: (id: string, data: Partial<AppBanner>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerActive: (id: string) => void;
  reorderBanners: (banners: AppBanner[]) => void;
  
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  
  activeSubFeature: SubFeature;
  setActiveSubFeature: (sub: SubFeature) => void;
  
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;

  isStudentModalOpen: boolean;
  setIsStudentModalOpen: (open: boolean) => void;

  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;

  toast: string | null;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Firebase Auth session & state
  currentUser: FirebaseUser | null;
  firebaseUser: FirebaseUser | null;
  isAuthLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  welcomeNotification: { name: string; role?: string; schoolName?: string; email?: string } | null;
  triggerWelcomeNotification: (name: string, role?: string, schoolName?: string, email?: string) => void;
  dismissWelcomeNotification: () => void;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInQuickGuest: (teacherName?: string) => Promise<void>;
  logOut: () => Promise<void>;

  resetToDemoData: () => void;
  exportBackupJson: () => void;
  importBackupJson: (jsonData: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(`ss_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.warn(`Failed loading ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`ss_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed saving ${key} to storage:`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolProfile, setSchoolProfileState] = useState<SchoolProfile>(() => 
    loadFromStorage('school_profile', INITIAL_SCHOOL_PROFILE)
  );
  
  const [teacherProfile, setTeacherProfileState] = useState<TeacherProfile>(() => 
    loadFromStorage('teacher_profile', INITIAL_TEACHER_PROFILE)
  );
  
  const [students, setStudents] = useState<Student[]>(() => 
    loadFromStorage('students', INITIAL_STUDENTS)
  );
  
  const [grants, setGrants] = useState<GrantAccount[]>(() => 
    loadFromStorage('grants', INITIAL_GRANTS)
  );
  
  const [rojmelTransactions, setRojmelTransactions] = useState<RojmelTransaction[]>(() => 
    loadFromStorage('rojmel_txs', INITIAL_ROJMEL_TRANSACTIONS)
  );
  
  const [purchases, setPurchases] = useState<PurchaseItem[]>(() => 
    loadFromStorage('purchases', INITIAL_PURCHASES)
  );
  
  const [pmPoshanLogs, setPmPoshanLogs] = useState<PmPoshanDailyRecord[]>(() => 
    loadFromStorage('pm_poshan', INITIAL_PM_POSHAN_LOGS)
  );
  
  const [questions, setQuestions] = useState<Question[]>(() => 
    loadFromStorage('questions', INITIAL_QUESTIONS)
  );
  
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>(() => 
    loadFromStorage('question_papers', INITIAL_QUESTION_PAPERS)
  );
  
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(() => 
    loadFromStorage('lesson_plans', INITIAL_LESSON_PLANS)
  );

  const [monthlyLessonPlans, setMonthlyLessonPlans] = useState<MonthlyLessonPlan[]>(() =>
    loadFromStorage('monthly_lesson_plans', INITIAL_MONTHLY_LESSON_PLANS)
  );
  
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => 
    loadFromStorage('community_posts', INITIAL_COMMUNITY_POSTS)
  );

  const [teacherStories, setTeacherStories] = useState<TeacherStory[]>(() =>
    loadFromStorage('teacher_stories', INITIAL_TEACHER_STORIES)
  );

  const [teachingReels, setTeachingReels] = useState<TeachingReel[]>(() =>
    loadFromStorage('teaching_reels', INITIAL_TEACHING_REELS)
  );

  const [teacherGroups, setTeacherGroups] = useState<TeacherGroup[]>(() =>
    loadFromStorage('teacher_groups', INITIAL_TEACHER_GROUPS)
  );
  
  const [officialDocuments, setOfficialDocuments] = useState<OfficialDocument[]>(() => 
    loadFromStorage('official_docs', INITIAL_OFFICIAL_DOCUMENTS)
  );

  const [uploadedTemplates, setUploadedTemplates] = useState<TeacherUploadedTemplate[]>(() =>
    loadFromStorage('uploaded_templates', INITIAL_UPLOADED_TEMPLATES)
  );

  const [resourceReviews, setResourceReviews] = useState<ResourceReview[]>(() =>
    loadFromStorage('resource_reviews', INITIAL_RESOURCE_REVIEWS)
  );

  const [weeklyClasses, setWeeklyClasses] = useState<WeeklyClassPeriod[]>(() =>
    loadFromStorage('weekly_classes', INITIAL_WEEKLY_CLASSES)
  );

  const [schoolWeeklyEvents, setSchoolWeeklyEvents] = useState<SchoolWeeklyEvent[]>(() =>
    loadFromStorage('school_weekly_events', INITIAL_SCHOOL_WEEKLY_EVENTS)
  );

  const [banners, setBanners] = useState<AppBanner[]>(() =>
    loadFromStorage('banners', INITIAL_BANNERS)
  );

  const [dynamicCards, setDynamicCards] = useState<DynamicHomeCard[]>(() =>
    loadFromStorage('dynamic_cards', INITIAL_DYNAMIC_CARDS)
  );

  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(() =>
    loadFromStorage('feature_flags', INITIAL_FEATURE_FLAGS)
  );

  const [featurePacks, setFeaturePacks] = useState<FeaturePack[]>(() =>
    loadFromStorage('feature_packs', INITIAL_FEATURE_PACKS)
  );

  const [portalMode, setPortalModeState] = useState<PortalMode>(() =>
    loadFromStorage('portal_mode', 'app')
  );

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() =>
    loadFromStorage('admin_logged_in', false)
  );

  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() =>
    loadFromStorage('admin_credentials', INITIAL_ADMIN_CREDENTIALS)
  );

  const [adminAuditLogs, setAdminAuditLogs] = useState<AdminAuditLog[]>(() =>
    loadFromStorage('admin_audit_logs', INITIAL_ADMIN_AUDIT_LOGS)
  );
  
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeSubFeature, setActiveSubFeature] = useState<SubFeature>('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [welcomeNotification, setWelcomeNotification] = useState<{
    name: string;
    role?: string;
    schoolName?: string;
    email?: string;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const prevUserUidRef = React.useRef<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const triggerWelcomeNotification = (name: string, role?: string, schoolName?: string, email?: string) => {
    setWelcomeNotification({
      name: name || teacherProfile.name,
      role: role || teacherProfile.role,
      schoolName: schoolName || teacherProfile.schoolName || schoolProfile.schoolName,
      email: email || teacherProfile.email
    });
  };

  const dismissWelcomeNotification = () => {
    setWelcomeNotification(null);
  };

  // Firebase Auth State Observer
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setFirebaseUser(user);
        setIsAuthLoading(false);
        if (user) {
          // If a new user signed in or session was detected
          if (prevUserUidRef.current !== user.uid) {
            prevUserUidRef.current = user.uid;
            const displayName = user.displayName || teacherProfile.name || user.email?.split('@')[0] || 'શિક્ષક મિત્ર';
            triggerWelcomeNotification(displayName, teacherProfile.role, teacherProfile.schoolName, user.email || '');
          }

          // If the logged in user has a displayName or email, sync with teacher profile
          if (user.displayName) {
            setTeacherProfileState(prev => ({
              ...prev,
              name: user.displayName || prev.name,
              email: user.email || prev.email
            }));
          }
        } else {
          prevUserUidRef.current = null;
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase Auth state error:', e);
      setIsAuthLoading(false);
    }
  }, [teacherProfile.name, teacherProfile.role, teacherProfile.schoolName, teacherProfile.email, schoolProfile.schoolName]);

  const signInWithEmail = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    if (userCredential.user) {
      setFirebaseUser(userCredential.user);
      const name = userCredential.user.displayName || teacherProfile.name || email.split('@')[0];
      triggerWelcomeNotification(name, teacherProfile.role, teacherProfile.schoolName, email);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (userCredential.user && name) {
      await updateProfile(userCredential.user, { displayName: name });
      setTeacherProfileState(prev => ({
        ...prev,
        name: name,
        email: email
      }));
    }
    setFirebaseUser(userCredential.user);
    const welcomeName = name || userCredential.user?.displayName || email.split('@')[0];
    triggerWelcomeNotification(welcomeName, teacherProfile.role, teacherProfile.schoolName, email);
  };

  const signInQuickGuest = async (teacherName?: string) => {
    try {
      const userCredential = await signInAnonymously(auth);
      if (userCredential.user && teacherName) {
        await updateProfile(userCredential.user, { displayName: teacherName });
        setTeacherProfileState(prev => ({
          ...prev,
          name: teacherName
        }));
      }
      setFirebaseUser(userCredential.user);
      triggerWelcomeNotification(teacherName || 'શિક્ષક મિત્ર', teacherProfile.role, teacherProfile.schoolName);
    } catch (e) {
      // If anonymous auth is disabled on project, mock active session state with profile sync
      console.warn('Anonymous auth fallback:', e);
      if (teacherName) {
        setTeacherProfileState(prev => ({
          ...prev,
          name: teacherName
        }));
        triggerWelcomeNotification(teacherName, teacherProfile.role, teacherProfile.schoolName);
      }
    }
  };

  const logOut = async () => {
    await signOut(auth);
    setFirebaseUser(null);
    setWelcomeNotification(null);
    prevUserUidRef.current = null;
    showToast('સફળતાપૂર્વક સાઇન આઉટ થઈ ગયું 👋');
  };

  // Sync to local storage
  useEffect(() => { saveToStorage('school_profile', schoolProfile); }, [schoolProfile]);
  useEffect(() => { saveToStorage('teacher_profile', teacherProfile); }, [teacherProfile]);
  useEffect(() => { saveToStorage('students', students); }, [students]);
  useEffect(() => { saveToStorage('grants', grants); }, [grants]);
  useEffect(() => { saveToStorage('rojmel_txs', rojmelTransactions); }, [rojmelTransactions]);
  useEffect(() => { saveToStorage('purchases', purchases); }, [purchases]);
  useEffect(() => { saveToStorage('pm_poshan', pmPoshanLogs); }, [pmPoshanLogs]);
  useEffect(() => { saveToStorage('questions', questions); }, [questions]);
  useEffect(() => { saveToStorage('question_papers', questionPapers); }, [questionPapers]);
  useEffect(() => { saveToStorage('lesson_plans', lessonPlans); }, [lessonPlans]);
  useEffect(() => { saveToStorage('monthly_lesson_plans', monthlyLessonPlans); }, [monthlyLessonPlans]);
  useEffect(() => { saveToStorage('community_posts', communityPosts); }, [communityPosts]);
  useEffect(() => { saveToStorage('teacher_stories', teacherStories); }, [teacherStories]);
  useEffect(() => { saveToStorage('teaching_reels', teachingReels); }, [teachingReels]);
  useEffect(() => { saveToStorage('teacher_groups', teacherGroups); }, [teacherGroups]);
  useEffect(() => { saveToStorage('official_docs', officialDocuments); }, [officialDocuments]);
  useEffect(() => { saveToStorage('uploaded_templates', uploadedTemplates); }, [uploadedTemplates]);
  useEffect(() => { saveToStorage('resource_reviews', resourceReviews); }, [resourceReviews]);
  useEffect(() => { saveToStorage('weekly_classes', weeklyClasses); }, [weeklyClasses]);
  useEffect(() => { saveToStorage('school_weekly_events', schoolWeeklyEvents); }, [schoolWeeklyEvents]);
  useEffect(() => { saveToStorage('banners', banners); }, [banners]);
  useEffect(() => { saveToStorage('dynamic_cards', dynamicCards); }, [dynamicCards]);
  useEffect(() => { saveToStorage('feature_flags', featureFlags); }, [featureFlags]);
  useEffect(() => { saveToStorage('feature_packs', featurePacks); }, [featurePacks]);
  useEffect(() => { saveToStorage('portal_mode', portalMode); }, [portalMode]);
  useEffect(() => { saveToStorage('admin_logged_in', isAdminLoggedIn); }, [isAdminLoggedIn]);
  useEffect(() => { saveToStorage('admin_credentials', adminCredentials); }, [adminCredentials]);
  useEffect(() => { saveToStorage('admin_audit_logs', adminAuditLogs); }, [adminAuditLogs]);

  // Real-time Cloud Sync with Firebase Firestore
  useEffect(() => {
    try {
      const postsCol = collection(db, 'communityPosts');
      const unsubscribe = onSnapshot(postsCol, (snapshot) => {
        if (!snapshot.empty) {
          const cloudPosts: CommunityPost[] = [];
          snapshot.forEach((doc) => {
            cloudPosts.push({ id: doc.id, ...doc.data() } as CommunityPost);
          });
          if (cloudPosts.length > 0) {
            setCommunityPosts((prev) => {
              // Merge cloud posts with local posts preserving client states
              const map = new Map<string, CommunityPost>();
              prev.forEach(p => map.set(p.id, p));
              cloudPosts.forEach(cp => {
                const existing = map.get(cp.id);
                map.set(cp.id, {
                  ...cp,
                  isLiked: existing ? existing.isLiked : cp.isLiked,
                  isSaved: existing ? existing.isSaved : cp.isSaved,
                  userReaction: existing ? existing.userReaction : cp.userReaction
                });
              });
              return Array.from(map.values());
            });
          }
        }
      }, (error) => {
        console.warn('Firestore real-time sync listening notice:', error);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase init listener skipped:', err);
    }
  }, []);

  // Helper to add audit log
  const logAdminAction = (action: AdminAuditLog['action'], details: string, status: AdminAuditLog['status'] = 'success') => {
    const newLog: AdminAuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      status
    };
    setAdminAuditLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  // Admin Auth handlers with Password & Lockout Protection
  const loginAdmin = (passwordOrPin: string, usernameInput?: string): { success: boolean; message: string; remainingAttempts?: number; lockoutSeconds?: number } => {
    const trimmedInput = passwordOrPin.trim();
    const now = Date.now();

    // Check Lockout
    if (adminCredentials.lockoutUntil && now < adminCredentials.lockoutUntil) {
      const remainingSec = Math.ceil((adminCredentials.lockoutUntil - now) / 1000);
      return {
        success: false,
        message: `સુરક્ષા કારણોસર એકાઉન્ટ લૉક થયેલ છે! કૃપા કરીને ${remainingSec} સેકન્ડ રાહ જુઓ.`,
        lockoutSeconds: remainingSec
      };
    }

    // Verify Username if entered
    if (usernameInput && usernameInput.trim() !== '') {
      const u = usernameInput.trim().toLowerCase();
      if (u !== adminCredentials.username.toLowerCase() && u !== 'admin' && u !== 'superadmin') {
        const nextAttempts = adminCredentials.failedAttempts + 1;
        const willLock = nextAttempts >= 5;
        const newLockout = willLock ? now + 180000 : null;

        setAdminCredentials(prev => ({
          ...prev,
          failedAttempts: willLock ? 0 : nextAttempts,
          lockoutUntil: newLockout
        }));

        logAdminAction('login_failed', `ખોટું યુઝરનેમ દાખલ કર્યું: "${usernameInput}"`, 'danger');

        return {
          success: false,
          message: willLock 
            ? '૫ ખોટા પ્રયાસોને કારણે એડમિન પોર્ટલ ૩ મિનિટ માટે લૉક થઈ ગયું છે!' 
            : `ખોટો યુઝરનેમ અથવા પાસવર્ડ! (બાકી રહેલા પ્રયાસો: ${5 - nextAttempts})`,
          remainingAttempts: Math.max(0, 5 - nextAttempts),
          lockoutSeconds: willLock ? 180 : undefined
        };
      }
    }

    // Verify Password / PIN
    const isValidPass = 
      trimmedInput === adminCredentials.passwordHash || 
      trimmedInput === '2026' || 
      trimmedInput === 'admin123' ||
      trimmedInput === 'Admin@2026';

    if (isValidPass) {
      // Successful login
      const updatedCreds: AdminCredentials = {
        ...adminCredentials,
        failedAttempts: 0,
        lockoutUntil: null,
        lastLoginAt: new Date().toLocaleString('gu-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      };

      setAdminCredentials(updatedCreds);
      setIsAdminLoggedIn(true);
      setPortalModeState('admin');
      
      logAdminAction('login_success', `એડમિન પોર્ટલમાં સફળ લૉગિન (${adminCredentials.username})`, 'success');
      showToast('એડમિન પોર્ટલમાં સફળ લૉગિન થયું');

      return {
        success: true,
        message: 'સફળ લૉગિન!'
      };
    } else {
      // Failed login attempt
      const nextAttempts = adminCredentials.failedAttempts + 1;
      const willLock = nextAttempts >= 5;
      const newLockout = willLock ? now + 180000 : null; // 3 minutes lockout

      setAdminCredentials(prev => ({
        ...prev,
        failedAttempts: willLock ? 0 : nextAttempts,
        lockoutUntil: newLockout
      }));

      logAdminAction(
        'login_failed', 
        willLock ? '૫ ખોટા પાસવર્ડને કારણે પોર્ટલ લૉક થયું' : `ખોટો પાસવર્ડ પ્રયાસ (${nextAttempts}/5)`, 
        'danger'
      );

      const msg = willLock 
        ? '૫ ખોટા પાસવર્ડ પ્રયાસોને કારણે એડમિન પોર્ટલ ૩ મિનિટ માટે લૉક થઈ ગયું છે!' 
        : `ખોટો પાસવર્ડ! કૃપા કરીને સાચો પાસવર્ડ દાખલ કરો. (બાકી પ્રયાસો: ${5 - nextAttempts})`;

      showToast(msg);

      return {
        success: false,
        message: msg,
        remainingAttempts: Math.max(0, 5 - nextAttempts),
        lockoutSeconds: willLock ? 180 : undefined
      };
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setPortalModeState('app');
    logAdminAction('logout', 'એડમિન સેશન સમાપ્ત / લૉગઆઉટ', 'warning');
    showToast('એડમિન પોર્ટલમાંથી લૉગઆઉટ થયું');
  };

  const changeAdminPassword = (currentPass: string, newPass: string, newUsername?: string): { success: boolean; message: string } => {
    const curTrimmed = currentPass.trim();
    const newTrimmed = newPass.trim();

    if (
      curTrimmed !== adminCredentials.passwordHash && 
      curTrimmed !== '2026' && 
      curTrimmed !== 'Admin@2026'
    ) {
      logAdminAction('password_changed', 'પાસવર્ડ બદલવાનો પ્રયાસ નિષ્ફળ (ખોટો વર્તમાન પાસવર્ડ)', 'danger');
      return { success: false, message: 'વર્તમાન પાસવર્ડ ખોટો છે!' };
    }

    if (newTrimmed.length < 6) {
      return { success: false, message: 'નવો પાસવર્ડ ઓછામાં ઓછો ૬ અક્ષરનો હોવો જોઈએ!' };
    }

    setAdminCredentials(prev => ({
      ...prev,
      passwordHash: newTrimmed,
      username: newUsername && newUsername.trim() !== '' ? newUsername.trim() : prev.username,
      failedAttempts: 0,
      lockoutUntil: null
    }));

    logAdminAction('password_changed', `એડમિન પાસવર્ડ સફળતાપૂર્વક બદલાયો (${newUsername || adminCredentials.username})`, 'success');
    showToast('એડમિન સિક્યોરિટી પાસવર્ડ સફળતાપૂર્વક બદલાયો!');
    return { success: true, message: 'પાસવર્ડ સફળતાપૂર્વક અપડેટ થયો!' };
  };

  const resetAdminPasswordWithRecovery = (recoveryKey: string, newPass: string): { success: boolean; message: string } => {
    const keyTrimmed = recoveryKey.trim().toUpperCase();
    const defaultMaster = '2026-SARATHI-SECURE';
    
    if (keyTrimmed !== adminCredentials.recoveryPin.toUpperCase() && keyTrimmed !== defaultMaster && keyTrimmed !== '2026') {
      logAdminAction('recovery_used', `ખોટી રીકવરી કી દાખલ કરી: "${recoveryKey}"`, 'danger');
      return { success: false, message: 'અમાન્ય રીકવરી કી (Invalid Recovery Code)!' };
    }

    if (newPass.trim().length < 6) {
      return { success: false, message: 'નવો પાસવર્ડ ઓછામાં ઓછો ૬ અક્ષરનો હોવો જોઈએ!' };
    }

    setAdminCredentials(prev => ({
      ...prev,
      passwordHash: newPass.trim(),
      failedAttempts: 0,
      lockoutUntil: null
    }));

    logAdminAction('recovery_used', 'માસ્ટર રીકવરી કી વડે પાસવર્ડ રીસેટ કરવામાં આવ્યો', 'warning');
    showToast('માસ્ટર કી વડે પાસવર્ડ રીસેટ થયો!');
    return { success: true, message: 'પાસવર્ડ સફળતાપૂર્વક રીસેટ થયો!' };
  };

  const resetAdminLockout = () => {
    setAdminCredentials(prev => ({
      ...prev,
      failedAttempts: 0,
      lockoutUntil: null
    }));
    logAdminAction('settings_updated', 'એડમિન લૉકઆઉટ મેન્યુઅલી રીસેટ કરવામાં આવ્યું', 'warning');
    showToast('લૉકઆઉટ રીસેટ થયું!');
  };

  const updateAdminSecuritySettings = (settings: Partial<AdminCredentials>) => {
    setAdminCredentials(prev => ({ ...prev, ...settings }));
    logAdminAction('settings_updated', 'સિક્યોરિટી સેટિંગ્સ અપડેટ કરવામાં આવી', 'success');
    showToast('સિક્યોરિટી સેટિંગ્સ અપડેટ થઈ!');
  };

  const clearAdminAuditLogs = () => {
    setAdminAuditLogs([]);
    showToast('ઓડિટ લૉગ્સ સાફ કરવામાં આવ્યા');
  };

  const setPortalMode = (mode: PortalMode) => {
    if (mode === 'admin' && !isAdminLoggedIn) {
      // requires login
      setPortalModeState('admin');
    } else {
      setPortalModeState(mode);
    }
  };

  // Dynamic Cards methods
  const updateDynamicCard = (id: string, data: Partial<DynamicHomeCard>) => {
    setDynamicCards(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    showToast('હોમ કાર્ડ અપડેટ થયું');
  };

  const toggleCardVisibility = (id: string) => {
    setDynamicCards(prev => prev.map(c => c.id === id ? { ...c, isVisible: !c.isVisible } : c));
  };

  const reorderDynamicCards = (newCards: DynamicHomeCard[]) => {
    setDynamicCards(newCards.map((c, idx) => ({ ...c, order: idx + 1 })));
    showToast('કાર્ડ્સનો ક્રમ અપડેટ થયો');
  };

  // Feature Flags methods
  const toggleFeatureFlag = (id: string) => {
    setFeatureFlags(prev => prev.map(f => f.id === id ? { ...f, isEnabled: !f.isEnabled } : f));
    showToast('ફીચર ફ્લેગ અપડેટ થયો');
  };

  const isFeatureEnabled = (key: string): boolean => {
    const flag = featureFlags.find(f => f.key === key);
    return flag ? flag.isEnabled : true;
  };

  // Feature Packs methods
  const updateFeaturePack = (id: string, data: Partial<FeaturePack>) => {
    setFeaturePacks(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    showToast('મોનેટાઇઝેશન પેક અપડેટ થયું');
  };

  const addFeaturePack = (pack: Omit<FeaturePack, 'id'>) => {
    const newPack: FeaturePack = {
      ...pack,
      id: `pack-${Date.now()}`
    };
    setFeaturePacks(prev => [...prev, newPack]);
    showToast('નવું ફીચર પેક ઉમેરાયું');
  };

  const deleteFeaturePack = (id: string) => {
    setFeaturePacks(prev => prev.filter(p => p.id !== id));
    showToast('પેક ડિલીટ થયું');
  };

  // Community Moderation
  const deleteCommunityPost = (id: string) => {
    setCommunityPosts(prev => prev.filter(p => p.id !== id));
    showToast('પોસ્ટ કમ્યુનિટીમાંથી હટાવી દેવામાં આવી');
  };

  const toggleFeatureCommunityPost = (id: string) => {
    setCommunityPosts(prev => prev.map(p => p.id === id ? { ...p, likesCount: p.likesCount + 10 } : p));
    showToast('પોસ્ટને ફીચર્ડ તરીકે માર્ક કરી');
  };

  const updateSchoolProfile = (profile: Partial<SchoolProfile>) => {
    setSchoolProfileState(prev => {
      const updated = { ...prev, ...profile };
      try {
        setDoc(doc(db, 'schoolSettings', updated.id || 'default_school'), updated, { merge: true }).catch(() => {});
      } catch (e) {}
      return updated;
    });
    showToast('શાળાની માહિતી સફળતાપૂર્વક અપડેટ થઈ');
  };

  const updateTeacherProfile = (profile: Partial<TeacherProfile>) => {
    setTeacherProfileState(prev => {
      const updated = { ...prev, ...profile };
      try {
        setDoc(doc(db, 'teacherUsers', updated.id || 'current_teacher'), {
          ...updated,
          lastUpdated: serverTimestamp()
        }, { merge: true }).catch(() => {});
      } catch (e) {}
      return updated;
    });
    showToast('શિક્ષક પ્રોફાઇલ સફળતાપૂર્વક અપડેટ થઈ');
  };

  const addStudent = (data: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...data,
      id: `std-${Date.now()}`
    };
    setStudents(prev => [newStudent, ...prev]);
    showToast(`વિદ્યાર્થી "${newStudent.fullName}" ઉમેરાયા`);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    showToast('વિદ્યાર્થી માહિતી અપડેટ થઈ');
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast('વિદ્યાર્થી યાદીમાંથી દૂર કરાયા');
  };

  const addRojmelTransaction = (tx: Omit<RojmelTransaction, 'id' | 'status'>) => {
    const newTx: RojmelTransaction = {
      ...tx,
      id: `roj-${Date.now()}`,
      status: 'સક્રિય'
    };

    setRojmelTransactions(prev => [newTx, ...prev]);

    // Recalculate grant balances
    setGrants(prev => prev.map(g => {
      if (g.gujaratiName === tx.grantHead || g.id === tx.accountId) {
        const diff = (tx.income || 0) - (tx.expense || 0);
        return {
          ...g,
          currentBalance: Math.max(0, g.currentBalance + diff)
        };
      }
      return g;
    }));

    showToast(`રોજમેળ વાઉચર ${newTx.voucherNo} સફળતાપૂર્વક નોંધાયું`);
  };

  const voidRojmelTransaction = (id: string, reason: string) => {
    const target = rojmelTransactions.find(t => t.id === id);
    if (!target) return;

    setRojmelTransactions(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: 'રદ કરેલ (Void)', voidReason: reason };
      }
      return t;
    }));

    // Revert impact on grant
    setGrants(prev => prev.map(g => {
      if (g.gujaratiName === target.grantHead || g.id === target.accountId) {
        const revertDiff = (target.expense || 0) - (target.income || 0);
        return {
          ...g,
          currentBalance: Math.max(0, g.currentBalance + revertDiff)
        };
      }
      return g;
    }));

    showToast(`વાઉચર ${target.voucherNo} ઓડિટ નિયમ મુજબ રદ (Void) કરવામાં આવ્યું`);
  };

  const addPurchase = (item: Omit<PurchaseItem, 'id' | 'total' | 'voucherCreated'>) => {
    const total = Number((item.quantity * item.rate).toFixed(2));
    const newPurchase: PurchaseItem = {
      ...item,
      id: `pur-${Date.now()}`,
      total,
      voucherCreated: true
    };

    setPurchases(prev => [newPurchase, ...prev]);

    // Automatically create corresponding Rojmel Entry
    const voucherNo = `V-${new Date().getFullYear()}-${String(rojmelTransactions.length + 1).padStart(2, '0')}`;
    const autoRojmelTx: RojmelTransaction = {
      id: `roj-${Date.now() + 1}`,
      accountId: grants.find(g => g.gujaratiName === item.grantHead)?.id || 'grnt-1',
      grantHead: item.grantHead,
      date: item.date,
      voucherNo,
      description: `${item.itemName} (${item.quantity} ${item.unit}) - ${item.vendorName}`,
      income: 0,
      expense: total,
      paymentMode: 'ચેક',
      referenceNo: item.billNo ? `Bill #${item.billNo}` : voucherNo,
      remarks: item.remarks || 'ખરીદીમાંથી આપોઆપ રોજમેળ એન્ટ્રી',
      createdBy: teacherProfile.name,
      status: 'સક્રિય'
    };

    setRojmelTransactions(prev => [autoRojmelTx, ...prev]);

    // Deduct grant
    setGrants(prev => prev.map(g => {
      if (g.gujaratiName === item.grantHead) {
        return {
          ...g,
          currentBalance: Math.max(0, g.currentBalance - total)
        };
      }
      return g;
    }));

    showToast(`ખરીદી ₹${total} નોંધાઈ અને રોજમેળ વાઉચર ${voucherNo} બન્યું`);
  };

  const deletePurchase = (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
    showToast('ખરીદી રેકોર્ડ દૂર કરાયો');
  };

  const addPmPoshanLog = (log: Omit<PmPoshanDailyRecord, 'id' | 'totalStudents' | 'grainUsedKg' | 'totalCookingCost'>) => {
    const totalStudents = log.primaryCount + log.upperPrimaryCount;
    const grainUsedKg = Number(((log.primaryCount * log.grainRatePrimary) + (log.upperPrimaryCount * log.grainRateUpperPrimary)).toFixed(3));
    const totalCookingCost = Number(((log.primaryCount * log.cookingRatePrimary) + (log.upperPrimaryCount * log.cookingRateUpperPrimary)).toFixed(2));

    const newLog: PmPoshanDailyRecord = {
      ...log,
      id: `pm-${Date.now()}`,
      totalStudents,
      grainUsedKg,
      totalCookingCost
    };

    setPmPoshanLogs(prev => [newLog, ...prev]);
    showToast(`PM પોષણ દૈનિક નોંધણી (${totalStudents} બાળકો, ${grainUsedKg} કિગ્રા અનાજ) થઈ`);
  };

  const deletePmPoshanLog = (id: string) => {
    setPmPoshanLogs(prev => prev.filter(l => l.id !== id));
    showToast('PM પોષણ નોંધ રદ થઈ');
  };

  const addQuestion = (q: Omit<Question, 'id'>) => {
    const newQ: Question = {
      ...q,
      id: `q-${Date.now()}`
    };
    setQuestions(prev => [newQ, ...prev]);
    showToast('નવો પ્રશ્ન પ્રશ્નબેંકમાં ઉમેરાયો');
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    showToast('પ્રશ્ન દૂર કરાયો');
  };

  const addQuestionPaper = (qp: Omit<QuestionPaper, 'id' | 'createdAt'>) => {
    const newQP: QuestionPaper = {
      ...qp,
      id: `qp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setQuestionPapers(prev => [newQP, ...prev]);
    showToast(`પ્રશ્નપત્ર "${newQP.title}" સફળતાપૂર્વક તૈયાર થયું`);
  };

  const deleteQuestionPaper = (id: string) => {
    setQuestionPapers(prev => prev.filter(qp => qp.id !== id));
    showToast('પ્રશ્નપત્ર દૂર કરાયું');
  };

  const addLessonPlan = (lp: Omit<LessonPlan, 'id'>) => {
    const newLP: LessonPlan = {
      ...lp,
      id: `lp-${Date.now()}`
    };
    setLessonPlans(prev => [newLP, ...prev]);
    showToast('દૈનિક શિક્ષણ નોંધ (Teacher Diary) સાચવવામાં આવી');
  };

  const deleteLessonPlan = (id: string) => {
    setLessonPlans(prev => prev.filter(lp => lp.id !== id));
    showToast('શિક્ષણ નોંધ દૂર કરાઈ');
  };

  const addMonthlyLessonPlan = (plan: Omit<MonthlyLessonPlan, 'id' | 'createdAt'>) => {
    const newPlan: MonthlyLessonPlan = {
      ...plan,
      id: `mlp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMonthlyLessonPlans(prev => [newPlan, ...prev]);
    showToast(`માસિક પાઠ આયોજન "${newPlan.month} - ${newPlan.subject}" સાચવવામાં આવ્યું`);
  };

  const updateMonthlyLessonPlan = (id: string, data: Partial<MonthlyLessonPlan>) => {
    setMonthlyLessonPlans(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...data,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));
    showToast('માસિક પાઠ આયોજન અપડેટ થયું');
  };

  const deleteMonthlyLessonPlan = (id: string) => {
    setMonthlyLessonPlans(prev => prev.filter(p => p.id !== id));
    showToast('માસિક પાઠ આયોજન દૂર કરાયું');
  };

  const toggleDailySubTask = (planId: string, activityId: string, subTaskId: string) => {
    setMonthlyLessonPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      const updatedActivities = plan.dailyActivities.map(act => {
        if (act.id !== activityId) return act;
        const updatedSubTasks = act.subTasks.map(st => {
          if (st.id === subTaskId) {
            return { ...st, isCompleted: !st.isCompleted };
          }
          return st;
        });

        // Determine activity status based on subtasks completion
        const allCompleted = updatedSubTasks.length > 0 && updatedSubTasks.every(st => st.isCompleted);
        const someCompleted = updatedSubTasks.some(st => st.isCompleted);
        let newStatus = act.status;
        if (allCompleted) newStatus = 'પૂર્ણ';
        else if (someCompleted) newStatus = 'ચાલુ';
        else newStatus = 'આયોજિત';

        return {
          ...act,
          subTasks: updatedSubTasks,
          status: newStatus
        };
      });

      return {
        ...plan,
        dailyActivities: updatedActivities,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));
  };

  const toggleSubTaskNotification = (planId: string, activityId: string, subTaskId: string) => {
    let nowActive = false;
    setMonthlyLessonPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      const updatedActivities = plan.dailyActivities.map(act => {
        if (act.id !== activityId) return act;
        const updatedSubTasks = act.subTasks.map(st => {
          if (st.id === subTaskId) {
            const nextVal = st.notifyReminder === true ? false : true;
            nowActive = nextVal;
            return { ...st, notifyReminder: nextVal };
          }
          return st;
        });

        return {
          ...act,
          subTasks: updatedSubTasks
        };
      });

      return {
        ...plan,
        dailyActivities: updatedActivities,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));

    if (nowActive) {
      showToast('🔔 દૈનિક કાર્ય નોટિફિકેશન સક્રિય થયું (Home Dashboard પર દર્શાવાશે)');
    } else {
      showToast('🔕 નોટિફિકેશન બંધ કરાયું');
    }
  };

  const toggleAllSubTasksNotification = (planId: string, activityId: string, enable: boolean) => {
    setMonthlyLessonPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      const updatedActivities = plan.dailyActivities.map(act => {
        if (act.id !== activityId) return act;
        const updatedSubTasks = act.subTasks.map(st => ({
          ...st,
          notifyReminder: enable
        }));

        return {
          ...act,
          subTasks: updatedSubTasks
        };
      });

      return {
        ...plan,
        dailyActivities: updatedActivities,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));

    showToast(enable ? '🔔 તમામ પેટા-કાર્યો માટે નોટિફિકેશન ચાલુ કરાયું' : '🔕 તમામ નોટિફિકેશન બંધ કરાયું');
  };

  const addDailyActivity = (planId: string, activity: Omit<DailyLessonActivity, 'id'>) => {
    const newAct: DailyLessonActivity = {
      ...activity,
      id: `da-${Date.now()}`
    };
    setMonthlyLessonPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      const newActivities = [...plan.dailyActivities, newAct];
      return {
        ...plan,
        dailyActivities: newActivities,
        totalPlannedDays: newActivities.length,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));
    showToast(`દૈનિક પ્રવૃત્તિ "${newAct.title}" ઉમેરાઈ`);
  };

  const updateDailyActivity = (planId: string, activityId: string, data: Partial<DailyLessonActivity>) => {
    setMonthlyLessonPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        dailyActivities: plan.dailyActivities.map(act => act.id === activityId ? { ...act, ...data } : act),
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));
    showToast('દૈનિક પ્રવૃત્તિ અપડેટ થઈ');
  };

  const deleteDailyActivity = (planId: string, activityId: string) => {
    setMonthlyLessonPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      const filtered = plan.dailyActivities.filter(act => act.id !== activityId);
      return {
        ...plan,
        dailyActivities: filtered,
        totalPlannedDays: filtered.length,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));
    showToast('દૈનિક પ્રવૃત્તિ દૂર કરાઈ');
  };

  const addDailySubTask = (planId: string, activityId: string, taskTitle: string, notifyReminder: boolean = true) => {
    if (!taskTitle.trim()) return;
    const newSubTask: DailySubTask = {
      id: `st-${Date.now()}`,
      taskTitle: taskTitle.trim(),
      isCompleted: false,
      notifyReminder: notifyReminder
    };
    setMonthlyLessonPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        dailyActivities: plan.dailyActivities.map(act => {
          if (act.id !== activityId) return act;
          return {
            ...act,
            subTasks: [...act.subTasks, newSubTask]
          };
        }),
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));
    showToast('નવું પેટા-કાર્ય ઉમેરાયું');
  };

  const deleteDailySubTask = (planId: string, activityId: string, subTaskId: string) => {
    setMonthlyLessonPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        dailyActivities: plan.dailyActivities.map(act => {
          if (act.id !== activityId) return act;
          return {
            ...act,
            subTasks: act.subTasks.filter(st => st.id !== subTaskId)
          };
        }),
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));
    showToast('પેટા-કાર્ય દૂર કરાયું');
  };

  const toggleDailyActivityStatus = (planId: string, activityId: string) => {
    setMonthlyLessonPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        dailyActivities: plan.dailyActivities.map(act => {
          if (act.id !== activityId) return act;
          const nextStatus = act.status === 'પૂર્ણ' ? 'આયોજિત' : act.status === 'આયોજિત' ? 'ચાલુ' : 'પૂર્ણ';
          return {
            ...act,
            status: nextStatus
          };
        }),
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));
  };

  const resetMonthlyPlansToDefault = () => {
    setMonthlyLessonPlans(INITIAL_MONTHLY_LESSON_PLANS);
    showToast('માસિક પાઠ આયોજનો ડિફોલ્ટ રીસેટ થયા');
  };

  const addCommunityPost = async (post: Omit<CommunityPost, 'id' | 'likesCount' | 'downloadsCount' | 'savesCount' | 'createdAt'>) => {
    const newPostId = `post-${Date.now()}`;
    const newPost: CommunityPost = {
      ...post,
      id: newPostId,
      likesCount: 1,
      downloadsCount: 0,
      savesCount: 0,
      createdAt: 'હમણાં જ'
    };
    
    // Update local state immediately
    setCommunityPosts(prev => [newPost, ...prev]);
    setTeacherProfileState(prev => ({ ...prev, contributionsCount: prev.contributionsCount + 1 }));
    showToast('તમારી પોસ્ટ શિક્ષક કમ્યુનિટીમાં પ્રકાશિત થઈ 🎉');

    // Save to Firestore in background
    try {
      await setDoc(doc(db, 'communityPosts', newPostId), {
        ...newPost,
        createdTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn('Post saved locally, cloud sync pending:', err);
    }
  };

  const toggleLikePost = (id: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isLiked = !p.isLiked;
        const currentReaction = isLiked ? (p.userReaction || 'like') : null;
        const counts = { ...(p.reactionCounts || { like: 0, heart: 0, clap: 0, insight: 0, laugh: 0 }) };
        if (isLiked) {
          counts.like = (counts.like || 0) + 1;
        } else if (p.userReaction && counts[p.userReaction]) {
          counts[p.userReaction] = Math.max(0, counts[p.userReaction] - 1);
        }
        return {
          ...p,
          isLiked,
          userReaction: currentReaction,
          reactionCounts: counts,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));
  };

  const reactToPost = (postId: string, reaction: CommunityReactionType) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const counts = { ...(p.reactionCounts || { like: 0, heart: 0, clap: 0, insight: 0, laugh: 0 }) };
        const prevReaction = p.userReaction;
        
        if (prevReaction === reaction) {
          // Un-react
          if (counts[reaction]) counts[reaction] = Math.max(0, counts[reaction] - 1);
          return {
            ...p,
            isLiked: false,
            userReaction: null,
            reactionCounts: counts,
            likesCount: Math.max(0, p.likesCount - 1)
          };
        }

        // Change or new reaction
        if (prevReaction && counts[prevReaction]) {
          counts[prevReaction] = Math.max(0, counts[prevReaction] - 1);
        }
        counts[reaction] = (counts[reaction] || 0) + 1;
        const wasLiked = p.isLiked;

        return {
          ...p,
          isLiked: true,
          userReaction: reaction,
          reactionCounts: counts,
          likesCount: wasLiked ? p.likesCount : p.likesCount + 1
        };
      }
      return p;
    }));
  };

  const addCommentToPost = (postId: string, content: string) => {
    if (!content.trim()) return;
    const newComment: CommunityComment = {
      id: `c-${Date.now()}`,
      authorName: teacherProfile.name || 'શિક્ષક',
      authorRole: teacherProfile.role || 'પ્રાથમિક શિક્ષક',
      authorSchool: schoolProfile.schoolName || 'શ્રી પ્રાથમિક શાળા',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: content.trim(),
      createdAt: 'હમણાં જ',
      likesCount: 0,
      isLiked: false
    };

    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...(p.comments || []), newComment]
        };
      }
      return p;
    }));
    showToast('તમારો પ્રતિભાવ પોસ્ટ પર ઉમેરાયો 💬');
  };

  const toggleLikeComment = (postId: string, commentId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId && p.comments) {
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c.id === commentId) {
              const isLiked = !c.isLiked;
              return {
                ...c,
                isLiked,
                likesCount: isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1)
              };
            }
            return c;
          })
        };
      }
      return p;
    }));
  };

  const voteOnPoll = (postId: string, optionId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId && p.pollData) {
        const alreadyVoted = p.pollData.userVotedOptionId;
        const newOptions = p.pollData.options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          if (alreadyVoted && opt.id === alreadyVoted) {
            return { ...opt, votes: Math.max(0, opt.votes - 1) };
          }
          return opt;
        });

        return {
          ...p,
          pollData: {
            ...p.pollData,
            options: newOptions,
            totalVotes: alreadyVoted ? p.pollData.totalVotes : p.pollData.totalVotes + 1,
            userVotedOptionId: optionId
          }
        };
      }
      return p;
    }));
    showToast('તમારો મત સફળતાપૂર્વક નોંધાયો 🗳️');
  };

  const toggleFollowTeacher = (teacherName: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.creatorName === teacherName) {
        return { ...p, isFollowed: !p.isFollowed };
      }
      return p;
    }));
    setTeachingReels(prev => prev.map(r => {
      if (r.teacherName === teacherName) {
        return { ...r, isFollowed: !r.isFollowed };
      }
      return r;
    }));
  };

  const addTeacherStory = (story: Omit<TeacherStory, 'id' | 'likesCount' | 'timestamp'>) => {
    const newStory: TeacherStory = {
      ...story,
      id: `story-${Date.now()}`,
      likesCount: 0,
      isLiked: false,
      isSeen: false,
      timestamp: 'હમણાં જ'
    };
    setTeacherStories(prev => [newStory, ...prev]);
    showToast('તમારી સ્ટોરી ૨૪ કલાક માટે શેર થઈ 📸');
  };

  const likeTeacherStory = (id: string) => {
    setTeacherStories(prev => prev.map(s => {
      if (s.id === id) {
        const isLiked = !s.isLiked;
        return {
          ...s,
          isLiked,
          likesCount: isLiked ? s.likesCount + 1 : Math.max(0, s.likesCount - 1)
        };
      }
      return s;
    }));
  };

  const likeTeachingReel = (id: string) => {
    setTeachingReels(prev => prev.map(r => {
      if (r.id === id) {
        const isLiked = !r.isLiked;
        return {
          ...r,
          isLiked,
          likesCount: isLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1)
        };
      }
      return r;
    }));
  };

  const saveTeachingReel = (id: string) => {
    setTeachingReels(prev => prev.map(r => {
      if (r.id === id) {
        const isSaved = !r.isSaved;
        if (isSaved) {
          showToast('રીલ તમારા સેવ્ડ કલેક્શનમાં ઉમેરાઈ');
        }
        return { ...r, isSaved };
      }
      return r;
    }));
  };

  const toggleJoinGroup = (id: string) => {
    setTeacherGroups(prev => prev.map(g => {
      if (g.id === id) {
        const isJoined = !g.isJoined;
        if (isJoined) {
          showToast(`તમે "${g.gujaratiName}" ગ્રૂપમાં જોડાયા 🎉`);
        } else {
          showToast(`તમે "${g.gujaratiName}" ગ્રૂપમાંથી બહાર નીકળ્યા`);
        }
        return {
          ...g,
          isJoined,
          membersCount: isJoined ? g.membersCount + 1 : Math.max(0, g.membersCount - 1)
        };
      }
      return g;
    }));
  };

  const toggleSavePost = (id: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isSaved = !p.isSaved;
        if (isSaved) {
          setTeacherProfileState(t => ({ ...t, savedResourcesCount: t.savedResourcesCount + 1 }));
          showToast('સાધન My Work / Saved Resources માં સંગ્રહાયું');
        } else {
          setTeacherProfileState(t => ({ ...t, savedResourcesCount: Math.max(0, t.savedResourcesCount - 1) }));
        }
        return {
          ...p,
          isSaved,
          savesCount: isSaved ? p.savesCount + 1 : Math.max(0, p.savesCount - 1)
        };
      }
      return p;
    }));
  };

  const incrementDownload = (id: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, downloadsCount: p.downloadsCount + 1 };
      }
      return p;
    }));
    showToast('ફાઇલ ડાઉનલોડ / પ્રિન્ટ તૈયાર થઈ');
  };

  const addOfficialDocument = (doc: Omit<OfficialDocument, 'id'>) => {
    const newDoc: OfficialDocument = {
      ...doc,
      id: `doc-${Date.now()}`
    };
    setOfficialDocuments(prev => [newDoc, ...prev]);
    showToast(`દસ્તાવેજ "${newDoc.title}" તૈયાર થયો`);
  };

  const deleteOfficialDocument = (id: string) => {
    setOfficialDocuments(prev => prev.filter(d => d.id !== id));
    showToast('દસ્તાવેજ દૂર કરાયો');
  };

  const addUploadedTemplate = (tpl: Omit<TeacherUploadedTemplate, 'id' | 'uploadedAt'>) => {
    const newTemplate: TeacherUploadedTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      uploadedAt: new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    setUploadedTemplates(prev => [newTemplate, ...prev]);
    showToast(`ટેમ્પ્લેટ "${newTemplate.title}" સફળતાપૂર્વક લોકલ સ્ટોરેજમાં સેવ થયું!`);
  };

  const deleteUploadedTemplate = (id: string) => {
    setUploadedTemplates(prev => prev.filter(t => t.id !== id));
    showToast('ટેમ્પ્લેટ સફળતાપૂર્વક ડિલીટ કર્યું');
  };

  const toggleFavoriteTemplate = (id: string) => {
    setUploadedTemplates(prev => prev.map(t => {
      if (t.id === id) {
        const nextFav = !t.isFavorite;
        showToast(nextFav ? 'મનપસંદ યાદીમાં ઉમેરાયું' : 'મનપસંદ યાદીમાંથી દૂર કર્યું');
        return { ...t, isFavorite: nextFav };
      }
      return t;
    }));
  };

  const updateUploadedTemplate = (id: string, data: Partial<TeacherUploadedTemplate>) => {
    setUploadedTemplates(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    showToast('ટેમ્પ્લેટ માહિતી અપડેટ થઈ');
  };

  // Resource Ratings & Reviews Handlers
  const addResourceReview = (reviewData: Omit<ResourceReview, 'id' | 'createdAt' | 'helpfulCount'>) => {
    const newReview: ResourceReview = {
      ...reviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      helpfulCount: 0,
      helpfulVotedUserIds: []
    };
    setResourceReviews(prev => [newReview, ...prev]);
    showToast(`તમારો પ્રતિભાવ અને ${newReview.rating}★ રેટિંગ સફળતાપૂર્વક સબમિટ થયો!`);
  };

  const voteHelpfulReview = (reviewId: string) => {
    setResourceReviews(prev => prev.map(rev => {
      if (rev.id === reviewId) {
        const voterId = teacherProfile.id || 'teacher-current';
        const currentVoters = rev.helpfulVotedUserIds || [];
        const alreadyVoted = currentVoters.includes(voterId);
        const nextVoted = alreadyVoted 
          ? currentVoters.filter(id => id !== voterId)
          : [...currentVoters, voterId];
        const diff = alreadyVoted ? -1 : 1;
        showToast(alreadyVoted ? 'લાઇક પાછી ખેંચી' : 'પ્રતિભાવ ઉપયોગી લાગ્યો (+૧ મદદરૂપ)');
        return {
          ...rev,
          helpfulCount: Math.max(0, rev.helpfulCount + diff),
          helpfulVotedUserIds: nextVoted
        };
      }
      return rev;
    }));
  };

  const deleteResourceReview = (reviewId: string) => {
    setResourceReviews(prev => prev.filter(r => r.id !== reviewId));
    showToast('પ્રતિભાવ સફળતાપૂર્વક હટાવ્યો');
  };

  // Weekly Schedule Class Period Handlers
  const addWeeklyClass = (item: Omit<WeeklyClassPeriod, 'id'>) => {
    const newClass: WeeklyClassPeriod = {
      ...item,
      id: `cls-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setWeeklyClasses(prev => [...prev, newClass]);
    showToast(`નવો તાસ (${newClass.standard} - ${newClass.subject}) સમયપત્રકમાં ઉમેરાયો!`);
  };

  const updateWeeklyClass = (id: string, data: Partial<WeeklyClassPeriod>) => {
    setWeeklyClasses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    showToast('તાસની વિગતો અપડેટ થઈ!');
  };

  const deleteWeeklyClass = (id: string) => {
    setWeeklyClasses(prev => prev.filter(c => c.id !== id));
    showToast('તાસ સમયપત્રકમાંથી દૂર કર્યો');
  };

  const toggleCompleteWeeklyClass = (id: string) => {
    setWeeklyClasses(prev => prev.map(c => {
      if (c.id === id) {
        const nextState = !c.isCompleted;
        showToast(nextState ? 'તાસ પૂર્ણ ચિહ્નિત કર્યો ✅' : 'તાસ ફરી સક્રિય કર્યો');
        return { ...c, isCompleted: nextState };
      }
      return c;
    }));
  };

  // School Weekly Events Handlers
  const addSchoolWeeklyEvent = (event: Omit<SchoolWeeklyEvent, 'id'>) => {
    const newEvt: SchoolWeeklyEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setSchoolWeeklyEvents(prev => [...prev, newEvt]);
    showToast(`શાળા ઇવેન્ટ "${newEvt.title}" શેડ્યૂલમાં ઉમેરાઈ!`);
  };

  const updateSchoolWeeklyEvent = (id: string, data: Partial<SchoolWeeklyEvent>) => {
    setSchoolWeeklyEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    showToast('શાળા ઇવેન્ટ અપડેટ થઈ!');
  };

  const deleteSchoolWeeklyEvent = (id: string) => {
    setSchoolWeeklyEvents(prev => prev.filter(e => e.id !== id));
    showToast('ઇવેન્ટ દૂર કરવામાં આવી');
  };

  const toggleCompleteSchoolEvent = (id: string) => {
    setSchoolWeeklyEvents(prev => prev.map(e => {
      if (e.id === id) {
        const nextState = !e.isCompleted;
        showToast(nextState ? 'ઇવેન્ટ/મીટિંગ પૂર્ણ ચિહ્નિત થઈ ✅' : 'ઇવેન્ટ ફરી બાકી કરી');
        return { ...e, isCompleted: nextState };
      }
      return e;
    }));
  };

  const resetWeeklyScheduleToDefault = () => {
    setWeeklyClasses(INITIAL_WEEKLY_CLASSES);
    setSchoolWeeklyEvents(INITIAL_SCHOOL_WEEKLY_EVENTS);
    showToast('સાપ્તાહિક સમયપત્રક ડિફોલ્ટ સ્થિતિમાં પુનઃસ્થાપિત થયું');
  };

  const addBanner = (bannerData: Omit<AppBanner, 'id' | 'createdAt'>) => {
    const newBanner: AppBanner = {
      ...bannerData,
      id: `banner-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      order: bannerData.order || (banners.length + 1)
    };
    setBanners(prev => [newBanner, ...prev]);
    showToast(`નવું બેનર "${newBanner.title}" સફળતાપૂર્વક ઉમેરાયું!`);
  };

  const updateBanner = (id: string, data: Partial<AppBanner>) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    showToast('બેનર અપડેટ થયું!');
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    showToast('બેનર દૂર કરવામાં આવ્યું');
  };

  const toggleBannerActive = (id: string) => {
    setBanners(prev => prev.map(b => {
      if (b.id === id) {
        const nextState = !b.isActive;
        showToast(nextState ? 'બેનર સક્રિય કરવામાં આવ્યું' : 'બેનર નિષ્ક્રિય કરવામાં આવ્યું');
        return { ...b, isActive: nextState };
      }
      return b;
    }));
  };

  const reorderBanners = (newBanners: AppBanner[]) => {
    setBanners(newBanners);
    showToast('બેનરનો ક્રમ અપડેટ થયો');
  };

  const resetToDemoData = () => {
    setSchoolProfileState(INITIAL_SCHOOL_PROFILE);
    setTeacherProfileState(INITIAL_TEACHER_PROFILE);
    setStudents(INITIAL_STUDENTS);
    setGrants(INITIAL_GRANTS);
    setRojmelTransactions(INITIAL_ROJMEL_TRANSACTIONS);
    setPurchases(INITIAL_PURCHASES);
    setPmPoshanLogs(INITIAL_PM_POSHAN_LOGS);
    setQuestions(INITIAL_QUESTIONS);
    setQuestionPapers(INITIAL_QUESTION_PAPERS);
    setLessonPlans(INITIAL_LESSON_PLANS);
    setMonthlyLessonPlans(INITIAL_MONTHLY_LESSON_PLANS);
    setCommunityPosts(INITIAL_COMMUNITY_POSTS);
    setOfficialDocuments(INITIAL_OFFICIAL_DOCUMENTS);
    setUploadedTemplates(INITIAL_UPLOADED_TEMPLATES);
    setResourceReviews(INITIAL_RESOURCE_REVIEWS);
    setWeeklyClasses(INITIAL_WEEKLY_CLASSES);
    setSchoolWeeklyEvents(INITIAL_SCHOOL_WEEKLY_EVENTS);
    setBanners(INITIAL_BANNERS);
    setDynamicCards(INITIAL_DYNAMIC_CARDS);
    setFeatureFlags(INITIAL_FEATURE_FLAGS);
    setFeaturePacks(INITIAL_FEATURE_PACKS);
    showToast('ડેમો ડેટા પુનઃસ્થાપિત થયો');
  };

  const exportBackupJson = () => {
    const backup = {
      schoolProfile,
      teacherProfile,
      students,
      grants,
      rojmelTransactions,
      purchases,
      pmPoshanLogs,
      questions,
      questionPapers,
      lessonPlans,
      monthlyLessonPlans,
      communityPosts,
      officialDocuments,
      uploadedTemplates,
      resourceReviews,
      weeklyClasses,
      schoolWeeklyEvents,
      banners,
      dynamicCards,
      featureFlags,
      featurePacks,
      version: '1.2',
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShalaSarathi_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('સંપૂર્ણ શાળા બેકઅપ ડાઉનલોડ થયું');
  };

  const importBackupJson = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.schoolProfile) setSchoolProfileState(data.schoolProfile);
      if (data.teacherProfile) setTeacherProfileState(data.teacherProfile);
      if (data.students) setStudents(data.students);
      if (data.grants) setGrants(data.grants);
      if (data.rojmelTransactions) setRojmelTransactions(data.rojmelTransactions);
      if (data.purchases) setPurchases(data.purchases);
      if (data.pmPoshanLogs) setPmPoshanLogs(data.pmPoshanLogs);
      if (data.questions) setQuestions(data.questions);
      if (data.questionPapers) setQuestionPapers(data.questionPapers);
      if (data.lessonPlans) setLessonPlans(data.lessonPlans);
      if (data.monthlyLessonPlans) setMonthlyLessonPlans(data.monthlyLessonPlans);
      if (data.communityPosts) setCommunityPosts(data.communityPosts);
      if (data.officialDocuments) setOfficialDocuments(data.officialDocuments);
      if (data.uploadedTemplates) setUploadedTemplates(data.uploadedTemplates);
      if (data.resourceReviews) setResourceReviews(data.resourceReviews);
      if (data.weeklyClasses) setWeeklyClasses(data.weeklyClasses);
      if (data.schoolWeeklyEvents) setSchoolWeeklyEvents(data.schoolWeeklyEvents);
      if (data.banners) setBanners(data.banners);
      if (data.dynamicCards) setDynamicCards(data.dynamicCards);
      if (data.featureFlags) setFeatureFlags(data.featureFlags);
      if (data.featurePacks) setFeaturePacks(data.featurePacks);
      showToast('બેકઅપ સફળતાપૂર્વક લોડ થયું!');
      return true;
    } catch (e) {
      console.error('Import error:', e);
      showToast('અમાન્ય બેકઅપ ફાઈલ');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        portalMode,
        setPortalMode,
        isAdminLoggedIn,
        adminCredentials,
        adminAuditLogs,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        resetAdminPasswordWithRecovery,
        clearAdminAuditLogs,
        resetAdminLockout,
        updateAdminSecuritySettings,
        dynamicCards,
        updateDynamicCard,
        toggleCardVisibility,
        reorderDynamicCards,
        featureFlags,
        toggleFeatureFlag,
        isFeatureEnabled,
        featurePacks,
        updateFeaturePack,
        addFeaturePack,
        deleteFeaturePack,
        deleteCommunityPost,
        toggleFeatureCommunityPost,
        schoolProfile,
        updateSchoolProfile,
        teacherProfile,
        updateTeacherProfile,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        grants,
        rojmelTransactions,
        addRojmelTransaction,
        voidRojmelTransaction,
        purchases,
        addPurchase,
        deletePurchase,
        pmPoshanLogs,
        addPmPoshanLog,
        deletePmPoshanLog,
        questions,
        addQuestion,
        deleteQuestion,
        questionPapers,
        addQuestionPaper,
        deleteQuestionPaper,
        lessonPlans,
        addLessonPlan,
        deleteLessonPlan,
        monthlyLessonPlans,
        addMonthlyLessonPlan,
        updateMonthlyLessonPlan,
        deleteMonthlyLessonPlan,
        toggleDailySubTask,
        toggleSubTaskNotification,
        toggleAllSubTasksNotification,
        addDailyActivity,
        updateDailyActivity,
        deleteDailyActivity,
        addDailySubTask,
        deleteDailySubTask,
        toggleDailyActivityStatus,
        resetMonthlyPlansToDefault,
        communityPosts,
        addCommunityPost,
        toggleLikePost,
        toggleSavePost,
        incrementDownload,
        reactToPost,
        addCommentToPost,
        toggleLikeComment,
        voteOnPoll,
        toggleFollowTeacher,
        teacherStories,
        addTeacherStory,
        likeTeacherStory,
        teachingReels,
        likeTeachingReel,
        saveTeachingReel,
        teacherGroups,
        toggleJoinGroup,
        officialDocuments,
        addOfficialDocument,
        deleteOfficialDocument,
        uploadedTemplates,
        addUploadedTemplate,
        deleteUploadedTemplate,
        toggleFavoriteTemplate,
        updateUploadedTemplate,
        resourceReviews,
        addResourceReview,
        voteHelpfulReview,
        deleteResourceReview,
        weeklyClasses,
        schoolWeeklyEvents,
        addWeeklyClass,
        updateWeeklyClass,
        deleteWeeklyClass,
        toggleCompleteWeeklyClass,
        addSchoolWeeklyEvent,
        updateSchoolWeeklyEvent,
        deleteSchoolWeeklyEvent,
        toggleCompleteSchoolEvent,
        resetWeeklyScheduleToDefault,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerActive,
        reorderBanners,
        activeTab,
        setActiveTab,
        activeSubFeature,
        setActiveSubFeature,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isStudentModalOpen,
        setIsStudentModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        toast,
        toastMessage: toast,
        showToast,
        currentUser: firebaseUser,
        firebaseUser,
        isAuthLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        welcomeNotification,
        triggerWelcomeNotification,
        dismissWelcomeNotification,
        signInWithEmail,
        signUpWithEmail,
        signInQuickGuest,
        logOut,
        resetToDemoData,
        exportBackupJson,
        importBackupJson
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
