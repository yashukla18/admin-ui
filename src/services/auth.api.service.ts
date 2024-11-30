/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment */
import { UserDocumentWithAccess, MeWithAccessRecordsApiResponse } from '@youscience/user-service-common';
import { PreferredAccess } from '@interfaces';
import { AxiosResponse } from 'axios';
import { BaseService } from './base.service';

class AuthService extends BaseService {
  public getUser = (): Promise<void | MeWithAccessRecordsApiResponse> => {
    return this.get<MeWithAccessRecordsApiResponse, AxiosResponse<MeWithAccessRecordsApiResponse>>('/me')
      .then(this.success)
      .catch(this.error);
  };

  public getUserPreferences = (): Promise<void | UserDocumentWithAccess> => {
    return this.get<UserDocumentWithAccess, AxiosResponse<UserDocumentWithAccess>>('/me/preferences')
      .then(this.success)
      .catch(this.error);
  };

  public updateUserPreferences = (preferredAccess: PreferredAccess): Promise<void | PreferredAccess> => {
    return this.patch<PreferredAccess, PreferredAccess, AxiosResponse<PreferredAccess>>(
      '/me/preferences',
      preferredAccess,
    )
      .then(this.success)
      .catch(this.error);
  };
}

export const authService = new AuthService();
