import { ReactNode } from 'react';

export interface ResetPasswordDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  generatedLink: string;
}

export interface ResetPasswordDialogHook {
  openResetPasswordDialog: () => void;
  closeResetPasswordDialog: () => void;
  ResetPasswordDialog: (props: ResetPasswordDialogProps) => ReactNode;
}
