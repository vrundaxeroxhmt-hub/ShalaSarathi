import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GUJARAT_DISTRICTS } from '../../data/initialData';
import { School, User, X, CheckCircle, Sparkles, Building, Landmark } from 'lucide-react';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { teacherProfile, schoolProfile, updateTeacherProfile, updateSchoolProfile, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'teacher' | 'school'>('school');

  // Teacher Profile state
  const [tState, setTState] = useState({
    name: teacherProfile.name,
    role: teacherProfile.role,
    mobile: teacherProfile.mobile,
    email: teacherProfile.email,
    schoolName: teacherProfile.schoolName,
    district: teacherProfile.district,
    taluka: teacherProfile.taluka
  });

  // School Profile state
  const [sState, setSState] = useState({
    schoolName: schoolProfile.schoolName,
    udiseCode: schoolProfile.udiseCode,
    district: schoolProfile.district,
    taluka: schoolProfile.taluka,
    village: schoolProfile.village,
    pinCode: schoolProfile.pinCode,
    address: schoolProfile.address,
    academicYear: schoolProfile.academicYear,
    phone: schoolProfile.phone,
    email: schoolProfile.email,
    principalName: schoolProfile.principalName,
    bankAccountNo: schoolProfile.bankAccountNo,
    bankName: schoolProfile.bankName,
    ifscCode: schoolProfile.ifscCode
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacherProfile(tState);
    updateSchoolProfile(sState);
    showToast('પ્રોફાઇલ અને શાળા માહિતી સાચવવામાં આવી!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">શાળા અને શિક્ષક પ્રોફાઇલ સેટિંગ્સ</h3>
              <p className="text-xs text-slate-500">
                અહીં સેટ કરેલ માહિતી તમામ પત્રકો, વાઉચર્સ, લેટરપેડ અને બોનાફાઈડ સર્ટિફિકેટમાં આપમેળે આવશે.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex space-x-2 py-3 border-b border-slate-100 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('school')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'school'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>શાળા વિગત (School Profile)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('teacher')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'teacher'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>શિક્ષક વિગત (Teacher Profile)</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          
          {activeTab === 'school' && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">શાળાનું સત્તાવાર પૂરું નામ *</label>
                <input
                  type="text"
                  required
                  value={sState.schoolName}
                  onChange={(e) => {
                    setSState({ ...sState, schoolName: e.target.value });
                    setTState({ ...tState, schoolName: e.target.value });
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">UDISE કોડ (૧૧ અંક) *</label>
                  <input
                    type="text"
                    required
                    value={sState.udiseCode}
                    onChange={(e) => setSState({ ...sState, udiseCode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">શૈક્ષણિક વર્ષ</label>
                  <input
                    type="text"
                    value={sState.academicYear}
                    onChange={(e) => setSState({ ...sState, academicYear: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">જિલ્લો (District) *</label>
                  <select
                    value={sState.district}
                    onChange={(e) => {
                      setSState({ ...sState, district: e.target.value });
                      setTState({ ...tState, district: e.target.value });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
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
                    value={sState.taluka}
                    onChange={(e) => {
                      setSState({ ...sState, taluka: e.target.value });
                      setTState({ ...tState, taluka: e.target.value });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ગામ / શહેર</label>
                  <input
                    type="text"
                    value={sState.village}
                    onChange={(e) => setSState({ ...sState, village: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">સંપૂર્ણ સરનામું (લેટરપેડ અને પત્રક માટે)</label>
                <input
                  type="text"
                  value={sState.address}
                  onChange={(e) => setSState({ ...sState, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">શાળા બેંક ખાતા નં. (PFMS)</label>
                  <input
                    type="text"
                    value={sState.bankAccountNo}
                    onChange={(e) => setSState({ ...sState, bankAccountNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">બેંકનું નામ</label>
                  <input
                    type="text"
                    value={sState.bankName}
                    onChange={(e) => setSState({ ...sState, bankName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">IFSC કોડ</label>
                  <input
                    type="text"
                    value={sState.ifscCode}
                    onChange={(e) => setSState({ ...sState, ifscCode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teacher' && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">શિક્ષકશ્રીનું પૂરું નામ *</label>
                <input
                  type="text"
                  required
                  value={tState.name}
                  onChange={(e) => setTState({ ...tState, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">હોદ્દો (Designation / Role) *</label>
                  <select
                    value={tState.role}
                    onChange={(e) => setTState({ ...tState, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                  >
                    <option value="મુખ્ય શિક્ષક (આચાર્ય)">મુખ્ય શિક્ષક (આચાર્ય)</option>
                    <option value="ગણિત-વિજ્ઞાન શિક્ષક">ગણિત-વિજ્ઞાન શિક્ષક</option>
                    <option value="ભાષા શિક્ષક (ગુજરાતી/હિન્દી/સંસ્કૃત/અંગ્રેજી)">ભાષા શિક્ષક</option>
                    <option value="સામાજિક વિજ્ઞાન શિક્ષક">સામાજિક વિજ્ઞાન શિક્ષક</option>
                    <option value="વર્ગ શિક્ષક (ધોરણ ૧ થી ૫)">વર્ગ શિક્ષક (ધોરણ ૧ થી ૫)</option>
                    <option value="CRC કો-ઓર્ડિનેટર">CRC કો-ઓર્ડિનેટર</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">મોબાઇલ નંબર</label>
                  <input
                    type="tel"
                    value={tState.mobile}
                    onChange={(e) => setTState({ ...tState, mobile: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ઇમેઇલ સરનામું</label>
                <input
                  type="email"
                  value={tState.email}
                  onChange={(e) => setTState({ ...tState, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs flex items-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>માહિતી સાચવો (Save Changes)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
