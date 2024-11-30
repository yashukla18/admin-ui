import { apiSendAccessInvitation } from '@features/users/services/UserService';
import { useNotifyStore } from '@stores/notifyStore';
import { AssociatedOrgSchema } from '@interfaces/associatedOrgs';
import { AccessDocument, TenantDocument } from '@youscience/user-service-common';
import { useOrgListStore } from '@stores/orgListStore';
import { fetchTenantById } from '@features/organizations/services/organizations-service';
import { hasAccessToUtah } from '@utils/helper';
import { useIsAdmin } from './useIsAdmin';

export const useAccessInvitation = () => {
  const notify = useNotifyStore((state) => state.notify);
  const { orgList } = useOrgListStore((state) => state);

  const { rootTenantId } = useIsAdmin();

  // Check if a learner or proctor is associated with a district type organization or rostering org with learner or utah org validations
  const checkAccessRestrictions = async (
    tenantId: string,
    role: string,
    studentId: string | undefined,
    fullName: string,
    dateOfBirth: string | Date | undefined | null,
  ) => {
    let org = orgList.find((org: TenantDocument) => org.tenantId === tenantId);
    let ssoSettings = org?.ssoSettings;

    if (!org) {
      const { data } = await fetchTenantById(tenantId);

      org = data;
      ssoSettings = data?.ssoSettings;
    }

    if (org?.classification?.type === 'district' && (role === 'Learner' || role === 'Proctor')) {
      notify({
        message: 'Learner/Proctor can`t be added to a school district. Please add Learner/Proctor to a specific school',
        severity: 'warning',
      });
      return true;
    }

    if (role === 'Learner' && ssoSettings?.rosteringEnabled) {
      notify({
        // eslint-disable-next-line max-len
        message: `This organization is rostered through ${ssoSettings.provider.type}. Please invite new learners via ${ssoSettings.provider.type}.`,
        severity: 'warning',
      });
      return true;
    }

    const hasUtahAccess = hasAccessToUtah(org);

    const missingFields = [];

    if (!fullName || fullName.trim() === '') {
      missingFields.push('Name');
    }

    if (hasUtahAccess && role === 'Learner') {
      if (!dateOfBirth) {
        missingFields.push('Date of Birth');
      }
      if (!studentId) {
        missingFields.push('Student Id');
      }
    }

    if (missingFields.length > 0) {
      notify({ message: `Missing required field(s): ${missingFields.join(', ')}`, severity: 'warning' });
      return true;
    }

    return false;
  };

  // Check if the user already associated to the selected organization
  const isTenantAlreadyAssociated = (selectedTenantId: string, access?: AccessDocument[]) => {
    return access?.some((data) => data.tenant.tenantId === selectedTenantId);
  };

  const sanitizeFormData = (data: AssociatedOrgSchema): AssociatedOrgSchema => {
    return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== '')) as AssociatedOrgSchema;
  };

  const sendAccessInvitation = async (
    data: AssociatedOrgSchema,
    isResendInvitation?: boolean,
    isNoAssociatedOrg?: boolean,
    access?: AccessDocument[],
  ) => {
    const sanitizedData = sanitizeFormData(data);

    const { tenantId, emailAddress, userId, role, fullName, dateOfBirth, studentId } = sanitizedData;

    if (!tenantId) {
      notify({ message: 'Please select the organization', severity: 'warning' });
      return false;
    }
    if (tenantId === rootTenantId) {
      notify({ message: 'Inviting a user to the YS root organization is not allowed', severity: 'warning' });
      return false;
    }
    if (!emailAddress && !userId) {
      notify({ message: 'Email address or User id is required', severity: 'warning' });
      return false;
    }
    if (!isNoAssociatedOrg) {
      if (isTenantAlreadyAssociated(tenantId, access)) {
        notify({ message: 'User is already associated with this organization', severity: 'warning' });
        return false;
      }
    }
    if (await checkAccessRestrictions(tenantId, role, studentId, fullName, dateOfBirth)) {
      return false;
    }

    const response = await apiSendAccessInvitation(sanitizedData);

    if (response.status === 201) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isResendInvitation
        ? notify({ message: 'Invitation sent successfully', severity: 'success' })
        : notify({ message: 'Organization associated successfully', severity: 'success' });
      return true;
    }

    return false;
  };

  return { sendAccessInvitation };
};
