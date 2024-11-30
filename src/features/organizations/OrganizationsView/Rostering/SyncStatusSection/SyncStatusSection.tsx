import { useEffect, useState } from 'react';
import { CoreButton, CoreBox, CoreTypography, CoreChip } from '@youscience/core';
import { SyncStatus } from '@interfaces/rostering';
import { SsoSettings } from '@youscience/user-service-common';
import { useNotifyStore } from '@stores/notifyStore';
import { sisService } from '@services/sis.service';
import { CircularProgress } from '@mui/material';
import ConditionWrapper from '@components/ui/ConditionWrapper';
import { useIsAdmin } from '@hooks/useIsAdmin';
import { formatLastSyncDate, getSyncStatusInfo } from '../formatRosteringData';
import { sxStyles } from '../Rostering.style';

interface SyncStatusSectionProps {
  id: string;
  shouldShowSyncStatus: boolean;
  ssoSettings: SsoSettings;
}

export const SyncStatusSection = ({ id, shouldShowSyncStatus, ssoSettings }: SyncStatusSectionProps) => {
  const [syncState, setSyncState] = useState({ syncing: false, reSyncing: false });
  const { syncing, reSyncing } = syncState;
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const notify = useNotifyStore((state) => state.notify);

  const { isRootAdmin, rootTenantId } = useIsAdmin();
  const isRootOrg = id === rootTenantId;

  useEffect(() => {
    const fetchSyncStatus = async () => {
      try {
        setSyncState({ ...syncState, syncing: true });
        const status = await sisService.syncStatus(id);

        if (status) {
          setSyncStatus(status);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Sync status err:', error);
      } finally {
        setSyncState({ ...syncState, syncing: false });
      }
    };

    if (shouldShowSyncStatus) {
      void fetchSyncStatus();
    }
  }, [id]);

  const handleSuccessfulSync = (message: string) => {
    setSyncStatus((prevStatus) => ({ ...prevStatus, status: 'inprogress' }));
    notify({ message, severity: 'info' });
  };

  const handleFailedSync = (message: string) => {
    setSyncStatus((prevStatus) => ({ ...prevStatus, status: 'failed' }));
    notify({ message, severity: 'error' });
  };

  const handleReSync = async () => {
    if (!ssoSettings.provider) {
      notify({ message: 'Provider information not available', severity: 'error' });
      return;
    }

    setSyncState({ ...syncState, reSyncing: true });

    let type = '';
    let districtId = '';
    let schoolId = '';

    if ('type' in ssoSettings.provider) {
      type = ssoSettings.provider.type;
    }

    if ('districtId' in ssoSettings.provider) {
      districtId = ssoSettings.provider.districtId;
    }

    if ('schoolId' in ssoSettings.provider) {
      schoolId = ssoSettings.provider.schoolId;
    }

    try {
      const response = await sisService.reSyncStatus({
        tenantId: id,
        districtId,
        provider: type,
        schoolIds: schoolId,
      });

      const { status } = response || {};

      if (status === 'failed') {
        throw new Error('Rostering resync failed');
      } else {
        handleSuccessfulSync('Sync started successfully. Come back after some time');
      }
    } catch (error) {
      handleFailedSync('Rostering resync failed. Please try again later');
    } finally {
      setSyncState((prevState) => ({ ...prevState, reSyncing: false }));
    }
  };

  const formattedDate = formatLastSyncDate(syncStatus?.lastSyncEndedAt ?? '');
  const { status, label } = getSyncStatusInfo(syncStatus?.status ?? '');
  // These default color values are going to be updated with the newest version of the theme when it's available
  const chipColorMap = {
    pending: 'info',
    failed: 'error',
    active: 'success',
  } as const;

  return (
    <>
      <CoreBox sx={sxStyles.syncStatusWrapper}>
        <CoreTypography sx={sxStyles.syncStatusHeading}>Sync Status</CoreTypography>

        {!syncing ? (
          <>
            <CoreBox mt={3}>
              <CoreChip label={label} color={chipColorMap[status]} />
            </CoreBox>
            <ConditionWrapper condition={isRootAdmin && !isRootOrg}>
              <CoreButton
                sx={sxStyles.buttonStyles}
                color='secondary'
                variant='outlined'
                size='small'
                onClick={handleReSync}
                disabled={status === 'pending' || reSyncing}
              >
                {reSyncing ? <CircularProgress size={20} color='inherit' /> : 'Resync'}
              </CoreButton>
            </ConditionWrapper>
          </>
        ) : (
          <CircularProgress sx={{ mt: 3 }} size={20} color='secondary' />
        )}
      </CoreBox>

      <CoreTypography sx={sxStyles.LastUpdatedLabel}>Last updated on {formattedDate}</CoreTypography>
    </>
  );
};

export default SyncStatusSection;
