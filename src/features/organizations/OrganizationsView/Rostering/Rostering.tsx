import { useNavigate, useParams } from 'react-router-dom';
import { CoreBox, CoreButton, CoreTypography } from '@youscience/core';
import { DetailsCard } from '@components/ui/DetailsCard';
import ConditionWrapper from '@components/ui/ConditionWrapper';
import { useIsAdmin } from '@hooks/useIsAdmin';
import { TenantDocument } from '@youscience/user-service-common';
import { checkForEnabledSso, checkRostering } from '@utils/helper';
import { sxStyles } from './Rostering.style';
import { formatSSOProviderLabels } from './formatRosteringData';
import RosteringInfoSection from './RosteringInfoSection';
import SyncStatusSection from './SyncStatusSection';

export const Rostering = ({ organization }: { organization: TenantDocument }) => {
  const navigate = useNavigate();
  const { isRootAdmin, rootTenantId } = useIsAdmin();
  const { id = '' } = useParams();
  const { ssoSettings } = organization;

  const isRootOrg = id === rootTenantId;
  const hasSsoSettings = checkForEnabledSso(organization);
  const rosteringEnabled = checkRostering(ssoSettings);
  const formattedSsoSettings = formatSSOProviderLabels(ssoSettings);
  const shouldShowSyncStatus =
    hasSsoSettings && ssoSettings?.provider?.type !== 'GADOE' && ssoSettings?.provider?.type !== 'Google';

  const handleEdit = () => {
    navigate(`../edit/${id ?? ''}`);
  };

  return (
    <DetailsCard
      title='Rostering'
      titleAdornment={
        <ConditionWrapper condition={isRootAdmin && !isRootOrg}>
          <CoreButton color='secondary' onClick={handleEdit}>
            Edit
          </CoreButton>
        </ConditionWrapper>
      }
    >
      <CoreBox sx={sxStyles.wrapper}>
        <CoreTypography sx={{ fontWeight: 600 }}>Rostering Enabled</CoreTypography>
        <CoreTypography mt={2}> {rosteringEnabled ? 'Yes' : 'No'}</CoreTypography>
        {hasSsoSettings && formattedSsoSettings ? (
          <RosteringInfoSection formattedSsoSettings={formattedSsoSettings} />
        ) : null}
        {shouldShowSyncStatus && ssoSettings ? (
          <SyncStatusSection id={id} shouldShowSyncStatus={shouldShowSyncStatus} ssoSettings={ssoSettings} />
        ) : null}
      </CoreBox>
    </DetailsCard>
  );
};
