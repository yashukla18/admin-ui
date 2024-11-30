import { z } from 'zod';
import {
  ssoRosteringSettings,
  RosteringDiscriminatedUnion,
  SSO_PROVIDER_VALIDATION_SCHEMA,
} from '../Forms/SSORostering/ssoProviderForm';
import { ncesIdLengths } from '.';

export const ORGANIZATION_VALIDATION_SCHEMA = z.object({
  name: z
    .string()
    .min(6, 'Organization name either Empty or too short minimum 6 characters required')
    .max(100, 'Organization name too long'),
  classification: z
    .object({
      type: z.string().optional(),
      nces: z
        .object({
          name: z.string().optional(),
          ncesId: z.string().optional(),
          stateId: z.string().optional(),
        })
        .optional(),
      ipeds: z
        .object({
          ipedsId: z.string().optional(),
          name: z.string().optional(),
        })
        .optional(),
    })
    .optional()
    .superRefine((value, ctx) => {
      const type = value?.type;
      const ncesId = value?.nces?.ncesId;
      const expectedLength = type ? ncesIdLengths[type] : undefined;

      if (expectedLength && ncesId && ncesId.length !== expectedLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['nces', 'ncesId'],
          message: 'Invalid NCES ID',
        });
      }
    }),
  addresses: z.array(
    z.object({
      city: z.string().optional(),
      country: z.string().optional(),
      lines: z.array(z.string()).or(z.string()).optional(),
      postCode: z.string().optional(),
      state: z.string().optional(),
      type: z.enum(['home', 'school', 'work', 'other']).optional(),
    }),
  ),
  path: z.string().min(38, 'Select at least one parent organization'),
  // ssoSettings: SSO_PROVIDER_VALIDATION_SCHEMA.optional(),
  provider: RosteringDiscriminatedUnion.optional(),
  rosteringEnabled: z.boolean().optional().default(false),
});

export type OrganizationFormValues = z.infer<typeof ORGANIZATION_VALIDATION_SCHEMA>;
