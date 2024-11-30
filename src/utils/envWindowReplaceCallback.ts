import { DEV_MODE } from '@constants/env';

export const envWindowReplaceCallback = (url: string) => {
  // Return if the url includes seamless since we don't need to format it
  if (url.includes('seamless')) return window.location.assign(url);
  // return if the URL already includes the dev environment
  if (url.includes(`.${DEV_MODE}.`)) return window.location.assign(url);

  const productPath =
    DEV_MODE !== 'prod'
      ? url
          .split('.')
          .map((p, i) => (i === 0 ? `${p}.${DEV_MODE}` : p))
          .join('.')
      : url;

  return window.location.assign(productPath);
};
