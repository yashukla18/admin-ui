import { useAuthStore } from '@stores/authStore';
import { AccessDocument, MeWithAccessRecordsApiResponse } from '@youscience/user-service-common';

export const useHasTenantAccess = (
  tenantId?: string,
): { availableAccessRecords: Partial<AccessDocument>[]; hasDirectTenantAccess: boolean } => {
  const { currentAccess, userData } = useAuthStore((state) => state.authSession);
  const rootTenantId = import.meta.env.VITE_ROOT_ORG_ID;

  let hasDirectTenantAccess = false;
  const availableAccessRecords: Partial<MeWithAccessRecordsApiResponse>[] = [];

  userData?.access?.forEach((record) => {
    if (record.tenant.tenantId !== rootTenantId) {
      if (tenantId === currentAccess.tenantId) {
        hasDirectTenantAccess = true;
      }
      availableAccessRecords.push(record);
    }
  });

  return { availableAccessRecords, hasDirectTenantAccess };
};
