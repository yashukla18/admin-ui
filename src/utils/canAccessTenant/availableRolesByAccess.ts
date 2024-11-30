import { ORG_ADMIN_ROLE_CONTROLS, ROOT_ADMIN_ROLE_CONTROLS, STAFF_ROLE_CONTROLS } from '@constants/accesses';
import { CurrentAccess } from '@interfaces/user';

export const availableRolesByAccess = (currentAccess?: CurrentAccess) => {
  if (currentAccess?.role === 'Admin' && process.env.VITE_ROOT_ORG_ID === currentAccess?.tenantId) {
    return ROOT_ADMIN_ROLE_CONTROLS;
  }

  if (currentAccess?.role === 'Admin') {
    return ORG_ADMIN_ROLE_CONTROLS;
  }

  if (currentAccess?.role === 'Staff') {
    return STAFF_ROLE_CONTROLS;
  }
  // defult return lowest available admin-ui available role controls
  return STAFF_ROLE_CONTROLS;
};
