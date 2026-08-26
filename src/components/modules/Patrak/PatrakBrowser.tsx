import React, { useState } from 'react';
import { Search, Star, Crown, Filter, CheckCircle2, FileSpreadsheet, ArrowRight, Sparkles } from 'lucide-react';
import { PatrakTemplate } from '@/types/patrak';

interface Props {
  templates: PatrakTemplate[];
  onSelectTemplate: (template: PatrakTemplate) => void;
  onToggleFavorite: (id: string) => void;
}

export const PatrakBrowser: React.FC<Props> = ({ templates, onSelectTemplate, onToggleFavorite }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const categories = [
    'All',
    'Gunotsav',
    'NIPUN Bharat',
    'SCE Evaluation',
    'School Administration',
    'Mid-day Meal'
  ];

  const filtered = templates.filter(t => {
    const matchesSearch = 
      t.titleGuj.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.patrakNumber.toString().includes(searchQuery) ||
      t.descriptionGuj.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesFavorite = !showOnlyFavorites || t.isFavorite;

    return matchesSearch && matchesCategory && matchesFavorite;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Search & Filter Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="પત્રક નંબર, શીર્ષક અથવા વિગત શોધો..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Favorites Filter Toggle */}
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              showOnlyFavorites
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-slate-950' : 'text-amber-500'}`} />
            <span>મનપસંદ પત્રકો (Favorites)</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs font-bold">
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            const labelGuj = cat === 'All' ? 'બધા ૭૩ પત્રક' : cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {labelGuj}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>કુલ {filtered.length} પત્રકો દર્શાવાયેલ છે</span>
        <span className="text-slate-400">૭૩ પત્રક ટેમ્પ્લેટ એન્જિન</span>
      </div>

      {/* Grid of Patrak Cards (1 to 73) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(tmpl => (
          <div
            key={tmpl.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-brand-600 text-white px-2.5 py-0.5 rounded-lg shadow-sm">
                    પત્રક {tmpl.patrakNumber}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                    {tmpl.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {tmpl.isPremium && (
                    <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold px-2 py-0.5 rounded border border-amber-300 flex items-center gap-0.5">
                      <Crown className="w-3 h-3 text-amber-600" />
                      <span>PRO</span>
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(tmpl.id);
                    }}
                    className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${tmpl.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-brand-600 transition-colors">
                  {tmpl.titleGuj}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-medium">
                  {tmpl.descriptionGuj}
                </p>
              </div>

              {/* Available Versions Pill */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold bg-slate-50 p-2 rounded-xl border border-slate-100">
                <Sparkles className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span>૩ ફોર્મેટ વર્ઝન (A, B, C) ઉપલબ્ધ</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onSelectTemplate(tmpl)}
              className="w-full bg-slate-900 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl text-xs shadow flex items-center justify-center gap-2 transition-all"
            >
              <span>પત્રક બનાવો (Open Editor)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
