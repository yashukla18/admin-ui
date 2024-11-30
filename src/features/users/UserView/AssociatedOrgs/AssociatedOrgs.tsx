import { useEffect, useState, Suspense } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CircularProgress, IconButton, Skeleton } from '@mui/material';
import { Add, DeleteOutline } from '@mui/icons-material';
import { CoreBox, CoreButton, CoreTypography } from '@youscience/core';
import { AccessDocument } from '@youscience/user-service-common';
import { useNotifyStore } from '@stores/notifyStore';
import { useOrgListStore } from '@stores/orgListStore';
import { useOrgsAutocomplete } from '@hooks/useOrgsAutocomplete';
import { useAccessInvitation } from '@hooks/useAccessInvitation';
import { DetailsCard } from '@components/ui/DetailsCard';
import Loader from '@components/ui/Loader';
import AssociatedOrgsForm from '@components/ui/AssociatedOrgsForm';
import StatusChip from '@components/ui/StatusChip';
import { AssociatedOrgSchema, AssociatedOrgsProps } from '@interfaces/associatedOrgs';
import { ASSOCIATED_ORG_HEADERS, ASSOCIATED_ORG_DEFAULT_VALUES } from '@constants/associatedOrgs';
import { apiGetUserAccess } from '@features/users/services/UserService';
import { canAccessTenant } from '@utils/canAccessTenant';
import { useCustomDialog } from '@hooks/useCustomDialog/CustomDialog';
import { sxStyles } from './AssociatedOrgs.Styles';

