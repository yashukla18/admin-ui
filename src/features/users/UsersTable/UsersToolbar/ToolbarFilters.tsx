import { CoreBox, CoreChip, CoreTypography } from '@youscience/core';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { USA_STATES } from '@constants';
import RolePicker from '@components/ui/RolePicker';
import { useTanstackUsers } from '@features/users/hooks/useTanstackUsers';
import { useUsersFiltersStore } from '@stores/useUsersFilters';
import { SelectIconComponent, sxStyles } from './styles';
// Lazy components
export const ToolbarFilters = () => {
  const { applyRequestFilters, resetFilter } = useTanstackUsers();
  const { roleFilter, statusFilter, stateFilter } = useUsersFiltersStore((state) => state.filters);

  const STATUS_OPTIONS = [
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
  ];

  const handleFilter = (event: SelectChangeEvent) => {
    const {
      target: { value, name },
    } = event;

    applyRequestFilters({
      [name]: value,
    });
  };

  const handleResetFilter = (filter: string) => {
    resetFilter(filter);
  };

  return (
    <CoreBox sx={{ display: 'flex', width: '100%', justifyContent: 'stretch', alignContent: 'center', columnGap: 4 }}>
      <FormControl sx={{ ...sxStyles.formControlStyle }}>
        <InputLabel id='users-state-select-label' size='small' sx={{ ...sxStyles.inputLabelStyle }} variant='outlined'>
          Select state
        </InputLabel>
        <Select
          IconComponent={stateFilter ? SelectIconComponent(() => handleResetFilter('state')) : KeyboardArrowDownIcon}
          id='users-state-select'
          label='Select role'
          labelId='users-state-select-label'
          name='userStateFilter'
          onChange={handleFilter}
          size='small'
          sx={{ borderRadius: '4px' }}
          renderValue={(selected) => (
            <CoreBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selected ? <CoreChip color='default' key={selected} label={selected} /> : null}
            </CoreBox>
          )}
          value={stateFilter}
        >
          {USA_STATES.map((state) =>
            !state.value ? (
              <MenuItem key='none' value='' sx={{ display: 'none' }} />
            ) : (
              <MenuItem key={state.value} value={state.value}>
                <CoreTypography sx={{ typography: { textTransform: 'capitalize' } }}>{state.value}</CoreTypography>
              </MenuItem>
            ),
          )}
        </Select>
      </FormControl>

      <RolePicker
        formControlSx={{ ...sxStyles.formControlStyle }}
        IconComponent={roleFilter ? SelectIconComponent(() => handleResetFilter('role')) : KeyboardArrowDownIcon}
        id='users-role-select'
        label='Select role'
        name='userRoleFilter'
        onChangeCallback={handleFilter}
        showAsChip
        size='small'
        value={roleFilter}
        variant='outlined'
      />

      <FormControl sx={sxStyles.formControlStyle}>
        <InputLabel id='users-status-select-label' size='small' sx={sxStyles.inputLabelStyle} variant='outlined'>
          Select status
        </InputLabel>
        <Select
          IconComponent={statusFilter ? SelectIconComponent(() => handleResetFilter('status')) : KeyboardArrowDownIcon}
          id='users-status-select'
          label='Select status'
          labelId='users-status-select-label'
          name='userStatusFilter'
          onChange={handleFilter}
          size='small'
          sx={{ borderRadius: '4px' }}
          renderValue={(selected) => (
            <CoreBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selected ? <CoreChip color='default' key={selected} label={selected} /> : null}
            </CoreBox>
          )}
          value={statusFilter}
        >
          {STATUS_OPTIONS.map((status) => (
            <MenuItem key={status.value} value={status.value}>
              <CoreTypography>{status.label}</CoreTypography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </CoreBox>
  );
};
