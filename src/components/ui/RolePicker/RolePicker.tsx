import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CoreBox, CoreChip, CoreTypography } from '@youscience/core';
import { availableAccessByRole } from '@utils/getAvailableAccessByRole';
import { sxStyles } from './RolePicker.styles';
import { RolePickerProps } from './RolePicker.types';

export const RolePicker: React.FC<RolePickerProps> = ({
  formControlSx,
  IconComponent,
  id,
  inputProps = undefined,
  label = '',
  name,
  onChangeCallback,
  showAsChip = false,
  size = 'medium',
  value,
  variant = 'outlined',
}) => {
  const ACCESS_ROLES = availableAccessByRole();

  return (
    <FormControl sx={{ ...sxStyles.formControlStyle, ...formControlSx }}>
      {label && label?.length > 0 ? (
        <InputLabel
          id='core-role-select-label'
          size={size === 'small' ? 'small' : 'normal'}
          sx={sxStyles.inputLabelStyle}
          variant={variant}
        >
          {label ?? ''}
        </InputLabel>
      ) : null}

      <Select
        IconComponent={IconComponent ?? KeyboardArrowDownIcon}
        id={id}
        inputProps={inputProps}
        label={label ?? ''}
        labelId='core-role-select-label'
        name={name ?? 'coreSelectRoleFilter'}
        onChange={onChangeCallback}
        size={size}
        value={value}
        variant={variant}
        renderValue={
          showAsChip
            ? (selected) => (
                <CoreBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selected ? <CoreChip color='default' key={selected} label={selected} /> : null}
                </CoreBox>
              )
            : undefined
        }
      >
        {ACCESS_ROLES.map((role) => (
          <MenuItem key={role ?? 'all'} value={role ?? 'all'}>
            <CoreTypography>{role ?? 'All'}</CoreTypography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
