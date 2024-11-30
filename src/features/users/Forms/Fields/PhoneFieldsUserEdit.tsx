import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CoreBox } from '@youscience/core';
import { Divider } from '@mui/material';
import { InputMask } from '@components/ui/InputMask';
// constants/interfaces
import { UserFormValues } from '../../constants/detailsForm';

export const PhoneFields = () => {
  const { control } = useFormContext<UserFormValues>();
  const { fields } = useFieldArray({
    control,
    name: 'profile.phones',
  });

  return (
    <CoreBox sx={{ display: 'flex', gap: 4 }}>
      <CoreBox sx={{ width: '100%', display: 'flex', rowGap: 4 }}>
        {fields.map((phone, i) => (
          <Fragment key={phone.id}>
            {/* TODO: need to figure out phone InputMask */}
            <InputMask
              control={control}
              label={i === 0 ? 'Primary phone' : 'Secondary phone (optional)'}
              name={`profile.phones.${i}.number`}
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
