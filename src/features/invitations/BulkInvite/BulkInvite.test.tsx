/* eslint-disable max-len */
import { useAuthStore } from '@stores/authStore';
import { useOrgListStore } from '@stores/orgListStore';
import { useNotifyStore } from '@stores/notifyStore';
import { render, renderWithRouter, screen, userEvent, waitFor } from '@utils/test-utils';
import { ROOT, TEST_ADMIN_USER, TEST_UTAH_BASED_ORG } from '@test/constants';
import * as UserServiceModule from '@features/users/services/UserService';
import * as TenantsServiceModule from '@features/organizations/services/organizations-service';
import { AxiosResponse } from 'axios';
import { TenantListResponse } from '@interfaces';
import { BulkInviteValidationResult, TenantDocument } from '@youscience/user-service-common';
import { MockInstance } from 'vitest';
import * as UseIsAdminModule from '@hooks/useIsAdmin';
import * as useBulkInvitationModule from '../../../hooks/useBulkInvitation/useBulkInvitation';
import { BulkInvite } from './BulkInvite';
import { BulkInviteV2 } from './BulkInviteV2';
import { defaultUploadFile, invalidFile, items } from './testCsvs';

vi.mock('react-router-dom', async () => {
  const reactRouter = await vi.importActual('react-router-dom');

  return {
    ...reactRouter,
    useLocation: vi.fn(),
    useParams: vi.fn().mockReturnValue({}),
  };
});

const setAuthSession = (role: 'Admin' | 'Staff') => {
  useAuthStore.setState({
    authSession: {
      currentAccess: { ...TEST_ADMIN_USER.currentAccess, role },
      isAuthenticated: true,
      isImpersonated: false,
      userData: TEST_ADMIN_USER.userData,
      userType: role,
    },
  });
};

const setupOrgList = (tenantId: string, items: TenantDocument[]) => {
  useOrgListStore.setState({
    tenantId,
    orgList: items,
  });
};

