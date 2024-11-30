import { FC } from 'react';
import { CircularProgress, TextField, Autocomplete, AutocompleteProps } from '@mui/material';
import useScrollHandler from '@hooks/useScrollHandler';
import { CoreChip } from '@youscience/core';
import { AutoCompleteOption, CoreAutoCompleteProps } from './CoreAutoComplete.types';

export const CoreAutoComplete: FC<CoreAutoCompleteProps<AutoCompleteOption, boolean, boolean, boolean, 'div'>> = ({
  handleScrollCallback,
  label,
  loading,
  multiple = false,
  displayAsChip = false,
  onChange,
  onInputChange,
  options,
  placeholder,
  required,
  sx,
  textFieldProps,
  ...rest
}) => {
  const { tableRef, handleScroll } = useScrollHandler(handleScrollCallback);
  const shouldDisplayAsChip = displayAsChip || multiple || false;

  return (
    <Autocomplete
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        return option.label;
      }}
      getOptionKey={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        return option.value;
      }}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      ListboxProps={{ ref: tableRef, onScroll: handleScroll }}
      loading={loading}
      onChange={onChange as AutocompleteProps<AutoCompleteOption, boolean, boolean, boolean, 'div'>['onChange']}
      onInputChange={onInputChange}
      options={options}
      sx={{ width: 'inherit', ...sx }}
      multiple={shouldDisplayAsChip}
      renderTags={(value: readonly AutoCompleteOption[]) =>
        value.map((option: AutoCompleteOption) => {
          return value ? <CoreChip color='default' key={option.value} label={option.label} /> : null;
        })
      }
      {...rest}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{ sx: required ? { span: { color: 'red' } } : undefined }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color='primary' size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          label={label}
          placeholder={placeholder}
          required={required}
          size='small'
          variant={textFieldProps?.variant ?? 'outlined'}
        />
      )}
    />
  );
};
