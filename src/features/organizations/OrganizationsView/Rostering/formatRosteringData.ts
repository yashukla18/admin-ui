import { format } from 'date-fns';
import {
  NewRosterOptions,
  RosteringOptions,
  rosteringOptions,
} from '@features/organizations/Forms/SSORostering/constants';
import { SsoSettings } from '@youscience/user-service-common';

export const formatSSOProviderLabels = (SsoSettings?: SsoSettings) => {
  if (!SsoSettings?.provider?.type) return undefined;
  let formattedProvider = {};

  const labelConversion = rosteringOptions[SsoSettings?.provider?.type as keyof typeof rosteringOptions];

  if (labelConversion) {
    formattedProvider = Object.keys(labelConversion).reduce(
      (acc, key) => {
        const value = labelConversion[key as keyof SsoSettings['provider']] as keyof RosteringOptions;
        const newKey = SsoSettings?.provider?.[key as unknown as keyof SsoSettings['provider']];

        if (newKey) {
          acc[value as unknown as keyof typeof rosteringOptions] = newKey;
        }
        return acc;
      },
      {} as unknown as NewRosterOptions,
    );
  }

  return {
    provider: { type: SsoSettings?.provider?.type, ...formattedProvider },
    rosteringEnabled: SsoSettings?.rosteringEnabled,
  } as SsoSettings;
};

export function formatLastSyncDate(dateString: string) {
  if (!dateString) return 'N/A';

  return format(new Date(dateString), 'E MMM d, yyyy h:mm a');
}

export const getSyncStatusInfo = (syncStatus: string): { status: 'active' | 'pending' | 'failed'; label: string } => {
  const statusMap: Record<string, { status: 'active' | 'pending' | 'failed'; label: string }> = {
    completed: { status: 'active', label: 'Succeeded' },
    inprogress: { status: 'pending', label: 'In Progress' },
    failed: { status: 'failed', label: 'Failed' },
  };

  const syncStatusInfo = statusMap[syncStatus] || statusMap.failed;

  return syncStatusInfo;
};
