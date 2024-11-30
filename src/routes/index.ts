export const ROOT_ROUTES = { BASE_ROUTE: '/' } as const;

export const ORGANIZATION_ROUTES = {
  ORGANIZATIONS: 'organizations',
  CREATE_TENANT: 'create',
  EDIT_TENANT: 'edit/:id',
  ADD_ORG: 'add-organization',
  DETAILS: ':id',
  BULK_INVITE_WITH_ID: 'bulk-invite/:id',
  BULK_INVITE_WITHOUT_ID: 'bulk-invite',
};

export const USERS_ROUTES = {
  USERS: 'users',
  DETAILS: ':userId',
  EDIT_USER: 'edit/:userId',
  BULK_INVITE: 'bulk-invite',
  USER_INVITE: 'user-invite',
};

export const PROFILE_ROUTES = {
  PROFILE: 'profile',
};

export const GROUPS_ROUTES = {
  GROUPS: 'groups',
};

export const INVITATIONS_ROUTES = {
  INVITATIONS: 'invitations',
};

export const D2C_ROUTES = {
  D2CPurchase_Table: 'd2c',
};
