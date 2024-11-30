/* eslint-disable react/jsx-no-duplicate-props */
import { Controller, useFormContext } from 'react-hook-form';
import { CoreGrid, CoreTypography, CoreTextField, CoreBox } from '@youscience/core';
import { UserInviteSchema } from '@features/invitations/UserInvite/constants';
import { BasicDateField } from '@components/ui/BasicDateField/BasicDateField';
import { dateToUTCDateObj } from '@utils/dateToUTCDateObj';
import { useOrgListStore } from '@stores/orgListStore';
import { isUtahOnlyAccess } from '@utils/helper';
import { sxStyles } from '../UserInviteDetailsForm.Styles';

export const PersonalInfo = () => {
  const { control, formState } = useFormContext<UserInviteSchema>();
  const { errors } = formState;
  const { orgList } = useOrgListStore((state) => state);
  const utahOnlyAccess = isUtahOnlyAccess(orgList);

  return (
    <>
      <CoreGrid item xs={12}>
        <CoreBox sx={sxStyles.wrapper}>
          <CoreTypography sx={sxStyles.textStyles}>
            <span style={{ color: 'red' }}>*</span>Name:
          </CoreTypography>
          <Controller
            name='fullName'
            control={control}
            render={({ field: { ref, ...rest } }) => (
              <CoreTextField
                {...rest}
                error={!!errors?.fullName}
                helperText={errors?.fullName?.message}
                inputProps={{ 'data-testid': 'PERSONAL_INFO_FULL_NAME' }}
                InputProps={{ sx: { borderRadius: '6px', width: '100%' } }}
                sx={sxStyles.fieldStyles}
                variant='standard'
              />
            )}
          />
        </CoreBox>
      </CoreGrid>
      <CoreGrid item xs={12}>
        <CoreBox sx={sxStyles.wrapper}>
          <CoreTypography sx={sxStyles.textStyles}>Preferred Name:</CoreTypography>
          <Controller
            name='displayName'
            control={control}
            render={({ field: { ref, ...rest } }) => (
              <CoreTextField
                {...rest}
                error={!!errors?.displayName}
                helperText={errors?.displayName?.message}
                inputProps={{ 'data-testid': 'PERSONAL_INFO_DISPLAY_NAME' }}
                sx={sxStyles.fieldStyles}
                variant='standard'
              />
            )}
          />
        </CoreBox>
      </CoreGrid>
      <CoreGrid item xs={12}>
        <CoreBox sx={sxStyles.wrapper}>
          <CoreTypography sx={sxStyles.textStyles}>Graduation year:</CoreTypography>
          <Controller
            name='profile.graduationYear'
            control={control}
            render={({ field: { ref, ...rest } }) => (
              <CoreTextField
                {...rest}
                error={!!errors?.profile?.graduationYear}
                helperText={errors?.profile?.graduationYear?.message}
                inputProps={{ 'data-testid': 'PERSONAL_INFO_GRADUATION_YEAR' }}
                sx={sxStyles.fieldStyles}
                type='number'
                value={rest.value ?? ''}
                variant='standard'
              />
            )}
          />
        </CoreBox>
      </CoreGrid>
      <CoreGrid item xs={12}>
        <CoreBox sx={sxStyles.wrapper}>
          <CoreTypography sx={sxStyles.textStyles}>
            {utahOnlyAccess && <span style={{ color: 'red' }}>*</span>}
            Date of birth:
          </CoreTypography>
          <Controller
            name='profile.dateOfBirth'
            control={control}
            render={({ field: { ref, value, ...rest } }) => (
              <BasicDateField
                {...rest}
                error={!!errors?.profile?.dateOfBirth}
                helperText={errors?.profile?.dateOfBirth?.message}
                sx={sxStyles.fieldStyles}
                inputProps={{ 'data-testid': 'PERSONAL_INFO_DATE_OF_BIRTH' }}
                value={value ? dateToUTCDateObj(value as unknown as Date) : null}
                variant='standard'
              />
            )}
          />
        </CoreBox>
      </CoreGrid>
    </>
  );
};
