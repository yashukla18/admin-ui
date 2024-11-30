import { Box, styled } from '@mui/material';
import { CoreBox } from '@youscience/core';

export const sxStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    p: 6,
    gap: 6,
  },
};

export const FiltersAndPaginationWrapper = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingTop: theme.spacing(6),
  width: '100%',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
}));

export const FiltersContainer = styled(CoreBox)(() => ({
  alignContent: 'center',
  display: 'flex',
  justifyContent: 'space-between',
}));
