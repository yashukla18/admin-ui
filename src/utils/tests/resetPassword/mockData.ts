import { AccessDocument, UserDocument } from '@youscience/user-service-common';

export const rootTenantId = '5473rta1';

export const rootAdmin = true;

export const nonRootAdmin = false;

export const mockUserDetails = {
  userId: '64512ca7',
  fullName: 'Rebecca Barton',
  displayName: 'Rebecca Barton',
  profile: {
    sex: 'female',
    ethnicity: ['hispanic'],
    emails: [],
    phones: [],
    addresses: [],
  },
  identities: [
    {
      idpId: 'ca6ds5h',
      provider: 'cognito',
      email: 'bryan.campbell+test1@youscience.com',
    },
    {
      idpId: '675dfuh',
      provider: 'cognito',
      email: 'bryan.campbell+test2@youscience.com',
    },
    {
      idpId: 'Google_76765',
      provider: 'Google',
      email: 'bryan.campbell+test3@youscience.com',
      name: 'Rebecca Barton',
    },
    {
      idpId: 'Clever_34ugyg',
      provider: 'Clever',
      email: 'bryan.campbell+test4@youscience.com',
      name: 'Rebecca',
    },
  ],
} as UserDocument;

export const mockUserDetailsWithNoIdentities = {
  userId: '64512ca7',
  fullName: 'Rebecca Barton',
  displayName: 'Rebecca Barton',
  profile: {
    sex: 'female',
    ethnicity: ['hispanic'],
    emails: [],
    phones: [],
    addresses: [],
  },
  identities: [{}],
} as UserDocument;

export const mockAccesses = [
  {
    _id: '745usr3h' as unknown,
    status: 'active',
    user: {
      userId: '64512ca7',
      fullName: 'Rebecca Barton',
      grants: ['*'],
    },
    tenant: {
      tenantId: '65sadhg',
      name: 'Demo High School',
      permission: {
        role: 'Staff',
      },
      private: {
        tags: [],
        data: {},
      },
    },
  },
] as AccessDocument[];

export const mockAccessesWithRootAdmin = [
  {
    _id: '745usr3h' as unknown,
    status: 'active',
    user: {
      userId: '6451107e',
      fullName: 'James Barkley',
      grants: ['*'],
    },
    tenant: {
      tenantId: '5473rta1',
      name: 'YouScience (ROOT)',
      permission: {
        role: 'Admin',
      },
      private: {
        tags: [],
        data: {
          studentId: null,
        },
      },
    },
  },
] as AccessDocument[];

export const invalidUserDetailsCases = [{ description: 'identities is empty', data: [] }];

export const invalidAccessesCases = [
  { description: 'accesses is undefined', data: undefined },
  { description: 'accesses is null', data: null },
];

export const invalidRootAdminCases = [
  { description: 'isRootAdmin is undefined', data: undefined },
  { description: 'isRootAdmin is null', data: null },
];

export const invalidRootTenantIdCases = [
  { description: 'rootTenantId is undefined', data: undefined },
  { description: 'rootTenantId is null', data: null },
];

export const accessWithDifferentRole = [
  {
    description: 'user with learner access',
    role: 'Learner',
    data: [
      {
        _id: '745usr3h' as unknown,
        status: 'active',
        user: {
          userId: '64512ca7',
          fullName: 'Rebecca Barton',
          grants: ['*'],
        },
        tenant: {
          tenantId: '7678sdsda',
          name: 'Demo High School',
          permission: {
            role: 'Learner',
          },
          private: {
            tags: [],
            data: {},
          },
        },
      },
    ] as AccessDocument[],
  },
  {
    description: 'user with proctor access',
    role: 'Proctor',
    data: [
      {
        _id: '745usr3h' as unknown,
        status: 'active',

        user: {
          userId: '64512ca7',
          fullName: 'Rebecca Barton',
          grants: ['*'],
        },
        tenant: {
          tenantId: '6786sdf8',
          name: 'Demo High School',
          permission: {
            role: 'Proctor',
          },
          private: {
            tags: [],
            data: {},
          },
        },
      },
    ] as AccessDocument[],
  },
  {
    description: 'user with staff access',
    role: 'Staff',
    data: [
      {
        _id: '745usr3h' as unknown,
        status: 'active',
        user: {
          userId: '64512ca7',
          fullName: 'Rebecca Barton',
          grants: ['*'],
        },
        tenant: {
          tenantId: '657dafhhjf',
          name: 'Demo High School',
          permission: {
            role: 'Staff',
          },
          private: {
            tags: [],
            data: {},
          },
        },
      },
    ] as AccessDocument[],
  },
  {
    description: 'user with admin access',
    role: 'Admin',
    data: [
      {
        _id: '745usr3h' as unknown,
        status: 'active',
        user: {
          userId: '64512ca7',
          fullName: 'Rebecca Barton',
          grants: ['*'],
        },
        tenant: {
          tenantId: '686dsSG',
          name: 'Demo High School',
          permission: {
            role: 'Admin',
          },
          private: {
            tags: [],
            data: {},
          },
        },
      },
    ] as AccessDocument[],
  },
];

export const identitiesToSort = [
  {
    idpId: 'Google_6787643',
    provider: 'Google',
    email: 'balu.rajadurai@youscience.com',
    name: 'Balu Raja Durai',
  },
  {
    idpId: 'hgf2343',
    provider: 'cognito',
    email: 'balu.rajadurai@youscience.com',
  },
  {
    email: 'info@cccollegeconsultants.com',
  },
  {
    idpId: 'yust34342',
    provider: 'cognito',
    email: 'info@cccollegeconsultants.com',
  },
];

