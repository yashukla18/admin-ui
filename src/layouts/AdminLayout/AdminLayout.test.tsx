import { renderWithRouter, screen, waitFor } from '@utils/test-utils';
import { useAuthStore } from '@stores/authStore';
import { TEST_ROOT_ADMIN_USER } from '@test/constants';
import { ADMIN_LAYOUT_TESTID } from '@layouts/layout.testIds';
import { AdminLayout } from './AdminLayout';

describe('AdminLayout', () => {
  it('should do something', async () => {
    useAuthStore.setState({
      authSession: {
        currentAccess: TEST_ROOT_ADMIN_USER.currentAccess,
        isAuthenticated: true,
        isImpersonated: false,
        userData: TEST_ROOT_ADMIN_USER.userData,
        userType: 'Admin',
      },
    });

    renderWithRouter(<AdminLayout />);

    await waitFor(() => expect(screen.getByTestId(ADMIN_LAYOUT_TESTID)).toBeTruthy());
  });
});
