import { PreferredAccess } from '@interfaces';
import { authService } from '@services/auth.api.service';
import { identityService } from '@services/identity.service';
import { getAuthSession, resetAuthSession } from '@stores/authStore';
import { notify } from '@stores/notifyStore';
import { AxiosError } from 'axios';
import { APP_BAR_HEIGHT } from '@youscience/brightpath-header';
import { ALLOWED_ROLES } from '@constants';
import { envWindowReplaceCallback } from '@utils/envWindowReplaceCallback';

export const DRAWER_HEADER_HEIGHT = APP_BAR_HEIGHT - 8; // padding for top
export const NAV_DRAWER_WIDTH = 230;

export const handleRefreshToken = () => {
  identityService
    .refreshToken()
    .then(() => {
      notify({ message: 'Your access has been updated', severity: 'success' });
      resetAuthSession();
    })
    .catch((error: AxiosError) => {
      if (error.status === 401 || error.status === 403) return;
      notify({ message: 'There was an error updating your access', severity: 'error' });
      window.location.assign(`${window.location.protocol}//${window.location.host}/`);
    });
};

export const handleTenantSelectCallback = (preferredAccessId: string) => {
  const authSession = getAuthSession();

  const preferences = {
    currentAccess: preferredAccessId,
  } as unknown as PreferredAccess;

  authService
    .updateUserPreferences(preferences)
    .then((preferredAccess) => {
      if (preferredAccess) {
        const availableAccess = authSession?.userData?.access.find(
          (access) => access._id === (preferredAccessId as unknown),
        );

        if (availableAccess && ALLOWED_ROLES.includes(availableAccess?.tenant?.permission?.role ?? 'Learner')) {
          return handleRefreshToken();
        }
      }

      return envWindowReplaceCallback(`https://brightpath.youscience.com/home`);
    })
    .catch((err) => {
      envWindowReplaceCallback(`https://brightpath.youscience.com/home`);
      // eslint-disable-next-line no-console
      console.log(err);
    });
};
