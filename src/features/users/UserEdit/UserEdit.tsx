import { Await, useLoaderData } from 'react-router-dom';
import { CoreBox } from '@youscience/core';
import { AccessDocument, UserDocument } from '@youscience/user-service-common';
import { Suspense, lazy } from 'react';
import { AxiosResponse } from 'axios';
import LoadingCard from '@components/ui/LoadingCard';
import { DetailsForm } from '../Forms/EditUserDetailsForm';
import { sxStyles } from './UserEdit.Styles';

const AssociatedOrgsForm = lazy(() => import('../Forms/AssociatedOrgs'));

export const UserEdit = () => {
  const { access, details } = useLoaderData() as {
    access: AxiosResponse<AccessDocument[]>;
    details: UserDocument;
  };

  return (
    <CoreBox sx={sxStyles.editComponent}>
      <Suspense fallback={<LoadingCard skeletonCount={3} />}>
        <Await resolve={details}>
          <DetailsForm user={details} />
        </Await>
      </Suspense>
      <Suspense fallback='loading'>
        {access?.data && access?.data?.length > 0 ? (
          <Suspense fallback={<LoadingCard skeletonCount={3} />}>
            <AssociatedOrgsForm access={access?.data} details={details} />
          </Suspense>
        ) : null}
      </Suspense>
    </CoreBox>
  );
};
