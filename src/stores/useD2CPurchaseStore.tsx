/* eslint-disable @typescript-eslint/no-unused-vars */
import { D2C_PURCHASE_TABLE_SIZE } from '@features/directToConsumers/D2CPurchaseTable/constants';
import { D2CPurchaseFilters, D2CPurchaseListStore } from '@features/directToConsumers/interfaces';
import { D2CPagination } from '@features/directToConsumers/interfaces/d2cPurchaseTable.types';
import { d2cPurchaseListResponse } from '@interfaces/d2c';
import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const initialD2CPagination: D2CPagination = {
  skip: 0,
  total: 0,
  limit: D2C_PURCHASE_TABLE_SIZE,
};

export const initialD2CState: D2CPurchaseListStore = {
  filters: {},
  d2cList: [],
  loading: false,
  pagination: initialD2CPagination,
  resetD2CPurchaseStore: () => {},
  setFilters: (filters?: D2CPurchaseFilters) => {},
  setLoading: (loading: boolean) => {},
  setD2CList: (d2cList: d2cPurchaseListResponse) => {},
  setPagination: (pagination: D2CPagination) => {},
};

export const useD2CPurchaseStore = createWithEqualityFn<D2CPurchaseListStore>()(
  devtools((set) => ({
    ...initialD2CState,
    setPagination: (pagination: D2CPagination) => {
      return set((state) => ({
        ...state,
        pagination,
      }));
    },
    setLoading: (loading: boolean) => {
      set((state) => ({
        ...state,
        loading,
      }));
    },
    setFilters: (filters?: D2CPurchaseFilters) => {
      set((state) => ({
        ...state,
        filters,
      }));
    },
    setD2CList: (response: d2cPurchaseListResponse) => {
      const { items, total } = response;

      return set((state) => ({
        ...state,
        d2cList: [...state.d2cList, ...items],
        pagination: {
          ...state.pagination,
          total,
        },
      }));
    },
    resetD2CPurchaseStore: () =>
      set((state) => ({
        ...state,
        d2cList: [],
        loading: false,
        pagination: initialD2CPagination,
      })),
  })),
  shallow,
);

export const setD2CPurchaseCallback: (data: d2cPurchaseListResponse) => void = (data: d2cPurchaseListResponse) => {
  const closure = useD2CPurchaseStore.getState();

  if (!closure.d2cList.length) {
    closure.setD2CList(data);
  }
  return closure;
};
