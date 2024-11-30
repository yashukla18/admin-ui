/* eslint-disable no-nested-ternary */
import { OrganizationFormValues } from '@features/organizations/constants/detailsForm';
import { CoreBox, CoreMenuItem, CoreTextField } from '@youscience/core';
import { Controller, useController, useFormContext } from 'react-hook-form';
import { ORG_SELECT_OPTIONS } from '@features/organizations/OrganizationsTable/constants';
import { ReactNode, useEffect, useState } from 'react';
import { classificationOfWhichType } from '@utils/formatOrganizationForEdit';
import { formFieldsSx } from './Fields.styles';

export const GeneralInfo = ({ isGeorgiaOrg }: { isGeorgiaOrg: boolean }) => {
  const [isType, setIsType] = useState<string>('');

  const {
    control,
    formState: { errors },
  } = useFormContext<OrganizationFormValues>();

  const { field: controllerField } = useController({
    control,
    name: 'classification.type',
  });

  useEffect(() => {
    setIsType(classificationOfWhichType(controllerField?.value));
  }, [controllerField.value]);

  return (
    <CoreBox sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Controller
        control={control}
        name='name'
        render={({ field: { ref, ...rest } }) => (
          <CoreTextField
            {...rest}
            error={!!errors?.name}
            helperText={errors?.name?.message}
            fullWidth
            InputLabelProps={{ sx: formFieldsSx.requiredInputLabelSx }}
            InputProps={{ sx: formFieldsSx.inputPropsSx }}
            label='Name'
            required
            value={rest.value}
          />
        )}
      />

      <CoreBox sx={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 6, justifyContent: 'space-around' }}>
        <Controller
          control={control}
          name='classification.type'
          render={({ field: { ref, ...rest } }) => (
            <CoreTextField
              {...rest}
              disabled={isGeorgiaOrg}
              error={!!errors?.classification?.type}
              fullWidth
              InputLabelProps={{ sx: formFieldsSx.requiredInputLabelSx }}
              InputProps={{ sx: { ...formFieldsSx.inputPropsSx } }}
              label='Organization Type'
              required
              select
              value={rest.value}
            >
              {ORG_SELECT_OPTIONS.reduce((acc: ReactNode[], item) => {
                if (item.value !== 'postSecondary') {
                  acc.push(
                    <CoreMenuItem key={item.value ?? 'none'} value={item.value ?? ''}>
                      {item.label}
                    </CoreMenuItem>,
                  );
                }
                return acc;
              }, [])}
            </CoreTextField>
          )}
        />

        {isType === 'nces' ? (
          <>
            <Controller
              control={control}
              name='classification.nces.name'
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  error={!!errors?.classification?.nces?.name}
                  InputProps={{ sx: formFieldsSx.inputPropsSx }}
                  fullWidth
                  label='NCES Name'
                  value={rest.value}
                  disabled={isGeorgiaOrg}
                />
              )}
            />
            <Controller
              control={control}
              name='classification.nces.ncesId'
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  error={!!errors?.classification?.nces?.ncesId}
                  helperText={errors?.classification?.nces?.ncesId?.message}
                  InputProps={{ sx: formFieldsSx.inputPropsSx }}
                  fullWidth
                  label='NCES ID'
                  value={rest.value}
                  disabled={isGeorgiaOrg}
                />
              )}
            />
            <Controller
              control={control}
              name='classification.nces.stateId'
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  error={!!errors?.classification?.nces?.stateId}
                  InputProps={{ sx: formFieldsSx.inputPropsSx }}
                  fullWidth
                  label='State ID'
                  value={rest.value}
                  disabled={isGeorgiaOrg}
                />
              )}
            />
          </>
        ) : isType === 'ipeds' ? (
          <Controller
            control={control}
            name='classification.ipeds.ipedsId'
            render={({ field: { ref, ...rest } }) => (
              <CoreTextField
                {...rest}
                error={!!errors?.classification?.ipeds?.ipedsId}
                InputProps={{ sx: formFieldsSx.inputPropsSx }}
                fullWidth
                label='IPEDS ID'
                value={rest.value}
              />
            )}
          />
        ) : null}
      </CoreBox>
    </CoreBox>
  );
};
