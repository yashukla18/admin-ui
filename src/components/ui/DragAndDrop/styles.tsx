import { styled } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { COMMON_COLORS } from '@constants/theme';

export const Wrapper = styled('div')({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '185px',
  justifyContent: 'space-between',
  width: '400px',
});

export const Form = styled('form')(({ theme }) => ({
  backgroundColor: COMMON_COLORS.lightBackgroundColor,
  height: '145px',
  marginBottom: theme.spacing(3),
  maxWidth: '100%',
  position: 'relative',
  textAlign: 'center',
  width: '100%',
}));

export const Input = styled('input')({
  display: 'none',
  pointerEvents: 'none',
});

export const Label = styled('label')(({ theme }) => ({
  alignItems: 'center',
  borderColor: '#A8A9AD',
  borderRadius: 8,
  borderStyle: 'dashed',
  borderWidth: '2px',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'space-evenly',
  padding: theme.spacing(0, 1),

  '&:hover': {
    cursor: 'pointer',
  },
  '&.drag-active': {
    backgroundColor: '#cdcdcd',
  },
}));

export const ThumbnailWrapper = styled('div')({
  height: '60%',
  overflowY: 'auto',
  width: '100%',
});

export const ThumbnailCard = styled('div')(() => ({
  textAlign: 'center',
  width: '100%',
}));

export const CardInfo = styled('div')({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
});

export const CardTitle = styled('div')({
  alignItems: 'center',
  display: 'flex',
});

export const DeleteButton = styled('button')({
  background: 'none',
  color: 'inherit',
  border: 'none',
  padding: '0',
  font: 'inherit',
  cursor: 'pointer',
  outline: 'inherit',
});

export const Thumbnail = styled('img')({
  maxHeight: '149px',
  objectFit: 'cover',
  width: '100%',
});

export const StyledFileUploadIcon = styled(FileUploadOutlinedIcon)({
  height: '30px',
  pointerEvents: 'none',
  width: '30px',
});
