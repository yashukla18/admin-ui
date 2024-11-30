import { TenantDocument } from '@youscience/user-service-common';
import { renderWithRouter, screen, waitFor, userEvent } from '@utils/test-utils';
import { vi } from 'vitest';
import { useAuthStore } from '@stores/authStore';
import { TEST_TENANT } from '@test/constants';
import { activateRootAdmin } from '@test/utils/activateUserByRoles';
import { RosteringForm } from './RosteringForm';

describe('Rostering Form For Organization', () => {
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => null);

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

  beforeEach(() => {
    consoleErrorSpy.mockClear();
    useAuthStore.setState({
      authSession: {
        isAuthenticated: false,
        currentAccess: undefined,
        userData: undefined,
        userType: undefined,
      },
    });
    vi.clearAllMocks();
  });

  it('should render rostering form', async () => {
    await activateRootAdmin();
    renderWithRouter(<RosteringForm organization={TEST_TENANT} />);
    await waitFor(() => expect(screen.getByText('Rostering provider/SSO')).toBeTruthy());
  });

  it('should disable provider when classification type is not charterSchool, privateHighSchool privateMiddleSchool publicHighSchool or publicMiddleSchool', async () => {
    await activateRootAdmin();
    const { container } = renderWithRouter(<RosteringForm organization={TEST_TENANT} />);

    const ssoProviderTypeInput = container.querySelector('input[name="provider.type"]')!;

    expect(ssoProviderTypeInput).toBeDisabled();
  });

  it('should enable provider when classification type is charterSchool, privateHighSchool privateMiddleSchool publicHighSchool or publicMiddleSchool', async () => {
    await activateRootAdmin();
    const { container } = renderWithRouter(
      <RosteringForm organization={{ ...TEST_TENANT, classification: { type: 'charterSchool' } } as TenantDocument} />,
    );

    const ssoProviderTypeInput = container.querySelector('input[name="provider.type"]')!;

    expect(ssoProviderTypeInput).not.toBeDisabled();
  });

  it('should not show Georgia DOE as a provider option if tenant is not a child of Georgia', async () => {
    await activateRootAdmin();
    renderWithRouter(
      <RosteringForm
        organization={{ ...TEST_TENANT, classification: { type: 'publicHighSchool' } } as TenantDocument}
      />,
    );

    await userEvent.click(screen.getAllByRole('combobox')[0]);
    const options = screen.getAllByRole('option');

    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('None');
    expect(options[1]).toHaveTextContent('Clever');
    expect(options[2]).toHaveTextContent('ClassLink');
    expect(options[3]).toHaveTextContent('GG4L');
  });

  it('should show Georgia DOE as a provider option when tenant is a descendant of Georgia', async () => {
    await activateRootAdmin();
    renderWithRouter(
      <RosteringForm
        organization={
          {
            ...TEST_TENANT,
            classification: { type: 'publicHighSchool' },
            deepPath: [{ tenantId: import.meta.env.VITE_GEORGIA_ORG_ID.toString() }],
          } as TenantDocument
        }
      />,
    );

    await userEvent.click(screen.getAllByRole('combobox')[0]);
    const options = screen.getAllByRole('option');

    expect(options).toHaveLength(5);
    expect(options[0]).toHaveTextContent('None');
    expect(options[1]).toHaveTextContent('Clever');
    expect(options[2]).toHaveTextContent('ClassLink');
    expect(options[3]).toHaveTextContent('Georgia DOE');
    expect(options[4]).toHaveTextContent('GG4L');
  });

  it('should dynamically load provider fields based off provider type', async () => {
    await activateRootAdmin();
    const { container } = renderWithRouter(
      <RosteringForm
        organization={
          {
            ...TEST_TENANT,
            classification: { type: 'publicHighSchool' },
            deepPath: [{ tenantId: import.meta.env.VITE_GEORGIA_ORG_ID.toString() }],
          } as TenantDocument
        }
      />,
    );

    const classificationTypeSelect = screen.getAllByRole('combobox')[0];

    const ssoProviderTypeInput = container.querySelector('input[name="provider.type"]')!;

    await userEvent.click(classificationTypeSelect);
    await userEvent.click(screen.getByText(/clever/i));

    expect(ssoProviderTypeInput).toHaveValue('Clever');
    expect(screen.getByPlaceholderText(/district id/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/school id/i)).toBeInTheDocument();

    await userEvent.click(classificationTypeSelect);
    await userEvent.click(screen.getByText(/classlink/i));

    expect(ssoProviderTypeInput).toHaveValue('ClassLink');
    expect(screen.getByPlaceholderText(/tenant id/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/source id/i)).toBeInTheDocument();

    await userEvent.click(classificationTypeSelect);
    await userEvent.click(screen.getByText(/georgia DOE/i));

    expect(ssoProviderTypeInput).toHaveValue('GADOE');
    expect(screen.getByPlaceholderText(/system id/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/school id/i)).toBeInTheDocument();

    await userEvent.click(classificationTypeSelect);
    await userEvent.click(screen.getByText(/GG4L/i));

    expect(ssoProviderTypeInput).toHaveValue('GG4L');
    expect(screen.getByPlaceholderText(/district id/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/school id/i)).toBeInTheDocument();
  });
});
