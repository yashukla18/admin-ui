import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { CoreBox, CoreButton, CoreTypography, CoreCheckbox } from '@youscience/core';
import { DetailsCard } from '@components/ui/DetailsCard';
import { OrgViewLoaderData } from '@interfaces';
import { SUBSCRIPTION_NAMES, SubscriptionKeys, OrgSubscriptionValues } from '@features/organizations/constants';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { useNotifyStore } from '@stores/notifyStore';
import { apiUpdateTenantById } from '@features/organizations/services/organizations-service';
import Loader from '@components/ui/Loader';
import { useCustomDialog } from '@hooks/useCustomDialog/CustomDialog';
import { sxStyles } from './Subscription.styles';

export const Subscription = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const tenantId = id;
  const { details } = useLoaderData() as OrgViewLoaderData;
  const { productAvailability } = details || {};
  const { openDialog, closeDialog, CustomDialog } = useCustomDialog();

  const notify = useNotifyStore((state) => state.notify);
  const [loading, setLoading] = useState<boolean>(false);

  const { control, handleSubmit, formState } = useForm<OrgSubscriptionValues>({
    defaultValues: {
      productAvailability,
    },
  });

  const handleCancel = () => {
    if (formState.isDirty) {
      openDialog();
    } else {
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

  const handleFormSubmit = async (data: OrgSubscriptionValues) => {
    if (!tenantId || !data) {
      notify({ message: 'Invalid tenant id or data', severity: 'error' });
      return;
    }
    try {
      setLoading(true);
      if (tenantId && data) {
        await apiUpdateTenantById(String(tenantId), data);
      }

      notify({ message: `Organization subscription updated`, severity: 'success' });
      navigate(-1);
    } catch (error) {
      notify({ message: 'There was an error while updating organization subscription', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DetailsCard
      title='Organization Subscription'
      titleAdornment={
        <CoreBox sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CoreButton sx={sxStyles.buttonStyles} color='secondary' onClick={handleCancel} variant='outlined'>
            Cancel
          </CoreButton>
          <CoreButton
            form='subscription-form'
            sx={sxStyles.buttonStyles}
            color='secondary'
            disabled={!formState.isDirty}
            type='submit'
          >
            Save
          </CoreButton>
        </CoreBox>
      }
    >
      <Loader loading={loading} />
      <form id='subscription-form' onSubmit={handleSubmit(handleFormSubmit)}>
        <CoreBox sx={sxStyles.wrapper}>
          <CoreTypography sx={sxStyles.heading}>Product</CoreTypography>

          {Object.keys(SUBSCRIPTION_NAMES).map((key) => (
            <CoreBox key={key} sx={sxStyles.checkboxWrapper}>
              <Controller
                name={`productAvailability.${key as SubscriptionKeys}`}
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <CoreCheckbox
                    {...rest}
                    checked={!!rest.value} // Ensure the value is treated as a boolean
                    onChange={(e) => {
                      rest.onChange(e.target.checked);
                    }}
                  />
                )}
              />
              <CoreTypography sx={sxStyles.body}>{SUBSCRIPTION_NAMES[key as SubscriptionKeys]}</CoreTypography>
            </CoreBox>
          ))}
        </CoreBox>
      </form>
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
