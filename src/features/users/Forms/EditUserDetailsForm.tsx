import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CoreBox, CoreButton, CoreTypography } from '@youscience/core';
import { DetailsCard } from '@components/ui/DetailsCard';
import { UserDocument, UserDocumentOmitId } from '@youscience/user-service-common';
import { formatUserForEdit } from '@utils/formatUserForEdit';
import { useNotifyStore } from '@stores/notifyStore';
import Loader from '@components/ui/Loader';
import { AxiosErrorWithResponse } from '@interfaces';
import { useCustomDialog } from '@hooks/useCustomDialog/CustomDialog';
import { PhoneFields } from './Fields/PhoneFieldsUserEdit';
import { EmailFields } from './Fields/EmailFieldsUserEdit';
import { AddressFields } from './Fields/AddressFieldsUserEdit';
import { USER_VALIDATION_SCHEMA, UserFormValues } from '../constants/detailsForm';
import { PersonalInfo } from './Fields/PersonalInfoUserEdit';
import { usersService } from '../services/users.service';
import { updatedUser, userFormSanitizer } from './editUserFormSanitizer';
import { DetailsFormProps } from './EditUserDetailsForm.types';

export const DetailsForm: FC<DetailsFormProps> = ({ user }) => {
  const navigate = useNavigate();
  const notify = useNotifyStore((state) => state.notify);
  const { openDialog, closeDialog, CustomDialog } = useCustomDialog();
  const [loading, setLoading] = useState<boolean>(false);
  const formattedUserForEdit = formatUserForEdit(user);

  const initialState = {
    ...formattedUserForEdit,
  } as UserFormValues;

  const methods = useForm<UserFormValues>({
    defaultValues: initialState,
    resolver: zodResolver(USER_VALIDATION_SCHEMA),
  });

  const handleCancel = () => {
    if (methods.formState.isDirty) {
      openDialog();
    } else {
      methods.reset();
      navigate(-1);
    }
  };

  const handleConfirmCancel = () => {
    closeDialog();
    navigate(-1);
  };

  const handleContinueEditing = () => {
    closeDialog();
  };

  // TODO Move this to a separate component
  const handleFormSubmit = async (userId: string, values: Partial<UserDocumentOmitId>) => {
    try {
      setLoading(true);
      const response = await usersService.apiUpdateUserById(userId, values);

      if (response) {
        notify({ message: `User successfully updated ${response.fullName}`, severity: 'success' });
        navigate(-1);
      }
    } catch (error) {
      const xerror = error as AxiosErrorWithResponse;
      const axiosErrorMessage = xerror?.response;
      let errorMessage = `An error occurred while updating.`;

      if (String(axiosErrorMessage?.data?.error).valueOf().includes('Forbid removing of properties.')) {
        errorMessage = "Sorry! You don't have necessary permission";
      }
      notify({ message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors: unknown) => {
    // eslint-disable-next-line no-console
    console.log(errors);
  };

  const onSubmit: SubmitHandler<UserFormValues> = (data) => {
    const sanitizedExistingUser = userFormSanitizer(user as UserFormValues) as UserDocument;

    void handleFormSubmit(user.userId, updatedUser(sanitizedExistingUser, userFormSanitizer(data)));
  };

  return (
    <DetailsCard
      containerStyles={{ mt: 2 }}
      title='User details'
      titleAdornment={
        <CoreBox sx={{ width: 'fit-content' }}>
          <CoreButton sx={{ mr: 4 }} color='secondary' onClick={handleCancel} variant='outlined'>
            Cancel
          </CoreButton>
          <CoreButton
            color='secondary'
            disabled={!methods.formState.isDirty}
            form='user-form'
            sx={{ mr: 4 }}
            type='submit'
            variant='contained'
          >
            Save
          </CoreButton>
        </CoreBox>
      }
    >
      <Loader loading={loading} />
      <FormProvider {...methods}>
        <form id='user-form' onSubmit={methods.handleSubmit(onSubmit, onError)} />
        <CoreTypography fontWeight='bold' mb={3} mt={3}>
          Personal information
        </CoreTypography>

        <PersonalInfo />

        <CoreTypography fontWeight='bold' mb={3} mt={3}>
          Email
        </CoreTypography>

        <EmailFields />

        <CoreTypography mb={3} mt={3} fontWeight='bold'>
          Address
        </CoreTypography>

        <AddressFields />

        <CoreTypography fontWeight='bold' mb={3} mt={3}>
          Phone
        </CoreTypography>

        <PhoneFields />
      </FormProvider>
      <CustomDialog
        contentText={
          <>You are about to leave this page. All changes will be lost. Do you want to leave without saving?</>
        }
        onCancel={handleContinueEditing}
        onConfirm={handleConfirmCancel}
        title='Unsaved Changes'
      />
    </DetailsCard>
  );
};
