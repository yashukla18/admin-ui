import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@components/ProtectedRoute/ProtectedRoute';
// Routes
import { ErrorPages } from '@components/ui/ErrorPages';
import { CoreBox } from '@youscience/core';
import { groupsRoutes } from './groupsRoutes';
import { invitationsRoutes } from './invitationsRoutes';
import { organizationRoutes } from './organizationRoutes';
import { ROOT_ROUTES } from '.';
import { usersRoutes } from './usersRoutes';
import ErrorPage from '../error-page';
import { impersonationRoutes } from './impersonationRoutes';
import { d2cRoutes } from './d2cRoutes';

export const rootRoutes: RouteObject[] = [
  {
    path: ROOT_ROUTES.BASE_ROUTE,
    element: <ProtectedRoute />,
    children: [
      ...organizationRoutes,
      ...usersRoutes,
      ...invitationsRoutes,
      ...groupsRoutes,
      ...impersonationRoutes,
      ...d2cRoutes,
    ],
    errorElement: <ErrorPage sx={{ height: '100vh' }} />,
  },
  {
    // return to home page if not found
    path: '*',
    errorElement: <ErrorPage sx={{ height: '100vh' }} />,
    element: (
      <CoreBox sx={{ height: '100vh' }}>
        <ErrorPages errorType='not-found' homePageLink='https://brightpath.youscience.com/home' />
      </CoreBox>
    ),
  },
];
