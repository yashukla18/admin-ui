import { TenantDocument } from '@youscience/user-service-common';
import { TenantListResponse } from '@interfaces';
import { ORGANIZATIONS_TABLE_SIZE } from '../../OrganizationsTable/constants';
import { fetchTenants } from '../../services/organizations-service';
import { OrganizationsListRequest } from '../../interfaces';

const fetchTenantsRequest = async ({
  filters = {},
  sort,
  skip = 0,
  take = ORGANIZATIONS_TABLE_SIZE,
}: OrganizationsListRequest): Promise<TenantListResponse> => {
  const rootOrgKeywords = ['youscience', 'youscience (root)', 'root', 'you'];
  // Hack until we can fix the backend
  const { query = '', ...rest } = filters;
  const refinedQuery = rootOrgKeywords.includes(query.toLowerCase()) ? 'youscience (root)' : query;

  const { data } = (await fetchTenants({
    page: ORGANIZATIONS_TABLE_SIZE,
    sort: { sortBy: sort?.sortBy ?? 'name', sortOrder: sort?.sortOrder ?? 'asc' },
    take,
    filters: { query: refinedQuery, ...rest },
    skip,
  })) ?? { items: [], total: 0 };

  return data;
};

export const fetchTenantsQuery = ({
  filters,
  sort,
  skip = 0,
  take = ORGANIZATIONS_TABLE_SIZE,
}: OrganizationsListRequest) => ({
  queryKey: ['tenants', skip, take, filters, sort],
  queryFn: ({ pageParam }: { pageParam: number }) =>
    fetchTenantsRequest({
      skip: pageParam * 50,
      take,
      filters,
      sort: { sortBy: sort?.sortBy ?? 'name', sortOrder: sort?.sortOrder ?? 'asc' },
    }),
  initialPageParam: 0,
  getNextPageParam: (
    lastPage: { items: TenantDocument[]; total: number },
    allPages: unknown,
    lastPageParam: number,
  ) => {
    if (lastPage.total === 0) {
      return undefined;
    }

    return lastPageParam + 1;
  },
});
