import { styled } from '@mui/material';
import { CoreBox } from '@youscience/core';

export const CardTitle = styled(CoreBox)(({ theme }) => ({
  alignItems: 'center',
  borderBottom: '1px solid #E0E0E0',
  display: 'flex',
  padding: theme.spacing(6),
  justifyContent: 'space-between',
}));
