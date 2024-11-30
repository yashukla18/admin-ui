import { lazy, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoreBox, CoreButton, CoreTextField, CoreTypography } from '@youscience/core';
import { DetailsCard } from '@components/ui/DetailsCard';
import { AccessDocument, UserDocument } from '@youscience/user-service-common';
import { useNotifyStore } from '@stores/notifyStore';
import { useUpdateAssociatedOrgs } from '@features/users/hooks/useUpdateAssociatedOrgs';
import Loader from '@components/ui/Loader';
import { useForm, SubmitHandler, Controller, FieldValues } from 'react-hook-form';
import { ASSOCIATED_ORG_HEADERS } from '@constants/associatedOrgs';
import { canAccessTenant } from '@utils/canAccessTenant';
import { useIsAdmin } from '@hooks/useIsAdmin';
import { useCustomDialog } from '@hooks/useCustomDialog/CustomDialog';
import RolePicker from '@components/ui/RolePicker';
import { sxStyles } from './AssociatedOrgsForm.Styles';
import { roleSanitizer, studentIdSanitizer } from './associatedOrgSanitizer';
import { StudentIdUpdate, RoleUpdate } from './AssociatedOrgs.types';

const StatusChip = lazy(() => import('@components/ui/StatusChip'));

export const AssociatedOrgsForm = ({ access, details }: { access: AccessDocument[]; details: UserDocument }) => {
  const navigate = useNavigate();
  const notify = useNotifyStore((state) => state.notify);
  const { updateStudentId, updateRole, checkAllAccessesValidation } = useUpdateAssociatedOrgs();
  const { handleSubmit, control, formState } = useForm({
    shouldUnregister: true,
  });
  const { openDialog, closeDialog, CustomDialog } = useCustomDialog();
  const { isRootAdmin } = useIsAdmin();

  const [loading, setLoading] = useState<boolean>(false);

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

  const handleFormSubmit: SubmitHandler<FieldValues> = async (data) => {
    const updatedStudentIds = studentIdSanitizer(access, data.studentIds as StudentIdUpdate);
    const updatedRoles = roleSanitizer(access, data.roles as RoleUpdate);

    try {
      setLoading(true);

      const validationResult = await checkAllAccessesValidation(
        access,
        details,
        data.studentIds as StudentIdUpdate,
        data.roles as RoleUpdate,
      );

      if (validationResult.isRostering) {
        notify({
          // eslint-disable-next-line max-len
          message: `This organization is rostered through ${validationResult.provider}. Please invite new learners via ${validationResult.provider}.`,
          severity: 'error',
        });
        return;
      }

      if (validationResult.isDistrictTypeOrg) {
        notify({
          message:
            "Learner/Proctor can't be added to a school district. Please add Learner/Proctor to a specific school",
          severity: 'error',
        });
        return;
      }

      if (validationResult?.missingFields && validationResult?.missingFields.length > 0) {
        notify({
          message: `Missing required field(s): ${validationResult?.missingFields.join(', ')}`,
          severity: 'error',
        });
        return;
      }

      if (updatedStudentIds.length) {
        const studentIds = await updateStudentId(updatedStudentIds);

        studentIds.forEach((success, index) => {
          if (!success) {
            notify({ message: `Error updating studentId${index}`, severity: 'error' });
          }
        });
      }

      if (updatedRoles.length) {
        const roles = await updateRole(updatedRoles);

        roles.forEach((success, index) => {
          if (!success) {
            notify({ message: `Error updating role${index}`, severity: 'error' });
          }
        });
      }

      notify({ message: `Associated organizations updated`, severity: 'success' });
      navigate(-1);
    } catch (error) {
      notify({ message: 'There was an error while updating associated organization', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DetailsCard
      containerStyles={{ mt: 2 }}
      title='Associated organizations'
      titleAdornment={
        <CoreBox sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CoreButton sx={sxStyles.buttonStyles} color='secondary' onClick={handleCancel} variant='outlined'>
            Cancel
          </CoreButton>
          <CoreButton
            sx={sxStyles.buttonStyles}
            color='secondary'
            form='associatedOrg-form'
            type='submit'
            variant='contained'
            disabled={!formState.isDirty}
          >
            Save
          </CoreButton>
        </CoreBox>
      }
    >
      <Loader loading={loading} />
      <form
        id='associatedOrg-form'
        onSubmit={handleSubmit(handleFormSubmit)}
        data-testid='associated-org-edit-form-test-id'
      >
        <CoreBox sx={sxStyles.tableRow}>
          {ASSOCIATED_ORG_HEADERS.map((headerText, i) => (
            <CoreTypography key={`${headerText}-${String(i)}`} sx={sxStyles.tableHeaderCell}>
              {headerText}
            </CoreTypography>
          ))}
        </CoreBox>

        {access?.map((item) => (
          <CoreBox sx={sxStyles.tableRow} key={String(item._id)}>
            {canAccessTenant(item, !isRootAdmin) ? (
              <>
                <CoreTypography sx={sxStyles.tableCell}>{item.tenant.name}</CoreTypography>
                <CoreBox sx={sxStyles.tableCell}>
                  <Controller
                    name={`studentIds.${String(item._id)}.studentId`}
                    control={control}
                    defaultValue={item.tenant.private?.data?.studentId || ''}
                    render={({ field: { ref, ...rest } }) => (
                      <CoreTextField {...rest} variant='standard' inputProps={{ 'data-testid': 'STUDENT_ID' }} />
                    )}
                  />
                </CoreBox>
                <CoreBox sx={sxStyles.tableCell}>
                  <Controller
                    name={`roles.${String(item._id)}.role`}
                    control={control}
                    defaultValue={item.tenant.permission?.role ?? ''}
                    render={({ field: { ref, ...rest } }) => (
                      <RolePicker
                        {...rest}
                        name={`roles.${String(item._id)}.role`}
                        onChangeCallback={rest.onChange}
                        inputProps={{ 'data-testid': 'ROLE_SELECT' }}
                        value={rest.value as string}
                        variant='standard'
                      />
                    )}
                  />
                </CoreBox>
                <CoreBox sx={{ ...sxStyles.tableCell }}>
                  <StatusChip
                    label={item?.status || 'Pending'}
                    status={item?.status}
                    sx={{ ...sxStyles.tableCell, textTransform: 'capitalize' }}
                    variant='outlined'
                  />
                </CoreBox>
              </>
            ) : null}
          </CoreBox>
        ))}
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
