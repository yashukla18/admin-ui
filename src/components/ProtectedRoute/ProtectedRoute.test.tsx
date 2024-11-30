import { useAuthStore } from '@stores/authStore';
import {
  TEST_ADMIN_USER,
  TEST_LEARNER_USER,
  TEST_ROOT_ADMIN_USER,
  adminGetMeMockResponse,
  learnerGetmeMockResponse,
  staffGetmeMockResponse,
} from '@test/constants';
import { renderWithRouter, waitFor, screen } from '@utils/test-utils';
import { ADMIN_LAYOUT_TESTID, PROFILE_LAYOUT_TESTID } from '@layouts/layout.testIds';
import { authService } from '@services/auth.api.service';
import { AccessDocument } from '@youscience/user-service-common';
import { rootRoutes } from '@routes/root-routes';
import { ProtectedRoute } from './ProtectedRoute';

describe('ProtectedRoute', () => {
  afterEach(async () => {
    await waitFor(() =>
      useAuthStore.setState({
        authSession: {
          currentAccess: undefined,
          isAuthenticated: false,
          isImpersonated: undefined,
          userData: undefined,
          userType: undefined,
        },
      }),
    );
  });

  it('should return ProfileLayout if user is authenticated & has learner access', async () => {
    const getMeSpy = vi.spyOn(authService, 'getUser');
    const getMeMock = vitest.fn().mockResolvedValue({ ...learnerGetmeMockResponse });
    const getPreferencesSpy = vi.spyOn(authService, 'getUserPreferences');
    const getPreferencesMock = vitest.fn().mockResolvedValue({ currentAccess: '5543321' });

    getMeSpy.mockImplementation(getMeMock);
    getPreferencesSpy.mockImplementation(getPreferencesMock);
    useAuthStore.setState({
      authSession: {
        isAuthenticated: true,
        isImpersonated: false,
        currentAccess: TEST_LEARNER_USER.currentAccess,
        userData: TEST_LEARNER_USER.userData,
        userType: 'Learner',
      },
    });

    renderWithRouter(<ProtectedRoute />, [{ element: <ProtectedRoute />, path: '/' }]);
    await waitFor(() => expect(screen.getByTestId(PROFILE_LAYOUT_TESTID)).toBeTruthy());

    expect(screen.queryByTestId(ADMIN_LAYOUT_TESTID)).toBeNull();
  });

  it('should return AdminLayout if user is authenticated & has Admin access', async () => {
    const getMeSpy = vi.spyOn(authService, 'getUser');
    const getMeMock = vitest.fn().mockResolvedValue({ ...adminGetMeMockResponse });
    const getPreferencesSpy = vi.spyOn(authService, 'getUserPreferences');
    const getPreferencesMock = vitest.fn().mockResolvedValue({ currentAccess: '777833' });

    getMeSpy.mockImplementation(getMeMock);
    getPreferencesSpy.mockImplementation(getPreferencesMock);

    useAuthStore.setState({
      authSession: {
        isAuthenticated: true,
        isImpersonated: false,
        currentAccess: TEST_ROOT_ADMIN_USER.currentAccess,
        userData: TEST_ROOT_ADMIN_USER.userData,
        userType: 'Admin',
      },
    });

    renderWithRouter(<ProtectedRoute />, rootRoutes);

    await waitFor(() => expect(screen.getByTestId(ADMIN_LAYOUT_TESTID)).toBeTruthy());
    expect(screen.queryByTestId(PROFILE_LAYOUT_TESTID)).toBeNull();
  });

  it('should return AdminLayout if user is authenticated & has Staff access', async () => {
    const getMeSpy = vi.spyOn(authService, 'getUser');
    const getMeMock = vitest.fn().mockResolvedValue({ ...staffGetmeMockResponse });
    const getPreferencesSpy = vi.spyOn(authService, 'getUserPreferences');
    const getPreferencesMock = vitest.fn().mockResolvedValue({ currentAccess: '64d93ec' });

    getMeSpy.mockImplementation(getMeMock);
    getPreferencesSpy.mockImplementation(getPreferencesMock);

    useAuthStore.setState({
      authSession: {
        isAuthenticated: true,
        isImpersonated: false,
        currentAccess: { ...TEST_ADMIN_USER.currentAccess, role: 'Staff', accessDocumentId: '232' },
        userData: {
          ...TEST_ADMIN_USER.userData,
          access: [
            {
              _id: '232' as unknown,
              user: { userId: '1', fullName: 'Auto Test', grants: ['*'] },
              tenant: {
                tenantId: '01860f43-7b3b-7fa6-91e4-4',
                name: 'Test Admin',
                permission: { role: 'Staff' },
              },
            },
          ] as AccessDocument[],
        },
        userType: 'Staff',
      },
    });

    renderWithRouter(<ProtectedRoute />, rootRoutes);

    await waitFor(() => expect(screen.getByTestId(ADMIN_LAYOUT_TESTID)).toBeTruthy());
    expect(screen.queryByTestId(PROFILE_LAYOUT_TESTID)).toBeNull();
  });
});
