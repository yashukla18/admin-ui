import { useAuthStore } from '@stores/authStore';
import { useNotifyStore } from '@stores/notifyStore';
import { render, screen, userEvent, waitFor } from '@utils/test-utils';
import * as UserServiceModule from '@features/users/services/UserService';
import { AxiosResponse } from 'axios';
import * as reactRouterModule from 'react-router-dom';
import * as FeatureFlagStoreModule from '@stores/featureStore';
import { FEATURE_FLAGS, Feature } from '@components/ui/FeatureFlag/constants';
import { TEST_STAFF_USER, TEST_ROOT_ADMIN_USER } from '@test/constants';
import { mockPropsWithIdentities, rosteringIdentities } from './testData';
import { AssociatedLogins } from './AssociatedLogins';
import * as AssociatedLoginDialogModule from '../../../../hooks/useCustomDialog/CustomDialog';

describe('AssociatedLogins Component Tests', () => {
  vi.mock('react-router-dom', async () => {
    const reactRouter = await vi.importActual('react-router-dom');

    return {
      ...reactRouter,
      useNavigate: vi.fn(),
      useLocation: vi.fn(),
      Link: vi.fn(),
      useNavigation: vi.fn(),
    };
  });

  vi.spyOn(AssociatedLoginDialogModule, 'useCustomDialog');
  vi.spyOn(UserServiceModule, 'apiFetchPasswordResetLink');
  vi.spyOn(UserServiceModule, 'apiRemoveUserIdentity');

  beforeEach(async () => {
    useAuthStore.setState({
      authSession: {
        isAuthenticated: true,
        currentAccess: TEST_ROOT_ADMIN_USER.currentAccess,
        userData: TEST_ROOT_ADMIN_USER.userData,
        userType: 'Admin',
        isImpersonated: false,
      },
    });

    useNotifyStore.setState({ notifications: [], notificationInfo: undefined, clearNotifications: vi.fn() });
    useNotifyStore.getState().clearNotifications();

    vi.clearAllMocks();
  });

  it('should display the "Associated logins" card when there are identities', () => {
    render(<AssociatedLogins {...mockPropsWithIdentities} />);
    expect(screen.getByText('Associated logins')).toBeTruthy();
  });

  it('should display "Associated logins" card with correct fields', async () => {
    render(<AssociatedLogins {...mockPropsWithIdentities} />);

    expect(screen.getByText('Provider')).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Reset Password')).toBeTruthy();
  });

  describe('resetUserPassword', () => {
    it('should display the "Reset Password" option for the YS provider', async () => {
      render(<AssociatedLogins initialIdentities={[{ idpId: '1', email: 'test@example.com', provider: 'cognito' }]} />);

      await waitFor(() => expect(screen.getByTestId('reset-password-test-id')).toBeTruthy());
    });

    it('should display the "Reset Password" option if no provider is specified', async () => {
      render(<AssociatedLogins initialIdentities={[{ email: 'test@example.com' }]} />);

      await waitFor(() => expect(screen.getByTestId('reset-password-test-id')).toBeTruthy());
    });

    it('should not display the "Reset Password" option for the SSO provider', async () => {
      render(<AssociatedLogins initialIdentities={[{ idpId: '1', email: 'test@example.com', provider: 'Google' }]} />);

      await waitFor(() => expect(screen.queryByTestId('reset-password-test-id')).toBeNull());
    });

    it('should not display the "Reset Password" option for the Rostering provider', async () => {
      render(<AssociatedLogins initialIdentities={rosteringIdentities} />);

      await waitFor(() => expect(screen.queryByTestId('reset-password-test-id')).toBeNull());
    });

    it('should generate a password reset link', async () => {
      vi.spyOn(reactRouterModule, 'useParams').mockReturnValue({ userId: '123' });
      vi.spyOn(UserServiceModule, 'apiFetchPasswordResetLink').mockImplementation(() =>
        Promise.resolve({
          data: { link: 'https://example.resetpasswordlink.com' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as AxiosResponse<{ link: string }, unknown>),
      );
      render(<AssociatedLogins initialIdentities={[{ idpId: '1', email: 'test@example.com', provider: 'cognito' }]} />);

      expect(screen.getByText('Get reset link')).toBeTruthy();

      await userEvent.click(screen.getByText('Get reset link'));

      await waitFor(() => {
        expect(screen.queryByText(/Copy Link/i)).toBeInTheDocument();
      });
    });
  });

  describe('removeUserIdentity', () => {
    it('should not display the "Remove Identity" option for non YS admin user', async () => {
      useAuthStore.setState({
        authSession: {
          isAuthenticated: true,
          isImpersonated: false,
          currentAccess: TEST_STAFF_USER.currentAccess,
          userData: TEST_STAFF_USER.userData,
          userType: 'Staff',
        },
      });
      render(<AssociatedLogins initialIdentities={mockPropsWithIdentities.initialIdentities} />);
      await waitFor(() => expect(screen.queryByTestId('remove-identity-test-id')).toBeNull());
    });

    it('should not display the "Remove Identity" option if there is only one identity', async () => {
      const initialIdentities = [{ idpId: '1', email: 'test@example.com', provider: 'cognito' }];

      render(<AssociatedLogins initialIdentities={initialIdentities} />);
      await waitFor(() => expect(screen.queryByTestId('remove-identity-test-id')).toBeNull());
    });

    it('should not display the "Remove Identity" option for the Rostering provider', async () => {
      const initialIdentities = rosteringIdentities;

      render(<AssociatedLogins initialIdentities={initialIdentities} />);
      await waitFor(() => expect(screen.queryByTestId('remove-identity-test-id')).toBeNull());
    });

    it('should display the "Remove Identity" option if no provider is specified', async () => {
      const initialIdentities = [{ email: 'test@example.com' }, { email: 'test2@example.com' }];

      vi.stubEnv('VITE_NODE_ENV', 'development');
      vi.spyOn(FeatureFlagStoreModule.useFeatureStore, 'getState').mockReturnValue({
        getEnabledFeature: () => ({
          enabled: true,
          featureId: import.meta.env.VITE_FEATURE_REMOVE_IDENTITY_ID,
          name: 'removeIdentity',
          environments: ['development', 'stage', 'sandbox'] as unknown as Feature['environments'],
        }),
        features: [...FEATURE_FLAGS],
      });

      render(<AssociatedLogins initialIdentities={initialIdentities} />);

      await waitFor(() => expect(screen.queryAllByTestId('remove-identity-test-id').length).toBe(2));
    });

    it('should display the "Remove Identity" option if there is a YS or SSO provider', async () => {
      const initialIdentities = [
        { idpId: '1', email: 'test@example.com', provider: 'cognito' },
        { idpId: '2', email: 'test2@example.com', provider: 'Google' },
        { idpId: '3', email: 'test3@example.com', provider: 'Clever' },
      ];

      vi.stubEnv('VITE_NODE_ENV', 'development');
      vi.spyOn(FeatureFlagStoreModule.useFeatureStore, 'getState').mockReturnValue({
        getEnabledFeature: () => ({
          enabled: true,
          featureId: import.meta.env.VITE_FEATURE_REMOVE_IDENTITY_ID,
          name: 'removeIdentity',
          environments: ['development', 'stage', 'sandbox'] as unknown as Feature['environments'],
        }),
        features: [...FEATURE_FLAGS],
      });
      render(<AssociatedLogins initialIdentities={initialIdentities} />);
      await waitFor(() => expect(screen.queryAllByTestId('remove-identity-test-id').length).toBe(2));
    });

    it('should remove the user identity', async () => {
      vi.spyOn(reactRouterModule, 'useParams').mockReturnValue({ userId: '123' });
      vi.spyOn(UserServiceModule, 'apiRemoveUserIdentity').mockImplementation(() =>
        Promise.resolve({
          data: '',
          status: 204,
          statusText: '',
          headers: {},
          config: {},
        } as AxiosResponse),
      );

      const initialIdentities = [
        { idpId: '1', email: 'test@example.com', provider: 'cognito' },
        { idpId: '2', email: 'test2@example.com', provider: 'Clever' },
      ];

      vi.stubEnv('VITE_NODE_ENV', 'development');
      vi.spyOn(FeatureFlagStoreModule.useFeatureStore, 'getState').mockReturnValue({
        getEnabledFeature: () => ({
          enabled: true,
          featureId: import.meta.env.VITE_FEATURE_REMOVE_IDENTITY_ID,
          name: 'removeIdentity',
          environments: ['development', 'stage', 'sandbox'] as unknown as Feature['environments'],
        }),
        features: [...FEATURE_FLAGS],
      });

      render(<AssociatedLogins initialIdentities={initialIdentities} />);

      await userEvent.click(screen.getByTestId('remove-identity-test-id'));
      expect(screen.queryByText(/click confirm to remove the identity below/i)).toBeInTheDocument();

      const confirmButton = screen.getByRole('button', { name: 'Confirm' });

      await userEvent.click(confirmButton);

      await waitFor(() =>
        expect(useNotifyStore.getState().notifications[0]?.message).toEqual('User identity removed successfully'),
      );
    });
  });
});
