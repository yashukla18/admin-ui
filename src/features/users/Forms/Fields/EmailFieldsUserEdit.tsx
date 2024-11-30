import { Fragment } from 'react';
import { Divider } from '@mui/material';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { CoreBox, CoreTextField } from '@youscience/core';
// constants/interfaces
import { UserFormValues } from '../../constants/detailsForm';

export const EmailFields = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<UserFormValues>();
  const { fields } = useFieldArray({
    control,
    name: 'profile.emails',
  });

  return (
    <CoreBox sx={{ display: 'flex', gap: 4 }}>
      <CoreBox sx={{ width: '100%', display: 'flex', rowGap: 4 }}>
        {fields.map((email, i) => (
          <Fragment key={email.id}>
            <Controller
              control={control}
              name={`profile.emails.${i}.address`}
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField
                  {...rest}
                  error={!!errors?.profile?.emails?.[i]?.address}
                  InputProps={{ sx: { borderRadius: '6px' } }}
                  fullWidth
                  label={i === 0 ? 'Primary email' : 'Secondary email (optional)'}
                  size='small'
                  value={rest.value}
                />
              )}
            />
            {(i === 0 || i % 2 === 0) && fields.length > 1 ? (
              <Divider orientation='vertical' variant='fullWidth' sx={{ height: '50px', mx: 4, mt: '-4px' }} />
            ) : null}
          </Fragment>
        ))}
      </CoreBox>
    </CoreBox>
  );
};
