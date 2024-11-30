import { useAuthStore } from '@stores/authStore';
import { useOrgListStore } from '@stores/orgListStore';
import { render, renderHook, screen, userEvent, waitFor } from '@utils/test-utils';
import * as UserServiceModule from '@features/users/services/UserService';
import * as reactRouterModule from 'react-router-dom';
import * as TenantsServiceModule from '@features/organizations/services/organizations-service';

import { activateRootAdmin } from '@test/utils/activateUserByRoles';
import * as AccessInvitationModule from '@hooks/useAccessInvitation';
import { useNotifyStore } from '@stores/notifyStore';
import { AxiosResponse } from 'axios';
import { TenantListResponse } from '@interfaces';
import * as UseDeleteOrgDialogModule from '../../../../hooks/useCustomDialog/CustomDialog';
import {
  mockPropsWithAccess,
  mockPropsWithoutAccess,
  mockPropsWithStaffAccess,
  mockPropsWithoutEmailAddress,
  mockOrgList,
  mockOrg,
  mockOrgListWithRootTenant,
  mockPropsWithTenantAccess,
  associatedOrgData,
} from './testData';
import { AssociatedOrgs } from './AssociatedOrgs';

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

vi.spyOn(UseDeleteOrgDialogModule, 'useCustomDialog');
vi.spyOn(UserServiceModule, 'apiDeleteUserFromTenant');

