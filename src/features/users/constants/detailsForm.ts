import { z } from 'zod';
import { emailRegex, phoneRegex } from '@constants';

export const USER_VALIDATION_SCHEMA = z.object({
  fullName: z.string().min(2, 'Full name too short minimum 2 characters').max(100, 'Full name too long'),
  displayName: z.string().max(100, 'Full name too long').optional(),
  profile: z.object({
    gender: z.string().max(30, 'Gender too long').optional(),
    ethnicity: z.array(z.string()).or(z.string()).optional(),
    linkedIn: z.string().optional(),
    graduationYear: z.string().or(z.number()).optional(),
    plan: z
      .object({
        next: z.string().optional(),
        now: z.string().optional(),
      })
      .optional(),
    dateOfBirth: z.string().or(z.date()).or(z.null()).optional(),
    addresses: z
      .array(
        z
          .object({
            city: z.string().optional(),
            country: z.string().optional(),
            lines: z.array(z.string()).or(z.string()).optional(),
            postCode: z.string().optional(),
            state: z.string().optional(),
            type: z.enum(['home', 'school', 'work', 'other']).optional(),
          })
          .optional(),
      )
      .optional(),
    emails: z
      .array(
        z.object({
          address: z.string(),
          isPrimary: z.boolean(),
          isVerified: z.boolean().default(false),
          type: z.enum(['personal', 'school', 'work', 'other']).default('personal'),
        }),
      )
      .superRefine((data, ctx) => {
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
      }),
    phones: z
      .array(
        z.object({
          extention: z.string().optional(),
          isPrimary: z.boolean().optional(),
          isVerified: z.boolean().optional(),
          number: z.string().regex(phoneRegex, 'Phone number is not valid').or(z.string().length(0)),
          type: z.enum(['landline', 'mobile', 'voip', 'unknown']).optional(),
        }),
      )
      .optional(),
  }),
});

export type UserFormValues = z.infer<typeof USER_VALIDATION_SCHEMA>;
