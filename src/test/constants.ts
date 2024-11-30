import { CurrentAccess } from '@interfaces/user';
import {
  AccessDocument,
  MeWithAccessRecordsApiResponse,
  SsoSettings,
  TenantDocument,
  UserDocument,
  UserDocumentWithAccess,
} from '@youscience/user-service-common';

export const ROOT = {
  id: import.meta.env.VITE_ROOT_ORG_ID.toString(),
  name: 'YouScience (ROOT)',
};

export const USBE = {
  id: import.meta.env.VITE_UTAH_ORG_ID.toString(),
  name: 'Utah State Board of Education',
};

export const ROOT_ORGANIZATION = {
  tenantId: ROOT.id,
  name: ROOT.name,
  path: '',
  deepPath: [],
  tags: [],
  createdBy: ROOT.id,
  creationDate: new Date(),
  modifiedBy: ROOT.id,
  modifiedDate: new Date(),
  version: 1,
} as TenantDocument;

export const UTAH_ORGANIZATION = {
  tenantId: USBE.id,
  name: USBE.name,
  path: '',
  deepPath: [],
  tags: [],
  createdBy: ROOT.id,
  creationDate: new Date(),
  modifiedBy: ROOT.id,
  modifiedDate: new Date(),
  version: 1,
} as TenantDocument;

export const TEST_ADMIN_USER = {
  currentAccess: {
    accessDocumentId: '78844',
    constraintTags: ['*'],
    role: 'Admin',
    tenantId: '777888',
    tenantName: 'Test Admin',
    userId: '4433',
  } as CurrentAccess,

  impersonatedByRootAdmin: {
    userId: '43452',
    fullName: ROOT.name,
    access: [
      {
        _id: '849038',
        tenant: {
          tenantId: ROOT.id,
          permission: {
            role: 'Admin',
            constraintTags: ['Councilor A-J'],
          },
        },
      },
    ] as unknown as AccessDocument[],
  } as MeWithAccessRecordsApiResponse['impersonatedBy'],

  impersonatedByAdmin: {
    userId: '43452',
    fullName: 'District Admin',
    access: [
      {
        _id: '849038',
        tenant: {
          tenantId: '86786',
          permission: {
            role: 'Admin',
            constraintTags: ['Councilor A-J'],
          },
        },
      },
    ] as unknown as AccessDocument[],
  } as MeWithAccessRecordsApiResponse['impersonatedBy'],

  userData: {
    userId: '4433',
    fullName: 'District Admin User',
    profile: {
      emails: [
        {
          address: 'new_yash_org@youscience.com',
          isPrimary: false,
          isVerified: false,
          type: 'personal',
        },
      ],
      phones: [],
      addresses: [],
    },
    identities: [
      {
        idpId: '18997',
        provider: 'cognito',
        email: 'new_yash_org@youscience.com',
      },
    ],
    access: [
      {
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
        },
      },
    ] as unknown as AccessDocument[],
  } as UserDocumentWithAccess,
};

export const TEST_ROOT_ADMIN_USER = {
  currentAccess: {
    accessDocumentId: '5555',
    constraintTags: ['*'],
    role: 'Admin',
    tenantId: import.meta.env.VITE_ROOT_ORG_ID,
    tenantName: 'YouScience (ROOT)',
    userId: '1',
  } as CurrentAccess,

  userData: {
    userId: '1',
    fullName: 'Root Admin User',
    profile: {
      emails: [
        {
          address: 'rootAdmin@youscience.com',
          isPrimary: false,
          isVerified: false,
          type: 'personal',
        },
      ],
      phones: [],
      addresses: [],
    },
    identities: [
      {
        idpId: '18997',
        provider: 'cognito',
        email: 'new_yash_org@youscience.com',
      },
    ],
    access: [
      {
        _id: '5555',
        user: {
          userId: '1',
          fullName: 'Root Admin User',
          grants: ['*'],
        },
        tenant: {
          tenantId: '11111',
          name: 'YouScience (ROOT)',
          permission: {
            role: 'Admin',
          },
        },
        startDate: '2023-08-13T20:36:19.504Z',
      },
    ] as unknown as AccessDocument[],
  } as UserDocumentWithAccess,
};

