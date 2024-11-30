import { useNotifyStore } from '@stores/notifyStore';
import { shallow } from 'zustand/shallow';
import { useRef } from 'react';
import { useUsersFiltersStore } from '@stores/useUsersFilters';
import { FindUsersQueryAllowedSorts } from '@youscience/user-service-common';
import { usersService } from '../services/users.service';
import { ApplyRequestUserFilters, GetUsersListRequest } from '../interfaces';

// TODO: possibly consolidate with useUsersFilters.tsx
export const useTanstackUsers = () => {
  const setPagination = useUsersFiltersStore((state) => state.setPagination);
  const setFilters = useUsersFiltersStore((state) => state.setFilters);
  const notify = useNotifyStore((state) => state.notify);

  const { page, total, skip, take } = useUsersFiltersStore((state) => state.pagination, shallow);
  const setSort = useUsersFiltersStore((state) => state.setSort);
  const sort = useUsersFiltersStore((state) => state.sort);

  const { search, roleFilter, organizationFilter, statusFilter, stateFilter } = useUsersFiltersStore(
    (state) => state.filters,
  );

  const newSkipRef = useRef<number>(0);

  // Request
  const getUsers = async (params: GetUsersListRequest) => {
    const { sort, page, ...rest } = params;

    try {
      const items = await usersService.getUsersList({
        ...rest,
        sort,
      });

      setPagination({ total: items?.length ?? 0, skip, page: params.page ?? page ?? 0, take });
      setFilters({
        organizationFilter: params.filters?.tenantId ?? '',
        roleFilter: params.filters?.roles ?? '',
        search: params.filters?.query ?? '',
        statusFilter: params.filters?.status ?? '',
        stateFilter: params.filters?.state ?? '',
      });
      setSort(sort);
    } catch (error) {
      notify({ message: 'There was an error loading users', severity: 'error' });
    }
  };

  // Helper function to reset store and fetch organizations
  const resetAndFetch = (params: GetUsersListRequest) => {
    newSkipRef.current = 0;
    void getUsers(params);
  };

  // Methods:
  const handlePage = async () => {
    const newSkip = newSkipRef.current + take;

    if (!total) return; // Fix until backend provides total
    // if (newSkip >= total) return;

    newSkipRef.current = newSkip;
    await getUsers({
      page,
      filters: {
        query: search,
        tenantId: organizationFilter,
        roles: roleFilter,
        status: statusFilter,
        state: stateFilter,
      },
      sort,
      skip: newSkip,
      take,
    });
  };

  const applyRequestFilters = (filters: ApplyRequestUserFilters) => {
    const {
      userRoleFilter = '',
      userOrgFilter = '',
      userQuery = '',
      userStatusFilter = '',
      userStateFilter = '',
    } = filters;

    resetAndFetch({
      filters: {
        query: userQuery || search,
        tenantId: userOrgFilter || organizationFilter,
        roles: userRoleFilter || roleFilter,
        status: userStatusFilter || statusFilter,
        state: userStateFilter || stateFilter,
      },
      sort,
      skip,
      take: 50,
    });
  };

  const handleSort = (sort: FindUsersQueryAllowedSorts & undefined) => {
    resetAndFetch({
      filters: {
        query: search,
        tenantId: organizationFilter,
        roles: roleFilter,
        status: statusFilter,
        state: stateFilter,
      },
      sort,
      skip,
      take,
    });
  };

  const onSearch = (query?: string) => {
    resetAndFetch({
      page: 1,
      skip: 0,
      filters: {
        query,
        tenantId: organizationFilter || '',
        roles: roleFilter || '',
        status: statusFilter || '',
        state: stateFilter || '',
      },
    });
  };

  const resetFilter = (filter: string) => {
    resetAndFetch({
      filters: {
        query: search || '',
        tenantId: filter === 'org' ? '' : organizationFilter,
        roles: filter === 'role' ? '' : roleFilter,
        status: filter === 'status' ? '' : statusFilter,
        state: filter === 'state' ? '' : stateFilter,
      },
      skip: 0,
      sort,
      take: 50,
    });
  };

  return {
    handlePage,
    onSearch,
    handleSort,
    applyRequestFilters,
    resetFilter,
  };
};
