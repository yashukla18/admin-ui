/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { EmailSchema, ProfileRecord, UserDocument, UserDocumentOmitId } from '@youscience/user-service-common';
import { DateToUTCString } from '@utils/dateToUTCString';
import { UserFormValues } from '../constants/detailsForm';
import { sanitizeEthnicity, sanitizePhones, sanitizeUserAddresses } from '../constants';

const includeRequiredProperty = (user: UserDocument) => {
  const { userId, fullName, displayName, profile } = user;

  return { userId, fullName, displayName, profile } as UserDocument;
};

export const updatedUser = (originalUser: UserDocument, updatedFields: UserDocumentOmitId): UserDocument => {
  let user = includeRequiredProperty(originalUser);
  const updatedProfile = updatedFields.profile;

  if (user.fullName !== updatedFields.fullName) user = { ...user, ...{ fullName: updatedFields.fullName } };
  if (user.displayName !== updatedFields.displayName) user = { ...user, ...{ displayName: updatedFields.displayName } };
  if (!user.profile) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in updatedFields.profile) {
      if (user && key) {
        user.profile = { ...updatedFields.profile };
      }
    }
    return user;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in user.profile) {
    if (updatedProfile && key in updatedProfile) {
      // eslint-disable-next-line prefer-const
      let value = updatedProfile[key as keyof ProfileRecord];

      user.profile = { ...user.profile, ...{ [key]: value } };
    }
  }
  return user;
};

export const userFormSanitizer = (data: UserFormValues): UserDocumentOmitId => {
  const partialSanitizedEthnicity = sanitizeEthnicity(data);
  const sanitizedEthnicity = Array.from(new Set(partialSanitizedEthnicity)).map((data) =>
    data
      .split(' ')
      ?.map((word) => word.replace(/[^a-zA-Z ]/g, '-'))
      ?.map((word) => word[0].toLocaleLowerCase() + word.slice(1))
      .join('-'),
  );
  const emails = data?.profile?.emails?.filter((email) => email.address) || ([] as EmailSchema[]);

  const sanitizedData = {
    ...data,
    profile: {
      ...data?.profile,
      graduationYear:
        data?.profile?.graduationYear && typeof data?.profile?.graduationYear === 'string'
          ? parseInt(data?.profile?.graduationYear, 10)
          : data?.profile?.graduationYear || undefined,
      linkedIn: data?.profile?.linkedIn || undefined,
      dateOfBirth: DateToUTCString(data?.profile?.dateOfBirth) as unknown as Date,
      ethnicity: sanitizedEthnicity,
      addresses: [...sanitizeUserAddresses(data?.profile?.addresses)],
      phones: [...sanitizePhones(data?.profile?.phones)],
      emails: [...emails],
    },
  } as UserDocumentOmitId;

  return sanitizedData;
};
