/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/export */
import { cleanup, render } from '@testing-library/react';
import { afterEach } from 'vitest';
import { Suspense, lazy, isValidElement, PropsWithChildren } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouteObject, RouterProvider, createMemoryRouter, BrowserRouter, createBrowserRouter } from 'react-router-dom';
import { brightpathTheme } from '@youscience/theme';
import { rootRoutes } from '@routes/root-routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from '../App';

const Notification = lazy(() => import('@components/Notification'));

afterEach(() => {
  cleanup();
  window.history.replaceState({}, '', decodeURIComponent('/'));
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function customRender(ui: React.ReactElement, options = {}) {
  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
    ...options,
  });
}
const wrapper = ({ children }: PropsWithChildren<any>) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider theme={brightpathTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
        {children}
        <Suspense fallback={null}>
          <Notification />
        </Suspense>
      </ThemeProvider>
    </Suspense>
  );
};

const renderWithRouteProvider = (
  children: React.ReactElement<unknown, string | React.JSXElementConstructor<any>>,
  routes: RouteObject[] = [],
) => {
  // const options = isValidElement(children) ? { element: children, path: '/users' } : children;

  Object.defineProperty(window, 'location', {
    value: new URL('http://dev.youscience.com:3000/'),
    configurable: true,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  window.location.replace = vi.fn();

  const router = createBrowserRouter([...rootRoutes, ...routes]);

  return render(<RouterProvider router={router} />);
};

const renderWithRouter = (
  children: React.ReactElement<unknown, string | React.JSXElementConstructor<any>>,
  routes: RouteObject[] = [],
) => {
  const options = isValidElement(children) ? { element: children, path: '/' } : children;

  Object.defineProperty(window, 'location', {
    value: new URL('http://dev.youscience.com:3000/'),
    configurable: true,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  window.location.replace = vi.fn();

  const router = createMemoryRouter([{ ...options }, ...routes], {
    initialEntries: [options.path],
    initialIndex: 1,
  });

  return render(<RouterProvider router={router} />);
};

const renderWithSingleRoute = (
  ui: React.ReactElement<unknown, string | React.JSXElementConstructor<any>>,
  route = '/',
) => {
  window.history.pushState({}, 'Test page', route);
  return {
    ...render(ui, { wrapper: BrowserRouter }),
  };
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

afterEach(() => {
  cleanup();
  window.history.replaceState({}, '', decodeURIComponent('/'));
});

export { customRender as render, renderWithRouter, wrapper, renderWithSingleRoute, renderWithRouteProvider };
