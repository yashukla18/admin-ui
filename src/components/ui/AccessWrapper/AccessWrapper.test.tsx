import { useAuthStore } from '@stores/authStore';
import { render, screen } from '@utils/test-utils';
import { TEST_ADMIN_USER, TEST_LEARNER_USER, TEST_ROOT_ADMIN_USER } from '@test/constants';
import { AccessWrapper } from './AccessWrapper';

describe('AccessWrapper', () => {
  describe('Default functionality', () => {
    it('should allow Learner role to view children if current access is Learner', () => {
      useAuthStore.setState({
        authSession: {
          currentAccess: TEST_LEARNER_USER.currentAccess,
          isAuthenticated: true,
          isImpersonated: false,
          userData: TEST_LEARNER_USER.userData,
          userType: 'Learner',
        },
      });

      render(<AccessWrapper allowedRoles={['Learner']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should allow Staff role to view children if current access is Staff', () => {
      useAuthStore.setState({
        authSession: {
          currentAccess: { ...TEST_LEARNER_USER.currentAccess, role: 'Staff' },
          isAuthenticated: true,
          isImpersonated: false,
          userData: TEST_LEARNER_USER.userData,
          userType: 'Staff',
        },
      });

      render(<AccessWrapper allowedRoles={['Staff']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should allow Proctor role to view children if current access is Proctor', () => {
      useAuthStore.setState({
        authSession: {
          currentAccess: { ...TEST_LEARNER_USER.currentAccess, role: 'Proctor' },
          isAuthenticated: true,
          userData: TEST_LEARNER_USER.userData,
          userType: 'Proctor',
          isImpersonated: false,
        },
      });

      render(<AccessWrapper allowedRoles={['Proctor']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should allow Reviewer role to view children if current access is Reviewer', () => {
      useAuthStore.setState({
        authSession: {
          currentAccess: { ...TEST_LEARNER_USER.currentAccess, role: 'Reviewer' },
          isAuthenticated: true,
          isImpersonated: false,
          userData: TEST_LEARNER_USER.userData,
          userType: 'Reviewer',
        },
      });

      render(<AccessWrapper allowedRoles={['Reviewer']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should allow Author role to view children if current access is Author', () => {
      useAuthStore.setState({
        authSession: {
          currentAccess: { ...TEST_LEARNER_USER.currentAccess, role: 'Author' },
          isAuthenticated: true,
          isImpersonated: false,
          userData: TEST_LEARNER_USER.userData,
          userType: 'Author',
        },
      });

      render(<AccessWrapper allowedRoles={['Author']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });
  });

  describe('Learner role', () => {
    beforeEach(() => {
      useAuthStore.setState({
        authSession: {
          currentAccess: TEST_LEARNER_USER.currentAccess,
          isAuthenticated: true,
          isImpersonated: false,
          userData: TEST_LEARNER_USER.userData,
          userType: 'Learner',
        },
      });
    });

    it('should allow Learner role to view Learner role', () => {
      render(<AccessWrapper allowedRoles={['Learner']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should NOT allow Learner role to view Admin role', () => {
      render(<AccessWrapper allowedRoles={['Admin']}>This is a child</AccessWrapper>);

      expect(screen.queryByText(/This is a child/i)).toBeNull();
    });

    it('should NOT allow Learner role to view Staff role', () => {
      render(<AccessWrapper allowedRoles={['Staff']}>This is a child</AccessWrapper>);

      expect(screen.queryByText(/This is a child/i)).toBeNull();
    });

    it('should NOT allow Learner role to view Author role', () => {
      render(<AccessWrapper allowedRoles={['Author']}>This is a child</AccessWrapper>);

      expect(screen.queryByText(/This is a child/i)).toBeNull();
    });

    it('should NOT allow Learner role to view Reviewer role', () => {
      render(<AccessWrapper allowedRoles={['Reviewer']}>This is a child</AccessWrapper>);

      expect(screen.queryByText(/This is a child/i)).toBeNull();
    });

    it('should NOT allow Learner role to view Proctor role', () => {
      render(<AccessWrapper allowedRoles={['Proctor']}>This is a child</AccessWrapper>);

      expect(screen.queryByText(/This is a child/i)).toBeNull();
    });

    it('should NOT allow Learner role to view children if no role is provided', () => {
      render(<AccessWrapper allowedRoles={[]}>This is a child</AccessWrapper>);

      expect(screen.queryByText(/This is a child/i)).toBeNull();
    });
  });

  describe('Admin role', () => {
    beforeEach(() => {
      useAuthStore.setState({
        authSession: {
          currentAccess: TEST_ADMIN_USER.currentAccess,
          isAuthenticated: true,
          isImpersonated: false,
          userData: TEST_ADMIN_USER.userData,
          userType: 'Admin',
        },
      });
    });

    it('should allow Admin role to view Learner role', () => {
      render(<AccessWrapper allowedRoles={['Learner']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should allow Admin role to view Proctor role', () => {
      render(<AccessWrapper allowedRoles={['Proctor']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should allow Admin role to view Author role', () => {
      render(<AccessWrapper allowedRoles={['Author']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should allow Admin role to view Reviewer role', () => {
      render(<AccessWrapper allowedRoles={['Reviewer']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should allow Admin role to view Staff role', () => {
      render(<AccessWrapper allowedRoles={['Staff']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should render the children if user role and allowed role match', () => {
      render(<AccessWrapper allowedRoles={['Admin']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should NOT render the children if user role and allowed role match but is not a root admin', () => {
      render(
        <AccessWrapper allowedRoles={['Admin']} restrictOrg>
          This is a child
        </AccessWrapper>,
      );

      expect(screen.queryByText(/This is a child/i)).toBeNull();
    });

    it('should not render if isAuthenticated is false', () => {
      useAuthStore.setState({
        authSession: {
          isAuthenticated: false,
        },
      });

      render(<AccessWrapper allowedRoles={['Admin']}>This is a child</AccessWrapper>);

      expect(screen.queryByText(/This is a child/i)).toBeNull();
    });

    it('should not render the children if user role is Admin but is not an org admin', () => {
      useAuthStore.setState({
        authSession: {
          currentAccess: TEST_ADMIN_USER.currentAccess,
          isAuthenticated: true,
          isImpersonated: false,
          userData: TEST_ADMIN_USER.userData,
          userType: 'Admin',
        },
      });
      render(
        <AccessWrapper allowedRoles={['Admin']} restrictOrg>
          This is a child
        </AccessWrapper>,
      );

      expect(screen.queryByText(/This is a child/i)).toBeNull();
    });
  });

  describe('Root admin role', () => {
    beforeEach(() => {
      useAuthStore.setState({
        authSession: {
          currentAccess: TEST_ROOT_ADMIN_USER.currentAccess,
          isAuthenticated: true,
          userData: TEST_ROOT_ADMIN_USER.userData,
          userType: 'Admin',
          isImpersonated: false,
        },
      });
    });

    it('should allow Admin role to view if no role is provided', () => {
      render(<AccessWrapper allowedRoles={['']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should allow Admin role to view Learner role', () => {
      render(<AccessWrapper allowedRoles={['Learner']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should allow Admin role to view Proctor role', () => {
      render(<AccessWrapper allowedRoles={['Proctor']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should allow Admin role to view Proctor role', () => {
      render(<AccessWrapper allowedRoles={['Author']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should allow Admin role to view Proctor role', () => {
      render(<AccessWrapper allowedRoles={['Reviewer']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should allow Admin role to view Proctor role', () => {
      render(<AccessWrapper allowedRoles={['Staff']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should render the children if user role and allowed role match', () => {
      render(<AccessWrapper allowedRoles={['Admin']}>This is a child</AccessWrapper>);

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should render the children if user role and allowed role match if the restrict org matches', () => {
      render(
        <AccessWrapper allowedRoles={['Admin']} restrictOrg>
          This is a child
        </AccessWrapper>,
      );

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should render the children if user role and allowed role do NOT match but restrictOrg is true', () => {
      render(
        <AccessWrapper allowedRoles={['Learner']} restrictOrg>
          This is a child
        </AccessWrapper>,
      );

      expect(screen.getByText(/This is a child/i)).toBeTruthy();
    });

    it('should not render if isAuthenticated is false', () => {
      useAuthStore.setState({
        authSession: {
          isAuthenticated: false,
        },
      });

      render(<AccessWrapper allowedRoles={['Admin']}>This is a child</AccessWrapper>);

      expect(screen.queryByText(/This is a child/i)).toBeNull();
    });

    it('should not render the children if user role is Admin but is not an org admin', () => {
      useAuthStore.setState({
        authSession: {
          currentAccess: TEST_ADMIN_USER.currentAccess,
          isAuthenticated: true,
          isImpersonated: false,
          userData: TEST_ADMIN_USER.userData,
          userType: 'Admin',
        },
      });
      render(
        <AccessWrapper allowedRoles={['Admin']} restrictOrg>
          This is a child
        </AccessWrapper>,
      );

      expect(screen.queryByText(/This is a child/i)).toBeNull();
    });
  });
});