describe('AssociatedOrgs Component Tests', () => {
  beforeEach(async () => {
    useAuthStore.setState({
      authSession: {
        isAuthenticated: false,
        currentAccess: undefined,
        userData: undefined,
        userType: undefined,
      },
    });

    useOrgListStore.setState({
      tenantId: '',
      orgList: [],
    });

    useNotifyStore.setState({ notifications: [], notificationInfo: undefined, clearNotifications: vi.fn() });
    useNotifyStore.getState().clearNotifications();

    vi.clearAllMocks();
  });

  const setupOrgList = async (mockOrgList: TenantListResponse) => {
    await waitFor(() =>
      useOrgListStore.setState({
        tenantId: 'gyu3467',
        orgList: mockOrgList.items,
      }),
    );
  };

  vi.spyOn(TenantsServiceModule, 'fetchTenants');

  it('should display the "Associated organizations" card when there are accesses', () => {
    render(<AssociatedOrgs {...mockPropsWithAccess} />);
    expect(screen.getByText('Associated organizations')).toBeTruthy();
  });

  it('should display the "No associated organizations" card when there are no accesses', () => {
    render(<AssociatedOrgs {...mockPropsWithoutAccess} />);
    expect(screen.getByText('No associated organizations')).toBeTruthy();
  });

  it('should display delete org confirmation dialog for Root Admin', async () => {
    const deleteAssociatedOrgSpy = vi.spyOn(UserServiceModule, 'apiDeleteUserFromTenant');

    vi.spyOn(reactRouterModule, 'useParams').mockReturnValue({ userId: '123' });

    await activateRootAdmin();
    render(<AssociatedOrgs {...mockPropsWithAccess} />);

    await userEvent.click(screen.getByTestId('REMOVE-ORG-ICON-BUTTON'));
    expect(screen.queryByText(/are you sure you want to remove the organization/i)).toBeInTheDocument();

    await userEvent.click(screen.getByText(/cancel/i));
    expect(screen.queryByText(/are you sure you want to remove the organization/i)).not.toBeInTheDocument();
    expect(deleteAssociatedOrgSpy).not.toHaveBeenCalled();
  });

  it('should NOT display delete org icon if the tenant id is the Root tenant', async () => {
    const deleteAssociatedOrgSpy = vi.spyOn(UserServiceModule, 'apiDeleteUserFromTenant');

    vi.spyOn(reactRouterModule, 'useParams').mockReturnValue({ userId: '123' });
    await setupOrgList(mockOrgListWithRootTenant);

    await activateRootAdmin();
    render(<AssociatedOrgs {...mockPropsWithTenantAccess} />);

    expect(screen.queryByTestId('REMOVE-ORG-ICON-BUTTON')).not.toBeInTheDocument();
    expect(deleteAssociatedOrgSpy).not.toHaveBeenCalled();
  });

  // TODO: uncomment these tests when new endpoint is available
  // it('should display delete org confirmation dialog for Org Admin', async () => {
  //   const deleteAssociatedOrgSpy = vi.spyOn(UserServiceModule, 'apiDeleteUserFromTenant');
  //   vi.spyOn(reactRouterModule, 'useParams').mockReturnValue({ userId: '123' });

  //   await activateOrgAdmin();
  //   render(<AssociatedOrgs {...mockPropsWithAccess} />);

  //   await userEvent.click(screen.getByTestId('REMOVE-ORG-ICON-BUTTON'));
  //   expect(screen.queryByText(/are you sure you want to remove the organization/i)).toBeInTheDocument();

  //   await userEvent.click(screen.getByText(/cancel/i));
  //   expect(screen.queryByText(/are you sure you want to remove the organization/i)).not.toBeInTheDocument();
  //   expect(deleteAssociatedOrgSpy).not.toHaveBeenCalled();
  // });

  // it('should NOT display delete org icon button if the user is staff & viewing a staff access', async () => {
  //   await activateStaffUser();
  //   const deleteAssociatedOrgSpy = vi.spyOn(UserServiceModule, 'apiDeleteUserFromTenant');
  //   vi.spyOn(reactRouterModule, 'useParams').mockReturnValue({ userId: '123' });

  //   render(<AssociatedOrgs {...mockPropsWithStaffAccess} />);

  //   expect(screen.queryByTestId('REMOVE-ORG-ICON-BUTTON')).not.toBeInTheDocument();

  //   expect(deleteAssociatedOrgSpy).not.toHaveBeenCalled();
  // });

  // it('should call delete org request', async () => {
  //   await activateRootAdmin();
  //   const deleteAssociatedOrgSpy = vi.spyOn(UserServiceModule, 'apiDeleteUserFromTenant');

  //   vi.spyOn(reactRouterModule, 'useParams').mockReturnValue({ userId: '123' });

  //   render(<AssociatedOrgs {...mockPropsWithAccess} />);

  //   await userEvent.click(screen.getByTestId('REMOVE-ORG-ICON-BUTTON'));
  //   expect(screen.queryByText(/are you sure you want to remove the organization/i)).toBeInTheDocument();

  //   await userEvent.click(screen.getByText(/yes/i));
  //   expect(deleteAssociatedOrgSpy).toHaveBeenCalledWith('123', '7sd8sadhg');

  //   deleteAssociatedOrgSpy.mockReturnValueOnce(
  //     Promise.resolve({
  //       status: 204,
  //       statusText: 'No Content',
  //       data: {},
  //       headers: {} as any,
  //       config: {} as any,
  //       request: {} as any,
  //     } as AxiosResponse),
  //   );
  // });

  it('should display "Resend invitation" for pending status', async () => {
    render(<AssociatedOrgs {...mockPropsWithStaffAccess} />);
    expect(screen.queryByText('Resend invitation')).toBeTruthy();
  });

  it('should not display "Resend invitation" for active status', async () => {
    render(<AssociatedOrgs {...mockPropsWithAccess} />);
    expect(screen.queryByText('Resend invitation')).toBeNull();
  });

  describe('Add Organization', () => {
    beforeEach(async () => {
      void waitFor(() =>
        vi.spyOn(TenantsServiceModule, 'fetchTenants').mockImplementation(() =>
          Promise.resolve({
            data: { items: [...mockOrgList.items], total: mockOrgList.items.length },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          } as AxiosResponse<TenantListResponse>),
        ),
      );
    });

    it('should display "Add Organization" and "Edit" options when there are accesses', async () => {
      render(<AssociatedOrgs {...mockPropsWithAccess} />);
      await setupOrgList(mockOrgList);

      expect(screen.getByText(/add organization/i)).toBeTruthy();
      expect(screen.getByText('Edit')).toBeTruthy();
    });

    it('should display "Add Organization" option alone when there are no accesses', async () => {
      render(<AssociatedOrgs {...mockPropsWithoutAccess} />);
      await setupOrgList(mockOrgList);

      expect(screen.queryByText(/add organization/i)).toBeTruthy();
      expect(screen.queryByText('Edit')).toBeNull();
    });

    it('should display "Edit" option alone when orgList is empty', () => {
      render(<AssociatedOrgs {...mockPropsWithAccess} />);

      expect(screen.queryByText('Edit')).toBeTruthy();
      expect(screen.queryByText(/add organization/i)).toBeNull();
    });

    it('should not display "Add Organization" and "Edit" options when there are no accesses and orgList is empty', () => {
      render(<AssociatedOrgs {...mockPropsWithoutAccess} />);

      expect(screen.queryByText('Edit')).toBeNull();
      expect(screen.queryByText(/add organization/i)).toBeNull();
    });

    it('should display "Add Organization" and "Edit" options for staff', async () => {
      render(<AssociatedOrgs {...mockPropsWithStaffAccess} />);
      await setupOrgList(mockOrgList);

      expect(screen.queryByText('Edit')).toBeTruthy();
      expect(screen.queryByText(/add organization/i)).toBeTruthy();
    });

    it('should not display "Add Organization" option when user is associated with the org and no other organizations available', async () => {
      await waitFor(() =>
        vi.spyOn(TenantsServiceModule, 'fetchTenants').mockImplementation(() =>
          Promise.resolve({
            data: { items: [...mockOrg.items], total: mockOrg.items.length },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          } as AxiosResponse<TenantListResponse>),
        ),
      );
      render(<AssociatedOrgs {...mockPropsWithAccess} />);
      await setupOrgList(mockOrg);

      expect(screen.queryByText('Edit')).toBeTruthy();
      expect(screen.queryByText(/add organization/i)).toBeNull();
    });

    it('should display "Associated Organization List" if access is passed', async () => {
      render(<AssociatedOrgs {...mockPropsWithAccess} />);
      await waitFor(() => expect(screen.getByTestId('associated-org-access-list-test-id')).toBeTruthy());
    });

    it('should display "Associated Organization Form" if add organization button is clicked', async () => {
      render(<AssociatedOrgs {...mockPropsWithAccess} />);
      await setupOrgList(mockOrgList);

      await userEvent.click(screen.getByText(/add organization/i));

      expect(screen.getByTestId('associated-org-form-test-id')).toBeTruthy();
    });

    it('should not display "Add Organiztion" option if email address is not passed', async () => {
      render(<AssociatedOrgs {...mockPropsWithoutEmailAddress} />);

      await setupOrgList(mockOrgList);

      expect(screen.queryByText(/add organization/i)).toBeNull();
    });

    it('should not display "Associated Organization Form" if cancel button is clicked', async () => {
      render(<AssociatedOrgs {...mockPropsWithAccess} />);
      await setupOrgList(mockOrgList);

      await userEvent.click(screen.getByText(/add organization/i));

      expect(screen.getByTestId('associated-org-form-test-id')).toBeTruthy();

      const cancelButton = screen.getByText(/cancel/i);

      await userEvent.click(cancelButton);

      expect(screen.queryByTestId('associated-org-form-test-id')).toBeNull();
    });

    it('should display "Associated Organization Form" with correct fields and default values', async () => {
      render(<AssociatedOrgs {...mockPropsWithoutAccess} />);
      await setupOrgList(mockOrgList);

      await userEvent.click(screen.getByText(/add organization/i));

      await waitFor(() => {
        expect(screen.findByText('Name')).toBeTruthy();
      });
      expect(screen.getByText('StudentId')).toBeTruthy();
      expect(screen.getByText('Role')).toBeTruthy();
      expect(screen.getByText('Status')).toBeTruthy();
      expect(screen.getByText('Email invitation')).toBeTruthy();
      expect(screen.getByTestId('CheckBoxIcon')).toBeTruthy();
      expect(screen.getByDisplayValue('Learner')).toBeTruthy();
    });

    it('should be disabled when no there is no orgListStore tenantId selected', async () => {
      render(<AssociatedOrgs {...mockPropsWithAccess} />);
      await waitFor(() =>
        useOrgListStore.setState({
          tenantId: '',
          orgList: [...mockOrgList.items],
        }),
      );

      await userEvent.click(screen.getByText(/add organization/i));

      expect(screen.getByTestId('associated-org-form-test-id')).toBeTruthy();

      expect(screen.getByText('Save')).toBeDisabled();
    });

    it('should throw an error when organization is not selected', async () => {
      render(<AssociatedOrgs {...mockPropsWithAccess} />);
      await setupOrgList(mockOrgList);

      await userEvent.click(screen.getByText(/add organization/i));

      expect(screen.getByTestId('associated-org-form-test-id')).toBeTruthy();

      const { result } = renderHook(() => AccessInvitationModule.useAccessInvitation());

      await waitFor(() =>
        result.current.sendAccessInvitation(associatedOrgData[0], false, false, mockPropsWithAccess.access),
      );

      await waitFor(() =>
        expect(useNotifyStore.getState().notifications[0]?.message).toEqual('Please select the organization'),
      );
    });

    it('should throw an error when adding a root organization to user', async () => {
      vi.spyOn(UserServiceModule, 'apiSendAccessInvitation');
      render(<AssociatedOrgs {...mockPropsWithAccess} />);
      await setupOrgList(mockOrgList);

      await userEvent.click(screen.getByText(/add organization/i));

      expect(screen.getByTestId('associated-org-form-test-id')).toBeTruthy();

      const { result } = renderHook(() => AccessInvitationModule.useAccessInvitation());

      await waitFor(() =>
        result.current.sendAccessInvitation(associatedOrgData[1], false, false, mockPropsWithAccess.access),
      );

      await waitFor(() =>
        expect(useNotifyStore.getState().notifications[0]?.message).toEqual(
          'Inviting a user to the YS root organization is not allowed',
        ),
      );
    });

    it('should throw an error if neither userId nor emailAddress is provided', async () => {
      vi.spyOn(UserServiceModule, 'apiSendAccessInvitation');

      render(<AssociatedOrgs {...mockPropsWithAccess} />);
      await setupOrgList(mockOrgList);

      await userEvent.click(screen.getByText(/add organization/i));

      expect(screen.getByTestId('associated-org-form-test-id')).toBeTruthy();

      const { result } = renderHook(() => AccessInvitationModule.useAccessInvitation());

      await waitFor(() =>
        result.current.sendAccessInvitation(associatedOrgData[2], false, false, mockPropsWithAccess.access),
      );

      await waitFor(() =>
        expect(useNotifyStore.getState().notifications[0]?.message).toEqual('Email address or User id is required'),
      );
    });

    it('should throw an error if the user is already associated with the selected organization', async () => {
      vi.spyOn(UserServiceModule, 'apiSendAccessInvitation');

      render(<AssociatedOrgs {...mockPropsWithAccess} />);
      await setupOrgList(mockOrgList);

      await userEvent.click(screen.getByText(/add organization/i));

      expect(screen.getByTestId('associated-org-form-test-id')).toBeTruthy();

      const { result } = renderHook(() => AccessInvitationModule.useAccessInvitation());

      await waitFor(() =>
        result.current.sendAccessInvitation(associatedOrgData[3], false, false, mockPropsWithAccess.access),
      );

      await waitFor(() =>
        expect(useNotifyStore.getState().notifications[0]?.message).toEqual(
          'User is already associated with this organization',
        ),
      );
    });

    it('should throw an error when adding a district type organization to learner/proctor', async () => {
      vi.spyOn(UserServiceModule, 'apiSendAccessInvitation');
      render(<AssociatedOrgs {...mockPropsWithAccess} />);
      await setupOrgList(mockOrgList);

      await userEvent.click(screen.getByText(/add organization/i));

      expect(screen.getByTestId('associated-org-form-test-id')).toBeTruthy();

      const { result } = renderHook(() => AccessInvitationModule.useAccessInvitation());

      await waitFor(() =>
        result.current.sendAccessInvitation(associatedOrgData[4], false, false, mockPropsWithAccess.access),
      );

      await waitFor(() =>
        expect(useNotifyStore.getState().notifications[0]?.message).toEqual(
          'Learner/Proctor can`t be added to a school district. Please add Learner/Proctor to a specific school',
        ),
      );
    });

    it('should throw an error when a rostered org user tried to add a Learner', async () => {
      vi.spyOn(UserServiceModule, 'apiSendAccessInvitation');

      render(<AssociatedOrgs {...mockPropsWithAccess} />);
      await setupOrgList(mockOrgList);

      await userEvent.click(screen.getByText(/add organization/i));

      expect(screen.getByTestId('associated-org-form-test-id')).toBeTruthy();

      const { result } = renderHook(() => AccessInvitationModule.useAccessInvitation());

      await waitFor(() =>
        result.current.sendAccessInvitation(associatedOrgData[5], false, false, mockPropsWithAccess.access),
      );

      await waitFor(() =>
        expect(useNotifyStore.getState().notifications[0]?.message).toEqual(
          'This organization is rostered through GADOE. Please invite new learners via GADOE.',
        ),
      );
    });

    it('should throw a required field error when a user from a UT based organization attempts to add a Learner without providing all required fields', async () => {
      vi.spyOn(UserServiceModule, 'apiSendAccessInvitation');

      render(<AssociatedOrgs {...mockPropsWithAccess} />);
      await setupOrgList(mockOrgList);

      await userEvent.click(screen.getByText(/add organization/i));

      expect(screen.getByTestId('associated-org-form-test-id')).toBeTruthy();

      const { result } = renderHook(() => AccessInvitationModule.useAccessInvitation());

      await waitFor(() =>
        result.current.sendAccessInvitation(associatedOrgData[6], false, false, mockPropsWithAccess.access),
      );

      await waitFor(() =>
        expect(useNotifyStore.getState().notifications[0]?.message).toEqual(
          'Missing required field(s): Name, Date of Birth, Student Id',
        ),
      );
    });
  });
});
