import { FC, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
// hooks
import { useDebounce } from '@youscience/hooks';
import useSkipFirstEffect from '@youscience/hooks/useSkipFirstEffect';
import { useOrgsAutocomplete } from '@hooks/useOrgsAutocomplete';
import { useOrgListStore } from '@stores/orgListStore';
// components
import { TenantListResponse } from '@interfaces';
import { fetchTenantsQuery } from '@features/organizations/tanstack/queries';
import { useOrganizationsStore } from '@features/organizations/organizationsStore';
import { TenantAutoCompleteProps } from './TenantAutoComplete.types';
import { AutoCompleteOption, CoreAutoComplete } from '../CoreAutoComplete';

export const TenantAutoComplete: FC<TenantAutoCompleteProps> = ({
  onClearSearchCallback,
  placeholder,
  sx,
  textFieldProps,
  ...rest
}) => {
  const { onSearch } = useOrgsAutocomplete();
  const setTenantId = useOrgListStore((state) => state.setTenantId);
  const {
    pagination: { skip },
  } = useOrganizationsStore((state) => state);

  const [search, setSearch] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<AutoCompleteOption[]>([]);
  const debouncedSearch = useDebounce(search, 500);

  const { data, fetchNextPage, isFetching, isFetchingNextPage, isLoading, isRefetching } = useInfiniteQuery({
    ...fetchTenantsQuery({
      filters: {
        query: debouncedSearch,
      },
      skip,
      take: 50,
    }),
    queryKey: ['tenants', { filters: { query: debouncedSearch }, skip }],
    initialPageParam: 0,
    getNextPageParam: (lastPage: TenantListResponse, allPages: unknown, lastPageParam: number) => {
      if (lastPage.total === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  const handlePage = async () => {
    await fetchNextPage();
  };

  const filteredOrgs = data?.pages?.map((page) => page.items).flat() ?? [];

  const options = filteredOrgs?.map((org) => ({
    value: org.tenantId,
    label: org.name,
  }));
  const limitTags = 1;

  const onAutocompleteChange = (
    event: React.SyntheticEvent,
    option: AutoCompleteOption | AutoCompleteOption[] | null,
    reason: string,
  ) => {
    if ((reason === 'clear' || reason === 'removeOption') && onClearSearchCallback) {
      setSearch('');
      setSelectedOrg([]);
      setTenantId('');
      onClearSearchCallback();
      return;
    }

    if (Array.isArray(option)) {
      if (limitTags) {
        const org = option.pop();
        const newOrg = org ? [org] : [];

        setTenantId(org?.value ?? '');
        setSelectedOrg(newOrg);
        return;
      }
      setSelectedOrg(option || []);
      return;
    }

    if (option) {
      setTenantId(option.value);
    }
  };

  useSkipFirstEffect(() => {
    if (!debouncedSearch && isDirty === false) return;
    onSearch?.(debouncedSearch);
    setIsDirty(true);
  }, [debouncedSearch]);

  return (
    <CoreAutoComplete
      displayAsChip
      handleScrollCallback={handlePage}
      label='Select organization'
      loading={isFetching || isFetchingNextPage || isLoading || isRefetching}
      onChange={onAutocompleteChange}
      onInputChange={(event, newValue) => setSearch(newValue)}
      options={options}
      placeholder={placeholder}
      value={selectedOrg}
      {...rest}
    />
  );
};
