/* eslint-disable @typescript-eslint/no-unused-vars */
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools } from 'zustand/middleware';
import { ORGANIZATIONS_TABLE_SIZE } from '@features/organizations/OrganizationsTable/constants';
import {
  AllowedOrganizationFilters,
  OrgListPagination,
  OrgListStore,
  PartialOrgListPagination,
  Sort,
  TenantListResponse,
} from '@interfaces';
import { apiDeleteUserFromTenant } from '@features/users/services/UserService';
import { AccessDocument } from '@youscience/user-service-common';

export const initialPagination: OrgListPagination = {
  page: 1,
  skip: 0,
  take: ORGANIZATIONS_TABLE_SIZE,
  total: 0,
};

export const initialState: OrgListStore = {
  filters: {
    query: '',
    state: '',
    type: '',
  },
  loading: false,
  tenantId: '',
  orgList: [],
  associatedOrgs: [],
  pagination: initialPagination,
  sort: { sortBy: 'name', sortOrder: 'asc' },
  resetOrgListStore: () => {},
  resetTenantId: () => {},
  setFilters: (filters?: AllowedOrganizationFilters) => {},
  setLoading: (loading: boolean) => {},
  setTenantId: (tenantId: string) => {},
  setOrgList: (organizations: TenantListResponse) => {},
  setAssociatedOrgs: (associatedOrgs: AccessDocument[]) => {},
  deleteAssociatedOrg: (userId: string, tenantId: string) => {
    return Promise.resolve(0);
  },
  setPagination: (pagination: PartialOrgListPagination) => {},
  setSort: (sort: Sort) => {},
};

export const useOrgListStore = createWithEqualityFn<OrgListStore>()(
  devtools((set, get) => ({
    ...initialState,
    setPagination: (pagination: PartialOrgListPagination) => {
      return set((state) => ({
        ...state,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }));
    },
    setSort: (sort: Sort) => {
      set((state) => ({
        ...state,
        sort: { sortBy: sort?.sortBy, sortOrder: sort?.sortOrder },
      }));
    },
    setLoading: (loading: boolean) =>
      set((state) => ({
        ...state,
        loading,
      })),
    setFilters: (filters?: AllowedOrganizationFilters) =>
      set((state) => ({
        ...state,
        filters: filters ?? undefined,
      })),
    setTenantId: (tenantId: string) =>
      set((state) => ({
        ...state,
        tenantId,
      })),
    resetTenantId: () =>
      set((state) => ({
        ...state,
        tenantId: '',
      })),
    setAssociatedOrgs: (associatedOrgs: AccessDocument[]) =>
      set((state) => ({
        ...state,
        associatedOrgs,
      })),

    deleteAssociatedOrg: async (userId: string, tenantId: string) => {
      let response;

      try {
        response = await apiDeleteUserFromTenant(userId, tenantId);

        if (response.status === 204) {
          const associatedOrgs: AccessDocument[] =
            get().associatedOrgs?.filter((org) => org.tenant.tenantId !== tenantId) ?? [];

          get().setAssociatedOrgs(associatedOrgs);
        }
        return response.status;
      } catch (error) {
        return response?.status ?? 500;
      }
    },

    setOrgList: (response: TenantListResponse) => {
      const { items, total } = response;

      return set((state) => {
        const {
          pagination: { skip = 0, take = 50 },
        } = state;

        if (skip === 0 || total < take) {
          // prevents orgList from appending duplicates
          return {
            ...state,
            orgList: [...items],
            pagination: {
              ...state.pagination,
              total,
            },
          };
        }
        return {
          ...state,
          orgList: [...state.orgList, ...items],
          pagination: {
            ...state.pagination,
            total,
          },
        };
      });
    },
    resetOrgListStore: () =>
      set((state) => ({
        ...state,
        orgList: [],
        loading: false,
        pagination: initialPagination,
        sort: { sortBy: 'name', sortOrder: 'asc' },
      })),
  })),
  shallow,
);

export const setOrgListCallback: (data: TenantListResponse) => void = (data: TenantListResponse) => {
  const closure = useOrgListStore.getState();

  if (!closure.orgList.length) {
    closure.setOrgList(data);
  }

  return closure;
};
