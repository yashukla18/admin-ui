/* eslint-disable no-nested-ternary */
import { phoneRegex } from '@constants';
import { AddressType, UserDocument } from '@youscience/user-service-common';
import { uuidv7 } from 'uuidv7';

// TODO move this to interfaces & return this type
enum userEmailTypes {
  school,
  work,
  other,
  personal,
}

enum userPhoneTypes {
  landline,
  mobile,
  unknown,
  voip,
}

interface UserEmails {
  address?: string;
  isPrimary?: boolean;
  isVerified?: boolean;
  type?: keyof typeof userEmailTypes;
}

interface EditUserEmails {
  address?: string;
  isPrimary?: boolean;
}

interface UserPhones {
  extension?: string | undefined;
  isPrimary?: boolean;
  isVerified?: boolean;
  number?: string;
  type?: keyof typeof userPhoneTypes;
}

interface EditUserPhones {
  isPrimary?: boolean;
  number?: string;
}

interface UserAddresses {
  city?: string;
  country?: string;
  isPrimary?: boolean;
  lines?: string[];
  postCode?: string;
  state?: string;
  type?: AddressType;
}

interface EditUserAddresses {
  city?: string;
  country?: string;
  isPrimary?: boolean;
  lines?: string[];
  postCode?: string;
  state?: string;
}
const defaultEmail = { address: '', isPrimary: false, id: uuidv7() };
const defaultPhone = { number: '', isPrimary: false, id: uuidv7() };
const defaultAddress = {
  lines: [''],
  city: '',
  state: '',
  postCode: '',
  country: '',
  isPrimary: false,
  id: uuidv7(),
};

interface EditUserDetailsForm {
  displayName?: string;
  fullName?: string;
  profile: {
    addresses?: EditUserAddresses[];
    dateOfBirth?: Date | null;
    emails?: EditUserEmails[];
    ethnicity?: string[];
    graduationYear?: number;
    linkedIn?: string;
    phones?: EditUserPhones[];
  };
}

function formatEmails(emails?: UserEmails[]): EditUserEmails[] {
  if (!emails?.length) return [{ ...defaultEmail, isPrimary: true }, { ...defaultEmail }];

  if (emails.length === 1) {
    return emails.concat(defaultEmail).map((email) => ({
      address: email.address,
      isPrimary: email.isPrimary,
    }));
  }

  return emails?.map((email) => ({
    address: email.address,
    isPrimary: email.isPrimary,
  }));
}

function formatPhones(phones?: UserPhones[]): EditUserPhones[] {
  if (!phones?.length) return [{ ...defaultPhone, isPrimary: true }, { ...defaultPhone }];

  // Temporarily adds a phone field in order to match designs but we can't return the '' or it shows up
  if (phones.length === 1) {
    return phones.concat(defaultPhone).map(({ number = '', ...rest }) => ({
      ...rest,
      isPrimary: true,
      number: phoneRegex.test(number)
        ? number
        : number === ''
          ? ''
          : `${number.slice(0, 2)} ${number.slice(2, 5)}-${number.slice(5, 8)}-${number.slice(8)}`,
    }));
  }

  return phones?.map(({ number = '', ...rest }) => ({
    ...rest,
    number: phoneRegex.test(number)
      ? number
      : `${number.slice(0, 2)} ${number.slice(2, 5)}-${number.slice(5, 8)}-${number.slice(8)}`,
  }));
}

function formatAddresses(addresses?: UserAddresses[]): EditUserAddresses[] {
  if (!addresses?.length) return [{ ...defaultAddress, isPrimary: true }, { ...defaultAddress }];

  if (addresses.length === 1) {
    return addresses.concat(defaultAddress).map((address) => ({
      city: address.city,
      country: address.country,
      isPrimary: address.isPrimary,
      lines: address.lines,
      postCode: address.postCode,
      state: address.state,
    }));
  }
  return addresses?.map((address) => ({
    city: address.city,
    country: address.country,
    isPrimary: address.isPrimary,
    lines: address.lines,
    postCode: address.postCode,
    state: address.state,
  }));
}

export const formatUserForEdit = (user: UserDocument): EditUserDetailsForm => {
  const { profile, fullName, displayName = '' } = user;
  const {
    graduationYear = undefined,
    dateOfBirth,
    ethnicity = [],
    linkedIn = '',
    emails = [],
    phones = [],
    addresses = [],
  } = profile ?? {};

  const formattedUser = {
    displayName,
    fullName,
    profile: {
      addresses: formatAddresses(addresses),
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      emails: formatEmails(emails),
      ethnicity,
      graduationYear: graduationYear ?? undefined,
      linkedIn,
      phones: formatPhones(phones),
    },
  };

  return formattedUser;
};
