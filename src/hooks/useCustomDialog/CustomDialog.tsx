import { useState } from 'react';
import {
  CoreButton,
  CoreDialog,
  CoreDialogActions,
  CoreDialogContent,
  CoreDialogContentText,
  CoreDialogTitle,
} from '@youscience/core';

import { sxStyles } from './CustomDialog.styles';
import { CustomDialogHook, CustomDialogProps } from './CustomDialog.types';

export const useCustomDialog = (): CustomDialogHook => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const CustomDialog = ({
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    contentText = 'Are you sure?',
    onCancel,
    onConfirm,
    title,
  }: CustomDialogProps) => (
    <CoreDialog open={dialogOpen} maxWidth='sm'>
      <CoreDialogTitle sx={sxStyles.dialogTitle}>{title}</CoreDialogTitle>
      <CoreDialogContent sx={sxStyles.dialogContent}>
        {typeof contentText === 'string' ? (
          <CoreDialogContentText sx={sxStyles.dialogText}>{contentText}</CoreDialogContentText>
        ) : (
          contentText
        )}
      </CoreDialogContent>
      <CoreDialogActions sx={sxStyles.dialogActions}>
        <CoreButton onClick={onCancel} sx={sxStyles.dialogButton} color='primary' variant='text' size='large'>
          {cancelText}
        </CoreButton>
        <CoreButton onClick={onConfirm} sx={sxStyles.dialogButton} color='primary' variant='contained' size='large'>
          {confirmText}
        </CoreButton>
      </CoreDialogActions>
    </CoreDialog>
  );

  return { openDialog, closeDialog, CustomDialog, dialogOpen };
};
