import { ChangeEvent, FocusEvent } from 'react';
import { FormControl, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';
import { CoreTextField } from '@youscience/core';
import { InputMaskProps, PREFIX, REGEX, SEPARATOR } from './inputMaskConstants';

export const InputMask = (props: InputMaskProps) => {
  const {
    name,
    label,
    control,
    isDisabled,
    onChange,
    placeholder,
    variant = 'outlined',
    width,
    error,
    dataTestId,
  } = props;

  return (
    <FormControl size='small' fullWidth>
      <Controller
        name={name}
        control={control}
        defaultValue=''
        render={({ field: { ref, ...rest }, fieldState }) => {
          const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const inputValue = event.target.value;

            if (inputValue.slice(3).replace(/[-\d]/g, '')) {
              return null;
            }

            const [value = PREFIX] = inputValue.match(REGEX) ?? [];

            let newValue = value;

            if (!inputValue) {
              newValue = PREFIX;
            }

            if (value.length === 3 && inputValue.length > 3) {
              newValue = `${PREFIX}${inputValue.slice(2)}`;
            }

            if (value.length === 7 && value.charAt(inputValue.length - 1) !== SEPARATOR) {
              newValue = `${value.slice(0, 6)}-${value.slice(6)}`;
            }

            if (inputValue.length >= 8 && inputValue.length <= 10) {
              const separatorIndex = inputValue.indexOf(SEPARATOR);

              if (separatorIndex < 0) {
                return null;
              }
            }

            if (inputValue.length > 11) {
              const isCorrectFormat = inputValue.split('').filter((symbol) => symbol === SEPARATOR).length === 2;

              if (!isCorrectFormat) {
                return null;
              }
            }

            if (value.length === 10) {
              newValue = `${value.slice(0, 10)}-${value.slice(10)}`;
            }

            if (inputValue.length === 11 && value.charAt(inputValue.length - 1) !== SEPARATOR) {
              newValue = `${inputValue.slice(0, 10)}-${inputValue.slice(10)}`;
            }

            if (onChange) {
              onChange({
                target: {
                  value: newValue,
                  name,
                },
              } as ChangeEvent<HTMLInputElement>);
            } else {
              rest.onChange(newValue);
            }

            return null;
          };

          const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
            const inputValue = event.target.value;
            const initialValue = inputValue === PREFIX ? '' : inputValue;

            if (onChange) {
              onChange({
                target: {
                  value: initialValue,
                  name,
                },
              } as ChangeEvent<HTMLInputElement>);
            } else {
              rest.onChange(initialValue);
            }
          };

          const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
            const inputValue = event.target.value;
            const initialValue = !inputValue.length ? PREFIX : inputValue;

            if (onChange) {
              onChange({
                target: {
                  value: initialValue,
                  name,
                },
              } as ChangeEvent<HTMLInputElement>);
            } else {
              rest.onChange(initialValue);
            }
          };
          // eslint-disable-next-line
          const handlePressKey = (event: any) => {
            const {
              keyCode,
              target: { value },
            } = event as ChangeEvent<HTMLInputElement> & KeyboardEvent;

            if (keyCode === 8 && value.endsWith(SEPARATOR)) {
              rest.onChange(value.slice(0, value.length - 1));
            }
          };

          return (
            <>
              <CoreTextField
                {...rest}
                variant={variant}
                disabled={isDisabled}
                inputProps={{ label: null, 'data-testid': dataTestId }}
                label={label}
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
                onKeyUp={handlePressKey}
                placeholder={placeholder}
                sx={{
                  borderRadius: '6px',
                  width,
                }}
                error={error}
              />

              {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
            </>
          );
        }}
      />
    </FormControl>
  );
};
