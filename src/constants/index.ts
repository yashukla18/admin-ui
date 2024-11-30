export const REDIRECT_URL_KEY = 'redirectUrl';
export const ENTER = 'Enter';
export const MAIN_LOGO_PATH = '/img/logo/YouScience.png';
export const MAIN_EMBLEM_PATH = '/img/logo/YouScienceEmblem.png';

export const US = 'US';

export const CSV_TEMPLATE_LINK = 'https://gus-dev-csv-tempate.s3.amazonaws.com/BrightpathBulkUploadTemplateV1.2.xlsx';
export const UTAH_CSV_TEMPLATE_LINK =
  'https://gus-dev-csv-tempate.s3.amazonaws.com/BrightpathBulkUploadUtahTemplateV1.2.xlsx';

export const ALLOWED_ROLES = ['Admin', 'Staff'];
export const ACCESS_ROLES = ['Admin', 'Author', 'Learner', 'Proctor', 'Reviewer', 'Staff'] as const;
export const GENDER_OPTIONS = ['male', 'female', 'non-binary', 'prefer not to disclose'];
// forms
export const phoneRegex = /^\+\d{1,4} (\d{1,4}-)+(\d{1,9})$/;

export const postCodeExp = /^\d{5}(-\d{4})?$/;

export const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i;

export const linkedInRegex = /http.*:/;

// All other
export * from './states.constants';
