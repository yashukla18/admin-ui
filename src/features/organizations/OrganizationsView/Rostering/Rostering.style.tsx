import { COMMON_COLORS } from '@constants/theme';

export const sxStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    justifyContent: 'flex-start',
    mb: 3,
  },
  heading: {
    fontWeight: 700,
    lineHeight: '24px',
  },
  body: {
    fontWeight: 400,
    lineHeight: '24px',
  },
  buttonStyles: {
    marginTop: '10px',
    width: '80px',
    '&:disabled': {
      borderColor: COMMON_COLORS.dividerColor,
    },
  },
  rosteringHeading: {
    fontWeight: 600,
    mt: 3,
  },
  syncStatusWrapper: {
    display: 'flex',
    gap: 3,
  },
  syncStatusHeading: {
    fontWeight: 600,
    mt: 3,
  },
  statusChip: {
    textTransform: 'capitalize',
    padding: '4px 8px',
  },
  LastUpdatedLabel: {
    color: COMMON_COLORS.secondaryTextColor,
    fontSize: 'small',
  },
};