describe('BulkInvite Tests', () => {
  let fetchTenantsSpy: MockInstance;
  let fetchTenantByIdSpy: MockInstance;
  let apiGenerateSignedUrlSpy: MockInstance;
  let useBulkSendSpy: MockInstance;
  let useIsAdminSpy: MockInstance;
  let validationSpy: MockInstance;

  beforeEach(() => {
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
    fetchTenantByIdSpy = vi.spyOn(TenantsServiceModule, 'fetchTenantById');
    fetchTenantsSpy = vi.spyOn(TenantsServiceModule, 'fetchTenants');
    apiGenerateSignedUrlSpy = vi.spyOn(TenantsServiceModule, 'apiGenerateSignedUrl');
    validationSpy = vi.spyOn(TenantsServiceModule, 'bulkInviteValidate');
    useIsAdminSpy = vi.spyOn(UseIsAdminModule, 'useIsAdmin');
    useBulkSendSpy = vi.spyOn(useBulkInvitationModule, 'useBulkInvitation');
  });

  it('should render the bulk invite page', async () => {
    render(<BulkInvite />);

    await waitFor(() => expect(screen.getByText(/bulk upload/i)).toBeTruthy());
  });

  it('submit button should be disabled when the page is first loaded', async () => {
    render(<BulkInvite />);

    await waitFor(() => expect(screen.getByText(/submit/i)).toBeDisabled());
  });

  it('submit button should be disabled when a tenant is selected but has not uploaded document', async () => {
    setAuthSession('Staff');
    setupOrgList('01860f43-7b3b-7fa6-91e4-4', [...items]);

    render(<BulkInvite />);
    await waitFor(() => expect(screen.getByText(/submit/i)).toBeDisabled());
  });

  it('submit button should be disabled when a file is provided but no tenant is selected', async () => {
    render(<BulkInvite />);
    const blob = new Blob([defaultUploadFile]);
    const file = new File([blob], 'values.csv', {
      type: 'text/csv',
    });

    File.prototype.text = vi.fn().mockResolvedValueOnce(defaultUploadFile);
    const input = screen.getByTestId('form-drag-and-drop-area-test-id');

    await userEvent.upload(input, file);

    expect(screen.getByText(/submit/i)).toBeDisabled();
  });

  it('submit button should be disabled when a file is provided but no tenant is selected', async () => {
    render(<BulkInvite />);

    const blob = new Blob([defaultUploadFile]);
    const file = new File([blob], 'values.csv', {
      type: 'text/csv',
    });

    File.prototype.text = vitest.fn().mockResolvedValueOnce(defaultUploadFile);
    const input = screen.getByTestId('form-drag-and-drop-area-test-id');

    await userEvent.upload(input, file);

    expect(screen.getByText(/submit/i)).toBeDisabled();
  });

  it('submit button should be disabled when a root tenant & csv are provided', async () => {
    setAuthSession('Staff');
    setupOrgList(ROOT.id, [...items]);

    renderWithRouter(<BulkInvite />);
    expect(screen.getByText(/submit/i)).toBeDisabled();

    const blob = new Blob([defaultUploadFile]);
    const file = new File([blob], 'values.csv', {
      type: 'text/csv',
    });

    File.prototype.text = vitest.fn().mockResolvedValueOnce([defaultUploadFile]);
    const input = screen.getByTestId('form-drag-and-drop-area-test-id');

    await userEvent.upload(input, file);

    expect(screen.getByText(/submit/i)).toBeDisabled();
  });

  it('should throw an error when uploading an invalid file', async () => {
    fetchTenantsSpy.mockImplementation(() =>
      Promise.resolve({
        data: { items, total: items.length },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse<TenantListResponse>),
    );

    setAuthSession('Admin');
    setupOrgList('01860f43-7b3b-7fa6-91e4-4', [...items]);

    renderWithRouter(<BulkInvite />);
    expect(screen.getByText(/submit/i)).toBeDisabled();

    const blob = new Blob([invalidFile]);
    const file = new File([blob], 'invalidFile.csv', {
      type: 'text/csv',
    });

    File.prototype.text = vitest.fn().mockResolvedValueOnce([invalidFile]);
    const input = screen.getByTestId('form-drag-and-drop-area-test-id');

    await userEvent.upload(input, file);

    expect(screen.getByText(/submit/i)).not.toBeDisabled();

    await userEvent.click(screen.getByText(/submit/i));
    await waitFor(() =>
      expect(useNotifyStore.getState().notifications[0].message).toEqual(
        'Invalid file invalidFile.csv, Please use the provided template and upload again',
      ),
    );
  });

  it('should throw an error when validation fails', async () => {
    vi.spyOn(TenantsServiceModule, 'bulkInviteValidate');
    vi.spyOn(UserServiceModule, 'apiSendAccessInvitation');
    fetchTenantsSpy.mockImplementation(() =>
      Promise.resolve({
        data: { items, total: items.length },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse<TenantListResponse>),
    );
    validationSpy.mockImplementation(() =>
      Promise.resolve({
        data: {
          isValid: false,
          validationErrors: [
            {
              line: 4,
              message:
                "Learner/Proctor can't be added to a school district. Please add Learner/Proctor to a specific school",
            },
          ],
        },
        status: 201,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse<BulkInviteValidationResult>),
    );

    setAuthSession('Admin');
    setupOrgList('01860f43-7b3b-7fa6-91e4-4', [...items]);

    renderWithRouter(<BulkInvite />);
    expect(screen.getByText(/submit/i)).toBeDisabled();

    const blob = new Blob([defaultUploadFile]);
    const file = new File([blob], 'values.csv', {
      type: 'text/csv',
    });

    File.prototype.text = vitest.fn().mockResolvedValueOnce([defaultUploadFile]);
    const input = screen.getByTestId('form-drag-and-drop-area-test-id');

    await userEvent.upload(input, file);
    expect(screen.getByText(/submit/i)).not.toBeDisabled();

    await userEvent.click(screen.getByText(/submit/i));

    await waitFor(() =>
      expect(useNotifyStore.getState().notifications[0].message).toEqual(
        'Validation errors detected. Please fix them and upload again',
      ),
    );
    expect(screen.queryByText(/Error in Bulk Invitation/i)).toBeTruthy();
    expect(screen.queryByText('Line')).toBeTruthy();
    expect(screen.queryByText('Message')).toBeTruthy();
  });

  describe('BulkInvite Stepper Flow', () => {
    it('should render the bulk invite stepper page with the first step', async () => {
      render(<BulkInviteV2 />);

      expect(screen.getByText(/bulk upload/i)).toBeTruthy();
      await waitFor(() => expect(screen.getByText(/next/i)).toBeTruthy());
    });

    it('should throw an error if the next button is clicked without selecting an organization', async () => {
      render(<BulkInviteV2 />);

      await userEvent.click(screen.getByText(/next/i));

      await waitFor(() =>
        expect(useNotifyStore.getState().notifications[0].message).toMatch(/Please select the organization/i),
      );
    });

    it('should go to the second step after clicking next button with selected organization', async () => {
      setAuthSession('Admin');
      setupOrgList('01860f43-7b3b-7fa6-91e4-4', [...items]);
      render(<BulkInviteV2 />);

      await userEvent.click(screen.getByText(/next/i));

      expect(screen.getByText(/submit/i)).toBeDisabled();
    });

    it('should have the back option when the file is not uploaded', async () => {
      setAuthSession('Staff');
      setupOrgList('01860f43-7b3b-7fa6-91e4-4', [...items]);
      render(<BulkInviteV2 />);

      await userEvent.click(screen.getByText(/next/i));

      expect(screen.queryByText(/back/i)).toBeTruthy();
      expect(screen.queryByText(/clear/i)).toBeNull();
    });

    it('should have the clear option when the file is uploaded', async () => {
      setAuthSession('Admin');
      setupOrgList('01860f43-7b3b-7fa6-91e4-4', [...items]);
      render(<BulkInviteV2 />);

      await userEvent.click(screen.getByText(/next/i));

      expect(screen.getByText(/submit/i)).toBeDisabled();

      const blob = new Blob([defaultUploadFile]);
      const file = new File([blob], 'values.csv', {
        type: 'text/csv',
      });

      File.prototype.text = vitest.fn().mockResolvedValueOnce([defaultUploadFile]);
      const input = screen.getByTestId('form-drag-and-drop-area-test-id');

      await userEvent.upload(input, file);

      expect(screen.queryByText(/back/i)).toBeNull();
      expect(screen.queryByText(/clear/i)).toBeTruthy();

      expect(screen.getByText(/submit/i)).not.toBeDisabled();
    });

    it('should not have the discovery bulk upload option in step one but available in step two', async () => {
      setAuthSession('Admin');
      setupOrgList('01860f43-7b3b-7fa6-91e4-4', [...items]);
      render(<BulkInviteV2 />);
      expect(screen.queryByTestId('discovery-upload-test-id')).toBeNull();

      await userEvent.click(screen.getByText(/next/i));

      expect(screen.queryByTestId('discovery-upload-test-id')).toBeTruthy();
    });

    it('should have the discovery bulk upload option disabled when a Utah based organization is selected', async () => {
      setAuthSession('Admin');
      setupOrgList(TEST_UTAH_BASED_ORG.tenantId, [TEST_UTAH_BASED_ORG]);
      render(<BulkInviteV2 />);

      expect(screen.queryByTestId('discovery-upload-test-id')).toBeNull();

      await userEvent.click(screen.getByText(/next/i));

      expect(screen.getByTestId('discovery-upload-test-id').hasAttribute('disabled'));
    });
  });
});
