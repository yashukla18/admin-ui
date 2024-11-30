import { NAV_DRAWER_WIDTH } from '@layouts/constants';
import { ListItemButton, styled } from '@mui/material';
import { LinkProps, Location } from 'react-router-dom';
import { INavConfig } from './types';

export const sxStyles = {
  drawer: {
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: { width: NAV_DRAWER_WIDTH, boxSizing: 'border-box' },
    width: NAV_DRAWER_WIDTH,
  },
  navListItemButton: {
    minHeight: 48,
    px: 3,
    '&:hover': { backgroundColor: '#0C938F1F' },
  },
  navListItemIcon: {
    color: 'inherit',
    justifyContent: 'center',
    minWidth: 0,
    mr: 3,
  },
};

export const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{
  component: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;
  item: INavConfig;
  location: Location;
  to: string;
}>(({ item, location }) => ({
  ...sxStyles.navListItemButton,
  backgroundColor: location.pathname?.includes(item.key) ? 'rgb(0,0,0,0.08)' : undefined,
}));
