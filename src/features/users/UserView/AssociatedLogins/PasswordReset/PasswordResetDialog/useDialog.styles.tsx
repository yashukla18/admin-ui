import { COMMON_COLORS } from '@constants/theme';

export const sxStyles = {
  dialogTitle: {
    fontWeight: 700,
    textAlign: 'center',
    fontSize: '28px',
    lineHeight: '32px',
    pt: '45px',
  },
  dialogContent: {
    textAlign: 'center',
    fontSize: '20px',
    minHeight: '150px',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogText: {
    textAlign: 'center',
    fontSize: '18px',
    maxWidth: '600px',
  },
  linkText: {
    mt: 3,
    textAlign: 'center',
    fontSize: '16px',
    color: COMMON_COLORS.linkColor,
  },
  dialogActions: {
    backgroundColor: '#F7F7F7',
    minHeight: '80px',
  },
  dialogButton: {
    mr: 5,
  },
};
