import { TenantDocument } from '@youscience/user-service-common';
import { renderWithRouter, screen, waitFor, act, userEvent } from '@utils/test-utils';
import { vi } from 'vitest';
import { useAuthStore } from '@stores/authStore';
import { NEW_TENANT } from '@utils/formatOrganizationForEdit';
import {
  districtOrg,
  districtOrgId,
  orgSelectorFn,
  ROOT_ORGANIZATION,
  schoolId,
  stateOrg,
  stateOrgId,
  TEST_GEORGIA_TENANT,
  TEST_TENANT_2,
  TEST_TENANT,
  TEST_CHILD_TENANT,
} from '@test/constants';
import { activateOrgAdmin, activateRootAdmin, activateStaffUser } from '@test/utils/activateUserByRoles';
import useSelectParentOrg, { SelectParentOrgHookProps } from '@hooks/useSelectParentOrg';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { useOrgListStore } from '@stores/orgListStore';
import { items } from '@features/invitations/BulkInvite/testCsvs';
import * as userServiceModule from '../services/organizations-service';
import { tenantService } from '../../../services/tenant.service';
import OrganizationsTable from '../OrganizationsTable';
import Details from '../OrganizationsView/Details';
import { DetailsForm } from './DetailsForm';

describe('Details Form For Organization', () => {
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => null);

  vi.mock('react-router-dom', async () => {
    const reactRouter = await vi.importActual('react-router-dom');

    return {
      ...reactRouter,
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

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const setupOrgList = (tenantId: string, items: TenantDocument[]) => {
    useOrgListStore.setState({
      tenantId,
      orgList: items,
    });
  };

  it('admin should able to see add organization button on org table page', async () => {
    await activateRootAdmin();

    vi.mock('tanstack/react-query', () => ({
      useInfiniteQuery: vi
        .fn()
        .mockReturnValue({ data: { pages: [{ items: [], total: 0 }] }, isLoading: false, fetchNextPage: vi.fn() }),
    }));

    renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <OrganizationsTable />
      </QueryClientProvider>,
    );
    expect(
      screen.getByRole('button', {
        name: /Add organization/,
      }),
    ).toBeTruthy();
  });

  it('non root admin should not able to see add organization button on org table page', async () => {
    await activateOrgAdmin();
    renderWithRouter(<OrganizationsTable />);
    const button = screen.queryByRole('button', {
      name: /Add organization/,
    });

    expect(button).toBeNull();
  });

  it('should show disabled save button in details form page for all blank entries', async () => {
    await activateRootAdmin();
    renderWithRouter(<DetailsForm organization={NEW_TENANT as TenantDocument} isNew />);
    expect(
      screen.getByRole('button', {
        name: /Save/,
      }),
    ).toBeDisabled();
  });

  it('should show all blank entries for new organization page initially ', async () => {
    await activateRootAdmin();
    const { container } = renderWithRouter(<DetailsForm organization={NEW_TENANT as TenantDocument} isNew />);

    expect(container.querySelector('input[name="name"]')?.getAttribute('value')).toStrictEqual('');
    expect(container.querySelector('input[name="classification.type"]')?.getAttribute('value')).toStrictEqual('');
    expect(container.querySelector('input[name="addresses.0.lines"]')?.getAttribute('value')).toStrictEqual('');
    expect(container.querySelector('input[name="addresses.0.city"]')?.getAttribute('value')).toStrictEqual('');
    expect(container.querySelector('input[name="addresses.0.state"]')?.getAttribute('value')).toStrictEqual('');
    expect(container.querySelector('input[name="addresses.0.postCode"]')?.getAttribute('value')).toStrictEqual('');
    expect(screen.getByPlaceholderText('Organization name')?.getAttribute('value')).toStrictEqual('');
  });

  it('should disable form if required values are not provided', async () => {
    vi.spyOn(tenantService, 'apiUpdateTenantById');

    await activateRootAdmin();
    const { container } = renderWithRouter(<DetailsForm organization={NEW_TENANT as TenantDocument} isNew />);
    const saveButton = screen.getAllByRole('button', { name: /Save/i })[0];

    expect(saveButton).toBeDisabled();
    await userEvent.type(container.querySelector('input[name="name"]')!, 'Test Org');

    const stateInputField = screen.getAllByRole('combobox')[2];

    await userEvent.click(stateInputField);

    await waitFor(() => userEvent.click(screen.getAllByText(/arizona/i)[0]));
    expect(saveButton).not.toBeDisabled();
  });

  it('should disable ncesId and type fields for Georgia organization', async () => {
    await activateRootAdmin();
    const { container } = renderWithRouter(<DetailsForm organization={TEST_GEORGIA_TENANT} isNew={false} />);

    expect(container).toBeTruthy();
    expect(container.querySelector('input[name="classification.type"]')).toBeDisabled();
    expect(container.querySelector('input[name="classification.nces.ncesId"]')).toBeDisabled();
  });

  it('should display NCES fields when an NCES based organization type is selected', async () => {
    vi.spyOn(tenantService, 'apiUpdateTenantById');

    await activateRootAdmin();

    const { container } = renderWithRouter(<DetailsForm organization={NEW_TENANT as TenantDocument} isNew />);

    const orgType = screen.getAllByRole('combobox')[0];

    await userEvent.click(orgType);
    await waitFor(() => userEvent.click(screen.getAllByText(/district/i)[0]));

    expect(container.querySelector('input[name="classification.nces.name"]')).toBeTruthy();
    expect(container.querySelector('input[name="classification.nces.ncesId"]')).toBeTruthy();
    expect(container.querySelector('input[name="classification.nces.stateId"]')).toBeTruthy();
  });

  it('should throw error if invalid government type NCES ID provided', async () => {
    vi.spyOn(tenantService, 'apiUpdateTenantById');
    await activateRootAdmin();
    setupOrgList('01860f43-7b3b-7fa6-91e4-4', [...items]);

    const { container } = renderWithRouter(<DetailsForm organization={NEW_TENANT as TenantDocument} isNew />);

    const saveButton = screen.getAllByRole('button', { name: /Save/i })[0];

    await userEvent.type(container.querySelector('input[name="name"]')!, 'Test');

    const [orgType, parentOrg, stateInputField] = screen.getAllByRole('combobox');

    await userEvent.click(stateInputField);
    await waitFor(() => userEvent.click(screen.getAllByText(/arizona/i)[0]));

    await userEvent.click(parentOrg);
    await waitFor(() => userEvent.click(screen.getAllByText(/Demo High School/i)[0]));

    await userEvent.click(orgType);
    await waitFor(() => userEvent.click(screen.getAllByText(/government/i)[0]));

    const ncesIdInput = container.querySelector('input[name="classification.nces.ncesId"]');

    expect(ncesIdInput).toBeTruthy();

    if (ncesIdInput) {
      await userEvent.type(ncesIdInput, '123');
      await userEvent.click(saveButton);
      await waitFor(() => expect(screen.queryByText(/Invalid NCES ID/i)).toBeInTheDocument());

      await userEvent.clear(ncesIdInput);
      await userEvent.type(ncesIdInput, '12');
      await waitFor(() => expect(screen.queryByText(/Invalid NCES ID/i)).not.toBeInTheDocument());
    }
  });

  it('should throw error if invalid district type NCES ID provided', async () => {
    vi.spyOn(tenantService, 'apiUpdateTenantById');
    await activateRootAdmin();
    setupOrgList('01860f43-7b3b-7fa6-91e4-4', [...items]);

    const { container } = renderWithRouter(<DetailsForm organization={NEW_TENANT as TenantDocument} isNew />);

    const saveButton = screen.getAllByRole('button', { name: /Save/i })[0];

    await userEvent.type(container.querySelector('input[name="name"]')!, 'Test');

    const [orgType, parentOrg, stateInputField] = screen.getAllByRole('combobox');

    await userEvent.click(stateInputField);
    await waitFor(() => userEvent.click(screen.getAllByText(/arizona/i)[0]));

    await userEvent.click(parentOrg);
    await waitFor(() => userEvent.click(screen.getAllByText(/Demo High School/i)[0]));

    await userEvent.click(orgType);
    await waitFor(() => userEvent.click(screen.getAllByText(/district/i)[0]));

    const ncesIdInput = container.querySelector('input[name="classification.nces.ncesId"]');

    expect(ncesIdInput).toBeTruthy();

    if (ncesIdInput) {
      await userEvent.type(ncesIdInput, '123');
      await userEvent.click(saveButton);
      await waitFor(() => expect(screen.queryByText(/Invalid NCES ID/i)).toBeInTheDocument());

      await userEvent.clear(ncesIdInput);
      await userEvent.type(ncesIdInput, '1234567');
      await waitFor(() => expect(screen.queryByText(/Invalid NCES ID/i)).not.toBeInTheDocument());
    }
  });

  it('should throw error if invalid public type NCES ID provided', async () => {
    vi.spyOn(tenantService, 'apiUpdateTenantById');
    await activateRootAdmin();
    setupOrgList('01860f43-7b3b-7fa6-91e4-4', [...items]);

    const { container } = renderWithRouter(<DetailsForm organization={NEW_TENANT as TenantDocument} isNew />);

    const saveButton = screen.getAllByRole('button', { name: /Save/i })[0];

    await userEvent.type(container.querySelector('input[name="name"]')!, 'Test');

    const [orgType, parentOrg, stateInputField] = screen.getAllByRole('combobox');

    await userEvent.click(stateInputField);
    await waitFor(() => userEvent.click(screen.getAllByText(/arizona/i)[0]));

    await userEvent.click(parentOrg);
    await waitFor(() => userEvent.click(screen.getAllByText(/Demo High School/i)[0]));

    await userEvent.click(orgType);
    await waitFor(() => userEvent.click(screen.getAllByText(/public middle school/i)[0]));

    const ncesIdInput = container.querySelector('input[name="classification.nces.ncesId"]');

    expect(ncesIdInput).toBeTruthy();

    if (ncesIdInput) {
      await userEvent.type(ncesIdInput, '123');
      await userEvent.click(saveButton);
      await waitFor(() => expect(screen.queryByText(/Invalid NCES ID/i)).toBeInTheDocument());

      await userEvent.clear(ncesIdInput);
      await userEvent.type(ncesIdInput, '123456789111');
      await waitFor(() => expect(screen.queryByText(/Invalid NCES ID/i)).not.toBeInTheDocument());
    }
  });

  it('should throw error if invalid private type NCES ID provided', async () => {
    vi.spyOn(tenantService, 'apiUpdateTenantById');
    await activateRootAdmin();
    setupOrgList('01860f43-7b3b-7fa6-91e4-4', [...items]);

    const { container } = renderWithRouter(<DetailsForm organization={NEW_TENANT as TenantDocument} isNew />);

    const saveButton = screen.getAllByRole('button', { name: /Save/i })[0];

    await userEvent.type(container.querySelector('input[name="name"]')!, 'Test');

    const [orgType, parentOrg, stateInputField] = screen.getAllByRole('combobox');

    await userEvent.click(stateInputField);
    await waitFor(() => userEvent.click(screen.getAllByText(/arizona/i)[0]));

    await userEvent.click(parentOrg);
    await waitFor(() => userEvent.click(screen.getAllByText(/Demo High School/i)[0]));

    await userEvent.click(orgType);
    await waitFor(() => userEvent.click(screen.getAllByText(/private high school/i)[0]));

    const ncesIdInput = container.querySelector('input[name="classification.nces.ncesId"]');

    expect(ncesIdInput).toBeTruthy();

    if (ncesIdInput) {
      await userEvent.type(ncesIdInput, '123');
      await userEvent.click(saveButton);
      await waitFor(() => expect(screen.queryByText(/Invalid NCES ID/i)).toBeInTheDocument());

      await userEvent.clear(ncesIdInput);
      await userEvent.type(ncesIdInput, '12345678');
      await waitFor(() => expect(screen.queryByText(/Invalid NCES ID/i)).not.toBeInTheDocument());
    }
  });
});

describe('Create Organization', () => {
  const setParentLoadingMock = vi.fn() as React.Dispatch<React.SetStateAction<boolean>>;

  it('should throw error if admin trying make org as its own parent', async () => {
    const hookProps: SelectParentOrgHookProps = {
      currentOrgId: stateOrgId,
      errors: false,
      setParentLoading: setParentLoadingMock,
      currentDirectParentRef: stateOrg.name,
    };
    const { result } = renderHook(useSelectParentOrg, { initialProps: hookProps });

    result.current.setPathIfNewParent(stateOrgId);
    await waitFor(() => expect(result.current.isError).toStrictEqual(true));
    await waitFor(() => expect(result.current.updatedPath).toStrictEqual(''));
  });
});

describe('Edit Organization', () => {
  it('should not show edit button for YouScience (ROOT) organization in details page', async () => {
    await activateRootAdmin();
    renderWithRouter(<Details organization={ROOT_ORGANIZATION} />);
    expect(
      screen.queryByRole('button', {
        name: /Edit/,
      }),
    ).toBeNull();
  });

  it('should only show edit button to Root (YS) admin on organization details page', async () => {
    await activateRootAdmin();
    renderWithRouter(<Details organization={TEST_TENANT} />);
    expect(
      screen.getByRole('button', {
        name: /Edit/,
      }),
    ).toBeInTheDocument();
  });

  it('should NOT show edit button to an org admin on organization details page', async () => {
    await activateOrgAdmin();
    renderWithRouter(<Details organization={TEST_TENANT} />);
    expect(
      screen.queryByRole('button', {
        name: /Edit/,
      }),
    ).not.toBeInTheDocument();
  });

  it('should not show edit button to non admin user on organization details page', async () => {
    await activateStaffUser();
    const { container } = renderWithRouter(<Details organization={TEST_TENANT} />);
    const editButton = screen.queryByRole('button', {
      name: /Edit/,
    });

    expect(container).toBeTruthy();
    expect(editButton).toBeNull();
  });

  it('should show disabled save button in details form page for non edited fields', async () => {
    await activateOrgAdmin();
    const { container } = renderWithRouter(<DetailsForm organization={NEW_TENANT as TenantDocument} isNew={false} />);
    const saveButton = screen.queryByRole('button', { name: /Save/ });

    expect(container).toBeTruthy();
    expect(saveButton).toBeDisabled();
  });

  it('should show YouScience (ROOT) as parent in parent org field if there is not any parent (other than YouScience root) exists', async () => {
    await activateRootAdmin();
    const { container } = renderWithRouter(<DetailsForm organization={TEST_TENANT} isNew={false} />);

    expect(container).toBeTruthy();
    expect(screen.getByPlaceholderText('Organization name')?.getAttribute('value')).toStrictEqual(
      TEST_TENANT.deepPath[0].name,
    );
  });
});

describe('Updating tenant path', async () => {
  const fetchTenantByIdSpy = vi.spyOn(userServiceModule, 'fetchTenantById');
  const fetchTenantByIdMock = vi.fn(orgSelectorFn);
  const setParentLoadingMock = vi.fn() as React.Dispatch<React.SetStateAction<boolean>>;

  beforeEach(async () => {
    await activateRootAdmin();
  });

  it('should return YS-Root as path for new org, if YS root selected as parent', async () => {
    const hookProps: SelectParentOrgHookProps = {
      currentOrgId: '',
      errors: false,
      setParentLoading: setParentLoadingMock,
      currentDirectParentRef: '',
    };
    const { result } = renderHook(useSelectParentOrg, { initialProps: hookProps });

    act(() => {
      result.current.setPathIfNewParent(ROOT_ORGANIZATION.tenantId);
    });

    expect(result.current.updatedPath).toStrictEqual(`,${ROOT_ORGANIZATION.tenantId},`);
    expect(result.current.isError).toStrictEqual(false);
  });

  it('should return valid path for new org, if State Org selected as parent', async () => {
    const hookProps: SelectParentOrgHookProps = {
      currentOrgId: '',
      errors: false,
      setParentLoading: setParentLoadingMock,
      currentDirectParentRef: '',
    };
    const { result } = renderHook(useSelectParentOrg, { initialProps: hookProps });

    act(() => {
      result.current.setPathIfNewParent(stateOrgId);
    });
    expect(result.current.isError).toStrictEqual(false);
    await waitFor(() => expect(fetchTenantByIdSpy).toHaveBeenCalled());
    const data = await fetchTenantByIdMock(stateOrgId);

    await waitFor(() => expect(data.path).toStrictEqual(stateOrg.path));
  });
  it('should return valid path for new org, if District Org selected as parent', async () => {
    const hookProps: SelectParentOrgHookProps = {
      currentOrgId: '',
      errors: false,
      setParentLoading: setParentLoadingMock,
      currentDirectParentRef: '',
    };
    const { result } = renderHook(useSelectParentOrg, { initialProps: hookProps });

    act(() => {
      result.current.setPathIfNewParent(districtOrgId);
    });
    expect(result.current.isError).toStrictEqual(false);
    await waitFor(() => expect(fetchTenantByIdSpy).toHaveBeenCalled());
    const data = await fetchTenantByIdMock(districtOrgId);

    await waitFor(() => expect(data.path).toStrictEqual(districtOrg.path));
  });

  it('should return a valid updated path for valid parent org and child org', async () => {
    const hookProps: SelectParentOrgHookProps = {
      currentOrgId: schoolId,
      errors: false,
      setParentLoading: setParentLoadingMock,
      currentDirectParentRef: districtOrg.name,
    };
    const updatedPath = `,${ROOT_ORGANIZATION.tenantId},${TEST_TENANT.tenantId},${TEST_TENANT_2.tenantId},`;
    const { result } = renderHook(useSelectParentOrg, { initialProps: hookProps });

    act(() => {
      result.current.setPathIfNewParent(TEST_TENANT_2.tenantId);
    });
    expect(result.current.isError).toStrictEqual(false);
    await waitFor(() => expect(fetchTenantByIdSpy).toHaveBeenCalled());
    const data = await fetchTenantByIdMock(TEST_TENANT_2.tenantId);

    await waitFor(() => expect(`${data.path}${TEST_TENANT_2.tenantId},`).toStrictEqual(updatedPath));
  });
  it('should able to make YS root as parent for existing org, which is having some different parent hierarchy', async () => {
    const hookProps: SelectParentOrgHookProps = {
      currentOrgId: schoolId,
      errors: false,
      setParentLoading: setParentLoadingMock,
      currentDirectParentRef: districtOrg.name,
    };
    const updatedPath = `,${ROOT_ORGANIZATION.tenantId},`;
    const { result } = renderHook(useSelectParentOrg, { initialProps: hookProps });

    act(() => {
      result.current.setPathIfNewParent(ROOT_ORGANIZATION.tenantId);
    });
    expect(result.current.isError).toStrictEqual(false);
    await waitFor(() => expect(result.current.updatedPath).toStrictEqual(updatedPath));
  });
  it('should be able to change grandparent org to parent org', async () => {
    const hookProps: SelectParentOrgHookProps = {
      currentOrgId: TEST_CHILD_TENANT.tenantId,
      errors: false,
      setParentLoading: setParentLoadingMock,
      currentDirectParentRef: TEST_TENANT_2.name,
    };
    const updatedPath = `,${ROOT_ORGANIZATION.tenantId},${TEST_TENANT.tenantId},`;
    const { result } = renderHook(useSelectParentOrg, { initialProps: hookProps });

    act(() => {
      result.current.setPathIfNewParent(TEST_TENANT.tenantId);
    });
    expect(result.current.isError).toStrictEqual(false);
    await waitFor(() => expect(fetchTenantByIdSpy).toHaveBeenCalled());
    const data = await fetchTenantByIdMock(TEST_TENANT.tenantId);

    await waitFor(() => expect(`${data.path}${TEST_TENANT.tenantId},`).toStrictEqual(updatedPath));
  });
});
