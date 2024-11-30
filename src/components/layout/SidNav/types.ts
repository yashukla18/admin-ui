export interface SideNavProps {
  roleSpecificRoutes?: RoleSpecificNav[];
}

export interface INavConfig {
  disabled?: boolean;
  icon: React.ReactElement;
  key: string;
  orgAccess?: string[];
  path: string;
  title: string;
  translateKey: string;
}

export interface RoleSpecificNav extends Omit<INavConfig, 'allowedRoles'> {
  allowedRoles: string[];
  restrictOrg?: boolean;
}
