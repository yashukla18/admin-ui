// import { TenantDocument } from '@youscience/user-service-common';
import { QueryClient } from '@tanstack/react-query';
import { fetchTenantsQuery } from '../tanstack/queries';

export async function loader(queryClient: QueryClient) {
  const query = fetchTenantsQuery({});

  return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchInfiniteQuery(query));
}
