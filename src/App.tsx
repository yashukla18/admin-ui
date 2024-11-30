import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { brightpathTheme } from '@youscience/theme';
import { rootRoutes } from '@routes/root-routes';
import TagManager from 'react-gtm-module';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const tagManagerArgs = {
  gtmId: import.meta.env.VITE_GTM_ID,
};

TagManager.initialize(tagManagerArgs);
// lazy components
const Notification = lazy(() => import('@components/Notification'));

export const router = createBrowserRouter([...rootRoutes]);

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={brightpathTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <Suspense fallback={null}>
        <Notification />
      </Suspense>
    </ThemeProvider>
  </QueryClientProvider>
);
