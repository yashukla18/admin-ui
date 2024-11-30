import { APP_BAR_HEIGHT } from '@youscience/brightpath-header';

export const sxStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#FFF',
  },
  main: {
    backgroundColor: '#FFF',
    height: '100%',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    mt: `${APP_BAR_HEIGHT}px`,
    overflowY: 'scroll',
    width: '100%',
  },
};
