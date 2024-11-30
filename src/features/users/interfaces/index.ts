import { ExpandedAccessList, FindUsersQueryAllowedSorts } from '@youscience/user-service-common';
import { UserListResponse } from '@interfaces/user';
import { UsersFilters, UserPagination, OrganizationFilter } from './userTable.types';

export interface UserViewLoaderData {
  accesses: UserListResponse;
  details: ExpandedAccessList;
}

export interface UsersListState {
  filters: UsersFilters;
  loading?: boolean;
  users: UserListResponse['items'];
  userAccessOrgs?: OrganizationFilter[];
  pagination: UserPagination;
  sort: FindUsersQueryAllowedSorts | undefined;
}

export interface UsersListStore extends UsersListState {
  resetUsersStore: () => void;
  setFilters: (filters?: UsersFilters) => void;
  setLoading: (loading: boolean) => void;
  setUsers: (users: UserListResponse) => void;
  setUserAccessOrgs: (users: UserListResponse) => void;
  setPagination: (pagination: UserPagination) => void;
  setSort: (sort: FindUsersQueryAllowedSorts | undefined) => void;
}

// Everything else
export * from './userTable.types';
