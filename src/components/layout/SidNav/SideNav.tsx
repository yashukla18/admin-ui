import { FC, Fragment } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CoreBox } from '@youscience/core';
import { Drawer, List, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import AccessWrapper from '@components/ui/AccessWrapper';
import { APP_BAR_HEIGHT, generateEnvUrl } from '@youscience/brightpath-header';
import { NAVIGATION_ITEMS } from './constants';
import { SideNavProps } from './types';
import { StyledListItemButton, sxStyles } from './SideNav.styles';

export const SideNav: FC<SideNavProps> = () => {
  const location = useLocation();

  return (
    <Drawer variant='permanent' sx={sxStyles.drawer}>
      <Toolbar sx={{ height: APP_BAR_HEIGHT }} />
      <CoreBox sx={{ overflow: 'auto' }}>
        <List>
          {NAVIGATION_ITEMS.map((item) => (
            <Fragment key={item.key}>
              <AccessWrapper allowedRoles={item?.allowedRoles ?? ['Admin']} restrictOrg={item.restrictOrg}>
                <StyledListItemButton
                  component={Link}
                  item={item}
                  key={item.key}
                  location={location}
                  to={item.path.includes('http') ? generateEnvUrl(item.path) : item.path}
                >
                  <ListItemIcon sx={sxStyles.navListItemIcon}>{item.icon}</ListItemIcon>
                  <ListItemText>{item.title}</ListItemText>
                </StyledListItemButton>
              </AccessWrapper>
            </Fragment>
          ))}
        </List>
      </CoreBox>
    </Drawer>
  );
};
