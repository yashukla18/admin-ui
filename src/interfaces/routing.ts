import { Params } from 'react-router-dom';

export interface BreadcrumbHandle {
  crumb?: (data: unknown) => JSX.Element;
}

export interface Match {
  id: string;
  pathname: string;
  params: Params<string>;
  data: unknown;
  handle: BreadcrumbHandle;
}
