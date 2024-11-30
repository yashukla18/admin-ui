import { LoaderFunctionArgs } from 'react-router-dom';
// import { fetchTenantById } from '../services/organizations-service';
import { tenantService } from '@services/tenant.service';

export async function loader({ params }: LoaderFunctionArgs) {
  const { tenantId = '0' } = params;
  const response = await tenantService.getTenantById(tenantId);

  return { details: response };
}
