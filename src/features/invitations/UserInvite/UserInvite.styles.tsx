import { COMMON_COLORS } from '@constants/theme';

export const sxStyles = {
  iconStyles: {
    '& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed': {
      color: COMMON_COLORS.secondaryColor,
    },
  },
  lableStyles: {
    fontWeight: 600,
    fontSize: '22px',
  },
  buttonStyles: {
    width: '100px',
    mt: 5,
    mr: 4,
    '&:disabled': {
      backgroundColor: COMMON_COLORS.secondaryColor,
      color: COMMON_COLORS.backgroundColor,
    },
  },
};
