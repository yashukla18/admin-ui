import { Suspense, lazy } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';
import { APP_BAR_HEIGHT, Footer } from '@youscience/brightpath-header';
import { CoreBox } from '@youscience/core';
// components/styles
import { ADMIN_LAYOUT_TESTID } from '@layouts/layout.testIds';
import { CircularProgress, Skeleton } from '@mui/material';
import AdminHeader from '@components/layout/AdminHeader';
import { sxStyles } from './AdminLayout.styles';
// Lazy components
const Breadcrumbs = lazy(() => import('@components/layout/Breadcrumbs'));

export const AdminLayout = () => {
  const { state = 'idle' } = useNavigation();
  const { pathname = '/' } = useLocation();

  const shouldShowCrumbs = pathname.split('/')?.length > 2;

  return (
    <CoreBox sx={sxStyles.container} data-testid={ADMIN_LAYOUT_TESTID}>
      <AdminHeader />
      <CoreBox sx={sxStyles.wrapper}>
        <CoreBox
          component='main'
          sx={{
            ...sxStyles.main,
            pt: !shouldShowCrumbs ? undefined : 6,
          }}
        >
          <Suspense
            fallback={
              <CoreBox sx={{ display: 'flex', mb: 6 }}>
                <Skeleton sx={{ width: 100, height: 34 }} />
                <Skeleton sx={{ width: 100, height: 34 }} />
              </CoreBox>
            }
          >
            {shouldShowCrumbs ? <Breadcrumbs /> : null}
          </Suspense>
          {state === 'loading' ? (
            <>
              <Outlet />
              <CoreBox
                sx={{
                  ...sxStyles.loader,
                  ml: state === 'loading' ? '-40px' : '',
                  position: 'absolute',
                  top: APP_BAR_HEIGHT,
                  zIndex: 10000,
                }}
              >
                <CircularProgress size={60} sx={{ pb: 6 }} />
              </CoreBox>
            </>
          ) : (
            <Outlet />
          )}
        </CoreBox>
      </CoreBox>
      <CoreBox sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Footer />
      </CoreBox>
    </CoreBox>
  );
};
