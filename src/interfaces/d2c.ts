import { D2cGetPurchasesResponse } from '@youscience/user-service-common';

export interface d2cPurchaseListResponse {
  items: D2cGetPurchasesResponse;
  total: number;
}
