import { TenantDocument } from '@youscience/user-service-common';
import { SortOrderType } from './table';

export type SortOptions =
  | 'name'
  | 'addresses'
  | 'addresses.state'
  | 'classification.type'
  | 'classification'
  | 'parent-organization';

export interface Sort {
  sortBy: SortOptions;
  sortOrder: SortOrderType;
}

export interface OrgListPagination {
  page: number;
  skip: number;
  take: number;
  total: number;
}

export interface PartialOrgListPagination {
  page?: number;
  skip?: number;
  take?: number;
  total?: number;
}

export interface OrgListFilters {
  search?: string;
  stateFilter?: string;
  typeFilter?: string;
}

export interface ApplyRequestOrgFilters {
  orgQuery?: string;
  orgStateFilter?: string;
  orgTypeFilter?: string;
}

export interface TenantSearchProps {
  onSearch?: (query?: string) => void;
}

export interface ExtendedOrgListPagination {
  page?: number;
  query?: string;
  skip?: number;
  sortBy?: string;
  sortOrder?: string;
  state?: string;
  take?: number;
  type?: string;
}

export interface AllowedOrganizationFilters {
  query?: string;
  state?: string;
  type?: string;
  ancestorOrgId?: string;
  parentOrgId?: string;
  legacyCertsId?: string;
}

export interface OrgListRequest {
  filters?: AllowedOrganizationFilters;
  page?: number;
  skip?: number;
  sort?: Sort;
  take?: number;
}

export interface TenantListResponse {
  items: TenantDocument[];
  total: number;
}
