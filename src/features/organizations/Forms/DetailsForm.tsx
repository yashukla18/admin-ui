/* eslint-disable consistent-return */
import { FC, useState } from 'react';
import { DetailsCard } from '@components/ui/DetailsCard';
import { CoreBox, CoreButton } from '@youscience/core';
import Loader from '@components/ui/Loader';
import { FieldError, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useNotifyStore } from '@stores/notifyStore';
import { tenantService } from '@services/tenant.service';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  EditOrgDetailsFrom,
  formatOrganizationForEdit,
  formatSubmittableTenantData,
} from '@utils/formatOrganizationForEdit';
import { TenantDocument } from '@youscience/user-service-common';
import { CircularProgress } from '@mui/material';
import ConditionWrapper from '@components/ui/ConditionWrapper';
import { AxiosErrorWithResponse } from '@interfaces';
import { useCustomDialog } from '@hooks/useCustomDialog/CustomDialog';
import { ORGANIZATION_VALIDATION_SCHEMA, OrganizationFormValues } from '../constants/detailsForm';
import { AddressField } from './Fields/AddressField';
import { ParentOrgField } from './Fields/ParentOrgField';
import { DetailsFormProps } from './DetailsForm.type';
import { GeneralInfo } from './Fields/GeneralInfo';

export const DetailsForm: FC<DetailsFormProps> = ({ organization, isNew }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [parentLoading, setParentLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const notify = useNotifyStore((state) => state.notify);
  const { openDialog, closeDialog, CustomDialog } = useCustomDialog();

  const formattedOrganizationForEdit = formatOrganizationForEdit(organization);
  const { deepPath = [], path } = formattedOrganizationForEdit;
  const initialState = {
    ...formattedOrganizationForEdit,
  } as OrganizationFormValues;

  const isGeorgiaOrg = organization.tenantId === import.meta.env.VITE_GEORGIA_ORG_ID;

  const methods = useForm<OrganizationFormValues>({
    defaultValues: initialState,
    resolver: zodResolver(ORGANIZATION_VALIDATION_SCHEMA),
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

  const handleFormSubmitForEdit = async (tenantId: string, values: Partial<TenantDocument>) => {
    try {
      setLoading(true);
      const response = await tenantService.apiUpdateTenantById(tenantId, values);

      notify({ message: `Tenant successfully updated ${response?.name}`, severity: 'success' });
      navigate(-1);
    } catch (error) {
      const xerror = error as AxiosErrorWithResponse;
      const axiosErrorMessage = xerror?.response;

      notify({ message: axiosErrorMessage?.data?.error ?? 'An error occurred while updating.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmitForCreate = async (values: Partial<TenantDocument>) => {
    try {
      setLoading(true);
      const response = await tenantService.apiCreateTenant(values);

      notify({ message: `Tenant successfully Created ${response?.name}`, severity: 'success' });
      navigate(`../../organizations/${response?.tenantId}`);
    } catch (error) {
      const xerror = error as AxiosErrorWithResponse;
      const axiosErrorMessage = xerror?.response;
      let errorMessage = `An error occurred while updating.`;

      if (String(axiosErrorMessage?.data?.error).valueOf().includes('Unauthorized')) {
        errorMessage = "You don't have necessary permission to create new organization";
      }
      notify({ message: axiosErrorMessage?.data?.error ?? errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const checkForNotHavingParent = (errors: FieldError) => {
    if ('path' in errors && !isNew) {
      notify({
        message: 'Select a valid parent organization',
        severity: 'error',
      });
    }
  };

  const onError = (errors: unknown) => {
    checkForNotHavingParent(errors as FieldError);
  };

  const onSubmit: SubmitHandler<OrganizationFormValues> = async (data) => {
    const submittableTenantData: TenantDocument = formatSubmittableTenantData(data as EditOrgDetailsFrom, organization);

    if (isNew) {
      void handleFormSubmitForCreate(submittableTenantData);
    } else {
      void handleFormSubmitForEdit(organization.tenantId, submittableTenantData);
    }
  };

  return (
    <DetailsCard
      containerStyles={{ mt: 2, my: 2 }}
      title='Organization details'
      titleAdornment={
        <CoreBox sx={{ width: 'fit-content' }}>
          <CoreButton sx={{ mr: 4 }} color='secondary' variant='outlined' onClick={handleCancel}>
            Cancel
          </CoreButton>
          <CoreButton
            color='secondary'
            disabled={parentLoading || !methods.formState.isDirty}
            form='org-form'
            sx={{ mr: 4 }}
            type='submit'
            variant='contained'
          >
            Save
            <ConditionWrapper condition={parentLoading}>
              <CircularProgress sx={{ ml: 2 }} size={25} />
            </ConditionWrapper>
          </CoreButton>
        </CoreBox>
      }
    >
      <Loader loading={loading} />
      <FormProvider {...methods}>
        <form id='org-form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
          <CoreBox sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <GeneralInfo isGeorgiaOrg={isGeorgiaOrg} />

            <ParentOrgField
              deepPath={deepPath}
              originalPath={path ?? ''}
              // originalPath={path !== undefined ? path : ''}
              setParentLoading={setParentLoading}
            />
          </CoreBox>

          <CoreBox mb={4}>
            <AddressField />
          </CoreBox>
        </form>
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
