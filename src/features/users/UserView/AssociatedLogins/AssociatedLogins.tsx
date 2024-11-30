import { useParams } from 'react-router-dom';
import { CoreBox, CoreTypography } from '@youscience/core';
import { DetailsCard } from '@components/ui/DetailsCard';
import { isResetPassword } from '@utils/resetPassword';
import { useState } from 'react';
import { useIsAdmin } from '@hooks/useIsAdmin';
import { isRemoveIdentity } from '@utils/helper';
import { useOrgListStore } from '@stores/orgListStore';
import { IdentityRecord } from '@youscience/user-service-common';
import { sxStyles } from './AssociatedLogins.Styles';
import PasswordReset from './PasswordReset';
import RemoveIdentity from './RemoveIdentity';

export const AssociatedLogins = ({ initialIdentities }: { initialIdentities: IdentityRecord[] }) => {
  const { userId = '' } = useParams();
  const { isRootAdmin, rootTenantId } = useIsAdmin();

  const associatedOrgs = useOrgListStore((state) => state.associatedOrgs)!;
  const [identities, setIdentities] = useState<IdentityRecord[]>(initialIdentities);

  const canRemoveIdentity = isRemoveIdentity(identities, isRootAdmin);
  const removeIdentityAndUpdate = (id: string) => {
    setIdentities((prevIdentities) =>
      prevIdentities.filter((identity) =>
        id.includes('@') && Object.keys(identity).length === 1 ? identity.email !== id : identity.idpId !== id,
      ),
    );
  };

  return (
    <DetailsCard title='Associated logins'>
      <CoreBox sx={sxStyles.coreGridWrapper}>
        <CoreTypography sx={sxStyles.header}>Provider</CoreTypography>
        <CoreTypography sx={sxStyles.header}>Email</CoreTypography>
        <CoreTypography sx={sxStyles.header}>Reset Password</CoreTypography>
      </CoreBox>
      {identities?.map((identity) => (
        <CoreBox key={identity?.idpId ?? identity.email} sx={sxStyles.coreGridWrapper}>
          <CoreTypography>
            {identity?.provider === 'cognito' ? 'YouScience' : identity?.provider ?? '--'}
          </CoreTypography>
          <CoreTypography sx={sxStyles.email}>{identity?.email ?? '--'}</CoreTypography>
          <PasswordReset
            isResetPassword={isResetPassword(initialIdentities, associatedOrgs, isRootAdmin, rootTenantId)}
            identity={identity}
            userId={userId}
          />
          <RemoveIdentity
            isRemoveIdentity={canRemoveIdentity}
            identity={identity}
            userId={userId}
            removeIdentityAndUpdate={removeIdentityAndUpdate}
          />
        </CoreBox>
      ))}
    </DetailsCard>
  );
};
