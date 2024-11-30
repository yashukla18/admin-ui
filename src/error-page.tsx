import { useRouteError } from 'react-router-dom';
import { ErrorType, ErrorPages } from '@components/ui/ErrorPages';
import { useAuthStore } from '@stores/authStore';
import { ALLOWED_ROLES } from '@constants';
import { CoreBox } from '@youscience/core';
import { FC } from 'react';
import { SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

const ErrorPage: FC<{ sx?: SxProps<Theme> }> = ({ sx }) => {
  interface RouteError {
    statusText?: string;
    message?: string;
    request?: {
      status?: number;
    };
  }
  const error = useRouteError() as RouteError;
  const authSession = useAuthStore((state) => state.authSession);
  const { role = '' } = authSession.currentAccess ?? {};

  let errorCode: ErrorType = error?.request?.status as ErrorType;

  if (!errorCode) {
    if (role && !ALLOWED_ROLES.includes(role)) {
      errorCode = 401;
    } else {
      errorCode = 'unknown';
    }
  }

  return (
    <CoreBox sx={{ height: '100%', ...sx }} id='error-page'>
      <ErrorPages errorType={errorCode} homePageLink='/users' />
    </CoreBox>
  );
};

export default ErrorPage;
