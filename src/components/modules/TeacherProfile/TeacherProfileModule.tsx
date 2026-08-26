import React, { useState } from 'react';
import { UserCheck, Save, CheckCircle2, Building2, MapPin, Award, Calendar, Sparkles } from 'lucide-react';
import { TeacherProfile, Designation, DistrictGujarat } from '@/types/user';

interface Props {
  profile: TeacherProfile;
  onSaveProfile: (updated: TeacherProfile) => Promise<void>;
}

export const TeacherProfileModule: React.FC<Props> = ({ profile, onSaveProfile }) => {
  const [formData, setFormData] = useState<TeacherProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const districts: DistrictGujarat[] = [
    'Banaskantha (બનાસકાંઠા)', 'Ahmedabad (અમદાવાદ)', 'Amreli (અમરેલી)', 'Anand (આણંદ)', 'Aravalli (અરવલ્લી)',
    'Bharuch (ભરૂચ)', 'Bhavnagar (ભાવનગર)', 'Botad (બોટાદ)', 'Dahod (દાહોદ)', 'Gandhinagar (ગાંધીનગર)',
    'Gir Somnath (ગીર સોમનાથ)', 'Jamnagar (જામનગર)', 'Junagadh (જૂનાગઢ)', 'Kheda (ખેડા)', 'Kutch (કચ્છ)',
    'Mehsana (મહેસાણા)', 'Morbi (મોરબી)', 'Navsari (નવસારી)', 'Patan (પાટણ)', 'Porbandar (પોરબંદર)',
    'Rajkot (રાજકોટ)', 'Sabarkantha (સાબરકાંઠા)', 'Surat (સુરત)', 'Surendranagar (સુરેન્દ્રનગર)', 'Vadodara (વડોદરા)', 'Valsad (વલસાડ)'
  ];

  const designations: Designation[] = [
    'Head Teacher / Acharya (મુખ્ય શિક્ષક / આચાર્ય)',
    'Primary Teacher (પ્રાથમિક શિક્ષક)',
    'Assistant Teacher (સહાયક શિક્ષક)',
    'CRCC (સી.આર.સી.કો.)',
    'BRCC (બી.આર.સી.કો.)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSaveProfile(formData);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto font-sans space-y-6">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ઓટો-ફિલ એન્જિન કનેક્ટેડ</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">શિક્ષક પ્રોફાઇલ અને શાળા સેટઅપ</h2>
          <p className="text-xs text-slate-500 mt-1">
            અહીં દાખલ કરેલી વિગતો તમામ પત્રકો, અહેવાલો અને વાઉચરમાં આપોઆપ (Auto-Fill) છપાઈ જશે.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>પ્રોફાઇલ સફળતાપૂર્વક સાચવવામાં આવી!</span>
          </div>
        )}
      </div>

      {/* Auto Fill Flow Diagram */}
      <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
        <div className="font-bold text-amber-400 uppercase tracking-wide text-[10px]">દસ્તાવેજ ઓટો-ફિલ સિસ્ટમ આર્કિટેક્ચર (Auto-Fill Pipeline)</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-[11px]">
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 font-semibold text-white">૧. પ્રોફાઇલ ડેટા</div>
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 font-semibold text-brand-300">૨. પત્રક ટેમ્પ્લેટ</div>
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 font-semibold text-emerald-300">૩. ઓટો-ફિલ ફોર્મ</div>
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 font-semibold text-amber-300">૪. વોઇસ/મેન્યુઅલ એડિટ</div>
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 font-semibold text-purple-300">૫. સત્તાવાર PDF / પ્રિન્ટ</div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Teacher Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserCheck className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-800">શિક્ષકની વ્યક્તિગત વિગત (Teacher Personal Details)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">શિક્ષકનું નામ (ગુજરાતીમાં)</label>
              <input
                type="text"
                required
                value={formData.nameGuj}
                onChange={e => setFormData({ ...formData, nameGuj: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Teacher Name (In English)</label>
              <input
                type="text"
                required
                value={formData.nameEng}
                onChange={e => setFormData({ ...formData, nameEng: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">મોબાઇલ નંબર (Mobile)</label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ઈમેઇલ (Email)</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">હોદ્દો (Designation)</label>
              <select
                value={formData.designation}
                onChange={e => setFormData({ ...formData, designation: e.target.value as Designation })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
              >
                {designations.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">શૈક્ષણિક વર્ષ (Academic Year)</label>
              <select
                value={formData.academicYear}
                onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
              >
                <option value="2026-27">2026-27</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: School Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-800">શાળાની વિગતો (School Metadata & UDISE)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">શાળાનું નામ (ગુજરાતી)</label>
              <input
                type="text"
                required
                value={formData.school.schoolNameGuj}
                onChange={e => setFormData({
                  ...formData,
                  school: { ...formData.school, schoolNameGuj: e.target.value }
                })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">યુ-ડાયસ કોડ (UDISE Code)</label>
              <input
                type="text"
                required
                value={formData.school.udiseCode}
                onChange={e => setFormData({
                  ...formData,
                  school: { ...formData.school, udiseCode: e.target.value }
                })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">જિલ્લો (District)</label>
              <select
                value={formData.school.district}
                onChange={e => setFormData({
                  ...formData,
                  school: { ...formData.school, district: e.target.value as DistrictGujarat }
                })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
              >
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">તાલુકો (Taluka)</label>
              <input
                type="text"
                required
                value={formData.school.taluka}
                onChange={e => setFormData({
                  ...formData,
                  school: { ...formData.school, taluka: e.target.value }
                })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ગામ / શહેર (Village/City)</label>
              <input
                type="text"
                required
                value={formData.school.village}
                onChange={e => setFormData({
                  ...formData,
                  school: { ...formData.school, village: e.target.value }
                })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">પે સેન્ટર શાળા (Pay Center School)</label>
              <input
                type="text"
                value={formData.school.payCenterSchool || ''}
                onChange={e => setFormData({
                  ...formData,
                  school: { ...formData.school, payCenterSchool: e.target.value }
                })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-brand-900/30 flex items-center gap-2 text-sm transition-all transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'સાચવી રહ્યા છીએ...' : 'પ્રોફાઇલ સેવ કરો (Save Profile)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
