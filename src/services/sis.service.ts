/* eslint-disable @typescript-eslint/unbound-method */
import { AxiosResponse } from 'axios';
import { sisConfig } from '@services/config';
import { ReSyncStatusParams, ReSyncStatusResponse, SyncStatus } from '@interfaces/rostering';
import { Api } from './api.service';

export class SisService extends Api {
  constructor() {
    super(sisConfig);
  }

  public syncStatus = (tenantId: string): Promise<void | SyncStatus> => {
    return this.get<SyncStatus, AxiosResponse<SyncStatus>>(`/sync/status?tenantId=${tenantId}`)
      .then(this.success)
      .catch(this.error);
  };

  public reSyncStatus = (params: ReSyncStatusParams): Promise<void | ReSyncStatusResponse> => {
    return this.post<ReSyncStatusParams, ReSyncStatusParams, AxiosResponse<ReSyncStatusResponse>>('/sync/data', params)
      .then(this.success)
      .catch(this.error);
  };
}

export const sisService = new SisService();
