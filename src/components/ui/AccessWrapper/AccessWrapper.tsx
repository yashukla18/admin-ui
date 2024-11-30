/* eslint-disable react/jsx-no-useless-fragment */
import { FC, ReactNode } from 'react';
import { useAuthStore } from '@stores/authStore';
import { ALLOWED_ROLES } from './constants';

export const AccessWrapper: FC<{
  children: ReactNode;
  allowedRoles: string[];
  restrictOrg?: boolean;
}> = ({ children, allowedRoles, restrictOrg = false }) => {
  const currentAccess = useAuthStore((state) => state.authSession.currentAccess);
  const rolesToShow = [...ALLOWED_ROLES, ...allowedRoles];

  if (restrictOrg) {
    return currentAccess?.tenantId === import.meta.env.VITE_ROOT_ORG_ID && currentAccess.role === 'Admin'
      ? children
      : null;
  }

  return rolesToShow.includes(currentAccess?.role ?? 'Learner') ? children : null;
};
