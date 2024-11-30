import { AccessDocument } from '@youscience/user-service-common';
import { RoleUpdate, StudentIdUpdate, TenantData, TenantPermission } from './AssociatedOrgs.types';

export const studentIdSanitizer = (access: AccessDocument[], updatedStudentIds: StudentIdUpdate) => {
  const sanitizedIds = access
    .map((item) => {
      const updatedStudentId = updatedStudentIds[String(item._id)]?.studentId;

      if (updatedStudentId !== undefined && updatedStudentId !== item.tenant.private?.data?.studentId) {
        const updatedData = {
          ...item.tenant.private?.data,
          studentId: updatedStudentId,
        };

        return {
          id: String(item._id),
          data: updatedData,
        };
      }

      return null;
    })
    .filter(Boolean) as TenantData[];

  return sanitizedIds;
};

export const roleSanitizer = (access: AccessDocument[], updatedRoles: RoleUpdate) => {
  const sanitizedRoles = access
    .map((item) => {
      const updatedRole = updatedRoles[String(item._id)]?.role;

      if (updatedRole !== undefined && updatedRole !== item.tenant.permission?.role) {
        const updatedData = {
          ...item.tenant.permission,
          role: updatedRole,
        };

        return {
          id: String(item._id),
          permission: updatedData,
        };
      }

      return null;
    })
    .filter(Boolean) as TenantPermission[];

  return sanitizedRoles;
};
