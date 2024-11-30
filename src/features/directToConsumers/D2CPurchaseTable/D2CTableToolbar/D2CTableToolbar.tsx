import { Suspense, lazy, useState } from 'react';
import { CoreBox, CoreSearchInput } from '@youscience/core';
import useSkipFirstEffect from '@youscience/hooks/useSkipFirstEffect';
import { useDebounce } from '@youscience/hooks';
import { D2CSearchProps } from '@features/directToConsumers/interfaces/d2cPurchaseTable.types';
import { LeftToolbarChildren } from './LeftToolbarChildren';
// Lazy components
const Toolbar = lazy(() => import('@components/ui/Toolbar'));

export const D2CTableToolbar = ({ onSearch }: D2CSearchProps) => {
  const [search, setSearch] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  useSkipFirstEffect(() => {
    if (!debouncedSearch && isDirty === false) return;

    onSearch?.(debouncedSearch);
    setIsDirty(true);
  }, [debouncedSearch]);

  const onChange = (search: string) => {
    setSearch(() => search);
  };

  const onClear = () => {
    setSearch(() => '');
  };

  return (
    <Suspense fallback={null}>
      <Toolbar leftChildren={<LeftToolbarChildren />}>
        <CoreBox sx={{ display: 'flex' }}>
          <CoreSearchInput
            onChange={onChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSearch?.(search);
              }
            }}
            onClear={onClear}
            placeholder='Search...'
            value={search}
          />
        </CoreBox>
      </Toolbar>
    </Suspense>
  );
};
