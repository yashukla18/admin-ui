/* eslint-disable consistent-return */
import { FC, Suspense, lazy, useState } from 'react';
import { DetailsCard } from '@components/ui/DetailsCard';
import { CoreBox, CoreButton } from '@youscience/core';
import Loader from '@components/ui/Loader';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useNotifyStore } from '@stores/notifyStore';
import { tenantService } from '@services/tenant.service';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  EditOrgDetailsFrom,
  formatOrganizationForEdit,
  formatSubmittableSsoSettings,
} from '@utils/formatOrganizationForEdit';
import { SsoSettings, TenantDocument } from '@youscience/user-service-common';
import { AxiosErrorWithResponse } from '@interfaces';
import { useCustomDialog } from '@hooks/useCustomDialog/CustomDialog';
import { ORGANIZATION_VALIDATION_SCHEMA, OrganizationFormValues } from '../constants/detailsForm';

// lazy components
const SSORostering = lazy(() => import('./SSORostering'));

export const RosteringForm: FC<{ organization: TenantDocument }> = ({ organization }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const notify = useNotifyStore((state) => state.notify);
  const { openDialog, closeDialog, CustomDialog } = useCustomDialog();

  const formattedOrganizationForEdit = formatOrganizationForEdit(organization);
  const { deepPath = [] } = formattedOrganizationForEdit;
  const initialState = { ...formattedOrganizationForEdit } as OrganizationFormValues;

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

  const handleFormSubmit = async (data: OrganizationFormValues) => {
    const formattedSsoSettings = formatSubmittableSsoSettings(data as EditOrgDetailsFrom, organization);

    try {
      setLoading(true);
      const isRosterEnabled =
        Object.values(formattedSsoSettings?.provider ?? {}).filter((value) => value !== '').length >= 3;
      const ssoSettingsForUpdate = { ...formattedSsoSettings, rosteringEnabled: isRosterEnabled } as SsoSettings;
      const response = await tenantService.updateTenantSSOSettings(organization.tenantId, ssoSettingsForUpdate);

      if (response) {
        notify({ message: `Rostering successfully updated`, severity: 'success' });
        navigate(-1);
      }
    } catch (error) {
      const xerror = error as AxiosErrorWithResponse;
      const axiosErrorMessage = xerror?.response;

      notify({ message: axiosErrorMessage?.data?.error ?? 'An error occurred while updating.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DetailsCard
      containerStyles={{ mt: 2, my: 2 }}
      title='Rostering'
      titleAdornment={
        <CoreBox sx={{ width: 'fit-content' }}>
          <CoreButton sx={{ mr: 4 }} color='secondary' variant='outlined' onClick={handleCancel}>
            Cancel
          </CoreButton>
          <CoreButton
            color='secondary'
            disabled={!methods.formState.isDirty}
            form='rostering-form'
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
        <form id='rostering-form' onSubmit={methods.handleSubmit(handleFormSubmit)}>
          <Suspense fallback='loading'>
            <SSORostering deepPath={deepPath} />
          </Suspense>
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
