export type SubscriptionTierCode = 'free' | 'pro_teacher' | 'acharya_ultra';

export interface SubscriptionTier {
  code: SubscriptionTierCode;
  nameGuj: string;
  nameEng: string;
  pricePerYear: number;
  badgeColor: string;
  maxPatraksPerMonth: number;
  allowedPatrakVersions: ('Version A' | 'Version B' | 'Version C')[];
  featuresGuj: string[];
}

export interface UserSubscription {
  userId: string;
  tierCode: SubscriptionTierCode;
  validUntil: string;
  isTrial: boolean;
  documentsGeneratedThisMonth: number;
}
