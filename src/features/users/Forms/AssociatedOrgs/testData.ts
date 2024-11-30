import { AccessDocument } from '@youscience/user-service-common';

export const rosteringEnabledOrg = {
  tenantId: '42454',
  name: 'ISP Classlink Tenant - 8991',
  classification: {
    type: 'publicHighSchool',
    nces: {
      name: 'test classlink',
      ncesId: '123',
      stateId: '123',
    },
  },
  path: ',8991,',
  tags: [],
  ssoSettings: {
    rosteringEnabled: true,
    provider: {
      type: 'ClassLink',
      districtId: '8991',
      schoolId: '2',
    },
  },
};

export const districtTypeOrg = {
  tenantId: '08472',
  name: 'New District Demo',
  classification: {
    type: 'district',
    nces: {
      name: '',
      ncesId: '809',
      stateId: '',
    },
  },
  path: ',5665,',
  tags: [],
};

export const mockPropsWithAccess = {
  access: [
    {
      _id: '098341' as unknown,
      user: {
        userId: '98742',
        fullName: 'Test Edit',
        grants: ['*'],
      },
      tenant: {
        tenantId: rosteringEnabledOrg.tenantId,
        name: rosteringEnabledOrg.name,
        permission: {
          role: 'Admin',
        },
        private: {
          tags: [],
          data: {
            studentId: 'std253',
          },
        },
      },
      startDate: '2023-08-03T22:11:24.252Z' as unknown,
      status: 'active',
    },
    {
      _id: '08484' as unknown,
      user: {
        userId: '98742',
        fullName: 'Test Edit',
        grants: ['*'],
      },
      tenant: {
        tenantId: districtTypeOrg.tenantId,
        name: districtTypeOrg.name,
        permission: {
          role: 'Staff',
        },
        private: {
          tags: [],
          data: {
            studentId: '',
          },
        },
      },
      status: 'pending',
      invitation: {
        email: 'aebldvuwh@10mail.org',
        expirationDate: '2026-11-17T13:37:50.783Z',
        invitationCode: '09348',
      },
    },
  ] as AccessDocument[],
};

export const mockRoleUpdates = {
  rosteringLearnerUpdate: {
    [String(mockPropsWithAccess.access[0]._id)]: {
      role: 'Learner',
    },
  },
  rosteringStaffUpdate: {
    [String(mockPropsWithAccess.access[0]._id)]: {
      role: 'Staff',
    },
  },
  disrictTypeLearnerUpdate: {
    [String(mockPropsWithAccess.access[1]._id)]: {
      role: 'Learner',
    },
  },
  disrictTypeProctorUpdate: {
    [String(mockPropsWithAccess.access[1]._id)]: {
      role: 'Proctor',
    },
  },
  districtTypeAdminUpdate: {
    [String(mockPropsWithAccess.access[1]._id)]: {
      role: 'Admin',
    },
  },
};

export const mockStudentIdUpdates = {
  [String(mockPropsWithAccess.access[0]._id)]: {
    studentId: '',
  },
};
