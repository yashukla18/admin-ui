import { UserDocument, AddressSchema } from '@youscience/user-service-common';

export type FormAddressSchema = Omit<AddressSchema, 'lines'> & {
  lines?: string[];
};

export type UserDetailsFormType = 'new' | 'edit';

export interface DetailsFormProps {
  user: UserDocument;
}

export type UserFormProps<T = UserDetailsFormType> = T extends 'edit'
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
