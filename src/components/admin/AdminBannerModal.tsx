import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppBanner, NavTab, SubFeature } from '../../types';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  MoveUp, 
  MoveDown, 
  Sparkles, 
  Image as ImageIcon, 
  Palette, 
  Layers, 
  ExternalLink,
  Shield,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const GRADIENT_PRESETS = [
  { label: 'સૂર્યોદય ઓરેન્જ (Sunset Orange)', value: 'from-amber-600 via-orange-600 to-red-600' },
  { label: 'રોયલ ઇન્ડિગો (Royal Indigo)', value: 'from-indigo-700 via-purple-700 to-pink-700' },
  { label: 'એમરાલ્ડ ગ્રીન (Emerald Green)', value: 'from-emerald-700 via-teal-700 to-cyan-800' },
  { label: 'ઓશન બ્લૂ (Ocean Blue)', value: 'from-blue-700 via-sky-700 to-indigo-800' },
  { label: 'મેજેસ્ટિક પર્પલ (Majestic Purple)', value: 'from-purple-800 via-violet-700 to-indigo-900' },
  { label: 'રૂબી રેડ (Ruby Red)', value: 'from-rose-700 via-red-700 to-amber-700' },
  { label: 'ગોલ્ડન એમ્બર (Golden Amber)', value: 'from-amber-600 via-yellow-600 to-orange-700' },
  { label: 'ડાર્ક સ્લેટ (Dark Slate)', value: 'from-slate-800 via-slate-900 to-zinc-900' },
];

const BADGE_COLORS: Array<{ label: string; value: AppBanner['badgeColor'] }> = [
  { label: 'એમ્બર (Amber)', value: 'amber' },
  { label: 'એમરાલ્ડ (Emerald)', value: 'emerald' },
  { label: 'બ્લૂ (Blue)', value: 'blue' },
  { label: 'પર્પલ (Purple)', value: 'purple' },
  { label: 'રોઝ (Rose)', value: 'rose' },
  { label: 'ઇન્ડિગો (Indigo)', value: 'indigo' },
  { label: 'ઓરેન્જ (Orange)', value: 'orange' },
];