export const TEST_LEARNER_USER = {
  currentAccess: {
    accessDocumentId: '5543321',
    constraintTags: ['*'],
    role: 'Learner',
    tenantId: '23121',
    tenantName: 'Test',
    userId: '222',
  } as CurrentAccess,

  userData: {
    userId: '222',
    fullName: 'District Learner User',
    profile: {
      emails: [
        {
          address: 'new_yash_org@youscience.com',
          isPrimary: false,
          isVerified: false,
          type: 'personal',
        },
      ],
      phones: [],
      addresses: [],
    },
    identities: [
      {
        idpId: '35b7fc4b-e467-42ac',
        provider: 'cognito',
        email: 'new_yash_org@youscience.com',
        name: 'YouScience',
      },
    ],
    access: [
      {
        _id: '5543321' as unknown,
        user: {
          userId: '222',
          fullName: 'District Learner User',
          grants: ['*'],
        },
        tenant: {
          tenantId: '23121',
          name: 'Demo District',
          permission: {
            role: 'Learner',
          },
        },
      },
    ] as AccessDocument[],
  } as UserDocumentWithAccess,
};

export const TEST_PROCTOR_USER = {
  currentAccess: {
    accessDocumentId: '10993',
    constraintTags: ['*'],
    role: 'Proctor',
    tenantId: '833002',
    tenantName: 'Example examiner',
    userId: '0093',
  } as CurrentAccess,

  userData: {
    userId: '0093',
    fullName: 'District Examiner',
    profile: {
      emails: [
        {
          address: 'my_email@youscience.com',
          isPrimary: false,
          isVerified: false,
          type: 'personal',
        },
      ],
      phones: [],
      addresses: [],
    },
    identities: [
      {
        idpId: '35b7fc4b-e467-42ac',
        provider: 'cognito',
        email: 'my_email@youscience.com',
        name: 'YouScience',
      },
    ],
    access: [
      {
        _id: '10993' as unknown,
        user: { userId: '5555', fullName: 'Jane Doe', grants: ['*'] },
        tenant: {
          tenantId: '833002',
          name: 'Magna School District',
          permission: { role: 'Proctor' },
        },
      },
    ] as AccessDocument[],
  } as UserDocumentWithAccess,
};

export const learnerGetmeMockResponse = {
  userId: '222',
  fullName: 'District Learner User',
  profile: {
    emails: [
      {
        address: 'new_yash_org@youscience.com',
        isPrimary: false,
        isVerified: false,
        type: 'personal',
      },
    ],
    phones: [],
    addresses: [],
  },
  identities: [
    {
      idpId: '3',
      provider: 'cognito',
      email: 'new_yash_org@youscience.com',
    },
  ],
  access: [
    {
      _id: '5543321',
      user: {
        userId: '222',
        fullName: 'District Learner User',
        grants: ['*'],
      },
      tenant: {
        tenantId: '23121',
        name: 'Demo District',
        permission: {
          role: 'Learner',
        },
      },
      startDate: '2023-08-13T20:36:19.504Z',
    },
  ],
};

export const rootAdminGetmeMockResponse = {
  userId: '1',
  fullName: 'Root Admin User',
  profile: {
    emails: [
      {
        address: 'rootAdmin@youscience.com',
        isPrimary: false,
        isVerified: false,
        type: 'personal',
      },
    ],
    phones: [],
    addresses: [],
  },
  identities: [
    {
      idpId: '18997',
      provider: 'cognito',
      email: 'new_yash_org@youscience.com',
    },
  ],
  access: [
    {
      _id: '5555',
      user: {
        userId: '1',
        fullName: 'Root Admin User',
        grants: ['*'],
      },
      tenant: {
        tenantId: '11111',
        name: 'YouScience (ROOT)',
        permission: {
          role: 'Admin',
        },
      },
      startDate: '2023-08-13T20:36:19.504Z',
    },
  ],
};

export const adminGetMeMockResponse = {
  userId: '4433',
  fullName: 'District Admin User',
  profile: {
    emails: [
      {
        address: 'new_yash_org@youscience.com',
        isPrimary: false,
        isVerified: false,
        type: 'personal',
      },
    ],
    phones: [],
    addresses: [],
  },
  identities: [
    {
      idpId: '18997',
      provider: 'cognito',
      email: 'new_yash_org@youscience.com',
    },
  ],
  access: [
    {
      _id: '777833',
      user: {
        userId: '4433',
        fullName: 'District Admin User',
        grants: ['*'],
      },
      tenant: {
        tenantId: '777888',
        name: 'Demo District',
        permission: {
          role: 'Admin',
        },
      },
      startDate: '2023-08-13T20:36:19.504Z',
    },
  ],
};

export const staffGetmeMockResponse = {
  userId: '123',
  fullName: 'District Staff User',
  profile: {
    emails: [
      {
        address: 'new_yash_org@youscience.com',
        isPrimary: false,
        isVerified: false,
        type: 'personal',
      },
    ],
    phones: [],
    addresses: [],
  },
  identities: [
    {
      idpId: '18007',
      provider: 'cognito',
      email: 'new_yash_org@youscience.com',
    },
  ],
  access: [
    {
      _id: '64d93ec',
      user: {
        userId: '123',
        fullName: 'District Staff User',
        grants: ['*'],
      },
      tenant: {
        tenantId: '0187b5',
        name: 'Demo District',
        permission: {
          role: 'Staff',
        },
      },
      startDate: '2023-08-13T20:36:19.504Z',
    },
  ],
};

