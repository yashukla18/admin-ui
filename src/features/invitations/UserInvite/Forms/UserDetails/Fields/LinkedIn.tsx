import { Controller, useFormContext } from 'react-hook-form';
import { CoreGrid, CoreTypography, CoreTextField, CoreBox } from '@youscience/core';
import { UserInviteSchema } from '@features/invitations/UserInvite/constants';
import { sxStyles } from '../UserInviteDetailsForm.Styles';

export const LinkedIn = () => {
  const { control, formState } = useFormContext<UserInviteSchema>();
  const { errors } = formState;

  return (
    <CoreGrid item xs={12}>
      <CoreBox sx={sxStyles.wrapper}>
        <CoreTypography sx={sxStyles.textStyles}>LinkedIn:</CoreTypography>
        <Controller
          name='profile.linkedIn'
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <CoreTextField
              {...rest}
              error={!!errors?.profile?.linkedIn}
              helperText={errors?.profile?.linkedIn?.message}
              inputProps={{ 'data-testid': 'PERSONAL_INFO_LINKEDIN' }}
              sx={sxStyles.fieldStyles}
              variant='standard'
            />
          )}
        />
      </CoreBox>
    </CoreGrid>
  );
};
