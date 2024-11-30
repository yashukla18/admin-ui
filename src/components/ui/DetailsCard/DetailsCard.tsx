import { Card, CardContent, SxProps, Theme } from '@mui/material';

import { CoreBox, CoreTypography } from '@youscience/core';
import { CardTitle } from './DetailsCard.styles';

export interface DetailsCardProps {
  cardStyles?: SxProps<Theme>;
  children?: React.ReactNode;
  containerStyles?: SxProps<Theme>;
  titleAdornment?: React.ReactNode;
  title: string;
}

export const DetailsCard = ({
  containerStyles = { height: '100%', width: '100%' },
  cardStyles,
  children = '',
  titleAdornment,
  title,
}: DetailsCardProps) => {
  return (
    <CoreBox
      sx={{ borderRadius: '0.5rem', boxShadow: (theme) => `0px 0px 12px ${theme.palette.divider}`, ...containerStyles }}
    >
      <Card sx={{ borderRadius: '8px', ...cardStyles }}>
        <CardTitle>
          <CoreTypography variant='h4' sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {title}
          </CoreTypography>
          {titleAdornment}
        </CardTitle>
        <CardContent sx={{ mt: 4, px: 6 }}>{children}</CardContent>
      </Card>
    </CoreBox>
  );
};
