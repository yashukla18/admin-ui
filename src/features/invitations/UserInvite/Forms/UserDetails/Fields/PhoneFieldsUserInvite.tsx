import { Controller, useFormContext } from 'react-hook-form';
import { CoreGrid, CoreTypography, CoreBox } from '@youscience/core';
import { UserInviteSchema } from '@features/invitations/UserInvite/constants';
import { InputMask } from '@components/ui/InputMask';
import { sxStyles } from '../UserInviteDetailsForm.Styles';

export const PhoneFields = () => {
  const { control, formState } = useFormContext<UserInviteSchema>();
  const { errors } = formState;
  const phoneFieldData = [
    {
      key: 'primary',
      label: 'Phone number 1:',
      requiredLabel: '',
    },
    {
      key: 'secondary',
      label: 'Phone number 2:',
      requiredLabel: '',
    },
  ];

  return (
    <>
      {phoneFieldData.map((field, index) => (
        <CoreGrid key={`${field.key}`} item xs={12} sm={6}>
          <CoreBox sx={sxStyles.wrapper}>
            <CoreTypography sx={sxStyles.textStyles}>{field.label}</CoreTypography>
            <CoreBox>
              <Controller
                name={`profile.phones.${index}.number`}
                render={({ field: { ref, ...rest } }) => (
                  <InputMask
                    {...rest}
                    control={control}
                    error={!!errors?.profile?.phones?.[index]?.number}
                    helperText={errors?.profile?.phones?.[index]?.number?.message}
                    label={field.requiredLabel}
                    dataTestId={`PERSONAL_INFO_PHONE${index === 0 ? '_PRIMARY' : '_SECONDARY'}`}
                    variant='standard'
                    width='240px'
                  />
                )}
              />
            </CoreBox>
          </CoreBox>
        </CoreGrid>
      ))}
    </>
  );
};
