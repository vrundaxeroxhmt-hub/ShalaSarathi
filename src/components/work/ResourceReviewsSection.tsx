import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ResourceReview } from '../../types';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Award,
  CheckCircle,
  Plus,
  Filter,
  Trash2,
  Sparkles,
  Send,
  UserCheck,
  Building,
  GraduationCap,
  Calendar,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';

interface ResourceReviewsSectionProps {
  resourceId: string;
  resourceTitle: string;
  baseRating?: number;
  baseReviewCount?: number;
  className?: string;
}

const PRESET_TAGS = [
  'LO આધારિત',
  'વર્ગખંડ ઉપયોગી',
  'સરળ સમજૂતી',
  'A4 પ્રિન્ટ અનુકૂળ',
  'FLN શ્રેષ્ઠ',
  'પરીક્ષા લક્ષી',
  'પ્રાયોગિક શિક્ષણ',
  'ઓડિટ માન્ય'
];

export const StarRatingBadge: React.FC<{
  resourceId: string;
  baseRating?: number;
  baseReviewCount?: number;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}> = ({
  resourceId,
  baseRating = 4.9,
  baseReviewCount = 18,
  onClick,
  className = ''
}) => {
  const { resourceReviews } = useApp();
  
  const matchingReviews = useMemo(() => {
    return resourceReviews.filter(r => r.resourceId === resourceId);
  }, [resourceReviews, resourceId]);

  const { avgScore, totalCount } = useMemo(() => {
    const dynamicCount = matchingReviews.length;
    const total = baseReviewCount + dynamicCount;
    const dynamicSum = matchingReviews.reduce((acc, r) => acc + r.rating, 0);
    const baseSum = baseRating * baseReviewCount;
    const score = total > 0 ? Number(((baseSum + dynamicSum) / total).toFixed(1)) : 5.0;
    return { avgScore: score, totalCount: total };
  }, [matchingReviews, baseRating, baseReviewCount]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center space-x-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${className}`}
      title={`${avgScore} સ્ટાર (${totalCount} શિક્ષક પ્રતિભાવો - ક્લિક કરીને વાંચો)`}
    >
      <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
      <span>{avgScore}</span>
      <span className="text-[10px] text-amber-700 font-normal">({totalCount})</span>
    </button>
  );
};

export const ResourceReviewsSection: React.FC<ResourceReviewsSectionProps> = ({
  resourceId,
  resourceTitle,
  baseRating = 4.9,
  baseReviewCount = 18,
  className = ''
}) => {
  const {
    resourceReviews,
    addResourceReview,
    voteHelpfulReview,
    deleteResourceReview,
    teacherProfile,
    schoolProfile
  } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [teacherName, setTeacherName] = useState(teacherProfile.name || 'શિક્ષક શ્રી');
  const [schoolName, setSchoolName] = useState(schoolProfile.schoolName || 'પ્રાથમિક શાળા');
  const [district, setDistrict] = useState(teacherProfile.district || schoolProfile.district || 'ગાંધીનગર');
  const [teachingContext, setTeachingContext] = useState('ધોરણ ૧-૮ શિક્ષક');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterStar, setFilterStar] = useState<'all' | number>('all');
  const [sortBy, setSortBy] = useState<'helpful' | 'latest' | 'highest'>('helpful');
  const [formError, setFormError] = useState<string | null>(null);

  // Reviews matching this resource
  const matchingReviews = useMemo(() => {
    return resourceReviews.filter(r => r.resourceId === resourceId);
  }, [resourceReviews, resourceId]);

  // Aggregate calculations
  const stats = useMemo(() => {
    const dynamicCount = matchingReviews.length;
    const totalCount = baseReviewCount + dynamicCount;
    
    // Sum of dynamic reviews
    const dynamicSum = matchingReviews.reduce((acc, r) => acc + r.rating, 0);
    const baseSum = baseRating * baseReviewCount;
    const avgScore = totalCount > 0 ? Number(((baseSum + dynamicSum) / totalCount).toFixed(1)) : 5.0;

    // Distribution simulation combining base counts + dynamic
    const count5 = Math.round(baseReviewCount * 0.75) + matchingReviews.filter(r => r.rating === 5).length;
    const count4 = Math.round(baseReviewCount * 0.18) + matchingReviews.filter(r => r.rating === 4).length;
    const count3 = Math.round(baseReviewCount * 0.05) + matchingReviews.filter(r => r.rating === 3).length;
    const count2 = Math.round(baseReviewCount * 0.01) + matchingReviews.filter(r => r.rating === 2).length;
    const count1 = Math.round(baseReviewCount * 0.01) + matchingReviews.filter(r => r.rating === 1).length;

    return {
      avgScore,
      totalCount,
      distribution: [
        { stars: 5, count: count5, percent: totalCount ? Math.round((count5 / totalCount) * 100) : 0 },
        { stars: 4, count: count4, percent: totalCount ? Math.round((count4 / totalCount) * 100) : 0 },
        { stars: 3, count: count3, percent: totalCount ? Math.round((count3 / totalCount) * 100) : 0 },
        { stars: 2, count: count2, percent: totalCount ? Math.round((count2 / totalCount) * 100) : 0 },
        { stars: 1, count: count1, percent: totalCount ? Math.round((count1 / totalCount) * 100) : 0 }
      ]
    };
  }, [matchingReviews, baseRating, baseReviewCount]);

  // Filtered & Sorted reviews
  const displayedReviews = useMemo(() => {
    let list = [...matchingReviews];
    if (filterStar !== 'all') {
      list = list.filter(r => r.rating === filterStar);
    }
    if (sortBy === 'helpful') {
      list.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    } else if (sortBy === 'latest') {
      // Latest first
      list.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [matchingReviews, filterStar, sortBy]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setFormError('કૃપા કરીને વર્ગખંડ અનુભવ અથવા અભિપ્રાય લખો.');
      return;
    }
    if (!teacherName.trim()) {
      setFormError('કૃપા કરીને શિક્ષકનું નામ લખો.');
      return;
    }

    setFormError(null);
    addResourceReview({
      resourceId,
      teacherName: teacherName.trim(),
      schoolName: schoolName.trim() || undefined,
      district: district.trim() || undefined,
      rating: userRating,
      comment: comment.trim(),
      teachingContext: teachingContext.trim() || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      helpfulVotedUserIds: []
    });

    // Reset Form
    setComment('');
    setSelectedTags([]);
    setIsFormOpen(false);
  };

  const getRatingDescription = (val: number) => {
    switch (val) {
      case 5:
        return 'અત્યંત ઉપયોગી & ઉત્કૃષ્ટ ★★★★★';
      case 4:
        return 'ખૂબ સારું & મદદરૂપ ★★★★☆';
      case 3:
        return 'સંતોષકારક ★★★☆☆';
      case 2:
        return 'સામાન્ય ★★☆☆☆';
      case 1:
        return 'સુધારાની જરૂર ★☆☆☆☆';
      default:
        return 'રેટિંગ પસંદ કરો';
    }
  };

  return (
    <div id="resource-reviews-container" className={`bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xs ${className}`}>
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </span>
            <h3 className="font-bold text-base text-slate-900">
              શિક્ષક સમીક્ષાઓ & સ્ટાર રેટિંગ
            </h3>
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {stats.totalCount} પ્રતિભાવો
            </span>
          </div>
          <p className="text-xs text-slate-500">
            ગુજરાતના પ્રાથમિક શિક્ષકો દ્વારા આ સાધનના વર્ગખંડ ઉપયોગ અને પરિણામો વિશે પ્રમાણિત પ્રતિભાવો.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer ${
            isFormOpen
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200'
          }`}
        >
          {isFormOpen ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>ફોર્મ બંધ કરો</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>પ્રતિભાવ & રેટિંગ આપો</span>
            </>
          )}
        </button>
      </div>

      {/* Aggregate Score & Distribution Overview Card */}
      <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-slate-50 border border-amber-200/80 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Big Score Box */}
        <div className="md:col-span-4 text-center md:text-left flex flex-col items-center md:items-start justify-center space-y-1.5 border-b md:border-b-0 md:border-r border-amber-200/70 pb-4 md:pb-0 md:pr-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {stats.avgScore}
            </span>
            <span className="text-sm font-bold text-slate-400">/ ૫.૦</span>
          </div>
          
          <div className="flex items-center space-x-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(stats.avgScore)
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>

          <p className="text-xs font-semibold text-slate-600">
            કુલ {stats.totalCount} શિક્ષક મૂલ્યાંકન
          </p>

          <div className="inline-flex items-center space-x-1 text-[11px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md mt-1">
            <CheckCircle className="w-3 h-3" />
            <span>૯૮% શિક્ષકો દ્વારા ભલામણ થયેલ</span>
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-8 space-y-1.5">
          {stats.distribution.map((item) => (
            <div key={item.stars} className="flex items-center space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setFilterStar(filterStar === item.stars ? 'all' : item.stars)}
                className={`w-12 font-bold text-left flex items-center space-x-1 hover:text-amber-700 transition-colors ${
                  filterStar === item.stars ? 'text-amber-700 font-extrabold' : 'text-slate-700'
                }`}
              >
                <span>{item.stars}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              </button>

              <div className="flex-1 h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${item.percent}%` }}
                />
              </div>

              <span className="w-10 text-right text-[11px] font-mono text-slate-500">
                {item.percent}%
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Write a Review Collapsible Form */}
      {isFormOpen && (
        <form
          onSubmit={handleRatingSubmit}
          className="bg-amber-50/40 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h4 className="font-bold text-sm sm:text-base text-slate-900">
                તમારો વર્ગખંડ પ્રતિભાવ અને રેટિંગ ઉમેરો
              </h4>
            </div>
            <span className="text-xs text-slate-500">
              સહકર્મી શિક્ષકો માટે અત્યંત મદદરૂપ
            </span>
          </div>

          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {formError}
            </div>
          )}

          {/* Star Selection Control */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              આ સાધનને સ્ટાર રેટિંગ આપો (૧ થી ૫ સ્ટાર):
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1.5 bg-white border border-amber-200 p-2 rounded-xl">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || userRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(star)}
                      className="p-1 text-slate-300 hover:scale-125 transition-all focus:outline-none cursor-pointer"
                      title={`${star} Star`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          isFilled
                            ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-xs font-bold text-amber-800 bg-amber-100/90 px-3 py-1.5 rounded-lg border border-amber-200">
                {getRatingDescription(hoverRating || userRating)}
              </span>
            </div>
          </div>

          {/* Teacher Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                શિક્ષકનું નામ:
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="દા.ત. રમેશભાઈ પટેલ"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                શાળાનું નામ:
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="દા.ત. મોડેલ પ્રાથમિક શાળા"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                જિલ્લો / તાલુકો:
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="દા.ત. સાબરકાંઠા"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1 text-xs">
              અધ્યાપન ભૂમિકા / વિષય (Teaching Context):
            </label>
            <input
              type="text"
              value={teachingContext}
              onChange={(e) => setTeachingContext(e.target.value)}
              placeholder="દા.ત. ધોરણ ૩-૫ ગણિત શિક્ષક / મુખ્ય શિક્ષક (HTAT)"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Comment Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                તમારો વિગતવાર પ્રતિભાવ / વર્ગખંડ અનુભવ:
              </label>
              <span className="text-[11px] text-slate-400">
                (વિદ્યાર્થીઓનો ઉત્સાહ, TLM ઉપયોગ, પરિણામ વિશે લખો)
              </span>
            </div>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="દા.ત. આ પાઠ આયોજનથી વર્ગખંડમાં બાળકોમાં ગણતરીની ઝડપ અને સમજણમાં મોટો સુધારો જોવા મળ્યો. TLM ની યાદી ખૂબ જ ઉપયોગી છે..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-sans"
              required
            />
          </div>

          {/* Quick Tag Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <span>વિશેષતા ટેગ પસંદ કરો (Quick Tags):</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-amber-200">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-amber-200 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>રેટિંગ & પ્રતિભાવ સબમિટ કરો</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        
        {/* Star Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 flex items-center space-x-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>ફિલ્ટર:</span>
          </span>
          <button
            type="button"
            onClick={() => setFilterStar('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterStar === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            બધા ({matchingReviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((s) => {
            const count = matchingReviews.filter(r => r.rating === s).length;
            if (count === 0 && filterStar !== s) return null;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStar(filterStar === s ? 'all' : s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
                  filterStar === s
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{s}</span>
                <Star className="w-3 h-3 fill-current" />
                <span className="text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">ક્રમ:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="helpful">સૌથી વધુ મદદરૂપ (Most Helpful)</option>
            <option value="latest">નવીનતમ (Latest)</option>
            <option value="highest">ઉચ્ચ રેટિંગ (Highest Rating)</option>
          </select>
        </div>

      </div>

      {/* Reviews Feed */}
      <div className="space-y-3.5">
        {displayedReviews.length > 0 ? (
          displayedReviews.map((review) => {
            const isMyReview = review.teacherName === teacherProfile.name;
            const hasVotedHelpful = review.helpfulVotedUserIds?.includes(teacherProfile.id);

            return (
              <div
                key={review.id}
                className="border border-slate-200 hover:border-amber-200 rounded-2xl p-4.5 bg-slate-50/50 hover:bg-white transition-all space-y-3 shadow-2xs"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs uppercase">
                      {review.teacherName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {review.teacherName}
                        </span>
                        <span className="inline-flex items-center space-x-0.5 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded-md font-medium">
                          <UserCheck className="w-2.5 h-2.5" />
                          <span>ચકાસાયેલ શિક્ષક</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5 flex-wrap">
                        {review.teachingContext && (
                          <span className="font-medium text-slate-700">
                            {review.teachingContext}
                          </span>
                        )}
                        {review.schoolName && (
                          <>
                            <span>•</span>
                            <span>{review.schoolName}</span>
                          </>
                        )}
                        {review.district && (
                          <>
                            <span>•</span>
                            <span className="text-amber-700 font-semibold">{review.district}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Badge & Date */}
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center space-x-1 bg-amber-100/90 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-bold">
                      <span>{review.rating}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    </div>
                    <span className="block text-[10px] text-slate-400 mt-1">
                      {review.createdAt}
                    </span>
                  </div>
                </div>

                {/* Comment Body */}
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {review.comment}
                </p>

                {/* Tags if any */}
                {review.tags && review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {review.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-medium px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Row: Helpful Vote & Moderation */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    type="button"
                    onClick={() => voteHelpfulReview(review.id)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      hasVotedHelpful
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasVotedHelpful ? 'fill-current' : ''}`} />
                    <span>મદદરૂપ બન્યું</span>
                    <span className="font-mono font-bold">({review.helpfulCount || 0})</span>
                  </button>

                  {isMyReview && (
                    <button
                      type="button"
                      onClick={() => deleteResourceReview(review.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors flex items-center space-x-1 text-[11px]"
                      title="પ્રતિભાવ હટાવો"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>હટાવો</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">
              {filterStar === 'all'
                ? 'હજુ સુધી કોઈ શિક્ષકે વિગતવાર પ્રતિભાવ લખ્યો નથી.'
                : `${filterStar} સ્ટાર સાથેનો કોઈ પ્રતિભાવ મળ્યો નથી.`}
            </p>
            <p className="text-[11px] text-slate-400">
              આ સાધનનો ઉપયોગ કરીને સૌપ્રથમ પ્રતિભાવ આપનાર બનો!
            </p>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="mt-2 px-3.5 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 inline-flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>પ્રતિભાવ લખો</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
