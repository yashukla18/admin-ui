export interface Impersonating {
  userId: string;
}

export interface RemoveImpersonating {
  removeImpersonation: boolean;
}

export interface BeginImpersonation {
  beginImpersonation: boolean;
  impersonating: Impersonating;
}
