/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useNotifyStore } from '@stores/notifyStore';
import { fetchTenantById } from '@features/organizations/services/organizations-service';
import { AccessDocument, UserDocument } from '@youscience/user-service-common';
import { hasAccessToUtah } from '@utils/helper';
import {
  RoleUpdate,
  StudentIdUpdate,
  TenantData,
  TenantPermission,
} from '../Forms/AssociatedOrgs/AssociatedOrgs.types';
import { usersService } from '../services/users.service';

interface resolvedAcceesValidationPromise {
  isRostering?: boolean;
  provider?: string;
  isDistrictTypeOrg?: boolean;
  missingFields?: [];
}

export const useUpdateAssociatedOrgs = () => {
  const notify = useNotifyStore((state) => state.notify);

  const updateStudentId = async (data: TenantData[]): Promise<boolean[]> => {
    try {
      const promises = data.map((item) => usersService.apiUpdateTenantData(item.id, item.data));
      const results = await Promise.all(promises);

      return results;
    } catch (error) {
      notify({ message: 'There was an error while updating studentId', severity: 'error' });
      throw error;
    }
  };

  const updateRole = async (data: TenantPermission[]): Promise<boolean[]> => {
    try {
      const promises = data.map((item) => usersService.apiUpdateTenantPermission(item.id, item.permission));
      const results = await Promise.all(promises);

      return results;
    } catch (error) {
      notify({ message: 'There was an error while updating role', severity: 'error' });
      throw error;
    }
  };

  const checkAllAccessesValidation = async (
    accesses: AccessDocument[],
    details: UserDocument,
    updatedStudentIds: StudentIdUpdate,
    updatedRoles: RoleUpdate,
  ) => {
    const isLearnerOrProctor = (role: string) => role === 'Learner' || role === 'Proctor';
    const promises = accesses.map((access) => {
      const { tenantId = '' } = access.tenant;
      const updatedRole = updatedRoles[String(access._id)];
      const updatedStudentId = updatedStudentIds[String(access._id)];

      if (!updatedRole || !isLearnerOrProctor(updatedRole?.role)) return Promise.resolve({});

      if (updatedRole?.role === access.tenant.permission?.role) return Promise.resolve({});

      return fetchTenantById(tenantId)
        .then((tenantInfo) => {
          const isRostering = updatedRole?.role === 'Learner' && tenantInfo.data?.ssoSettings?.rosteringEnabled;
          const provider = isRostering ? tenantInfo.data.ssoSettings?.provider?.type : '';
          const isDistrictTypeOrg = tenantInfo.data?.classification?.type === 'district';
          const hasUtahAccess = hasAccessToUtah(tenantInfo.data);

          const { fullName, profile } = details;
          const missingFields = [];

          if (!fullName || fullName.trim() === '') {
            missingFields.push('Name');
          }

          if (hasUtahAccess && updatedRole?.role === 'Learner') {
            if (!profile?.dateOfBirth) {
              missingFields.push('Date of Birth');
            }
            if (!updatedStudentId?.studentId) {
              missingFields.push('Student Id');
            }
          }

          return { isRostering, provider, isDistrictTypeOrg, missingFields };
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(`Error fetching tenant: ${tenantId}: ${error}`);
          return {};
        });
    });

    return Promise.all(promises).then((results) =>
      results.reduce((acc: resolvedAcceesValidationPromise, result: resolvedAcceesValidationPromise) => ({
        isRostering: acc?.isRostering || result?.isRostering || false,
        provider: acc?.provider || result?.provider || '',
        isDistrictTypeOrg: acc?.isDistrictTypeOrg || result?.isDistrictTypeOrg || false,
        missingFields: [...(acc?.missingFields || []), ...(result.missingFields || [])],
      })),
    ) as Promise<resolvedAcceesValidationPromise>;
  };

  return {
    updateStudentId,
    updateRole,
    checkAllAccessesValidation,
  };
};
