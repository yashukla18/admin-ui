/* eslint-disable @typescript-eslint/unbound-method */
import { BaseService } from '@services/base.service';
import {
  SsoSettings,
  TenantDocument,
  TenantDocumentOmitIdAndDeepPath,
  UserDocument,
} from '@youscience/user-service-common';
import { AxiosResponse } from 'axios';

class TenantService extends BaseService {
  public tenantGetUsers = ({
    roles,
    ...rest
  }: {
    tenantId?: string;
    roles: string[];
    skip?: number;
    take?: number;
  }): Promise<void | UserDocument[]> => {
    const url = roles?.length ? `/users?roles=${roles.join(',').replaceAll(',', '&roles=')}` : '/users';

    return this.get<UserDocument[], AxiosResponse<UserDocument[]>>(url, {
      params: {
        ...rest,
        includeAccess: true,
        spreadAccess: true,
      },
    })
      .then(this.success)
      .catch(this.error);
  };

  public getUserById = (userId: string): Promise<void | UserDocument> => {
    return this.get<UserDocument, AxiosResponse<UserDocument>>(`/users/${userId}`).then(this.success).catch(this.error);
  };

  public getTenantById = (tenantId: string): Promise<void | TenantDocument> => {
    return this.get<TenantDocument, AxiosResponse<TenantDocument>>(`/tenants/${tenantId}`)
      .then(this.success)
      .catch(this.error);
  };

  public tenantUpdateProductData = (tenantId: string): Promise<void | TenantDocument> => {
    return this.get<TenantDocument, AxiosResponse<TenantDocument>>(`/tenants/${tenantId}`)
      .then(this.success)
      .catch(this.error);
  };

  public apiCreateTenant = (tenantData: Partial<TenantDocumentOmitIdAndDeepPath>) => {
    const data = { ...tenantData, ...{ tags: [] } };

    return this.post<
      TenantDocumentOmitIdAndDeepPath,
      Partial<TenantDocumentOmitIdAndDeepPath>,
      AxiosResponse<TenantDocument>
    >('/admin/tenants', data)
      .then(this.success)
      .catch(this.error);
  };

  public getTenantSSOSettings = (tenantId: string): Promise<void | SsoSettings> => {
    return this.get<SsoSettings, AxiosResponse<SsoSettings>>(`/admin/tenants/${tenantId}/sso`)
      .then(this.success)
      .catch(this.error);
  };

  public updateTenantSSOSettings = (tenantId: string, ssoSettings: SsoSettings): Promise<void | SsoSettings> => {
    return this.put<SsoSettings, SsoSettings>(`/admin/tenants/${tenantId}/sso`, ssoSettings)
      .then(this.success)
      .catch(this.error);
  };

  public apiUpdateTenantById = (
    tenantId: string,
    updatedData: Partial<TenantDocumentOmitIdAndDeepPath>,
  ): Promise<void | TenantDocument> => {
    const data = { ...updatedData };

    return this.patch<
      TenantDocumentOmitIdAndDeepPath,
      Partial<TenantDocumentOmitIdAndDeepPath>,
      AxiosResponse<TenantDocument>
    >(`/tenants/${tenantId}`, data)
      .then(this.success)
      .catch(this.error);
  };
}

export const tenantService = new TenantService();
