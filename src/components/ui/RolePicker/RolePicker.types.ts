import { InputProps, SelectChangeEvent, SxProps, Theme } from '@mui/material';

export interface RolePickerProps {
  formControlSx?: SxProps<Theme>;
  IconComponent?: React.ElementType;
  id?: string;
  inputProps?: InputProps['inputProps'];
  label?: string;
  name?: string;
  onChangeCallback?: (event: SelectChangeEvent) => void;
  showAsChip?: boolean;
  size?: 'small' | 'medium';
  value: string;
  variant?: 'standard' | 'outlined' | 'filled';
}
