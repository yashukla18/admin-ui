import { COUNTRY_OPTIONS, USA_STATES } from '@constants';
import { CoreBox, CoreMenuItem, CoreTextField, CoreTypography } from '@youscience/core';
import { Controller, useFormContext } from 'react-hook-form';
import { OrganizationFormValues } from '@features/organizations/constants/detailsForm';
import { formFieldsSx } from './Fields.styles';

export const AddressField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<OrganizationFormValues>();

  return (
    <CoreBox sx={{ my: 8 }}>
      <CoreTypography sx={{ ...formFieldsSx.fieldHeading, mb: 8 }} variant='h6'>
        Address
      </CoreTypography>
      <CoreBox sx={{ width: '100%', display: 'flex' }}>
        <CoreBox sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 6, mr: 6 }}>
          <Controller
            control={control}
            name='addresses.0.lines'
            render={({ field: { ref, ...rest } }) => (
              <CoreTextField
                {...rest}
                fullWidth
                label='Address Line 1'
                InputProps={{ sx: { borderRadius: '6px' } }}
                error={!!errors?.addresses?.[0]?.lines}
                helperText={errors?.addresses?.[0]?.lines?.message}
              />
            )}
          />

          <Controller
            control={control}
            name='addresses.0.city'
            render={({ field: { ref, ...rest } }) => (
              <CoreTextField
                {...rest}
                error={!!errors?.addresses?.[0]?.city}
                fullWidth
                InputProps={{ sx: formFieldsSx.inputPropsSx }}
                label='City'
                placeholder='City'
                value={rest.value !== ' ' ? rest.value : null}
              />
            )}
          />

          <Controller
            control={control}
            name='addresses.0.state'
            render={({ field: { ref, ...rest } }) => (
              <CoreTextField
                {...rest}
                error={!!errors?.addresses?.[0]?.state}
                fullWidth
                InputLabelProps={{ sx: formFieldsSx.requiredInputLabelSx }}
                InputProps={{ sx: formFieldsSx.inputPropsSx }}
                label='State'
                placeholder='State'
                required
                select
                value={rest.value !== ' ' ? rest.value : null}
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
            name='addresses.0.postCode'
            render={({ field: { ref, ...rest } }) => (
              <CoreTextField
                {...rest}
                error={!!errors?.addresses?.[0]?.postCode}
                fullWidth
                InputProps={{ sx: formFieldsSx.inputPropsSx }}
                label='Zip Code'
                placeholder='Zip Code'
                value={rest.value !== ' ' ? rest.value : null}
              />
            )}
          />

          <Controller
            control={control}
            name='addresses.0.country'
            render={({ field: { ref, ...rest } }) => (
              <CoreTextField
                {...rest}
                error={!!errors?.addresses?.[0]?.country}
                fullWidth
                helperText={errors?.addresses?.[0]?.country?.message}
                label='Country'
                select
                size='small'
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
      </CoreBox>
    </CoreBox>
  );
};