export const TEST_TENANT = {
  _id: 'abcdefghijklmnopqrstuvwxyz1234567890',
  tenantId: 'abcdefghijklmnopqrstuvwxyz1234567890',
  name: 'Demo Admin District',
  classification: {
    type: 'district',
    nces: {
      name: 'ut',
      ncesId: '49',
      stateId: 'ut',
    },
  },
  addresses: [
    {
      lines: ['250 E. 500 S.'],
      city: 'Salt Lake City',
      state: 'UT',
      postCode: '84098',
      country: 'USA',
    },
  ],
  path: `,${ROOT.id},`,
  deepPath: [{ tenantId: ROOT.id, name: ROOT.name }],
  ssoSettings: { provider: { type: '' } } as unknown as SsoSettings,
  tags: [],
  createdBy: ROOT.id,
  creationDate: new Date(),
  modifiedBy: ROOT.id,
  modifiedDate: new Date(),
  version: 1,
} as TenantDocument;

export const TEST_STAFF_USER = {
  currentAccess: {
    accessDocumentId: '78844',
    constraintTags: ['*'],
    role: 'Staff',
    tenantId: '777888',
    tenantName: 'Demo Admin District',
    userId: '4433',
  } as CurrentAccess,

  userData: {
    userId: '4433',
    fullName: 'District Staff User',
    profile: {
      emails: [
        {
          address: 'new_yash_org@youscience.com',
          isPrimary: false,
          isVerified: false,
          type: 'personal',
        },
      ],
      phones: [],
      addresses: [],
    },
    identities: [
      {
        idpId: '18997',
        provider: 'cognito',
        email: 'new_yash_org@youscience.com',
      },
    ],
    access: [
      {
        _id: '777833',
        user: {
          userId: '4433',
          fullName: 'District Staff User',
          grants: ['*'],
        },
        tenant: {
          tenantId: '777888',
          name: 'Demo Admin District',
          permission: {
            role: 'Staff',
          },
        },
      },
    ] as unknown as AccessDocument[],
  } as UserDocumentWithAccess,
};

export const TEST_USER = {
  userId: 'xyz23e42342342342342',
  profile: {
    dateOfBirth: undefined,
    gender: 'male',
    emails: [
      {
        address: 'xyz@gmail.com',
        isPrimary: true,
        isVerified: true,
        type: 'school',
      },
    ],
    phones: [],
    addresses: [],
    ethnicity: [],
    graduationYear: undefined,
    linkedIn: undefined,
  },
  displayName: 'Yash Shukla',
  fullName: 'Yash Kumar Shukla',
} as unknown as UserDocument;

export const TEST_USER_WITHOUT_PROFILE = {
  userId: 'xyz23e42342342342342',
  displayName: 'Yash Shukla',
  fullName: 'Yash Kumar Shukla',
} as unknown as UserDocument;

export const TEST_TENANT_2 = {
  _id: '0987654321zyxwvutsrqponmlkjihgfedcba',
  tenantId: '0987654321zyxwvutsrqponmlkjihgfedcba',
  name: 'Yash School for test',
  classification: {
    type: 'district',
    nces: {
      name: 'ut',
      ncesId: '499',
      stateId: 'ut',
    },
  },
  addresses: [
    {
      lines: ['Line One'],
      city: 'New City',
      state: 'UT',
      postCode: '84098',
      country: 'USA',
    },
  ],
  path: `,${ROOT.id},${TEST_TENANT.tenantId},`,
  deepPath: [
    { tenantId: ROOT.id, name: ROOT.name },
    { tenantId: TEST_TENANT.tenantId, name: TEST_TENANT.name },
  ],
  tags: [],
  createdBy: ROOT.id,
  creationDate: new Date(),
  modifiedBy: ROOT.id,
  modifiedDate: new Date(),
  version: 1,
} as TenantDocument;

export const TEST_CHILD_TENANT = {
  _id: 'auidhyiuadfy786adf',
  tenantId: 'auidhyiuadfy786adf',
  name: 'Child Org',
  classification: {
    type: 'district',
    nces: {
      name: 'ut',
      ncesId: '345',
      stateId: 'ut',
    },
  },
  addresses: [
    {
      lines: ['Line One'],
      city: 'New City',
      state: 'UT',
      postCode: '84098',
      country: 'USA',
    },
  ],
  path: `,${ROOT.id},${TEST_TENANT.tenantId},${TEST_TENANT_2.tenantId}`,
  deepPath: [
    { tenantId: ROOT.id, name: ROOT.name },
    { tenantId: TEST_TENANT.tenantId, name: TEST_TENANT.name },
    { tenantId: TEST_TENANT_2.tenantId, name: TEST_TENANT_2.name },
  ],
  tags: [],
  createdBy: ROOT.id,
  creationDate: new Date(),
  modifiedBy: ROOT.id,
  modifiedDate: new Date(),
  version: 1,
} as TenantDocument;

