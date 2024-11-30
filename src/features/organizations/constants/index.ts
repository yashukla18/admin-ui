export const SUBSCRIPTION_KEY = 'productAvailability';

export const SUBSCRIPTION_NAMES = {
  discovery: 'Discovery',
  certs: 'Certifications',
  wbe: 'WBE',
  careerConn: 'Employer Connections',
  edConn: 'Education Connections',
  insights: 'Insights',
  ecp: 'Education and Career Planning',
};

export type SubscriptionKeys = keyof typeof SUBSCRIPTION_NAMES;

export interface ProductAvailability {
  discovery?: boolean;
  certs?: boolean;
  wbe?: boolean;
  careerConn?: boolean;
  edConn?: boolean;
  insights?: boolean;
  ecp?: boolean;
}

export interface OrgSubscriptionValues {
  productAvailability: ProductAvailability;
}

export const ncesIdLengths: Record<string, number> = {
  government: 2,
  district: 7,
  charterSchool: 12,
  publicMiddleSchool: 12,
  publicHighSchool: 12,
  privateMiddleSchool: 8,
  privateHighSchool: 8,
};