export const expectedSortedIdentities = [
  {
    idpId: 'Google_6787643',
    provider: 'Google',
    email: 'balu.rajadurai@youscience.com',
    name: 'Balu Raja Durai',
  },
  {
    idpId: 'hgf2343',
    provider: 'cognito',
    email: 'balu.rajadurai@youscience.com',
  },
  {
    idpId: 'yust34342',
    provider: 'cognito',
    email: 'info@cccollegeconsultants.com',
  },
  {
    email: 'info@cccollegeconsultants.com',
  },
];

export const filterUseCases = [
  {
    description: 'with cognito provider',
    data: mockUserDetails,
    expectedResult: [
      {
        idpId: 'ca6ds5h',
        provider: 'cognito',
        email: 'bryan.campbell+test1@youscience.com',
      },
      {
        idpId: '675dfuh',
        provider: 'cognito',
        email: 'bryan.campbell+test2@youscience.com',
      },
    ],
  },
  {
    description: 'with no provider(only email)',
    data: {
      userId: '6451a2fe',
      fullName: 'Alivia Brown',
      profile: {
        firstName: 'Alivia',
        lastName: 'Brown',

        gender: 'Female',
        ethnicity: ['Other / Multiracial'],
        plan: {
          now: 'high_school',
          next: [],
        },
        graduationYear: 2026,
        emails: [
          {
            address: 'brownali000@k12.scsd.ac',
            isPrimary: false,
            isVerified: false,
            type: 'personal',
          },
        ],
        phones: [
          {
            number: '+14257911741',
            isPrimary: true,
          },
        ],
        addresses: [
          {
            state: 'WA',
            postCode: '98292',
            country: '',
          },
        ],
      },
      identities: [
        {
          email: 'brownali000@k12.scsd.ac',
        },
      ],
      productData: [],
      legacyIds: {
        discovery: ['2392240'],
      },
    } as UserDocument,
    expectedResult: [
      {
        email: 'brownali000@k12.scsd.ac',
      },
    ],
  },
  {
    description: 'with cognito provider(without email)',
    data: {
      userId: '6451a3ca',
      fullName: 'Jakai Moore',
      profile: {
        firstName: 'Jakai',
        lastName: 'Moore',
        gender: 'Female',
        ethnicity: ['Black / African American'],
        plan: {
          now: 'middle_school',
          next: [],
        },
        graduationYear: 2027,
        emails: [
          {
            address: 'jmoore020@student.rcschools.net',
            isPrimary: false,
            isVerified: false,
            type: 'personal',
          },
        ],
        phones: [
          {
            number: '+10000000000',
            isPrimary: true,
          },
        ],
        addresses: [
          {
            state: 'TN',
            postCode: '37128',
            country: '',
          },
        ],
      },
      identities: [
        {
          idpId: '00781410-6185-4baa-ab15-34c844155299',
          provider: 'cognito',
        },
      ],
      productData: [],
      legacyIds: {
        discovery: ['2735429'],
      },
    } as UserDocument,
    expectedResult: [
      {
        idpId: '00781410-6185-4baa-ab15-34c844155299',
        provider: 'cognito',
      },
    ],
  },
  {
    description: 'with no repeated emails',
    data: {
      userId: '64517bda',
      fullName: 'Balu Raja Durai',
      identities: [
        {
          idpId: 'Google_6787643',
          provider: 'Google',
          email: 'balu.rajadurai@youscience.com',
          name: 'Balu Raja Durai',
        },
        {
          idpId: 'hgf2343',
          provider: 'cognito',
          email: 'balu.rajadurai@youscience.com',
        },
        {
          email: 'info@cccollegeconsultants.com',
        },
        {
          idpId: 'yust34342',
          provider: 'cognito',
          email: 'info@cccollegeconsultants.com',
        },
      ],
    } as UserDocument,
    expectedResult: [
      {
        idpId: 'hgf2343',
        provider: 'cognito',
        email: 'balu.rajadurai@youscience.com',
      },
      {
        idpId: 'yust34342',
        provider: 'cognito',
        email: 'info@cccollegeconsultants.com',
      },
    ],
  },
];

export const identitiesToDisplay = {
  userId: '64512ca7',
  fullName: 'Rebecca Barton',
  displayName: 'Rebecca Barton',
  profile: {
    sex: 'female',
    ethnicity: ['hispanic'],
    emails: [],
    phones: [],
    addresses: [],
  },
  identities: [
    {
      idpId: 'Google_6787643',
      provider: 'Google',
      email: 'balu.rajadurai@youscience.com',
      name: 'Balu Raja Durai',
    },
    {
      idpId: 'hgf2343',
      provider: 'cognito',
      email: 'balu.rajadurai@youscience.com',
    },
    {
      email: 'info@cccollegeconsultants.com',
    },
    {
      idpId: 'yust34342',
      provider: 'cognito',
      email: 'info@cccollegeconsultants.com',
    },
    {
      idpId: 'yust34342',
      provider: 'cognito',
      email: 'balu.rajadurai@youscience.com',
    },
  ],
} as UserDocument;

export const expectedIdentitiesToDisplay = [
  {
    idpId: 'Google_6787643',
    provider: 'Google',
    email: 'balu.rajadurai@youscience.com',
    name: 'Balu Raja Durai',
  },
  {
    idpId: 'hgf2343',
    provider: 'cognito',
    email: 'balu.rajadurai@youscience.com',
  },
  {
    idpId: 'yust34342',
    provider: 'cognito',
    email: 'info@cccollegeconsultants.com',
  },
];
