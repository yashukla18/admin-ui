import { RouteObject } from 'react-router-dom';
import { INVITATIONS_ROUTES } from '.';

export const invitationsRoutes: RouteObject[] = [
  {
    path: INVITATIONS_ROUTES.INVITATIONS,
    children: [
      {
        element: <div>INVITATIONS</div>,
        errorElement: <div>Error loading INVITATIONS</div>,
        index: true,
      },
    ],
  },
];
