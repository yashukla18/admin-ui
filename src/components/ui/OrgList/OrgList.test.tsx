/* eslint-disable max-len */
import { useAuthStore } from '@stores/authStore';
import { useOrgListStore } from '@stores/orgListStore';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { act, render, screen, waitFor } from '@utils/test-utils';
import { OrgList } from './OrgList';
import * as getOrgByIdModule from './getOrgById';

describe('OrgList', () => {
  afterEach(async () => {
    await act(async () => {
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
    });
    vi.clearAllMocks();
  });

  vi.mock('react-router-dom', async () => {
    const reactRouter = await vi.importActual('react-router-dom');

    return {
      ...reactRouter,
    };
  });

  const getOrgByIdModuleMock = vi.spyOn(getOrgByIdModule, 'default').mockReturnValue(
    new Promise((resolve) => {
      resolve({
        tenantId: '1234',
        name: '21st Century Charter Sch of Gary',
        addresses: [],
        path: '1234,',
        deepPath: [],
        tags: [],
      });
    }),
  );

  it('should render the OrgList without params and not be disabled', () => {
    render(
      <Router initialEntries={['/users/bulk-invite']}>
        <Routes>
          <Route path='/users/bulk-invite' element={<OrgList />} />
        </Routes>
      </Router>,
    );

    expect(getOrgByIdModuleMock).not.toHaveBeenCalled();
    const input = screen.getByPlaceholderText(/Organization Name, NCES ID, or IPEDS ID/i);

    expect(input).not.toBeDisabled();
  });

  it('should render the OrgList with params with input disabled', async () => {
    expect(getOrgByIdModuleMock).not.toHaveBeenCalled();

    render(
      <Router initialEntries={['/organizations/bulk-invite/1234']}>
        <Routes>
          <Route path='/organizations/bulk-invite/:id' element={<OrgList />} />
        </Routes>
      </Router>,
    );
    const input = screen.getByPlaceholderText(/Organization Name, NCES ID, or IPEDS ID/i);

    expect(input).toHaveValue('');

    await waitFor(() => expect(getOrgByIdModuleMock).toHaveBeenCalled());
    await waitFor(() => expect(input).toHaveValue('21st Century Charter Sch of Gary'));
    expect(input).toBeDisabled();
  });

  it('should render the OrgList AutoComplete textfield enabled with params in org edit page ', async () => {
    render(
      <Router initialEntries={['/organizations/edit/1234']}>
        <Routes>
          <Route path='/organizations/edit/:id' element={<OrgList />} />
        </Routes>
      </Router>,
    );

    const input = screen.getByPlaceholderText(/Organization Name, NCES ID, or IPEDS ID/i);

    expect(input).toHaveValue('');
    await waitFor(() => expect(getOrgByIdModuleMock).not.toHaveBeenCalled());
    expect(input).toHaveValue('');
    expect(input).not.toBeDisabled();
  });

  it('should render the OrgList in add organization page and enabled ', async () => {
    render(
      <Router initialEntries={['/organizations/add-organization']}>
        <Routes>
          <Route path='/organizations/add-organization' element={<OrgList />} />
        </Routes>
      </Router>,
    );

    const input = screen.getByPlaceholderText(/Organization Name, NCES ID, or IPEDS ID/i);

    expect(input).toHaveValue('');
    await waitFor(() => expect(getOrgByIdModuleMock).not.toHaveBeenCalled());
    expect(input).toHaveValue('');
    expect(input).not.toBeDisabled();
  });
});
