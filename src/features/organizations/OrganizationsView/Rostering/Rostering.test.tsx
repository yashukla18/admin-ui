import { render, userEvent } from '@utils/test-utils';
import { TenantDocument } from '@youscience/user-service-common';
import { screen, waitFor } from '@testing-library/react';
import * as reactRouterModule from 'react-router-dom';
import * as SisServiceModule from '@services/sis.service';
import * as UseIsAdminModule from '@hooks/useIsAdmin';
import { MockInstance } from 'vitest';
import { useNotifyStore } from '@stores/notifyStore';
import { activateOrgAdmin, activateRootAdmin, activateStaffUser } from '@test/utils/activateUserByRoles';
import { Rostering } from './Rostering';

const details = {
  tenantId: '018ccbbf-2ec9-71d3-a15e-1cd58394b1ee',
  name: 'RedMountainTec Charter',
  classification: {
    type: 'charterSchool',
    nces: {
      name: '',
      ncesId: '',
      stateId: '',
    },
  },
  addresses: [
    {
      lines: ['', ''],
      city: '',
      state: 'UT',
      postCode: '',
      country: '',
    },
  ],
  path: ',01860f43-7b3b-7fa6-91e4-4b271b365a7b,018c68c7-33da-785c-969e-c5f3c85c975a,',
  deepPath: [
    {
      tenantId: '01860f43-7b3b-7fa6-91e4-4b271b365a7b',
      name: 'YouScience (ROOT)',
    },
    {
      tenantId: '018c68c7-33da-785c-969e-c5f3c85c975a',
      name: 'RedMountainTec',
      classificationType: 'district',
    },
  ],
  tags: [],
} as TenantDocument;

vi.mock('react-router-dom', async () => {
  const reactRouter = await vi.importActual('react-router-dom');

  return {
    ...reactRouter,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
    useNavigation: vi.fn(),
  };
});

