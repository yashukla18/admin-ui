import { AccessRoleEnum } from '@youscience/user-service-common';

// Roles the admin is able to edit
export const ROOT_ADMIN_ROLE_CONTROLS = ['Admin', 'Author', 'Learner', 'Proctor', 'Reviewer', 'Staff'];
export const ORG_ADMIN_ROLE_CONTROLS = ['Admin', 'Staff', 'Author', 'Learner', 'Proctor', 'Reviewer'];
export const STAFF_ROLE_CONTROLS = ['Author', 'Learner', 'Proctor', 'Reviewer'];
export const PROCTOR_ROLE_CONTROLS = ['Author', 'Learner', 'Reviewer'];
// Roles available for edit/access
export const ROOT_ADMIN_FILTER_BY_ROLE = ['Admin', 'Author', 'Proctor', 'Reviewer', 'Staff'];
export const ORG_ADMIN_FILTER_BY_ROLE = ['Admin', 'Author', 'Proctor', 'Reviewer', 'Staff'];
export const STAFF_FILTER_BY_ROLE = ['Author', 'Proctor', 'Reviewer'];
export const PROCTOR_FILTER_BY_ROLE = ['Author', 'Reviewer'];
export const EMPLOYER_ADMIN_FILTER_BY_ROLE = ['Admin', 'Staff', 'Learner'];
export const EMPLOYER_STAFF_FILTER_BY_ROLE = ['Staff', 'Learner'];

// Currently the only roles with access to the admin dashboard
export const ROLES_WITH_ACCESS_TO_ADMIN_UI = ['Admin', 'Staff'];

export const ROLES: AccessRoleEnum[] = ['Admin', 'Author', 'Learner', 'Proctor', 'Reviewer', 'Staff'];
