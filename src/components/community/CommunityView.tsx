import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CommunityPost, CommunityPostType } from '../../types';
import { STANDARDS_LIST, SUBJECTS_LIST, GUJARAT_DISTRICTS } from '../../data/initialData';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Sparkles, 
  FileText, 
  BookOpen, 
  FileSpreadsheet, 
  FileCheck, 
  Layers, 
  Film, 
  Bookmark, 
  User, 
  BarChart2, 
  Image as ImageIcon,
  CheckCircle,
  Eye,
  Download,
  X,
  Share2
} from 'lucide-react';
import { StoriesBar } from './StoriesBar';
import { TeachingReelsView } from './TeachingReelsView';
import { TeacherGroupsView } from './TeacherGroupsView';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';

type CommunityTab = 'feed' | 'reels' | 'groups' | 'saved' | 'myPosts';

export const CommunityView: React.FC = () => {
  const { 
    communityPosts, 
    teacherProfile,
    schoolProfile,
    incrementDownload,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<CommunityTab>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'likes' | 'downloads'>('newest');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewPost, setPreviewPost] = useState<CommunityPost | null>(null);

  const categories: { id: string; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'તમામ (All)', icon: Sparkles },
    { id: 'questionPaper', label: 'પ્રશ્નપત્રો', icon: FileText },
    { id: 'worksheet', label: 'વર્કશીટ્સ', icon: BookOpen },
    { id: 'patrak', label: 'પત્રક / ફોર્મેટ્સ', icon: FileSpreadsheet },
    { id: 'lessonPlan', label: 'લેસન પ્લાન', icon: FileCheck },
    { id: 'poll', label: 'શિક્ષક પોલ', icon: BarChart2 },
    { id: 'statusCard', label: 'સ્ટેટસ કાર્ડ', icon: Sparkles },
    { id: 'paripatra', label: 'પરિપત્રો', icon: FileText }
  ];

  // Filtering posts based on active search, filters and tabs
  const filteredPosts = communityPosts.filter(post => {
    // If on Saved tab
    if (activeTab === 'saved' && !post.isSaved) return false;

    // If on My Posts tab
    if (activeTab === 'myPosts' && post.creatorName !== teacherProfile.name && !post.creatorName.includes('વ્યાસ')) {
      // Show matched teacher profile posts
      if (post.creatorName !== teacherProfile.name) return false;
    }

    // If filtered by group
    if (selectedGroupId && post.groupId !== selectedGroupId) return false;

    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || post.type === selectedType;
    const matchesStandard = selectedStandard === 'all' || post.standard === selectedStandard || post.standard.includes('તમામ');
    const matchesDistrict = selectedDistrict === 'all' || post.creatorDistrict === selectedDistrict;

    return matchesSearch && matchesType && matchesStandard && matchesDistrict;
  }).sort((a, b) => {
    if (sortBy === 'likes') return b.likesCount - a.likesCount;
    if (sortBy === 'downloads') return b.downloadsCount - a.downloadsCount;
    return 0; // default newest
  });

  const handleSelectGroupForFeed = (groupId: string) => {
    setSelectedGroupId(groupId);
    setActiveTab('feed');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & Social Navigation Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        
        {/* Title Bar & Quick Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  શિક્ષક કમ્યુનિટી (Teacher Hub)
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  LIVE ગુજરાત
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ગુજરાતના ૧,૫૦,૦૦૦+ શિક્ષકોનું સોશિયલ પ્લેટફોર્મ • સ્ટોરીઝ, રીલ્સ અને રિસોર્સ શેરિંગ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:opacity-95 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md shadow-amber-600/20 transition-all shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>નવી પોસ્ટ / સાધન શેર કરો</span>
          </button>
        </div>

        {/* Primary Social Tabs (Instagram / Facebook Style) */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
          <button
            type="button"
            onClick={() => { setActiveTab('feed'); setSelectedGroupId(null); }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'feed'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>હોમ ફીડ (Feed)</span>
            {selectedGroupId && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reels')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'reels'
                ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>શિક્ષણ રીલ્સ (Reels)</span>
            <span className="px-1.5 py-0.2 rounded-md bg-rose-500/20 text-rose-300 text-[9px] font-black">
              NEW
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('groups')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'groups'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>શિક્ષક ગ્રૂપ્સ (Groups)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'saved'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>સેવ્ડ સાધનો (Saved)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('myPosts')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'myPosts'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>મારી પોસ્ટ્સ (My Posts)</span>
          </button>
        </div>
      </div>

      {/* Tab View Renderers */}

      {/* 1. REELS VIEW */}
      {activeTab === 'reels' && (
        <TeachingReelsView />
      )}

      {/* 2. GROUPS VIEW */}
      {activeTab === 'groups' && (
        <TeacherGroupsView onSelectGroupForFeed={handleSelectGroupForFeed} />
      )}

      {/* 3. MAIN FEED & SAVED / MY POSTS VIEW */}
      {(activeTab === 'feed' || activeTab === 'saved' || activeTab === 'myPosts') && (
        <div className="space-y-6">
          
          {/* Stories Bar (At top of feed) */}
          {activeTab === 'feed' && !selectedGroupId && (
            <StoriesBar />
          )}

          {/* Group Filter Active Notice Banner */}
          {selectedGroupId && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-amber-700" />
                <span className="font-semibold">ગ્રૂપ ફિલ્ટર સક્રિય છે:</span>
                <span className="font-bold">
                  {communityPosts.find(p => p.groupId === selectedGroupId)?.groupName || 'પસંદ કરેલ ગ્રૂપ'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGroupId(null)}
                className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-800 font-bold hover:bg-amber-100"
              >
                તમામ ફીડ જુઓ ✕
              </button>
            </div>
          )}

          {/* Quick Post Composer Card (Facebook Style) */}
          {activeTab === 'feed' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Teacher Profile"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200/80 text-slate-500 rounded-full py-2.5 px-4 text-xs font-medium text-left transition-colors"
                >
                  {teacherProfile.name ? `${teacherProfile.name}, આજે વર્ગખંડમાં શું નવું કર્યું? શેર કરો...` : 'આજે તમારા વર્ગખંડમાં શું નવું કર્યું? વિચારો કે મટીરીયલ શેર કરો...'}
                </button>
              </div>

              <div className="flex items-center justify-around pt-2 border-t border-slate-100 text-xs text-slate-600">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl hover:bg-slate-50 font-semibold text-amber-700"
                >
                  <FileText className="w-4 h-4" />
                  <span>PDF / મટીરીયલ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl hover:bg-slate-50 font-semibold text-purple-700"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>સ્ટેટસ કાર્ડ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl hover:bg-slate-50 font-semibold text-indigo-700"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>શિક્ષક પોલ</span>
                </button>
              </div>
            </div>
          )}

          {/* Search, Filter Categories & Sorter Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            
            {/* Search and District/Std Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="વિષય, પ્રશ્નપત્ર, પત્રક કે શિક્ષક શોધો..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              {/* Standard Filter */}
              <div>
                <select
                  value={selectedStandard}
                  onChange={(e) => setSelectedStandard(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  <option value="all">તમામ ધોરણ (All Standards)</option>
                  {STANDARDS_LIST.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* District Filter */}
              <div>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  <option value="all">સમગ્ર ગુજરાત (તમામ જિલ્લા)</option>
                  {GUJARAT_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:ring-2 focus:ring-amber-500 font-bold"
                >
                  <option value="newest">નવીનતમ પોસ્ટ્સ (Newest)</option>
                  <option value="likes">સૌથી વધુ લાઈક્સ (Most Liked)</option>
                  <option value="downloads">સૌથી વધુ ડાઉનલોડ્સ</option>
                </select>
              </div>
            </div>

            {/* Category Chips Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedType === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedType(cat.id)}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feed Post Cards Stream */}
          <div className="max-w-3xl mx-auto space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-800">
                  કોઈ પોસ્ટ મળી નથી
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  તમારા સર્ચ ફિલ્ટર્સ બદલીને જુઓ અથવા પ્રથમ પોસ્ટ પ્રકાશિત કરો!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedStandard('all');
                    setSelectedDistrict('all');
                    setSelectedGroupId(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  ફિલ્ટર્સ રીસેટ કરો
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPreviewResource={(p) => setPreviewPost(p)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Resource Full Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            
            {/* Preview Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    {previewPost.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {previewPost.creatorName} ({previewPost.creatorSchool})
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setPreviewPost(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Preview */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-1">સાધન વર્ણન:</h4>
                <p className="text-slate-700 leading-relaxed">
                  {previewPost.description}
                </p>
              </div>

              {previewPost.resourceContent && (
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                  <h4 className="font-bold text-amber-900 mb-1">વિગતવાર વિષયવસ્તુ (Content Preview):</h4>
                  <p className="text-slate-800 leading-relaxed">
                    {previewPost.resourceContent}
                  </p>
                </div>
              )}

              {previewPost.mediaUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <img
                    src={previewPost.mediaUrl}
                    alt={previewPost.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                📄 {previewPost.fileSnippet || 'Document.pdf'}
              </span>
              <button
                type="button"
                onClick={() => {
                  incrementDownload(previewPost.id);
                  setPreviewPost(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 flex items-center gap-1.5 shadow-xs text-xs"
              >
                <Download className="w-4 h-4" />
                <span>ડાઉનલોડ / પ્રિન્ટ કરો</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
