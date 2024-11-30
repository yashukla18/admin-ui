import { ProductAvailability } from '@features/organizations/constants';
import { IdentityRecord, SsoSettings, TenantDocument } from '@youscience/user-service-common';

// Splitting camel case and capitalizing each word with space
export const formatClassificationType = (type?: string): string => {
  if (!type) {
    return '';
  }
  return type
    .split(/(?=[A-Z])/)
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

export const checkProductAvailability = (productAvailability: ProductAvailability): boolean => {
  return Object.values(productAvailability).some((value) => value === true);
};

export const checkRostering = (ssoSettings?: SsoSettings) => ssoSettings?.rosteringEnabled === true;

export const checkForEnabledSso = (orgData: TenantDocument) => !!orgData?.ssoSettings?.provider?.type;

export const isAllEmptyEntries = (data: string[]): boolean => data.every((chunk) => chunk === '');

export const isRemoveIdentity = (identities: IdentityRecord[], isRootAdmin: boolean): boolean => {
  if (!identities.length || typeof isRootAdmin !== 'boolean') {
    return false;
  }

  return isRootAdmin && identities.length > 1;
};

export const isUtahOnlyAccess = (orgList: TenantDocument[]) =>
  orgList.length === 1 && orgList[0]?.path.split(',').includes(process.env.VITE_UTAH_ORG_ID!);

export const hasAccessToUtah = (org: TenantDocument) => {
  const UTAH_ORG_ID = process.env.VITE_UTAH_ORG_ID;

  return (org?.tenantId === UTAH_ORG_ID || org?.path?.split(',')?.includes(UTAH_ORG_ID!)) ?? false;
};
