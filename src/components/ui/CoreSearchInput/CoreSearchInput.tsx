import React from 'react';
import { InputAdornment, CircularProgress, InputLabel } from '@mui/material';
import { SearchOutlined, CloseOutlined } from '@mui/icons-material';

import { CoreFormHelperText, CoreTextField, CoreTextFieldProps } from '@youscience/core';
import { StyledSearch, sxStyles } from './CoreSearchInput.styles';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type KeyDownEvent = React.KeyboardEvent<HTMLElement>;
type ClickEvent = React.MouseEvent<HTMLDivElement>;

export type CoreSearchInputProps = Partial<Omit<CoreTextFieldProps, 'onChange'>> & {
  inputId?: string;
  value?: string;
  placeholder?: string;
  isLoading?: boolean;
  helperText?: string;
  className?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onEnter?: (value: string) => void;
  onBlur?: () => void;
};

export const CoreSearchInput = (props: CoreSearchInputProps) => {
  const {
    inputId = 'search',
    onChange,
    onEnter,
    onClear,
    placeholder = 'Search',
    value = '',
    isLoading,
    helperText,
    InputProps,
    className,
    ...rest
  } = props;

  const handleSearchKeyDown = (event: KeyDownEvent) => {
    if (event.key === 'Enter' && onEnter) {
      event.preventDefault();
      event.stopPropagation();

      onEnter(value);
    }
  };

  const handleSearchChange = (event: ChangeEvent) => {
    if (onChange) onChange(event.target.value);
  };

  const handleSearchClear = (event: ClickEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (onClear) onClear();
  };

  const renderEndAdornment = () => {
    if (isLoading) {
      return (
        <InputAdornment position='end'>
          <CircularProgress size={20} thickness={2} disableShrink />
        </InputAdornment>
      );
    }

    if (value.length > 0) {
      return (
        <InputAdornment position='end' onMouseDown={handleSearchClear}>
          <CloseOutlined fontSize='small' />
        </InputAdornment>
      );
    }

    return null;
  };

  return (
    <StyledSearch className={className}>
      <InputLabel htmlFor={inputId} sx={sxStyles.label}>
        Search:
      </InputLabel>
      <SearchOutlined />

      <CoreTextField
        {...rest}
        id={inputId}
        size='small'
        placeholder={placeholder}
        value={value}
        onKeyDown={handleSearchKeyDown}
        onChange={handleSearchChange}
        endAdornment={renderEndAdornment()}
        InputProps={{
          ...InputProps,
          'aria-describedby': 'search-helper-text',
        }}
      />

      {helperText ? <CoreFormHelperText id='search-helper-text'>{helperText}</CoreFormHelperText> : null}
    </StyledSearch>
  );
};
