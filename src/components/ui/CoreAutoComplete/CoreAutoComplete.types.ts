import { SxProps, Theme, TextFieldProps, AutocompleteProps, ChipTypeMap, ChipProps } from '@mui/material';

export interface AutoCompleteOption {
  value: string;
  label: string;
}

export interface CoreAutoCompleteProps<
  AutoCompleteOption,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
> extends Omit<
    AutocompleteProps<AutoCompleteOption, Multiple, DisableClearable, FreeSolo, ChipComponent>,
    'renderInput' | 'onChange'
  > {
  onChange: (
    event: React.SyntheticEvent,
    option: NonNullable<AutoCompleteOption> | AutoCompleteOption[] | null,
    reason: string,
  ) => void;
  ChipProps?: ChipProps<ChipComponent>;
  error?: boolean;
  displayAsChip?: boolean;
  handleScrollCallback: () => Promise<void>;
  label?: string;
  options: AutoCompleteOption[];
  placeholder?: string;
  required?: boolean;
  sx?: SxProps<Theme>;
  textFieldProps?: TextFieldProps;
}
