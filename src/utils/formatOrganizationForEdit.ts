/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable consistent-return */
import {
  AddressType,
  DeepPath,
  SsoSettings,
  TenantClassification,
  TenantDocument,
  TenantDocumentOmitIdAndDeepPath,
} from '@youscience/user-service-common';
import { ssoRosteringSettings } from '@features/organizations/Forms/SSORostering/ssoProviderForm';
import { returnPresentKeyVals } from './returnPresentKeyVals';
import { isAllEmptyEntries } from './helper';

export const NEW_TENANT = {
  name: '',
  addresses: [],
  deepPath: [],
  tags: [],
  classification: {
    type: '',
  },
  path: '',
  ssoSettings: {
    provider: { type: '' },
    rosteringEnabled: false,
  },
} as unknown as TenantDocumentOmitIdAndDeepPath;

const ncesHolder: string[] = [
  'district',
  'publicMiddleSchool',
  'privateMiddleSchool',
  'publicHighSchool',
  'privateHighSchool',
  'charterSchool',
  'government',
];
const ipedsHolder: string[] = ['postSecondary', 'collegeCommunityTrade', 'technicalCollege'];

const defaultAddress = {
  lines: [''],
  city: '',
  state: '',
  postCode: '',
  country: '',
};

interface OrgAddresses {
  city?: string;
  country?: string;
  isPrimary?: boolean;
  lines?: string[];
  postCode?: string;
  state: string;
  type?: AddressType;
}

interface EditOrgAddresses {
  city?: string;
  lines?: string[];
  postCode?: string;
  state: string;
  country?: string;
}

interface ncesDocumentSchema {
  name?: string;
  ncesId?: string;
  stateId?: string | null;
}

interface ipedsDocumentSchema {
  name?: string;
  ipedsId?: string;
}

interface EditOrgClassification {
  type?: TenantClassification;
  nces?: ncesDocumentSchema;
  ipeds?: ipedsDocumentSchema;
}

export interface EditOrgDetailsFrom {
  name?: string;
  classification?: {
    type?: TenantClassification;
    nces?: ncesDocumentSchema;
    ipeds?: ipedsDocumentSchema;
  };
  addresses?: EditOrgAddresses[];
  deepPath?: DeepPath[];
  path?: string;
  // ssoSettings?: { provider?: SsoSettings['provider']; rosteringEnabled?: boolean };
  provider?: ssoRosteringSettings['provider'] | { type: undefined };
  rosteringEnabled?: boolean;
}

export const classificationOfWhichType = (type = ''): string => {
  if (ncesHolder.includes(type)) return 'nces';
  if (ipedsHolder.includes(type)) return 'ipeds';
  return 'others';
};

const formatEditableClassification = ({ classification }: TenantDocument): EditOrgClassification => {
  if (classification && 'nces' in classification) {
    return {
      type: classification?.type,
      nces: {
        name: classification?.nces?.name ?? '',
        ncesId: classification?.nces?.ncesId ?? '',
        stateId: classification?.nces?.stateId ?? '',
      },
    };
  }
  if (classification && 'ipeds' in classification) {
    return {
      type: classification?.type,
      ipeds: {
        name: classification?.ipeds?.name ?? '',
        ipedsId: classification?.ipeds?.ipedsId ?? '',
      },
    };
  }
  return {
    type: classification?.type,
  };
};

