/* eslint-disable @typescript-eslint/no-unused-vars */
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools } from 'zustand/middleware';
import { ORGANIZATIONS_TABLE_SIZE } from '@features/organizations/OrganizationsTable/constants';
import { TenantListResponse } from '@interfaces';
import { OrganizationsPagination, OrganizationsStore, OrganizationsFilters, Sort } from './interfaces';

export const initialPagination: OrganizationsPagination = {
  page: 0,
  skip: 0,
  take: ORGANIZATIONS_TABLE_SIZE,
  total: 0,
};

export const initialState: OrganizationsStore = {
  filters: {
    search: '',
    stateFilter: '',
    typeFilter: '',
  },
  loading: false,
  organizations: [],
  pagination: initialPagination,
  sort: { sortBy: 'name', sortOrder: 'asc' },
  resetOrganizationsStore: () => {},
  setFilters: (filters?: OrganizationsFilters) => {},
  setLoading: (loading: boolean) => {},
  setOrganizations: (organizations: TenantListResponse) => {},
  setPagination: (pagination: OrganizationsPagination) => {},
  setSort: (sort: Sort) => {},
};

export const useOrganizationsStore = createWithEqualityFn<OrganizationsStore>()(
  devtools((set) => ({
    ...initialState,
    setPagination: (pagination: OrganizationsPagination) => {
      return set((state) => ({
        ...state,
        pagination,
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
    setFilters: (filters?: OrganizationsFilters) =>
      set((state) => ({
        ...state,
        filters,
      })),
    setOrganizations: (response: TenantListResponse) => {
      const { items, total } = response;

      return set((state) => ({
        ...state,
        organizations: [...state.organizations, ...items],
        pagination: {
          ...state.pagination,
          total,
        },
      }));
    },
    resetOrganizationsStore: () =>
      set((state) => ({
        ...state,
        organizations: [],
        loading: false,
        pagination: initialPagination,
        sort: { sortBy: 'name', sortOrder: 'asc' },
      })),
  })),
  shallow,
);

export const setOrganizationsCallback: (data: TenantListResponse) => void = (data: TenantListResponse) => {
  const closure = useOrganizationsStore.getState();

  if (!closure.organizations.length) {
    closure.setOrganizations(data);
  }

  return closure;
};
