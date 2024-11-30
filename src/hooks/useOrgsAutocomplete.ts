/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { TenantDocument } from '@youscience/user-service-common';
import { useNotifyStore } from '@stores/notifyStore';
import { useEffect, useRef } from 'react';
import { fetchTenants } from '@features/organizations/services/organizations-service';
import { OrgListRequest } from '@interfaces';
import { useOrgListStore } from '@stores/orgListStore';
import { shallow } from 'zustand/shallow';

export const useOrgsAutocomplete = () => {
  const {
    filters: { type, state, query },
    resetOrgListStore,
    setFilters,
    setLoading,
    setOrgList,
    setPagination,
    setSort,
    sort: { sortBy, sortOrder },
  } = useOrgListStore((state) => state);

  const { page, total, skip, take } = useOrgListStore((state) => state.pagination, shallow);
  const notify = useNotifyStore((state) => state.notify);
  const newSkipRef = useRef<number>(0);

  useEffect(() => {
    setLoading(true);
    const abortController = new AbortController();
    const { signal } = abortController;

    fetchTenants({
      filters: { state, type, query },
      signal,
      skip,
      sort: { sortBy: sortBy ?? 'name', sortOrder: sortOrder ?? 'asc' },
      take,
    })
      .then(({ data }) => {
        //! Filter out all of the youscience root admins
        const sanitizedData = data.items.filter(
          (item: TenantDocument) => item.tenantId !== import.meta.env.VITE_PARENT_TENANT_ID,
        );

        setOrgList({ total: data.total, items: sanitizedData });
      })
      .catch((error) => {
        if (error.code !== 'ERR_CANCELED') {
          notify({ message: 'There was an error loading tenants', severity: 'error' });
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, [page, skip, sortBy, sortOrder, query, state, type]);

  const resetAndFetch = (params: OrgListRequest) => {
    resetOrgListStore();
    newSkipRef.current = 0;
    setPagination({ skip: 0, page: 1 });
    setFilters({ query: params.filters?.query, state: params.filters?.state, type: params.filters?.type });
  };

  const handlePage = async () => {
    const newSkip = newSkipRef.current + take;

    if (newSkip >= total) return;
    newSkipRef.current = newSkip;
    setPagination({ skip: newSkip, page, take });
    setSort({ sortBy, sortOrder });
    setFilters({ query, state, type });
  };

  const onSearch = (query?: string) => {
    resetAndFetch({
      page: 1,
      skip: 0,
      filters: {
        query,
        type: type ?? '',
        state: state ?? '',
      },
    });
  };

  return {
    handlePage,
    onSearch,
  };
};
