// eslint-disable-next-line import/no-extraneous-dependencies
import { waitFor } from '@testing-library/react';
import { useAuthStore } from '@stores/authStore';
import { TEST_ADMIN_USER, TEST_ROOT_ADMIN_USER, TEST_STAFF_USER } from '@test/constants';

export const activateRootAdmin = async () => {
  await waitFor(() =>
    useAuthStore.setState({
      authSession: {
        isAuthenticated: true,
        currentAccess: TEST_ROOT_ADMIN_USER.currentAccess,
        userData: TEST_ROOT_ADMIN_USER.userData,
        userType: 'Admin',
        isImpersonated: false,
      },
    }),
  );
};

export const activateOrgAdmin = async () => {
  await waitFor(() =>
    useAuthStore.setState({
      authSession: {
        isAuthenticated: true,
        currentAccess: TEST_ADMIN_USER.currentAccess,
        userData: TEST_ADMIN_USER.userData,
        userType: 'Admin',
        isImpersonated: false,
      },
    }),
  );
};

export const activateStaffUser = async () => {
  await waitFor(() =>
    useAuthStore.setState({
      authSession: {
        isAuthenticated: true,
        currentAccess: TEST_STAFF_USER.currentAccess,
        userData: TEST_STAFF_USER.userData,
        userType: 'Staff',
        isImpersonated: false,
      },
    }),
  );
};
