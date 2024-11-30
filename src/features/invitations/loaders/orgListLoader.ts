import { TenantDocument } from '@youscience/user-service-common';
import { ORGANIZATIONS_TABLE_SIZE } from '@features/organizations/OrganizationsTable/constants';
import { fetchTenants } from '@features/organizations/services/organizations-service';
import { setOrgListCallback } from '@stores/orgListStore';

export async function loader() {
  const { data } = await fetchTenants({
    page: ORGANIZATIONS_TABLE_SIZE,
    skip: 0,
    sort: { sortBy: 'name', sortOrder: 'asc' },
    take: ORGANIZATIONS_TABLE_SIZE,
  });

  // Filter out all of the youscience root admins
  const sanitizedData = data.items.filter((item: TenantDocument) => item.tenantId !== import.meta.env.VITE_ROOT_ORG_ID);

  setOrgListCallback({ ...data, items: sanitizedData });

  return { ...data, items: sanitizedData };
}
