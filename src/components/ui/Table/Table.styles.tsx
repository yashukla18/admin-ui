import { Paper, styled, TableCell, TableContainer, TablePagination, Theme } from '@mui/material';
import { CSSProperties } from '@mui/material/styles/createTypography';
import { ElementType } from 'react';
import { CoreTextField } from '@youscience/core';
import { ROW_HEIGHT } from './constants';

export const sxStyles = {
  emptyViewCell: (theme: Theme) => ({
    borderBottom: 'none',
    padding: 0,
    backgroundColor: `${theme.palette.common.white} !important`,
  }),
  headCell: (theme: Theme) => ({
    ...(theme.typography as unknown as { subtitle4: CSSProperties }).subtitle4,
    color: theme.palette.text.secondary,
    backgroundColor: `${theme.palette.common.white} !important`,
    borderBottom: '1px solid #E0E0E0',
    maxHeight: `${ROW_HEIGHT}px`,
  }),
  emptyFilledCell: (theme: Theme) => ({
    padding: 0,
    backgroundColor: `${theme.palette.common.white} !important`,
  }),
  loaderCell: {
    padding: 0,
  },
  emptyCellFilled: (theme: Theme) => ({
    padding: '0px',
    backgroundColor: theme.palette.common.white,
    lineHeight: 0,
  }),
  emptyCellView: (theme: Theme) => ({
    borderBottom: 'none',
    padding: 0,
    backgroundColor: `${theme.palette.common.white} !important`,
  }),
  tableRow: { borderBottom: '1px solid #E0E0E0', height: `${ROW_HEIGHT}px` },
};

export const StyledTablePagination = styled(TablePagination, {
  shouldForwardProp: (prop) => prop !== 'isDisabled',
})<{ component: ElementType; isDisabled?: boolean }>(({ theme, isDisabled }) => ({
  pointerEvents: isDisabled ? 'none' : 'auto',

  p: {
    ...(theme.typography as unknown as { body2: CSSProperties }).body2,
  },
}));

export const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  ...(theme.typography as unknown as { subtitle4: CSSProperties }).subtitle4,
  // TODO: see if we want the border bottom when disabled
  borderBottom: '1px solid #E0E0E0',
  color: theme.palette.text.secondary,
  pointerEvents: 'none',
}));

export const StyledCoreTextField = styled(CoreTextField)(({ theme }) => ({
  paddingRight: theme.spacing(3),
  minWidth: 220,
  [theme.breakpoints.down('lg')]: {
    minWidth: 175,
  },
}));

export const SpinnerContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'maxHeight',
})<{ maxHeight?: number | string }>(({ theme, maxHeight = 439 }) => ({
  backgroundColor: '#000',
  bottom: theme.spacing(7),
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
  maxHeight,
  maxWidth: '910px',
  opacity: 0.2,
  overflow: 'hidden',
  position: 'absolute',
  width: '100%',
  zIndex: 1200,
}));

export const StyledTableContainer = styled(TableContainer, { shouldForwardProp: (prop) => prop !== 'hasPagination' })<{
  hasPagination?: boolean;
}>(({ theme, hasPagination }) => {
  const styles = {
    borderRadius: '0.5rem',
    height: '90%',
    [theme.breakpoints.down('xl')]: {
      height: '80%',
    },
    // marginTop: theme.spacing(3),
    width: '100%',
    'tr:nth-of-type(odd)': {
      // backgroundColor: '#F7F7F7',
      '&:hover': {
        backgroundColor: '#0C938F1F',
      },
    },

    '& .MuiTableRow-root:hover': {
      backgroundColor: '#0C938F1F',
      cursor: 'pointer',
    },
  };

  return hasPagination
    ? { ...styles, display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }
    : styles;
});

export const StyledLoader = styled('div', {
  shouldForwardProp: (prop) => prop !== 'minHeight',
})<{ minHeight: number | string }>(({ theme, minHeight }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  backgroundColor: `${theme.palette.common.white} !important`,
  padding: '0px',
  minHeight,
}));
