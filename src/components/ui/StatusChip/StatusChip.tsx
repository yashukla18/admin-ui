import { styled } from '@mui/material';
import { CoreChip } from '@youscience/core';

export const StatusChip = styled(CoreChip, { shouldForwardProp: (prop) => prop !== 'status' })<{
  status: 'active' | 'pending';
}>(({ theme, status }) => ({
  color: status === 'active' ? theme.palette.success.dark : theme.palette.info.dark,
  backgroundColor: status === 'active' ? '#2F7F330A' : '#0287CF0A',
  borderColor: status === 'active' ? theme.palette.success.dark : theme.palette.info.dark,
}));
