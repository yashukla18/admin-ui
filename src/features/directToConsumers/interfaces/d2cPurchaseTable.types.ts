import { D2cListRequestFilter } from '@youscience/user-service-common';

export interface D2CPagination {
  skip: number;
  total: number;
  limit: number;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type D2CFilters = {
  purchaseStatus?: D2cListRequestFilter['purchaseStatus'];
  redemptionStatus?: D2cListRequestFilter['redemptionStatus'];
};

export type D2CPurchaseListRequestFilter = {
  searchText?: string;
  limit?: number;
  skip: number;
} & D2CFilters;

export interface D2CSearchProps {
  onSearch?: (query?: string) => void;
}
