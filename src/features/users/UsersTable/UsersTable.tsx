import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { CoreBox, CoreButton, CorePaper, CoreTypography } from '@youscience/core';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
// hooks
import useScrollHandler from '@hooks/useScrollHandler';
import { useHandleRowClick } from '@hooks/useHandleRowClick';
import { useIsAdmin } from '@hooks/useIsAdmin';
import { useUsersFiltersStore } from '@stores/useUsersFilters';
import { CoreTable } from '@components/ui/Table';
import FeatureFlag from '@components/ui/FeatureFlag';
// types/constants
import { UserListResponse } from '@interfaces/user';
import { USERS_COLUMNS } from './constants';
import { fetchUsersListQuery } from '../loaders/fetchUsers';
import { usersTableLoader } from '../loaders';
import { fetchUsersQuery } from '../loaders/usersTableLoader';
// components/styles
import { UsersToolbar } from './UsersToolbar/UsersToolbar';
import { sxStyles } from './UsersTable.styles';

export const UsersTable = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { filters } = useUsersFiltersStore((state) => state);
  const { search, roleFilter, organizationFilter, statusFilter, stateFilter } = filters;
  // Stores
  const initialData = useLoaderData() as Awaited<ReturnType<typeof usersTableLoader>>;

  const { data, fetchNextPage, isFetching, isFetchingNextPage, isLoading, isRefetching } = useInfiniteQuery({
    ...fetchUsersQuery(),
    queryKey: [
      'users',
      {
        filters: {
          query: search,
          roles: roleFilter,
          state: stateFilter,
          status: statusFilter,
          tenantId: organizationFilter,
        },
        skip: 0,
        take: 50,
      },
    ],
    queryFn: ({ pageParam }) => {
      return fetchUsersListQuery({
        filters: {
          query: search,
          tenantId: organizationFilter,
          roles: roleFilter,
          status: statusFilter,
          state: stateFilter,
        },
        skip: (pageParam as number) * 50,
        take: 50,
      });
    },
    initialData: initialData as InfiniteData<UserListResponse>,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const total = (lastPage as { total?: number })?.total ?? 0;

      if (total < 50) {
        return undefined;
      }
      return (lastPageParam as number) + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if ((firstPageParam as number) <= 1) {
        return undefined;
      }
      return (firstPageParam as number) - 1;
    },
  });

  const { isRootAdmin, rootTenantId, isOrgAdmin, isStaff } = useIsAdmin();
  const handleRowClick = useHandleRowClick();
  const newHandlePage = async () => {
    await fetchNextPage();
  };

  const { tableRef } = useScrollHandler(newHandlePage);

  const handleUserInvite = () => {
    navigate('/users/user-invite');
  };

  const handleBulkInvite = () => {
    navigate('/users/bulk-invite');
  };

  const filteredUsers = data?.pages
    ?.map((page) => page.items)
    .flat()
    ?.filter((user) => {
      const userAccess = user.access?.[0];

      if (isRootAdmin) {
        return true;
      }

      if (userAccess) {
        const { tenant } = userAccess;
        const role = tenant?.permission?.role;

        if (isOrgAdmin && tenant.tenantId !== rootTenantId) {
          return true;
        }

        if (isStaff && role !== 'Admin' && role !== 'Staff') {
          return true;
        }
      }

      return false;
    });

  const aestheticLoading =
    navigation.state === 'loading' || isFetchingNextPage ? false : (isLoading || isFetching || isRefetching) ?? false;

  return (
    <CoreBox>
      <CoreBox sx={sxStyles.headingWrapper}>
        <CoreTypography sx={{ fontSize: '3.25rem' }} variant='h1'>
          Users
        </CoreTypography>
        <CoreBox sx={sxStyles.addButtonsContainer}>
          <FeatureFlag featureName='addUser' featureId={import.meta.env.VITE_FEATURE_ADD_USER_ID}>
            <CoreButton endIcon={<Add />} color='secondary' variant='outlined' onClick={handleUserInvite}>
              Add User
            </CoreButton>
          </FeatureFlag>
          <CoreButton endIcon={<Add />} color='secondary' onClick={handleBulkInvite}>
            Bulk Invite
          </CoreButton>
        </CoreBox>
      </CoreBox>

      <CorePaper sx={sxStyles.tableToolbarContainer}>
        <CoreBox>
          <UsersToolbar />
        </CoreBox>
        <CoreTable
          columns={USERS_COLUMNS}
          containerRef={tableRef}
          data={aestheticLoading ? [] : filteredUsers || []}
          disabledColumnsSort={['email', 'State']}
          isLoading={aestheticLoading || isFetchingNextPage}
          key='id'
          minHeight=''
          onRowClick={(row, event) => handleRowClick(row.original.userId || '', 'user', event)}
          emptyView={
            <CoreBox sx={sxStyles.emptyViewWrapper}>
              <CoreTypography variant='h2'>No Results</CoreTypography>
            </CoreBox>
          }
        />
      </CorePaper>
    </CoreBox>
  );
};