const PRESET_TEMPLATES: Array<Omit<AppBanner, 'id' | 'createdAt'>> = [
  {
    title: 'શાળાકીય ગુણોત્સવ ૨.૦ અને એક્રેડિટેશન મૂલ્યાંકન માર્ગદર્શિકા',
    subtitle: 'શાળાના ભૌતિક, શૈક્ષણિક અને વહીવટી માપદંડોની સંપૂર્ણ ચેકલિસ્ટ તથા પત્રક A, B, C નું ઓટોમેશન ઉપલબ્ધ છે.',
    badgeText: 'મહત્વપૂર્ણ પરિપત્ર ૨૦૨૬',
    badgeColor: 'amber',
    bgGradient: 'from-amber-600 via-orange-600 to-red-600',
    ctaText: 'પત્રક ઓટોમેશન જુઓ',
    ctaLinkType: 'subfeature',
    ctaTarget: 'patrak-automation',
    isActive: true,
    order: 1
  },
  {
    title: 'એકમ કસોટી અને સત્રાંત પરીક્ષા પેપર જનરેટર',
    subtitle: 'GCERT બ્લૂપ્રિન્ટ અનુસાર ધોરણ ૩ થી ૮ માટે વિષયવાર પ્રશ્નબેંકમાંથી મિનિટોમાં તૈયાર કરો A4 પ્રિન્ટેબલ પ્રશ્નપત્ર.',
    badgeText: 'નવું ફીચર',
    badgeColor: 'indigo',
    bgGradient: 'from-indigo-700 via-purple-700 to-pink-700',
    ctaText: 'પ્રશ્નપત્ર બનાવો',
    ctaLinkType: 'subfeature',
    ctaTarget: 'question-paper',
    isActive: true,
    order: 2
  },
  {
    title: 'શાળા કોમ્પોઝીટ ગ્રાન્ટ, રોજમેળ અને PM પોષણ હિસાબ',
    subtitle: 'દૈનિક રોકડમેળ, ઓડિટ-સેફ વાઉચર્સ, સ્ટેશનરી ખરીદી રજિસ્ટર અને MDM દૈનિક અનાજ-કુકિંગ કોસ્ટ કેલ્ક્યુલેટર.',
    badgeText: 'ઓડિટ-સેફ હિસાબ',
    badgeColor: 'emerald',
    bgGradient: 'from-emerald-700 via-teal-700 to-cyan-800',
    ctaText: 'રોજમેળ & ગ્રાન્ટ્સ ખોલો',
    ctaLinkType: 'subfeature',
    ctaTarget: 'rojmel',
    isActive: true,
    order: 3
  },
  {
    title: 'ગુજરાત શિક્ષક કમ્યુનિટી - ૧૦,૦૦૦+ TLM અને પ્રશ્નબેંક',
    subtitle: 'રાજ્યભરના પ્રતિભાશાળી શિક્ષકો સાથે જોડાઓ, વર્કશીટ્સ અને શિક્ષણ સામગ્રી ફ્રી શેર કરો તથા મેળવો.',
    badgeText: 'શિક્ષક સંગમ',
    badgeColor: 'blue',
    bgGradient: 'from-blue-700 via-sky-700 to-indigo-800',
    ctaText: 'કમ્યુનિટી ફીડ ખોલો',
    ctaLinkType: 'tab',
    ctaTarget: 'community',
    isActive: true,
    order: 4
  },
  {
    title: 'શાળા સ્વચ્છતા પખવાડિયું અને SMC માસિક સભા આયોજન',
    subtitle: 'સ્વચ્છતા એક્શન પ્લાન, SMC ઠરાવ, પ્રમાણપત્રો અને સત્તાવાર સૂચના પત્રો તૈયાર કરો.',
    badgeText: 'તાત્કાલિક અમલીકરણ',
    badgeColor: 'orange',
    bgGradient: 'from-amber-600 via-yellow-600 to-orange-700',
    ctaText: 'સત્તાવાર પત્રો ખોલો',
    ctaLinkType: 'subfeature',
    ctaTarget: 'letters-certificates',
    isActive: true,
    order: 5
  },
  {
    title: 'નવી શિક્ષણ નીતિ (NEP ૨૦૨૦) - દૈનિક શિક્ષક નોંધપોથી',
    subtitle: 'અધ્યયન નિષ્પત્તિ આધારિત દૈનિક લેસન પ્લાનિંગ, TLM ઉપયોગ અને પ્રવૃત્તિ નોંધણી.',
    badgeText: 'શિક્ષક ઉપયોગી',
    badgeColor: 'rose',
    bgGradient: 'from-rose-700 via-red-700 to-amber-700',
    ctaText: 'ટીચર ડાયરી ભરો',
    ctaLinkType: 'subfeature',
    ctaTarget: 'lesson-planning',
    isActive: true,
    order: 6
  }
];

