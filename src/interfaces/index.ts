import { AccessDocument, TenantDocument } from '@youscience/user-service-common';
import {
  AllowedOrganizationFilters,
  OrgListPagination,
  PartialOrgListPagination,
  Sort,
  TenantListResponse,
} from './orgList.types';

export type SingleObject = Record<string, React.ReactNode>;

export interface PreferredAccess {
  currentAccess: AccessDocument['_id'];
}

export interface OrgViewLoaderData {
  accesses: { items: AccessDocument[]; total: number };
  details: TenantDocument;
}

export interface OrgListState {
  filters: AllowedOrganizationFilters;
  tenantId: string;
  loading?: boolean;
  orgList: TenantDocument[];
  associatedOrgs?: AccessDocument[];
  pagination: OrgListPagination;
  sort: Sort;
}

export interface OrgListStore extends OrgListState {
  resetOrgListStore: () => void;
  resetTenantId: () => void;
  setFilters: (filters?: AllowedOrganizationFilters) => void;
  setLoading: (loading: boolean) => void;
  setTenantId: (tenant: string) => void;
  setAssociatedOrgs: (tenants: AccessDocument[]) => void;
  setOrgList: (tenants: TenantListResponse) => void;
  setPagination: (pagination: PartialOrgListPagination) => void;
  setSort: (sort: Sort) => void;
  deleteAssociatedOrg: (userId: string, tenantId: string) => Promise<number>;
}

export interface Option {
  label: string;
  value: string;
  distinctId?: string | boolean;
}

export interface AxiosErrorWithResponse {
  response: { data: { error?: string; code?: string }; status?: number };
}

// Everything else
export * from './orgList.types';
