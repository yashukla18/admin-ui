import { ProfileRecord, UserDocument } from '@youscience/user-service-common';
import { updatedUser, userFormSanitizer } from './editUserFormSanitizer';
import { TEST_USER, TEST_USER_WITHOUT_PROFILE } from '@test/constants';
import { UserFormValues } from '../constants/detailsForm';
import { vi } from 'vitest';
import { DateToUTCString } from '@utils/dateToUTCString';
import { screen } from '@testing-library/react';

vi.mock('@utils/dateToUTCString', () => {
  return {
    DateToUTCString: vi.fn(() => '1996-10-10T00:00:00.000Z'),
  };
});

describe('userFormSanitizer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const user = { ...TEST_USER } as unknown as UserDocument;
  it('should return updated user name without removing any exisiting properties', () => {
    const nameToBeChanged = { fullName: 'Yash Shukla' };
    const requiredChanges = userFormSanitizer({
      ...user,
      ...nameToBeChanged,
    } as UserFormValues);
    const result = updatedUser(TEST_USER, requiredChanges);
    expect(result).toStrictEqual({
      ...TEST_USER,
      ...requiredChanges,
    });
    expect(result.profile).includes({ gender: 'male' });
  });
  it('should return updated user display name without removing any exisiting properties', () => {
    const displayNameToBeChanged = { displayName: 'Yash' };
    const requiredChanges = userFormSanitizer({
      ...user,
      ...displayNameToBeChanged,
    } as UserFormValues);
    const result = updatedUser(TEST_USER, requiredChanges);
    expect(result).toStrictEqual({
      ...TEST_USER,
      ...requiredChanges,
    });
    expect(result.profile).includes({ gender: 'male' });
  });
  it('should return updated user profile.graduationYear without removing any exisiting properties', () => {
    const graduationYearToBeChanged = {
      graduationYear: 2024,
    };
    const changedProfile = { ...user.profile, ...graduationYearToBeChanged } as ProfileRecord;
    const requiredChanges = userFormSanitizer({
      ...user,
      ...{ profile: changedProfile },
    } as UserFormValues);
    const result = updatedUser(TEST_USER, requiredChanges);
    expect(result).toStrictEqual({
      ...TEST_USER,
      ...requiredChanges,
    });
    expect(result.profile).includes({ gender: 'male' });
  });
  it('should return updated user profile.emails without removing any exisiting properties', () => {
    const emailsToBeChanged = {
      emails: [
        {
          address: 'testuser@youscience.com',
          isPrimary: true,
          isVerified: false,
          type: 'personal',
        },
      ],
    };
    const changedProfile = { ...user.profile, ...emailsToBeChanged } as ProfileRecord;
    const requiredChanges = userFormSanitizer({
      ...user,
      ...{ profile: changedProfile },
    } as UserFormValues);
    const result = updatedUser(TEST_USER, requiredChanges);
    expect(result).toStrictEqual({
      ...TEST_USER,
      ...requiredChanges,
    });
    expect(result.profile).includes({ gender: 'male' });
  });
  it('should return updated user profile.ethnicity without removing any exisiting properties', () => {
    const ethnicityToBeChanged = {
      ethnicity: ['white-european-american'],
    };
    const changedProfile = { ...user.profile, ...ethnicityToBeChanged } as ProfileRecord;
    const requiredChanges = userFormSanitizer({
      ...user,
      ...{ profile: changedProfile },
    } as UserFormValues);
    const result = updatedUser(TEST_USER, requiredChanges);
    expect(result).toStrictEqual({
      ...TEST_USER,
      ...requiredChanges,
    });
    expect(result.profile).includes({ gender: 'male' });
  });
  it('should return updated user profile.phones without removing any exisiting properties', () => {
    const phonesToBeChanged = {
      phones: [
        {
          number: '+18056921890',
        },
      ],
    };
    const changedProfile = { ...user.profile, ...phonesToBeChanged } as ProfileRecord;
    const requiredChanges = userFormSanitizer({
      ...user,
      ...{ profile: changedProfile },
    } as UserFormValues);
    const result = updatedUser(TEST_USER, requiredChanges);
    expect(result).toStrictEqual({
      ...TEST_USER,
      ...requiredChanges,
    });
  });

  it('should provide default profile when a users profile does not exist', () => {
    const changedProfile = { ...TEST_USER_WITHOUT_PROFILE.profile } as ProfileRecord;
    expect(changedProfile).toStrictEqual({});

    const requiredChanges = userFormSanitizer({
      ...TEST_USER_WITHOUT_PROFILE,
      ...{ profile: changedProfile },
    } as UserFormValues);

    const result = updatedUser(TEST_USER_WITHOUT_PROFILE, requiredChanges);

    expect(result).toStrictEqual({
      ...TEST_USER_WITHOUT_PROFILE,
      ...requiredChanges,
    });
  });

  it('should return an empty array for profile.addresses when profile.addresses is not provided', () => {
    const changedProfile = { ...TEST_USER_WITHOUT_PROFILE.profile, gender: 'female' } as ProfileRecord;
    expect(changedProfile.addresses).toStrictEqual(undefined);
    const requiredChanges = userFormSanitizer({
      ...TEST_USER_WITHOUT_PROFILE,
      ...{ profile: changedProfile },
    } as UserFormValues);
    const result = updatedUser(TEST_USER_WITHOUT_PROFILE, requiredChanges);

    expect(result).toStrictEqual({
      ...TEST_USER,
      ...requiredChanges,
    });
  });

  it('should return updated user profile.addresses "state" without removing any exisiting properties', () => {
    const addressesToBeChanged = {
      addresses: [
        {
          state: 'AK',
        },
      ],
    };
    const changedProfile = { ...user.profile, ...addressesToBeChanged } as ProfileRecord;
    const requiredChanges = userFormSanitizer({
      ...user,
      ...{ profile: changedProfile },
    } as UserFormValues);
    const result = updatedUser(TEST_USER, requiredChanges);
    expect(result).toStrictEqual({
      ...TEST_USER,
      ...requiredChanges,
    });
    expect(result.profile).includes({ gender: 'male' });
  });
  it('should return updated user profile.linkedIn url without removing any exisiting properties', () => {
    const linkedInToBeChanged = {
      linkedIn: 'https://in.linkedin.com/in/demo-account-0838a4249?trk=people-guest_people_search-card',
    };
    const changedProfile = { ...user.profile, ...linkedInToBeChanged } as ProfileRecord;
    const requiredChanges = userFormSanitizer({
      ...user,
      ...{ profile: changedProfile },
    } as UserFormValues);
    const result = updatedUser(TEST_USER, requiredChanges);
    expect(result).toStrictEqual({
      ...TEST_USER,
      ...requiredChanges,
    });
    expect(result.profile).includes({ gender: 'male' });
  });
  it("birthday should be formatted in UTC ISO format 'YYYY-MM-DDTHH:mm:ss.sssZ'", () => {
    const upDatedFields = { profile: { ...user.profile, dateOfBirth: new Date(1996, 10 - 1, 10, 0, 0, 0, 0) } };
    const requiredChanges = userFormSanitizer({
      ...user,
      ...upDatedFields,
    } as UserFormValues);
    const result = updatedUser(TEST_USER, requiredChanges);
    expect(result?.profile?.dateOfBirth).toBe('1996-10-10T00:00:00.000Z');
    expect(DateToUTCString).toBeCalledTimes(1);
  });
});
