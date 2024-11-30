import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CoreBox, CoreButton } from '@youscience/core';
import { Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// Components
import { useAuthStore } from '@stores/authStore';
import { DetailsCard } from '@components/ui/DetailsCard';
// styles/constants
import ConditionWrapper from '@components/ui/ConditionWrapper';
import { useHasTenantAccess } from '@hooks/useHasTenantAccess';
import { RestrictAccessWrapper } from '@components/ui/RestrictAccessWrapper/RestrictAccessWrapper';
import { generateEnvUrl } from '@utils/generateEnvUrl';
import { ORG_SETTINGS_URLS } from './constants';
import { sxStyles } from './AdminTools.styles';

export const AdminTools = () => {
  const authSession = useAuthStore((state) => state.authSession);
  const userId = authSession?.userData?.userId;
  const currentTenantId = authSession.currentAccess?.tenantId;
  const { id: tenantId } = useParams();
  const { hasDirectTenantAccess } = useHasTenantAccess();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseToggle = () => {
    setAnchorEl(null);
  };

  return (
    <DetailsCard title='Organization Admin Tools'>
      <CoreBox sx={sxStyles.wrapper}>
        <ConditionWrapper condition={hasDirectTenantAccess}>
          <CoreBox>
            <CoreButton
              component={Link}
              to={generateEnvUrl(`https://apps.youscience.com/organizations`)}
              color='secondary'
            >
              Group Management
            </CoreButton>
          </CoreBox>
        </ConditionWrapper>

        <CoreBox sx={sxStyles.box}>
          <CoreButton
            id='org-settings-button'
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
            onClose={handleCloseToggle}
            open={Boolean(anchorEl)}
            PopoverClasses={{ paper: '6px' }}
            slotProps={{ paper: { sx: { borderRadius: '6px' } } }}
          >
            {ORG_SETTINGS_URLS({ userId, tenantId }).map(
              ({ allowedRoles, label, url, rootAdminOnly, directTenantAccess }) => (
                <MenuItem component={Link} key={label} sx={sxStyles.menuItemStyle} to={generateEnvUrl(url)}>
                  <ConditionWrapper
                    condition={
                      label === 'Discovery'
                        ? currentTenantId === import.meta.env.VITE_ROOT_ORG_ID
                        : label !== 'Discovery'
                    }
                  >
                    <RestrictAccessWrapper
                      allowedRoles={allowedRoles}
                      directTenantAccess={directTenantAccess}
                      rootAdminOnly={rootAdminOnly}
                    >
                      {label}
                    </RestrictAccessWrapper>
                  </ConditionWrapper>
                </MenuItem>
              ),
            )}
          </Menu>
        </CoreBox>
      </CoreBox>
    </DetailsCard>
  );
};
