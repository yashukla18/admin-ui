import { LoaderFunctionArgs, defer } from 'react-router-dom';
import { availableAccessByRole } from '@utils/getAvailableAccessByRole';
import { tenantService } from '@services/tenant.service';
import { NEW_TENANT } from '@utils/formatOrganizationForEdit';
import { getMeCallback, getAuthSession } from '@stores/authStore';
import { fetchTenants } from '../services/organizations-service';

export async function loader({ params }: LoaderFunctionArgs) {
  if (params?.isNew === 'yes') return { details: NEW_TENANT };
  const { id = '0' } = params;
  const authSession = getAuthSession();

  let orgAdmins: unknown;
  let tenantDetailsResponse: unknown;
  let tenantChildrenResponse: unknown;

  if (authSession?.isAuthenticated) {
    orgAdmins = await tenantService.tenantGetUsers({
      tenantId: id,
      roles: availableAccessByRole(true),
    });

    tenantDetailsResponse = await tenantService.getTenantById(id);
    if (id !== import.meta.env.VITE_ROOT_ORG_ID) {
      const { data } = await fetchTenants({ filters: { parentOrgId: id }, skip: 0, take: 10 });

      tenantChildrenResponse = data;
    }
    return defer({
      details: tenantDetailsResponse,
      orgAdmins,
      tenantChildren: tenantChildrenResponse,
    });
  }

  await getMeCallback();
  orgAdmins = await tenantService.tenantGetUsers({
    tenantId: id,
    roles: availableAccessByRole(true),
  });

  tenantDetailsResponse = await tenantService.getTenantById(id);

  if (id !== import.meta.env.VITE_ROOT_ORG_ID) {
    const { data } = await fetchTenants({ filters: { parentOrgId: id }, skip: 0, take: 10 });

    tenantChildrenResponse = data;
  }

  return defer({
    details: tenantDetailsResponse,
    orgAdmins,
    tenantChildren: tenantChildrenResponse,
  });
}
