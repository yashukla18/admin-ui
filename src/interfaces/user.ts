// import { FormAddressSchema } from '@constants';
import { AccessRoleEnum, UserDocument, UserDocumentWithAccess } from '@youscience/user-service-common';

export type PartialUser = Pick<UserDocument, 'userId' | 'fullName'>;

export interface CurrentAccess {
  accessDocumentId: string;
  constraintTags?: string[];
  role: AccessRoleEnum;
  tenantId: string;
  tenantName?: string;
  tenantClassification?: string;
  userId: string;
}

export type UserFormTypes = 'new' | 'edit';

export type UserFormProps<T = UserFormTypes> = T extends 'edit'
  ? {
      type: T;
      onDelete: (user: UserDocument) => void;
      onSubmitCallback: (userId: string, values: Partial<UserDocument>) => void;
    }
  : {
      type: T;
      onDelete?: never;
      onSubmitCallback: (values: Partial<UserDocument>) => void;
    };

export interface UserListResponse {
  items: UserDocumentWithAccess[];
  total: number;
}
