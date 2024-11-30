import { AssociatedOrgSchema } from '@interfaces/associatedOrgs';

export const ASSOCIATED_ORG_DEFAULT_VALUES: AssociatedOrgSchema = {
  tenantId: '',
  fullName: '',
  studentId: '',
  userId: '',
  emailAddress: '',
  role: 'Learner',
  emailInvite: true,
};

export const ASSOCIATED_ORG_HEADERS = ['Name', 'StudentId', 'Role', 'Status'];
