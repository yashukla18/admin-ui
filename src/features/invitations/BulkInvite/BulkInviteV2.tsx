import React, { Suspense, lazy, useEffect, useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { CoreBox, CoreButton, CorePaper, CoreTypography } from '@youscience/core';
import CoreDragAndDrop from '@components/ui/DragAndDrop';
import Loader from '@components/ui/Loader';
import { useOrgListStore } from '@stores/orgListStore';
import { useNotifyStore } from '@stores/notifyStore';
import { useIsAdmin } from '@hooks/useIsAdmin';
import { fetchTenantById } from '@features/organizations/services/organizations-service';
import useBulkInvitation from '@hooks/useBulkInvitation';
import { TenantDocument } from '@youscience/user-service-common';
import { Link, Skeleton } from '@mui/material';
import { CSV_TEMPLATE_LINK, UTAH_CSV_TEMPLATE_LINK } from '@constants';
import { hasAccessToUtah } from '@utils/helper';
import { sxStyles } from './BulkInvite.styles';
import { ErrorDialog } from './ErrorDialog';

const OrgList = lazy(() => import('@components/ui/OrgList'));

export const BulkInviteV2 = () => {
  const { orgList, tenantId, setTenantId } = useOrgListStore((state) => state);
  const notify = useNotifyStore((state) => state.notify);

  const { rootTenantId } = useIsAdmin();
  const { loading, isSuccess, sendBulkInvitation, errors } = useBulkInvitation();

  const validTenantId = tenantId === rootTenantId ? '' : tenantId;

  const [activeStep, setActiveStep] = useState(0);
  const [state, setState] = useState({
    tenantName: '',
    selectedOrg: null as TenantDocument | null,
    isUtahOrg: false,
    isError: false,
  });
  const [openErrorDialog, setOpenErrorDialog] = useState<boolean>(false);

  useEffect(() => {
    const getSelectedOrg = async () => {
      let currentTenant = orgList?.find((item) => item?.tenantId === validTenantId);

      if (!currentTenant && validTenantId) {
        const { data } = await fetchTenantById(validTenantId);

        currentTenant = data;
      }

      if (!currentTenant) return;

      setState((prev) => ({
        ...prev,
        isUtahOrg: hasAccessToUtah(currentTenant),
        tenantName: currentTenant?.name ?? '',
        selectedOrg: currentTenant ?? null,
      }));
    };

    if (validTenantId) {
      setTenantId(validTenantId);
      setState((prev) => ({ ...prev, isError: false }));
      void getSelectedOrg();
    }
  }, [tenantId]);

  useEffect(() => {
    if (errors.validationErrors.length > 0) {
      setOpenErrorDialog(true);
    }
  }, [errors.validationErrors]);

  const handleNext = () => {
    if (!validTenantId) {
      setState((prev) => ({ ...prev, isError: true }));
      notify({ severity: 'error', message: 'Please select the organization' });
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFileUpload = async (uploadedFile: File[]) => {
    if (!validTenantId || !uploadedFile) {
      notify({ severity: 'error', message: 'Missing tenant id or file data' });
    }

    if (state.selectedOrg) {
      await sendBulkInvitation(uploadedFile[0], state.selectedOrg);
    }
  };

  const handleErrorDialogClose = () => {
    setOpenErrorDialog(false);
    errors.validationErrors = [];
  };

  const tenantNameNode = state.tenantName ? (
    <CoreTypography variant='body2' align='center' mt={5}>
      These users will be added to {state.tenantName}
    </CoreTypography>
  ) : null;

  const backButton = (
    <CoreButton color='secondary' variant='outlined' sx={{ mr: 5 }} onClick={handleBack}>
      Back
    </CoreButton>
  );

  return (
    <CoreBox sx={sxStyles.container}>
      {!isSuccess ? (
        <Stepper activeStep={activeStep} sx={sxStyles.stepper}>
          <Step>
            <StepLabel>Select Organization</StepLabel>
          </Step>
          <Step>
            <StepLabel>Add Users</StepLabel>
          </Step>
        </Stepper>
      ) : null}

      <CorePaper sx={sxStyles.paper(true, isSuccess, activeStep === 0 ? 'step1' : 'step2')}>
        <CoreTypography sx={sxStyles.heading} variant='h5' align='center'>
          Bulk Upload
        </CoreTypography>
        <Loader loading={loading} />
        {!isSuccess ? (
          <>
            <CoreBox sx={{ display: activeStep === 0 ? 'block' : 'none' }}>
              <CoreTypography sx={sxStyles.body} variant='body2' align='center'>
                Please select your organization
              </CoreTypography>
              <CoreBox sx={sxStyles.mainComponent}>
                <Suspense fallback={<Skeleton />}>
                  <OrgList
                    orgNameAsParentProp={state.tenantName}
                    data-testid='bulk-invite-org-list'
                    sx={{ width: 400 }}
                    error={state.isError}
                  />
                </Suspense>
                <CoreButton color='secondary' onClick={handleNext}>
                  Next
                </CoreButton>
              </CoreBox>
            </CoreBox>

            <CoreBox sx={{ display: activeStep === 1 ? 'block' : 'none' }}>
              <CoreTypography sx={sxStyles.body} variant='body2' align='center'>
                Download the{' '}
                <Link href={state.isUtahOrg ? UTAH_CSV_TEMPLATE_LINK : CSV_TEMPLATE_LINK} color='secondary'>
                  template
                </Link>{' '}
                to add your users and upload as a .csv here.
              </CoreTypography>
              <CoreBox sx={sxStyles.mainComponent}>
                <CoreDragAndDrop
                  data-test-id='bulk-invite-csv-drag-and-drop-test-id'
                  acceptedFileTypes='text/csv'
                  subtitleNode={tenantNameNode}
                  customButton={backButton}
                  onSubmit={handleFileUpload}
                  sx={{ height: '265px' }}
                  disableSubmit={!validTenantId}
                />
              </CoreBox>
            </CoreBox>
          </>
        ) : (
          <CoreTypography sx={sxStyles.success} variant='h6' align='center'>
            Thank you, Your upload was successful!
          </CoreTypography>
        )}
      </CorePaper>
      {!isSuccess && activeStep !== 0 ? (
        <>
          <CoreTypography sx={sxStyles.body} variant='body2' align='center'>
            Want to make sure users get in the right groups? Manage your groups in the Discovery upload tool.
          </CoreTypography>

          <CoreButton
            sx={{ mt: 6, mb: 5 }}
            href={process.env.VITE_GROUPS_BULK_INVITE}
            color='secondary'
            disabled={state.isUtahOrg}
            data-testid='discovery-upload-test-id'
          >
            Discovery upload tool
          </CoreButton>
        </>
      ) : null}
      <ErrorDialog open={openErrorDialog} onClose={handleErrorDialogClose} validationErrors={errors.validationErrors} />
    </CoreBox>
  );
};
