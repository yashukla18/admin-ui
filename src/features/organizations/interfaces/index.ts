import { TenantDocument, UserDocumentWithAccess } from '@youscience/user-service-common';
import { TenantListResponse } from '@interfaces';
import { OrganizationsFilters, OrganizationsPagination, Sort } from './orgTable.types';

export interface OrgViewLoaderData {
  orgAdmins: UserDocumentWithAccess[];
  details: TenantDocument;
  tenantChildren?: { items: TenantDocument[]; total: number };
}

export interface OrganizationsState {
  filters: OrganizationsFilters;
  loading?: boolean;
  organizations: TenantDocument[];
  pagination: OrganizationsPagination;
  sort: Sort;
}

export interface OrganizationsStore extends OrganizationsState {
  resetOrganizationsStore: () => void;
  setFilters: (filters?: OrganizationsFilters) => void;
  setLoading: (loading: boolean) => void;
  setOrganizations: (tenants: TenantListResponse) => void;
  setPagination: (pagination: OrganizationsPagination) => void;
  setSort: (sort: Sort) => void;
}

// Everything else
export * from './orgTable.types';
