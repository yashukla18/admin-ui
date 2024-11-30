import { RouteObject } from 'react-router-dom';
import { ErrorPages } from '@components/ui/ErrorPages';
import ErrorPage from '../error-page';

export const impersonationRoutes: RouteObject[] = [
  {
    path: '/impersonating',
    element: <ErrorPages errorType='impersonating' homePageLink='https://brightpath.youscience.com/home' />,
    errorElement: <ErrorPage sx={{ height: '100vh' }} />,
  },
  {
    path: '/no-impersonation-allowed',
    element: <ErrorPages errorType='impersonating' homePageLink='https://brightpath.youscience.com/home' />,
    errorElement: <ErrorPage sx={{ height: '100vh' }} />,
  },
];
