import { Fragment } from 'react';
import { CoreBox, CoreTextField, CoreMenuItem } from '@youscience/core';
import { useFieldArray, Controller, useFormContext } from 'react-hook-form';
import { Divider } from '@mui/material';
// constants
import { COUNTRY_OPTIONS, USA_STATES } from '@constants';
import { UserFormValues } from '../../constants/detailsForm';

export const AddressFields = () => {
  const { control, formState } = useFormContext<UserFormValues>();

  const { fields } = useFieldArray({
    control,
    name: 'profile.addresses',
  });
  const { errors } = formState;

  return (
    <CoreBox sx={{ width: '100%', display: 'flex' }}>
      {fields.map((address, i) => (
        <Fragment key={address.id}>
          <CoreBox sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
            <Controller
              control={control}
              name={`profile.addresses.${i}.lines`}
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  fullWidth
                  label='Street address'
                  InputProps={{ sx: { borderRadius: '6px' } }}
                  error={!!errors?.profile?.addresses?.[i]?.lines}
                  helperText={errors?.profile?.addresses?.[i]?.lines?.message ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name={`profile.addresses.${i}.city`}
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  fullWidth
                  InputProps={{ sx: { borderRadius: '6px' } }}
                  label='City'
                  sx={{ mt: 6 }}
                />
              )}
            />

            <Controller
              control={control}
              name={`profile.addresses.${i}.state`}
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  error={!!errors?.profile?.addresses?.[i]?.state}
                  fullWidth
                  helperText={errors?.profile?.addresses?.[i]?.state?.message}
                  label='State'
                  select
                  size='small'
                  sx={{ mt: 6 }}
                  InputProps={{ sx: { borderRadius: '6px' } }}
                  value={rest.value ?? ''}
                >
                  {USA_STATES.map((item) => (
                    <CoreMenuItem key={item.value ?? 'none'} value={item.value ?? ''}>
                      {item.label}
                    </CoreMenuItem>
                  ))}
                </CoreTextField>
              )}
            />

            <Controller
              control={control}
              name={`profile.addresses.${i}.postCode`}
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  fullWidth
                  InputProps={{ sx: { borderRadius: '6px' } }}
                  label='Postal code'
                  sx={{ mt: 6 }}
                />
              )}
            />

            <Controller
              control={control}
              name={`profile.addresses.${i}.country`}
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  error={!!errors?.profile?.addresses?.[i]?.country}
                  fullWidth
                  helperText={errors?.profile?.addresses?.[i]?.country?.message}
                  label='Country'
                  select
                  size='small'
                  sx={{ mt: 6 }}
                  InputProps={{ sx: { borderRadius: '6px' } }}
                  value={rest.value === 'USA' ? 'US' : rest.value ?? ''}
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
          {(i === 0 || i % 2 === 0) && fields.length > 1 ? (
            <Divider orientation='vertical' variant='fullWidth' sx={{ height: '275px', mx: 4, mt: '-4px' }} />
          ) : null}
        </Fragment>
      ))}
    </CoreBox>
  );
};
