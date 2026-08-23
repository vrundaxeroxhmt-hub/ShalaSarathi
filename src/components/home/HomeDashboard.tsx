import React from 'react';
import { useApp } from '../../context/AppContext';
import { BannerSlider } from '../banner/BannerSlider';
import { HomeDataVisualization } from './HomeDataVisualization';
import { WeeklyScheduleWidget } from './WeeklyScheduleWidget';
import { 
  FileSpreadsheet, 
  Wallet, 
  Landmark, 
  ShoppingCart, 
  UtensilsCrossed, 
  FileText, 
  Award, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Download, 
  Heart, 
  Bookmark, 
  PlusCircle, 
  Clock, 
  School,
  CheckCircle2,
  TrendingUp,
  Users,
  PiggyBank,
  ShoppingBag,
  Utensils,
  FolderDown
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { 
    teacherProfile, 
    schoolProfile, 
    grants, 
    communityPosts, 
    rojmelTransactions, 
    students,
    dynamicCards,
    setActiveTab, 
    setActiveSubFeature,
    toggleLikePost,
    toggleSavePost,
    incrementDownload
  } = useApp();

  const totalGrantBalance = grants.reduce((sum, g) => sum + g.currentBalance, 0);
  const totalStudentsCount = students.length;

  const getCardIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-5 h-5" />;
      case 'Wallet': return <Wallet className="w-5 h-5" />;
      case 'PiggyBank': case 'Landmark': return <Landmark className="w-5 h-5" />;
      case 'ShoppingBag': case 'ShoppingCart': return <ShoppingCart className="w-5 h-5" />;
      case 'Utensils': case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5" />;
      case 'FileText': return <FileText className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'FolderDown': case 'Download': return <FolderDown className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getCardColorScheme = (scheme: string) => {
    switch (scheme) {
      case 'emerald': return { bg: 'bg-emerald-50/80 hover:bg-emerald-50', border: 'border-emerald-200 hover:border-emerald-300', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-800', iconBg: 'bg-emerald-100 text-emerald-700' };
      case 'blue': return { bg: 'bg-blue-50/80 hover:bg-blue-50', border: 'border-blue-200 hover:border-blue-300', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-800', iconBg: 'bg-blue-100 text-blue-700' };
      case 'indigo': return { bg: 'bg-indigo-50/80 hover:bg-indigo-50', border: 'border-indigo-200 hover:border-indigo-300', text: 'text-indigo-900', badge: 'bg-indigo-100 text-indigo-800', iconBg: 'bg-indigo-100 text-indigo-700' };
      case 'amber': return { bg: 'bg-amber-50/80 hover:bg-amber-50', border: 'border-amber-200 hover:border-amber-300', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-800', iconBg: 'bg-amber-100 text-amber-700' };
      case 'purple': return { bg: 'bg-purple-50/80 hover:bg-purple-50', border: 'border-purple-200 hover:border-purple-300', text: 'text-purple-900', badge: 'bg-purple-100 text-purple-800', iconBg: 'bg-purple-100 text-purple-700' };
      case 'orange': return { bg: 'bg-orange-50/80 hover:bg-orange-50', border: 'border-orange-200 hover:border-orange-300', text: 'text-orange-900', badge: 'bg-orange-100 text-orange-800', iconBg: 'bg-orange-100 text-orange-700' };
      case 'rose': return { bg: 'bg-rose-50/80 hover:bg-rose-50', border: 'border-rose-200 hover:border-rose-300', text: 'text-rose-900', badge: 'bg-rose-100 text-rose-800', iconBg: 'bg-rose-100 text-rose-700' };
      default: return { bg: 'bg-slate-50 hover:bg-slate-100', border: 'border-slate-200 hover:border-slate-300', text: 'text-slate-900', badge: 'bg-slate-100 text-slate-800', iconBg: 'bg-slate-100 text-slate-700' };
    }
  };

  const visibleCards = dynamicCards
    .filter(c => c.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-3xl text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center font-bold text-9xl select-none pointer-events-none">
          શાળા
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-amber-500/30 backdrop-blur-xs border border-amber-300/30 px-3 py-1 rounded-full text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>શિક્ષકનું કામ સરળ બનાવવાનું, શિક્ષણ માટે સમય બચાવવાનું</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            નમસ્તે, {teacherProfile.name} 👋
          </h1>
          <p className="text-amber-100 text-sm mt-1 font-medium">
            {schoolProfile.schoolName} • {schoolProfile.taluka}, {schoolProfile.district}
          </p>

          {/* Quick stats badges */}
          <div className="flex flex-wrap gap-2.5 mt-5">
            <div className="bg-black/20 backdrop-blur-xs border border-white/10 px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5">
              <span className="text-amber-200 font-bold">{totalStudentsCount}</span>
              <span className="text-white/80">વિદ્યાર્થીઓ</span>
            </div>
            <div className="bg-black/20 backdrop-blur-xs border border-white/10 px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5">
              <span className="text-amber-200 font-bold">₹{totalGrantBalance.toLocaleString('gu-IN')}</span>
              <span className="text-white/80">કુલ ઉપલબ્ધ ગ્રાન્ટ</span>
            </div>
            <div className="bg-black/20 backdrop-blur-xs border border-white/10 px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5">
              <span className="text-amber-200 font-bold">{teacherProfile.contributionsCount}</span>
              <span className="text-white/80">તમારું કમ્યુનિટી યોગદાન</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Banner Slider with Admin Panel Controls */}
      <BannerSlider />

      {/* Community Spotlight Banner */}
      <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-base">👥 Teacher Community (શિક્ષક કમ્યુનિટી)</span>
              <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Feed
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              નવા પ્રશ્નપત્રો, પત્રક ફોર્મેટ્સ, દૈનિક શિક્ષણ નોંધ અને પરિપત્ર સંદર્ભ મેળવો અથવા સાથી શિક્ષકો સાથે શેર કરો.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setActiveTab('community');
            setActiveSubFeature('community-feed');
          }}
          className="inline-flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs shrink-0"
        >
          <span>કમ્યુનિટી એક્સપ્લોર કરો</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Data Visualization Summary: Student Attendance Trends & Community Activity Levels */}
      <HomeDataVisualization />

      {/* સાપ્તાહિક સમયપત્રક & શાળા ઇવેન્ટ્સ (Weekly Scheduling Tool) */}
      <WeeklyScheduleWidget />

      {/* "આજે શું કરવું છે?" (Admin Configured Dynamic Action Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span>આજે શું કરવું છે?</span>
            <span className="text-xs font-normal text-slate-500">(School Assistant & Tools)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {visibleCards.map((card) => {
            const colors = getCardColorScheme(card.colorScheme);
            return (
              <div
                key={card.id}
                onClick={() => {
                  setActiveTab(card.targetTab);
                  if (card.targetSubFeature) {
                    setActiveSubFeature(card.targetSubFeature);
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${colors.bg} ${colors.border}`}
                id={`home-card-${card.id}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors.iconBg}`}>
                      {getCardIcon(card.iconName)}
                    </div>
                    {card.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${colors.badge}`}>
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <h3 className={`font-bold text-sm ${colors.text}`}>
                    {card.gujaratiTitle || card.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 flex items-center justify-between border-t border-slate-200/60 text-xs font-semibold text-slate-700">
                  <span>ખોલો / શરૂ કરો</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grant Status Overview Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">શાળા ગ્રાન્ટ સ્થિતિ (School Grant Balances)</h3>
            <p className="text-xs text-slate-500">ગ્રાન્ટ મુજબ બાકી રકમ અને વપરાશની વિગત</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab('work-assistant');
              setActiveSubFeature('grants');
            }}
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center space-x-1"
          >
            <span>સંપૂર્ણ હિસાબ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {grants.map((grant) => {
            const spent = grant.sanctionedAmount - grant.currentBalance;
            const percent = Math.round((grant.currentBalance / grant.sanctionedAmount) * 100);
            return (
              <div key={grant.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <p className="text-[11px] font-medium text-slate-600 truncate" title={grant.gujaratiName}>
                  {grant.gujaratiName}
                </p>
                <p className="text-base font-bold text-slate-900 mt-1">
                  ₹{grant.currentBalance.toLocaleString('gu-IN')}
                </p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-amber-600 h-full rounded-full" 
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  કુલ: ₹{grant.sanctionedAmount.toLocaleString('gu-IN')}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Latest Highlights */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">તાજેતરનું કમ્યુનિટી મટીરીયલ (Recent Resources)</h2>
            <p className="text-xs text-slate-500">ગુજરાતના શિક્ષકો દ્વારા અપલોડ કરાયેલ નવું મટીરીયલ</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab('community');
              setActiveSubFeature('community-feed');
            }}
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center space-x-1"
          >
            <span>બધું જુઓ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communityPosts.slice(0, 3).map((post) => (
            <div key={post.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {post.standard}
                  </span>
                  <span className="text-[11px] text-slate-400">{post.createdAt}</span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                  {post.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                  {post.description}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                    {post.creatorName.charAt(0)}
                  </div>
                  <span className="text-[11px] text-slate-600 truncate font-medium">
                    {post.creatorName} ({post.creatorDistrict})
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => toggleLikePost(post.id)}
                  className={`flex items-center space-x-1 font-medium transition-colors ${
                    post.isLiked ? 'text-red-500' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-red-500' : ''}`} />
                  <span>{post.likesCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleSavePost(post.id)}
                  className={`flex items-center space-x-1 font-medium transition-colors ${
                    post.isSaved ? 'text-amber-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${post.isSaved ? 'fill-amber-600' : ''}`} />
                  <span>{post.savesCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => incrementDownload(post.id)}
                  className="flex items-center space-x-1 text-amber-700 hover:text-amber-800 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>વાપરો</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
