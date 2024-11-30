import { Await, useLoaderData } from 'react-router-dom';
import { CoreBox } from '@youscience/core';
import { UserDocumentWithAccess } from '@youscience/user-service-common';
import { Suspense, lazy } from 'react';
import { checkProductAvailability } from '@utils/helper';
import { useIsAdmin } from '@hooks/useIsAdmin';
import LoadingCard from '@components/ui/LoadingCard';
import { OrgViewLoaderData } from '../interfaces';
import { ProductAvailability, SUBSCRIPTION_KEY } from '../constants';
import { sxStyles } from './OrganizationViews.Styles';
import { Rostering } from './Rostering/Rostering';

const AdminTools = lazy(() => import('./AdminTools'));
const AdminList = lazy(() => import('./AdminList'));
const Details = lazy(() => import('./Details'));
const Subscription = lazy(() => import('./Subscription'));
const ConditionWrapper = lazy(() => import('@components/ui/ConditionWrapper'));
const OrganizationHierarchy = lazy(() => import('./OrganizationHierarchy'));

export const OrganizationsView = () => {
  const { orgAdmins, details, tenantChildren } = useLoaderData() as OrgViewLoaderData;
  const { isRootAdmin } = useIsAdmin();

  return (
    <CoreBox sx={sxStyles.viewComponent}>
      <Suspense fallback={<LoadingCard title='Organization Details' />}>
        <Details organization={details} />
      </Suspense>
      <Suspense fallback={<LoadingCard title='Rostering' />}>
        <Rostering organization={details} />
      </Suspense>
      <Suspense fallback={<LoadingCard title='Organization Hierarchy' />}>
        <OrganizationHierarchy tenantChildren={tenantChildren} />
      </Suspense>
      <Suspense fallback={<LoadingCard title='Organization Subscription' />}>
        <ConditionWrapper
          condition={
            (SUBSCRIPTION_KEY in details &&
              checkProductAvailability(details.productAvailability as ProductAvailability)) ||
            isRootAdmin
          }
        >
          <Subscription />
        </ConditionWrapper>
      </Suspense>
      <Suspense fallback={<LoadingCard title='Admin tools' />}>
        <AdminTools />
      </Suspense>
      <Suspense fallback={<LoadingCard title='Organization Admins' />}>
        <ConditionWrapper condition={Boolean(orgAdmins && orgAdmins.length > 0)}>
          <Await resolve={orgAdmins}>
            {(orgAdmins) => <AdminList orgAdmins={orgAdmins as UserDocumentWithAccess[]} />}
          </Await>
        </ConditionWrapper>
      </Suspense>
    </CoreBox>
  );
};
