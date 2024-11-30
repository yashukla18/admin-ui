import { COMMON_COLORS } from '@constants/theme';

export const sxStyles = {
  coreGridWrapper: {
    display: 'grid',
    gridTemplateColumns: '2fr 5fr 4fr 1.3fr',
    alignItems: 'center',
    mb: 5,
  },
  header: {
    fontWeight: 'bold',
    mb: 1,
  },
  email: {
    color: COMMON_COLORS.linkColor,
  },
  emptyReset: {
    mx: 9,
  },
};
