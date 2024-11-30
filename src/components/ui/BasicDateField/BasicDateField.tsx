import { DateField, DateFieldProps } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface BasicDateFieldProps extends DateFieldProps<Date> {
  error?: boolean;
  helperText?: string;
}

export const BasicDateField = ({ label = '', size = 'small', ...rest }: BasicDateFieldProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateField label={label} {...rest} size={size} InputProps={{ sx: { borderRadius: '6px' } }} />
    </LocalizationProvider>
  );
};
