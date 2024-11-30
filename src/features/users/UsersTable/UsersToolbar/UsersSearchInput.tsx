import { useEffect, useState } from 'react';
import { useDebounce } from '@youscience/hooks';
import useSkipFirstEffect from '@youscience/hooks/useSkipFirstEffect';
// components
import { CoreSearchInput } from '@components/ui/CoreSearchInput';
// stores
import { useUsersFiltersStore } from '@stores/useUsersFilters';

export const UsersSearchInput = () => {
  const { onSearch, filters } = useUsersFiltersStore((state) => state);
  const [search, setSearch] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  useSkipFirstEffect(() => {
    if (!debouncedSearch && isDirty === false) return;

    onSearch?.(debouncedSearch);
    setIsDirty(true);
  }, [debouncedSearch]);

  useEffect(() => {
    if (filters?.search) {
      setSearch(() => filters.search);
      setIsDirty(() => false);
    }
  }, []);

  const onChange = (search: string) => {
    setSearch(() => search);
  };

  const onClear = () => {
    setSearch(() => '');
  };

  return (
    <CoreSearchInput
      onChange={onChange}
      onClear={onClear}
      placeholder='Search users...'
      sx={{ width: '50%' }}
      value={search}
    />
  );
};
