/* eslint-disable no-extra-boolean-cast */
import { CoreBox, CoreMenuItem, CoreTextField } from '@youscience/core';
import { Controller, useFormContext } from 'react-hook-form';
import { UserFormValues } from '@features/users/constants/detailsForm';
import { ETHNICITY_OPTIONS } from '@constants';
import { BasicDateField } from '@components/ui/BasicDateField/BasicDateField';
import { dateToUTCDateObj } from '@utils/dateToUTCDateObj';

export const PersonalInfo = () => {
  const { control, formState } = useFormContext<UserFormValues>();
  const { errors } = formState;

  return (
    <CoreBox sx={{ maxWidth: '45%', width: '100%', display: 'flex', flexDirection: 'column', rowGap: 4 }}>
      <Controller
        control={control}
        name='fullName'
        render={({ field: { ref, ...rest } }) => (
          <CoreTextField
            {...rest}
            error={!!errors?.fullName}
            helperText={errors?.fullName?.message}
            InputProps={{ sx: { borderRadius: '6px', width: '100%' } }}
            label='Name'
            value={rest.value}
          />
        )}
      />

      <Controller
        control={control}
        name='displayName'
        render={({ field: { ref, ...rest } }) => (
          <CoreTextField
            {...rest}
            error={!!errors?.displayName}
            helperText={errors?.displayName?.message}
            InputProps={{ sx: { borderRadius: '6px', width: '100%' } }}
            label='Preferred name'
            value={rest.value}
          />
        )}
      />

      <Controller
        control={control}
        name='profile.graduationYear'
        render={({ field: { ref, ...rest } }) => (
          <CoreTextField
            {...rest}
            helperText={errors?.fullName?.message}
            InputProps={{ sx: { borderRadius: '6px', width: '100%' } }}
            type='number'
            label='Graduation year'
            value={rest.value}
          />
        )}
      />

      <Controller
        control={control}
        name='profile.dateOfBirth'
        render={({ field: { ref, value, ...rest } }) => (
          <BasicDateField
            {...rest}
            label='Date of birth'
            value={!!value ? dateToUTCDateObj(value as unknown as Date) : null}
          />
        )}
      />

      <Controller
        control={control}
        name='profile.linkedIn'
        render={({ field: { ref, ...rest } }) => (
          <CoreTextField
            {...rest}
            helperText={errors?.fullName?.message}
            InputProps={{ sx: { borderRadius: '6px', width: '100%' } }}
            label='LinkedIn'
            value={rest.value}
          />
        )}
      />

      <Controller
        name='profile.ethnicity'
        control={control}
        render={({ field: { ref, ...rest } }) => (
          <CoreTextField
            {...rest}
            error={!!errors?.profile?.ethnicity}
            fullWidth
            helperText={errors?.profile?.ethnicity?.message}
            InputProps={{ sx: { borderRadius: '6px', width: '100%' } }}
            label='Race/ethnicity'
            select
            SelectProps={{ multiple: true }}
            size='small'
            value={rest.value ?? ''}
          >
            {ETHNICITY_OPTIONS.map((item) => (
              <CoreMenuItem key={item.value ?? 'none'} value={item.value ?? ''}>
                {item.label}
              </CoreMenuItem>
            ))}
          </CoreTextField>
        )}
      />
    </CoreBox>
  );
};
