/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React, { FC, useEffect, useState } from 'react';
import { CircularProgress, Divider, IconButton, SxProps, Theme } from '@mui/material';
import { CoreBox, CoreMenuItem, CoreTextField, CoreTextFieldProps } from '@youscience/core';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
// hooks
import useDebounce from '@hooks/useDebounce';
import useScrollHandler from '@hooks/useScrollHandler';
import useSkipFirstEffect from '@youscience/hooks/useSkipFirstEffect';
import { Option } from '@interfaces';
import { useOrgListStore } from '@stores/orgListStore';
import { Clear } from '@mui/icons-material';
import { useLocation, useParams } from 'react-router-dom';
import { notify } from '@stores/notifyStore';
import { useOrgsAutocomplete } from '@hooks/useOrgsAutocomplete';
import { TenantDocument } from '@youscience/user-service-common';
import getOrgById from './getOrgById';

interface OrgListProps {
  error?: boolean;
  onClearSearchCallback?: () => void;
  orgNameAsParentProp?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  setNewPath?: React.Dispatch<React.SetStateAction<string>>;
  sx?: SxProps<Theme>;
  textFieldProps?: CoreTextFieldProps;
}

export const OrgList: FC<OrgListProps> = ({
  error,
  label = null,
  onClearSearchCallback,
  orgNameAsParentProp,
  placeholder = 'Organization Name, NCES ID, or IPEDS ID',
  setNewPath,
  required = false,
  sx,
  textFieldProps,
}) => {
  const [search, setSearch] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [prevSearch, setPrevSearch] = useState('');
  const [showAsParentSearchText, setShowAsParentSearchText] = useState<string>(orgNameAsParentProp || '');
  const rootOrgKeywords = ['youscience', 'youscience (root)', 'root', 'you'];
  // Hack until we can fix the backend
  const debouncedSearch = useDebounce(
    rootOrgKeywords.includes(search.toLowerCase()) ? 'youscience (root)' : search,
    500,
  );
  const params = useParams();
  const location = useLocation();
  const isOrgEditPage: boolean = location?.pathname?.includes('organizations/edit');
  const isBulkInvitePage: boolean = location?.pathname?.includes('organizations/bulk-invite');
  const { handlePage, onSearch } = useOrgsAutocomplete();
  const { tableRef, handleScroll } = useScrollHandler(handlePage);

  const { orgList, setTenantId, loading, setLoading, setOrgList } = useOrgListStore((state) => state);

  const [bulkInviteOrgDetails, setBulkInviteOrgDetails] = useState({
    value: '',
    label: '',
  });

  const isDisabled: boolean = (params?.id && isBulkInvitePage) || false;
  const filterOptions = createFilterOptions({
    stringify: ({ value, label, distinctId }: Option): string => `${value} ${label} ${distinctId}`,
  });

  const options = orgList.map((org) => ({
    value: org.tenantId,
    label: org.name,
    distinctId:
      (org.classification?.type === 'district' && org.classification?.nces?.ncesId) ||
      (org.classification?.type === 'publicMiddleSchool' && org.classification?.nces?.ncesId) ||
      (org.classification?.type === 'privateMiddleSchool' && org.classification?.nces?.ncesId) ||
      (org.classification?.type === 'publicHighSchool' && org.classification?.nces?.ncesId) ||
      (org.classification?.type === 'privateHighSchool' && org.classification?.nces?.ncesId) ||
      (org.classification?.type === 'collegeCommunityTrade' && org.classification?.ipeds?.ipedsId) ||
      (org.classification?.type === 'technicalCollege' && org.classification?.ipeds?.ipedsId) ||
      (org.classification?.type === 'government' && org.classification?.nces?.ncesId) ||
      '',
  }));

  const onAutocompleteChange = (event: React.SyntheticEvent, option: Option | null) => {
    if (option === null || option.value === '') {
      setTenantId('');
      setNewPath?.('');
      setShowAsParentSearchText('');
    }
    if (option) {
      if (params?.id && !isOrgEditPage) setBulkInviteOrgDetails({ value: option.value, label: option.label });
      else {
        setSearch(option.label);
        setTenantId(option.value);
        setNewPath?.(option.value);
        setShowAsParentSearchText(option.label);
      }
    }
  };

  const handleSearch = (event: React.SyntheticEvent, value: string, reason: string) => {
    // for edit org operations
    if (reason === 'input' || reason === 'clear') {
      setNewPath?.(value);
      setShowAsParentSearchText(value);
    }
    // global search of org
    if (reason === 'input' || reason === 'clear' || !value) {
      setSearch(value);
    }
    // for bulk-upload operations
    if (reason === 'input' && params?.id) {
      setBulkInviteOrgDetails({ value: '', label: value });
    }
  };

  const onClearSearch = () => {
    setSearch('');
    setTenantId('');
    setNewPath?.('');
    onClearSearchCallback?.();
  };

  const searchOrgForBulkInvite = (orgId: string) => {
    setLoading(true);
    getOrgById(orgId)
      .then((data) => {
        setBulkInviteOrgDetails({
          label: String(data?.name ?? '').valueOf(),
          value: String(data?.tenantId ?? '').valueOf(),
        });
        if (data?.tenantId) {
          setTenantId(data.tenantId);
          setOrgList({
            items: [data] as TenantDocument[],
            total: 1,
          });
        }
      })
      .catch(() => {
        notify({ message: 'There was an error loading tenant', severity: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (params?.id && !isOrgEditPage) {
      searchOrgForBulkInvite(params.id);
    }
    return () => {
      setTenantId('');
    };
  }, [params?.id]);

  useSkipFirstEffect(() => {
    if (debouncedSearch !== prevSearch || isDirty === false) {
      onSearch?.(debouncedSearch);
      setIsDirty(true);
    }
    setPrevSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <CoreBox sx={{ display: 'flex', alignItems: 'end', width: 'inherit' }}>
      <Autocomplete
        disabled={isDisabled}
        getOptionLabel={(option) => option.label}
        // eslint-disable-next-line no-nested-ternary
        inputValue={isDisabled ? bulkInviteOrgDetails.label : orgNameAsParentProp ? showAsParentSearchText : search}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        ListboxProps={{ ref: tableRef, onScroll: handleScroll }}
        loading={loading}
        filterOptions={filterOptions}
        onChange={onAutocompleteChange}
        onInputChange={handleSearch}
        options={options}
        sx={sx}
        renderOption={(props, option) => (
          <CoreMenuItem {...props} key={`${option.value}-${option.label}`} value={option.value}>
            {option.label}
          </CoreMenuItem>
        )}
        renderInput={(params) => (
          <CoreTextField
            error={error}
            {...params}
            label={label}
            placeholder={placeholder}
            required={required}
            variant={textFieldProps?.variant ?? 'outlined'}
            InputLabelProps={{ sx: required ? { span: { color: 'red' } } : undefined }}
            InputProps={{
              ...params.InputProps,
              sx: { borderRadius: '4px' },
              endAdornment: (
                <>
                  {loading ? <CircularProgress color='inherit' size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      {onClearSearchCallback ? (
        <>
          <Divider orientation='vertical' sx={{ ml: 2, height: '50%', mb: 1 }} />

          <IconButton sx={{ p: 1, mr: 4 }} onClick={onClearSearch}>
            <Clear />
          </IconButton>
        </>
      ) : null}
    </CoreBox>
  );
};
