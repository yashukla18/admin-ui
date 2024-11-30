import { fetchTenantById } from '@features/organizations/services/organizations-service';
import { TenantDocument } from '@youscience/user-service-common';

const getOrgById = async (id: string): Promise<TenantDocument | undefined> => {
  try {
    const { data } = await fetchTenantById(id);
    return data;
  } catch (error) {
    throw error;
  }
};

export default getOrgById;
