/* eslint-disable no-console */
import { FileCopyOutlined } from '@mui/icons-material';
import { CoreBox, CoreTypography } from '@youscience/core';
import { Column } from 'react-table';
import { D2cGetPurchasesResponse } from '@youscience/user-service-common';
import { IconButton } from '@mui/material';
import { copyTextToClipboard } from '@utils/copyText';
import { D2C_INVITE_STATUS_LABELS, D2C_PURCHASE_STATUS_LABELS } from './D2CTableToolbar/d2cLeftToolbarConstants';
import { D2cStatusChip } from './D2cStatusChip';

export const D2C_PURCHASE_TABLE_SIZE = 50;

export const D2C_PURCHASE_COLUMNS: Column<D2cGetPurchasesResponse[0]>[] = [
  {
    Header: 'PURCHASER EMAIL',
    Cell: ({ row }) => {
      return <CoreTypography>{row.original?.purchaserEmail}</CoreTypography>;
    },
  },
  {
    id: 'redemptionCode',
    Header: 'INVITE CODE',
    Cell: ({ row }) => {
      const redemptionCode = row.original?.redemptionCode;
      const validRedemptionCode = row.original?.redemptionStatus === 'pending';

      return (
        <CoreBox sx={{ display: 'flex', alignItems: 'center' }}>
          <CoreTypography>{redemptionCode || '--'}</CoreTypography>
          {validRedemptionCode ? (
            <IconButton
              onClick={() => {
                void copyTextToClipboard(
                  `${import.meta.env.VITE_D2C_REDEEM_URL}/${redemptionCode}`,
                  row.original?.redemptionStatus !== 'redeemed',
                  'Invitation Code Copied',
                  'Failed to copy invitation code',
                );
              }}
            >
              <FileCopyOutlined sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
            </IconButton>
          ) : null}
        </CoreBox>
      );
    },
  },
  {
    id: 'purchaseStatus',
    Header: 'PURCHASE STATUS',
    Cell: ({ row }) => {
      const status = row.original?.purchaseStatus;
      const option = D2C_PURCHASE_STATUS_LABELS.find((item) => item.value === status);

      return <CoreTypography>{option?.label ?? '--'}</CoreTypography>;
    },
  },
  {
    id: 'recipientEmail',
    Header: 'RECIPIENT EMAIL',
    Cell: ({ row }) => {
      const recipientEmail = row.original?.recipientEmail;

      return <CoreTypography>{recipientEmail ?? '--'}</CoreTypography>;
    },
  },
  {
    id: 'inviteStatus',
    Header: 'INVITE STATUS',

    Cell: ({ row }) => {
      const option = D2C_INVITE_STATUS_LABELS.find((item) => item.value === row.original?.redemptionStatus);

      return <D2cStatusChip variant='outlined' status={option?.value ?? 'na'} label={option?.label ?? 'N/A'} />;
    },
  },
];
