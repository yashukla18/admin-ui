import { FormProvider } from 'react-hook-form';
import { CoreGrid } from '@youscience/core';
import { DetailsCard } from '@components/ui/DetailsCard';
import { UserInviteProps } from '../../constants';
import { PersonalInfo } from './Fields/PersonalInfoUserInvite';
import { EmailFields } from './Fields/EmaiFieldsUserInvite';
import { LinkedIn } from './Fields/LinkedIn';
import { PhoneFields } from './Fields/PhoneFieldsUserInvite';
import { AddressFields } from './Fields/AddressFieldsUserInvite';
import { Ethnicity } from './Fields/Ethnicity';

export const UserInviteDetailsForm = ({ methods }: UserInviteProps) => {
  return (
    <DetailsCard containerStyles={{ mt: 2 }} title='User details'>
      <FormProvider {...methods}>
        <form id='user-details-form'>
          <CoreGrid container spacing={2}>
            <PersonalInfo />

            <EmailFields />

            <LinkedIn />

            <PhoneFields />

            <AddressFields />

            <Ethnicity />
          </CoreGrid>
        </form>
      </FormProvider>
    </DetailsCard>
  );
};
