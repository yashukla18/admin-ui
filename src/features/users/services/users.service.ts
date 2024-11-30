/* eslint-disable @typescript-eslint/unbound-method */
import { ExtendedTimeoutService } from '@services/extendedTimeout.service';
import { sanitizeRequest } from '@utils/sanitizeRequest';
import { AccessDocument, UserDocument, UserDocumentOmitId } from '@youscience/user-service-common';
import { AxiosResponse } from 'axios';
import { UserListResponse } from '@interfaces/user';
import { GetUsersListRequest } from '../interfaces';
import { updateDataSchema, updatePermissionSchema } from '../Forms/AssociatedOrgs/AssociatedOrgs.types';

class UsersService extends ExtendedTimeoutService {
  public getUsersList = ({
    roles,
    filters,
    ...rest
  }: GetUsersListRequest): Promise<void | UserListResponse['items']> => {
    const { query, tenantId, ...restFilters } = filters ?? {};
    const request = sanitizeRequest({
      ...rest,
      ...restFilters,
      search: query ?? '',
      tenantId,
      includeAccess: true,
      roles: restFilters.roles,
      spreadAccess: true,
    });

    return this.get<UserListResponse['items'], AxiosResponse<UserListResponse['items']>>('/users', {
      params: request,
    })
      .then(this.success)
      .catch(this.error);
  };

  public getUserById = (userId: string): Promise<void | UserDocument> => {
    return this.get<UserDocument, AxiosResponse<UserDocument>>(`/users/${userId}`).then(this.success).catch(this.error);
  };

  public apiUpdateUserById = (
    userId: string,
    user: Partial<UserDocumentOmitId>,
  ): Promise<void | UserDocumentOmitId> => {
    const data = { ...user };
    const path = `/users/${userId}`;

    return this.patch<UserDocumentOmitId, Partial<UserDocumentOmitId>, AxiosResponse<UserDocumentOmitId>>(path, data)
      .then(this.success)
      .catch(this.error);
  };

  public apiGetUserAccess = (userId: string): Promise<void | AccessDocument> => {
    return this.get<AccessDocument, AxiosResponse<AccessDocument>>(`/users/${userId}/accesses`)
      .then(this.success)
      .catch(this.error);
  };

  public apiUpdateTenantData = async (accessId: string, data: updateDataSchema): Promise<boolean> => {
    const response = await this.put<updateDataSchema, updateDataSchema, AxiosResponse<updateDataSchema>>(
      `/access/${accessId}/tenant/data`,
      data,
    )
      .then(this.success)
      .catch(this.error);

    return !!response;
  };

  public apiUpdateTenantPermission = async (accessId: string, data: updatePermissionSchema): Promise<boolean> => {
    const response = await this.put<
      updatePermissionSchema,
      updatePermissionSchema,
      AxiosResponse<updatePermissionSchema>
    >(`/access/${accessId}/tenant/permission`, data)
      .then(this.success)
      .catch(this.error);

    return !!response;
  };

  public apiFetchPasswordResetLink = (userId: string, id: string): Promise<void | { link: string }> => {
    return this.get<{ link: string }, AxiosResponse<{ link: string }>>(
      `/users/${userId}/identities/${id}/passwordResetLink`,
    )
      .then(this.success)
      .catch(this.error);
  };
}

export const usersService = new UsersService();
