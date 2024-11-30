import { RouteObject } from 'react-router-dom';
import { GROUPS_ROUTES } from '.';

export const groupsRoutes: RouteObject[] = [
  {
    path: GROUPS_ROUTES.GROUPS,
    children: [
      {
        element: <div>GROUPS</div>,
        errorElement: <div>Error loading GROUPS</div>,
        index: true,
      },
    ],
  },
];
