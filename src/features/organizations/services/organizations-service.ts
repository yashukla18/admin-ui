import { AxiosResponse, AxiosError } from 'axios';
import {
  BulkInvitation,
  BulkInviteValidationResult,
  SsoSettings,
  TenantDocument,
} from '@youscience/user-service-common';
import { commonService } from '@services/common.service';
import { GenerateS3PresignedUrlParams, IPagination } from '@services/types';
import { sanitizeRequest } from '@utils/sanitizeRequest';
import { TenantListResponse } from '@interfaces';
import { OrganizationsListRequest } from '../interfaces';
import { OrgSubscriptionValues } from '../constants';

const CommonService = commonService;

export const fetchTenants = ({ filters, sort, skip, take, signal }: OrganizationsListRequest) => {
  const sanitizedRequest = sanitizeRequest({
    ...filters,
    sort: sort?.sortBy,
    sortOrder: sort?.sortOrder,
    search: filters?.query?.trim(),
    limit: take,
    skip,
  });

  return CommonService.fetchData<IPagination, TenantListResponse>({
    url: '/tenants',
    method: 'get',
    params: sanitizedRequest,
    signal,
  }).catch((err) => {
    throw err;
  });
};

export const fetchTenantById = (id: string) => {
  return CommonService.fetchData<{ id: string }, TenantDocument>({
    url: `/tenants/${id}`,
    method: 'get',
  }).catch((err) => {
    throw err;
  });
};

export const apiGenerateSignedUrl = (data: GenerateS3PresignedUrlParams, tenantId: string) => {
  return CommonService.fetchData<GenerateS3PresignedUrlParams, { url: string }>({
    url: `/tenant/${tenantId}/access/uploadUrl`,
    method: 'post',
    data,
  }).catch((err) => {
    throw err;
  });
};

export const apiUpdateTenantById = async (tenantId: string, data: OrgSubscriptionValues): Promise<boolean> => {
  const response = await CommonService.fetchData({
    url: `/tenants/${tenantId}`,
    method: 'patch',
    data,
  }).catch((err) => {
    throw err;
  });

  return !!response.data;
};

export const apiFetchSsoSettingsByTenantId = (tenantId: string): Promise<AxiosResponse<SsoSettings> | null> => {
  return CommonService.fetchData<{ tenantId: string }, SsoSettings>({
    url: `/admin/tenants/${tenantId}/sso`,
    method: 'get',
  }).catch((err: AxiosError<Error>) => {
    if (err.response?.status === 404) return null;
    throw err;
  });
};

export const bulkInviteValidate = (data: BulkInvitation[]) => {
  return CommonService.fetchData<BulkInvitation[], BulkInviteValidationResult>({
    url: '/access/invite/bulk/validate',
    method: 'post',
    data,
  }).catch((err) => {
    throw err;
  });
};
