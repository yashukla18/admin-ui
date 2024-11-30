import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { CoreBox, CoreButton, CoreTypography } from '@youscience/core';
import { DetailsCard } from '@components/ui/DetailsCard';
import { OrgViewLoaderData } from '@interfaces';
import { SUBSCRIPTION_NAMES, SubscriptionKeys } from '@features/organizations/constants';
import ConditionWrapper from '@components/ui/ConditionWrapper';
import { useIsAdmin } from '@hooks/useIsAdmin';
import { sxStyles } from './Subscription.styles';

export const Subscription = () => {
  const navigate = useNavigate();
  const { isRootAdmin, rootTenantId } = useIsAdmin();
  const { id = '' } = useParams();
  const { details } = useLoaderData() as OrgViewLoaderData;
  const { productAvailability } = details || {};

  const handleEdit = () => {
    navigate(`../edit/${id ?? ''}`);
  };
  const isRootOrg = id === rootTenantId;

  return (
    <DetailsCard
      title='Organization Subscription'
      titleAdornment={
        <ConditionWrapper condition={isRootAdmin && !isRootOrg}>
          <CoreButton color='secondary' onClick={handleEdit}>
            Edit
          </CoreButton>
        </ConditionWrapper>
      }
    >
      <CoreBox sx={sxStyles.wrapper}>
        <CoreTypography sx={sxStyles.heading}>Product</CoreTypography>
        {productAvailability ? (
          Object.keys(productAvailability)
            .filter((key) => productAvailability[key as SubscriptionKeys] === true)
            .map((key) => (
              <CoreTypography key={key} sx={sxStyles.body}>
                {SUBSCRIPTION_NAMES[key as SubscriptionKeys]}
              </CoreTypography>
            ))
        ) : (
          <CoreTypography sx={sxStyles.body}>No Subscription</CoreTypography>
        )}
      </CoreBox>
    </DetailsCard>
  );
};
