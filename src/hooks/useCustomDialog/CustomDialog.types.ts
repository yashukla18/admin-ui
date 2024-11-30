import { ReactNode } from 'react';

export interface CustomDialogProps {
  cancelText?: string;
  confirmText?: string;
  contentText?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}

export interface CustomDialogHook {
  openDialog: () => void;
  closeDialog: () => void;
  CustomDialog: (props: CustomDialogProps) => ReactNode;
  dialogOpen: boolean;
}
