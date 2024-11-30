import { FC, useEffect, useState } from 'react';
import { GridRowParams } from '@mui/x-data-grid';
import { TenantDocument } from '@youscience/user-service-common';
import { useParams } from 'react-router-dom';
import { DetailsCard } from '@components/ui/DetailsCard';
import { CoreBox, CoreTypography } from '@youscience/core';
import { fetchTenants } from '@features/organizations/services/organizations-service';
import { useHandleRowClick } from '@hooks/useHandleRowClick';
import CoreDataGrid from '@components/ui/CoreDataGrid';
import { notify } from '@stores/notifyStore';
import ParentCrumbs from './ParentCrumbs';
import { ORGANIZATION_HIERARCHY_COLUMNS } from './constants';

export const OrganizationHierarchy: FC<{ tenantChildren?: { items?: TenantDocument[]; total?: number } }> = ({
  tenantChildren,
}) => {
  const { id = '' } = useParams();
  const handleRowClick = useHandleRowClick();

  const [childOrgs, setChildOrgs] = useState<{ items: TenantDocument[]; total: number }>({
    items: [],
    total: 0,
  });
  const [pagination, setPagination] = useState<{ pageSize: number; page: number }>({
    pageSize: 10,
    page: 0,
  });

  useEffect(() => {
    setChildOrgs({
      items: tenantChildren?.items ?? [],
      total: tenantChildren?.total ?? 0,
    });
  }, []);

  const handlePage = async (page: number, pageSize: number, changedPageSize: boolean) => {
    let prevPage = 0;

    setPagination((prevPagination) => {
      prevPage = prevPagination.page;
      if (changedPageSize) prevPage = 0;
      return { page, pageSize };
    });
    const shouldNotFetch = childOrgs.items.length / pageSize > page;

    if (page !== 0 && (prevPage > page || shouldNotFetch)) return;

    try {
      const { data } = await fetchTenants({ filters: { parentOrgId: id }, skip: page * pageSize, take: pageSize });

      setChildOrgs((prevData) => ({
        items: page === 0 || changedPageSize ? data.items : [...prevData.items, ...data.items],
        total: data.total,
      }));
    } catch (error) {
      notify({ message: 'Failed to fetch child organizations', severity: 'error' });
    }
  };

  if (!tenantChildren?.items?.length) {
    return null;
  }

  const handlePaginationModelChange = (params: { page: number; pageSize: number }) => {
    const changedPageSize = Object.keys(params)?.[0] === 'pageSize';

    const { page, pageSize } = params;
    let newPage = page;

    if (pageSize !== pagination.pageSize) {
      newPage = 0;
    }

    void handlePage(newPage, pageSize, changedPageSize);
  };

  const shouldAccommodateForPagination = childOrgs.total >= 10;

  return (
    <DetailsCard cardStyles={{ '.MuiCardContent-root': { padding: 0 } }} title='Organization Hierarchy'>
      <CoreBox sx={{ p: '8px 24px 24px' }}>
        <ParentCrumbs deepPath={tenantChildren?.items?.length ? tenantChildren?.items[0]?.deepPath : undefined} />
        <CoreTypography
          variant='h4'
          sx={{
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '0.25px',
            lineHeight: '24px',
            mt: 4,
          }}
        >
          Child Organizations
        </CoreTypography>
      </CoreBox>

      <CoreDataGrid
        autoHeight={Boolean(childOrgs.total <= 10)}
        columnHeaderHeight={0}
        columns={ORGANIZATION_HIERARCHY_COLUMNS}
        containerHeight={shouldAccommodateForPagination ? 500 : 'auto'}
        getRowId={(row: TenantDocument) => row.tenantId}
        onRowClick={(row: GridRowParams<TenantDocument>, event) =>
          handleRowClick(
            row.row.tenantId,
            'organization',
            event as React.MouseEvent<HTMLTableRowElement, MouseEvent> | undefined,
          )
        }
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[10, 25, 50]}
        paginationModel={shouldAccommodateForPagination ? pagination : undefined}
        rowCount={childOrgs?.total ?? 0}
        rowHeight={44}
        rows={childOrgs.items}
      />
    </DetailsCard>
  );
};
