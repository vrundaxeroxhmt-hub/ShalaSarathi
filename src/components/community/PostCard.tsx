import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CommunityPost, CommunityReactionType } from '../../types';
import { 
  Heart, 
  Bookmark, 
  Download, 
  Share2, 
  MessageSquare, 
  CheckCircle, 
  ThumbsUp, 
  Sparkles, 
  Lightbulb, 
  Smile, 
  FileText, 
  UserPlus, 
  UserCheck, 
  Send, 
  School, 
  MapPin, 
  Eye, 
  BarChart2, 
  Check,
  Copy,
  ExternalLink,
  X
} from 'lucide-react';

interface PostCardProps {
  post: CommunityPost;
  onPreviewResource?: (post: CommunityPost) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPreviewResource }) => {
  const { 
    reactToPost, 
    toggleLikePost, 
    toggleSavePost, 
    incrementDownload, 
    addCommentToPost, 
    toggleLikeComment, 
    voteOnPoll, 
    toggleFollowTeacher,
    showToast 
  } = useApp();

  const [showReactionsMenu, setShowReactionsMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const quickReplies = ['👏 ઉત્કૃષ્ટ કાર્ય!', '🙏 ખૂબ ખૂબ આભાર સાહેબ', '💡 ખૂબ જ ઉપયોગી સાધન', '🌟 સરસ આયોજન'];

  const reactionsList: { type: CommunityReactionType; emoji: string; label: string; iconColor: string }[] = [
    { type: 'like', emoji: '👍', label: 'Like', iconColor: 'text-blue-600' },
    { type: 'heart', emoji: '❤️', label: 'Love', iconColor: 'text-rose-600' },
    { type: 'clap', emoji: '👏', label: 'Clap', iconColor: 'text-amber-500' },
    { type: 'insight', emoji: '💡', label: 'Insightful', iconColor: 'text-yellow-600' },
    { type: 'laugh', emoji: '😄', label: 'Funny', iconColor: 'text-emerald-500' }
  ];

  const handleReaction = (reaction: CommunityReactionType) => {
    reactToPost(post.id, reaction);
    setShowReactionsMenu(false);
  };

  const getShareText = () => {
    return `📚 શાળા સારથિ (ShalaSarathi) શૈક્ષણિક સામગ્રી:\n\n📌 ${post.title}\n👤 શિક્ષક: ${post.creatorName} (${post.creatorSchool})\n🏷️ ધોરણ/વિષય: ${post.standard} • ${post.subject}\n\nઆ સાધન જુઓ અને ડાઉનલોડ કરો: ${window.location.href}`;
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setShowShareModal(false);
    showToast('વોટ્સએપ પર ફોરવર્ડ કરવા માટે મોકલાયું 📲');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    setShowShareModal(false);
    showToast('ફેસબુક પર શેર થઈ રહ્યું છે 🌐');
  };

  const shareNativeOrCopy = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `શાળા સારથિ શિક્ષક પોસ્ટ: "${post.title}" - ${post.creatorName}`,
          url: window.location.href
        });
        setShowShareModal(false);
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(getShareText());
      showToast('પોસ્ટ અને લિંક ક્લિપબોર્ડમાં કોપી થઈ! ગમે ત્યાં પેસ્ટ કરો 📋');
    }
    setShowShareModal(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addCommentToPost(post.id, commentInput.trim());
    setCommentInput('');
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'questionPaper': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'worksheet': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'patrak': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'lessonPlan': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'paripatra': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'poll': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'statusCard': return 'bg-pink-50 text-pink-700 border-pink-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'questionPaper': return '📄 પ્રશ્નપત્ર';
      case 'worksheet': return '📝 વર્કશીટ';
      case 'patrak': return '📊 પત્રક / ફોર્મેટ';
      case 'lessonPlan': return '📖 લેસન પ્લાન';
      case 'paripatra': return '📜 પરિપત્ર';
      case 'poll': return '📊 શિક્ષક પોલ';
      case 'statusCard': return '✨ શિક્ષક સ્ટેટસ';
      default: return '📁 શૈક્ષણિક સાધન';
    }
  };

  const totalReactionsCount = post.reactionCounts 
    ? Object.values(post.reactionCounts).reduce((a, b) => a + b, 0)
    : post.likesCount;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300">
      
      {/* Header: Teacher Avatar, Name, School & Follow Toggle */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={post.creatorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={post.creatorName}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 p-0.5"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-sm text-slate-900 truncate">
                {post.creatorName}
              </h3>
              {post.creatorBadge && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  {post.creatorBadge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate mt-0.5">
              <span className="truncate">{post.creatorRole}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 truncate">
                <School className="w-3 h-3 shrink-0" /> {post.creatorSchool}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" /> {post.creatorDistrict}
              </span>
              <span>•</span>
              <span>{post.createdAt}</span>
              {post.groupName && (
                <>
                  <span>•</span>
                  <span className="text-amber-700 font-semibold truncate">
                    👥 {post.groupName}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Follow Button */}
        <button
          type="button"
          onClick={() => toggleFollowTeacher(post.creatorName)}
          className={`shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            post.isFollowed
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          {post.isFollowed ? (
            <>
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">ફોલોઇંગ</span>
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              <span>ફોલો કરો</span>
            </>
          )}
        </button>
      </div>

      {/* Body: Different Renderers Based on Type */}

      {/* 1. Status Card Layout (Facebook Style Colorful Quote) */}
      {post.type === 'statusCard' && (
        <div className={`p-8 bg-gradient-to-br ${post.bgGradient || 'from-purple-600 via-pink-600 to-rose-500'} text-white text-center flex flex-col justify-center min-h-[220px]`}>
          <p className="text-lg sm:text-xl font-black leading-relaxed drop-shadow-sm">
            {post.title}
          </p>
          {post.description && (
            <p className="text-xs sm:text-sm text-white/90 mt-3 font-medium max-w-lg mx-auto leading-relaxed">
              {post.description}
            </p>
          )}
        </div>
      )}

      {/* 2. Interactive Poll Layout */}
      {post.type === 'poll' && post.pollData && (
        <div className="p-5 space-y-4">
          <h4 className="font-bold text-sm text-slate-900 leading-snug">
            {post.title}
          </h4>
          {post.description && (
            <p className="text-xs text-slate-600 leading-relaxed">
              {post.description}
            </p>
          )}

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <p className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <span>{post.pollData.question}</span>
            </p>

            <div className="space-y-2 pt-1">
              {post.pollData.options.map((option) => {
                const total = post.pollData?.totalVotes || 1;
                const percentage = Math.round((option.votes / total) * 100);
                const isSelected = post.pollData?.userVotedOptionId === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => voteOnPoll(post.id, option.id)}
                    className={`relative w-full text-left p-3 rounded-xl border text-xs font-medium transition-all overflow-hidden ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-white hover:bg-slate-100/70'
                    }`}
                  >
                    {/* Background Progress Bar */}
                    <div
                      className={`absolute top-0 bottom-0 left-0 transition-all duration-500 opacity-20 ${
                        isSelected ? 'bg-indigo-600' : 'bg-slate-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="text-slate-800">{option.text}</span>
                      </div>
                      <span className="font-bold text-slate-600 shrink-0 ml-2">
                        {percentage}% ({option.votes})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-500 font-medium pt-1 flex items-center justify-between">
              <span>કુલ શિક્ષક મતો: {post.pollData.totalVotes}</span>
              <span className="text-indigo-600">મત આપવા વિકલ્પ પર ક્લિક કરો</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Standard Document / Resource / Paper Card */}
      {post.type !== 'statusCard' && post.type !== 'poll' && (
        <div className="p-5 space-y-3">
          
          {/* Badges: Type, Standard, Subject */}
          <div className="flex items-center flex-wrap gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold ${getTypeBadgeColor(post.type)}`}>
              {getTypeLabel(post.type)}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
              {post.standard}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
              {post.subject}
            </span>
          </div>

          <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
            {post.title}
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {post.description}
          </p>

          {/* Attached Image Media (if any) */}
          {post.mediaUrl && (
            <div className="relative rounded-2xl overflow-hidden max-h-72 w-full bg-slate-100 border border-slate-200 mt-2">
              <img
                src={post.mediaUrl}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          {/* Attached File Download Snippet */}
          {post.fileSnippet && (
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between gap-3 mt-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-amber-600 text-white shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-900 truncate">
                    {post.fileSnippet}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    PDF ફોર્મેટ • તૈયાર પ્રિન્ટેબલ નમૂનો
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                {onPreviewResource && (
                  <button
                    type="button"
                    onClick={() => onPreviewResource(post)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1"
                    title="પ્રિવ્યુ જુઓ"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">જુઓ</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => incrementDownload(post.id)}
                  className="px-3 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ડાઉનલોડ</span>
                </button>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag, i) => (
              <span key={i} className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reactions Count Summary Bar */}
      <div className="px-5 py-2.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-1.5">
          <div className="flex -space-x-1 items-center">
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center shadow-xs">❤️</span>
            <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center shadow-xs">👍</span>
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center shadow-xs">👏</span>
          </div>
          <span className="font-bold text-slate-700">{totalReactionsCount}</span>
          <span className="text-[11px] text-slate-500">શિક્ષક લાઈક્સ</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <button 
            type="button" 
            onClick={() => setShowComments(!showComments)}
            className="hover:underline"
          >
            {(post.comments || []).length} પ્રતિભાવો
          </button>
          <span>•</span>
          <span>{post.downloadsCount} ડાઉનલોડ્સ</span>
        </div>
      </div>

      {/* Interactive Action Bar (Facebook & Instagram Style) */}
      <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between relative">
        
        {/* Floating Facebook Reactions Popup Menu */}
        {showReactionsMenu && (
          <div className="absolute -top-12 left-4 z-30 bg-white rounded-full p-1.5 shadow-xl border border-slate-200 flex items-center space-x-2 animate-in fade-in zoom-in-90 duration-150">
            {reactionsList.map((r) => (
              <button
                key={r.type}
                type="button"
                onClick={() => handleReaction(r.type)}
                className="text-xl p-1.5 hover:scale-130 transition-transform active:scale-95"
                title={r.label}
              >
                {r.emoji}
              </button>
            ))}
          </div>
        )}

        {/* Reaction Button (Click to toggle like or long-press/click for menu) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              if (!showReactionsMenu) {
                toggleLikePost(post.id);
              }
            }}
            onMouseEnter={() => setShowReactionsMenu(true)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              post.isLiked
                ? 'text-rose-600 bg-rose-50'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-600' : ''}`} />
            <span>{post.isLiked ? (post.userReaction || 'લાઈક') : 'લાઈક'}</span>
          </button>
        </div>

        {/* Comment Button */}
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
            showComments ? 'text-amber-700 bg-amber-50' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>કમેન્ટ્સ ({(post.comments || []).length})</span>
        </button>

        {/* Save / Bookmark Button */}
        <button
          type="button"
          onClick={() => toggleSavePost(post.id)}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
            post.isSaved
              ? 'text-amber-600 bg-amber-50'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-amber-600' : ''}`} />
          <span className="hidden sm:inline">{post.isSaved ? 'સેવ્ડ' : 'સેવ'}</span>
        </button>

        {/* Share Button with Social Forwarding Popup */}
        <button
          type="button"
          onClick={() => setShowShareModal(true)}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">શેર / ફોરવર્ડ</span>
        </button>
      </div>

      {/* Share / Forward Modal Popup */}
      {showShareModal && (
        <div className="p-4 bg-amber-50/70 border-t border-amber-200">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-amber-700" />
              <span>આ પોસ્ટ સોશિયલ મીડિયા પર શેર કરો:</span>
            </span>
            <button 
              type="button" 
              onClick={() => setShowShareModal(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {/* WhatsApp Direct Share */}
            <button
              type="button"
              onClick={shareOnWhatsApp}
              className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <span className="text-sm">💬</span>
              <span>WhatsApp</span>
            </button>

            {/* Facebook Share */}
            <button
              type="button"
              onClick={shareOnFacebook}
              className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <span className="text-sm">🌐</span>
              <span>Facebook</span>
            </button>

            {/* Native Share / Copy Link */}
            <button
              type="button"
              onClick={shareNativeOrCopy}
              className="col-span-2 sm:col-span-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>લિંક કૉપી</span>
            </button>
          </div>
        </div>
      )}

      {/* Expandable Comments Thread (Facebook Style) */}
      {showComments && (
        <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200 space-y-4">
          
          {/* Quick Reaction Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addCommentToPost(post.id, reply)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px] font-medium hover:bg-slate-100 whitespace-nowrap shadow-2xs"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* New Comment Input Field */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="તમારો પ્રતિભાવ અથવા પ્રશ્ન લખો..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-amber-500 font-medium"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="p-2.5 rounded-xl bg-amber-600 text-white disabled:opacity-40 hover:bg-amber-700 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3 pt-1">
            {(!post.comments || post.comments.length === 0) ? (
              <p className="text-center text-xs text-slate-400 py-3">
                હજી સુધી કોઈ કમેન્ટ નથી. પ્રથમ પ્રતિભાવ આપો!
              </p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-2.5">
                  <img
                    src={comment.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={comment.authorName}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">
                          {comment.authorName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {comment.createdAt}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {comment.authorRole} {comment.authorSchool ? `• ${comment.authorSchool}` : ''}
                      </p>
                      <p className="text-xs text-slate-800 mt-1.5 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 px-2 pt-1 text-[10px] text-slate-500">
                      <button
                        type="button"
                        onClick={() => toggleLikeComment(post.id, comment.id)}
                        className={`font-bold hover:underline flex items-center gap-1 ${
                          comment.isLiked ? 'text-rose-600' : 'text-slate-600'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-rose-600' : ''}`} />
                        <span>{comment.likesCount > 0 ? `${comment.likesCount} લાઈક` : 'લાઈક'}</span>
                      </button>
                      <span>•</span>
                      <button 
                        type="button" 
                        onClick={() => setCommentInput(`@${comment.authorName} `)}
                        className="hover:underline"
                      >
                        જવાબ આપો
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
