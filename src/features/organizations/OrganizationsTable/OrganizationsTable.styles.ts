import { Theme } from '@mui/material/styles';

export const sxStyles = {
  headingWrapper: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 4,
    marginTop: 7,
  },
  emptyViewWrapper: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    minHeight: 500,
  },
  tableToolbarContainer: {
    borderRadius: '0.5rem',
    boxShadow: (theme: Theme) => `0px 0px 12px ${theme.palette.divider}`,
    height: 'calc(100vh - 300px)',
    overflowY: 'hidden',
  },
};