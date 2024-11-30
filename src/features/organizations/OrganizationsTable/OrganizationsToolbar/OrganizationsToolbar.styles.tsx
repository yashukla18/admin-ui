import { Clear } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export const sxStyles = {
  boxStyle: {
    display: 'flex',
    alignItems: 'end',
  },
  formControlStyle: {
    minWidth: 140,
    width: 'inherit',
  },
  inputLabelStyle: {
    py: 0,
  },
  dividerStyle: {
    mr: 1,
    height: '50%',
    mb: 1,
  },
  iconButtonStyle: {
    p: 1,
    mr: 4,
  },
};

export const SelectIconComponent = (cb?: () => void) => {
  const renderChild = () => (
    <IconButton onClick={() => cb?.()} sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
      <Clear />
    </IconButton>
  );

  return renderChild;
};
