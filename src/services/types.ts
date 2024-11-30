import { Sort } from '@interfaces';
import { FindQueryBase, UserList } from '@youscience/user-service-common';

export interface IPagination {
  page?: number;
  take?: number;
  sort?: string;
  sortOrder?: string;
  skip?: number;
  sortBy?: string;
}

export interface GenerateS3PresignedUrlParams {
  fileName: string;
  contentType: string;
}

export type AccessServiceQuery = {
  tenantId?: string;
  roles?: string[];
} & FindQueryBase;

export type TenantWithAccesses = Omit<UserList, 'access'> & { access: Exclude<UserList['access'], undefined> };

export interface UsersListRequest {
  page?: number;
  roles?: string[];
  search?: string;
  skip?: number;
  sort?: Sort;
  take?: number;
  tenantId?: string;
}
