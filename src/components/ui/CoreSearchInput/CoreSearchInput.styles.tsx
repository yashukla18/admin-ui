import { styled } from '@mui/material';

import { CoreFormControl } from '@youscience/core';

export const StyledSearch = styled(CoreFormControl)(({ theme }) => ({
  position: 'relative',
  width: 'inherit',

  '& > svg:first-of-type': {
    position: 'absolute',
    left: '0.5rem',
    top: '0.5rem',
    zIndex: 10,
    fill: theme.palette.grey[500],
  },

  '& .MuiInputBase-root': {
    border: `1px solid rgba(0, 0, 0, 0.23)`,
    borderRadius: '4px',
    gap: '16px',
    height: '40px',
  },

  '.MuiInputAdornment-root': {
    marginBottom: '0.2rem',

    '&:hover': {
      cursor: 'pointer',
    },
  },

  '.Mui-focused': {
    border: `1px solid ${theme.palette.primary.main}`,
  },

  '& .MuiTextField-root': {
    width: '100%',
  },

  '& .MuiInputBase-input': {
    paddingLeft: '2.25rem !important',
  },

  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',

    '&:focus': {
      border: 'none',
    },
  },
}));

export const sxStyles = {
  label: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    width: '1px',
  },
};
