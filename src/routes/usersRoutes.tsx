import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import { CoreTypography } from '@youscience/core';
import { UserDocument } from '@youscience/user-service-common';
import { QueryClient } from '@tanstack/react-query';
import ErrorPage from '../error-page';
import { USERS_ROUTES } from '.';
import { sxStyles } from './routeStyles';
// Lazy components
const BreadcrumbLink = lazy(() => import('@components/layout/Breadcrumbs/BreadcrumbLink'));
const queryClient = new QueryClient();

export const usersRoutes: RouteObject[] = [
  {
    path: USERS_ROUTES.USERS,
    errorElement: <ErrorPage />,
    children: [
      {
        async lazy() {
          const { UsersTable } = await import('@features/users/UsersTable/UsersTable');

          return { Component: UsersTable };
        },
        errorElement: <ErrorPage />,
        index: true,
        async loader() {
          const { usersTableLoader } = await import('@features/users/loaders');

          return usersTableLoader(queryClient);
        },
        handle: {
          crumb: () => [
            <Suspense fallback={<Skeleton sx={sxStyles.userSkeletonCrumbs} />}>
              <BreadcrumbLink to={USERS_ROUTES.USERS}>Home</BreadcrumbLink>
            </Suspense>,
            <CoreTypography color='primary'>Users</CoreTypography>,
          ],
        },
      },
      {
        async lazy() {
          const { UserView } = await import('@features/users/UserView/UserView');

          return { Component: UserView };
        },
        errorElement: <ErrorPage />,
        async loader({ request, params }) {
          const { userViewLoader } = await import('@features/users/loaders');

          return userViewLoader({ request, params });
        },
        path: USERS_ROUTES.DETAILS,
        handle: {
          crumb: (data: UserDocument) => [
            <Suspense fallback={<Skeleton sx={sxStyles.userSkeletonCrumbs} />}>
              <BreadcrumbLink to={USERS_ROUTES.USERS}>Home</BreadcrumbLink>
            </Suspense>,
            <Suspense fallback={<Skeleton sx={sxStyles.userSkeletonCrumbs} />}>
              <BreadcrumbLink to={USERS_ROUTES.USERS}>Users</BreadcrumbLink>
            </Suspense>,
            <CoreTypography color='primary'>{data?.displayName ?? 'Details'}</CoreTypography>,
          ],
        },
      },
      {
        async lazy() {
          const { UserEdit } = await import('@features/users/UserEdit/UserEdit');

          return { Component: UserEdit };
        },
        errorElement: <ErrorPage />,
        async loader({ request, params }) {
          const { userViewLoader } = await import('@features/users/loaders');

          return userViewLoader({ request, params });
        },
        path: USERS_ROUTES.EDIT_USER,
        handle: {
          crumb: (data: UserDocument) => [
            <Suspense fallback={<Skeleton sx={sxStyles.userSkeletonCrumbs} />}>
              <BreadcrumbLink to={USERS_ROUTES.USERS}>Home</BreadcrumbLink>
            </Suspense>,
            <Suspense fallback={<Skeleton sx={sxStyles.userSkeletonCrumbs} />}>
              <BreadcrumbLink to={USERS_ROUTES.USERS}>Users</BreadcrumbLink>
            </Suspense>,
            <Suspense fallback={<Skeleton sx={sxStyles.userSkeletonCrumbs} />}>
              <BreadcrumbLink to={`/users/${data?.userId}`}>{data?.displayName ?? 'Details'}</BreadcrumbLink>
            </Suspense>,
            <CoreTypography color='primary'>Edit</CoreTypography>,
          ],
        },
      },
      {
        async lazy() {
          const { BulkInviteV2 } = await import('@features/invitations/BulkInvite/BulkInviteV2');

          return { Component: BulkInviteV2 };
        },
        errorElement: <ErrorPage />,
        async loader() {
          const { orgListLoader } = await import('@features/invitations/loaders');

          return orgListLoader();
        },
        path: USERS_ROUTES.BULK_INVITE,
        handle: {
          crumb: () => [
            <Suspense fallback={<Skeleton sx={sxStyles.userSkeletonCrumbs} />}>
              <BreadcrumbLink to={USERS_ROUTES.USERS}>Home</BreadcrumbLink>
            </Suspense>,
            <Suspense fallback={<Skeleton sx={sxStyles.userSkeletonCrumbs} />}>
              <BreadcrumbLink to={USERS_ROUTES.USERS}>Users</BreadcrumbLink>
            </Suspense>,
            <CoreTypography color='primary'>Bulk Invite</CoreTypography>,
          ],
        },
      },
      {
        async lazy() {
          const { UserInvite } = await import('@features/invitations/UserInvite/UserInvite');

          return { Component: UserInvite };
        },
        errorElement: <ErrorPage />,
        async loader() {
          const { orgListLoader } = await import('@features/invitations/loaders');

          return orgListLoader();
        },
        path: USERS_ROUTES.USER_INVITE,
        handle: {
          crumb: () => [
            <Suspense fallback={<Skeleton sx={sxStyles.userSkeletonCrumbs} />}>
              <BreadcrumbLink to={USERS_ROUTES.USERS}>Home</BreadcrumbLink>
            </Suspense>,
            <Suspense fallback={<Skeleton sx={sxStyles.userSkeletonCrumbs} />}>
              <BreadcrumbLink to={USERS_ROUTES.USERS}>Users</BreadcrumbLink>
            </Suspense>,
            <CoreTypography color='primary'>User Invite</CoreTypography>,
          ],
        },
      },
    ],
  },
];