export const AdminBannerModal: React.FC = () => {
  const { 
    banners, 
    addBanner, 
    updateBanner, 
    deleteBanner, 
    toggleBannerActive, 
    reorderBanners,
    isAdminModalOpen, 
    setIsAdminModalOpen,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'presets'>('list');
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('નવી જાહેરાત');
  const [badgeColor, setBadgeColor] = useState<AppBanner['badgeColor']>('amber');
  const [bgGradient, setBgGradient] = useState(GRADIENT_PRESETS[0].value);
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('વિગત જુઓ');
  const [ctaLinkType, setCtaLinkType] = useState<'subfeature' | 'tab' | 'external'>('subfeature');
  const [ctaTarget, setCtaTarget] = useState('patrak-automation');
  const [isActive, setIsActive] = useState(true);

  if (!isAdminModalOpen) return null;

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setBadgeText('નવી જાહેરાત');
    setBadgeColor('amber');
    setBgGradient(GRADIENT_PRESETS[0].value);
    setImageUrl('');
    setCtaText('વિગત જુઓ');
    setCtaLinkType('subfeature');
    setCtaTarget('patrak-automation');
    setIsActive(true);
    setEditingBannerId(null);
  };

  const handleStartEdit = (banner: AppBanner) => {
    setEditingBannerId(banner.id);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || '');
    setBadgeText(banner.badgeText || '');
    setBadgeColor(banner.badgeColor || 'amber');
    setBgGradient(banner.bgGradient || GRADIENT_PRESETS[0].value);
    setImageUrl(banner.imageUrl || '');
    setCtaText(banner.ctaText || '');
    setCtaLinkType(banner.ctaLinkType || 'subfeature');
    setCtaTarget(banner.ctaTarget || 'patrak-automation');
    setIsActive(banner.isActive);
    setActiveTab('create');
  };

  const handleApplyPreset = (preset: Omit<AppBanner, 'id' | 'createdAt'>) => {
    setTitle(preset.title);
    setSubtitle(preset.subtitle);
    setBadgeText(preset.badgeText || '');
    setBadgeColor(preset.badgeColor || 'amber');
    setBgGradient(preset.bgGradient);
    setImageUrl(preset.imageUrl || '');
    setCtaText(preset.ctaText || '');
    setCtaLinkType(preset.ctaLinkType || 'subfeature');
    setCtaTarget(preset.ctaTarget || '');
    setIsActive(preset.isActive);
    setEditingBannerId(null);
    setActiveTab('create');
    showToast('ટેમ્પલેટ વિગતો ફોર્મમાં ભરાઈ ગઈ છે. જરૂર મુજબ ફેરફાર કરી સેવ કરો.');
  };

  const handleDirectAddPreset = (preset: Omit<AppBanner, 'id' | 'createdAt'>) => {
    addBanner(preset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('કૃપા કરીને બેનરનું મુખ્ય શીર્ષક લખો.');
      return;
    }

    if (editingBannerId) {
      updateBanner(editingBannerId, {
        title: title.trim(),
        subtitle: subtitle.trim(),
        badgeText: badgeText.trim() || undefined,
        badgeColor,
        bgGradient,
        imageUrl: imageUrl.trim() || undefined,
        ctaText: ctaText.trim() || undefined,
        ctaLinkType,
        ctaTarget: ctaTarget.trim() || undefined,
        isActive
      });
    } else {
      addBanner({
        title: title.trim(),
        subtitle: subtitle.trim(),
        badgeText: badgeText.trim() || undefined,
        badgeColor,
        bgGradient,
        imageUrl: imageUrl.trim() || undefined,
        ctaText: ctaText.trim() || undefined,
        ctaLinkType,
        ctaTarget: ctaTarget.trim() || undefined,
        isActive,
        order: banners.length + 1
      });
    }

    resetForm();
    setActiveTab('list');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[index - 1];
    newBanners[index - 1] = temp;
    // update orders
    newBanners.forEach((b, i) => { b.order = i + 1; });
    reorderBanners(newBanners);
  };

  const handleMoveDown = (index: number) => {
    if (index === banners.length - 1) return;
    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[index + 1];
    newBanners[index + 1] = temp;
    // update orders
    newBanners.forEach((b, i) => { b.order = i + 1; });
    reorderBanners(newBanners);
  };

  const activeCount = banners.filter(b => b.isActive).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  👑 એડમિન પેનલ - બેનર સ્લાઇડર કંટ્રોલ
                </h2>
                <span className="bg-amber-500/30 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Admin Panel
                </span>
              </div>
              <p className="text-xs text-slate-300">
                હોમ પેજ પર દેખાતા બેનર્સ ઉમેરો, સુધારો અને ચાલુ/બંધ કરો
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAdminModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-colors"
            title="બંધ કરો"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-50 border-b border-slate-200">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('list');
                setEditingBannerId(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'list'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>તમામ બેનર્સ ({banners.length})</span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {activeCount} સક્રિય
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeTab !== 'create') resetForm();
                setActiveTab('create');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'create'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{editingBannerId ? '✏️ બેનર સુધારો' : '➕ નવું બેનર ઉમેરો'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'presets'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>શાળા પ્રીસેટ ટેમ્પલેટ્સ</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: LIST VIEW */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">
                  સ્લાઇડરમાં બેનર્સ નીચે આપેલા ક્રમ મુજબ દેખાશે. તમે ક્રમ બદલી શકો છો અથવા ચાલુ/બંધ કરી શકો છો.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('create');
                  }}
                  className="inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>નવું બેનર</span>
                </button>
              </div>

              {banners.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6">
                  <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-700">હજુ સુધી કોઈ બેનર ઉમેરેલ નથી</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    નવું બેનર જાતે ઉમેરો અથવા ગુજરાત પ્રાથમિક શાળાના રેડીમેડ ટેમ્પલેટ્સમાંથી પસંદ કરો.
                  </p>
                  <div className="flex items-center justify-center space-x-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('create')}
                      className="bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:bg-amber-700"
                    >
                      નવું બેનર બનાવો
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('presets')}
                      className="bg-white border border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-slate-100"
                    >
                      રેડીમેડ ટેમ્પલેટ્સ જુઓ
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {banners.map((banner, index) => (
                    <div 
                      key={banner.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        banner.isActive 
                          ? 'bg-white border-slate-200 shadow-xs' 
                          : 'bg-slate-50/70 border-slate-200 opacity-60'
                      } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
                    >
                      {/* Left: preview snippet & text */}
                      <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                        {/* Thumbnail */}
                        <div 
                          className={`w-14 h-14 rounded-xl bg-gradient-to-r ${banner.bgGradient} flex items-center justify-center text-white shrink-0 shadow-xs relative overflow-hidden`}
                          style={banner.imageUrl ? { backgroundImage: `url(${banner.imageUrl})`, backgroundSize: 'cover' } : undefined}
                        >
                          <span className="font-bold text-xs opacity-75">#{index + 1}</span>
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            {banner.badgeText && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                {banner.badgeText}
                              </span>
                            )}
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {banner.title}
                            </h4>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {banner.subtitle || 'કોઈ વર્ણન નથી'}
                          </p>

                          <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-slate-400">
                            <span>બટન: <strong className="text-slate-600">{banner.ctaText || 'નથી'}</strong></span>
                            <span>•</span>
                            <span>લિંક: <strong className="text-slate-600">{banner.ctaTarget || 'નથી'}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                        {/* Reorder Buttons */}
                        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500"
                            title="ઉપર ખસેડો"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === banners.length - 1}
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500"
                            title="નીચે ખસેડો"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Active Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => toggleBannerActive(banner.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center space-x-1 ${
                            banner.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title={banner.isActive ? "નિષ્ક્રિય કરો" : "સક્રિય કરો"}
                        >
                          <span className={`w-2 h-2 rounded-full ${banner.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span>{banner.isActive ? 'સક્રિય' : 'બંધ'}</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleStartEdit(banner)}
                          className="p-2 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-xl transition-colors"
                          title="સુધારો"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`શું તમે ખરેખર "${banner.title}" બેનર ડિલીટ કરવા માંગો છો?`)) {
                              deleteBanner(banner.id);
                            }
                          }}
                          className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-xl transition-colors"
                          title="ડિલીટ કરો"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREATE / EDIT FORM */}
          {activeTab === 'create' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* LIVE PREVIEW CARD */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-600" />
                    <span>લાઇવ પ્રિવ્યૂ (Live Preview)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">તમે નીચે જે લખશો તે મુજબ અહીં તરત દેખાશે</span>
                </div>

                <div 
                  className={`rounded-2xl p-5 sm:p-6 text-white shadow-md bg-gradient-to-r ${bgGradient} relative overflow-hidden transition-all duration-300`}
                  style={imageUrl ? {
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.7)), url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : undefined}
                >
                  <div className="relative z-10 flex flex-col justify-between min-h-[140px]">
                    <div className="flex items-center justify-between">
                      {badgeText ? (
                        <span className="inline-flex items-center space-x-1.5 backdrop-blur-md bg-white/20 border border-white/30 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          <span>{badgeText}</span>
                        </span>
                      ) : <div />}
                      <span className="text-[10px] text-white/70 bg-black/20 px-2 py-0.5 rounded-full">લાઇવ પ્રિવ્યૂ</span>
                    </div>

                    <div className="my-2">
                      <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug drop-shadow-xs">
                        {title.trim() || 'બેનરનું મુખ્ય શીર્ષક અહીં દેખાશે'}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/90 mt-1 line-clamp-2">
                        {subtitle.trim() || 'બેનરનું વિગતવાર વર્ણન / સૂચના અહીં દેખાશે.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {ctaText ? (
                        <span className="inline-flex items-center space-x-1.5 bg-white text-slate-900 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm">
                          <span>{ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                        </span>
                      ) : <div />}
                      <span className="text-[11px] text-white/70">ShalaSarathi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FORM FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    બેનર શીર્ષક (Banner Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="દા.ત. શાળાકીય ગુણોત્સવ ૨.૦ અથવા એકમ કસોટી પેપર જનરેટર"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>

                {/* Subtitle */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    પેટા શીર્ષક / વર્ણન (Subtitle / Details)
                  </label>
                  <textarea
                    rows={2}
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                    placeholder="દા.ત. ધોરણ ૩ થી ૮ ના તમામ વિષયો માટે પ્રશ્નબેંકમાંથી પેપર ડાઉનલોડ કરો."
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>

                {/* Badge Text */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    બેજ લખાણ (Badge Tag Text)
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={e => setBadgeText(e.target.value)}
                    placeholder="દા.ત. નવી જાહેરાત, પરિપત્ર, મહત્વપૂર્ણ"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>

                {/* Badge Color */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    બેજ કલર (Badge Color)
                  </label>
                  <select
                    value={badgeColor}
                    onChange={e => setBadgeColor(e.target.value as any)}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    {BADGE_COLORS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Background Gradient Theme */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    બેકગ્રાઉન્ડ કલર થીમ (Color Gradient Theme)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {GRADIENT_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setBgGradient(preset.value)}
                        className={`h-12 rounded-xl bg-gradient-to-r ${preset.value} text-white text-[11px] font-semibold flex items-center justify-center p-2 text-center transition-all ${
                          bgGradient === preset.value
                            ? 'ring-3 ring-amber-500 ring-offset-2 scale-98 shadow-md'
                            : 'opacity-85 hover:opacity-100'
                        }`}
                      >
                        {preset.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Image URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    વૈકલ્પિક ફોટો લિંક (Optional Image URL)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">જો ફોટો મૂકવો હોય તો સીધી ઇમેજ લિંક પેસ્ટ કરો (ખાલી રાખશો તો કલર ગ્રેડિયન્ટ લાગુ પડશે).</p>
                </div>

                {/* CTA Button Text */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    બટન લખાણ (Button CTA Text)
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={e => setCtaText(e.target.value)}
                    placeholder="દા.ત. વિગત જુઓ, પેપર બનાવો, પરિપત્ર ખોલો"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>

                {/* CTA Link Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    બટન એક્શન પ્રકાર (Action Type)
                  </label>
                  <select
                    value={ctaLinkType}
                    onChange={e => {
                      const val = e.target.value as any;
                      setCtaLinkType(val);
                      if (val === 'subfeature') setCtaTarget('patrak-automation');
                      else if (val === 'tab') setCtaTarget('community');
                      else setCtaTarget('https://');
                    }}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="subfeature">એપ ફીચર / મોડ્યુલ ખોલો (Sub Feature)</option>
                    <option value="tab">મુખ્ય ટેબ ખોલો (Main Tab)</option>
                    <option value="external">બહારની વેબસાઇટ લિંક (External URL)</option>
                  </select>
                </div>

                {/* CTA Target */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    લિંક ટાર્ગેટ (Target Destination)
                  </label>
                  
                  {ctaLinkType === 'subfeature' && (
                    <select
                      value={ctaTarget}
                      onChange={e => setCtaTarget(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="patrak-automation">📋 પત્રક ઓટોમેશન (પત્રક A, B, C)</option>
                      <option value="rojmel">💰 રોકડમેળ અને વાઉચર્સ (Rojmel)</option>
                      <option value="grants">🏫 શાળા ગ્રાન્ટ્સ હિસાબ (Grants)</option>
                      <option value="purchases">🛒 ખરીદી રજિસ્ટર (Purchases)</option>
                      <option value="pm-poshan">🍲 PM પોષણ MDM કેલ્ક્યુલેટર</option>
                      <option value="question-paper">📝 પ્રશ્નપત્ર જનરેટર (Question Paper)</option>
                      <option value="lesson-planning">📔 ટીચર ડાયરી (Teacher Diary)</option>
                      <option value="letters-certificates">📄 સત્તાવાર પત્રો અને પ્રમાણપત્રો</option>
                      <option value="saved-resources">⭐ સેવ કરેલ સંસાધનો (My Work)</option>
                    </select>
                  )}

                  {ctaLinkType === 'tab' && (
                    <select
                      value={ctaTarget}
                      onChange={e => setCtaTarget(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="home">🏠 હોમ પેજ (Home)</option>
                      <option value="create">✏️ સર્જન ટૂલ્સ (Creator Tools)</option>
                      <option value="work-assistant">⚡ કાર્ય સહાયક (Work Assistant)</option>
                      <option value="community">👥 શિક્ષક કમ્યુનિટી (Community)</option>
                      <option value="my-work">📁 મારું કાર્ય (My Work)</option>
                    </select>
                  )}

                  {ctaLinkType === 'external' && (
                    <input
                      type="url"
                      value={ctaTarget}
                      onChange={e => setCtaTarget(e.target.value)}
                      placeholder="https://gujarat.gov.in"
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  )}
                </div>

                {/* Active Checkbox */}
                <div className="sm:col-span-2 flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="banner-is-active"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500"
                  />
                  <label htmlFor="banner-is-active" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    આ બેનરને હોમ સ્લાઇડર પર તરત સક્રિય (Active) રાખો
                  </label>
                </div>

              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('list');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  રદ કરો (Cancel)
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingBannerId ? 'બેનર અપડેટ કરો' : 'નવું બેનર સેવ કરો'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PRESET TEMPLATES */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">
                  ગુજરાતની સરકારી અને ગ્રાન્ટેડ શાળાઓ માટે ખાસ તૈયાર કરેલા આદર્શ બેનર નમૂનાઓ.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRESET_TEMPLATES.map((preset, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Mini visual */}
                      <div className={`h-16 rounded-xl bg-gradient-to-r ${preset.bgGradient} p-3 text-white flex flex-col justify-between mb-3 shadow-xs`}>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-black/20 rounded-full w-fit">
                          {preset.badgeText}
                        </span>
                        <p className="text-xs font-bold truncate text-white">{preset.title}</p>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{preset.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{preset.subtitle}</p>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold py-1.5 px-3 rounded-xl transition-colors"
                      >
                        ફોર્મમાં લોડ કરો
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDirectAddPreset(preset)}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-1.5 px-3 rounded-xl shadow-xs transition-colors flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>સીધું ઉમેરો</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>ShalaSarathi • એડમિન મેનેજમેન્ટ સિસ્ટમ</span>
          <button
            type="button"
            onClick={() => setIsAdminModalOpen(false)}
            className="text-amber-700 hover:text-amber-800 font-semibold"
          >
            પૂર્ણ (Done)
          </button>
        </div>

      </div>
    </div>
  );
};
