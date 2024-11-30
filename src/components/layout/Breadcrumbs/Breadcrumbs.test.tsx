/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { renderWithRouter, screen, waitFor } from '@utils/test-utils';
import { useAuthStore } from '@stores/authStore';
// move when ready
import { authService } from '@services/auth.api.service';
import { TEST_ROOT_ADMIN_USER, adminGetMeMockResponse } from '@test/constants';
import { AdminLayout } from '@layouts';
import { rootRoutes } from '@routes/root-routes';
import { organizationRoutes } from '@routes/organizationRoutes';

export const stubAdminUser = async () => {
  const getMeSpy = vi.spyOn(authService, 'getUser');
  const getMeMock = vitest.fn().mockResolvedValue({ ...adminGetMeMockResponse });
  const getPreferencesSpy = vi.spyOn(authService, 'getUserPreferences');
  const getPreferencesMock = vitest.fn().mockResolvedValue({ currentAccess: '777833' });

  getMeSpy.mockImplementation(getMeMock);
  getPreferencesSpy.mockImplementation(getPreferencesMock);

  beforeAll(() => {
    if (window) {
      delete (window as any).location;
      (window as any).location = {
        assign: vi.fn(),
      };
    }
  });

  await waitFor(() =>
    useAuthStore.setState({
      authSession: {
        isAuthenticated: true,
        currentAccess: TEST_ROOT_ADMIN_USER.currentAccess,
        userData: TEST_ROOT_ADMIN_USER.userData,
        userType: 'Admin',
        isImpersonated: false,
      },
    }),
  );
};

describe('Breadcrumbs', () => {
  afterEach(async () => {
    await waitFor(() =>
      useAuthStore.setState({
        authSession: {
          currentAccess: undefined,
          isAuthenticated: false,
          userData: undefined,
          userType: undefined,
          isImpersonated: undefined,
        },
      }),
    );
  });

  it('should NOT show the breadcrumbs on the /users route', async () => {
    await stubAdminUser();
    vi.mock('useMatches', () => [
      { data: undefined, handle: undefined, id: '0', params: {}, pathname: '/' },
      {
        data: undefined,
        handle: undefined,
        id: '0-1',
        params: {},
        pathname: '/users',
      },
      {
        data: undefined,
        handle: vi.fn(),
        id: '0-1-0',
        params: {},
        pathname: '/users',
      },
    ]);

    vi.mock('useNavigation', () => [{ state: 'idle' }]);
    vi.mock('useNavigate', () => vi.fn());
    vi.mock('useLocation', () => ({ pathname: '/users', key: '123abc', hash: '', search: '', state: {} }));
    vi.mock('useLocation', () => ({ pathname: '/users', key: '123abc', hash: '', search: '', state: {} }));

    renderWithRouter(<AdminLayout />, rootRoutes);

    await waitFor(() => expect(screen.queryByRole('navigation')).not.toBeInTheDocument());
  });

  it('should NOT show the breadcrumbs on the /organizations route', async () => {
    await stubAdminUser();

    vi.mock('useMatches', () => [
      { data: undefined, handle: undefined, id: '0', params: {}, pathname: '/' },
      {
        data: undefined,
        handle: undefined,
        id: '0-1',
        params: {},
        pathname: '/organizations',
      },
      {
        data: undefined,
        handle: vi.fn(),
        id: '0-1-0',
        params: {},
        pathname: '/organizations',
      },
    ]);

    vi.mock('useNavigation', () => [{ state: 'idle' }]);
    vi.mock('useLocation', () => ({ pathname: '/organizations', key: '123abc', hash: '', search: '', state: {} }));

    renderWithRouter(<AdminLayout />, organizationRoutes);

    await waitFor(() => expect(screen.queryByRole('navigation')).not.toBeInTheDocument());
  });
});