function formatAddresses(addresses?: OrgAddresses[]): EditOrgAddresses[] {
  if (!addresses?.length) return [{ ...defaultAddress }];

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

const formatAddressToOriginal = (addresses: EditOrgAddresses[] | undefined) => {
  const sanitizedAddresses =
    addresses
      ?.filter(
        (address) =>
          !isAllEmptyEntries([
            address?.lines?.[0] ?? '',
            address?.city ?? '',
            address?.state ?? '',
            address?.postCode ?? '',
            address?.country ?? '',
          ]),
      )
      ?.map((address) => {
        const formattedAddress = {
          ...returnPresentKeyVals({
            city: address?.city,
            country: address?.country,
            postCode: address?.postCode,
            state: address.state,
          }),
        };

        if (address?.lines && address.lines.length > 0 && address.lines[0] !== '') {
          formattedAddress.lines = typeof address.lines === 'string' ? [address.lines] : address.lines;
        }

        return formattedAddress as unknown as EditOrgAddresses;
      }) ?? [];

  return sanitizedAddresses.length > 0 ? [sanitizedAddresses[0]] : [];
};

const newClassificationUpdate = (classification: EditOrgClassification) => {
  if (classificationOfWhichType(classification?.type) === 'nces') {
    return {
      type: classification?.type,
      nces: {
        name: classification?.nces?.name ?? '',
        ncesId: classification?.nces?.ncesId ?? '',
        stateId: classification?.nces?.stateId ?? null,
      },
    };
  }
  if (classificationOfWhichType(classification?.type) === 'ipeds') {
    return {
      type: classification?.type,
      ipeds: {
        name: '',
        ipedsId: classification?.ipeds?.ipedsId ?? '',
      },
    };
  }
  return {
    type: classification?.type,
  };
};

const updateUniqueIdOnly = (classification: EditOrgClassification, originalData: TenantDocument) => {
  if (
    classificationOfWhichType(classification?.type) === 'nces' &&
    originalData?.classification &&
    'nces' in originalData?.classification
  ) {
    return {
      type: classification?.type,
      nces: {
        ncesId: classification?.nces?.ncesId ?? '',
        name: classification?.nces?.name ?? '',
        stateId: classification?.nces?.stateId ?? '',
      },
    };
  }
  if (
    classificationOfWhichType(classification?.type) === 'ipeds' &&
    originalData?.classification &&
    'ipeds' in originalData?.classification
  ) {
    return {
      type: classification?.type,
      ipeds: {
        ipedsId: classification?.ipeds?.ipedsId ?? '',
        name: originalData?.classification?.ipeds?.name,
      },
    };
  }
  return {};
};

const formatSubmittableClassification = (
  classification: EditOrgClassification,
  originalData: TenantDocument,
): EditOrgClassification => {
  if (classification?.type !== originalData?.classification?.type) {
    return newClassificationUpdate(classification);
  }
  if (classification?.type === originalData?.classification?.type) {
    return updateUniqueIdOnly(classification, originalData);
  }
  return {
    type: classification?.type,
  };
};

const allowedConfigurableSsoSettings = (organization: TenantDocument) =>
  (organization?.ssoSettings?.provider?.type !== 'Google'
    ? organization?.ssoSettings
    : undefined) as ssoRosteringSettings;

export const formatOrganizationForEdit = (org: TenantDocument): EditOrgDetailsFrom => {
  const { name, addresses, deepPath, path } = org;
  const formattedSsoSettings = allowedConfigurableSsoSettings(org);
  const allowedSSOSettings = formattedSsoSettings ?? undefined;
  const provider = allowedSSOSettings?.provider ?? { type: undefined };

  const formattedOrganization = {
    name,
    addresses: formatAddresses(addresses as OrgAddresses[]),
    classification: formatEditableClassification(org),
    deepPath,
    path,
    provider,
    rosteringEnabled: allowedSSOSettings?.rosteringEnabled,
    // ssoSettings: {
    //   provider,
    //   rosteringEnabled: allowedSSOSettings?.rosteringEnabled,
    // },
  };

  return formattedOrganization;
};

export const formatSubmittableTenantData = (
  changedData: EditOrgDetailsFrom,
  originalData: TenantDocument,
): TenantDocument => {
  const classification = formatSubmittableClassification(
    changedData?.classification as EditOrgClassification,
    originalData,
  );
  const updatedTenantRecord = {
    name: changedData?.name,
    addresses: formatAddressToOriginal(changedData?.addresses),
    path: changedData?.path,
  };

  if (Object.keys(classification).length) {
    return { ...updatedTenantRecord, ...{ classification } } as EditOrgDetailsFrom as TenantDocument;
  }
  return updatedTenantRecord as EditOrgDetailsFrom as TenantDocument;
};

export const formatSubmittableSsoSettings = (
  changedData: EditOrgDetailsFrom,
  originalData: TenantDocument,
): undefined | SsoSettings => {
  const { provider = undefined, rosteringEnabled = false } = changedData;
  const { ssoSettings } = originalData;
  const modifiedSsoSettings = { provider, rosteringEnabled };

  if (
    (modifiedSsoSettings?.provider?.type === undefined || modifiedSsoSettings?.provider?.type === '') &&
    ssoSettings?.provider?.type === undefined
  ) {
    return;
  }
  if (modifiedSsoSettings?.provider?.type === '' && ssoSettings?.provider?.type !== undefined) {
    return { rosteringEnabled: false };
  }
  return modifiedSsoSettings as SsoSettings;
};
