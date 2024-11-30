import { usersService } from '../services/users.service';
import { GetUsersListRequest } from '../interfaces';

// TODO: move into usersTableLoader
export const fetchUsersListQuery = async (params: GetUsersListRequest) => {
  const { skip, filters, sort } = params;
  const items = await usersService.getUsersList({
    skip,
    take: 50,
    sort,
    filters: {
      query: filters?.query,
      tenantId: filters?.tenantId,
      roles: filters?.roles,
      status: filters?.status,
      state: filters?.state,
    },
  });

  const response = { items: items ?? [], total: items?.length ?? 0 };

  return response;
};
