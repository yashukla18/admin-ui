import { FC, lazy, useLayoutEffect, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AccessRoleEnum } from '@youscience/user-service-common';
import { ROLES_WITH_ACCESS_TO_ADMIN_UI } from '@constants/accesses';
import { useImpersonation } from '@hooks/useImpersonation';
import UnauthorizedLayout from '@layouts/UnauthorizedLayout';
import { CircularProgress } from '@mui/material';
// lazy components
const ProfileLayout = lazy(() => import('@layouts/ProfileLayout'));
const AdminLayout = lazy(() => import('@layouts/AdminLayout'));

export const DetermineLayout: FC<{ access: AccessRoleEnum; isImpersonated: boolean }> = ({
  access,
  isImpersonated,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const path = pathname?.split('/')[1];

  const impersonating = pathname?.includes('impersonating') || pathname?.includes('no-impersonation-allowed');
  const userIsImpersonated = isImpersonated || impersonating;

  const { checkYsAdminImpersonating } = useImpersonation();
  const { isYsAdminImpersonating, routePath } = checkYsAdminImpersonating();

  useLayoutEffect(() => {
    if (userIsImpersonated) {
      return navigate(pathname?.includes('no-impersonation-allowed') ? '/no-impersonation-allowed' : routePath, {
        replace: true,
      });
    }

    if (!userIsImpersonated && ROLES_WITH_ACCESS_TO_ADMIN_UI.includes(access) && !path) {
      return navigate('/users', { replace: true });
    }

    if (!ROLES_WITH_ACCESS_TO_ADMIN_UI.includes(access)) return navigate('/not-found', { replace: true });

    return navigate(pathname);
  }, [access]);

  if (ROLES_WITH_ACCESS_TO_ADMIN_UI.includes(access) && (!userIsImpersonated || isYsAdminImpersonating)) {
    return (
      <Suspense
        fallback={
          <UnauthorizedLayout>
            <CircularProgress size={60} />
          </UnauthorizedLayout>
        }
      >
        <AdminLayout />
      </Suspense>
    );
  }

  if (!ROLES_WITH_ACCESS_TO_ADMIN_UI.includes(access) || userIsImpersonated) {
    return (
      <Suspense
        fallback={
          <UnauthorizedLayout>
            <CircularProgress size={60} />
          </UnauthorizedLayout>
        }
      >
        <ProfileLayout />
      </Suspense>
    );
  }

  return (
    <UnauthorizedLayout>
      <CircularProgress size={60} />
    </UnauthorizedLayout>
  );
};
