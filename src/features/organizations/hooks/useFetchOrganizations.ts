import { TenantDocument } from '@youscience/user-service-common';
import { useNotifyStore } from '@stores/notifyStore';
import { shallow } from 'zustand/shallow';
import { useRef } from 'react';
import { TenantListResponse } from '@interfaces';
import { useOrganizationsStore } from '../organizationsStore';
import { fetchTenants } from '../services/organizations-service';
import { ApplyRequestOrgFilters, OrganizationsListRequest, Sort } from '../interfaces';

export const useFetchOrganizations = () => {
  const setOrganizations = useOrganizationsStore((state) => state.setOrganizations);
  const setPagination = useOrganizationsStore((state) => state.setPagination);
  const notify = useNotifyStore((state) => state.notify);
  const setFilters = useOrganizationsStore((state) => state.setFilters);
  const setSort = useOrganizationsStore((state) => state.setSort);
  const setLoading = useOrganizationsStore((state) => state.setLoading);
  const { sortBy, sortOrder } = useOrganizationsStore((state) => state.sort);
  const { page, total, skip, take } = useOrganizationsStore((state) => state.pagination, shallow);
  const { search, stateFilter, typeFilter } = useOrganizationsStore((state) => state.filters);
  const resetOrganizationsStore = useOrganizationsStore((state) => state.resetOrganizationsStore);

  const newSkipRef = useRef<number>(0);

  // Request
  const getOrganizations = async (params: OrganizationsListRequest) => {
    const { sort, page, ...rest } = params;

    let formattedSortBy = params.sort?.sortBy;
    let formattedSortOrder = params.sort?.sortOrder;

    if (params.sort?.sortBy === 'addresses') {
      formattedSortBy = 'addresses.state';
    }
    if (params.sort?.sortBy === 'classification') {
      formattedSortBy = 'classification.type';
    }

    if (!params.sort?.sortOrder) {
      formattedSortOrder = 'asc';
    }

    try {
      setLoading(true);
      const { data } = await fetchTenants({
        ...rest,
        sort: { sortBy: formattedSortBy ?? 'name', sortOrder: formattedSortOrder ?? 'asc' },
      });
      //! Filter out all of the youscience root admins
      const sanitizedData = data.items.filter(
        (item: TenantDocument) => item.tenantId !== import.meta.env.VITE_PARENT_TENANT_ID,
      );

      setOrganizations({ ...data, items: sanitizedData });
      setPagination({ total: data.total, skip, page: params.page ?? page ?? 0, take });
      setFilters({
        typeFilter: params.filters?.type ?? '',
        stateFilter: params.filters?.state ?? '',
        search: params.filters?.query ?? '',
      });
      setSort({ sortBy: params.sort?.sortBy ?? 'name', sortOrder: params.sort?.sortOrder ?? 'asc' });
    } catch (error) {
      notify({ message: 'There was an error loading tenants', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to reset store and fetch organizations
  const resetAndFetch = (params: OrganizationsListRequest) => {
    resetOrganizationsStore();
    newSkipRef.current = 0;
    void getOrganizations(params);
  };

  // Methods:
  const handlePage = async () => {
    const newSkip = newSkipRef.current + take;

    if (newSkip >= total) return;
    newSkipRef.current = newSkip;
    await getOrganizations({
      page,
      filters: {
        state: stateFilter,
        query: search ?? '',
        type: typeFilter,
      },
      sort: { sortBy, sortOrder },
      skip: newSkip,
      take,
    });
  };

  const applyRequestFilters = (filters: ApplyRequestOrgFilters) => {
    const { orgStateFilter = '', orgTypeFilter = '', orgQuery = '' } = filters;

    resetAndFetch({
      filters: {
        query: orgQuery || search,
        state: orgStateFilter || stateFilter,
        type: orgTypeFilter || typeFilter,
      },
      sort: { sortBy, sortOrder },
      skip,
    });
  };

  const handleSort = (params: Sort) => {
    resetAndFetch({
      filters: {
        query: search,
        type: typeFilter,
        state: stateFilter,
      },
      sort: { sortBy: params.sortBy, sortOrder: params.sortOrder },
      skip,
      take,
    });
  };

  const onSearch = (query?: string) => {
    resetAndFetch({
      page: 1,
      skip: 0,
      filters: {
        query,
        type: typeFilter ?? '',
        state: stateFilter ?? '',
      },
    });
  };

  const setExistingOrganizations = (data: TenantListResponse) => {
    const sanitizedData = data.items.filter(
      (item: TenantDocument) => item.tenantId !== import.meta.env.VITE_PARENT_TENANT_ID,
    );

    setOrganizations({ ...data, items: sanitizedData });
    setPagination({ total: data.total, skip, page, take });
  };

  const resetFilter = (filter: string) => {
    resetAndFetch({
      filters: {
        query: search ?? '',
        state: filter === 'state' ? '' : stateFilter,
        type: filter === 'type' ? '' : typeFilter,
      },
      skip,
      sort: { sortBy, sortOrder },
    });
  };

  return {
    applyRequestFilters,
    handlePage,
    handleSort,
    onSearch,
    setExistingOrganizations,
    resetFilter,
  };
};
