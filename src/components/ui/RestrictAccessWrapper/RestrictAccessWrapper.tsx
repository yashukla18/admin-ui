/* eslint-disable react/jsx-no-useless-fragment */
import { FC, ReactNode } from 'react';
import { useAuthStore } from '@stores/authStore';
import { ALLOWED_ROLES } from './constants';

export const RestrictAccessWrapper: FC<{
  allowedRoles: string[];
  children: ReactNode;
  hidden?: boolean;
  directTenantAccess?: boolean;
  rootAdminOnly?: boolean;
}> = ({ children, allowedRoles, directTenantAccess = false, rootAdminOnly = false, hidden = false }) => {
  const { currentAccess, userData } = useAuthStore((state) => state.authSession);

  if (hidden) return null;
  const rootTenantId = import.meta.env.VITE_ROOT_ORG_ID;

  const rolesToShow = [...ALLOWED_ROLES, ...allowedRoles];

  const hasRootAdminAccess = currentAccess?.tenantId === rootTenantId && currentAccess.role === 'Admin';
  
  // This is the case for discovery where not all RootAdmins are considered, the user has to have direct access to the tenant
  if (directTenantAccess) {
    if (rootAdminOnly && hasRootAdminAccess) {
      return children;
    }
    let hasDirectTenantAccess = false;

    userData?.access.forEach((record) => {
      if (record.tenant.tenantId !== rootTenantId) {
        if (record.tenant?.tenantId === currentAccess.tenantId) {
          hasDirectTenantAccess = true;
        }
      }
    });

    return hasDirectTenantAccess && rolesToShow.includes(currentAccess?.role ?? 'Learner') ? children : null;
  }

  if (rootAdminOnly) {
    return hasRootAdminAccess ? children : null;
  }

  return rolesToShow.includes(currentAccess?.role ?? 'Learner') ? children : null;
};
