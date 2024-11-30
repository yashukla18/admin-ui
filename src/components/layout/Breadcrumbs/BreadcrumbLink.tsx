import { FC, ReactNode } from 'react';
import { CoreLinkButton } from '@youscience/core';

const BreadcrumbLink: FC<{ children: ReactNode; to: string }> = ({ children, to }) => (
  <CoreLinkButton
    sx={{
      '&:hover': { backgroundColor: 'transparent' },
      color: 'text.secondary',
      minWidth: 'fit-content',
      padding: 0,
      typography: 'body1',
    }}
    to={to}
    variant='text'
  >
    {children}
  </CoreLinkButton>
);

export default BreadcrumbLink;
