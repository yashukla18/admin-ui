import { AssociatedOrgSchema } from '@interfaces/associatedOrgs';
import { AccessDocument } from '@youscience/user-service-common';
import { TenantListResponse } from '@interfaces';
import { TEST_UTAH_BASED_ORG } from '@test/constants';

export const mockPropsWithAccess = {
  access: [
    {
      _id: 'ae89724er587' as unknown,
      status: 'active',
      user: {
        userId: 'gysu7a8ds',
        fullName: 'Test User 1',
        grants: ['*'],
      },
      tenant: {
        tenantId: '7sd8sadhg',
        name: 'Bingham High School',
        permission: {
          role: 'Learner',
        },
        private: {
          tags: [],
          data: {
            studentId: 'std123',
          },
        },
      },
    },
  ] as AccessDocument[],
  isStaff: false,
  userName: 'Test User1',
  emailAddress: 'testuser1@example.com',
  displayHeader: true,
};

export const mockPropsWithTenantAccess = {
  access: [
    {
      _id: process.env.VITE_ROOT_ORG_ID as unknown,
      status: 'active',
      user: {
        userId: 'gysu7a8ds',
        fullName: 'Test User 1',
        grants: ['*'],
      },
      tenant: {
        tenantId: process.env.VITE_ROOT_ORG_ID,
        name: 'YouScience (Root)',
        permission: {
          role: 'Admin',
        },
        private: {},
      },
    },
  ] as AccessDocument[],
  isStaff: false,
  userName: 'Test User1',
  emailAddress: 'testuser1@example.com',
  displayHeader: true,
};

export const mockPropsWithStaffAccess = {
  access: [
    {
      _id: 'sfgadf67' as unknown,
      status: 'pending',
      user: {
        userId: 'dfhjh765',
        fullName: 'Staff User',
        grants: ['*'],
      },
      tenant: {
        tenantId: '7sd8sadhg',
        name: 'A+ SECONDARY SCHOOL',
        permission: {
          role: 'Staff',
        },
        private: {
          tags: [],
          data: {
            studentId: 'grd34',
          },
        },
      },
    },
  ] as AccessDocument[],
  isStaff: true,
  userName: 'Staff User',
  emailAddress: 'staffuser@example.com',
  displayHeader: true,
};

export const mockPropsWithoutAccess = {
  access: [],
  isStaff: false,
  userName: 'Test User2',
  emailAddress: 'testuser2@example.com',
  displayHeader: true,
};

export const mockPropsWithoutEmailAddress = {
  access: [],
  isStaff: false,
  userName: 'Test User3',
  emailAddress: '',
  displayHeader: true,
};

export const mockOrgList: TenantListResponse = {
  items: [
    {
      tenantId: 'udsya87',
      name: 'Demo High School',
      addresses: [
        {
          state: 'UT',
          postCode: '84003',
          country: 'USA',
        },
      ],
      path: 'sd897sd',
      deepPath: [
        {
          tenantId: 'sdaiu987',
          name: 'Demo District',
        },
      ],
      tags: [],
    },
    {
      tenantId: 'sdd768sd',
      name: 'AL  Private Schools',
      addresses: [
        {
          state: 'UT',
          postCode: '84003',
          country: 'USA',
        },
      ],
      path: 'sd908dsd',
      deepPath: [
        {
          tenantId: 'cad98fdi',
          name: 'Demo',
        },
      ],
      tags: [],
    },
    {
      tenantId: 'fdia98a',
      name: 'A-TECH HIGH SCHOO',
      addresses: [
        {
          state: 'UT',
          postCode: '84003',
          country: 'USA',
        },
      ],
      path: 'asd987a',
      deepPath: [
        {
          tenantId: 'asd897',
          name: 'Demo',
        },
      ],
      tags: [],
    },
    {
      tenantId: 'fgye87eqr3',
      name: 'District High School',
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
      path: 'fgye87eqr3,',
      deepPath: [
        {
          tenantId: 'fgye87eqr3',
          name: 'Demo District',
        },
      ],
      tags: [],
    },
    {
      tenantId: 'skj98ds',
      name: 'GADOE Tenant',
      addresses: [
        {
          state: 'UT',
          postCode: '8789',
          country: 'USA',
        },
      ],
      classification: {
        type: 'publicHighSchool',
        nces: {
          name: '',
          ncesId: '',
          stateId: '',
        },
      },
      ssoSettings: {
        rosteringEnabled: true,
        provider: {
          type: 'GADOE',
          systemId: '111',
          schoolId: '222',
        },
      },
      path: 'skj98ds,',
      deepPath: [
        {
          tenantId: 'skj98ds',
          name: 'Demo GADOE',
        },
      ],
      tags: [],
    },
    TEST_UTAH_BASED_ORG,
  ],
  total: 4,
};

export const mockOrgListWithRootTenant: TenantListResponse = {
  items: [
    {
      tenantId: process.env.VITE_ROOT_ORG_ID!,
      name: 'YouScience (ROOT)',
      addresses: [
        {
          state: 'UT',
          postCode: '84003',
          country: 'USA',
        },
      ],
      path: '',
      deepPath: [],
      tags: [],
    },
  ],
  total: 1,
};

export const mockOrg: TenantListResponse = {
  items: [
    {
      tenantId: '7sd8sadhg',
      name: 'Bingham High School',
      addresses: [
        {
          state: 'UT',
          postCode: '84003',
          country: 'USA',
        },
      ],
      path: 'sd897sd',
      deepPath: [
        {
          tenantId: '7sd8sadhg',
          name: 'Bingham High School',
        },
      ],
      tags: [],
    },
  ],
  total: 1,
};

export const associatedOrgData: AssociatedOrgSchema[] = [
  {
    fullName: 'John Doe',
    tenantId: '',
    studentId: '',
    userId: 'user123',
    emailAddress: 'john.doe@example.com',
    role: 'Learner',
    emailInvite: false,
  },
  {
    fullName: 'Smith',
    tenantId: process.env.VITE_ROOT_ORG_ID!,
    userId: 'user456',
    emailAddress: 'smith@example.com',
    role: 'Proctor',
    emailInvite: true,
  },
  {
    fullName: 'Johnson',
    tenantId: 'fgfg52445',
    studentId: 'student789',
    userId: '',
    emailAddress: '',
    role: 'Admin',
    emailInvite: false,
  },
  {
    fullName: 'Bob',
    tenantId: '7sd8sadhg',
    studentId: 'student789',
    userId: 'user456',
    emailAddress: 'bob@example.com',
    role: 'Learner',
    emailInvite: false,
  },
  {
    fullName: 'Rob',
    tenantId: 'fgye87eqr3',
    studentId: 'student789',
    userId: 'user458',
    emailAddress: 'rob@example.com',
    role: 'Learner',
    emailInvite: false,
  },
  {
    fullName: 'GADOE user',
    tenantId: 'skj98ds',
    studentId: 'student988',
    userId: 'user097',
    emailAddress: 'gadoe@example.com',
    role: 'Learner',
    emailInvite: false,
  },
  {
    fullName: '',
    tenantId: TEST_UTAH_BASED_ORG.tenantId,
    userId: 'user1283',
    emailAddress: 'utahuser@example.com',
    role: 'Learner',
    emailInvite: false,
  },
];
