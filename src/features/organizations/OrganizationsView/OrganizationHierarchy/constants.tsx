import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { CoreTypography } from '@youscience/core';
import { TenantDocument } from '@youscience/user-service-common';

export const ORGANIZATION_HIERARCHY_COLUMNS: GridColDef<TenantDocument>[] = [
  {
    field: 'name',
    flex: 1,
    headerName: '',
    renderCell: (params: GridRenderCellParams<TenantDocument>) => (
      <CoreTypography sx={{ px: 6 }}>{params?.row?.name ?? ''}</CoreTypography>
    ),
  },
];
