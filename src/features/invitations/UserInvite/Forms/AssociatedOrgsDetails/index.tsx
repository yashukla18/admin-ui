import { DetailsCard } from '@components/ui/DetailsCard';
import { Skeleton } from '@mui/material';
import { Suspense } from 'react';
import AssociatedOrgsForm from '@components/ui/AssociatedOrgsForm';
import { AssociatedOrgFormProps } from '@interfaces/associatedOrgs';

export const AssociatedOrgs = ({
  methods,
  userName,
  userId,
  emailAddress,
  dateOfBirth,
  displayHeader = true,
}: AssociatedOrgFormProps) => {
  return (
    <DetailsCard containerStyles={{ mt: 2 }} title='Associated organizations'>
      <Suspense fallback={<Skeleton />}>
        <AssociatedOrgsForm
          methods={methods}
          userName={userName}
          userId={userId}
          emailAddress={emailAddress}
          dateOfBirth={dateOfBirth}
          displayHeader={displayHeader}
        />
      </Suspense>
    </DetailsCard>
  );
};
