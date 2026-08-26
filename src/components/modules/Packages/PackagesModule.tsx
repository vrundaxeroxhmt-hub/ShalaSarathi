import React from 'react';
import { Crown, Check, Sparkles, Shield, Zap } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '@/lib/access-control/subscriptionManager';

export const PackagesModule: React.FC = () => {
  const tiers = [
    SUBSCRIPTION_TIERS.free,
    SUBSCRIPTION_TIERS.pro_teacher,
    SUBSCRIPTION_TIERS.acharya_ultra,
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto font-sans space-y-8">
      {/* Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-300">
          <Crown className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>શાળા સારથિ v2 સબ્સ્ક્રિપ્શન પ્લાન</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          ગુજરાતના શિક્ષકો અને આચાર્યો માટે સ્પેશિયલ પ્લાન્સ
        </h1>
        <p className="text-sm text-slate-500">
          કોઈપણ છૂપી ફી વગર અમર્યાદિત દસ્તાવેજ, ગુણોત્સવ ૭૩ પત્રક અને ગુજરાતી વોઇસ સપોર્ટ મેળવો.
        </p>
      </div>

      {/* Tier Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const isFeatured = tier.code === 'acharya_ultra';
          return (
            <div
              key={tier.code}
              className={`bg-white rounded-3xl p-6 border-2 transition-all flex flex-col justify-between relative shadow-lg ${
                isFeatured
                  ? 'border-amber-400 ring-4 ring-amber-400/20 shadow-amber-500/10 scale-105 z-10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[10px] px-4 py-1 rounded-full uppercase tracking-wider shadow">
                  ★ સૌથી વધુ લોકપ્રિય (Most Popular)
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className={`inline-block text-xs px-2.5 py-1 rounded-lg border ${tier.badgeColor}`}>
                    {tier.nameGuj}
                  </div>
                  <div className="text-3xl font-black text-slate-900 pt-2">
                    {tier.pricePerYear === 0 ? 'ફ્રી (Free)' : `₹${tier.pricePerYear}`}
                    {tier.pricePerYear > 0 && <span className="text-xs font-normal text-slate-500"> / વર્ષ</span>}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2.5">
                  {tier.featuresGuj.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                      <div className="p-0.5 rounded bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  className={`w-full py-3 rounded-xl font-bold text-xs shadow transition-all ${
                    isFeatured
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isFeatured ? 'VIP એક્ટિવેટ કરો' : 'પ્લાન પસંદ કરો'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
