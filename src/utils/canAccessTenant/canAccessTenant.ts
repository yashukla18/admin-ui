import { getCurrentAccess } from '@stores/authStore';
import { AccessDocument } from '@youscience/user-service-common';
import { availableRolesByAccess } from './availableRolesByAccess';
import { getRoleDetails } from './getRoleDetails';

export const canAccessTenant = (access?: AccessDocument, excludeRootAdmin?: boolean) => {
  const currentAccess = getCurrentAccess();
  const ACCESS_ROLES = availableRolesByAccess(currentAccess);
  const { isRootAdmin, rootTenantId, isOrgAdmin, isStaff } = getRoleDetails(currentAccess);
  const accessRole = access?.tenant?.permission?.role ?? '';

  if (!access) {
    return false;
  }

  if (isRootAdmin && !excludeRootAdmin) {
    return true;
  }

  if (isOrgAdmin && ACCESS_ROLES.includes(accessRole) && access?.tenant.tenantId !== rootTenantId) {
    return true;
  }

  if (isStaff && ACCESS_ROLES.includes(accessRole)) {
    return true;
  }

  return false;
};
