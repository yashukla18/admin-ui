import { FC } from 'react';
import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import { CoreTable } from '@components/ui/Table';
import { CoreBox, CoreButton, CorePaper, CoreTypography } from '@youscience/core';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { Add } from '@mui/icons-material';
// stores/loaders
import { useOrganizationsStore } from '@features/organizations/organizationsStore';
import { organizationsTableLoader as loader } from '@features/organizations/loaders';
import { fetchTenantsQuery } from '@features/organizations/tanstack/queries';
// hooks
import useScrollHandler from '@hooks/useScrollHandler';
import { useIsAdmin } from '@hooks/useIsAdmin';
import { useHandleRowClick } from '@hooks/useHandleRowClick';
import ConditionWrapper from '@components/ui/ConditionWrapper';
// types/constants
import { TenantListResponse } from '@interfaces';
import { MuiSort } from '@interfaces/table';
import { ORGANIZATION_COLUMNS } from './constants';
import { SortOptions } from '../interfaces/orgTable.types';
// components
import { OrganizationsToolbar } from './OrganizationsToolbar/OrganizationsToolbar';
import { sxStyles } from './OrganizationsTable.styles';

export const OrganizationsTable: FC = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const {
    filters: { search, stateFilter, typeFilter },
    pagination: { skip },
    setSort,
    sort,
  } = useOrganizationsStore((state) => state);

  const { sortBy, sortOrder } = sort;
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const { data, fetchNextPage, isFetching, isFetchingNextPage, isLoading, isRefetching } = useInfiniteQuery({
    ...fetchTenantsQuery({
      filters: {
        query: search,
        type: typeFilter,
        state: stateFilter,
      },
      sort: { sortBy, sortOrder },
      skip,
      take: 50,
    }),
    queryKey: ['tenants', { filters: { query: search, type: typeFilter, state: stateFilter }, skip, sort }],
    initialData: initialData as InfiniteData<TenantListResponse, number>,
    initialPageParam: 0,
    getNextPageParam: (lastPage: TenantListResponse, allPages: unknown, lastPageParam: number) => {
      if (lastPage.total === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  const filteredOrgs = data?.pages?.map((page) => page.items).flat();

  const isAdmin = useIsAdmin().isRootAdmin;

  const handlePage = async () => {
    await fetchNextPage();
  };

  const { tableRef } = useScrollHandler(handlePage);
  const handleRowClick = useHandleRowClick();

  const onSort = ({ orderBy, order }: MuiSort) => {
    setSort({ sortOrder: order, sortBy: orderBy as SortOptions });
  };

  const handleAddOrganization = () => {
    navigate('./add-organization');
  };

  const aestheticLoading =
    navigation.state === 'loading' || isFetchingNextPage ? false : (isLoading || isFetching || isRefetching) ?? false;

  return (
    <CoreBox>
      <CoreBox sx={sxStyles.headingWrapper}>
        <CoreTypography sx={{ fontSize: '3.25rem' }} variant='h1'>
          Organizations
        </CoreTypography>
        <ConditionWrapper condition={isAdmin}>
          <CoreButton
            color='secondary'
            onClick={handleAddOrganization}
            startIcon={<Add />}
            sx={{ mt: 3 }}
            variant='outlined'
          >
            Add organization
          </CoreButton>
        </ConditionWrapper>
      </CoreBox>
      <CorePaper sx={sxStyles.tableToolbarContainer}>
        <CoreBox>
          <OrganizationsToolbar />
        </CoreBox>
        <CoreTable
          minHeight=''
          columns={ORGANIZATION_COLUMNS}
          containerRef={tableRef}
          data={aestheticLoading ? [] : filteredOrgs || []}
          disabledColumnsSort={['addresses', 'deepPath']}
          emptyView={
            <CoreBox sx={sxStyles.emptyViewWrapper}>
              <CoreTypography variant='h2'>No Results</CoreTypography>
            </CoreBox>
          }
          isLoading={aestheticLoading || isFetchingNextPage}
          key='id'
          onRowClick={(row, event) => handleRowClick(row.original.tenantId || '', 'organization', event)}
          onSort={(value: MuiSort) => onSort(value)}
          sortOption={{ orderBy: sortBy, order: sortOrder }}
        />
      </CorePaper>
    </CoreBox>
  );
};
