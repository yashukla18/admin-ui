import { getCurrentAccess } from '@stores/authStore';
import {
  EMPLOYER_ADMIN_FILTER_BY_ROLE,
  EMPLOYER_STAFF_FILTER_BY_ROLE,
  ORG_ADMIN_FILTER_BY_ROLE,
  ORG_ADMIN_ROLE_CONTROLS,
  ROOT_ADMIN_FILTER_BY_ROLE,
  ROOT_ADMIN_ROLE_CONTROLS,
  STAFF_FILTER_BY_ROLE,
  STAFF_ROLE_CONTROLS,
} from '@constants/accesses';

export const availableAccessByRole = (removeLearners = false) => {
  const currentAccess = getCurrentAccess();
  const isEmployer = currentAccess?.tenantClassification?.toLowerCase() === 'employer';

  if (currentAccess?.role === 'Admin' && process.env.VITE_ROOT_ORG_ID === currentAccess?.tenantId) {
    return removeLearners ? ROOT_ADMIN_FILTER_BY_ROLE : ROOT_ADMIN_ROLE_CONTROLS;
  }

  if (currentAccess?.role === 'Admin') {
    if (removeLearners) {
      if (isEmployer) {
        return EMPLOYER_ADMIN_FILTER_BY_ROLE.filter((role) => role !== 'Learner');
      }
      return ORG_ADMIN_FILTER_BY_ROLE;
    }
    if (isEmployer) {
      return EMPLOYER_ADMIN_FILTER_BY_ROLE;
    }
    return ORG_ADMIN_ROLE_CONTROLS;
  }

  if (currentAccess?.role === 'Staff') {
    if (removeLearners) {
      if (isEmployer) {
        return EMPLOYER_STAFF_FILTER_BY_ROLE.filter((role) => role !== 'Learner');
      }
      return STAFF_FILTER_BY_ROLE;
    }
    if (isEmployer) {
      return EMPLOYER_STAFF_FILTER_BY_ROLE;
    }
    return STAFF_ROLE_CONTROLS;
  }
  // default return lowest available admin-ui available role controls
  return removeLearners ? STAFF_FILTER_BY_ROLE : STAFF_ROLE_CONTROLS;
};
