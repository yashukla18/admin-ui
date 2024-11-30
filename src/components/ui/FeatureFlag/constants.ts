import { DevMode } from '@constants/env';

export interface Feature {
  enabled: boolean;
  environments: (DevMode | null)[];
  featureId: string | null;
  name: FeatureFlagNames | null;
}

export type FeatureKeys = { [K in keyof Feature]: Feature[K] };
export type FeatureFlagNames = (typeof FEATURE_FLAGS)[number]['name'];

export const FEATURE_FLAGS = [
  {
    name: 'impersonation',
    featureId: import.meta.env.VITE_FEATURE_IMPERSONATION_ID,
    enabled: true as boolean,
    environments: ['development', 'stage', 'sandbox', 'production', 'prod'] as unknown as Feature['environments'],
  },
  {
    name: 'orgBulkInvite',
    featureId: import.meta.env.VITE_FEATURE_ORG_BULK_INVITE_ID,
    enabled: true as boolean,
    environments: ['development', 'stage', 'sandbox', 'production'] as unknown as Feature['environments'],
  },
  {
    name: 'implementNewHeader',
    featureId: import.meta.env.VITE_FEATURE_IMPLEMENT_NEW_HEADER,
    enabled: true as boolean,
    environments: ['development', 'stage', 'sandbox', 'production'] as unknown as Feature['environments'],
  },
  {
    name: 'addUser',
    featureId: import.meta.env.VITE_FEATURE_ADD_USER_ID,
    enabled: true as boolean,
    environments: ['development', 'stage', 'sandbox', 'production'] as unknown as Feature['environments'],
  },
  {
    name: 'removeIdentity',
    featureId: import.meta.env.VITE_FEATURE_REMOVE_IDENTITY_ID,
    enabled: true as boolean,
    environments: ['development', 'stage', 'sandbox', 'production'] as unknown as Feature['environments'],
  },
] as const;
