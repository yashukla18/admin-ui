import { Outlet } from 'react-router-dom';
import { BrightpathHeader, Footer } from '@youscience/brightpath-header';
import { CoreBox } from '@youscience/core';
import { useAuthStore } from '@stores/authStore';
import { handleTenantSelectCallback } from '@layouts/constants';
import { PROFILE_LAYOUT_TESTID } from '@layouts/layout.testIds';
import { sxStyles } from './ProfileLayout.styles';

export const ProfileLayout = () => {
  const authSession = useAuthStore((state) => state.authSession);

  return (
    <CoreBox sx={sxStyles.container} data-testid={PROFILE_LAYOUT_TESTID}>
      <BrightpathHeader
        accessDocumentId={authSession?.currentAccess?.accessDocumentId}
        currentProductPage='admin'
        handleTenantSelectCallback={handleTenantSelectCallback}
        impersonating={authSession?.isImpersonated ?? false}
        userDocument={authSession.userData!}
      />
      <CoreBox sx={sxStyles.wrapper}>
        <CoreBox component='main' sx={sxStyles.main}>
          <Outlet />
        </CoreBox>
      </CoreBox>
      <CoreBox sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Footer />
      </CoreBox>
    </CoreBox>
  );
};
