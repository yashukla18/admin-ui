import { CoreBox, CoreCheckbox, CoreTextField, CoreTypography } from '@youscience/core';
import { Controller, FormProvider } from 'react-hook-form';
import { useOrgListStore } from '@stores/orgListStore';
import OrgList from '@components/ui/OrgList';
import useSkipFirstEffect from '@youscience/hooks/useSkipFirstEffect';
import { AssociatedOrgFormProps } from '@interfaces/associatedOrgs';
import { ASSOCIATED_ORG_HEADERS } from '@constants/associatedOrgs';
import { sxStyles } from './AssociatedOrgsForm.styles';
import StatusChip from '../StatusChip';
import RolePicker from '../RolePicker';

export const AssociatedOrgsForm = ({
  methods,
  userName,
  userId,
  emailAddress,
  dateOfBirth,
  displayHeader,
}: AssociatedOrgFormProps) => {
  const tenantId = useOrgListStore((state) => state.tenantId);
  const { control, setValue } = methods;

  const isValidEmailInvitation = !!emailAddress;

  useSkipFirstEffect(() => {
    if (tenantId) {
      setValue('tenantId', tenantId, { shouldDirty: true });
      setValue('fullName', userName);
      setValue('userId', userId);
      setValue('dateOfBirth', dateOfBirth);
      if (isValidEmailInvitation) setValue('emailAddress', emailAddress);
      else setValue('emailInvite', false);
    }
  }, [tenantId]);

  return (
    <FormProvider {...methods}>
      <form id='associated-org-form' data-testid='associated-org-form-test-id'>
        {displayHeader && (
          <CoreBox sx={sxStyles.tableRow}>
            {ASSOCIATED_ORG_HEADERS.map((headerText, i) => (
              <CoreTypography key={`${headerText}-${String(i)}`} sx={sxStyles.tableHeaderCell}>
                {headerText}
              </CoreTypography>
            ))}
          </CoreBox>
        )}

        <CoreBox sx={sxStyles.tableRow} key={String('item._id')}>
          <CoreBox>
            <OrgList sx={{ width: 300 }} textFieldProps={{ variant: 'standard' }} />
          </CoreBox>

          <CoreBox>
            <Controller
              name='studentId'
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <CoreTextField {...rest} variant='standard' placeholder='student id' />
              )}
            />
          </CoreBox>
          <CoreBox>
            <Controller
              name='role'
              control={control}
              defaultValue={'item.tenant.permission?.role' || ''}
              render={({ field: { ref, ...rest } }) => (
                <RolePicker
                  {...rest}
                  formControlSx={{ width: '120px' }}
                  name='role'
                  onChangeCallback={rest.onChange}
                  value={rest.value}
                  variant='standard'
                />
              )}
            />
          </CoreBox>
          <CoreBox>
            <StatusChip variant='outlined' status='pending' label='pending' sx={{ textTransform: 'capitalize' }} />
          </CoreBox>
          {isValidEmailInvitation ? (
            <CoreBox sx={sxStyles.checkboxWrapper}>
              <Controller
                name='emailInvite'
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <CoreCheckbox
                    checked={rest.value}
                    onChange={(e) => {
                      rest.onChange(e.target.checked);
                    }}
                  />
                )}
              />
              <CoreTypography sx={sxStyles.emailText}>Email invitation</CoreTypography>
            </CoreBox>
          ) : null}
        </CoreBox>
      </form>
    </FormProvider>
  );
};
