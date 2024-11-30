import { render, screen, userEvent } from '@utils/test-utils';
import { useOrgListStore } from '@stores/orgListStore';
import { TenantDocument } from '@youscience/user-service-common';
import { TEST_UTAH_BASED_ORG } from '@test/constants';
import { UserInvite } from './UserInvite';

vi.mock('react-router-dom', async () => {
  const reactRouter = await vi.importActual('react-router-dom');

  return {
    ...reactRouter,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
    useNavigation: vi.fn(),
  };
});

beforeEach(() => {
  useOrgListStore.setState({
    tenantId: '',
    orgList: [],
  });
});

const items: TenantDocument[] = [
  {
    tenantId: '01860f43-7b3b-7fa6-91e4-4',
    name: 'Demo High School',
    addresses: [
      {
        state: 'UT',
        postCode: '84003',
        country: 'USA',
      },
    ],
    classification: {
      type: 'district',
      nces: {
        name: '',
        ncesId: '67744',
        stateId: '',
      },
    },
    path: '01860f43-7b3b-7fa6-91e4-4,',
    deepPath: [
      {
        tenantId: '01860f43-7b3b-7fa6-91e4-4',
        name: 'Demo District',
      },
    ],
    tags: [],
  },
];

describe('User Invite Flow', () => {
  it('should display "User Details Form" with correct fields', () => {
    useOrgListStore.setState({
      tenantId: '01860f43-7b3b-7fa6-91e4-4',
      orgList: [...items],
    });
    render(<UserInvite />);

    expect(screen.getByText('Name:')).toBeTruthy();
    expect(screen.getByText('Preferred Name:')).toBeTruthy();
    expect(screen.getByText('Graduation year:')).toBeTruthy();
    expect(screen.getByText('Date of birth:')).toBeTruthy();
    expect(screen.getByText('Primary Email:')).toBeTruthy();
    expect(screen.getByText('Secondary Email:')).toBeTruthy();
    expect(screen.getByText('LinkedIn:')).toBeTruthy();
    expect(screen.getByText('Phone number 1:')).toBeTruthy();
    expect(screen.getByText('Phone number 2:')).toBeTruthy();
    expect(screen.getByText('Address 1:')).toBeTruthy();
    expect(screen.getByText('Address 2:')).toBeTruthy();
    expect(screen.getAllByText('City:')).toHaveLength(2);
    expect(screen.getAllByText('State:')).toHaveLength(2);
    expect(screen.getAllByText('Zip:')).toHaveLength(2);
    expect(screen.getByText('Race/ethnicity:')).toBeTruthy();
  });

  it('should show required errors when clicking "Continue" with empty fields', async () => {
    useOrgListStore.setState({
      tenantId: '01860f43-7b3b-7fa6-91e4-4',
      orgList: [...items],
    });
    render(<UserInvite />);
    const Continue = screen.getByText('Continue');

    await userEvent.click(Continue);

    expect(screen.getByText(/name is required/i)).toBeTruthy();
    expect(screen.getByText(/primary email is required/i)).toBeTruthy();
    expect(screen.queryByText(/date of birth is required/i)).toBeFalsy();
  });

  it('should show required errors when clicking "Continue" with empty fields for Utah only access', async () => {
    useOrgListStore.setState({
      tenantId: TEST_UTAH_BASED_ORG.tenantId,
      orgList: [TEST_UTAH_BASED_ORG],
    });
    render(<UserInvite />);
    const Continue = screen.getByText('Continue');

    await userEvent.click(Continue);

    expect(screen.getByText(/name is required/i)).toBeTruthy();
    expect(screen.getByText(/primary email is required/i)).toBeTruthy();
    expect(screen.getByText(/date of birth is required/i)).toBeTruthy();
  });

  it('should show validation errors when clicking "Continue" with inappropriate values', async () => {
    useOrgListStore.setState({
      tenantId: '01860f43-7b3b-7fa6-91e4-4',
      orgList: [...items],
    });
    render(<UserInvite />);

    const nameInput = screen.getByTestId('PERSONAL_INFO_FULL_NAME');
    const graduationYearInput = screen.getByTestId('PERSONAL_INFO_GRADUATION_YEAR');
    const primaryEmailInput = screen.getByTestId('PERSONAL_INFO_EMAIL_PRIMARY');
    const secondaryEmailInput = screen.getByTestId('PERSONAL_INFO_EMAIL_SECONDARY');
    const linkedInInput = screen.getByTestId('PERSONAL_INFO_LINKEDIN');

    await userEvent.type(nameInput, 'J');
    await userEvent.type(graduationYearInput, '100');
    await userEvent.type(primaryEmailInput, 'emailtett');
    await userEvent.type(secondaryEmailInput, 'secondaryemailtett');
    await userEvent.type(linkedInInput, 'myprofile');

    // expect inputs to have changed
    expect(nameInput).toHaveValue('J');
    expect(graduationYearInput).toHaveValue(100);
    expect(primaryEmailInput).toHaveValue('emailtett');
    expect(secondaryEmailInput).toHaveValue('secondaryemailtett');
    expect(linkedInInput).toHaveValue('myprofile');

    const continueButton = screen.getByText('Continue');

    await userEvent.click(continueButton);
    // expect inputs to display the following errors
    await screen.findByText(/name too short. minimum 2 characters/i);
    expect(screen.getByText(/year must be between 1900 and 2500/i));
    expect(screen.getByText(/invalid primary email address/i)).toBeTruthy();
    expect(screen.getByText(/invalid secondary email address/i)).toBeTruthy();
    expect(screen.getByText(/invalid linkedIn url/i)).toBeTruthy();
  });
});
