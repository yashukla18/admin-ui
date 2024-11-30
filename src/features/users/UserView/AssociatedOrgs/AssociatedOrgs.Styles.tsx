import { COMMON_COLORS } from '@constants/theme';

export const sxStyles = {
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2.5fr 1.5fr 1.5fr 1fr 1.5fr 1fr',
    alignItems: 'center',
    marginBottom: '10px',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  buttonStyles: {
    mr: 4,
    '&:disabled': {
      color: COMMON_COLORS.secondaryColor,
      borderColor: COMMON_COLORS.secondaryColor,
    },
  },
  link: {
    color: COMMON_COLORS.linkColor,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};
