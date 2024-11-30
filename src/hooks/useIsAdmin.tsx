import { getCurrentAccess } from '@stores/authStore';
import { useEffect, useState } from 'react';
import { CurrentAccess } from '@interfaces/user';

export const useIsAdmin = () => {
  const storeCurrentAccess = getCurrentAccess();
  const rootTenantId = import.meta.env.VITE_ROOT_ORG_ID;

  const [currentAccess, setCurrentAccess] = useState<CurrentAccess>(
    storeCurrentAccess ?? {
      accessDocumentId: '',
      constraintTags: [],
      role: 'Learner',
      tenantId: '',
      tenantName: '',
      userId: '',
    },
  );

  const isOrgAdmin = currentAccess && currentAccess.role === 'Admin';
  const isStaff = currentAccess && currentAccess.role === 'Staff';
  const isRootAdmin = isOrgAdmin && currentAccess.tenantId === rootTenantId;

  useEffect(() => {
    if (storeCurrentAccess && storeCurrentAccess.tenantId !== currentAccess.tenantId) {
      setCurrentAccess(storeCurrentAccess);
    }
  }, [storeCurrentAccess?.tenantId, currentAccess?.tenantId]);

  return {
    currentAccess,
    isOrgAdmin,
    isStaff,
    isRootAdmin,
    rootTenantId,
  };
};
