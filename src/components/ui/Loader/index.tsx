import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { LoadingComponentProps } from './interfaces';

// Custom loader with backdrop
const Loader = ({ loading }: LoadingComponentProps) => {
  return (
    <Backdrop
      sx={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#0C938F',
        zIndex: 1500,
      }}
      open={loading}
    >
      <CircularProgress color='inherit' />
    </Backdrop>
  );
};

export default Loader;
