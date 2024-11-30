import { CoreTypography } from '@youscience/core';
import { UserList } from '@youscience/user-service-common';
import { CellProps, Column } from 'react-table';
import StatusChip from '@components/ui/StatusChip';

export const USERS_TABLE_SIZE = 50;

export const USERS_COLUMNS: Column<UserList>[] = [
  {
    Header: 'Name',
    Cell: ({ row }: CellProps<UserList>) => {
      return <CoreTypography>{row.original.fullName}</CoreTypography>;
    },
  },
  {
    id: 'email',
    Header: 'Email',
    Cell: ({ row }: CellProps<UserList>) => {
      // const email = (row.original.profile?.emails.find((email) => email.isPrimary) || {}).address; // primary email
      const email = row.original?.profile?.emails[0]?.address;

      return <CoreTypography>{email ?? '--'}</CoreTypography>;
    },
  },
  {
    Header: 'Organization',
    Cell: ({ row }: CellProps<UserList>) => {
      const access = row.original?.access;

      let tenantName = '';

      if (access && access.length > 0) {
        const uniqueTenants = new Set(access.map((acc) => acc.tenant));

        if (uniqueTenants.size === 1) {
          tenantName = access[0]?.tenant.name || ''; // non conflicting state
        }
      }

      return <CoreTypography>{tenantName || '--'}</CoreTypography>;
    },
  },
  {
    Header: 'State',
    Cell: ({ row }: CellProps<UserList>) => {
      const addresses = row.original.profile?.addresses;

      let state = '';

      if (addresses && addresses.length > 0) {
        const uniqueStates = new Set(addresses.map((address) => address.state));

        if (uniqueStates.size === 1) {
          state = addresses[0]?.state ?? ''; // non conflicting state
        }
      }

      return <CoreTypography>{state || '--'}</CoreTypography>;
    },
  },
  {
    Header: 'Role',
    Cell: ({ row }: CellProps<UserList>) => {
      const access = row.original?.access;

      let role = '';

      if (access && access.length > 0) {
        const uniqueStates = new Set(access.map((acc) => acc.tenant));

        if (uniqueStates.size === 1) {
          role = access[0]?.tenant.permission?.role ?? ''; // non conflicting state
        }
      }

      return <CoreTypography>{role || '--'}</CoreTypography>;
    },
  },
  {
    Header: 'Status',
    Cell: ({ row }: CellProps<UserList>) => {
      const status = row.original?.access?.[0]?.status ?? 'pending';

      return (
        <StatusChip
          variant='outlined'
          status={status}
          label={status || 'Pending'}
          sx={{ textTransform: 'capitalize' }}
        />
      );
    },
  },
];
