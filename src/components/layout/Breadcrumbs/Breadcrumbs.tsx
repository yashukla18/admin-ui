/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useMatches, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import { Add, NavigateNext } from '@mui/icons-material';
import { COMMON_COLORS } from '@constants/theme';
import { Match } from '@interfaces/routing';
import { CoreBox, CoreButton } from '@youscience/core';
import ConditionWrapper from '@components/ui/ConditionWrapper';
import FeatureFlag from '@components/ui/FeatureFlag';
import { useImpersonation } from '@hooks/useImpersonation';
import { useOrgListStore } from '@stores/orgListStore';

export const Breadcrumbs = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const matches = useMatches() as Match[];
  const rootTenantId = import.meta.env.VITE_ROOT_ORG_ID;

  const associatedOrgs = useOrgListStore((state) => state.associatedOrgs);

  const { beginImpersonation, checkYsAdminImpersonating } = useImpersonation();
  const { isYsAdminImpersonating } = checkYsAdminImpersonating();

  const shouldShowBulkInvite =
    location?.pathname?.includes('organizations') &&
    params?.id &&
    !location?.pathname?.includes('bulk-invite') &&
    !location?.pathname?.includes('edit');

  const hasRootAdminAccess =
    associatedOrgs?.some(
      (org) => org?.tenant?.tenantId === rootTenantId && org?.tenant?.permission?.role === 'Admin',
    ) ?? false;

  const shouldShowImpersonate =
    location?.pathname?.includes('users') && params?.userId && !hasRootAdminAccess && !isYsAdminImpersonating;

  const crumbs = matches
    ?.filter(({ handle }) => Boolean(handle?.crumb))
    .map(({ data, handle }) => handle?.crumb?.(data));

  const handleBulkInvite = () => {
    navigate(`/organizations/bulk-invite/${params?.id ?? ''}`);
  };

  return (
    <CoreBox display='flex' justifyContent='space-between' marginLeft={1} paddingBottom={2} width='100%'>
      <MuiBreadcrumbs
        sx={{
          py: 2,
          width: '80%',
          '.MuiBreadcrumbs-separator': { marginLeft: 0, marginRight: 0 },
        }}
        separator={
          <NavigateNext
            sx={{
              color: COMMON_COLORS.breadCrumbDivider,
            }}
          />
        }
      >
        {crumbs}
      </MuiBreadcrumbs>
      <ConditionWrapper condition={Boolean(shouldShowImpersonate || shouldShowBulkInvite)}>
        <CoreBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
          <FeatureFlag featureName='orgBulkInvite' featureId={import.meta.env.VITE_FEATURE_ORG_BULK_INVITE_ID}>
            <ConditionWrapper condition={Boolean(shouldShowBulkInvite)}>
              <CoreButton
                onClick={handleBulkInvite}
                color='secondary'
                startIcon={<Add />}
                sx={{
                  '.MuiButton-startIcon>*:first-of-type': {
                    fontSize: '18px',
                  },
                }}
              >
                Bulk invite
              </CoreButton>
            </ConditionWrapper>
          </FeatureFlag>
          <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_IMPERSONATION_ID}>
            <ConditionWrapper condition={Boolean(shouldShowImpersonate)}>
              <CoreButton onClick={() => beginImpersonation(params?.userId ?? '')} color='secondary'>
                Impersonate
              </CoreButton>
            </ConditionWrapper>
          </FeatureFlag>
        </CoreBox>
      </ConditionWrapper>
    </CoreBox>
  );
};
