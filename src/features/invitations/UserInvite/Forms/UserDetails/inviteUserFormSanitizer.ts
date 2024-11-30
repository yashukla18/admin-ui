/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { EmailSchema } from '@youscience/user-service-common';
import { DateToUTCString } from '@utils/dateToUTCString';
import { sanitizePhones, sanitizeUserAddresses } from '@features/users/constants';
import { UserInviteSchema } from '../../constants';

export const inviteUserFormSanitizer = (data: UserInviteSchema): UserInviteSchema => {
  const emails = data.profile?.emails?.filter((email) => email.address) as unknown as EmailSchema[];
  const sanitizedData = {
    ...data,
    profile: {
      ...data.profile,
      graduationYear:
        data.profile.graduationYear && typeof data.profile.graduationYear === 'string'
          ? parseInt(data.profile.graduationYear, 10)
          : data.profile.graduationYear || undefined,
      linkedIn: data.profile.linkedIn || undefined,
      dateOfBirth: DateToUTCString(data.profile?.dateOfBirth) as unknown as Date,
      addresses: [...sanitizeUserAddresses(data.profile?.addresses)],
      phones: [...sanitizePhones(data?.profile?.phones)],
      emails: [...emails],
    },
    identities: [
      {
        email: data.profile.emails[0].address,
      },
    ],
  } as UserInviteSchema;

  return sanitizedData;
};
