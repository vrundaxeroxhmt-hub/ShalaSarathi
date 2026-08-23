import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GUJARAT_DISTRICTS } from '../../data/initialData';
import { 
  User, 
  School, 
  Save, 
  LogOut, 
  LogIn, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Share2, 
  Building, 
  Mail, 
  Phone, 
  GraduationCap, 
  Cloud, 
  RefreshCw,
  Edit3
} from 'lucide-react';

export const TeacherProfileView: React.FC = () => {
  const { 
    teacherProfile, 
    schoolProfile, 
    updateTeacherProfile, 
    updateSchoolProfile, 
    communityPosts,
    firebaseUser,
    setIsAuthModalOpen,
    logOut,
    showToast 
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'school' | 'contributions'>('profile');

  // Teacher Form State
  const [formData, setFormData] = useState({
    name: teacherProfile.name,
    role: teacherProfile.role,
    mobile: teacherProfile.mobile,
    email: teacherProfile.email || '',
    schoolName: teacherProfile.schoolName,
    district: teacherProfile.district,
    taluka: teacherProfile.taluka,
    experienceYears: teacherProfile.experienceYears || 5,
    standardsTaught: teacherProfile.standardsTaught.join(', '),
    subjectsTaught: teacherProfile.subjectsTaught.join(', ')
  });

  // School Form State
  const [schoolData, setSchoolData] = useState({
    schoolName: schoolProfile.schoolName,
    udiseCode: schoolProfile.udiseCode,
    district: schoolProfile.district,
    taluka: schoolProfile.taluka,
    village: schoolProfile.village,
    principalName: schoolProfile.principalName,
    academicYear: schoolProfile.academicYear,
    phone: schoolProfile.phone,
    email: schoolProfile.email,
    address: schoolProfile.address
  });

  const myPosts = communityPosts.filter(
    p => p.creatorName.trim().toLowerCase() === teacherProfile.name.trim().toLowerCase()
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const stds = formData.standardsTaught.split(',').map(s => s.trim()).filter(Boolean);
    const subs = formData.subjectsTaught.split(',').map(s => s.trim()).filter(Boolean);

    updateTeacherProfile({
      name: formData.name.trim(),
      role: formData.role,
      mobile: formData.mobile.trim(),
      email: formData.email.trim(),
      schoolName: formData.schoolName.trim(),
      district: formData.district,
      taluka: formData.taluka.trim(),
      experienceYears: Number(formData.experienceYears) || 0,
      standardsTaught: stds.length > 0 ? stds : ['ધોરણ ૧ થી ૫'],
      subjectsTaught: subs.length > 0 ? subs : ['તમામ વિષયો']
    });

    updateSchoolProfile({
      schoolName: formData.schoolName.trim(),
      district: formData.district,
      taluka: formData.taluka.trim()
    });

    setIsEditing(false);
    showToast('શિક્ષક પ્રોફાઇલ અને શાળા વિગતો ક્લાઉડમાં અપડેટ થઈ ગઈ ✅');
  };

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(schoolData);
    updateTeacherProfile({
      schoolName: schoolData.schoolName,
      district: schoolData.district,
      taluka: schoolData.taluka
    });
    showToast('શાળા પ્રોફાઇલ સફળતાપૂર્વક સાચવવામાં આવી ✅');
  };

  // Quick switch profile for other teachers (Dynamic multi-user login demo)
  const handleQuickSwitch = (name: string, role: string, school: string, district: string, taluka: string) => {
    updateTeacherProfile({
      name,
      role,
      schoolName: school,
      district,
      taluka
    });
    setFormData(prev => ({
      ...prev,
      name,
      role,
      schoolName: school,
      district,
      taluka
    }));
    showToast(`શિક્ષક ખાતું "${name}" તરીકે સક્રિય થયું!`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Dynamic Profile Header Card */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white text-amber-800 flex items-center justify-center font-black text-3xl sm:text-4xl shadow-lg border-2 border-white/40">
                {teacherProfile.name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-xs" title="ક્લાઉડ ડેટાબેઝ સિંક ચાલુ છે">
                <Cloud className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {teacherProfile.name}
                </h1>
                <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-0.5 rounded-full border border-white/30">
                  {teacherProfile.role}
                </span>
              </div>

              <p className="text-amber-100 text-xs sm:text-sm mt-1 flex items-center gap-1.5">
                <School className="w-4 h-4 shrink-0" />
                <span>{teacherProfile.schoolName}</span>
              </p>
              
              <p className="text-amber-200 text-xs mt-0.5">
                📍 {teacherProfile.taluka}, જિ. {teacherProfile.district} • {teacherProfile.experienceYears} વર્ષનો અનુભવ
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
            {firebaseUser ? (
              <button
                type="button"
                onClick={logOut}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-rose-500/80 hover:bg-rose-600 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-transform active:scale-95 border border-rose-400/40"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-transform active:scale-95 border border-emerald-500"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-white text-amber-900 hover:bg-amber-50 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-transform active:scale-95"
            >
              <Edit3 className="w-4 h-4 text-amber-700" />
              <span>{isEditing ? 'ફોર્મ બંધ કરો' : 'પ્રોફાઇલ એડિટ કરો'}</span>
            </button>
          </div>
        </div>

        {/* Quick Badges / Stats Bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 pt-6 border-t border-white/20 text-center">
          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
            <div className="text-lg sm:text-2xl font-black">{teacherProfile.contributionsCount || myPosts.length}</div>
            <div className="text-[11px] text-amber-100">શેર કરેલ સાધનો</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
            <div className="text-lg sm:text-2xl font-black">{teacherProfile.savedResourcesCount || 14}</div>
            <div className="text-[11px] text-amber-100">સેવ કરેલી સામગ્રી</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
            <div className="text-lg sm:text-2xl font-black">ગુજરાત પ્રા. શિ.</div>
            <div className="text-[11px] text-amber-100">વેરિફાઈડ શિક્ષક</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'profile'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>શિક્ષક માહિતી (Teacher Profile)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('school')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'school'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>શાળા વિગત (School Details)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('contributions')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'contributions'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>મારી પોસ્ટ્સ ({myPosts.length})</span>
        </button>
      </div>

      {/* Tab 1: Teacher Profile Details & Edit Mode */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Edit / Display Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                <span>શિક્ષક વ્યક્તિગત વિગતો</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                અહીં કરેલા ફેરફારો તમામ પત્રકો, સર્ટિફિકેટ્સ અને કમ્યુનિટીમાં લાઈવ થશે
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">શિક્ષકશ્રીનું પૂરું નામ * (Dynamic Name)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="દા.ત. અજયકુમાર કે. પટેલ"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  આ નામથી તમારી કમ્યુનિટી પોસ્ટ્સ, લેસન પ્લાન અને રિપોર્ટ કાર્ડમાં સાઇન આવશે.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">હોદ્દો (Designation / Role) *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  >
                    <option value="મુખ્ય શિક્ષક (આચાર્ય)">મુખ્ય શિક્ષક (આચાર્ય / HTAT)</option>
                    <option value="ગણિત-વિજ્ઞાન શિક્ષક">ગણિત-વિજ્ઞાન શિક્ષક</option>
                    <option value="ભાષા શિક્ષક">ભાષા શિક્ષક (ગુજરાતી / હિન્દી / અંગ્રેજી / સંસ્કૃત)</option>
                    <option value="સામાજિક વિજ્ઞાન શિક્ષક">સામાજિક વિજ્ઞાન શિક્ષક</option>
                    <option value="વર્ગ શિક્ષક (ધોરણ ૧ થી ૫)">વર્ગ શિક્ષક (ધોરણ ૧ થી ૫)</option>
                    <option value="CRC કો-ઓર્ડિનેટર">CRC કો-ઓર્ડિનેટર</option>
                    <option value="મદદનીશ શિક્ષક">મદદનીશ શિક્ષક</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">શૈક્ષણિક અનુભવ (વર્ષમાં)</label>
                  <input
                    type="number"
                    min="0"
                    max="45"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">શાળાનું નામ *</label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="દા.ત. શ્રી પ્રાથમિક શાળા, મોડાસા"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">જિલ્લો (District) *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  >
                    {GUJARAT_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">તાલુકો (Taluka) *</label>
                  <input
                    type="text"
                    required
                    value={formData.taluka}
                    onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">મોબાઇલ નંબર</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="9876543210"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ઇમેઇલ</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="teacher@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ભણાવતા ધોરણો (અલ્પવિરામ સાથે)</label>
                  <input
                    type="text"
                    value={formData.standardsTaught}
                    onChange={(e) => setFormData({ ...formData, standardsTaught: e.target.value })}
                    placeholder="ધોરણ ૬, ધોરણ ૭, ધોરણ ૮"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">મુખ્ય વિષયો</label>
                  <input
                    type="text"
                    value={formData.subjectsTaught}
                    onChange={(e) => setFormData({ ...formData, subjectsTaught: e.target.value })}
                    placeholder="ગણિત, વિજ્ઞાન, સામાજિક વિજ્ઞાન"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>પ્રોફાઇલ સાચવો (Save to Cloud)</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Switch Profiles / Multi-Teacher Simulation Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 shadow-xs">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs pb-3 border-b border-amber-200">
                <RefreshCw className="w-4 h-4 text-amber-700" />
                <span>ક્વિક ટીચર સ્વિચ (Quick Account Switch)</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 mb-3">
                કોઈપણ શિક્ષકના નામ પર ક્લિક કરીને તાત્કાલિક તે પ્રોફાઇલ સાથે એપ ટેસ્ટ કરી શકો છો:
              </p>

              <div className="space-y-2">
                {[
                  {
                    name: 'ભાવિનકુમાર એમ. પરમાર',
                    role: 'ગણિત-વિજ્ઞાન શિક્ષક',
                    school: 'શ્રી પ્રાથમિક શાળા, હિંમતનગર',
                    district: 'સાબરકાંઠા',
                    taluka: 'હિંમતનગર'
                  },
                  {
                    name: 'હરેશભાઈ એન. પટેલ',
                    role: 'મુખ્ય શિક્ષક (આચાર્ય / HTAT)',
                    school: 'મોડલ પ્રાથમિક શાળા, મોડાસા',
                    district: 'અરવલ્લી',
                    taluka: 'મોડાસા'
                  },
                  {
                    name: 'પ્રજ્ઞાબેન આર. જોશી',
                    role: 'ભાષા શિક્ષક (ગુજરાતી)',
                    school: 'શ્રી કન્યા શાળા, પાલનપુર',
                    district: 'બનાસકાંઠા',
                    taluka: 'પાલનપુર'
                  },
                  {
                    name: 'દિલીપસિંહ વી. વાઘેલા',
                    role: 'CRC કો-ઓર્ડિનેટર',
                    school: 'પે સેન્ટર શાળા, મહેસાણા',
                    district: 'મહેસાણા',
                    taluka: 'મહેસાણા'
                  }
                ].map((tc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSwitch(tc.name, tc.role, tc.school, tc.district, tc.taluka)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                      teacherProfile.name === tc.name
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs font-bold'
                        : 'bg-white hover:bg-amber-100/50 text-slate-800 border-amber-100 font-medium'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{tc.name}</div>
                      <div className={`text-[10px] ${teacherProfile.name === tc.name ? 'text-amber-100' : 'text-slate-500'}`}>
                        {tc.role} • {tc.district}
                      </div>
                    </div>
                    {teacherProfile.name === tc.name && (
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Cloud Sync Status Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Cloud className="w-4 h-4 text-emerald-600" />
                <span>Firebase Cloud Database સ્થિતિ</span>
              </h4>
              <div className="mt-3 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>ડેટાબેઝ સિસ્ટમ:</span>
                  <span className="font-bold text-slate-900">Firestore Live</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>લાઇવ સિંક:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    સક્રિય (Active)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>સર્વર સુસંગતતા:</span>
                  <span className="font-bold text-slate-900">VPS / Cloud Ready</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: School Profile Settings */}
      {activeSubTab === 'school' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-600" />
              <span>શાળાની સત્તાવાર માહિતી અને પત્રક વિગતો</span>
            </h3>
          </div>

          <form onSubmit={handleSaveSchool} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">શાળાનું સત્તાવાર પૂરું નામ *</label>
              <input
                type="text"
                required
                value={schoolData.schoolName}
                onChange={(e) => setSchoolData({ ...schoolData, schoolName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">UDISE કોડ (૧૧ અંક) *</label>
                <input
                  type="text"
                  required
                  value={schoolData.udiseCode}
                  onChange={(e) => setSchoolData({ ...schoolData, udiseCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">શૈક્ષણિક વર્ષ</label>
                <input
                  type="text"
                  value={schoolData.academicYear}
                  onChange={(e) => setSchoolData({ ...schoolData, academicYear: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">આચાર્યશ્રીનું પૂરું નામ</label>
                <input
                  type="text"
                  value={schoolData.principalName}
                  onChange={(e) => setSchoolData({ ...schoolData, principalName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">જિલ્લો (District) *</label>
                <select
                  value={schoolData.district}
                  onChange={(e) => setSchoolData({ ...schoolData, district: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                >
                  {GUJARAT_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">તાલુકો (Taluka) *</label>
                <input
                  type="text"
                  required
                  value={schoolData.taluka}
                  onChange={(e) => setSchoolData({ ...schoolData, taluka: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ગામ / શહેર</label>
                <input
                  type="text"
                  value={schoolData.village}
                  onChange={(e) => setSchoolData({ ...schoolData, village: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">શાળાનું સત્તાવાર સરનામું (લેટરપેડ માટે)</label>
              <input
                type="text"
                value={schoolData.address}
                onChange={(e) => setSchoolData({ ...schoolData, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md flex items-center space-x-2 transition-transform active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>શાળા વિગતો સાચવો</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Teacher's Shared Contributions */}
      {activeSubTab === 'contributions' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">તમારા દ્વારા શેર કરેલ સામગ્રી</h3>
              <p className="text-xs text-slate-500">આ તમામ સાધનો ગુજરાતભરના શિક્ષકો સાથે શેર થયેલા છે.</p>
            </div>
            <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs">
              કુલ: {myPosts.length} સાધનો
            </span>
          </div>

          {myPosts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Share2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-bold text-slate-700 text-sm">હજી સુધી કોઈ પોસ્ટ શેર કરેલ નથી</p>
              <p className="text-xs mt-1">કમ્યુનિટી ટેબમાં જઈને તમારી વર્કશીટ, પત્રક કે પ્રશ્નપત્ર શેર કરો.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myPosts.map((post) => (
                <div key={post.id} className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/60 transition-all">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                      {post.standard} • {post.subject}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ❤️ {post.likesCount} લાઇક્સ
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mt-2 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {post.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
