import { render, screen, waitFor } from '@utils/test-utils';
import * as UseHandleRowClickModule from '@hooks/useHandleRowClick';
import * as ReactRouterDomModule from 'react-router-dom';
import OrganizationHierarchy from '.';

describe('OrganizationHierarchy', () => {
  vi.mock('react-router-dom', async () => {
    const reactRouter = await vi.importActual('react-router-dom');

    return {
      ...reactRouter,
      useNavigate: () => vi.fn(),
      useParams: () => vi.fn(),
    };
  });

  beforeEach(() => {
    vi.spyOn(ReactRouterDomModule, 'useParams').mockReturnValue({ id: '018950e3-c5ad-7e3f-8c47-5b9156740643' });
    vi.spyOn(ReactRouterDomModule, 'useLocation').mockReturnValue({
      hash: '',
      key: '5z3h3g',
      pathname: '/organizations/123',
      search: '',
      state: {},
    });
  });

  vi.spyOn(UseHandleRowClickModule, 'useHandleRowClick');

  it('should not render if no tenant children are present', async () => {
    render(<OrganizationHierarchy tenantChildren={{ items: [], total: 0 }} />);

    await waitFor(() => expect(screen.queryByText('Organization Hierarchy')).not.toBeInTheDocument());
  });
});
