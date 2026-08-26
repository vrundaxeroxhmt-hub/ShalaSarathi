import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, ToggleLeft, ToggleRight } from 'lucide-react';
import { RojmelAccountSetup } from '@/types/rojmel';
import { rojmelRepo } from '@/lib/repositories/LocalStorageRepository';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setups: RojmelAccountSetup[];
  onRefresh: () => Promise<void>;
}

export const RojmelAdminControlModal: React.FC<Props> = ({
  isOpen,
  onClose,
  setups,
  onRefresh
}) => {
  const [teacherCanEditLimits, setTeacherCanEditLimits] = useState(true);

  useEffect(() => {
    async function loadAdminSetting() {
      const allowed = await rojmelRepo.getAdminTeacherCanEditLimits();
      setTeacherCanEditLimits(allowed);
    }
    if (isOpen) {
      loadAdminSetting();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleLimitSetting = async () => {
    const next = !teacherCanEditLimits;
    await rojmelRepo.setAdminTeacherCanEditLimits(next);
    setTeacherCanEditLimits(next);
  };

  const handleApproveOneTimeRelease = async (setupId: string) => {
    await rojmelRepo.adminReleaseOneTimeEdit(setupId);
    alert('શિક્ષકને સેટઅપમાં ૧-વખત ફેરફાર માટેની સત્તાવાર પરમિશન આપવામાં આવી!');
    await onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">એડમિન કંટ્રોલ સેન્ટર (Rojmel Admin Panel)</h3>
              <p className="text-[10px] text-slate-400">એડમિન ગ્રાન્ટ સેટિંગ્સ અને ૧-ટાઇમ એડિટ રીલીઝ મંજૂરી</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Admin Toggle Setting */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-slate-900">શિક્ષક ગ્રાન્ટ લિમિટ બદલી શકે (Teacher Can Edit Grant Limits)</div>
            <p className="text-[11px] text-slate-500 font-medium">
              જો ON હોય તો શિક્ષક હેડ લિમિટ બદલી શકશે. જો OFF હોય તો લિમિટ પ્રોટેક્ટેડ રહેશે.
            </p>
          </div>

          <button
            onClick={handleToggleLimitSetting}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs ${
              teacherCanEditLimits ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
            }`}
          >
            {teacherCanEditLimits ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            <span>{teacherCanEditLimits ? 'ON (મંજૂર)' : 'OFF (બ્લોક)'}</span>
          </button>
        </div>

        {/* Edit Release Requests List */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-slate-800">સેટઅપ એડિટ વિનંતીઓ (Edit Release Requests)</span>

          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-52 overflow-y-auto">
            {setups.map(s => (
              <div key={s.id} className="p-3 bg-white flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">{s.schoolNameGuj} ({s.financialYear})</div>
                  <div className="text-[10px] text-slate-500 font-mono">{s.rojmelNameGuj}</div>
                  {s.editRequestReason && (
                    <div className="text-[10px] text-amber-700 font-semibold">
                      કારણ: {s.editRequestReason}
                    </div>
                  )}
                </div>

                <div>
                  {s.editRequestStatus === 'requested' ? (
                    <button
                      onClick={() => handleApproveOneTimeRelease(s.id)}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-lg shadow flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>૧-વખત મંજૂર કરો</span>
                    </button>
                  ) : s.editRequestStatus === 'released_once' ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ૧-વખત રીલીઝ થયેલ
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>લોક થયેલ</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
          >
            બંધ કરો
          </button>
        </div>
      </div>
    </div>
  );
};
