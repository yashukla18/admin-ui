/* eslint-disable no-console */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// store
import { CircularProgress } from '@mui/material';
import { useAuthStore } from '@stores/authStore';
// components
import { DetermineLayout } from '@layouts/DetermineLayout/DetermineLayout';
import { UnauthorizedLayout } from '@layouts/UnauthorizedLayout/UnauthorizedLayout';

export const ProtectedRoute = () => {
  const { pathname, search } = useLocation();
  const authSession = useAuthStore((state) => state.authSession);
  const initializedUser = useAuthStore((state) => state.initializedUser);
  const signIn = useAuthStore((state) => state.signIn);
  const getMe = useAuthStore((state) => state.getMe);

  const signInCallback: VoidFunction = () => {
    signIn(pathname, search);
  };

  useEffect(() => {
    void getMe();
  }, []);

  return authSession.isAuthenticated ? (
    <DetermineLayout access={authSession.currentAccess.role || 'Learner'} isImpersonated={authSession.isImpersonated} />
  ) : (
    <UnauthorizedLayout signIn={initializedUser ? signInCallback : undefined}>
      <CircularProgress size={60} />
    </UnauthorizedLayout>
  );
};
