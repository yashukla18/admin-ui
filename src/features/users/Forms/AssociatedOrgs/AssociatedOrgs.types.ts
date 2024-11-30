export type updateDataSchema = Record<string, unknown>;

export interface updatePermissionSchema {
  role: string;
  constraintTags?: string[] | undefined;
}

export type StudentIdUpdate = Record<
  string,
  {
    studentId: string;
  }
>;

export type RoleUpdate = Record<
  string,
  {
    role: string;
  }
>;

export interface TenantData {
  id: string;
  data: updateDataSchema;
}

export interface TenantPermission {
  id: string;
  permission: updatePermissionSchema;
}
