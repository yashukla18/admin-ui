import { styled } from '@mui/material';
import { CoreBox } from '@youscience/core';

export const SignInPageContainer = styled(CoreBox)(() => ({
  backgroundColor: '#FFF',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
}));

export const ContentWrapper = styled(CoreBox)(() => ({
  alignItems: 'center',
  display: 'flex',
  height: '100%',
}));

export const ImageContainer = styled(CoreBox)(({ theme }) => ({
  backgroundColor: '#f3f4f6',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  paddingTop: theme.spacing(8),
  width: '500px',
}));

export const ChildContainer = styled(CoreBox)(() => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
}));
