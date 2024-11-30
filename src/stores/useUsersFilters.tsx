/* eslint-disable @typescript-eslint/no-unused-vars */
import { USERS_TABLE_SIZE } from '@features/users/UsersTable/constants';
import { UserPagination, UsersFilters } from '@features/users/interfaces';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools } from 'zustand/middleware';
import { UserListResponse } from '@interfaces/user';
import { FindUsersQueryAllowedSorts, FindUsersQueryAllowedSortsConst } from '@youscience/user-service-common';

export type ListEmployersRequestSortType = 'all' | 'visible' | 'notVisible';

export interface UseUsersFiltersState {
  filters: UsersFilters;
  pagination: UserPagination;
  sort: FindUsersQueryAllowedSorts | undefined;
}

export interface UseUsersFiltersStore extends UseUsersFiltersState {
  resetUsersSearchStore: () => void;
  setFilters: (filters?: UsersFilters) => void;
  setPagination: (pagination: UserPagination) => void;
  setSort: (sort: FindUsersQueryAllowedSorts | undefined) => void;
  onSearch: (search: string) => void;
}

export const initialPagination: UserPagination = {
  take: USERS_TABLE_SIZE,
  page: 1,
  skip: 0,
  total: 0,
};

export const initialState: UseUsersFiltersStore = {
  filters: {
    search: '',
    organizationFilter: '',
    roleFilter: '',
    statusFilter: '',
    stateFilter: '',
  },
  pagination: initialPagination,
  sort: undefined,
  resetUsersSearchStore: () => {},
  setPagination: (pagination: UserPagination) => {},
  setSort: (sort: FindUsersQueryAllowedSorts | undefined) => {},
  setFilters: (filters?: UsersFilters) => {},
  onSearch: (search: string) => {},
};

export interface PaginatedListResponse {
  total: number;
  items: UserListResponse;
}

export const useUsersFiltersStore = createWithEqualityFn<UseUsersFiltersStore>()(
  devtools((set) => ({
    ...initialState,
    setPagination: (pagination: UserPagination) => {
      return set((state) => ({
        ...state,
        pagination,
      }));
    },
    setSort: (sort: FindUsersQueryAllowedSorts | undefined) => {
      set((state) => ({
        ...state,
        sort,
      }));
    },
    setFilters: (filters?: UsersFilters) =>
      set((state) => ({
        ...state,
        filters,
      })),
    onSearch: (search: string) => {
      set((state) => ({
        ...state,
        filters: {
          ...state.filters,
          search,
        },
      }));
    },
    resetUsersSearchStore: () =>
      set((state) => ({
        ...state,
        pagination: initialPagination,
        sort: undefined,
      })),
  })),
  shallow,
);
