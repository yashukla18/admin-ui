import { useLoaderData, useNavigate } from 'react-router-dom';
import { CoreBox } from '@youscience/core';
import { Suspense, lazy, useEffect } from 'react';
import { useIsAdmin } from '@hooks/useIsAdmin';
import { ConditionWrapper } from '@components/ui/ConditionWrapper/ConditionWrapper';
import LoadingCard from '@components/ui/LoadingCard';
import { OrgViewLoaderData } from '../interfaces';
import { SUBSCRIPTION_KEY } from '../constants';
import { DetailsForm } from '../Forms/DetailsForm';
import { RosteringForm } from '../Forms/RosteringForm';

const Subscription = lazy(() => import('../Forms/Subscription'));

export const OrganizationEdit = () => {
  const { details } = useLoaderData() as OrgViewLoaderData;
  const navigate = useNavigate();
  const { isRootAdmin } = useIsAdmin();

  useEffect(() => {
    if (!isRootAdmin) {
      navigate('/organizations');
    }
  }, [isRootAdmin]);

  const isNew = !details?.tenantId;

  return (
    <ConditionWrapper condition={isRootAdmin}>
      <CoreBox sx={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
        <DetailsForm organization={details} isNew={isNew} />
        <Suspense fallback={<LoadingCard skeletonCount={3} />}>
          <ConditionWrapper condition={!isNew}>
            <RosteringForm organization={details} />
          </ConditionWrapper>
        </Suspense>
        <Suspense fallback={<LoadingCard skeletonCount={3} />}>
          <ConditionWrapper condition={(SUBSCRIPTION_KEY in details || isRootAdmin) && !isNew}>
            <Subscription />
          </ConditionWrapper>
        </Suspense>
      </CoreBox>
    </ConditionWrapper>
  );
};
