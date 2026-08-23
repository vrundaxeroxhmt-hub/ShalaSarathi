import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TeacherStory } from '../../types';
import { Plus, Heart, X, ChevronLeft, ChevronRight, Sparkles, School, Check, User } from 'lucide-react';

export const StoriesBar: React.FC = () => {
  const { teacherStories, addTeacherStory, likeTeacherStory, teacherProfile, schoolProfile } = useApp();
  
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [selectedGradient, setSelectedGradient] = useState('from-amber-500 via-rose-500 to-purple-600');
  const [storyProgress, setStoryProgress] = useState(0);

  const gradients = [
    { label: 'Sunset Glow', class: 'from-amber-500 via-rose-500 to-purple-600' },
    { label: 'Emerald Forest', class: 'from-emerald-600 via-teal-600 to-cyan-600' },
    { label: 'Ocean Breeze', class: 'from-blue-600 via-indigo-600 to-purple-700' },
    { label: 'Royal Purple', class: 'from-purple-600 via-pink-600 to-rose-500' },
    { label: 'Golden Sun', class: 'from-amber-600 via-orange-500 to-red-600' }
  ];

  // Auto-progress timer for active story
  useEffect(() => {
    if (activeStoryIndex === null) {
      setStoryProgress(0);
      return;
    }

    setStoryProgress(0);
    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          if (activeStoryIndex < teacherStories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, teacherStories.length]);

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTeacherStory({
      teacherName: teacherProfile.name || 'શિક્ષક મિત્ર',
      teacherRole: teacherProfile.role || 'પ્રાથમિક શિક્ષક',
      teacherSchool: schoolProfile.schoolName || 'શ્રી પ્રાથમિક શાળા',
      teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: newTitle.trim(),
      caption: newCaption.trim(),
      bgGradient: selectedGradient,
      isSeen: false
    });

    setNewTitle('');
    setNewCaption('');
    setIsCreatingStory(false);
  };

  const currentStory = activeStoryIndex !== null ? teacherStories[activeStoryIndex] : null;

  return (
    <>
      {/* Stories Horizontal Reel Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center space-x-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
          
          {/* Add Story Button (Self) */}
          <button
            type="button"
            onClick={() => setIsCreatingStory(true)}
            className="flex flex-col items-center space-y-1.5 shrink-0 group focus:outline-hidden"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-dashed border-amber-400 p-0.5 flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-amber-700">
                  <User className="w-7 h-7" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs border-2 border-white">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-800 text-center truncate max-w-[72px]">
              તમારી સ્ટોરી
            </span>
          </button>

          {/* Teacher Stories List */}
          {teacherStories.map((story, idx) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setActiveStoryIndex(idx)}
              className="flex flex-col items-center space-y-1.5 shrink-0 group focus:outline-hidden"
            >
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 group-hover:scale-105 transition-transform shadow-xs">
                <div className="p-0.5 bg-white rounded-full">
                  <img
                    src={story.teacherAvatar}
                    alt={story.teacherName}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-700 text-center truncate max-w-[76px]">
                {story.teacherName.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal (Instagram Style) */}
      {activeStoryIndex !== null && currentStory && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          
          {/* Close Story Button */}
          <button
            type="button"
            onClick={() => setActiveStoryIndex(null)}
            className="absolute top-4 right-4 z-50 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Story Navigation */}
          {activeStoryIndex > 0 && (
            <button
              type="button"
              onClick={() => setActiveStoryIndex(activeStoryIndex - 1)}
              className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Next Story Navigation */}
          {activeStoryIndex < teacherStories.length - 1 && (
            <button
              type="button"
              onClick={() => setActiveStoryIndex(activeStoryIndex + 1)}
              className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Main Story Phone Card */}
          <div 
            className={`relative w-full max-w-sm h-[580px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 bg-gradient-to-br animate-in fade-in zoom-in duration-200 ${currentStory.bgGradient || 'from-purple-700 via-pink-600 to-amber-600'}`}
          >
            
            {/* Story Top Header with Segments */}
            <div className="space-y-3 z-10">
              {/* Progress bars */}
              <div className="flex items-center space-x-1.5 w-full">
                {teacherStories.map((_, i) => (
                  <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-100 ease-linear"
                      style={{
                        width: i === activeStoryIndex ? `${storyProgress}%` : i < activeStoryIndex ? '100%' : '0%'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Teacher Info */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={currentStory.teacherAvatar}
                    alt={currentStory.teacherName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm leading-tight flex items-center gap-1">
                      {currentStory.teacherName}
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    </h4>
                    <p className="text-[11px] text-white/80 flex items-center gap-1">
                      <School className="w-3 h-3" /> {currentStory.teacherSchool}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full text-white/90">
                  {currentStory.timestamp}
                </span>
              </div>
            </div>

            {/* Story Center Content */}
            <div className="my-auto text-center space-y-4 py-8 z-10">
              <div className="inline-block p-3 rounded-2xl bg-white/20 backdrop-blur-md text-white mb-2 shadow-sm">
                <Sparkles className="w-8 h-8 mx-auto text-amber-300 animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-white leading-snug drop-shadow-md">
                {currentStory.title}
              </h2>
              {currentStory.caption && (
                <p className="text-sm font-medium text-white/95 leading-relaxed bg-black/25 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
                  {currentStory.caption}
                </p>
              )}
            </div>

            {/* Story Bottom Actions */}
            <div className="z-10 flex items-center justify-between gap-3 pt-2">
              <div className="flex-1 bg-white/20 backdrop-blur-md rounded-full px-4 py-2.5 text-white/80 text-xs border border-white/20">
                પ્રતિભાવ મોકલો...
              </div>
              <button
                type="button"
                onClick={() => likeTeacherStory(currentStory.id)}
                className={`p-3 rounded-full backdrop-blur-md transition-transform active:scale-125 ${
                  currentStory.isLiked 
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-5 h-5 ${currentStory.isLiked ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Story Modal */}
      {isCreatingStory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-base text-slate-900">નવી સ્ટોરી ઉમેરો (૨૪ કલાક)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingStory(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStory} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">સ્ટોરી શીર્ષક / હેડલાઇન *</label>
                <input
                  type="text"
                  required
                  placeholder="દા.ત. આજનો બાળમેળો / પ્રયોગ પ્રદર્શન"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">વિગત / કેપ્શન</label>
                <textarea
                  rows={3}
                  placeholder="તમારા વર્ગખંડની કોઈ વિશેષ પ્રવૃત્તિ અથવા સિદ્ધિ..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 font-medium resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">બેકગ્રાઉન્ડ કલર થીમ પસંદ કરો</label>
                <div className="grid grid-cols-5 gap-2">
                  {gradients.map((g) => (
                    <button
                      key={g.label}
                      type="button"
                      onClick={() => setSelectedGradient(g.class)}
                      className={`h-10 rounded-xl bg-gradient-to-br ${g.class} flex items-center justify-center transition-transform ${
                        selectedGradient === g.class ? 'ring-2 ring-offset-2 ring-amber-500 scale-105' : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      {selectedGradient === g.class && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingStory(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white font-bold shadow-xs hover:opacity-95"
                >
                  સ્ટોરી પબ્લિશ કરો ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
