import { InitialDataFunction, QueryClient } from '@tanstack/react-query';
import { UserListResponse } from '@interfaces/user';
import { UserList } from '@youscience/user-service-common';
import { USERS_TABLE_SIZE } from '../UsersTable/constants';
import { GetUsersListRequest } from '../interfaces';
import { fetchUsersListQuery } from './fetchUsers';

interface UserListPage {
  pages: UserListResponse;
  queryKey: [string, GetUsersListRequest];
}

export const fetchUsersQuery = () => ({
  queryKey: [
    'users',
    {
      skip: 0,
      take: USERS_TABLE_SIZE,
      filters: {
        query: '',
        tenantId: '',
        roles: '',
        status: '',
        state: '',
      },
    },
  ],
  queryFn: fetchUsersListQuery as unknown as InitialDataFunction<UserListPage>,

  initialPageParam: 0,
  getNextPageParam: (lastPage: { items: UserList; total: number }, allPages: unknown, lastPageParam: number) => {
    if (lastPage?.total === 0) {
      return undefined;
    }
    return lastPageParam + 1;
  },
  getPreviousPageParam: (firstPage: { items: UserList; total: number }, allPages: unknown, firstPageParam: number) => {
    if (firstPageParam <= 1) {
      return undefined;
    }
    return firstPageParam - 1;
  },
});

export async function loader(queryClient: QueryClient) {
  const query = fetchUsersQuery();

  return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchInfiniteQuery(query));
}
