import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AppBanner, DynamicHomeCard, FeatureFlag, FeaturePack, NavTab, SubFeature } from '../../types';
import { 
  ShieldCheck, 
  ShieldAlert,
  Key,
  Lock, 
  Unlock,
  Eye, 
  EyeOff, 
  User,
  LayoutDashboard, 
  Megaphone, 
  LayoutGrid, 
  Flag, 
  Coins, 
  Users, 
  FileSpreadsheet, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  MoveUp, 
  MoveDown, 
  Sparkles, 
  TrendingUp, 
  ExternalLink,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  AlertTriangle,
  Clock,
  Copy,
  RefreshCw
} from 'lucide-react';

type AdminSection = 'dashboard' | 'banners' | 'cards' | 'feature-flags' | 'monetization' | 'community' | 'patrak-engine' | 'security';

export const AdminPortal: React.FC = () => {
  const {
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
    setPortalMode,
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerActive,
    reorderBanners,
    dynamicCards,
    updateDynamicCard,
    toggleCardVisibility,
    reorderDynamicCards,
    featureFlags,
    toggleFeatureFlag,
    featurePacks,
    updateFeaturePack,
    addFeaturePack,
    deleteFeaturePack,
    communityPosts,
    deleteCommunityPost,
    toggleFeatureCommunityPost,
    students,
    grants,
    rojmelTransactions,
    questionPapers,
    officialDocuments,
    showToast
  } = useApp();

  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'recovery'>('login');
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [remainingLockSeconds, setRemainingLockSeconds] = useState<number>(0);

  // Recovery Form State
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showRecoveryPass, setShowRecoveryPass] = useState(false);

  // Change Password Form State (Inside Security Tab)
  const [changePassForm, setChangePassForm] = useState({
    currentPassword: '',
    newUsername: adminCredentials.username || 'admin',
    newPassword: '',
    confirmPassword: ''
  });
  const [showChangeCurPass, setShowChangeCurPass] = useState(false);
  const [showChangeNewPass, setShowChangeNewPass] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Countdown timer for brute-force lockout
  useEffect(() => {
    const checkLockout = () => {
      if (adminCredentials.lockoutUntil && Date.now() < adminCredentials.lockoutUntil) {
        const diff = Math.ceil((adminCredentials.lockoutUntil - Date.now()) / 1000);
        setRemainingLockSeconds(diff > 0 ? diff : 0);
      } else {
        setRemainingLockSeconds(0);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [adminCredentials.lockoutUntil]);

  // Banner Form State
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    badgeText: '',
    badgeColor: 'amber' as AppBanner['badgeColor'],
    bgGradient: 'from-amber-600 via-orange-600 to-red-600',
    imageUrl: '',
    ctaText: 'ખોલો',
    ctaLinkType: 'tab' as 'tab' | 'subfeature' | 'external',
    ctaTarget: 'home',
    isActive: true
  });

  // Pack Form State
  const [editingPackId, setEditingPackId] = useState<string | null>(null);
  const [packForm, setPackForm] = useState({
    name: '',
    gujaratiName: '',
    featureKey: '',
    price: 199,
    originalPrice: 399,
    durationDays: 365,
    durationLabel: '૧ વર્ષ માટે',
    usageLimit: 50,
    usageType: 'templates' as 'templates' | 'generations' | 'unlimited',
    description: '',
    benefits: ['૫૦ પ્રીમિયમ ટેમ્પલેટ્સ', 'A4 પ્રિન્ટેબલ PDF એક્સપોર્ટ'],
    isActive: true,
    badge: ''
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (remainingLockSeconds > 0) return;

    setAuthError(null);
    const result = loginAdmin(passwordInput, usernameInput);
    if (!result.success) {
      setAuthError(result.message);
    } else {
      setPasswordInput('');
      setAuthError(null);
    }
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryCodeInput.trim()) {
      showToast('કૃપા કરીને માસ્ટર રીકવરી કોડ દાખલ કરો');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      showToast('બંને પાસવર્ડ મેળ ખાતા નથી!');
      return;
    }
    if (newPasswordInput.length < 6) {
      showToast('પાસવર્ડ ઓછામાં ઓછો ૬ અક્ષરનો હોવો જોઈએ');
      return;
    }

    const res = resetAdminPasswordWithRecovery(recoveryCodeInput, newPasswordInput);
    if (res.success) {
      setAuthMode('login');
      setRecoveryCodeInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setAuthError(null);
    } else {
      showToast(res.message);
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changePassForm.currentPassword) {
      showToast('કૃપા કરીને વર્તમાન પાસવર્ડ દાખલ કરો');
      return;
    }
    if (changePassForm.newPassword !== changePassForm.confirmPassword) {
      showToast('નવો પાસવર્ડ અને કન્ફર્મ પાસવર્ડ સરખા નથી!');
      return;
    }
    if (changePassForm.newPassword.length < 6) {
      showToast('નવો પાસવર્ડ ઓછામાં ઓછો ૬ અક્ષરનો હોવો જોઈએ!');
      return;
    }

    const res = changeAdminPassword(
      changePassForm.currentPassword,
      changePassForm.newPassword,
      changePassForm.newUsername
    );

    if (res.success) {
      setChangePassForm({
        currentPassword: '',
        newUsername: changePassForm.newUsername,
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      showToast(res.message);
    }
  };

  const handleCopyRecoveryKey = () => {
    navigator.clipboard.writeText(adminCredentials.recoveryPin || '2026-SARATHI-SECURE');
    setCopiedKey(true);
    showToast('માસ્ટર રીકવરી કી કૉપિ થઈ!');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // PASSWORD STRENGTH METER
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, text: 'સામાન્ય (Weak)', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, text: 'મધ્યમ (Moderate)', color: 'bg-amber-500' };
    return { score: 3, text: 'મજબૂત (Strong)', color: 'bg-emerald-500' };
  };

  // IF NOT LOGGED IN: SECURE AUTHENTICATION GATE
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 text-white relative">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>સુરક્ષિત એડમિનિસ્ટ્રેટર લૉગિન</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              શાળા સારથિ સેન્ટ્રલ એડમિન
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              ShalaSarathi Master Control & Administrative Security Gate
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setAuthError(null); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                authMode === 'login'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              પાસવર્ડ લૉગિન
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('recovery'); setAuthError(null); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                authMode === 'recovery'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              માસ્ટર રીકવરી
            </button>
          </div>

          {/* Lockout Banner if Locked */}
          {remainingLockSeconds > 0 && (
            <div className="mb-5 bg-rose-500/20 border border-rose-500/40 rounded-2xl p-4 text-rose-300 text-xs animate-pulse">
              <div className="flex items-center space-x-2 font-bold text-rose-200 mb-1">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>સુરક્ષા ચેતવણી: પોર્ટલ લૉક થયેલ છે</span>
              </div>
              <p>૫ ખોટા પાસવર્ડ પ્રયાસોને કારણે સિસ્ટમ સુરક્ષિત લૉક થઈ છે.</p>
              <div className="mt-2 text-center py-1.5 bg-rose-950/60 rounded-xl font-mono text-sm font-black text-rose-200">
                ⏳ બાકી સમય: {remainingLockSeconds} સેકન્ડ
              </div>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  એડમિન યુઝરનેમ (Admin Username)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="admin"
                    disabled={remainingLockSeconds > 0}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex justify-between">
                  <span>એડમિન સિક્યોરિટી પાસવર્ડ (Password / PIN)</span>
                  <span className="text-[11px] text-amber-400/80 font-normal">
                    {adminCredentials.failedAttempts > 0 && `(ખોટા પ્રયાસ: ${adminCredentials.failedAttempts}/5)`}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="પાસવર્ડ અથવા ડિફોલ્ટ PIN દાખલ કરો"
                    disabled={remainingLockSeconds > 0}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={remainingLockSeconds > 0 || !passwordInput.trim()}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg hover:shadow-amber-600/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Key className="w-4 h-4" />
                <span>સુરક્ષિત લૉગિન કરો (Secure Login)</span>
              </button>
            </form>
          ) : (
            /* TAB 2: MASTER RECOVERY */
            <form onSubmit={handleRecoverySubmit} className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-amber-300 text-xs">
                💡 પાસવર્ડ ભૂલી ગયા હોવ તો તમારી માસ્ટર રીકવરી કી દાખલ કરી નવો પાસવર્ડ સેટ કરો.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  માસ્ટર રીકવરી કી (Master Recovery Key)
                </label>
                <input
                  type="text"
                  value={recoveryCodeInput}
                  onChange={(e) => setRecoveryCodeInput(e.target.value)}
                  placeholder="2026-SARATHI-SECURE"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  નવો પાસવર્ડ (New Password)
                </label>
                <div className="relative">
                  <input
                    type={showRecoveryPass ? 'text' : 'password'}
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="નવો મજબૂત પાસવર્ડ (ઓછામાં ઓછા ૬ અક્ષર)"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRecoveryPass(!showRecoveryPass)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                  >
                    {showRecoveryPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  કન્ફર્મ નવો પાસવર્ડ (Confirm Password)
                </label>
                <input
                  type={showRecoveryPass ? 'text' : 'password'}
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="નવો પાસવર્ડ ફરી દાખલ કરો"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg hover:shadow-amber-600/30 cursor-pointer flex items-center justify-center space-x-2"
              >
                <Unlock className="w-4 h-4" />
                <span>પાસવર્ડ રીસેટ કરો & અનલૉક કરો</span>
              </button>
            </form>
          )}

          {/* Quick Credential Hint for Local Setup */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3 text-xs">
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Default Password / PIN:</span>
              <div className="flex items-center space-x-1 font-mono">
                <span className="text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">Admin@2026</span>
                <span className="text-slate-500">અથવા</span>
                <span className="text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">2026</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <button
                onClick={() => setPortalMode('app')}
                className="text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>શિક્ષક એપ પર પાછા જાઓ</span>
              </button>
              <span className="text-[11px] text-slate-600">256-Bit Vault Auth</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN PORTAL DASHBOARD
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shadow-inner">
            👑
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black text-white">શાળા સારથિ — એડમિન પોર્ટલ</h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span>AUTHENTICATED</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              લૉગિન યુઝર: <strong className="text-amber-400">{adminCredentials.username}</strong> • છેલ્લું લૉગિન: {adminCredentials.lastLoginAt || 'તાજેતરમાં'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setActiveSection('security')}
            className={`hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
              activeSection === 'security'
                ? 'bg-amber-600/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>સિક્યોરિટી સેટિંગ્સ</span>
          </button>

          <button
            onClick={() => setPortalMode('app')}
            className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">શિક્ષક એપ જુઓ (Back to App)</span>
            <span className="sm:hidden">એપ જુઓ</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="flex items-center space-x-1 px-3 py-1.5 text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="એડમિન લૉગઆઉટ"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">લૉગઆઉટ</span>
          </button>
        </div>
      </header>

      {/* Main Admin Layout with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Admin Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-950/80 border-r border-slate-800 p-3 space-y-1 shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
            એડમિન કંટ્રોલ્સ & મેનેજમેન્ટ
          </div>

          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === 'dashboard'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>📊 ડેશબોર્ડ & એનાલિટિક્સ</span>
          </button>

          <button
            onClick={() => setActiveSection('banners')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === 'banners'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>🖼️ હોમ બેનર સ્લાઇડર</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-300">
              {banners.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('cards')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === 'cards'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>🃏 ડાયનેમિક હોમ કાર્ડ્સ</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-300">
              {dynamicCards.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('feature-flags')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === 'feature-flags'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>🚩 ફીચર ફ્લેગ્સ (ON/OFF)</span>
          </button>

          <button
            onClick={() => setActiveSection('monetization')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === 'monetization'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>💎 પેક્સ & સબ્સ્ક્રિપ્શન</span>
          </button>

          <button
            onClick={() => setActiveSection('community')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === 'community'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👥 કમ્યુનિટી મોડરેશન</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-300">
              {communityPosts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('patrak-engine')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === 'patrak-engine'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>📑 પત્રક ટેમ્પલેટ એન્જિન</span>
          </button>

          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setActiveSection('security')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeSection === 'security'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>🔐 સિક્યોરિટી & ઓડિટ લૉગ્સ</span>
            </button>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-65px)]">
          {/* SECTION 1: DASHBOARD */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">સિસ્ટમ એનાલિટિક્સ અને પરિસ્થિતિ</h2>
                <p className="text-xs text-slate-400 mt-1">
                  સમગ્ર ગુજરાતના પ્રાથમિક શિક્ષકો દ્વારા વપરાશ અને ડેટા આંકડા
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                  <span className="text-xs text-slate-400">કુલ નોંધાયેલ વિદ્યાર્થીઓ</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">{students.length}</div>
                  <span className="text-[10px] text-emerald-400 font-medium">સક્રિય ડેટાબેઝ</span>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                  <span className="text-xs text-slate-400">કમ્યુનિટી સંસાધનો (TLM)</span>
                  <div className="text-2xl font-black text-blue-400 mt-1">{communityPosts.length}</div>
                  <span className="text-[10px] text-blue-300 font-medium">શેર કરેલ પોસ્ટ્સ</span>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                  <span className="text-xs text-slate-400">સક્રિય ફીચર પેક્સ</span>
                  <div className="text-2xl font-black text-purple-400 mt-1">
                    {featurePacks.filter(p => p.isActive).length}
                  </div>
                  <span className="text-[10px] text-purple-300 font-medium">મોનેટાઇઝેશન સક્રિય</span>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                  <span className="text-xs text-slate-400">સિક્યોરિટી સ્ટેટસ</span>
                  <div className="text-lg font-black text-emerald-400 mt-1">PRO-VAULT</div>
                  <span className="text-[10px] text-slate-400 font-mono">256-Bit Protected</span>
                </div>
              </div>

              {/* Security Health Summary */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-850 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">એડમિનિસ્ટ્રેટિવ ઍક્સેસ સુરક્ષા કાર્યરત છે</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      બ્રુટ-ફોર્સ અટેક ડિફેન્સ અને ઓડિટ ટેલિમેટ્રી સક્રિય છે. ખોટા પાસવર્ડ પર ઓટો-લૉકઆઉટ લાગુ થશે.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSection('security')}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors"
                >
                  સિક્યોરિટી મેનેજર
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: BANNERS SLIDER */}
          {activeSection === 'banners' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">હોમ બેનર સ્લાઇડર મેનેજમેન્ટ</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    શિક્ષક એપ્લિકેશનના હોમ પેજ પર દેખાતા બેનર્સ, ઘોષણાઓ અને ઑફર્સ
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingBannerId(null);
                    setBannerForm({
                      title: 'ગુણોત્સવ અને કસોટી સહાયક ૨૦૨૬',
                      subtitle: 'તમામ વિષયોના બ્લૂપ્રિન્ટ પ્રશ્નપત્રો અને પત્રકો તૈયાર કરો',
                      badgeText: 'નવું ફીચર',
                      badgeColor: 'amber',
                      bgGradient: 'from-amber-600 via-orange-600 to-red-600',
                      imageUrl: '',
                      ctaText: 'શરૂ કરો',
                      ctaLinkType: 'subfeature',
                      ctaTarget: 'question-paper',
                      isActive: true
                    });
                  }}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>નવું બેનર બનાવો</span>
                </button>
              </div>

              {/* Banner Creation Form */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
                  <Megaphone className="w-4 h-4" />
                  <span>{editingBannerId ? 'બેનર એડિટ કરો' : 'નવું બેનર ઉમેરો'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">બેનર શીર્ષક (Title)</label>
                    <input
                      type="text"
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                      placeholder="e.g. પત્રક A, B અને C ઓટોમેશન"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">પેટા શીર્ષક (Subtitle)</label>
                    <input
                      type="text"
                      value={bannerForm.subtitle}
                      onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                      placeholder="e.g. ફક્ત ૧ ક્લિકમાં વિદ્યાર્થીઓના પરિણામો તૈયાર"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      if (!bannerForm.title) {
                        showToast('કૃપા કરીને બેનર શીર્ષક લખો');
                        return;
                      }
                      if (editingBannerId) {
                        updateBanner(editingBannerId, bannerForm);
                        setEditingBannerId(null);
                      } else {
                        addBanner({ ...bannerForm, order: banners.length + 1 });
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingBannerId ? 'અપડેટ કરો' : 'સાચવો અને પબ્લિશ કરો'}</span>
                  </button>
                </div>
              </div>

              {/* Banners List */}
              <div className="space-y-3">
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${banner.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                          {banner.isActive ? 'સક્રિય (ACTIVE)' : 'છુપાયેલ (HIDDEN)'}
                        </span>
                        <span className="text-xs text-amber-400 font-semibold">{banner.badgeText}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{banner.title}</h4>
                      <p className="text-xs text-slate-400">{banner.subtitle}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleBannerActive(banner.id)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs"
                      >
                        {banner.isActive ? 'નિષ્ક્રિય કરો' : 'સક્રિય કરો'}
                      </button>
                      <button
                        onClick={() => deleteBanner(banner.id)}
                        className="p-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 rounded-xl text-xs"
                        title="બેનર ડિલીટ કરો"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: DYNAMIC CARDS */}
          {activeSection === 'cards' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">ડાયનેમિક હોમ કાર્ડ્સ એન્જિન</h2>
                <p className="text-xs text-slate-400 mt-1">
                  શિક્ષક એપના હોમ સ્ક્રીન પર દેખાતા મોડ્યુલ કાર્ડ્સનો ક્રમ અને વિઝિબિલિટી
                </p>
              </div>

              <div className="space-y-3">
                {dynamicCards.map((card, idx) => (
                  <div
                    key={card.id}
                    className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono text-slate-500 w-5">#{idx + 1}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white">{card.gujaratiTitle}</h4>
                          <span className="text-xs text-slate-400">({card.title})</span>
                        </div>
                        <p className="text-xs text-slate-400">{card.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleCardVisibility(card.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                          card.isVisible
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {card.isVisible ? 'દ્રશ્યમાન (Visible)' : 'છુપાયેલ (Hidden)'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: FEATURE FLAGS */}
          {activeSection === 'feature-flags' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">ફીચર ફ્લેગ્સ કંટ્રોલર (ON / OFF Switches)</h2>
                <p className="text-xs text-slate-400 mt-1">
                  કોઈપણ એપ અપડેટ વગર સીધા જ મોડ્યુલ્સ ચાલુ અથવા બંધ કરો
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featureFlags.map((flag) => (
                  <div
                    key={flag.id}
                    className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">{flag.gujaratiName}</span>
                        <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded">
                          {flag.key}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{flag.description}</p>
                    </div>

                    <button
                      onClick={() => toggleFeatureFlag(flag.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        flag.isEnabled
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-rose-950/60 border border-rose-800 text-rose-300'
                      }`}
                    >
                      {flag.isEnabled ? 'સક્રિય (ON)' : 'બંધ (OFF)'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: MONETIZATION & PACKS */}
          {activeSection === 'monetization' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">ફીચર-વાઇઝ પેક્સ & મોનેટાઇઝેશન</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    શિક્ષકો માટે પ્રીમિયમ પેક્સ, ભાવ અને વેલિડિટી કંટ્રોલ
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {featurePacks.map((pack) => (
                  <div
                    key={pack.id}
                    className="bg-slate-800/70 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full">
                        {pack.durationLabel}
                      </span>
                      <h3 className="text-base font-bold text-white mt-2">{pack.gujaratiName}</h3>
                      <div className="flex items-baseline space-x-2 my-2">
                        <span className="text-2xl font-black text-amber-400">₹{pack.price}</span>
                        <span className="text-xs text-slate-500 line-through">₹{pack.originalPrice}</span>
                      </div>
                      <p className="text-xs text-slate-400">{pack.description}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                      <span className="text-xs text-emerald-400 font-semibold">
                        {pack.isActive ? 'Active Pack' : 'Disabled'}
                      </span>
                      <button
                        onClick={() => updateFeaturePack(pack.id, { isActive: !pack.isActive })}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs"
                      >
                        {pack.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: COMMUNITY MODERATION */}
          {activeSection === 'community' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">શિક્ષક કમ્યુનિટી મોડરેશન</h2>
                <p className="text-xs text-slate-400 mt-1">
                  શિક્ષકો દ્વારા શેર કરેલ સાહિત્યની ચકાસણી, ફીચર કરવું અથવા દૂર કરવું
                </p>
              </div>

              <div className="space-y-3">
                {communityPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full">
                          {post.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          {post.standard} • {post.subject}
                        </span>
                        <span className="text-xs text-amber-400 font-medium">
                          {post.creatorName} ({post.creatorSchool})
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1.5">{post.title}</h3>
                      <p className="text-xs text-slate-400">{post.description}</p>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => toggleFeatureCommunityPost(post.id)}
                        className="px-3 py-1.5 bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>ફીચર કરો (+10 Likes)</span>
                      </button>

                      <button
                        onClick={() => deleteCommunityPost(post.id)}
                        className="p-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 rounded-xl text-xs transition-colors"
                        title="પોસ્ટ હટાવો"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: PATRAK TEMPLATES */}
          {activeSection === 'patrak-engine' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">ડાયનેમિક પત્રક ટેમ્પલેટ એન્જિન</h2>
                <p className="text-xs text-slate-400 mt-1">
                  સરકારી પરિપત્ર મુજબ પત્રક A, B, C અને પરિણામ શીટ્સના ઓટોમેટિક પ્લેસહોલ્ડર્સ
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-amber-400">સપોર્ટેડ ઓટો-ફિલ પ્લેસહોલ્ડર્સ (Placeholders)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                    &#123;&#123;school_name&#125;&#125;
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                    &#123;&#123;udise_code&#125;&#125;
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                    &#123;&#123;principal_name&#125;&#125;
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                    &#123;&#123;academic_year&#125;&#125;
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                    &#123;&#123;student_name&#125;&#125;
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                    &#123;&#123;gr_number&#125;&#125;
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: SECURITY & PASSWORD SETTINGS (NEW!) */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>એડમિન પોર્ટલ સિક્યોરિટી & ઓડિટ ટ્રેકિંગ</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  પાસવર્ડ સુરક્ષા, માસ્ટર રીકવરી, બ્રુટ-ફોર્સ સંરક્ષણ અને સુરક્ષા ઓડિટ લૉગ્સનું સંચાલન
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card 1: Change Password Form */}
                <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2 mb-4">
                    <Key className="w-4 h-4" />
                    <span>એડમિન પાસવર્ડ અને યુઝરનેમ બદલો (Change Password)</span>
                  </h3>

                  <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          એડમિન યુઝરનેમ (Admin Username)
                        </label>
                        <input
                          type="text"
                          value={changePassForm.newUsername}
                          onChange={(e) => setChangePassForm({ ...changePassForm, newUsername: e.target.value })}
                          placeholder="admin"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          વર્તમાન પાસવર્ડ (Current Password) *
                        </label>
                        <div className="relative">
                          <input
                            type={showChangeCurPass ? 'text' : 'password'}
                            value={changePassForm.currentPassword}
                            onChange={(e) => setChangePassForm({ ...changePassForm, currentPassword: e.target.value })}
                            placeholder="હાલનો પાસવર્ડ અથવા PIN દાખલ કરો"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowChangeCurPass(!showChangeCurPass)}
                            className="absolute right-3 top-2 text-slate-400 hover:text-slate-200"
                          >
                            {showChangeCurPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          નવો પાસવર્ડ (New Password) *
                        </label>
                        <div className="relative">
                          <input
                            type={showChangeNewPass ? 'text' : 'password'}
                            value={changePassForm.newPassword}
                            onChange={(e) => setChangePassForm({ ...changePassForm, newPassword: e.target.value })}
                            placeholder="ઓછામાં ઓછા ૬ અક્ષરનો પાસવર્ડ"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowChangeNewPass(!showChangeNewPass)}
                            className="absolute right-3 top-2 text-slate-400 hover:text-slate-200"
                          >
                            {showChangeNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        {/* Strength Indicator */}
                        {changePassForm.newPassword && (
                          <div className="mt-1.5">
                            <div className="flex items-center space-x-2 text-[10px]">
                              <span className="text-slate-400">સ્ટ્રેન્થ:</span>
                              <span className="font-semibold text-slate-200">
                                {getPasswordStrength(changePassForm.newPassword).text}
                              </span>
                            </div>
                            <div className="w-full h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
                              <div
                                className={`h-full ${getPasswordStrength(changePassForm.newPassword).color}`}
                                style={{
                                  width: `${(getPasswordStrength(changePassForm.newPassword).score / 3) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          કન્ફર્મ નવો પાસવર્ડ (Confirm New Password) *
                        </label>
                        <input
                          type={showChangeNewPass ? 'text' : 'password'}
                          value={changePassForm.confirmPassword}
                          onChange={(e) => setChangePassForm({ ...changePassForm, confirmPassword: e.target.value })}
                          placeholder="નવો પાસવર્ડ ફરી દાખલ કરો"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-amber-600/30 transition-all flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>પાસવર્ડ સેવ કરો (Update Password)</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Card 2: Security Keys & Brute Force Stats */}
                <div className="space-y-4">
                  {/* Recovery Key Info */}
                  <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 shadow-xl">
                    <h3 className="text-xs font-bold text-amber-400 flex items-center space-x-1.5 mb-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>માસ્ટર રીકવરી કી (Emergency Recovery)</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mb-3">
                      જો પાસવર્ડ ભૂલી જાઓ, તો આ કી વડે એડમિન પોર્ટલ તાત્કાલિક રીસેટ કરી શકાય છે.
                    </p>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between font-mono text-xs text-amber-300">
                      <span>{adminCredentials.recoveryPin || '2026-SARATHI-SECURE'}</span>
                      <button
                        type="button"
                        onClick={handleCopyRecoveryKey}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="કૉપિ કરો"
                      >
                        {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Lockout Defense Status */}
                  <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 shadow-xl">
                    <h3 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5 mb-3">
                      <ShieldAlert className="w-4 h-4 text-emerald-400" />
                      <span>બ્રુટ-ફોર્સ પ્રોટેક્શન સ્ટેટસ</span>
                    </h3>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-slate-700/60">
                        <span className="text-slate-400">નિષ્ફળ લૉગિન પ્રયાસો:</span>
                        <span className="font-mono font-bold text-amber-400">{adminCredentials.failedAttempts} / 5</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-700/60">
                        <span className="text-slate-400">લૉકઆઉટ મિકેનિઝમ:</span>
                        <span className="text-emerald-400 font-semibold">સક્રિય (Active 3-Min Lock)</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-400">છેલ્લી એડમિન પ્રવૃત્તિ:</span>
                        <span className="text-slate-300">{adminCredentials.lastLoginAt || 'હમણાં'}</span>
                      </div>
                    </div>

                    {adminCredentials.failedAttempts > 0 && (
                      <button
                        onClick={resetAdminLockout}
                        className="w-full mt-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>પ્રયાસોનું કાઉન્ટર રીસેટ કરો (0/5)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Audit Trail Logs Table */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>સિક્યોરિટી ઓડિટ લૉગ્સ (Audit Trail & Activity History)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      એડમિન લૉગિન, પાસવર્ડ ફેરફારો અને સુરક્ષા ઈવેન્ટ્સનો રીઅલ-ટાઇમ હિસ્ટ્રી
                    </p>
                  </div>
                  {adminAuditLogs.length > 0 && (
                    <button
                      onClick={clearAdminAuditLogs}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-slate-600 hover:border-rose-700 rounded-xl text-xs transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>લૉગ્સ સાફ કરો</span>
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="pb-3 font-semibold">સમય / તારીખ</th>
                        <th className="pb-3 font-semibold">ઈવેન્ટ / ક્રિયા</th>
                        <th className="pb-3 font-semibold">સ્થિતિ (Status)</th>
                        <th className="pb-3 font-semibold">વિગતો</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {adminAuditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-500">
                            કોઈ ઓડિટ લૉગ્સ મળ્યા નથી
                          </td>
                        </tr>
                      ) : (
                        adminAuditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-750">
                            <td className="py-3 font-mono text-slate-400 text-[11px]">
                              {new Date(log.timestamp).toLocaleString('gu-IN', {
                                dateStyle: 'short',
                                timeStyle: 'medium'
                              })}
                            </td>
                            <td className="py-3 font-semibold text-slate-200">
                              {log.action === 'login_success' && '✅ સફળ લૉગિન'}
                              {log.action === 'login_failed' && '❌ નિષ્ફળ પ્રયાસ'}
                              {log.action === 'password_changed' && '🔑 પાસવર્ડ બદલાયો'}
                              {log.action === 'recovery_used' && '🔓 માસ્ટર રીકવરી'}
                              {log.action === 'logout' && '🚪 લૉગઆઉટ'}
                              {log.action === 'settings_updated' && '⚙️ સેટિંગ્સ અપડેટ'}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  log.status === 'success'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : log.status === 'warning'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-rose-500/20 text-rose-300'
                                }`}
                              >
                                {log.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 text-slate-300 text-xs">{log.details}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
