import { act, render, renderHook, screen, waitFor } from '@utils/test-utils';
import * as OrganizationsServiceModule from '@features/organizations/services/organizations-service';
import * as AssociatedOrgModule from '@features/users/hooks/useUpdateAssociatedOrgs';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { TEST_USER, TEST_UTAH_BASED_ORG } from '@test/constants';
import {
  districtTypeOrg,
  mockPropsWithAccess,
  mockRoleUpdates,
  mockStudentIdUpdates,
  rosteringEnabledOrg,
} from './testData';
import { AssociatedOrgsForm } from './AssociatedOrgsForm';

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

const mockFetchTenantById = async (response: unknown) => {
  await waitFor(() =>
    vi.spyOn(OrganizationsServiceModule, 'fetchTenantById').mockImplementation(() =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      Promise.resolve<AxiosResponse>({
        data: response,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as AxiosHeaders },
      }),
    ),
  );
};

describe('AssociatedOrgs Edit Form Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // await vi.spyOn(AssociatedOrgModule, 'useUpdateAssociatedOrgs').mockImplementation(() => ({
    //   updateStudentId: vi.fn(),
    //   updateRole: vi.fn(),
    //   checkAllAccessesValidation: vi.fn(),
    // }));
  });

  it('should display "Associated Organization Form" with correct fields', async () => {
    render(<AssociatedOrgsForm {...mockPropsWithAccess} details={TEST_USER} />);

    expect(screen.getByTestId('associated-org-edit-form-test-id')).toBeTruthy();

    // Fields
    await waitFor(() => {
      expect(screen.findByText('Name')).toBeTruthy();
    });
    expect(screen.getByText('StudentId')).toBeTruthy();
    expect(screen.getByText('Role')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();

    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();

    // Buttons
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Save')).toBeTruthy();
  });

  it('save button should be disabled when the page is first loaded', () => {
    render(<AssociatedOrgsForm {...mockPropsWithAccess} details={TEST_USER} />);

    expect(screen.getByText(/save/i)).toBeDisabled();
  });

  it('should return true for validation result and the provider for a rostering enabled tenant when updating the role to learner', async () => {
    await mockFetchTenantById(rosteringEnabledOrg);
    render(<AssociatedOrgsForm {...mockPropsWithAccess} details={TEST_USER} />);

    expect(screen.getByTestId('associated-org-edit-form-test-id')).toBeTruthy();

    const { result } = renderHook(() => AssociatedOrgModule.useUpdateAssociatedOrgs());

    const check = await result.current.checkAllAccessesValidation(
      mockPropsWithAccess.access,
      TEST_USER,
      mockStudentIdUpdates,
      mockRoleUpdates.rosteringLearnerUpdate,
    );
    const { isRostering, provider, isDistrictTypeOrg } = check;

    await waitFor(() => expect(isRostering).toBe(true));
    expect(provider).toBe('ClassLink');
    expect(isDistrictTypeOrg).toBe(false);
  });

  it('should return false for validation result for a rostering enabled tenant when updating the role other than learner', async () => {
    await mockFetchTenantById(rosteringEnabledOrg);

    render(<AssociatedOrgsForm {...mockPropsWithAccess} details={TEST_USER} />);

    expect(screen.getByTestId('associated-org-edit-form-test-id')).toBeTruthy();

    const { result } = renderHook(() => AssociatedOrgModule.useUpdateAssociatedOrgs());

    const check = await result.current.checkAllAccessesValidation(
      mockPropsWithAccess.access,
      TEST_USER,
      mockStudentIdUpdates,
      mockRoleUpdates.rosteringStaffUpdate,
    );
    const { isRostering, provider, isDistrictTypeOrg } = check;

    await waitFor(() => expect(isRostering).toBe(false));
    expect(provider).toBe('');
    expect(isDistrictTypeOrg).toBe(false);
  });

  it('should return true for validation result for a district type tenant when updating the role to learner', async () => {
    await mockFetchTenantById(districtTypeOrg);

    render(<AssociatedOrgsForm {...mockPropsWithAccess} details={TEST_USER} />);

    expect(screen.getByTestId('associated-org-edit-form-test-id')).toBeTruthy();

    const { result } = renderHook(() => AssociatedOrgModule.useUpdateAssociatedOrgs());

    // learner
    const check = await result.current.checkAllAccessesValidation(
      mockPropsWithAccess.access,
      TEST_USER,
      mockStudentIdUpdates,
      mockRoleUpdates.disrictTypeLearnerUpdate,
    );
    const { isRostering, provider, isDistrictTypeOrg } = check;

    await waitFor(() => expect(isRostering).toBe(false));
    expect(provider).toBe('');
    expect(isDistrictTypeOrg).toBe(true);
  });

  it('should return true for validation result for a district type tenant when updating the role to proctor', async () => {
    await mockFetchTenantById(districtTypeOrg);

    render(<AssociatedOrgsForm {...mockPropsWithAccess} details={TEST_USER} />);
    const { result } = renderHook(() => AssociatedOrgModule.useUpdateAssociatedOrgs());

    // proctror
    const check = await result.current.checkAllAccessesValidation(
      mockPropsWithAccess.access,
      TEST_USER,
      mockStudentIdUpdates,
      mockRoleUpdates.disrictTypeProctorUpdate,
    );
    const { isRostering, provider, isDistrictTypeOrg } = check;

    await waitFor(() => expect(isRostering).toBe(false));
    expect(provider).toBe('');
    expect(isDistrictTypeOrg).toBe(true);
  });

  it('should return false for validation result for a district type tenant when updating the role other than learner/proctor', async () => {
    await mockFetchTenantById(districtTypeOrg);
    render(<AssociatedOrgsForm {...mockPropsWithAccess} details={TEST_USER} />);

    expect(screen.getByTestId('associated-org-edit-form-test-id')).toBeTruthy();

    const { result } = renderHook(() => AssociatedOrgModule.useUpdateAssociatedOrgs());

    const check = await result.current.checkAllAccessesValidation(
      mockPropsWithAccess.access,
      TEST_USER,
      mockStudentIdUpdates,
      mockRoleUpdates.districtTypeAdminUpdate,
    );
    const { isRostering, provider, isDistrictTypeOrg } = check;

    await waitFor(() => expect(isRostering).toBe(false));
    expect(provider).toBe('');
    expect(isDistrictTypeOrg).toBe(false);
  });

  it('should return an array with required fields for validation result when updating the role to learner in a UT based organization', async () => {
    await mockFetchTenantById(TEST_UTAH_BASED_ORG);
    render(<AssociatedOrgsForm {...mockPropsWithAccess} details={TEST_USER} />);

    expect(screen.getByTestId('associated-org-edit-form-test-id')).toBeTruthy();

    const { result } = renderHook(() => AssociatedOrgModule.useUpdateAssociatedOrgs());

    const check = await result.current.checkAllAccessesValidation(
      mockPropsWithAccess.access,
      TEST_USER,
      mockStudentIdUpdates,
      mockRoleUpdates.rosteringLearnerUpdate,
    );
    const { isRostering, provider, isDistrictTypeOrg, missingFields } = check;

    await waitFor(() => expect(isRostering).toBe(false));
    expect(provider).toBe('');
    expect(isDistrictTypeOrg).toBe(false);
    expect(missingFields?.length).toBeGreaterThan(0);
    expect(missingFields).toContain('Date of Birth');
    expect(missingFields).toContain('Student Id');
  });

  it('should not return an array with missing required fields for validation when updating the role to something other than Learner in a UT based organization', async () => {
    await mockFetchTenantById(TEST_UTAH_BASED_ORG);
    render(<AssociatedOrgsForm {...mockPropsWithAccess} details={TEST_USER} />);

    expect(screen.getByTestId('associated-org-edit-form-test-id')).toBeTruthy();

    const { result } = renderHook(() => AssociatedOrgModule.useUpdateAssociatedOrgs());

    const check = await result.current.checkAllAccessesValidation(
      mockPropsWithAccess.access,
      TEST_USER,
      mockStudentIdUpdates,
      mockRoleUpdates.disrictTypeProctorUpdate,
    );
    const { isRostering, provider, isDistrictTypeOrg, missingFields } = check;

    await waitFor(() => expect(isRostering).toBe(false));
    expect(provider).toBe('');
    expect(isDistrictTypeOrg).toBe(false);
    expect(missingFields?.length).toBe(0);
  });
});
