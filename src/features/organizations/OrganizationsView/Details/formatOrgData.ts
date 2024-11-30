import { SingleObject } from '@interfaces';
import { formatClassificationType } from '@utils/helper';
import { returnPresentKeyVals } from '@utils/returnPresentKeyVals';
import { TenantDocument } from '@youscience/user-service-common';

export const formatOrgData = (OrgData: TenantDocument) => {
  const { name, addresses, phones, classification, deepPath } = OrgData;

  // ADDRESSES

  const filteredAddresses = addresses?.map((address) => {
    return returnPresentKeyVals({
      'addressLine 1': address?.lines?.[0],
      'addressLine 2': address?.lines?.[1] ? address?.lines?.[1] : null,
      city: address.city,
      state: address.state,
      zip: address.postCode,
      country: address.country,
    }) as SingleObject;
  });

  // NCES OR IPEDS
  let nces: string | undefined = '';
  let ipeds: string | undefined = '';

  if (classification && 'nces' in classification) {
    nces = classification?.nces?.ncesId;
  }
  if (classification && 'ipeds' in classification) {
    ipeds = classification?.ipeds?.ipedsId;
  }
  const uniqueId = returnPresentKeyVals({
    ncesId: nces,
    ipedsId: ipeds,
  }) as SingleObject;

  // PHONE NUMBERS
  const filteredPhones = phones?.map((phone) => returnPresentKeyVals(phone) as SingleObject);
  // NEW ORGANIZATION
  const dtype = formatClassificationType(classification?.type);
  let newOrganization = null;

  if (!dtype) {
    newOrganization = {
      name,
    };
  } else {
    newOrganization = {
      name,
      type: formatClassificationType(classification?.type),
    };
  }

  return { filteredAddresses, filteredPhones, newOrganization, deepPath, uniqueId };
};
