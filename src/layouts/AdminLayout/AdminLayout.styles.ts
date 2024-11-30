import { NAV_DRAWER_WIDTH } from '@layouts/constants';
import { APP_BAR_HEIGHT } from '@youscience/brightpath-header';

export const sxStyles = {
  container: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  loader: {
    alignItems: 'center',
    backgroundColor: 'rgb(255, 255, 255, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    height: `calc(100vh - ${APP_BAR_HEIGHT}px )`,
    justifyContent: 'center',
    width: `calc(100vw - ${NAV_DRAWER_WIDTH}px)`,
  },
  main: {
    backgroundColor: '#FFF',
    height: '100%',
    marginLeft: `${NAV_DRAWER_WIDTH}px`,
    px: 8,
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
