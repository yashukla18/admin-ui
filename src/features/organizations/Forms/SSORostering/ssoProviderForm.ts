import { z } from 'zod';

export const RosteringDiscriminatedUnion = z
  .discriminatedUnion('type', [
    z.object({
      type: z.literal('ClassLink'),
      districtId: z.string({ required_error: 'Tenant ID is required' }).min(1, { message: 'Tenant ID is required' }),
      schoolId: z.string({ required_error: 'Source ID is required' }).min(1, { message: 'Source ID is required' }),
    }),
    z.object({
      type: z.literal('Clever'),
      districtId: z
        .string({ required_error: 'District ID is required' })
        .min(1, { message: 'District ID is required' }),
      schoolId: z.string({ required_error: 'School ID is required' }).min(1, { message: 'School ID is required' }),
    }),
    z.object({
      type: z.literal('GADOE'),
      systemId: z.string({ required_error: 'System ID is required' }).min(1, { message: 'District ID is required' }),
      schoolId: z.string({ required_error: 'School ID is required' }).min(1, { message: 'School ID is required' }),
    }),
    z.object({
      type: z.literal('GG4L'),
      districtId: z
        .string({ required_error: 'District ID is required' })
        .min(1, { message: 'District ID is required' }),
      schoolId: z.string({ required_error: 'School ID is required' }).min(1, { message: 'School ID is required' }),
    }),
    z.object({
      type: z.literal(undefined),
    }),
    z.object({
      type: z.literal(''),
    }),
  ])
  .optional();

export const SSO_PROVIDER_VALIDATION_SCHEMA = z.object({
  provider: RosteringDiscriminatedUnion,
  rosteringEnabled: z.boolean().default(false),
});

export type ssoRosteringSettings = z.infer<typeof SSO_PROVIDER_VALIDATION_SCHEMA>;
