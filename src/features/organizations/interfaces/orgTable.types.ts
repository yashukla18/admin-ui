import { AllowedOrganizationFilters } from '@interfaces/orgList.types';
import { SortOrderType } from '@interfaces/table';

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

export interface NewSort {
  sort: SortOptions;
  sortOrder: SortOrderType;
}

export interface OrganizationsPagination {
  page: number;
  skip: number;
  take: number;
  total: number;
}

export interface OrganizationsFilters {
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

export interface OrganizationsListRequest {
  filters?: AllowedOrganizationFilters;
  page?: number;
  skip?: number;
  sort?: Sort;
  take?: number;
  signal?: AbortSignal;
}
