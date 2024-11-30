import { useState } from 'react';
import {
  CoreButton,
  CoreDialog,
  CoreDialogActions,
  CoreDialogContent,
  CoreDialogContentText,
  CoreDialogTitle,
} from '@youscience/core';
import { ResetPasswordDialogHook, ResetPasswordDialogProps } from './dialog.types';
import { sxStyles } from './useDialog.styles';

export const useResetPasswordDialog = (): ResetPasswordDialogHook => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const openResetPasswordDialog = () => {
    setDialogOpen(true);
  };

  const closeResetPasswordDialog = () => {
    setDialogOpen(false);
  };

  const ResetPasswordDialog = ({ generatedLink, onConfirm, onCancel }: ResetPasswordDialogProps) => (
    <CoreDialog open={dialogOpen} maxWidth='sm'>
      <CoreDialogTitle sx={sxStyles.dialogTitle}>Reset Password</CoreDialogTitle>
      <CoreDialogContent sx={sxStyles.dialogContent}>
        <CoreDialogContentText sx={sxStyles.dialogText}>
          Copy the following link and paste within your browser to help this user reset their password:
        </CoreDialogContentText>
        <CoreDialogContentText sx={sxStyles.linkText}>{generatedLink}</CoreDialogContentText>
      </CoreDialogContent>
      <CoreDialogActions sx={sxStyles.dialogActions}>
        <CoreButton onClick={onCancel} sx={sxStyles.dialogButton} color='primary' variant='text' size='large'>
          Cancel
        </CoreButton>
        <CoreButton onClick={onConfirm} sx={sxStyles.dialogButton} color='primary' variant='contained' size='large'>
          Copy Link
        </CoreButton>
      </CoreDialogActions>
    </CoreDialog>
  );

  return { openResetPasswordDialog, closeResetPasswordDialog, ResetPasswordDialog };
};