export const stateOrgId = '018bf1da-9b25-78d4-97f4-075239f1bda3';
export const districtOrgId = '018bf1dc-b648-754e-8d25-019c9251701a';
export const schoolId = '018bf1dd-5a48-7dc6-8112-2886ef5c86ae';

export const stateOrg = {
  tenantId: stateOrgId,
  name: 'Utah Board Of Education - Test',
  addresses: [],
  path: `,${ROOT_ORGANIZATION.tenantId},`,
  deepPath: [],
  tags: [],
};
export const districtOrg = {
  tenantId: districtOrgId,
  name: 'Jordan School District - Test',
  addresses: [],
  path: `,${ROOT_ORGANIZATION.tenantId},${stateOrgId},`,
  deepPath: [],
  tags: [],
};

export const school = {
  tenantId: schoolId,
  name: 'Bingham High School - Test',
  addresses: [],
  path: `,${ROOT_ORGANIZATION.tenantId},${stateOrgId},${districtOrgId},`,
  deepPath: [],
  tags: [],
};

export const orgSelectorFn = async (id: string) => {
  if (id === stateOrgId)
    return new Promise<TenantDocument>((resolve) => {
      resolve(stateOrg);
    });
  if (id === districtOrgId)
    return new Promise<TenantDocument>((resolve) => {
      resolve(districtOrg);
    });
  if (id === schoolId)
    return new Promise<TenantDocument>((resolve) => {
      resolve(school);
    });
  if (id === TEST_TENANT.tenantId)
    return new Promise<TenantDocument>((resolve) => {
      resolve(TEST_TENANT);
    });
  if (id === TEST_TENANT_2.tenantId)
    return new Promise<TenantDocument>((resolve) => {
      resolve(TEST_TENANT_2);
    });
  return new Promise<TenantDocument>((resolve) => {
    resolve({} as TenantDocument);
  });
};
export const TEST_GEORGIA_TENANT = {
  _id: 'jfiydfour8er7idfidofh88d0yf',
  tenantId: import.meta.env.VITE_GEORGIA_ORG_ID,
  name: 'Georgia',
  classification: {
    type: 'district',
    nces: {
      name: 'ga',
      ncesId: '13',
      stateId: 'ga',
    },
  },
  addresses: [
    {
      lines: [''],
      city: '',
      state: 'GA',
      postCode: '',
      country: 'US',
    },
  ],
  path: `,${ROOT.id},${TEST_TENANT.tenantId},`,
  deepPath: [
    { tenantId: ROOT.id, name: ROOT.name },
    { tenantId: TEST_TENANT.tenantId, name: TEST_TENANT.name },
  ],
  ssoSettings: { provider: { type: '' } } as unknown as SsoSettings,
  tags: [],
  createdBy: ROOT.id,
  creationDate: new Date(),
  modifiedBy: ROOT.id,
  modifiedDate: new Date(),
  version: 1,
} as TenantDocument;

export const ROSTERED_ORG = {
  tenantId: '1234-5678-9012-3456',
  name: 'Demo Public High School',
  addresses: [
    {
      state: 'UT',
      postCode: '84003',
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
  path: `,${stateOrg.path}${stateOrgId},`,
  deepPath: [...stateOrg.deepPath, { tenantId: stateOrgId, name: stateOrg.name }],
  tags: [],
} as TenantDocument;

export const TEST_UTAH_BASED_ORG = {
  _id: 'lakdfjl98789adfd',
  tenantId: '9861-8276-2093-3987',
  name: 'Alpine Online School',
  classification: {
    type: 'publicMiddleSchool',
    nces: {
      name: 'Alpine Online School',
      ncesId: '209482',
      stateId: 'UT',
    },
  },
  addresses: [
    {
      lines: ['Alpine Online School'],
      city: '134455',
      state: 'UT',
      postCode: '',
      country: 'US',
    },
  ],
  path: `,${ROOT.id},${import.meta.env.VITE_UTAH_ORG_ID.toString()},`,
  deepPath: [
    { tenantId: ROOT.id, name: ROOT.name },
    { tenantId: USBE.id, name: 'USBE' },
  ],
  ssoSettings: { provider: { type: '' } } as unknown as SsoSettings,
  tags: [],
  createdBy: ROOT.id,
  creationDate: new Date(),
  modifiedBy: ROOT.id,
  modifiedDate: new Date(),
  version: 1,
} as TenantDocument;
