import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeachingReel } from '../../types';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Music, 
  Play, 
  Pause, 
  ChevronUp, 
  ChevronDown, 
  UserPlus, 
  UserCheck, 
  Sparkles, 
  Volume2, 
  VolumeX,
  X,
  Send
} from 'lucide-react';

export const TeachingReelsView: React.FC = () => {
  const { 
    teachingReels, 
    likeTeachingReel, 
    saveTeachingReel, 
    toggleFollowTeacher,
    showToast 
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCommentReelId, setActiveCommentReelId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [reelComments, setReelComments] = useState<Record<string, Array<{ id: string; name: string; text: string; time: string }>>>({
    'reel-1': [
      { id: '1', name: 'મહેશભાઈ વ્યાસ', text: 'અદભુત ટ્રીક! મેં આજે જ ૭મા ધોરણમાં ટ્રાય કરાવી, બાળકો ખૂબ ખુશ થયા!', time: '૨ કલાક પહેલાં' },
      { id: '2', name: 'ભાવિકાબેન જોષી', text: 'સર, ૯૯૯ સાથે ગુણાકાર માટે પણ આવો જ શોર્ટ વિડિયો બનાવો ને!', time: '૧ કલાક પહેલાં' }
    ],
    'reel-2': [
      { id: '3', name: 'અનિલભાઈ પટેલ', text: 'પ્રજ્ઞા વર્ગખંડ માટે ખૂબ જ સરળ અને લો-કોસ્ટ TLM છે.', time: '૩૦ મિનિટ પહેલાં' }
    ]
  });

  const categories = [
    { id: 'all', label: 'તમામ રીલ્સ (All)' },
    { id: 'ગણિત શોર્ટકટ્સ', label: '🔢 ગણિત શોર્ટકટ્સ' },
    { id: 'FLN & પ્રજ્ઞા', label: '🎡 FLN & પ્રજ્ઞા' },
    { id: 'વિજ્ઞાન પ્રયોગો', label: '🧪 વિજ્ઞાન પ્રયોગો' },
    { id: 'કલા & હસ્તકલા', label: '🎨 કલા & TLM' }
  ];

  const filteredReels = teachingReels.filter(r => 
    selectedCategory === 'all' || r.category === selectedCategory
  );

  const currentReel: TeachingReel | undefined = filteredReels[currentIndex] || filteredReels[0];

  const handleNext = () => {
    if (currentIndex < filteredReels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeCommentReelId) return;

    const newComment = {
      id: Date.now().toString(),
      name: 'શિક્ષક મિત્ર',
      text: commentText.trim(),
      time: 'હમણાં જ'
    };

    setReelComments(prev => ({
      ...prev,
      [activeCommentReelId]: [newComment, ...(prev[activeCommentReelId] || [])]
    }));

    setCommentText('');
    showToast('તમારો પ્રતિભાવ ઉમેરાયો 💬');
  };

  const handleShareReel = (reel: TeachingReel) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`ShalaSarathi Teaching Reel: ${reel.title} by ${reel.teacherName}`);
      showToast('રીલ લિંક કોપી થઈ! સાથી શિક્ષકો સાથે શેર કરો 🚀');
    }
  };

  if (!currentReel) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <p className="text-slate-500 text-sm">આ કેટેગરીમાં હાલ કોઈ રીલ્સ ઉપલબ્ધ નથી.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-8">
      
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setSelectedCategory(cat.id);
              setCurrentIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Reels Theater Stage */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        
        {/* Vertical Reel Frame (9:16 Aspect ratio container) */}
        <div className="relative w-full max-w-sm h-[620px] rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 flex flex-col justify-between select-none">
          
          {/* Background Video Simulation / Thumbnail */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentReel.videoThumbnail}
              alt={currentReel.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/60" />
          </div>

          {/* Top Info Bar */}
          <div className="z-10 p-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-rose-600/90 backdrop-blur-xs text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> શૈક્ષણિક રીલ
              </span>
              <span className="text-[11px] bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md font-mono">
                {currentReel.videoDuration}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-black/40 backdrop-blur-xs text-white/90 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-black/40 backdrop-blur-xs text-white/90 hover:text-white"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Center Play Indicator */}
          {!isPlaying && (
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                <Play className="w-8 h-8 ml-1" />
              </div>
            </div>
          )}

          {/* Right Action Sidebar (Instagram Reels Style) */}
          <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center space-y-4 text-white">
            
            {/* Teacher Avatar with follow badge */}
            <div className="relative mb-2">
              <img
                src={currentReel.teacherAvatar}
                alt={currentReel.teacherName}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full border-2 border-white object-cover"
              />
              <button
                type="button"
                onClick={() => toggleFollowTeacher(currentReel.teacherName)}
                className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center shadow-xs ${
                  currentReel.isFollowed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {currentReel.isFollowed ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
              </button>
            </div>

            {/* Like Action */}
            <button
              type="button"
              onClick={() => likeTeachingReel(currentReel.id)}
              className="flex flex-col items-center space-y-1 group"
            >
              <div className={`p-2.5 rounded-full backdrop-blur-md transition-transform active:scale-125 ${
                currentReel.isLiked ? 'bg-rose-600 text-white' : 'bg-black/40 text-white group-hover:bg-black/60'
              }`}>
                <Heart className={`w-6 h-6 ${currentReel.isLiked ? 'fill-white' : ''}`} />
              </div>
              <span className="text-[11px] font-bold drop-shadow-md">
                {currentReel.likesCount}
              </span>
            </button>

            {/* Comment Action */}
            <button
              type="button"
              onClick={() => setActiveCommentReelId(currentReel.id)}
              className="flex flex-col items-center space-y-1 group"
            >
              <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white group-hover:bg-black/60 transition-transform active:scale-110">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold drop-shadow-md">
                {(reelComments[currentReel.id] || []).length + currentReel.commentsCount}
              </span>
            </button>

            {/* Save Action */}
            <button
              type="button"
              onClick={() => saveTeachingReel(currentReel.id)}
              className="flex flex-col items-center space-y-1 group"
            >
              <div className={`p-2.5 rounded-full backdrop-blur-md transition-transform active:scale-110 ${
                currentReel.isSaved ? 'bg-amber-500 text-white' : 'bg-black/40 text-white group-hover:bg-black/60'
              }`}>
                <Bookmark className={`w-6 h-6 ${currentReel.isSaved ? 'fill-white' : ''}`} />
              </div>
              <span className="text-[11px] font-bold drop-shadow-md">
                {currentReel.isSaved ? 'સેવ્ડ' : 'સેવ'}
              </span>
            </button>

            {/* Share Action */}
            <button
              type="button"
              onClick={() => handleShareReel(currentReel)}
              className="flex flex-col items-center space-y-1 group"
            >
              <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white group-hover:bg-black/60 transition-transform active:scale-110">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold drop-shadow-md">
                {currentReel.sharesCount}
              </span>
            </button>
          </div>

          {/* Bottom Reel Description */}
          <div className="z-10 p-5 space-y-2 text-white max-w-[82%]">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm leading-snug">
                {currentReel.teacherName}
              </h3>
              <span className="text-[11px] text-white/80">
                • {currentReel.teacherRole}
              </span>
            </div>

            <p className="text-xs font-semibold leading-relaxed line-clamp-2 drop-shadow-sm">
              {currentReel.title}
            </p>

            <p className="text-[11px] text-white/80 line-clamp-2">
              {currentReel.caption}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 pt-1">
              {currentReel.tags.map((tag, i) => (
                <span key={i} className="text-[10px] text-amber-300 font-medium">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Audio Track marquee effect */}
            {currentReel.musicTrack && (
              <div className="flex items-center space-x-2 pt-1 text-[10px] text-white/90 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full w-fit">
                <Music className="w-3 h-3 text-amber-300 animate-spin" />
                <span className="truncate max-w-[180px]">{currentReel.musicTrack}</span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Controls (Next / Prev Reels) */}
        <div className="flex lg:flex-col items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs transition-colors"
            title="અગાઉની રીલ"
          >
            <ChevronUp className="w-6 h-6 hidden lg:block" />
            <span className="text-xs font-bold lg:hidden">અગાઉની</span>
          </button>

          <div className="text-xs font-bold text-slate-500 px-2">
            {currentIndex + 1} / {filteredReels.length}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="p-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs transition-colors"
            title="આગળની રીલ"
          >
            <ChevronDown className="w-6 h-6 hidden lg:block" />
            <span className="text-xs font-bold lg:hidden">આગળની રીલ</span>
          </button>
        </div>
      </div>

      {/* Reel Comments Drawer Modal */}
      {activeCommentReelId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">શિક્ષક પ્રતિભાવો</h3>
                <span className="text-xs font-medium text-slate-500">
                  ({(reelComments[activeCommentReelId] || []).length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveCommentReelId(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {(reelComments[activeCommentReelId] || []).length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">
                  પ્રથમ પ્રતિભાવ આપનાર શિક્ષક બનો!
                </p>
              ) : (
                (reelComments[activeCommentReelId] || []).map((c) => (
                  <div key={c.id} className="flex items-start space-x-2.5 bg-slate-50 p-3 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{c.name}</span>
                        <span className="text-[10px] text-slate-400">{c.time}</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="તમારો અભિપ્રાય લખો..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-slate-100 border-none rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="p-2.5 rounded-xl bg-amber-600 text-white disabled:opacity-40 hover:bg-amber-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
