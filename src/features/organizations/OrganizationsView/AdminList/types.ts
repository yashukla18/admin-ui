import { AccessDocument, UserDocument } from '@youscience/user-service-common';

type Profile = Pick<UserDocument, 'profile'>;

export interface ExpandedAccessDoc extends AccessDocument {
  userDetail?: Profile;
}
