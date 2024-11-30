import { Suspense, lazy } from 'react';
import { CoreTypography } from '@youscience/core';
import { OrgViewLoaderData } from '@features/organizations/interfaces';
import { RouteObject } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import { QueryClient } from '@tanstack/react-query';
import ErrorPage from '../error-page';
import { ORGANIZATION_ROUTES } from '.';
import { sxStyles } from './routeStyles';
// Lazy components
const BreadcrumbLink = lazy(() => import('@components/layout/Breadcrumbs/BreadcrumbLink'));
const queryClient = new QueryClient();

export const organizationRoutes: RouteObject[] = [
  {
    path: ORGANIZATION_ROUTES.ORGANIZATIONS,
    errorElement: <ErrorPage />,
    children: [
      {
        async lazy() {
          const { OrganizationsTable } = await import('@features/organizations/OrganizationsTable/OrganizationsTable');

          return { Component: OrganizationsTable };
        },
        errorElement: <ErrorPage />,
        index: true,
        async loader() {
          const { organizationsTableLoader } = await import('@features/organizations/loaders');

          return organizationsTableLoader(queryClient);
        },
        handle: {
          crumb: () => [
            <Suspense fallback={<Skeleton sx={sxStyles.organizationSkeletonCrumbs} />}>
              <BreadcrumbLink to='/users'>Home</BreadcrumbLink>
            </Suspense>,
            <CoreTypography color='primary'>Organizations</CoreTypography>,
          ],
        },
      },
      {
        async lazy() {
          const { OrganizationsView } = await import('@features/organizations/OrganizationsView/OrganizationsView');

          return { Component: OrganizationsView };
        },
        async loader({ request, params }) {
          const { organizationDetailsLoader } = await import('@features/organizations/loaders');

          return organizationDetailsLoader({ request, params });
        },
        path: ORGANIZATION_ROUTES.DETAILS,
        handle: {
          crumb: ({ details }: OrgViewLoaderData) => [
            <Suspense fallback={<Skeleton sx={sxStyles.organizationSkeletonCrumbs} />}>
              <BreadcrumbLink to='/users'>Home</BreadcrumbLink>
            </Suspense>,
            <Suspense fallback={<Skeleton sx={sxStyles.organizationSkeletonCrumbs} />}>
              <BreadcrumbLink to='/organizations'>Organizations</BreadcrumbLink>
            </Suspense>,
            <CoreTypography color='primary'>{details?.name || 'Details'}</CoreTypography>,
          ],
        },
      },
      {
        async lazy() {
          const { OrganizationEdit } = await import('@features/organizations/OrganizationEdit/OrganizationEdit');

          return { Component: OrganizationEdit };
        },
        errorElement: <ErrorPage />,
        async loader({ request, params }) {
          const newParams = { ...params, ...{ isNew: 'yes' } };
          const { organizationDetailsLoader } = await import('@features/organizations/loaders');

          return organizationDetailsLoader({ request, params: newParams });
        },
        path: ORGANIZATION_ROUTES.ADD_ORG,
        handle: {
          crumb: () => {
            return [
              <Suspense fallback={<Skeleton sx={sxStyles.organizationSkeletonCrumbs} />}>
                <BreadcrumbLink to='/users'>Home</BreadcrumbLink>
              </Suspense>,
              <Suspense fallback={<Skeleton sx={sxStyles.organizationSkeletonCrumbs} />}>
                <BreadcrumbLink to='/organizations'>Admin</BreadcrumbLink>
              </Suspense>,
              <CoreTypography color='primary'>Add Organization</CoreTypography>,
            ];
          },
        },
      },
      {
        async lazy() {
          const { OrganizationEdit } = await import('@features/organizations/OrganizationEdit/OrganizationEdit');

          return { Component: OrganizationEdit };
        },
        errorElement: <ErrorPage />,
        async loader({ request, params }) {
          const { organizationDetailsLoader } = await import('@features/organizations/loaders');

          return organizationDetailsLoader({ request, params });
        },
        path: ORGANIZATION_ROUTES.EDIT_TENANT,
        handle: {
          crumb: (data: OrgViewLoaderData) => {
            return [
              <Suspense fallback={<Skeleton sx={sxStyles.organizationSkeletonCrumbs} />}>
                <BreadcrumbLink to='/users'>Home</BreadcrumbLink>
              </Suspense>,
              <Suspense fallback={<Skeleton sx={sxStyles.organizationSkeletonCrumbs} />}>
                <BreadcrumbLink to='/organizations'>Admin</BreadcrumbLink>
              </Suspense>,
              <Suspense fallback={<Skeleton sx={sxStyles.organizationSkeletonCrumbs} />}>
                <BreadcrumbLink to='/organizations'>Organizations</BreadcrumbLink>
              </Suspense>,
              <CoreTypography color='primary'>{data?.details?.name || 'Details'}</CoreTypography>,
            ];
          },
        },
      },
      {
        async lazy() {
          const { BulkInvite } = await import('@features/invitations/BulkInvite/BulkInvite');

          return { Component: BulkInvite };
        },
        errorElement: <ErrorPage />,
        async loader({ request, params }) {
          const { organizationDetailsLoader } = await import('@features/organizations/loaders');
          const { orgListLoader } = await import('@features/invitations/loaders');

          await orgListLoader();
          return organizationDetailsLoader({ request, params });
        },
        path: ORGANIZATION_ROUTES.BULK_INVITE_WITH_ID,
        handle: {
          crumb: (details: OrgViewLoaderData) => [
            <Suspense fallback={<Skeleton sx={sxStyles.organizationSkeletonCrumbs} />}>
              <BreadcrumbLink to={ORGANIZATION_ROUTES.ORGANIZATIONS}>Home</BreadcrumbLink>
            </Suspense>,
            <Suspense fallback={<Skeleton sx={sxStyles.organizationSkeletonCrumbs} />}>
              <BreadcrumbLink to={ORGANIZATION_ROUTES.ORGANIZATIONS}>Organizations</BreadcrumbLink>
            </Suspense>,
            <Suspense fallback={<Skeleton sx={sxStyles.organizationSkeletonCrumbs} />}>
              <BreadcrumbLink to={`organizations/${details?.details?.tenantId}`}>
                {details?.details?.name || 'name'}
              </BreadcrumbLink>
            </Suspense>,

            <CoreTypography color='primary'>Bulk Invite</CoreTypography>,
          ],
        },
      },
      {
        async lazy() {
          const { BulkInvite } = await import('@features/invitations/BulkInvite/BulkInvite');

          return { Component: BulkInvite };
        },
        errorElement: <ErrorPage />,
        async loader() {
          const { orgListLoader } = await import('@features/invitations/loaders');

          return orgListLoader();
        },
        path: ORGANIZATION_ROUTES.BULK_INVITE_WITHOUT_ID,
        handle: {
          crumb: () => [
            <Suspense fallback={<Skeleton sx={sxStyles.organizationSkeletonCrumbs} />}>
              <BreadcrumbLink to={ORGANIZATION_ROUTES.ORGANIZATIONS}>Home</BreadcrumbLink>
            </Suspense>,
            <Suspense fallback={<Skeleton sx={sxStyles.organizationSkeletonCrumbs} />}>
              <BreadcrumbLink to={ORGANIZATION_ROUTES.ORGANIZATIONS}>Organization</BreadcrumbLink>
            </Suspense>,
            <CoreTypography color='primary'>Bulk Invite</CoreTypography>,
          ],
        },
      },
    ],
  },
];
