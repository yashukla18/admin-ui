import { FC, useRef, useState } from 'react';
import { UserDocumentWithAccess } from '@youscience/user-service-common';
import { useParams } from 'react-router-dom';
import { DetailsCard } from '@components/ui/DetailsCard';
import { CorePaper } from '@youscience/core';
import { CoreTable } from '@components/ui/Table';
import { availableAccessByRole } from '@utils/getAvailableAccessByRole';
import { tenantService } from '@services/tenant.service';
import useScrollHandler from '@hooks/useScrollHandler';
import { useHandleRowClick } from '@hooks/useHandleRowClick';
import { ADMIN_LIST_COLUMNS } from './constants';

export const AdminList: FC<{ orgAdmins: UserDocumentWithAccess[] }> = ({ orgAdmins: initialOrgAdmins }) => {
  const { id = '' } = useParams();
  const newSkipRef = useRef<number>(0);
  const handleRowClick = useHandleRowClick();

  const [orgAdmins, setOrgAdmins] = useState<UserDocumentWithAccess[]>(initialOrgAdmins);

  const handlePage = async () => {
    const take = 50;
    const newSkip = newSkipRef.current + take;

    newSkipRef.current = newSkip;
    const data = (await tenantService.tenantGetUsers({
      tenantId: id,
      roles: availableAccessByRole(true),
      skip: newSkip,
      take,
    })) as UserDocumentWithAccess[];

    setOrgAdmins((prevData) => [...prevData, ...data]);
  };

  const { tableRef } = useScrollHandler(handlePage);

  return (
    <DetailsCard title='Organization Admins'>
      <CorePaper
        sx={{
          boxShadow: 'none',
          height: 400,
          overflowY: 'auto',
        }}
      >
        <CoreTable
          columns={ADMIN_LIST_COLUMNS}
          containerRef={tableRef}
          data={orgAdmins}
          isLoading={!orgAdmins}
          key='_id'
          onRowClick={(row, event) => handleRowClick(row.original.userId || '', 'user', event)}
          minHeight=''
          showHeaderCellDivider={false}
        />
      </CorePaper>
    </DetailsCard>
  );
};
