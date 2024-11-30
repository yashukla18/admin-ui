import { ChangeEvent } from 'react';
import { Control } from 'react-hook-form';

export const SEPARATOR = '-';
export const PREFIX = '+1 ';
export const REGEX = /\+1 \d{0,4}(-\d{0,3}(-\d{0,4})?)?/;
export const phoneRegex = /^\+\d{1,4} (\d{1,4}-)+(\d{1,9})$/;

export interface InputMaskProps {
  name: string;
  label: string;
  placeholder?: string;
  // eslint-disable-next-line
  control: Control<any>;
  isDisabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  mask?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  width?: string | number;
  error?: boolean;
  helperText?: string;
  dataTestId?: string;
}
