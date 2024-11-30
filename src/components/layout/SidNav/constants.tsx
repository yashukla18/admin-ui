import { CorporateFareOutlined, PersonOutline, ShoppingBagOutlined } from '@mui/icons-material';
import { ORGANIZATION_ROUTES, USERS_ROUTES } from '@routes';
import EmployersSvg from '../../../assets/employers.svg?react';
import { RoleSpecificNav } from './types';

export const NAVIGATION_ITEMS: RoleSpecificNav[] = [
  {
    allowedRoles: ['Admin', 'Staff'],
    icon: <PersonOutline fontSize='large' sx={{ height: '1.5rem', width: '1.5rem' }} />,
    key: 'users',
    path: USERS_ROUTES.USERS,
    title: 'Users',
    translateKey: 'Users',
  },
  {
    allowedRoles: ['Admin', 'Staff'],
    icon: <CorporateFareOutlined fontSize='large' sx={{ height: '1.5rem', width: '1.5rem' }} />,
    key: 'organizations',
    path: ORGANIZATION_ROUTES.ORGANIZATIONS,
    title: 'Organizations',
    translateKey: 'Organizations',
  },
  {
    allowedRoles: ['Admin'],
    icon: <EmployersSvg style={{ height: '1.5rem', width: '1.5rem' }} />,
    key: 'employers',
    path: `https://employers.youscience.com/micro/admin/employers`,
    restrictOrg: true,
    title: 'Employers',
    translateKey: 'Employers',
  },
  {
    allowedRoles: ['Admin'],
    icon: <ShoppingBagOutlined fontSize='large' sx={{ height: '1.5rem', width: '1.5rem' }} />,
    key: 'd2c',
    path: `d2c`,
    restrictOrg: true,
    title: 'DTC Purchases',
    translateKey: 'DTC Purchases',
  },
];

export const ROLE_SPECIFIC_ROUTES: RoleSpecificNav[] = [
  {
    allowedRoles: ['Admin'],
    icon: <EmployersSvg style={{ height: '1.5rem', width: '1.5rem' }} />,
    key: 'employers',
    path: `https://employers.youscience.com/micro/admin/employers`,
    restrictOrg: true,
    title: 'Employers',
    translateKey: 'Employers',
  },
];
