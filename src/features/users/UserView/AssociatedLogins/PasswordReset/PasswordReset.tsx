import { useState } from 'react';
import { CoreBox, CoreButton, CoreTypography } from '@youscience/core';
import { CircularProgress } from '@mui/material';
import { useNotifyStore } from '@stores/notifyStore';
import { apiFetchPasswordResetLink } from '@features/users/services/UserService';
import { copyTextToClipboard } from '@utils/copyText';
import { IdentityRecord } from '@youscience/user-service-common';
import { sxStyles } from '../AssociatedLogins.Styles';
import { useResetPasswordDialog } from './PasswordResetDialog/useDialog';

export const PasswordReset = ({
  isResetPassword,
  identity,
  userId,
}: {
  isResetPassword: boolean;
  identity: IdentityRecord;
  userId: string;
}) => {
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const { openResetPasswordDialog, closeResetPasswordDialog, ResetPasswordDialog } = useResetPasswordDialog();

  const notify = useNotifyStore((state) => state.notify);

  const generatePasswordResetLink = async (userId: string, id: string) => {
    try {
      if (!userId) {
        notify({ message: 'User Id is undefined', severity: 'error' });
        return;
      }

      setLoadingStates((prevState) => ({ ...prevState, [id]: true }));

      const response = await apiFetchPasswordResetLink(userId, id);
      const link = response?.data?.link;

      if (link) {
        setGeneratedLink(link);
        openResetPasswordDialog();
      } else {
        notify({ message: 'Password reset link not found in the response', severity: 'error' });
      }
    } catch (error) {
      notify({ message: 'Failed to generate password reset link', severity: 'error' });
    } finally {
      setLoadingStates((prevState) => ({ ...prevState, [id]: false }));
    }
  };

  return (
    <CoreBox>
      {isResetPassword && (identity?.provider === 'cognito' || !identity?.provider) ? (
        <CoreButton
          color='secondary'
          variant='outlined'
          onClick={() => generatePasswordResetLink(userId, identity?.idpId ?? identity?.email ?? '')}
          disabled={loadingStates[identity?.idpId ?? identity?.email ?? '']}
          data-testid='reset-password-test-id'
        >
          {loadingStates[identity?.idpId ?? identity?.email ?? ''] ? (
            <CircularProgress size={20} color='secondary' />
          ) : (
            'Get reset link'
          )}
        </CoreButton>
      ) : (
        <CoreTypography sx={sxStyles.emptyReset}> -- </CoreTypography>
      )}
      <ResetPasswordDialog
        generatedLink={generatedLink}
        onConfirm={() => copyTextToClipboard(generatedLink)}
        onCancel={closeResetPasswordDialog}
      />
    </CoreBox>
  );
};
