import React from 'react';
import { useApp } from '../../context/AppContext';
import { TeacherGroup } from '../../types';
import { 
  Users, 
  Sparkles, 
  Atom, 
  ShieldCheck, 
  BookOpen, 
  Check, 
  UserPlus, 
  MessageSquare, 
  FileText,
  ArrowRight
} from 'lucide-react';

interface TeacherGroupsViewProps {
  onSelectGroupForFeed?: (groupId: string) => void;
}

export const TeacherGroupsView: React.FC<TeacherGroupsViewProps> = ({ onSelectGroupForFeed }) => {
  const { teacherGroups, toggleJoinGroup } = useApp();

  const getGroupIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Atom': return <Atom className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>ગુજરાત શિક્ષક મંચ ગ્રૂપ્સ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            શિક્ષક વિષયવાર અને વહીવટી સમુદાયો
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            તમારા વિષય અને હોદ્દા મુજબના સક્રિય ગ્રૂપમાં જોડાવો, એકબીજાના પ્રશ્નોનું સમાધાન મેળવો અને ગુણવત્તાસભર સાધનો ડાઉનલોડ કરો.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center shrink-0 border border-white/10">
          <div className="text-2xl font-black text-amber-300">૬૮,૭૫૦+</div>
          <div className="text-[11px] text-slate-300 font-medium">રાજ્યભરના સક્રિય શિક્ષક સભ્યો</div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {teacherGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            {/* Group Banner Image */}
            <div className="relative h-32 w-full overflow-hidden bg-slate-100">
              {group.bannerImage ? (
                <img
                  src={group.bannerImage}
                  alt={group.gujaratiName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-r ${group.bgGradient}`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Category Pill on Banner */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold">
                  {group.category}
                </span>
              </div>

              {/* Group Icon Badge */}
              <div className="absolute bottom-3 left-4 flex items-center space-x-3 text-white">
                <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${group.bgGradient} text-white shadow-md border-2 border-white`}>
                  {getGroupIcon(group.iconName)}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base leading-tight text-white drop-shadow-sm">
                    {group.gujaratiName}
                  </h3>
                  <p className="text-[11px] text-white/80">{group.name}</p>
                </div>
              </div>
            </div>

            {/* Group Content Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed">
                {group.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {group.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Stats Bar */}
              <div className="flex items-center justify-between py-3 border-y border-slate-100 text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="font-bold text-slate-800">{group.membersCount.toLocaleString('gu-IN')}</span>
                  <span>સભ્યો</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="font-bold text-slate-800">{group.postsCount.toLocaleString('gu-IN')}</span>
                  <span>પોસ્ટ્સ & સાધનો</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => toggleJoinGroup(group.id)}
                  className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${
                    group.isJoined
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-amber-600 text-white hover:bg-amber-700 shadow-xs'
                  }`}
                >
                  {group.isJoined ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>સભ્ય છો (Joined)</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>ગ્રૂપમાં જોડાઓ</span>
                    </>
                  )}
                </button>

                {onSelectGroupForFeed && (
                  <button
                    type="button"
                    onClick={() => onSelectGroupForFeed(group.id)}
                    className="flex items-center space-x-1 py-2.5 px-3.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    <span>પોસ્ટ જુઓ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
