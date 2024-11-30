/* eslint-disable @typescript-eslint/unbound-method */
import { AxiosResponse } from 'axios';
import { authenticationConfig } from '@services/config';
import { BeginImpersonation, RemoveImpersonating } from '@interfaces/impersonate';
import { Api } from './api.service';

export class IdentityService extends Api {
  constructor() {
    super(authenticationConfig);
  }

  public refreshToken = (): Promise<void> => {
    return this.post<void, AxiosResponse<void>>('/refreshToken').then(this.success).catch(this.error);
  };

  public beginImpersonation = (userId: string): Promise<void | BeginImpersonation> => {
    return this.post<BeginImpersonation, BeginImpersonation, AxiosResponse<BeginImpersonation>>('/refreshToken', {
      impersonating: { userId },
      beginImpersonation: true,
    })
      .then(this.success)
      .catch(this.error);
  };

  public removeImpersonation = (): Promise<void | RemoveImpersonating> => {
    return this.post<RemoveImpersonating, RemoveImpersonating, AxiosResponse<RemoveImpersonating>>('/refreshToken', {
      removeImpersonation: true,
    })
      .then(this.success)
      .catch(this.error);
  };
}

export const identityService = new IdentityService();
