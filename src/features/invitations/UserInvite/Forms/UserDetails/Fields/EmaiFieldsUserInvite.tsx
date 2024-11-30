import { Controller, useFormContext } from 'react-hook-form';
import { CoreGrid, CoreTypography, CoreTextField, CoreBox } from '@youscience/core';
import { UserInviteSchema } from '@features/invitations/UserInvite/constants';
import { sxStyles } from '../UserInviteDetailsForm.Styles';

export const EmailFields = () => {
  const { control, formState } = useFormContext<UserInviteSchema>();
  const { errors } = formState;
  const emailFieldData = [
    {
      key: 'primary',
      label: (
        <>
          <span style={{ color: 'red' }}>*</span>
          Primary Email:
        </>
      ),
    },
    {
      key: 'secondary',
      label: 'Secondary Email:',
    },
  ];

  return (
    <>
      {emailFieldData.map((field, index) => (
        <CoreGrid key={`${field.key}`} item xs={12} sm={6}>
          <CoreBox sx={sxStyles.wrapper}>
            <CoreTypography sx={sxStyles.textStyles}>{field.label}</CoreTypography>
            <Controller
              name={`profile.emails.${index}.address`}
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  value={rest.value || ''}
                  error={!!errors?.profile?.emails?.[index]?.address}
                  helperText={errors?.profile?.emails?.[index]?.address?.message}
                  inputProps={{ 'data-testid': `PERSONAL_INFO_EMAIL${index === 0 ? '_PRIMARY' : '_SECONDARY'}` }}
                  sx={sxStyles.fieldStyles}
                  variant='standard'
                />
              )}
            />
          </CoreBox>
        </CoreGrid>
      ))}
    </>
  );
};
