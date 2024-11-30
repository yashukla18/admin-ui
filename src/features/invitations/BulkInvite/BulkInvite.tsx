import { Suspense, lazy, useEffect, useState } from 'react';
import { CoreBox, CoreButton, CorePaper, CoreTypography } from '@youscience/core';
import { Link, Skeleton } from '@mui/material';
import { useAuthStore } from '@stores/authStore';
import { useNotifyStore } from '@stores/notifyStore';
import { CSV_TEMPLATE_LINK, ALLOWED_ROLES, UTAH_CSV_TEMPLATE_LINK } from '@constants';
import CoreDragAndDrop from '@components/ui/DragAndDrop';
import Loader from '@components/ui/Loader';
import { useOrgListStore } from '@stores/orgListStore';
import { useIsAdmin } from '@hooks/useIsAdmin';
import useBulkInvitation from '@hooks/useBulkInvitation';
import { TenantDocument } from '@youscience/user-service-common';
import { fetchTenantById } from '@features/organizations/services/organizations-service';
import { useParams } from 'react-router-dom';
import { hasAccessToUtah } from '@utils/helper';
import { sxStyles } from './BulkInvite.styles';
import { ErrorDialog } from './ErrorDialog';

const OrgList = lazy(() => import('@components/ui/OrgList'));

export const BulkInvite = () => {
  const { id = '' } = useParams();

  const authSession = useAuthStore((state) => state.authSession);
  const { orgList, setTenantId, tenantId } = useOrgListStore((state) => state);
  const notify = useNotifyStore((state) => state.notify);
  const [selectedOrg, setSelectedOrg] = useState<TenantDocument>();
  const [isUtahOrg, setIsUtahOrg] = useState<boolean>(false);
  const [isAccessible, setIsAccessible] = useState<boolean>(false);
  const [openErrorDialog, setOpenErrorDialog] = useState<boolean>(false);

  const { rootTenantId } = useIsAdmin();
  const { loading, isSuccess, sendBulkInvitation, errors } = useBulkInvitation();

  const validTenantId = (id || tenantId) === rootTenantId ? '' : id || tenantId;

  useEffect(() => {
    if (!authSession) return;

    const { role = '' } = authSession.currentAccess ?? {};

    // Check for admin with multiple orgs
    if (ALLOWED_ROLES.includes(role) && orgList.length > 0) {
      setIsAccessible(true);
    } else {
      setIsAccessible(false);
    }

    const getSelectedOrg = async () => {
      let currentTenant = orgList?.find((item) => item?.tenantId === validTenantId);

      if (!currentTenant && validTenantId) {
        const { data } = await fetchTenantById(validTenantId);

        currentTenant = data;
      }

      if (!currentTenant) return;

      setIsUtahOrg(hasAccessToUtah(currentTenant));
      setSelectedOrg(currentTenant);
    };

    if (validTenantId) {
      setTenantId(validTenantId);
      void getSelectedOrg();
    }
  }, [authSession.currentAccess?.tenantId]);

  useEffect(() => {
    if (errors.validationErrors.length > 0) {
      setOpenErrorDialog(true);
    }
  }, [errors.validationErrors]);

  const handleFileUpload = async (uploadedFile: File[]) => {
    if (!validTenantId || !uploadedFile) {
      notify({ severity: 'error', message: 'Missing tenant id or file data' });
    }

    if (selectedOrg) {
      await sendBulkInvitation(uploadedFile[0], selectedOrg);
    }
  };

  const handleErrorDialogClose = () => {
    setOpenErrorDialog(false);
    errors.validationErrors = [];
  };

  return (
    <CoreBox sx={sxStyles.container}>
      {!isSuccess ? (
        <>
          <CoreTypography sx={sxStyles.body} variant='body2' align='center'>
            Want to make sure users get in the right groups? Manage your groups in the Discovery upload tool.
          </CoreTypography>

          <CoreButton
            sx={{ mt: 6, mb: 5 }}
            href={process.env.VITE_GROUPS_BULK_INVITE}
            color='secondary'
            disabled={isUtahOrg}
            data-testid='discovery-upload-test-id'
          >
            Discovery upload tool
          </CoreButton>
        </>
      ) : null}

      <CorePaper sx={sxStyles.paper(isAccessible, isSuccess, '')}>
        <CoreTypography sx={sxStyles.heading} variant='h5' align='center'>
          Bulk Upload
        </CoreTypography>
        {isSuccess ? (
          <CoreTypography sx={sxStyles.success} variant='h6' align='center'>
            Thank you! Your upload was successful.
          </CoreTypography>
        ) : (
          <>
            <CoreTypography sx={sxStyles.body} variant='body2' align='center'>
              Add multiple users to your organization. Download the{' '}
              <Link href={isUtahOrg ? UTAH_CSV_TEMPLATE_LINK : CSV_TEMPLATE_LINK} color='secondary'>
                template
              </Link>{' '}
              to add your users and upload as a .csv here.
            </CoreTypography>
            <CoreBox sx={sxStyles.mainComponent}>
              <Loader loading={loading} />
              <Suspense fallback={<Skeleton />}>
                {isAccessible ? <OrgList data-testid='bulk-invite-org-list' sx={{ width: 400 }} /> : null}
              </Suspense>
              <CoreDragAndDrop
                data-test-id='bulk-invite-csv-drag-and-drop-test-id'
                acceptedFileTypes='text/csv'
                disableSubmit={!validTenantId}
                onSubmit={handleFileUpload}
              />
            </CoreBox>
          </>
        )}
      </CorePaper>
      <ErrorDialog open={openErrorDialog} onClose={handleErrorDialogClose} validationErrors={errors.validationErrors} />
    </CoreBox>
  );
};
