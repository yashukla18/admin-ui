import { CoreSearchInput } from '@components/ui/CoreSearchInput';
import { useFetchOrganizations } from '@features/organizations/hooks/useFetchOrganizations';
import { useOrganizationsStore } from '@features/organizations/organizationsStore';
import { useDebounce } from '@youscience/hooks';
import useSkipFirstEffect from '@youscience/hooks/useSkipFirstEffect';
import { useEffect, useState } from 'react';

export const OrgSearchInput = () => {
  const { onSearch } = useFetchOrganizations();
  const { filters } = useOrganizationsStore((state) => state);
  const [search, setSearch] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  useSkipFirstEffect(() => {
    if (!debouncedSearch && isDirty === false) return;

    onSearch?.(debouncedSearch);
    setIsDirty(true);
  }, [debouncedSearch]);

  useEffect(() => {
    if (filters.search) {
      setSearch(() => filters.search ?? '');
      setIsDirty(() => false);
    }
  }, []);

  const onChange = (search: string) => {
    setSearch(() => search);
  };

  const onClear = () => {
    setSearch(() => '');
  };

  return <CoreSearchInput onChange={onChange} onClear={onClear} placeholder='Search organizations...' value={search} />;
};
