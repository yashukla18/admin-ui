import { envWindowReplaceCallback } from '@utils/envWindowReplaceCallback';

export interface UserGroupManagementUrlType {
  tenantId?: string;
}
export type UserGroupManagementUrlKeys = { [K in keyof UserGroupManagementUrlType]: UserGroupManagementUrlType[K] };
export interface SettingUrl {
  url: string;
  allowedRoles: string[];
  label: string;
  restrictOrg?: boolean;
}

export const allowedGroupManagementRoles = ['Admin', 'Staff'];
export const callUserDiscoveryGroupManagementUrl = (tenantId?: string): void =>
  envWindowReplaceCallback(`https://login.youscience.com/admin/tenants/${tenantId}`);

export interface UserSettingsUrlType {
  userId?: string;
}
export type UserSettingsUrlKeys = { [K in keyof UserSettingsUrlType]: UserSettingsUrlType[K] };
export const USER_SETTINGS_URLS = ({ userId }: UserSettingsUrlKeys): SettingUrl[] => [
  {
    url: `https://certifications.youscience.com/admin/user/${userId}`,
    allowedRoles: ['Admin'],
    label: 'Certifications',
    restrictOrg: false,
  },
  {
    url: `https://login.youscience.com/admin/users/${userId}`,
    allowedRoles: ['Admin'],
    label: 'Discovery',
    restrictOrg: true,
  },
  // Removing WBE until further notice
  // {
  //   url: `https://secure.seamlesswbl.com/index.php/manage_students/edit_student/${userId}`,
  //   allowedRoles: ['Admin', 'Staff'],
  //   label: 'Work Based Experiences',
  // },
];
