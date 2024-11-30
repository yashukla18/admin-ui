export const sxStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '150px',
    height: '100%',
    alignItems: 'start',
    justifyContent: 'start',
    backgroundColor: '#EDEBF5',
    '@media screen and (max-width: 768px)': {
      padding: '50px',
    },
    '@media screen and (max-width: 480px)': {
      padding: '30px',
    },
  },
  error: {
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '266%',
    textTransform: 'upperCase',
    '@media screen and (max-width: 768px)': {
      fontSize: '14px',
    },
    '@media screen and (max-width: 480px)': {
      fontSize: '12px',
    },
  },
  mainMessage: {
    fontWeight: 700,
    fontSize: '56px',
    lineHeight: '150%',
    my: '16px',
    '@media screen and (max-width: 768px)': {
      fontSize: '40px',
    },
    '@media screen and (max-width: 480px)': {
      fontSize: '30px',
    },
  },
  subMessage: {
    fontWeight: 400,
    fontSize: '16px',
    whiteSpace: 'pre-line',
    marginBottom: '30px',
    '@media screen and (max-width: 768px)': {
      fontSize: '14px',
    },
    '@media screen and (max-width: 480px)': {
      fontSize: '12px',
      marginBottom: '20px',
    },
  },
};