export const AssociatedOrgs = ({ access, userName, emailAddress, dateOfBirth }: AssociatedOrgsProps) => {
  const navigate = useNavigate();
  const { userId } = useParams() || {};

  const methods = useForm<AssociatedOrgSchema>({ defaultValues: ASSOCIATED_ORG_DEFAULT_VALUES });
  const { formState } = methods;
  // Stores
  const notify = useNotifyStore((state) => state.notify);
  const { orgList } = useOrgListStore((state) => state);
  const resetTenantId = useOrgListStore((state) => state.resetTenantId);
  const setAssociatedOrgs = useOrgListStore((state) => state.setAssociatedOrgs);
  const deleteAssociatedOrg = useOrgListStore((state) => state.deleteAssociatedOrg);
  // State
  const [showForm, setShowForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingResend, setLoadingResend] = useState<Record<string, boolean>>({});
  const [deleteTenantInfo, setDeleteTenantInfo] = useState<{ deletionName: string; deletionId: string }>({
    deletionName: '',
    deletionId: '',
  });
  // Hooks
  const { onSearch } = useOrgsAutocomplete();
  const { sendAccessInvitation } = useAccessInvitation();
  const { openDialog, closeDialog, CustomDialog } = useCustomDialog();

  const isNoAssociatedOrg = !access?.length;
  let isAddOrganization = false;

  if (!emailAddress) {
    // TO-DO: Temporary change until acess refactor completed
    isAddOrganization = false;
  } else if (isNoAssociatedOrg) {
    // Enable Add organization if organizations available
    isAddOrganization = orgList?.length > 0;
  } else {
    // Enable Add organization if organizations not already associated with the user
    isAddOrganization =
      orgList?.length > 0 && orgList?.some((org) => !access.some((data) => data.tenant.tenantId === org.tenantId));
  }

  const fetchOrgList = () => {
    try {
      void onSearch('');
    } catch (error) {
      notify({ message: 'Error fetching org list', severity: 'error' });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    resetTenantId();
    methods.reset(ASSOCIATED_ORG_DEFAULT_VALUES);
  };

  useEffect(() => {
    if (!orgList?.length) {
      // prefetch the org list upon initial render so results appear in list
      fetchOrgList();
    }

    return () => {
      handleCancel();
    };
  }, []);

  const updateAccessAndOrgList = async () => {
    try {
      resetTenantId();
      fetchOrgList();

      const updatedAccess = await apiGetUserAccess(userId ?? '');

      if (updatedAccess.data) {
        setAssociatedOrgs(updatedAccess.data);
      }
    } catch (error) {
      notify({ message: 'Error updating access and org list', severity: 'error' });
    }
  };

  const handleAddOrganization = () => {
    methods.reset(ASSOCIATED_ORG_DEFAULT_VALUES);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = methods.getValues();

      const response = await sendAccessInvitation(data, false, isNoAssociatedOrg, access);

      if (response) {
        await updateAccessAndOrgList();
        setShowForm(false);
      }
    } catch (error) {
      notify({ message: 'Error while adding the organization', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`../edit/${userId ?? ''}`);
  };

  const handleDeleteOrg = (orgName?: string, providedDeleteId?: string) => {
    openDialog();
    setDeleteTenantInfo(() => ({ deletionName: orgName ?? '', deletionId: providedDeleteId ?? '' }));
  };

  const handleResendInvitation = async (item: AccessDocument) => {
    const itemId = String(item._id);

    setLoadingResend((prevState) => ({ ...prevState, [itemId]: true }));

    try {
      const { user, tenant, invitation = { email: '', expirationDate: null, invitationCode: undefined } } = item;
      const resendEmailAddresss = invitation?.email || emailAddress;

      const resendInviteData: AssociatedOrgSchema = {
        fullName: user.fullName,
        tenantId: tenant.tenantId,
        studentId: (tenant.private?.data?.studentId as string) || '',
        userId: user.userId,
        emailAddress: resendEmailAddresss,
        role: tenant.permission?.role as string,
        emailInvite: !!resendEmailAddresss,
      };

      await sendAccessInvitation(resendInviteData, true);
    } catch (error) {
      notify({ message: 'Error while resending the invitation', severity: 'error' });
    } finally {
      setLoadingResend((prevState) => ({ ...prevState, [itemId]: false }));
    }
  };

  const handleDeleteOrgConfirm = async () => {
    const statusCode = await deleteAssociatedOrg(userId ?? '', deleteTenantInfo.deletionId ?? '');

    if (statusCode !== 204) {
      closeDialog();
      notify({ message: 'Error removing organization', severity: 'error', autoHideDuration: 3000 });
      return;
    }
    closeDialog();
    notify({ message: 'Organization removed', severity: 'success' });
  };

  return (
    <DetailsCard
      title={isNoAssociatedOrg ? 'No associated organizations' : 'Associated organizations'}
      titleAdornment={
        <CoreBox sx={sxStyles.buttonWrapper}>
          {showForm ? (
            <>
              <CoreButton sx={sxStyles.buttonStyles} color='secondary' variant='outlined' onClick={handleCancel}>
                Cancel
              </CoreButton>
              <CoreButton
                sx={sxStyles.buttonStyles}
                color='secondary'
                disabled={!formState.isDirty || (!orgList.length && loading)}
                onClick={handleSubmit}
              >
                Save
              </CoreButton>
            </>
          ) : null}

          {!showForm && isAddOrganization ? (
            <CoreButton
              startIcon={<Add />}
              sx={sxStyles.buttonStyles}
              color='secondary'
              variant='outlined'
              onClick={handleAddOrganization}
            >
              Add Organization
            </CoreButton>
          ) : null}

          {!showForm && !isNoAssociatedOrg ? (
            <CoreButton color='secondary' onClick={handleEdit}>
              Edit
            </CoreButton>
          ) : null}
        </CoreBox>
      }
    >
      {!isNoAssociatedOrg ? (
        <CoreBox data-testid='associated-org-access-list-test-id'>
          <CoreBox sx={sxStyles.tableRow}>
            {ASSOCIATED_ORG_HEADERS.map((headerText, i) => (
              <CoreTypography key={`${headerText}-${String(i)}`} sx={sxStyles.tableHeaderCell}>
                {headerText}
              </CoreTypography>
            ))}
          </CoreBox>
          {access?.map((item) => (
            <CoreBox sx={sxStyles.tableRow} key={item._id.toString()}>
              <Link style={sxStyles.link} to={`/organizations/${item?.tenant?.tenantId ?? ''}`}>
                {item.tenant.name}
              </Link>
              <CoreBox>{(item.tenant.private?.data?.studentId as string) || '--'}</CoreBox>
              <CoreBox>{item.tenant.permission?.role}</CoreBox>
              <CoreBox>
                <StatusChip
                  label={item.status || 'pending'}
                  status={item.status}
                  sx={{ textTransform: 'capitalize' }}
                  variant='outlined'
                />
              </CoreBox>
              <CoreBox>
                {item?.status === 'pending' && emailAddress ? (
                  <CoreButton
                    sx={sxStyles.buttonStyles}
                    color='secondary'
                    variant='outlined'
                    disabled={loadingResend[String(item._id)]}
                    onClick={() => handleResendInvitation(item)}
                  >
                    {loadingResend[String(item._id)] ? (
                      <CircularProgress size={20} color='inherit' />
                    ) : (
                      'Resend invitation'
                    )}
                  </CoreButton>
                ) : null}
              </CoreBox>
              <CoreBox>
                {canAccessTenant(item, true) ? (
                  <IconButton color='error' onClick={() => handleDeleteOrg(item.tenant.name, item.tenant.tenantId)}>
                    <DeleteOutline data-testid='REMOVE-ORG-ICON-BUTTON' />
                  </IconButton>
                ) : null}
              </CoreBox>
            </CoreBox>
          ))}
          <CustomDialog
            contentText={
              <>Are you sure you want to remove the organization {deleteTenantInfo.deletionName} from this user?</>
            }
            key={deleteTenantInfo.deletionId}
            onCancel={closeDialog}
            onConfirm={handleDeleteOrgConfirm}
            title='Remove organization'
          />
        </CoreBox>
      ) : null}

      {showForm ? (
        <>
          <Loader loading={loading} />
          <Suspense fallback={<Skeleton />}>
            <AssociatedOrgsForm
              methods={methods}
              userName={userName}
              userId={userId}
              emailAddress={emailAddress}
              dateOfBirth={dateOfBirth}
              displayHeader={!!isNoAssociatedOrg}
            />
          </Suspense>
        </>
      ) : null}
    </DetailsCard>
  );
};
