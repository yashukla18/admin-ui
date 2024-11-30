import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CoreBox, CoreButton } from '@youscience/core';
import { Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// Components
import AccessWrapper from '@components/ui/AccessWrapper';
import { DetailsCard } from '@components/ui/DetailsCard';
// styles/constants
import { useAuthStore } from '@stores/authStore';
import ConditionWrapper from '@components/ui/ConditionWrapper';
import { generateEnvUrl } from '@utils/generateEnvUrl';
import { USER_SETTINGS_URLS, allowedGroupManagementRoles } from './constants';
import { sxStyles } from './Settings.styles';

export const Settings = () => {
  const currentAccess = useAuthStore((state) => state.authSession.currentAccess);
  const { userId } = useParams();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseToggle = () => {
    setAnchorEl(null);
  };

  return (
    <DetailsCard title='Additional settings'>
      <CoreBox sx={sxStyles.wrapper}>
        <ConditionWrapper condition={false}>
          <AccessWrapper allowedRoles={allowedGroupManagementRoles}>
            <CoreBox>
              <CoreButton
                component={Link}
                to={generateEnvUrl(`https://login.youscience.com/admin/tenants/${currentAccess?.tenantId ?? ''}`)}
                color='secondary'
              >
                Group Management
              </CoreButton>
            </CoreBox>
          </AccessWrapper>
        </ConditionWrapper>

        <CoreBox sx={sxStyles.box}>
          <CoreButton
            id='user-settings-button'
            aria-controls={anchorEl ? 'settings-menu' : undefined}
            aria-haspopup='true'
            onClick={handleOpenToggle}
            color='secondary'
            endIcon={<ArrowDropDownIcon />}
          >
            Settings
          </CoreButton>
          <Menu
            anchorEl={anchorEl}
            id='settings-menu'
            MenuListProps={{
              'aria-labelledby': 'settings-button',
            }}
            open={Boolean(anchorEl)}
            onClose={handleCloseToggle}
            slotProps={{ paper: { sx: { borderRadius: '6px' } } }}
          >
            {USER_SETTINGS_URLS({ userId }).map(({ allowedRoles, label, url, restrictOrg }) => (
              <MenuItem key={label} component={Link} to={generateEnvUrl(url)} sx={sxStyles.menuItemStyle}>
                <AccessWrapper allowedRoles={allowedRoles} restrictOrg={restrictOrg}>
                  {label}
                </AccessWrapper>
              </MenuItem>
            ))}
          </Menu>
        </CoreBox>
      </CoreBox>
    </DetailsCard>
  );
};
