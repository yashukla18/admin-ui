//! - Temporarily hard coding these now until we can get these from the backend
export interface OrgGroupManagementUrlType {
  tenantId?: string;
}
export type OrgGroupManagementUrlKeys = { [K in keyof OrgGroupManagementUrlType]: OrgGroupManagementUrlType[K] };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ORG_GROUP_MANAGEMENT_URLS = ({ tenantId }: OrgGroupManagementUrlKeys): SettingUrl[] => [
  // ORG PAGE
  {
    allowedRoles: ['Admin', 'Staff'],
    label: 'Discovery',
    url: `https://apps.youscience.com/organizations`,
    directTenantAccess: true,
  },
  // TODO hiding these for now
  // {
  //   allowedRoles: ['Admin'],
  //   label: 'Work Based Experiences',
  //   url: `https://secure.seamlesswbl.com/index.php/manage_tags`,
  //   restrictOrg: false,
  // },
];

export interface SettingUrl {
  allowedRoles: string[];
  directTenantAccess?: boolean;
  label: string;
  rootAdminOnly?: boolean;
  url: string;
}

export interface OrgSettingsUrlType {
  userId?: string;
  tenantId?: string;
}
export type OrgSettingsUrlKeys = { [K in keyof OrgSettingsUrlType]: OrgSettingsUrlType[K] };

export const ORG_SETTINGS_URLS = ({ tenantId }: OrgSettingsUrlKeys): SettingUrl[] => [
  {
    allowedRoles: ['Admin'],
    directTenantAccess: false,
    label: 'Certifications',
    rootAdminOnly: false,
    url: `https://certifications.youscience.com/admin/org/${tenantId}`,
  },
  {
    allowedRoles: ['Admin'],
    directTenantAccess: false,
    label: 'Discovery',
    rootAdminOnly: true,
    url: `https://login.youscience.com/admin/tenants/${tenantId}`,
  },
  {
    allowedRoles: ['Admin'],
    directTenantAccess: true,
    label: 'Education and Career Planning',
    rootAdminOnly: true,
    url: `https://ecp.youscience.com/admin/organizations/${tenantId}/configure`,
  },
  // TODO hiding these for now
  // {
  //   allowedRoles: ['Admin', 'Staff'],
  //   directTenantAccess: false,
  //   label: 'Work-Based Experiences',
  //   rootAdminOnly: false,
  //   url: `https://secure.seamlesswbl.com/index.php/manage_schools/edit/${tenantId}`,
  // },
];
