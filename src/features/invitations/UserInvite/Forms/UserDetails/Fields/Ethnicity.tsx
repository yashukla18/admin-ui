import { Controller, useFormContext } from 'react-hook-form';
import { CoreGrid, CoreTypography, CoreTextField, CoreBox, CoreMenuItem } from '@youscience/core';
import { UserInviteSchema } from '@features/invitations/UserInvite/constants';
import { ETHNICITY_OPTIONS } from '@constants';
import { sxStyles } from '../UserInviteDetailsForm.Styles';

export const Ethnicity = () => {
  const { control, formState } = useFormContext<UserInviteSchema>();
  const { errors } = formState;

  return (
    <CoreGrid item xs={12}>
      <CoreBox sx={sxStyles.wrapper}>
        <CoreTypography sx={sxStyles.textStyles}>Race/ethnicity:</CoreTypography>
        <Controller
          name='profile.ethnicity'
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <CoreTextField
              {...rest}
              error={!!errors?.profile?.ethnicity}
              helperText={errors?.profile?.ethnicity?.message}
              select
              SelectProps={{ multiple: true }}
              sx={sxStyles.fieldStyles}
              variant='standard'
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
    </CoreGrid>
  );
};
