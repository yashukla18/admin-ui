import { d2cPurchaseListResponse } from '@interfaces/d2c';
import { D2CPagination } from './d2cPurchaseTable.types';

export interface D2CPurchaseFilters {
  purchaseStatus?: 'complete' | 'refunded' | 'internal' | null;
  redemptionStatus?: 'pending' | 'redeemed' | 'na' | null;
  searchText?: string;
}

export interface D2CPurchaseListState {
  filters: D2CPurchaseFilters;
  d2cList: d2cPurchaseListResponse['items'];
  pagination: D2CPagination;
  loading?: boolean;
}

export interface D2CPurchaseListStore extends D2CPurchaseListState {
  resetD2CPurchaseStore: () => void;
  setFilters: (filters?: D2CPurchaseFilters) => void;
  setLoading: (loading: boolean) => void;
  setD2CList: (d2cList: d2cPurchaseListResponse) => void;
  setPagination: (pagination: D2CPagination) => void;
}
