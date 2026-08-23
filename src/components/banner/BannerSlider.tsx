import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AppBanner, NavTab, SubFeature } from '../../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  Pause, 
  Play
} from 'lucide-react';

export const BannerSlider: React.FC = () => {
  const { 
    banners, 
    setActiveTab, 
    setActiveSubFeature
  } = useApp();

  const activeBanners = banners
    .filter(b => b.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep index in bounds if activeBanners length changes
  useEffect(() => {
    if (currentIndex >= activeBanners.length && activeBanners.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeBanners.length, currentIndex]);

  // Auto slide interval
  useEffect(() => {
    if (isPaused || activeBanners.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeBanners.length, isPaused, currentIndex]);

  const handlePrev = () => {
    if (activeBanners.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    if (activeBanners.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % activeBanners.length);
  };

  const handleAction = (banner: AppBanner) => {
    if (!banner.ctaTarget) return;

    if (banner.ctaLinkType === 'external') {
      window.open(banner.ctaTarget, '_blank', 'noopener,noreferrer');
      return;
    }

    if (banner.ctaLinkType === 'tab') {
      setActiveTab(banner.ctaTarget as NavTab);
      return;
    }

    if (banner.ctaLinkType === 'subfeature') {
      const sub = banner.ctaTarget as SubFeature;
      // Map to correct parent tab
      if (['lesson-planning', 'question-paper'].includes(sub)) {
        setActiveTab('create');
        setActiveSubFeature(sub);
      } else if (['saved-resources', 'saved-vouchers'].includes(sub)) {
        setActiveTab('my-work');
        setActiveSubFeature(sub);
      } else {
        setActiveTab('work-assistant');
        setActiveSubFeature(sub);
      }
    }
  };

  // Badge color mapping
  const getBadgeStyle = (color?: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30';
      case 'blue':
        return 'bg-blue-500/20 text-blue-100 border-blue-400/30';
      case 'rose':
        return 'bg-rose-500/20 text-rose-100 border-rose-400/30';
      case 'purple':
        return 'bg-purple-500/20 text-purple-100 border-purple-400/30';
      case 'indigo':
        return 'bg-indigo-500/20 text-indigo-100 border-indigo-400/30';
      case 'orange':
        return 'bg-orange-500/20 text-orange-100 border-orange-400/30';
      case 'amber':
      default:
        return 'bg-amber-500/20 text-amber-100 border-amber-400/30';
    }
  };

  // If no active banners exist
  if (activeBanners.length === 0) {
    return null;
  }

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  return (
    <div 
      className="relative rounded-3xl overflow-hidden shadow-lg group select-none transition-all duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      id="main-banner-slider"
    >
      {/* Background container */}
      <div 
        className={`relative min-h-[230px] sm:min-h-[250px] md:min-h-[260px] p-6 sm:p-8 flex flex-col justify-between text-white bg-gradient-to-r ${currentBanner.bgGradient || 'from-amber-600 via-orange-600 to-red-600'} transition-all duration-700 ease-out`}
        style={currentBanner.imageUrl ? {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.7)), url(${currentBanner.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : undefined}
      >
        {/* Subtle background watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center font-black text-9xl pointer-events-none select-none">
          શાળા
        </div>

        {/* Top bar: Badge & Slider counter */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {currentBanner.badgeText && (
              <span className={`inline-flex items-center space-x-1.5 backdrop-blur-md border px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs ${getBadgeStyle(currentBanner.badgeColor)}`}>
                <Sparkles className="w-3 h-3" />
                <span>{currentBanner.badgeText}</span>
              </span>
            )}
          </div>

          <span className="bg-black/25 backdrop-blur-xs text-white/80 text-[11px] px-2.5 py-0.5 rounded-full font-mono">
            {currentIndex + 1} / {activeBanners.length}
          </span>
        </div>

        {/* Middle content: Title & Subtitle */}
        <div className="relative z-10 max-w-3xl my-3 sm:my-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight drop-shadow-xs">
            {currentBanner.title}
          </h2>
          {currentBanner.subtitle && (
            <p className="text-white/90 text-xs sm:text-sm md:text-base mt-2 font-normal leading-relaxed line-clamp-2 max-w-2xl">
              {currentBanner.subtitle}
            </p>
          )}
        </div>

        {/* Bottom bar: CTA action button + Carousel navigation dots & arrows */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* CTA Button */}
          {currentBanner.ctaText ? (
            <button
              type="button"
              onClick={() => handleAction(currentBanner)}
              className="inline-flex items-center space-x-2 bg-white text-slate-900 hover:bg-amber-50 active:scale-95 font-bold text-xs sm:text-sm px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl shadow-md transition-all hover:shadow-lg group/cta"
              id="banner-cta-button"
            >
              <span>{currentBanner.ctaText}</span>
              {currentBanner.ctaLinkType === 'external' ? (
                <ExternalLink className="w-4 h-4 text-slate-700 group-hover/cta:translate-x-0.5 transition-transform" />
              ) : (
                <ArrowRight className="w-4 h-4 text-amber-600 group-hover/cta:translate-x-1 transition-transform" />
              )}
            </button>
          ) : (
            <div />
          )}

          {/* Slider controls: Prev/Next & Dots */}
          <div className="flex items-center space-x-2">
            {/* Play / Pause toggle */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
              title={isPaused ? "સ્લાઇડ ચાલુ કરો" : "સ્લાઇડ થોભાવો"}
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </button>

            {/* Navigation Dots */}
            <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full bg-black/20 backdrop-blur-xs">
              {activeBanners.map((banner, idx) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-6 bg-white shadow-xs'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  title={`બેનર ${idx + 1}: ${banner.title}`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 active:scale-95 text-white flex items-center justify-center transition-all backdrop-blur-xs"
              aria-label="Previous Slide"
              title="પાછલું બેનર"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 active:scale-95 text-white flex items-center justify-center transition-all backdrop-blur-xs"
              aria-label="Next Slide"
              title="આગલું બેનર"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
