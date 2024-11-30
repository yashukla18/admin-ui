/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { CoreBox, CorePaper, CoreTypography } from '@youscience/core';
import { Suspense, useEffect } from 'react';
import { CoreTable } from '@components/ui/Table';
import { useNavigate, useNavigation } from 'react-router-dom';
import { useD2CPurchaseStore } from '@stores/useD2CPurchaseStore';
import useScrollHandler from '@hooks/useScrollHandler';
import { useIsAdmin } from '@hooks/useIsAdmin';
import { useHandleRowClick } from '@hooks/useHandleRowClick';
import useD2C from '../hooks/useD2C';
import { D2C_PURCHASE_COLUMNS } from './constants';
import D2CTableToolbar from './D2CTableToolbar';

export const D2CPurchaseTable = () => {
  const { isRootAdmin } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRootAdmin) {
      navigate('/users');
    }
  }, [isRootAdmin]);

  const navigation = useNavigation();

  const list = useD2CPurchaseStore((state) => state.d2cList);
  const loading = useD2CPurchaseStore((state) => state.loading);
  const { onSearch, handlePage } = useD2C();
  const handleRowClick = useHandleRowClick();

  const { tableRef } = useScrollHandler(handlePage);

  return (
    <CoreBox>
      <CoreBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CoreTypography sx={{ fontSize: '3rem' }} variant='h1'>
          Direct-to-Consumer Purchases
        </CoreTypography>
      </CoreBox>
      <CorePaper
        sx={{
          borderRadius: '0.5rem',
          boxShadow: (theme) => `0px 0px 12px ${theme.palette.divider}`,
          height: 'calc(100vh - 300px)',
          overflowY: 'hidden',
        }}
      >
        <CoreBox>
          <Suspense fallback={null}>
            <D2CTableToolbar onSearch={onSearch} />
          </Suspense>
        </CoreBox>
        <CoreTable
          columns={D2C_PURCHASE_COLUMNS}
          containerRef={tableRef}
          data={list}
          onRowClick={(row, event) =>
            handleRowClick(
              row.original.userId ?? '',
              row?.original?.redemptionStatus !== 'redeemed' ? 'd2c' : 'user',
              event,
            )
          }
          isLoading={navigation.state === 'loading' || loading}
          emptyView={
            <CoreBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 500 }}>
              <CoreTypography variant='h2'>No Results</CoreTypography>
            </CoreBox>
          }
        />
      </CorePaper>
    </CoreBox>
  );
};
