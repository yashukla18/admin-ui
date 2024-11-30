import { TenantDocument } from '@youscience/user-service-common';

/* eslint-disable max-len */
export const withExtraColumns = `
Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required],,,,,,,,
brandon.allred+ proctor&youscience.com,Bread,,,Proctor,Yes`;

export const withCorrectFormat = `Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required]
brandon.allred+ proctor&youscience.com,Bread,,,Proctor,Yes`;

export const withProceedingRow = `,,,,,
Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required]
brandon.allred+ proctor&youscience.com,Bread,,,Proctor,Yes`;

export const withExtraRows = `
Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required]
brandon.allred+ proctor&youscience.com,Bread,,,Proctor,Yes,,,,,,,,
,,,,,,,,,,,
,,,,,,,,,,,
,,,,,,,,,,`;

export const another = `
Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required],,,,,,,,,,,,,,
melanie.gordon1@furman.edu,,,,Admin,Yes,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
`;
export const trueControl = `Email [Required] Name [Optional]	Student ID [Optional]	Date of Birth (MM-DD-YYYY) [Optional]	Role [Required]	Email Invite [Required]
brandon.allred+ proctor&youscience.com	Bread			Proctor	Yes`;

export const defaultUploadFile = `Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required]\r
  brandon.allred+proctor@youscience.com,Bread,,,Proctor,Yes\r
  balurajadurai+admin@youscience.com,Balu,,,Admin,Yes\r
  yash.xyz@youscience.com,Yash,,,Learner,Yes`;

export const withDuplicateStudentId = `Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required]\r
  brandon.allred+proctor@youscience.com,Bread,std123,,Proctor,Yes\r
  balurajadurai+admin@youscience.com,Balu,std123,,Admin,Yes\r
  yash.xyz@youscience.com,Yash,,,Learner,Yes`;

export const invalidFile = `Name,Age,Role\r
  John,35,Developer`;

export const utahUploadFile = `Email [Required],Name [Required],Student ID [Required],Date of Birth (MM-DD-YYYY) [Required],Role [Required],Email Invite [Required]\r
  brandon.allred+proctor@youscience.com,Bread,,,Admin,Yes\r
  balurajadurai+admin@youscience.com,Balu,,,Staff,Yes`;

export const staffUploadFile = `Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required]\r
  test+staff@youscience.com,Balu,,,Staff,Yes`;

export const items: TenantDocument[] = [
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
