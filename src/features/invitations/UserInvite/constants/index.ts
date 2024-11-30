import { UseFormReturn } from 'react-hook-form';
import { PhoneSchema, EmailSchema, AddressSchema } from '@youscience/user-service-common';
import { createUserDefaultAddress, createUserDefaultEmails, createUserDefaultPhone } from '@features/users/constants';
import { z } from 'zod';
import { emailRegex, linkedInRegex } from '@constants';

interface UserProfile {
  graduationYear?: number;
  dateOfBirth?: null | Date;
  ethnicity?: string[];
  linkedIn?: string;
  emails: EmailSchema[];
  phones?: PhoneSchema[];
  addresses: AddressSchema[];
}

interface identitiesSchema {
  email: string;
}

export interface UserInviteSchema {
  userId?: string;
  displayName?: string;
  fullName?: string;
  profile: UserProfile;
  identities?: identitiesSchema[];
}

export interface UserInviteProps {
  methods: UseFormReturn<UserInviteSchema>;
}

export interface fieldsProps {
  control: UseFormReturn['control'];
}

export type FormAddressSchema = Omit<AddressSchema, 'lines'> & {
  lines?: string[];
};

export const USER_INVITE_DEFAULT_VALUES: UserInviteSchema = {
  displayName: '',
  fullName: '',
  profile: {
    graduationYear: undefined,
    dateOfBirth: null,
    ethnicity: [],
    linkedIn: '',
    emails: [createUserDefaultEmails],
    phones: [createUserDefaultPhone],
    addresses: [createUserDefaultAddress],
  },
};

const emailObject = z.object({
  address: z.string().optional(),
  isPrimary: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  type: z.enum(['personal', 'school', 'work', 'other']).default('personal'),
});

const phoneObject = z.object({
  extention: z.string().default(''),
  isPrimary: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  number: z.string().default(''),
  type: z.enum(['landline', 'mobile', 'voip', 'unknown']).default('mobile'),
});

const addressObject = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  lines: z.array(z.string()).or(z.string()).optional(),
  postCode: z.string().optional(),
  state: z.string().optional(),
  type: z.enum(['home', 'school', 'work', 'other']).optional(),
});

const emailArrayValidator = (data: z.infer<typeof emailObject>[], ctx: z.RefinementCtx) => {
  const primaryEmail = data[0];
  const secondaryEmail = data[1];

  if (!primaryEmail?.address) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [0, 'address'],
      message: 'Primary email is required',
    });
  }

  if (primaryEmail?.address && !emailRegex.test(primaryEmail.address)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [0, 'address'],
      message: 'Invalid primary email address',
    });
  }

  if (secondaryEmail?.address && !emailRegex.test(secondaryEmail.address)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [1, 'address'],
      message: 'Invalid secondary email address',
    });
  }
};

const graduationYearSchema = z
  .string()
  .or(z.number())
  .refine(
    (gradYear) => {
      const year = typeof gradYear === 'number' ? gradYear : parseInt(gradYear, 10);

      return year >= 1900 && year <= 2500;
    },
    {
      message: 'Year must be between 1900 and 2500',
    },
  );

const linkedInUrlSchema = z.string().refine((url) => url === '' || linkedInRegex.test(url), 'Invalid linkedIn url');

const fullNameSchema = z
  .string()
  .min(1, { message: 'Name is required' })
  .min(2, { message: 'Name too short. Minimum 2 characters' })
  .max(50, { message: 'Name too long. Maximum 50 characters' });

const profileSchema = z.object({
  graduationYear: graduationYearSchema.optional(),
  dateOfBirth: z.string().or(z.date()).or(z.null()).optional(),
  emails: z.array(emailObject).length(2).superRefine(emailArrayValidator),
  linkedIn: linkedInUrlSchema.optional(),
  phones: z.array(phoneObject).and(z.array(phoneObject).length(2)).optional(),
  addresses: z.array(addressObject.optional()),
  ethnicity: z
    .array(z.string().min(2, 'Ethnicity too short minimum 2 characters').max(60, 'Ethnicity too long'))
    .optional(),
});

export const USER_INVITE_VALIDATION_SCHEMA = z.object({
  fullName: fullNameSchema,
  displayName: z.string().max(50, 'Preferred name too long').optional(),
  profile: profileSchema,
  identities: z.array(z.object({ email: z.string() })).optional(),
});

export const USER_INVITE_VALIDATION_SCHEMA_FOR_UTAH = z.object({
  fullName: fullNameSchema,
  displayName: z.string().max(50, 'Preferred name too long').optional(),
  profile: profileSchema.extend({
    dateOfBirth: z
      .string()
      .or(z.date())
      .or(z.null())
      .refine(
        (value) => {
          return value !== null && value !== undefined;
        },
        {
          message: 'Date of birth is required',
        },
      ),
  }),
  identities: z.array(z.object({ email: z.string() })).optional(),
});
