import { FindUsersQueryAllowedSorts } from '@youscience/user-service-common';

export interface UserPagination {
  page: number;
  skip: number;
  take: number;
  total: number;
}

export interface UsersFilters {
  search: string;
  organizationFilter: string;
  roleFilter: string;
  statusFilter: string;
  stateFilter: string;
}

export interface ApplyRequestUserFilters {
  userQuery?: string;
  userOrgFilter?: string;
  userRoleFilter?: string;
  userStatusFilter?: string;
  userStateFilter?: string;
}

export interface UserSearchProps {
  onSearch?: (query?: string) => void;
}

export interface AllowedUsersFilters {
  query?: string;
  tenantId?: string;
  roles?: string;
  status?: string;
  state?: string;
}

export interface OrganizationFilter {
  name: string;
  id: string;
}

export interface GetUsersListRequest {
  filters?: AllowedUsersFilters;
  page?: number;
  skip?: number;
  sort?: FindUsersQueryAllowedSorts | undefined;
  take?: number;
  tenantId?: string;
  roles?: string[];
  state?: string;
}
