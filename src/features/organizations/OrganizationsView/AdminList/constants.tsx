import { CoreTypography } from '@youscience/core';
import { Column } from 'react-table';
import { UserDocumentWithAccess } from '@youscience/user-service-common';
import StatusChip from '@components/ui/StatusChip';
import { COMMON_COLORS } from '@constants/theme';

export const ADMIN_LIST_COLUMNS: Column<UserDocumentWithAccess>[] = [
  {
    Header: 'Name',
    accessor: 'fullName',
    Cell: ({ row }) => (
      <CoreTypography sx={{ color: COMMON_COLORS.linkColor, textDecoration: 'underline' }}>
        {row.original?.fullName ?? '--'}
      </CoreTypography>
    ),
  },
  {
    Header: 'Email',
    accessor: 'profile',
    Cell: ({ row }) => <CoreTypography>{row.original?.profile?.emails[0]?.address ?? '--'}</CoreTypography>,
  },
  {
    Header: 'Role',
    accessor: 'access',
    Cell: ({ row }) => {
      return <CoreTypography>{row.original.access?.[0].tenant.permission?.role ?? '--'}</CoreTypography>;
    },
  },
  {
    Header: 'Status',
    Cell: ({ row }) => {
      const status = row.original?.access?.[0]?.status ?? 'pending';

      return (
        <StatusChip
          label={status || 'Pending'}
          status={status}
          sx={{ textTransform: 'capitalize' }}
          variant='outlined'
        />
      );
    },
  },
];