describe('Rostering Details', () => {
  let syncStatusSpy: MockInstance;
  let reSyncStatusSpy: MockInstance;
  let useIsAdminSpy: MockInstance;

  beforeEach(() => {
    vi.mock('useNavigate', () => vi.fn());
    vi.spyOn(reactRouterModule, 'useParams').mockReturnValue({ id: '123' });
    useNotifyStore.setState({ notifications: [], notificationInfo: undefined, clearNotifications: vi.fn() });
    useNotifyStore.getState().clearNotifications();
    syncStatusSpy = vi.spyOn(SisServiceModule.sisService, 'syncStatus');
    reSyncStatusSpy = vi.spyOn(SisServiceModule.sisService, 'reSyncStatus');
    useIsAdminSpy = vi.spyOn(UseIsAdminModule, 'useIsAdmin');

    vi.clearAllMocks();
  });

  it('should display the Rostering card', () => {
    render(
      <Rostering
        organization={{
          ...details,
          ssoSettings: {
            rosteringEnabled: false,
          },
        }}
      />,
    );

    expect(screen.queryByText('Rostering')).toBeInTheDocument();
  });

  it('should not display the SSO details if no type is selected', () => {
    render(
      <Rostering
        organization={{
          ...details,
          ssoSettings: {
            rosteringEnabled: false,
          },
        }}
      />,
    );

    expect(screen.getByText(/rostering enabled/i)).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();

    expect(screen.queryByText(/Rostering provider\/SSO/i)).not.toBeInTheDocument();
  });

  it('should not display the SSO details if no type is selected and rostering enabled is true', () => {
    render(
      <Rostering
        organization={{
          ...details,
          ssoSettings: {
            provider: { type: '' } as never,
            rosteringEnabled: true,
          },
        }}
      />,
    );

    expect(screen.getByText(/rostering enabled/i)).toBeInTheDocument();
    expect(screen.getByText(/yes/i)).toBeInTheDocument();

    expect(screen.queryByText(/Rostering provider\/SSO/i)).not.toBeInTheDocument();
  });

  it('should display ClassLink SSO details', () => {
    render(
      <Rostering
        organization={{
          ...details,
          ssoSettings: {
            provider: { type: 'ClassLink', districtId: '1234', schoolId: '5678' },
            rosteringEnabled: true,
          },
        }}
      />,
    );

    expect(screen.getByText(/rostering enabled/i)).toBeInTheDocument();
    expect(screen.getByText(/yes/i)).toBeInTheDocument();

    expect(screen.getByText(/Rostering provider\/SSO/i)).toBeInTheDocument();
    expect(screen.getByText(/ClassLink/i)).toBeInTheDocument();

    expect(screen.getByText(/tenant ID/i)).toBeInTheDocument();
    expect(screen.getByText(/1234/i)).toBeInTheDocument();

    expect(screen.getByText(/source ID/i)).toBeInTheDocument();
    expect(screen.getByText(/5678/i)).toBeInTheDocument();
  });

  it('should display Clever SSO details properly', () => {
    render(
      <Rostering
        organization={{
          ...details,
          ssoSettings: {
            provider: { type: 'Clever', districtId: '2344', schoolId: '6678' },
            rosteringEnabled: true,
          },
        }}
      />,
    );

    expect(screen.getByText(/rostering enabled/i)).toBeInTheDocument();
    expect(screen.getByText(/yes/i)).toBeInTheDocument();

    expect(screen.getByText(/Rostering provider\/SSO/i)).toBeInTheDocument();
    expect(screen.getByText(/Clever/i)).toBeInTheDocument();

    expect(screen.getByText(/district ID/i)).toBeInTheDocument();
    expect(screen.getByText(/2344/i)).toBeInTheDocument();

    expect(screen.getByText(/school ID/i)).toBeInTheDocument();
    expect(screen.getByText(/6678/i)).toBeInTheDocument();
  });

  it('should display Georgia SSO details properly', () => {
    render(
      <Rostering
        organization={{
          ...details,
          deepPath: [{ ...details, tenantId: import.meta.env.VITE_GEORGIA_ORG_ID }],
          ssoSettings: {
            provider: { type: 'GADOE', systemId: '2222', schoolId: '5555' },
            rosteringEnabled: true,
          },
        }}
      />,
    );
    expect(screen.getByText(/rostering enabled/i)).toBeInTheDocument();
    expect(screen.getByText(/yes/i)).toBeInTheDocument();

    expect(screen.getByText(/Rostering provider\/SSO/i)).toBeInTheDocument();
    expect(screen.getByText(/georgia doe/i)).toBeInTheDocument();

    expect(screen.getByText(/system ID/i)).toBeInTheDocument();
    expect(screen.getByText(/2222/i)).toBeInTheDocument();

    expect(screen.getByText(/school ID/i)).toBeInTheDocument();
    expect(screen.getByText(/5555/i)).toBeInTheDocument();
  });

  it('should display GG4l SSO details properly', () => {
    render(
      <Rostering
        organization={{
          ...details,
          ssoSettings: {
            provider: { type: 'GG4L', districtId: '9837', schoolId: '8276' },
            rosteringEnabled: true,
          },
        }}
      />,
    );

    expect(screen.getByText(/rostering enabled/i)).toBeInTheDocument();
    expect(screen.getByText(/yes/i)).toBeInTheDocument();

    expect(screen.getByText(/Rostering provider\/SSO/i)).toBeInTheDocument();
    expect(screen.getByText(/GG4L/i)).toBeInTheDocument();

    expect(screen.getByText(/district ID/i)).toBeInTheDocument();
    expect(screen.getByText(/9837/i)).toBeInTheDocument();

    expect(screen.getByText(/school ID/i)).toBeInTheDocument();
    expect(screen.getByText(/8276/i)).toBeInTheDocument();
  });

  describe('Sync and Resync Status', () => {
    it('should not display the sync status if no SSO settings are provided', () => {
      render(
        <Rostering
          organization={{
            ...details,
            ssoSettings: {
              rosteringEnabled: false,
            },
          }}
        />,
      );

      expect(screen.queryByText(/Sync Status/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Resync/i)).not.toBeInTheDocument();
    });

    it('should not display the sync status if the provider is GADOE', () => {
      render(
        <Rostering
          organization={{
            ...details,
            deepPath: [{ ...details, tenantId: import.meta.env.VITE_GEORGIA_ORG_ID }],
            ssoSettings: {
              provider: { type: 'GADOE', systemId: '2222', schoolId: '5555' },
              rosteringEnabled: true,
            },
          }}
        />,
      );

      expect(screen.queryByText(/Sync Status/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Resync/i)).not.toBeInTheDocument();
    });

    it('should display the sync status and resync option for a valid provider', async () => {
      await activateRootAdmin();
      syncStatusSpy.mockImplementation(() =>
        Promise.resolve({
          status: 'completed',
          lastSyncStartedAt: '2024-04-19T12:53:47.275Z',
          message: 'Sync completed',
          districtId: 'gfhgh345635',
          lastSyncEndedAt: '2024-04-19T12:53:53.625Z',
        }),
      );
      render(
        <Rostering
          organization={{
            ...details,
            ssoSettings: {
              provider: { type: 'Clever', districtId: '2344', schoolId: '6678' },
              rosteringEnabled: true,
            },
          }}
        />,
      );

      expect(screen.queryByText(/Sync Status/i)).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByText(/Resync/i)).toBeInTheDocument());
    });

    it('should display the Succeeded status and resync option if the SIS service status is completed', async () => {
      await activateRootAdmin();
      syncStatusSpy.mockImplementation(() =>
        Promise.resolve({
          status: 'completed',
          lastSyncStartedAt: '2024-04-19T12:53:47.275Z',
          message: 'Sync completed',
          districtId: '2344',
          lastSyncEndedAt: '2024-04-19T12:53:53.625Z',
        }),
      );
      render(
        <Rostering
          organization={{
            ...details,
            ssoSettings: {
              provider: { type: 'Clever', districtId: '2344', schoolId: '6678' },
              rosteringEnabled: true,
            },
          }}
        />,
      );

      expect(screen.queryByText(/Sync Status/i)).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByText(/Succeeded/i)).toBeInTheDocument());
      expect(screen.queryByText(/Resync/i)).toBeInTheDocument();
    });

    it('should display the In Progress status and disable the resync option if the SIS service status is in progress', async () => {
      await activateRootAdmin();
      syncStatusSpy.mockImplementation(() =>
        Promise.resolve({
          status: 'inprogress',
          lastSyncStartedAt: '2024-04-19T12:53:47.275Z',
          message: 'Sync completed',
          districtId: '2344',
          lastSyncEndedAt: '2024-04-19T12:53:53.625Z',
        }),
      );
      render(
        <Rostering
          organization={{
            ...details,
            ssoSettings: {
              provider: { type: 'Clever', districtId: '2344', schoolId: '6678' },
              rosteringEnabled: true,
            },
          }}
        />,
      );

      expect(screen.queryByText(/Sync Status/i)).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByText(/In Progress/i)).toBeInTheDocument());
      expect(screen.queryByText(/Resync/i)).toHaveAttribute('disabled');
    });

    it('should display the Failed status and resync option if the SIS service status is failed', async () => {
      await activateRootAdmin();
      syncStatusSpy.mockImplementation(() => Promise.resolve(null));
      render(
        <Rostering
          organization={{
            ...details,
            ssoSettings: {
              provider: { type: 'Clever', districtId: '2344', schoolId: '6678' },
              rosteringEnabled: true,
            },
          }}
        />,
      );

      expect(screen.queryByText(/Sync Status/i)).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByText(/Failed/i)).toBeInTheDocument());
      expect(screen.queryByText(/Resync/i)).toBeInTheDocument();
      expect(screen.queryByText(/Last Updated On/i)).toBeInTheDocument();
      expect(screen.queryByText(/N\/A/i)).toBeTruthy();
    });

    it('should display the last updated time in the correct format', async () => {
      await activateRootAdmin();
      syncStatusSpy.mockImplementation(() =>
        Promise.resolve({
          status: 'completed',
          lastSyncStartedAt: '2024-04-19T12:53:47.275Z',
          message: 'Sync completed',
          districtId: '2344',
          lastSyncEndedAt: '2024-04-19T12:53:53.625Z',
        }),
      );
      render(
        <Rostering
          organization={{
            ...details,
            ssoSettings: {
              provider: { type: 'Clever', districtId: '2344', schoolId: '6678' },
              rosteringEnabled: true,
            },
          }}
        />,
      );

      expect(screen.queryByText(/Sync Status/i)).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByText(/Succeeded/i)).toBeInTheDocument());
      expect(screen.queryByText(/Resync/i)).toBeInTheDocument();
      expect(screen.queryByText(/Last Updated On/i)).toBeInTheDocument();
      expect(screen.queryByText(/\b\w{3}\s\w{3}\s\d{1,2},\s\d{4}\s\d{1,2}:\d{2}\s[AP]M\b/i)).toBeInTheDocument();
    });

    it('should throw an error if resync fails', async () => {
      await activateRootAdmin();
      syncStatusSpy.mockImplementation(() => Promise.resolve(null));
      reSyncStatusSpy.mockImplementation(() => Promise.reject(new Error('Resync failed')));
      render(
        <Rostering
          organization={{
            ...details,
            ssoSettings: {
              provider: { type: 'Clever', districtId: '2344', schoolId: '6678' },
              rosteringEnabled: true,
            },
          }}
        />,
      );

      expect(screen.queryByText(/Sync Status/i)).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByText(/Failed/i)).toBeInTheDocument());

      await userEvent.click(screen.getByText(/Resync/i));

      await waitFor(() =>
        expect(useNotifyStore.getState().notifications[0].message).toMatch(
          /Rostering resync failed. Please try again later/i,
        ),
      );
    });

    it('should resync successfully', async () => {
      await activateRootAdmin();
      syncStatusSpy.mockImplementation(() =>
        Promise.resolve({
          status: 'completed',
          lastSyncStartedAt: '2024-04-19T12:53:47.275Z',
          message: 'Sync completed',
          districtId: '2344',
          lastSyncEndedAt: '2024-04-19T12:53:53.625Z',
        }),
      );
      reSyncStatusSpy.mockImplementation(() =>
        Promise.resolve({
          tenantId: 'dafo9807adf87df3',
          districtId: '2344',
          provider: 'ClassLink',
          schoolIds: '2344',
        }),
      );
      render(
        <Rostering
          organization={{
            ...details,
            ssoSettings: {
              provider: { type: 'Clever', districtId: '2344', schoolId: '2344' },
              rosteringEnabled: true,
            },
          }}
        />,
      );

      expect(screen.queryByText(/Sync Status/i)).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByText(/Succeeded/i)).toBeInTheDocument());
      expect(screen.queryByText(/Resync/i)).not.toHaveAttribute('disabled');
      await userEvent.click(screen.getByText(/Resync/i));

      await waitFor(() =>
        expect(useNotifyStore.getState().notifications[0].message).toMatch(
          /Sync started successfully. Come back after some time/i,
        ),
      );

      await waitFor(() => expect(screen.queryByText(/In Progress/i)).toBeInTheDocument());
      expect(screen.queryByText(/Resync/i)).toHaveAttribute('disabled');
    });

    it('should not display the resync option if the user is org admin', async () => {
      await activateOrgAdmin();
      syncStatusSpy.mockImplementation(() =>
        Promise.resolve({
          status: 'completed',
          lastSyncStartedAt: '2024-04-19T12:53:47.275Z',
          message: 'Sync completed',
          districtId: '2344',
          lastSyncEndedAt: '2024-04-19T12:53:53.625Z',
        }),
      );
      render(
        <Rostering
          organization={{
            ...details,
            ssoSettings: {
              provider: { type: 'Clever', districtId: '1189', schoolId: '7483' },
              rosteringEnabled: true,
            },
          }}
        />,
      );
      expect(screen.queryByText(/Sync Status/i)).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByText(/Succeeded/i)).toBeInTheDocument());
      expect(screen.queryByText(/Resync/i)).not.toBeInTheDocument();
    });

    it('should not display the resync option if the user is staff', async () => {
      await activateStaffUser();
      syncStatusSpy.mockImplementation(() =>
        Promise.resolve({
          status: 'completed',
          lastSyncStartedAt: '2024-04-19T12:53:47.275Z',
          message: 'Sync completed',
          districtId: '2344',
          lastSyncEndedAt: '2024-04-19T12:53:53.625Z',
        }),
      );
      render(
        <Rostering
          organization={{
            ...details,
            ssoSettings: {
              provider: { type: 'Clever', districtId: '3458', schoolId: '8895' },
              rosteringEnabled: true,
            },
          }}
        />,
      );
      expect(screen.queryByText(/Sync Status/i)).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByText(/Succeeded/i)).toBeInTheDocument());
      expect(screen.queryByText(/Resync/i)).not.toBeInTheDocument();
    });
  });
});
