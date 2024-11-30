import { Controller, useFormContext } from 'react-hook-form';
import { CoreGrid, CoreTypography, CoreTextField, CoreBox, CoreMenuItem } from '@youscience/core';
import { UserInviteSchema } from '@features/invitations/UserInvite/constants';
import { COUNTRY_OPTIONS, USA_STATES } from '@constants';
import { sxStyles } from '../UserInviteDetailsForm.Styles';

export const AddressFields = () => {
  const { control, formState } = useFormContext<UserInviteSchema>();
  const { errors } = formState;
  const addressFieldData = [
    {
      key: 'primary',
      label: 'Address 1:',
    },
    {
      key: 'secondary',
      label: 'Address 2:',
    },
  ];

  return (
    <>
      {addressFieldData.map((field, index) => (
        <CoreGrid item xs={12} sm={6} key={`${field.key}`}>
          <CoreBox sx={sxStyles.wrapper}>
            <CoreTypography sx={sxStyles.textStyles}>{field.label}</CoreTypography>
            <Controller
              name={`profile.addresses.${index}.lines`}
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  inputProps={{
                    'data-testid': `PERSONAL_INFO_ADDRESS_LINES${index === 0 ? '_PRIMARY' : '_SECONDARY'}`,
                  }}
                  error={!!errors?.profile?.addresses?.[index]?.lines}
                  helperText={errors?.profile?.addresses?.[index]?.lines?.message}
                  sx={sxStyles.fieldStyles}
                  variant='standard'
                />
              )}
            />
          </CoreBox>

          <CoreBox sx={sxStyles.wrapper}>
            <CoreTypography sx={sxStyles.textStyles}>City:</CoreTypography>
            <Controller
              name={`profile.addresses.${index}.city`}
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  inputProps={{ 'data-testid': `PERSONAL_INFO_ADDRESS_CITY${index === 0 ? '_PRIMARY' : '_SECONDARY'}` }}
                  error={!!errors?.profile?.addresses?.[index]?.city}
                  helperText={errors?.profile?.addresses?.[index]?.city?.message}
                  sx={sxStyles.fieldStyles}
                  variant='standard'
                />
              )}
            />
          </CoreBox>

          <CoreBox sx={sxStyles.wrapper}>
            <CoreTypography sx={sxStyles.textStyles}>State:</CoreTypography>
            <Controller
              name={`profile.addresses.${index}.state`}
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  inputProps={{
                    'data-testid': `PERSONAL_INFO_ADDRESS_STATE${index === 0 ? '_PRIMARY' : '_SECONDARY'}`,
                  }}
                  error={!!errors?.profile?.addresses?.[index]?.state}
                  helperText={errors?.profile?.addresses?.[index]?.state?.message}
                  select
                  sx={sxStyles.fieldStyles}
                  value={rest.value ?? ''}
                  variant='standard'
                >
                  {USA_STATES.map((item) => (
                    <CoreMenuItem key={item.value ?? 'none'} value={item.value ?? ''}>
                      {item.label}
                    </CoreMenuItem>
                  ))}
                </CoreTextField>
              )}
            />
          </CoreBox>

          <CoreBox sx={sxStyles.wrapper}>
            <CoreTypography sx={sxStyles.textStyles}>Country:</CoreTypography>
            <Controller
              name={`profile.addresses.${index}.country`}
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  inputProps={{
                    'data-testid': `PERSONAL_INFO_ADDRESS_COUNTRY${index === 0 ? '_PRIMARY' : '_SECONDARY'}`,
                  }}
                  error={!!errors?.profile?.addresses?.[index]?.country}
                  helperText={errors?.profile?.addresses?.[index]?.country?.message}
                  select
                  sx={sxStyles.fieldStyles}
                  value={(rest.value === 'USA' ? 'US' : rest.value ?? '') as string}
                  variant='standard'
                >
                  {COUNTRY_OPTIONS.map((item) => (
                    <CoreMenuItem key={item.value ?? 'none'} value={item.value === 'USA' ? 'US' : item.value ?? ''}>
                      {rest.value === 'USA' ? COUNTRY_OPTIONS.find((item) => item.value === 'US')?.label : item.label}
                    </CoreMenuItem>
                  ))}
                </CoreTextField>
              )}
            />
          </CoreBox>

          <CoreBox sx={sxStyles.wrapper}>
            <CoreTypography sx={sxStyles.textStyles}>Zip:</CoreTypography>
            <Controller
              name={`profile.addresses.${index}.postCode`}
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  inputProps={{ 'data-testid': `PERSONAL_INFO_ADDRESS_ZIP${index === 0 ? '_PRIMARY' : '_SECONDARY'}` }}
                  error={!!errors?.profile?.addresses?.[index]?.country}
                  helperText={errors?.profile?.addresses?.[index]?.country?.message}
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
