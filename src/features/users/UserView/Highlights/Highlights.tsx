import { DetailsCard } from '@components/ui/DetailsCard';
import DetailsSectionWithWrap from '@components/ui/DetailsSectionWithWrap/DetailsSectionWithWrap';
import { CoreBox } from '@youscience/core';
import { UserDocument } from '@youscience/user-service-common';
import { FC } from 'react';

const formatText = (text: string) =>
  text
    .split('_')
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.charAt(0).toLowerCase() + word.slice(1),
    )
    .join(' ');

export const Highlights: FC<{ selectedUser: UserDocument }> = ({ selectedUser }) => {
  const { now, next } = selectedUser.profile?.plan ?? {};

  return (
    <DetailsCard title='Profile highlights'>
      <CoreBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {now ? <DetailsSectionWithWrap details={{ CurrentSituation: formatText(now) }} /> : null}
        {next?.length ? <DetailsSectionWithWrap details={{ FuturePlans: next.map(formatText) }} /> : null}
      </CoreBox>
    </DetailsCard>
  );
};
