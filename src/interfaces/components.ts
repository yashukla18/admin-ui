import { ForwardedRef } from 'react';

export enum ConfirmDialogType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
}

export interface BasicProps {
  children?: JSX.Element;
  className?: string;
  ref: ForwardedRef<object>;
}

export interface Option {
  label: string;
  value: string;
}
