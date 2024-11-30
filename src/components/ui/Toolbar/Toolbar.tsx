import { ReactNode } from 'react';

import { CoreBox, CoreTypography } from '@youscience/core';
import { FiltersAndPaginationWrapper, FiltersContainer, sxStyles } from './Toolbar.styles';

export interface ToolbarProps {
  children?: ReactNode;
  leftChildren?: ReactNode;
  title?: ReactNode;
}

export const Toolbar = ({ leftChildren = null, title, children = null }: ToolbarProps) => (
  <CoreBox sx={sxStyles.container}>
    <CoreTypography variant='h2'>{title}</CoreTypography>
    <FiltersAndPaginationWrapper>
      <FiltersContainer>{leftChildren}</FiltersContainer>
      {children}
    </FiltersAndPaginationWrapper>
  </CoreBox>
);

// Temporary until we can migrate the other Tables with this Toolbar
export const NewToolbar = ({ children = null }: { children: ReactNode }) => (
  <CoreBox sx={sxStyles.container}>{children}</CoreBox>
);
