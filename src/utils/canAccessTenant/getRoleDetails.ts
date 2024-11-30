import { CurrentAccess } from '@interfaces/user';

export const getRoleDetails = (currentAccess?: CurrentAccess) => {
  const rootTenantId = import.meta.env.VITE_ROOT_ORG_ID;
  const isOrgAdmin = currentAccess && currentAccess.role === 'Admin';
  const isRootAdmin = isOrgAdmin && currentAccess.tenantId === rootTenantId;
  const isStaff = currentAccess && currentAccess.role === 'Staff';

  return {
    rootTenantId,
    isOrgAdmin,
    isRootAdmin,
    isStaff,
  };
};
