import { Theme } from '@mui/material';

const getHeight = (isAccessible: boolean, isSuccess: boolean, step: string) => {
  if (isSuccess) {
    return '220px';
  }

  if (step === 'step1') {
    return '360px';
  }

  if (step === 'step2') {
    return '490px';
  }

  return isAccessible ? '532px' : '472px';
};

export const sxStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  stepper: {
    width: '445px',
    mb: 6,
  },
  paper: (isAccessible: boolean, isSuccess: boolean, step: string) => ({
    borderRadius: '0.5rem',
    boxShadow: (theme: Theme) => `0px 0px 18px ${theme.palette.divider}`,
    height: getHeight(isAccessible, isSuccess, step),
    width: '720px',
    overflowY: 'hidden',
    m: '20px 0px',
  }),
  heading: {
    mt: 10,
    fontWeight: 600,
  },
  body: {
    mt: 4,
    px: 13,
  },
  mainComponent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    marginTop: '40px',
    position: 'relative',
  },
  success: {
    variant: 'h1',
    align: 'center',
    mt: 4,
    px: 13,
  },
};
