import { AccessDocument, IdentityRecord, UserDocument } from '@youscience/user-service-common';
import * as ValidateResetPassword from '../../resetPassword';
import {
  mockUserDetails,
  mockAccesses,
  rootTenantId,
  rootAdmin,
  nonRootAdmin,
  mockAccessesWithRootAdmin,
  accessWithDifferentRole,
  identitiesToSort,
  expectedSortedIdentities,
  invalidAccessesCases,
  invalidUserDetailsCases,
  invalidRootAdminCases,
  invalidRootTenantIdCases,
  filterUseCases,
  mockUserDetailsWithNoIdentities,
  identitiesToDisplay,
  expectedIdentitiesToDisplay,
} from './mockData';

describe('Password Reset Functionality', () => {
  const testResetPasswordInvalidCases = (
    identities: IdentityRecord[],
    accesses: AccessDocument[],
    isAdmin: boolean,
    tenantId: string,
  ) => {
    const validateResetPasswordDataMock = ValidateResetPassword.isResetPassword(
      identities,
      accesses,
      isAdmin,
      tenantId,
    );

    expect(validateResetPasswordDataMock).toEqual(false);
  };

  invalidUserDetailsCases.forEach((testCase) => {
    it(`should return false when ${testCase.description}`, () => {
      testResetPasswordInvalidCases(testCase.data, mockAccesses, rootAdmin, rootTenantId);
    });
  });

  invalidAccessesCases.forEach((testCase) => {
    it(`should return false when ${testCase.description}`, () => {
      testResetPasswordInvalidCases(
        mockUserDetails.identities,
        testCase.data as unknown as AccessDocument[],
        rootAdmin,
        rootTenantId,
      );
    });
  });

  invalidRootAdminCases.forEach((testCase) => {
    it(`should return false when ${testCase.description}`, () => {
      testResetPasswordInvalidCases(
        mockUserDetails.identities,
        mockAccesses,
        testCase.data as unknown as boolean,
        rootTenantId,
      );
    });
  });

  invalidRootTenantIdCases.forEach((testCase) => {
    it(`should return false when ${testCase.description}`, () => {
      testResetPasswordInvalidCases(
        mockUserDetails.identities,
        mockAccesses,
        rootAdmin,
        testCase.data as unknown as string,
      );
    });
  });

  it('should return false when ys admin in the accesses(ys admin)', () => {
    testResetPasswordInvalidCases(mockUserDetails.identities, mockAccessesWithRootAdmin, rootAdmin, rootTenantId);
  });

  accessWithDifferentRole.forEach((testCase) => {
    it(`should return true for ${testCase.description}(ys admin)`, () => {
      const validateResetPasswordDataMock = ValidateResetPassword.isResetPassword(
        mockUserDetails.identities,
        testCase.data,
        rootAdmin,
        rootTenantId,
      );

      expect(validateResetPasswordDataMock).toEqual(true);
    });
  });

  it('should return false when ys admin in the accesses(non ys admin)', () => {
    testResetPasswordInvalidCases(mockUserDetails.identities, mockAccessesWithRootAdmin, nonRootAdmin, rootTenantId);
  });

  accessWithDifferentRole.forEach((testCase) => {
    const expected = testCase.role === 'Learner';
    const description = expected ? 'true' : 'false';

    it(`should return ${description} for ${testCase.description}(non ys admin)`, () => {
      const validateResetPasswordDataMock = ValidateResetPassword.isResetPassword(
        mockUserDetails.identities,
        testCase.data,
        nonRootAdmin,
        rootTenantId,
      );

      expect(validateResetPasswordDataMock).toEqual(expected);
    });
  });

  it('should sort identities with provider first', () => {
    const sortedIdentities = ValidateResetPassword.sortIdentitiesWithProviderFirst(identitiesToSort);

    expect(sortedIdentities).toEqual(expectedSortedIdentities);
  });

  filterUseCases.forEach((testCase) => {
    it(`should filter user ${testCase.description}`, () => {
      const validateResetPasswordDataMock = ValidateResetPassword.filterIdentities(testCase.data.identities);

      expect(validateResetPasswordDataMock).toEqual(testCase.expectedResult);
    });
  });

  it('should return true for valid reset password scenario', () => {
    const validateResetPasswordDataMock = ValidateResetPassword.isResetPassword(
      mockUserDetails.identities,
      mockAccesses,
      rootAdmin,
      rootTenantId,
    );

    expect(validateResetPasswordDataMock).toEqual(true);
  });

  it('should return false for invalid reset password scenario', () => {
    const validateResetPasswordDataMock = ValidateResetPassword.isResetPassword(
      mockUserDetails.identities,
      mockAccesses,
      nonRootAdmin,
      rootTenantId,
    );

    expect(validateResetPasswordDataMock).toEqual(false);
  });

  it('should return true for identities that have data to display associated logins', () => {
    const validateAssociatedLoginMock = ValidateResetPassword.shouldDisplayAssociatedLogins(mockUserDetails.identities);

    expect(validateAssociatedLoginMock).toEqual(true);
  });

  it('should return false for identities that have no data to display associated logins', () => {
    const validateAssociatedLoginMock = ValidateResetPassword.shouldDisplayAssociatedLogins(
      mockUserDetailsWithNoIdentities.identities,
    );

    expect(validateAssociatedLoginMock).toEqual(false);
  });

  it('should filter all unique providers with migrated emails', () => {
    const validateResetPasswordDataMock = ValidateResetPassword.showAllIdentities(identitiesToDisplay.identities);

    expect(validateResetPasswordDataMock).toEqual(expectedIdentitiesToDisplay);
  });
});
