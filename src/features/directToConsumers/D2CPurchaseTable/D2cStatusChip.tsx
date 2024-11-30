/* eslint-disable no-nested-ternary */
import { CoreChip } from '@youscience/core';
import { styled } from '@mui/material';
import { D2cRedemptionStatus } from '@youscience/user-service-common';

export const D2cStatusChip = styled(CoreChip, { shouldForwardProp: (prop) => prop !== 'status' })<{
  status: D2cRedemptionStatus;
}>(({ theme, status }) => ({
  backgroundColor: status === 'redeemed' ? '#2F7F330A' : status === 'pending' ? '#0287CF0A' : theme.palette.grey[500],
  borderColor:
    status === 'redeemed' ? theme.palette.success.dark : status === 'pending' ? theme.palette.info.dark : '#2F7F330A',
  color:
    status === 'redeemed' ? theme.palette.success.dark : status === 'pending' ? theme.palette.info.dark : 'default',
}));
