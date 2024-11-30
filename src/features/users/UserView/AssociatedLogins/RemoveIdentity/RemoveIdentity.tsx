import { IconButton } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import { IdentityRecord } from '@youscience/user-service-common';
import { CoreBox, CoreTypography } from '@youscience/core';
import FeatureFlag from '@components/ui/FeatureFlag';
import Loader from '@components/ui/Loader';
import { useCustomDialog } from '@hooks/useCustomDialog/CustomDialog';
import { useNotifyStore } from '@stores/notifyStore';
import { useState } from 'react';
import { apiRemoveUserIdentity } from '@features/users/services/UserService';

export const RemoveIdentity = ({
  isRemoveIdentity,
  identity,
  userId,
  removeIdentityAndUpdate,
}: {
  isRemoveIdentity: boolean;
  identity: IdentityRecord;
  userId: string;
  removeIdentityAndUpdate: (identityId: string) => void;
}) => {
  const notify = useNotifyStore((state) => state.notify);
  const { openDialog, closeDialog, CustomDialog } = useCustomDialog();

  const [identityInfo, setIdentityInfo] = useState<{ email: string; id: string }>({ email: '', id: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const removeUserIdentity = async () => {
    closeDialog();
    try {
      setLoading(true);
      const response = await apiRemoveUserIdentity(userId, identityInfo.id);

      if (response.status === 204) {
        removeIdentityAndUpdate(identityInfo.id);
        notify({ message: 'User identity removed successfully', severity: 'success' });
      }
    } catch (error) {
      notify({ message: 'Failed to remove user identity', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUserIdentity = (email: string, id: string) => {
    setIdentityInfo({ email, id });
    openDialog();
  };

  // TODO: Remove redundant providers (FRHSD, BCSD, WCCC) once the M365 is widely used
  return (
    <FeatureFlag featureName='removeIdentity' featureId={import.meta.env.VITE_FEATURE_REMOVE_IDENTITY_ID}>
      <Loader loading={loading} />
      <CoreBox key={`${identity?.idpId ?? identity.email}-remove`}>
        {isRemoveIdentity &&
        (['cognito', 'Google', 'FRHSD', 'BCSD', 'WCCC', 'M365'].includes(identity.provider?.trim() ?? '') ||
          !identity?.provider) ? (
          <IconButton
            color='error'
            onClick={() => handleRemoveUserIdentity(identity.email ?? '', identity?.idpId ?? identity?.email ?? '')}
          >
            <DeleteOutlined data-testid='remove-identity-test-id' />
          </IconButton>
        ) : null}
      </CoreBox>
      <CustomDialog
        contentText={
          <>
            Click confirm to remove the identity below
            <CoreTypography color='primary'>{identityInfo.email}</CoreTypography>
          </>
        }
        key={identityInfo.id}
        onCancel={closeDialog}
        onConfirm={removeUserIdentity}
        title='Remove identity'
      />
    </FeatureFlag>
  );
};
