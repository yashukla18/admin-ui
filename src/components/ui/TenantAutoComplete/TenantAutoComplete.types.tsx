import { SxProps, TextFieldProps, Theme } from '@mui/material';

export interface TenantAutoCompleteProps {
  error?: boolean;
  label?: string;
  onClearSearchCallback?: () => void;
  orgNameAsParentProp?: string;
  placeholder?: string;
  required?: boolean;
  setNewPath?: React.Dispatch<React.SetStateAction<string>>;
  sx?: SxProps<Theme>;
  textFieldProps?: TextFieldProps;
}
