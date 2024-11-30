import { Skeleton, Card, CardContent } from '@mui/material';
import { CoreBox, CoreTypography } from '@youscience/core';
import { FC } from 'react';

export const LoadingCard: FC<{ skeletonCount?: number; title?: string }> = ({ skeletonCount = 1, title = '' }) => {
  return (
    <CoreBox sx={{ borderRadius: '0.5rem', boxShadow: (theme) => `0px 0px 12px ${theme.palette.divider}` }}>
      <Card sx={{ borderRadius: '8px' }}>
        <CoreBox
          sx={{
            alignItems: 'center',
            borderBottom: '1px solid #E0E0E0',
            display: 'flex',
            justifyContent: 'space-between',
            padding: (theme) => theme.spacing(6),
          }}
        >
          {title ? (
            <CoreTypography variant='h4' sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {title}
            </CoreTypography>
          ) : (
            <Skeleton sx={{ height: 44, width: '25%', maxWidth: '300px', minWidth: 200 }} />
          )}
        </CoreBox>
        <CardContent sx={{ px: 6 }}>
          {Array.from(new Array(skeletonCount)).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <CoreBox key={index} sx={{ display: 'grid', gridTemplateColumns: '200px auto', gap: 8 }}>
              <Skeleton sx={{ height: 44 }} />
              <Skeleton sx={{ height: 44, width: '50%' }} />
            </CoreBox>
          ))}
        </CardContent>
      </Card>
    </CoreBox>
  );
};
