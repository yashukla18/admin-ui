import { AccessDocument, UserDocumentOmitId } from '@youscience/user-service-common';
import { commonService } from '@services/common.service';
import { AxiosResponse } from 'axios';
import { AssociatedOrgSchema } from '@interfaces/associatedOrgs';
import { UserInviteSchema } from '@features/invitations/UserInvite/constants';
import { updateDataSchema, updatePermissionSchema } from '../Forms/AssociatedOrgs/AssociatedOrgs.types';

export const apiUpdateUserById = (
  userId: string,
  user: Partial<UserDocumentOmitId>,
): Promise<AxiosResponse<UserDocumentOmitId>> => {
  return commonService
    .fetchData<unknown, UserDocumentOmitId>({
      url: `/admin/users/${userId}`,
      method: 'patch',
      data: {
        ...user,
      },
    })
    .catch((err) => {
      throw err;
    });
};

export const apiGetUserAccess = (userId: string): Promise<AxiosResponse<AccessDocument[] | void>> => {
  return commonService
    .fetchData<{ id: string }, AccessDocument[]>({
      url: `/users/${userId}/accesses`,
      method: 'get',
    })
    .catch((err) => {
      throw err;
    });
};

export const apiUpdateTenantData = async (accessId: string, data: updateDataSchema): Promise<boolean> => {
  const response = await commonService
    .fetchData({
      url: `/access/${accessId}/tenant/data`,
      method: 'put',
      data,
    })
    .catch((err) => {
      throw err;
    });

  return !!response.data;
};

export const apiUpdateTenantPermission = async (accessId: string, data: updatePermissionSchema): Promise<boolean> => {
  const response = await commonService
    .fetchData({
      url: `/access/${accessId}/tenant/permission`,
      method: 'put',
      data,
    })
    .catch((err) => {
      throw err;
    });

  return !!response.data;
};

export const apiFetchPasswordResetLink = (userId: string, id: string) => {
  return commonService.fetchData<{ id: string }, { link: string }>({
    url: `/users/${userId}/identities/${id}/passwordResetLink`,
    method: 'get',
  });
};

export const apiUpsertUser = (user: UserInviteSchema): Promise<AxiosResponse<UserInviteSchema>> => {
  return commonService
    .fetchData<unknown, UserInviteSchema>({
      url: `/users`,
      method: 'put',
      data: {
        ...user,
      },
    })
    .catch((err: string) => {
      throw new Error(err);
    });
};

export const apiSendAccessInvitation = (data: AssociatedOrgSchema): Promise<AxiosResponse<AssociatedOrgSchema>> => {
  return commonService
    .fetchData<unknown, AssociatedOrgSchema>({
      url: `/access/invite`,
      method: 'post',
      data,
    })
    .catch((err: string) => {
      throw new Error(err);
    });
};

export const apiDeleteUserFromTenant = (userId: string, tenantId: string) => {
  return commonService
    .fetchData({
      url: `/users/${userId}/accesses?tenantId=${tenantId}`,
      method: 'delete',
    })
    .catch((err: string) => {
      throw new Error(err);
    });
};

export const apiRemoveUserIdentity = (userId: string, id: string) => {
  return commonService
    .fetchData({
      url: `/users/${userId}/identities/${id}`,
      method: 'delete',
    })
    .catch((err: string) => {
      throw new Error(err);
    });
};

// export const apiUpdateSharingUserById = async (data: UserSettings) => {
//   const response = await ApiService.fetchData<UserSettings, boolean>({
//     url: `/users/`,
//     method: 'put',
//     data: {
//       ...data,
//     },
//   }).catch((err) => {
//     throw err;
//   });

//   return response.data;
// };
