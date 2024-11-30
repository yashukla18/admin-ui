import { FC, Suspense } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { CoreBox, CoreChip, CoreTypography } from '@youscience/core';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// Stores
import { useAuthStore } from '@stores/authStore';
import { USA_STATES } from '@constants';
import { useOrganizationsStore } from '@features/organizations/organizationsStore';
import { TenantSearchProps } from '@features/organizations/interfaces';
import { NewToolbar } from '@components/ui/Toolbar/Toolbar';
import { ORG_SELECT_OPTIONS } from '../constants';
import { useFetchOrganizations } from '../../hooks/useFetchOrganizations';
import { SelectIconComponent, sxStyles } from './OrganizationsToolbar.styles';
import { OrgSearchInput } from './OrgSearchInput';

export const OrganizationsToolbar: FC<TenantSearchProps> = () => {
  const user = useAuthStore((state) => state.authSession.currentAccess);
  const { typeFilter, stateFilter } = useOrganizationsStore((state) => state.filters);
  const { applyRequestFilters, resetFilter } = useFetchOrganizations();

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
    <Suspense fallback={null}>
      <NewToolbar>
        <CoreBox sx={{ display: 'flex', width: '100%', columnGap: 4 }}>
          <OrgSearchInput />
          <FormControl sx={{ ...sxStyles.formControlStyle }}>
            <InputLabel
              id='organizations-state-select-label'
              size='small'
              sx={{ ...sxStyles.inputLabelStyle }}
              variant='outlined'
            >
              Select state
            </InputLabel>
            <Select
              IconComponent={
                stateFilter ? SelectIconComponent(() => handleResetFilter('state')) : KeyboardArrowDownIcon
              }
              id='organizations-state-select'
              label='Select state'
              labelId='organizations-state-select-label'
              name='orgStateFilter'
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

          {user?.role === 'Admin' ? (
            <FormControl sx={{ ...sxStyles.formControlStyle }}>
              <InputLabel
                variant='outlined'
                size='small'
                sx={{ ...sxStyles.inputLabelStyle }}
                id='organizations-type-select-label'
              >
                Select type
              </InputLabel>
              <Select
                IconComponent={
                  typeFilter ? SelectIconComponent(() => handleResetFilter('type')) : KeyboardArrowDownIcon
                }
                id='organizations-type-select'
                label='Select type'
                labelId='organizations-type-select-label'
                name='orgTypeFilter'
                onChange={handleFilter}
                size='small'
                sx={{ borderRadius: '4px' }}
                value={typeFilter}
                renderValue={(selected) => (
                  <CoreBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selected ? <CoreChip color='default' key={selected} label={selected} /> : null}
                  </CoreBox>
                )}
              >
                {ORG_SELECT_OPTIONS.map((option) =>
                  !option ? (
                    <MenuItem key='none' value='' sx={{ display: 'none' }} />
                  ) : (
                    <MenuItem key={option.value} value={option.value}>
                      <CoreTypography sx={{ typography: { textTransform: 'capitalize' } }}>
                        {option.label}
                      </CoreTypography>
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
          ) : null}
        </CoreBox>
      </NewToolbar>
    </Suspense>
  );
};
