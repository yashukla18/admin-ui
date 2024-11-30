import { Divider, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { CoreBox, CoreTypography } from '@youscience/core';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Clear } from '@mui/icons-material';
import useD2C from '@features/directToConsumers/hooks/useD2C';
import { useD2CPurchaseStore } from '@stores/useD2CPurchaseStore';
import { sxStyles } from './styles';
import { D2C_PURCHASE_STATUS_LABELS, D2C_INVITE_STATUS_LABELS } from './d2cLeftToolbarConstants';

export const LeftToolbarChildren = () => {
  const { applyD2CRequestFilters, resetFilter } = useD2C();
  const { purchaseStatus, redemptionStatus } = useD2CPurchaseStore((state) => state.filters);

  const handleFilter = (event: SelectChangeEvent) => {
    const {
      target: { value, name },
    } = event;

    applyD2CRequestFilters({
      [name]: value,
    });
  };

  return (
    <CoreBox sx={{ display: 'flex' }}>
      <CoreBox sx={sxStyles.boxStyle}>
        <FormControl sx={sxStyles.formControlStyle}>
          <InputLabel variant='standard' id='d2c-purchase-select-label' sx={sxStyles.inputLabelStyle}>
            Purchase Status
          </InputLabel>
          <Select
            IconComponent={KeyboardArrowDownIcon}
            id='d2c-purchase-status-select'
            label='Purchase Status'
            labelId='d2c-purchase-status-label'
            name='purchaseStatus'
            onChange={handleFilter}
            value={purchaseStatus ?? ''}
            variant='standard'
          >
            {D2C_PURCHASE_STATUS_LABELS.map((status) => {
              return (
                <MenuItem key={status.value ?? 'all'} value={status.value ?? 'all'}>
                  <CoreTypography>{status.label}</CoreTypography>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Divider orientation='vertical' sx={sxStyles.dividerStyle} />
        <IconButton sx={sxStyles.iconButtonStyle} onClick={() => resetFilter('purchaseStatus')}>
          <Clear />
        </IconButton>

        <FormControl sx={sxStyles.formControlStyle}>
          <InputLabel variant='standard' id='d2c-purchase-invite-select-label' sx={sxStyles.inputLabelStyle}>
            Invite Status
          </InputLabel>
          <Select
            IconComponent={KeyboardArrowDownIcon}
            id='d2c-redemption-status-select'
            label='Invite Status'
            labelId='d2c-redemption-status-label'
            name='redemptionStatus'
            onChange={handleFilter}
            value={redemptionStatus ?? ''}
            variant='standard'
          >
            {D2C_INVITE_STATUS_LABELS.map((status) => {
              return (
                <MenuItem key={status.value ?? 'all'} value={status.value ?? 'all'}>
                  <CoreTypography>{status.label}</CoreTypography>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Divider orientation='vertical' sx={sxStyles.dividerStyle} />
        <IconButton sx={sxStyles.iconButtonStyle} onClick={() => resetFilter('redemptionStatus')}>
          <Clear />
        </IconButton>
      </CoreBox>
    </CoreBox>
  );
};
