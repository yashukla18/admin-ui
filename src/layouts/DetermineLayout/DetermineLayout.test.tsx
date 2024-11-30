import { screen, renderWithRouteProvider, waitFor, userEvent } from '@utils/test-utils';
import { useAuthStore } from '@stores/authStore';
import { TEST_ADMIN_USER, TEST_LEARNER_USER, TEST_PROCTOR_USER, TEST_ROOT_ADMIN_USER } from '@test/constants';
import { usersRoutes } from '@routes/usersRoutes';
import { ADMIN_LAYOUT_TESTID, PROFILE_LAYOUT_TESTID } from '@layouts/layout.testIds';
import { DetermineLayout } from './DetermineLayout';

describe.skip('DetermineLayout', () => {
  beforeEach(async () => {
    await waitFor(() => {
      useAuthStore.setState({
        authSession: {
          currentAccess: undefined,
          isAuthenticated: false,
          isImpersonated: undefined,
          userData: undefined,
          userType: undefined,
        },
      });
    });

    vi.clearAllMocks();
  });

  describe.skip('AdminLayout', () => {
    it('should redirect an Admin role to admin layout', async () => {
      useAuthStore.setState({
        authSession: {
          currentAccess: TEST_ROOT_ADMIN_USER.currentAccess,
          isAuthenticated: true,
          isImpersonated: false,
          userData: TEST_ROOT_ADMIN_USER.userData,
          userType: 'Admin',
        },
      });

      const { container } = renderWithRouteProvider(
        <DetermineLayout access='Admin' isImpersonated={false} />,
        usersRoutes,
      );

      await waitFor(() => expect(screen.getByTestId(ADMIN_LAYOUT_TESTID)).toBeTruthy());

      expect(container.querySelector('h1')).includes(/users/i);
    });

    it('should redirect a Staff role to admin layout', async () => {
      useAuthStore.setState({
        authSession: {
          currentAccess: TEST_ROOT_ADMIN_USER.currentAccess,
          isAuthenticated: true,
          isImpersonated: false,
          userData: TEST_ROOT_ADMIN_USER.userData,
          userType: 'Staff',
        },
      });

      const { container, getByTestId } = renderWithRouteProvider(
        <DetermineLayout access='Staff' isImpersonated={false} />,
        usersRoutes,
      );

      await waitFor(() => expect(getByTestId(ADMIN_LAYOUT_TESTID)).toBeTruthy());

      expect(container.querySelector('h1')).includes(/users/i);
    });

    it('should redirect a YS Admin to admin layout during impersonation', async () => {
      useAuthStore.setState({
        authSession: {
          currentAccess: TEST_ADMIN_USER.currentAccess,
          impersonatedBy: TEST_ADMIN_USER.impersonatedByRootAdmin,
          isAuthenticated: true,
          isImpersonated: true,
          userData: TEST_ADMIN_USER.userData,
          userType: 'Admin',
        },
      });

      const { container, getByTestId } = renderWithRouteProvider(
        <DetermineLayout access='Admin' isImpersonated />,
        usersRoutes,
      );

      await waitFor(() => expect(getByTestId(ADMIN_LAYOUT_TESTID)).toBeTruthy());

      expect(container.querySelector('h1')).includes(/users/i);
    });
  });

  // TODO: figure out what needs to be mocked to prevent tests from failing
  describe.skip('ProfileLayout', () => {
    it('should redirect a Learner to profile layout', async () => {
      useAuthStore.setState({
        authSession: {
          currentAccess: TEST_LEARNER_USER.currentAccess,
          isAuthenticated: true,
          isImpersonated: false,
          userData: TEST_LEARNER_USER.userData,
          userType: 'Learner',
        },
      });

      renderWithRouteProvider(<DetermineLayout access='Learner' isImpersonated={false} />, usersRoutes);

      await waitFor(() => expect(screen.getByTestId(PROFILE_LAYOUT_TESTID)).toBeTruthy());

      await userEvent.click(screen.getAllByRole('button')[1]);

      expect(screen.getByText(/district learner user/i)).toBeTruthy();
    });

    it('should redirect a Proctor role to profile layout', async () => {
      useAuthStore.setState({
        authSession: {
          currentAccess: TEST_PROCTOR_USER.currentAccess,
          isAuthenticated: true,
          isImpersonated: false,
          userData: TEST_PROCTOR_USER.userData,
          userType: 'Proctor',
        },
      });

      renderWithRouteProvider(<DetermineLayout access='Proctor' isImpersonated={false} />, usersRoutes);

      await waitFor(() => expect(screen.getByTestId(PROFILE_LAYOUT_TESTID)).toBeTruthy());

      await userEvent.click(screen.getAllByRole('button')[1]);
      expect(screen.getByText(/proctor/i)).toBeTruthy();
    });

    it('should redirect Admin to profile layout during impersonation', async () => {
      useAuthStore.setState({
        authSession: {
          currentAccess: TEST_ADMIN_USER.currentAccess,
          impersonatedBy: TEST_ADMIN_USER.impersonatedByAdmin,
          isAuthenticated: true,
          isImpersonated: true,
          userData: TEST_ADMIN_USER.userData,
          userType: 'Admin',
        },
      });

      renderWithRouteProvider(<DetermineLayout access='Admin' isImpersonated />, usersRoutes);

      await waitFor(() => expect(screen.getByTestId(PROFILE_LAYOUT_TESTID)).toBeTruthy());

      await userEvent.click(screen.getAllByRole('button')[1]);
      expect(screen.getByText(/admin/i)).toBeTruthy();
    });
  });
});
