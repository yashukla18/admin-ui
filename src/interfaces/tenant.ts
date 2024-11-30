// import { TenantFormValues } from '@features/tenants/TenantForm/constants';
import { z } from 'zod';
import { TenantDocument } from '@youscience/user-service-common';
import { dateToCustomString } from '@utils/dateToString';
import { phoneRegex, postCodeExp } from '@constants';

export type PartialTenant = Pick<TenantDocument, 'tenantId' | 'name'>;

export interface AddressFieldsState {
  city?: string;
  country?: string;
  isPrimary?: boolean;
  lines?: string[];
  postCode?: string;
  state?: string;
  type?: 'home' | 'school' | 'work' | 'other';
}

export const TENANT_TAG_VALIDATION_SCHEMA = z.object({
  name: z.string().trim().min(1, 'Tag name required'),

  exp: z.preprocess((value) => {
    if (value instanceof Date) {
      return dateToCustomString(value);
    }
    return value;
  }, z.string().or(z.null())),
});

export const TENANT_PHONE_VALIDATION_SCHEMA = z.object({
  number: z.string().nonempty('required').regex(phoneRegex, 'Invalid phone'),
  type: z.enum(['landline', 'mobile', 'voip', 'unknown']).optional(),
  isPrimary: z.boolean().optional(),
  isValidated: z.boolean().optional(),
});

export const TENANT_ADDRESS_VALIDATION_SCHEMA = z.object({
  city: z.string().nonempty('City required').optional(),
  postCode: z
    .string()
    .nonempty('Post code required')
    .regex(postCodeExp, 'Postal code is not valid. Example: 12345-1234 or 48222')
    .optional(),
  lines: z.array(z.string()).optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  type: z.enum(['home', 'school', 'work', 'other']).optional(),
  isPrimary: z.boolean().optional(),
});

export const TENANT_VALIDATION_SCHEMA = z.object({
  name: z.string().min(2, 'Tenant name to short minimum 3 characters').max(100, 'Tenant name to long').nonempty({
    message: 'Tenant name required',
  }),
  path: z.string().default(''),
  phones: z.array(TENANT_PHONE_VALIDATION_SCHEMA).default([]),
  addresses: z.array(TENANT_ADDRESS_VALIDATION_SCHEMA).default([]),
  tags: z.array(TENANT_TAG_VALIDATION_SCHEMA).default([]),
});

export type TenantFormValues = z.infer<typeof TENANT_VALIDATION_SCHEMA>;
export type TenantFormTypes = 'new' | 'edit';

export type TenantFormProps<T = TenantFormTypes> = T extends 'edit'
  ? {
      type: T;
      onDelete: (tenant: TenantDocument) => void;
      onSubmitCallback: (values: TenantFormValues, tenantId: TenantDocument) => void;
    }
  : {
      type: T;
      onDelete?: never;
      onSubmitCallback: (values: TenantFormValues, tenantId: TenantDocument) => void;
    };
