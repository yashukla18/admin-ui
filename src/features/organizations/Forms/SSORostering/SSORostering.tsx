import { FC, useState } from 'react';
import { CoreBox, CoreTypography, CoreMenuItem, CoreTextField } from '@youscience/core';
import { Controller, useFormContext } from 'react-hook-form';
import { DeepPath } from '@youscience/user-service-common';

import { OrganizationFormValues } from '@features/organizations/constants/detailsForm';
import {
  allowedRosteringOrgTypes,
  NewRosterOptions,
  rosteringOptions,
  RosteringOptions,
  rosteringTypes,
} from './constants';

export type RosterProvider<P = RosteringOptions, T = boolean> = T extends true
  ? {
      rosteringEnabled: T;
      provider: P;
    }
  : {
      rosteringEnabled: T;
      provider?: P;
    };

export interface RosteringFormProps {
  provider: NewRosterOptions | { type: '' };
  rosteringEnabled: boolean;
}

export const SSORostering: FC<{
  deepPath: DeepPath[];
}> = ({ deepPath = [] }) => {
  const [provider, setProvider] = useState<string>('');

  const {
    control,
    getValues,
    watch,
    resetField,
    formState: { errors },
  } = useFormContext<OrganizationFormValues>();

  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProvider(e.target.value);
    resetField('provider.districtId', { keepDirty: true, defaultValue: '' });
    resetField('provider.schoolId', { keepDirty: true, defaultValue: '' });
    resetField('provider.systemId', { keepDirty: true, defaultValue: '' });
  };

  const isGeorgiaOrgDescendent =
    deepPath?.filter((deepPath) => deepPath.tenantId === import.meta.env.VITE_GEORGIA_ORG_ID)?.length > 0;

  const classificationType = watch('classification.type') ?? '';
  const disableRostering = !allowedRosteringOrgTypes.includes(classificationType);

  return (
    <>
      <CoreTypography sx={{ fontWeight: 'bold', mr: '120px', mb: 6 }}>Rostering provider/SSO</CoreTypography>
      <CoreBox sx={{ display: 'flex', width: '50%', pr: 6 }}>
        <CoreBox display='flex' flexDirection='column' mt={2} rowGap={4} sx={{ width: '100%' }}>
          <CoreBox rowGap={4} display='flex' flexDirection='column'>
            <Controller
              control={control}
              name='provider.type'
              defaultValue=''
              render={({ field: { ref, ...rest } }) => {
                return (
                  <CoreTextField
                    {...rest}
                    fullWidth
                    disabled={disableRostering}
                    helperText={disableRostering ? 'Rostering is not available for this organization type' : ''}
                    InputProps={{ sx: { borderRadius: '6px', width: '100%' } }}
                    label={provider ? 'Provider' : 'Select provider'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleProviderChange(e);
                      rest.onChange(e);
                    }}
                    placeholder='Provider'
                    select
                    sx={{ textTransform: 'capitalize' }}
                    value={rest.value}
                  >
                    <CoreMenuItem
                      key='None'
                      sx={{ textTransform: 'capitalize', '&:selected': { textTransform: 'capitalize' } }}
                      value=''
                    >
                      None
                    </CoreMenuItem>
                    {Object.keys(rosteringOptions)
                      .filter((rosterType) =>
                        // eslint-disable-next-line no-nested-ternary
                        rosterType !== 'GADOE' ? rosterType : isGeorgiaOrgDescendent ? rosterType : undefined,
                      )
                      .map((key) => (
                        <CoreMenuItem
                          key={key}
                          sx={{ textTransform: 'capitalize', '&:selected': { textTransform: 'capitalize' } }}
                          value={key}
                        >
                          {key === 'GADOE' ? 'Georgia DOE' : key}
                        </CoreMenuItem>
                      ))}
                  </CoreTextField>
                );
              }}
            />

            {getValues('provider.type') ? (
              <>
                {Object.keys(rosteringOptions[getValues('provider.type') as unknown as keyof typeof rosteringOptions])
                  .filter((providerType) =>
                    (providerType === 'GeorgiaDoe' || providerType === 'GADOE') && isGeorgiaOrgDescendent
                      ? providerType
                      : providerType !== 'GeorgiaDoe',
                  )
                  .map((option, i) => {
                    if (!option) return null;
                    const label =
                      `${
                        rosteringOptions[getValues('provider.type') as keyof typeof rosteringOptions][
                          option as keyof (typeof rosteringTypes)[typeof i]
                        ]
                      }` || `${option}`;

                    return (
                      <Controller
                        control={control}
                        key={`${option}`}
                        name={`provider.${option}` as keyof OrganizationFormValues['provider']}
                        render={({ field: { ref, ...rest } }) => {
                          return (
                            <CoreTextField
                              {...rest}
                              error={!!errors?.provider?.[option as keyof typeof errors.provider]}
                              fullWidth
                              helperText={
                                (
                                  errors?.provider?.[option as keyof typeof errors.provider] as
                                    | { message?: string }
                                    | undefined
                                )?.message ?? ''
                              }
                              InputLabelProps={{ sx: { span: { color: 'red' } } }}
                              InputProps={{ sx: { borderRadius: '6px', width: '100%' } }}
                              label={label === 'GADOE' ? 'Georgia DOE' : label}
                              placeholder={label === 'GADOE' ? 'Georgia DOE' : label}
                              required={option !== 'type'}
                              sx={{ textTransform: 'capitalize', mt: 2 }}
                              value={rest.value}
                            />
                          );
                        }}
                      />
                    );
                  })}

                {/*
                // Uncomment this code when Skyward is ready

                {getValues('provider.type') === 'Skyward' ? (
                  <CoreBox display='flex'>
                    <CoreTypography sx={{ mb: 3, mt: 2, mr: 4 }}>Rostering enabled </CoreTypography>
                    <Controller
                      control={control}
                      name='rosteringEnabled'
                      render={({ field: { ref, ...rest } }) => (
                        <CoreSwitch {...rest} checked={rest.value} name='rosteringEnabled' onChange={rest.onChange} />
                      )}
                    />
                    <CoreTypography sx={{ mb: 3, mt: 2 }}>
                      {getValues('rosteringEnabled') ? `Yes` : `No`}
                    </CoreTypography>
                  </CoreBox>
                ) : null} */}
              </>
            ) : null}
          </CoreBox>
        </CoreBox>
      </CoreBox>
    </>
  );
};
