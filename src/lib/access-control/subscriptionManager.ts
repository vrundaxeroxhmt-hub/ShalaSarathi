import { SubscriptionTier, SubscriptionTierCode, UserSubscription } from '@/types/subscription';

export const SUBSCRIPTION_TIERS: Record<SubscriptionTierCode, SubscriptionTier> = {
  free: {
    code: 'free',
    nameGuj: 'ફ્રી પ્લાન (Free Teacher)',
    nameEng: 'Free Tier',
    pricePerYear: 0,
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    maxPatraksPerMonth: 5,
    allowedPatrakVersions: ['Version A'],
    featuresGuj: [
      'માસિક ૫ દસ્તાવેજ જનરેશન',
      'માત્ર Version A ફોર્મેટ સપોર્ટ',
      'મૂળભૂત રોજમેળ અને વાઉચર',
      'સ્ટાન્ડર્ડ PDF ડાઉનલોડ'
    ]
  },
  pro_teacher: {
    code: 'pro_teacher',
    nameGuj: 'પ્રો શિક્ષક પ્લાન (Pro Teacher)',
    nameEng: 'Pro Teacher',
    pricePerYear: 499,
    badgeColor: 'bg-brand-100 text-brand-800 border-brand-300 font-semibold',
    maxPatraksPerMonth: 50,
    allowedPatrakVersions: ['Version A', 'Version B'],
    featuresGuj: [
      'માસિક ૫૦ પત્રક/અહેવાલ જનરેશન',
      'Version A અને Version B (પ્રીમિયમ)',
      'ગુજરાતી સ્માર્ટ વોઇસ ઇનપુટ',
      'ઓટોમેટેડ ડેડ સ્ટોક રજિસ્ટર લિંકિંગ',
      'અમર્યાદિત પ્રિન્ટિંગ'
    ]
  },
  acharya_ultra: {
    code: 'acharya_ultra',
    nameGuj: 'આચાર્ય અલ્ટ્રા પ્લાન (Acharya Ultra VIP)',
    nameEng: 'Acharya Ultra',
    pricePerYear: 999,
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    maxPatraksPerMonth: 9999,
    allowedPatrakVersions: ['Version A', 'Version B', 'Version C'],
    featuresGuj: [
      'અનલિમિટેડ તમામ ૭૩ પત્રક અને અહેવાલ',
      'તમામ ફોર્મેટ Version A, B, C અનલોક',
      'આચાર્ય સ્કૂલ સ્ટેમ્પ અને સીલ વોટરમાર્ક',
      'બલ્ક પીડીએફ એક્સપોર્ટ',
      'વીઆઇપી સપોર્ટ અને માસ્ટર ટેમ્પલેટ એડિટિંગ'
    ]
  }
};

export const CURRENT_USER_SUBSCRIPTION: UserSubscription = {
  userId: 'tch_1001',
  tierCode: 'acharya_ultra', // Grant full features in local phase demo
  validUntil: '2027-03-31',
  isTrial: false,
  documentsGeneratedThisMonth: 12
};

export function canAccessVersion(versionCode: 'Version A' | 'Version B' | 'Version C', tierCode: SubscriptionTierCode = CURRENT_USER_SUBSCRIPTION.tierCode): boolean {
  const tier = SUBSCRIPTION_TIERS[tierCode];
  return tier.allowedPatrakVersions.includes(versionCode);
}
