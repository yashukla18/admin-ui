import { render } from '@utils/test-utils';
import { TenantDocument } from '@youscience/user-service-common';
import { screen } from '@testing-library/react';
import * as reactRouterModule from 'react-router-dom';
import { Details } from './Details';

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
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    Link: vi.fn((child) => <a {...child} />),
    useNavigation: vi.fn(),
  };
});

describe('Organization Details', () => {
  beforeEach(() => {
    vi.mock('useNavigate', () => vi.fn());
    vi.spyOn(reactRouterModule, 'useParams').mockReturnValue({ id: '123' });
  });

  it('should display the organization details', () => {
    render(<Details organization={details} />);
    // Name
    expect(screen.getByText(/Name/i));
    expect(screen.getByText(/RedMountainTec Charter/i));
    // Type
    expect(screen.getByText(/Type/i));
    expect(screen.getByText(/Charter School/i));
    // State
    expect(screen.getByText(/State/i));
    expect(screen.getByText('UT'));
    // Parent Organization
    expect(screen.getByText(/parent tenants/i));
    expect(screen.getByText('RedMountainTec'));
  });
});
