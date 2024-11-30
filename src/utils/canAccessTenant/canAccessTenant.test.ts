import { useAuthStore } from '@stores/authStore';
import { activateOrgAdmin, activateRootAdmin, activateStaffUser } from '@test/utils/activateUserByRoles';
import { act } from '@testing-library/react';
import { AccessDocument } from '@youscience/user-service-common';
import { canAccessTenant } from './canAccessTenant';

describe('canAccessTenant', () => {
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
    });
  });

  it('should return true if user access a rootAdmin & access is a rootAdmin', async () => {
    await activateRootAdmin();

    const result = canAccessTenant({
      _id: '777833',
      user: {
        userId: '33',
        fullName: 'Root Admin User',
        grants: ['*'],
      },
      tenant: {
        tenantId: process.env.VITE_ROOT_ORG_ID,
        name: 'Root Admin',
        permission: {
          role: 'Admin',
        },
        private: {} as unknown,
      },
    } as unknown as AccessDocument);

    expect(result).toBe(true);
  });

  it('should return true if user access is a rootAdmin & access is an admin', async () => {
    await activateRootAdmin();

    const result = canAccessTenant({
      _id: '777833',
      user: {
        userId: '4433',
        fullName: 'District Admin User',
        grants: ['*'],
      },
      tenant: {
        tenantId: '777888',
        name: 'Demo Admin District',
        permission: {
          role: 'Admin',
        },
        private: {} as unknown,
      },
    } as unknown as AccessDocument);

    expect(result).toBe(true);
  });

  it('should return true if user access is an orgAdmin & access is an admin', async () => {
    await activateOrgAdmin();

    const result = canAccessTenant({
      _id: '777833',
      user: {
        userId: '4433',
        fullName: 'District Admin User',
        grants: ['*'],
      },
      tenant: {
        tenantId: '777888',
        name: 'Demo Admin District',
        permission: {
          role: 'Admin',
        },
        private: {} as unknown,
      },
    } as unknown as AccessDocument);

    expect(result).toBe(true);
  });

  it('should return false if user access is an orgAdmin & access is a rootAdmin', async () => {
    await activateOrgAdmin();

    const result = canAccessTenant({
      _id: '7778',
      user: {
        userId: '93',
        fullName: 'Root Admin User',
        grants: ['*'],
      },
      tenant: {
        tenantId: process.env.VITE_ROOT_ORG_ID,
        name: 'Root Admin',
        permission: {
          role: 'Admin',
        },
        private: {} as unknown,
      },
    } as unknown as AccessDocument);

    expect(result).toBe(false);
  });

  it('should return true if user access is an orgAdmin & access is Staff', async () => {
    await activateOrgAdmin();

    const result = canAccessTenant({
      _id: '2222',
      user: {
        userId: '664',
        fullName: 'Staff User',
        grants: ['*'],
      },
      tenant: {
        tenantId: '998444',
        name: 'Staff Access',
        permission: {
          role: 'Staff',
        },
        private: {} as unknown,
      },
    } as unknown as AccessDocument);

    expect(result).toBe(true);
  });

  it('should return true if user access is an orgAdmin & access is Author', async () => {
    await activateOrgAdmin();

    const result = canAccessTenant({
      _id: '9123',
      user: {
        userId: '911',
        fullName: 'Author User',
        grants: ['*'],
      },
      tenant: {
        tenantId: '1233',
        name: 'Author Access',
        permission: {
          role: 'Author',
        },
        private: {} as unknown,
      },
    } as unknown as AccessDocument);

    expect(result).toBe(true);
  });

  it('should return false if user access is Staff & access is a rootAdmin', async () => {
    await activateStaffUser();

    const result = canAccessTenant({
      _id: '41154',
      user: {
        userId: '411',
        fullName: 'Root Admin User',
        grants: ['*'],
      },
      tenant: {
        tenantId: process.env.VITE_ROOT_ORG_ID,
        name: 'Root Admin',
        permission: {
          role: 'Admin',
        },
        private: {} as unknown,
      },
    } as unknown as AccessDocument);

    expect(result).toBe(false);
  });

  it('should return false if user access is Staff & access is a orgAdmin', async () => {
    await activateStaffUser();

    const result = canAccessTenant({
      _id: '777833',
      user: {
        userId: '4433',
        fullName: 'District Admin User',
        grants: ['*'],
      },
      tenant: {
        tenantId: '777888',
        name: 'Demo Admin District',
        permission: {
          role: 'Admin',
        },
        private: {} as unknown,
      },
    } as unknown as AccessDocument);

    expect(result).toBe(false);
  });

  it('should return false if user access is Staff & access is a Staff', async () => {
    await activateStaffUser();

    const result = canAccessTenant({
      _id: '5555',
      user: {
        userId: '4433',
        fullName: 'Staff Test User',
        grants: ['*'],
      },
      tenant: {
        tenantId: '5556',
        name: 'Staff District',
        permission: {
          role: 'Staff',
        },
        private: {} as unknown,
      },
    } as unknown as AccessDocument);

    expect(result).toBe(false);
  });

  it('should return true if user access is Staff & access is a Proctor', async () => {
    await activateStaffUser();

    const result = canAccessTenant({
      _id: '3322',
      user: {
        userId: '6432',
        fullName: 'Proctor Test User',
        grants: ['*'],
      },
      tenant: {
        tenantId: '5556',
        name: 'Proctor District',
        permission: {
          role: 'Proctor',
        },
        private: {} as unknown,
      },
    } as unknown as AccessDocument);

    expect(result).toBe(true);
  });

  it('should return true if user access is Staff & access is a Author', async () => {
    await activateStaffUser();

    const result = canAccessTenant({
      _id: '3322',
      user: {
        userId: '6432',
        fullName: 'Author Test User',
        grants: ['*'],
      },
      tenant: {
        tenantId: '5556',
        name: 'Author District',
        permission: {
          role: 'Author',
        },
        private: {} as unknown,
      },
    } as unknown as AccessDocument);

    expect(result).toBe(true);
  });

  it('should return true if user access is Staff & access is a Learner', async () => {
    await activateStaffUser();

    const result = canAccessTenant({
      _id: '3322',
      user: {
        userId: '6432',
        fullName: 'Learner Test User',
        grants: ['*'],
      },
      tenant: {
        tenantId: '5556',
        name: 'Learner District',
        permission: {
          role: 'Learner',
        },
        private: {} as unknown,
      },
    } as unknown as AccessDocument);

    expect(result).toBe(true);
  });
});
