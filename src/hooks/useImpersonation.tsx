import { identityService } from '@services/identity.service';
import { getAuthSession } from '@stores/authStore';
import { notify } from '@stores/notifyStore';
import { envWindowReplaceCallback } from '@utils/envWindowReplaceCallback';

/*
 !Important Impersonation Details from the API:
  * you cannot impersonate yourself
  * you cannot impersonate someone that has a ys-admin role
  * you cannot impersonate if you are already impersonating
  * you cannot impersonate someone that doesn’t have an access record to match your current access
  * your currentAccess must be admin or staff to impersonate.
*/

export const useImpersonation = () => {
  const canImpersonate = (userId: string) => {
    const authSession = getAuthSession();

    // fetch user to see if they have access or if they're a ys-admin
    if (userId === authSession?.userData?.userId) return false;

    if (['Admin', 'Staff'].includes(authSession?.currentAccess?.role ?? 'Learner')) {
      return true;
    }

    return false;
  };

  const beginImpersonation = async (userId: string) => {
    try {
      const response = await identityService.beginImpersonation(userId);

      if (response) {
        envWindowReplaceCallback(`https://brightpath.youscience.com/home`);
      }
    } catch (error) {
      notify({ message: 'An error occurred while attempting to impersonate this user', severity: 'error' });
    }
  };

  const redirectUser = (userId?: string) => {
    const url = `${window.location.protocol}//${window.location.host}/users/`;

    if (userId) url.concat(userId);

    window.location.assign(`${window.location.protocol}//${window.location.host}/users/${userId}`);
  };

  const removeImpersonation = async () => {
    const authSession = getAuthSession();

    try {
      const response = await identityService.removeImpersonation();

      if (response) {
        redirectUser(authSession?.userData?.userId);
      }
    } catch (error) {
      notify({ message: 'There was an error ending your impersonation', severity: 'error' });
    }
  };

  const checkYsAdminImpersonating = () => {
    const authSession = getAuthSession();
    const isYsAdminImpersonating =
      authSession?.impersonatedBy?.access[0]?.tenant?.tenantId === import.meta.env.VITE_ROOT_ORG_ID;
    const routePath = isYsAdminImpersonating ? '/users' : '/impersonating';

    return { isYsAdminImpersonating, routePath };
  };

  return {
    beginImpersonation,
    canImpersonate,
    removeImpersonation,
    checkYsAdminImpersonating,
  };
};
