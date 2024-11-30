const DEV_ENVIRONMENTS = {
  dev: 'dev',
  development: 'dev',
  prod: 'prod',
  production: 'prod',
  sandbox: 'sandbox',
  stage: 'stage',
} as const;

export type DevMode = { [K in keyof typeof DEV_ENVIRONMENTS]: (typeof DEV_ENVIRONMENTS)[K] };

export const DEV_MODE = DEV_ENVIRONMENTS[import.meta.env.VITE_NODE_ENV as keyof DevMode];

export const ALLOWED_REDIRECT_URLS = [
  'http://local.dev.youscience.com:3000',
  'http://wbe.seamlesswbl.com',
  'https://admin.youscience.com',
  'https://apps.youscience.com',
  'https://authoring.youscience.com',
  'https://beta.seamlesswbl.com',
  'https://brightpath.youscience.com',
  'https://certifications.youscience.com',
  'https://certs.youscience.com',
  'https://collegesandprograms.youscience.com',
  'https://dev.seamlesswbl.com',
  'https://dev.youscience.com',
  'https://gus.youscience.com:3000',
  'https://gus.youscience.com',
  'https://insights.youscience.com',
  'https://login.youscience.com/sign_in',
  'https://user-service.youscience.com',
  'https://signin.youscience.com',
  'https://wbe.youscience.com',
  'https://wbe.seamlesswbl.com',
] as const;

export type AllowedRedirectUrl = (typeof ALLOWED_REDIRECT_URLS)[number];
