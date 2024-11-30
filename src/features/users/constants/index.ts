import { PhoneSchema, EmailSchema, AddressSchema } from '@youscience/user-service-common';
import { returnPresentKeyVals } from '@utils/returnPresentKeyVals';
import { isAllEmptyEntries } from '@utils/helper';
import { FormAddressSchema } from '../Forms/EditUserDetailsForm.types';
import { UserFormValues } from './detailsForm';

export const createUserDefaultPhone: PhoneSchema = {
  isPrimary: true,
  isVerified: false,
  number: '',
  type: 'mobile',
  extension: '',
};

export const createUserDefaultEmails: EmailSchema = {
  address: '',
  isPrimary: true,
  isVerified: false,
  type: 'personal',
};

export const createUserDefaultAddress = {
  city: '',
  country: '',
  isPrimary: true,
  lines: [],
  postCode: '',
  state: '',
  type: undefined,
};

export interface UserFormState {
  fullName?: string;
  profile: {
    addresses: AddressSchema[];
    dateOfBirth?: null | Date;
    emails: EmailSchema[];
    ethnicity?: string[];
    gender?: string;
    phones: PhoneSchema[];
  };
}

export const createUserInitialData: UserFormState = {
  fullName: '',
  profile: {
    addresses: [createUserDefaultAddress],
    dateOfBirth: null,
    emails: [createUserDefaultEmails],
    ethnicity: [],
    gender: '',
    phones: [createUserDefaultPhone],
  },
};

export const emailTypes = [
  {
    label: 'Personal',
    value: 'personal',
  },
  {
    label: 'School',
    value: 'school',
  },
  {
    label: 'Work',
    value: 'work',
  },
  {
    label: 'Other',
    value: 'other',
  },
] as const;

export const sanitizeUserAddresses = (addresses?: UserFormValues['profile']['addresses']) =>
  addresses
    ?.filter(
      (address) =>
        !isAllEmptyEntries([
          address?.lines?.[0] ?? '',
          address?.city ?? '',
          address?.state ?? '',
          address?.postCode ?? '',
          address?.country ?? '',
          address?.type ?? '',
        ]),
    )
    ?.map((address) => {
      return {
        ...returnPresentKeyVals({
          city: address?.city,
          country: address?.country,
          postCode: address?.postCode,
          state: address?.state,
          type: address?.type,
        }),
        lines:
          // eslint-disable-next-line no-nested-ternary
          typeof address?.lines === 'string'
            ? [address?.lines]
            : `${address?.lines?.[0]}`.length > 0
              ? address?.lines
              : [''],
      } as FormAddressSchema;
    }) ?? [];

export const sanitizeEthnicity = (data: UserFormValues) =>
  // eslint-disable-next-line no-nested-ternary
  typeof data?.profile?.ethnicity === 'string'
    ? [data?.profile?.ethnicity]
    : `${data?.profile?.ethnicity?.[0]}`.length > 0
      ? data?.profile?.ethnicity
      : ([''] as string[]);

export const sanitizePhones = (phones?: PhoneSchema[]) =>
  phones
    ?.map(({ number, ...rest }) => ({
      ...rest,
      number: number.replace(' ', '').replaceAll('-', ''),
    }))
    ?.filter((phone) => phone.number) ?? ([] as PhoneSchema[]);
