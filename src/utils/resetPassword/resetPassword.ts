import { AccessDocument, IdentityRecord } from '@youscience/user-service-common';

export const sortIdentitiesWithProviderFirst = (identities: IdentityRecord[]) => {
  return identities.sort((a, b) => {
    if (a.provider && !b.provider) {
      return -1;
    }
    if (!a.provider && b.provider) {
      return 1;
    }
    return 0;
  });
};

export const filterIdentities = (identities: IdentityRecord[]) => {
  const sortedIdentities = sortIdentitiesWithProviderFirst(identities);
  const existingEmail = new Set();

  // Functionality to get valid provider
  return (sortedIdentities || []).filter((identity) => {
    const isCognitoProvider = identity?.idpId && identity?.provider === 'cognito';
    const hasNoProvider = !identity?.provider && !identity?.idpId;
    const hasEmail = !!identity?.email;
    const isNewEmail = hasEmail && !existingEmail.has(identity.email);

    // Check for cognito provider
    if (isCognitoProvider) {
      // cognito provider with email
      if (hasEmail && isNewEmail) {
        existingEmail.add(identity.email);
        return true;
      }
      return !hasEmail; // cognito provider without email
    }
    // Check for no provider
    if (hasNoProvider && hasEmail && isNewEmail) {
      existingEmail.add(identity.email);
      return true;
    }
    return false;
  });
};

export const showAllIdentities = (identities: IdentityRecord[]) => {
  const sortedIdentities = sortIdentitiesWithProviderFirst(identities);
  const uniqueIdentities = new Set();

  // Functionality to display all the unique providers
  const filteredIdentities = sortedIdentities.filter((identity) => {
    const identityKey = `${identity.email}_${identity.provider ?? 'cognito'}`;

    if (!uniqueIdentities.has(identityKey)) {
      uniqueIdentities.add(identityKey);
      return true;
    }

    return false;
  });

  return filteredIdentities;
};

export const isResetPassword = (
  identities: IdentityRecord[],
  accesses: AccessDocument[],
  isRootAdmin: boolean,
  rootTenantId: string,
): boolean => {
  // Check for invalid user details and accesses
  if (!identities.length || !accesses || typeof isRootAdmin !== 'boolean' || !rootTenantId) {
    return false;
  }
  // Check for root access
  const hasRootAccess = accesses.some((access) => access?.tenant?.tenantId === rootTenantId);

  if (hasRootAccess) {
    return false; // YS admin password cannot be reset
  }

  // For YS admin
  if (isRootAdmin) {
    return filterIdentities(identities).length > 0;
  }

  // For Non YS admin
  const hasLearnerAccess =
    accesses.length > 0 && accesses.every((access) => access?.tenant?.permission?.role === 'Learner'); // Check for learner access

  if (!hasLearnerAccess) {
    return false; // Non YS admins can only reset learner password
  }

  return filterIdentities(identities).length > 0;
};

export const shouldDisplayAssociatedLogins = (identities: IdentityRecord[]) => {
  // Check to display associated login card
  return identities?.some((identity) => Object.keys(identity).length >= 1) ?? false;
};
