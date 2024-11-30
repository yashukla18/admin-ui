import { tenantService } from '@services/tenant.service';
import { LoaderFunctionArgs, defer } from 'react-router-dom';
import { getAuthSession, getMeCallback } from '@stores/authStore';
import { AccessDocument } from '@youscience/user-service-common';
import { AxiosResponse } from 'axios';
import { apiGetUserAccess } from '../services/UserService';

export async function loader({ params }: LoaderFunctionArgs) {
  const { userId = '0' } = params;
  const authSession = getAuthSession();

  if (authSession?.isAuthenticated) {
    return defer({
      details: await tenantService.getUserById(userId),
      access: (await apiGetUserAccess(userId)) as AxiosResponse<AccessDocument[]>,
    });
  }

  /*
   * If the user is not yet authenticated, we need to wait for them to be authenticated to prevent the loader from failing
   * via url pre-fetch. This is mainly necessary when redirecting the impersonating user back to the user details page
   * after ending impersonation. Prior to this fix, the endpoint would fail with a 403 error returned from the user-service
   * due to the impersonating user not having access to admin endpoints, or the user wouldn't be instantiated prior to sending
   * the request. We may need to implement a more robust solution in the future, but this should suffice for now.
   */
  await getMeCallback();

  return defer({
    details: await tenantService.getUserById(userId),
    access: (await apiGetUserAccess(userId)) as AxiosResponse<AccessDocument[]>,
  });
}
