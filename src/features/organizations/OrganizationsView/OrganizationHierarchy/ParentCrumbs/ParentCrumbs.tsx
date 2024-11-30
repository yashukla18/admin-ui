import { NavigateNext } from '@mui/icons-material';
import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import { COMMON_COLORS } from '@constants/theme';
import BreadcrumbLink from '@components/layout/Breadcrumbs/BreadcrumbLink';
import { FC } from 'react';
import { CoreBox, CoreTypography } from '@youscience/core';
import { useParams } from 'react-router-dom';

interface DeepPathType {
  deepPath?: { name: string; tenantId: string }[];
}

export const ParentCrumbs: FC<DeepPathType> = ({ deepPath }) => {
  const { id = '0' } = useParams();

  const crumbs = deepPath?.map((crumb) => {
    if (crumb?.tenantId !== import.meta.env.VITE_ROOT_ORG_ID) {
      if (crumb.tenantId === id) {
        return (
          <CoreTypography key={crumb.tenantId} color='primary'>
            {crumb.name}
          </CoreTypography>
        );
      }
      return (
        <BreadcrumbLink key={crumb.tenantId} to={`/organizations/${crumb.tenantId}`}>
          {crumb.name}
        </BreadcrumbLink>
      );
    }
    return undefined;
  });

  return (
    <CoreBox>
      <MuiBreadcrumbs
        maxItems={3}
        sx={{
          width: '80%',
          '.MuiBreadcrumbs-separator': { marginLeft: 0, marginRight: 0 },
        }}
        separator={<NavigateNext sx={{ color: COMMON_COLORS.breadCrumbDivider }} />}
      >
        {crumbs}
      </MuiBreadcrumbs>
    </CoreBox>
  );
};
