export interface SyncStatus {
  status: 'completed' | 'inprogress' | 'failed';
  lastSyncStartedAt?: string;
  message?: string;
  districtId?: string;
  lastSyncEndedAt?: string;
}

export interface ReSyncStatusParams {
  tenantId: string;
  districtId: string;
  provider: string;
  schoolIds: string;
}

export interface ReSyncStatusResponse {
  lastSyncStartedAt: string;
  status: string;
  message: string;
}
