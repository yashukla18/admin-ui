import { D2C_ROUTES } from '@routes';
import { RouteObject } from 'react-router-dom';
import ErrorPage from '../error-page';

export const d2cRoutes: RouteObject[] = [
  {
    path: D2C_ROUTES.D2CPurchase_Table,
    errorElement: <ErrorPage />,
    children: [
      {
        async lazy() {
          const { D2CPurchaseTable } = await import('@features/directToConsumers/D2CPurchaseTable/D2CPurchaseTable');

          return { Component: D2CPurchaseTable };
        },
        index: true,
        async loader() {
          const { d2cPurchaseTableLoader } = await import('@features/directToConsumers/loaders');

          return d2cPurchaseTableLoader();
        },
        errorElement: <ErrorPage />,
      },
    ],
  },
];
