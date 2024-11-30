import { FC, ReactNode } from 'react';
import { CoreBox } from '@youscience/core';
import { BrightpathHeader } from '@youscience/brightpath-header';
// MUI imports
import { CssBaseline } from '@mui/material';
// components/styles
import { handleTenantSelectCallback } from '@layouts/constants';
import { useAuthStore } from '@stores/authStore';
import { SideNav } from '../SidNav/SideNav';

export const AdminHeader: FC<{ children?: ReactNode }> = ({ children = null }) => {
  const authSession = useAuthStore((state) => state.authSession);

  return (
    <CoreBox sx={{ display: 'flex' }}>
      <CssBaseline />
      <CoreBox sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <BrightpathHeader
          accessDocumentId={authSession?.currentAccess?.accessDocumentId}
          currentProductPage='admin'
          handleTenantSelectCallback={handleTenantSelectCallback}
          impersonating={authSession?.isImpersonated ?? false}
          userDocument={authSession.userData!}
        />
      </CoreBox>
      <SideNav />
      {children}
    </CoreBox>
  );
};
