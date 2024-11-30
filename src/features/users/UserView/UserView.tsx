import { CoreBox } from '@youscience/core';
import { UserDocument } from '@youscience/user-service-common';
import { Suspense, lazy, useEffect } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { shouldDisplayAssociatedLogins, showAllIdentities } from '@utils/resetPassword';
import LoadingCard from '@components/ui/LoadingCard';
import { useOrgListStore } from '@stores/orgListStore';
import { sxStyles } from './UserView.Styles';
import { apiGetUserAccess } from '../services/UserService';

const AssociatedOrgs = lazy(() => import('./AssociatedOrgs'));
const Details = lazy(() => import('./Details'));
const Highlights = lazy(() => import('./Highlights'));
const AssociatedLogins = lazy(() => import('./AssociatedLogins'));
const Settings = lazy(() => import('./Settings'));

export const UserView = () => {
  const { details } = useLoaderData() as { details: UserDocument };
  const { fullName = '', profile } = details;
  const email = details.identities[0]?.email ?? '';

  const associatedOrgs = useOrgListStore((state) => state.associatedOrgs)!;
  const setAssociatedOrgs = useOrgListStore((state) => state.setAssociatedOrgs);

  useEffect(() => {
    const fetchAccess = async () => {
      const response = await apiGetUserAccess(details.userId);

      if (response.data) {
        setAssociatedOrgs(response.data);
      }
    };

    void fetchAccess();
  }, []);

  return (
    <CoreBox sx={sxStyles.viewComponent}>
      <Suspense fallback={<LoadingCard title='User details' skeletonCount={5} />}>
        <Await resolve={details}>
          <Details selectedUser={details} />
        </Await>
      </Suspense>

      <Suspense fallback={<LoadingCard title='Additional settings' />}>
        <Await resolve={details}>
          <Settings />
        </Await>
      </Suspense>

      <Suspense fallback={<LoadingCard title='Profile highlights' />}>
        <Await resolve={details}>{details.profile?.plan ? <Highlights selectedUser={details} /> : null}</Await>
      </Suspense>

      <Suspense fallback={<LoadingCard title='Associated organizations' />}>
        <Await resolve={associatedOrgs}>
          {associatedOrgs ? (
            <AssociatedOrgs
              access={associatedOrgs}
              userName={fullName}
              emailAddress={email}
              dateOfBirth={profile?.dateOfBirth}
            />
          ) : null}
        </Await>
      </Suspense>

      <Suspense fallback={<LoadingCard title='Associated logins' />}>
        <Await resolve={details}>
          {shouldDisplayAssociatedLogins(details.identities) ? (
            <AssociatedLogins initialIdentities={showAllIdentities(details.identities)} />
          ) : null}
        </Await>
      </Suspense>
    </CoreBox>
  );
};
