import { useEffect } from 'react';
import { CoreBox } from '@youscience/core';
import useSkipFirstEffect from '@youscience/hooks/useSkipFirstEffect';
// stores
import { useOrgListStore } from '@stores/orgListStore';
import { useTanstackUsers } from '@features/users/hooks/useTanstackUsers';
// components/styles
import { NewToolbar } from '@components/ui/Toolbar/Toolbar';
import { TenantAutoComplete } from '@components/ui/TenantAutoComplete/TenantAutoComplete';
import { ToolbarFilters } from './ToolbarFilters';
import { UsersSearchInput } from './UsersSearchInput';

export const UsersToolbar = () => {
  const { tenantId, resetOrgListStore } = useOrgListStore((state) => state);
  const { applyRequestFilters, resetFilter } = useTanstackUsers();

  useEffect(() => {
    // reset the org filter if the user leaves the page with a selected orgId
    if (tenantId !== '') {
      resetFilter('org');
      resetOrgListStore();
    }
  }, []);
  const handleResetOrgFilter = () => {
    resetFilter('org');
  };

  useSkipFirstEffect(() => {
    if (tenantId) {
      applyRequestFilters({ userOrgFilter: tenantId });
    }
  }, [tenantId]);

  return (
    <NewToolbar>
      <CoreBox sx={{ display: 'flex', width: '100%', columnGap: 4 }}>
        <UsersSearchInput />
        <TenantAutoComplete sx={{ width: '100%' }} onClearSearchCallback={handleResetOrgFilter} />
      </CoreBox>
      <ToolbarFilters />
    </NewToolbar>
  );
};
