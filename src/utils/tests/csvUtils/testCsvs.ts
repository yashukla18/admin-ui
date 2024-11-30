/* eslint-disable max-len */
export const withExtraColumns = `
Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required],,,,,,,,
brandon.allred@youscience.com,Bread,,,Proctor,Yes`;

export const formattedWithExtraColumns = `Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required]
brandon.allred@youscience.com,Bread,,,Proctor,Yes`;

export const withCorrectFormat = `
Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required]
brandon.allred@youscience.com,Bread,,,Proctor,Yes`;

export const correctFormat = `
Email,Name,Student ID,Date of Birth (MM-DD-YYYY),Role,Email Invite
brandon.allred@youscience.com,Bread,1,10-10-1990,Proctor,Yes`;

export const withProceedingRow = `,,,,,
Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required]
brandon.allred+ proctor&youscience.com,Bread,,,Proctor,Yes`;

export const withExtraRows = `
Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required]
brandon.allred@youscience.com,Bread,,,Proctor,Yes
,,,,,,,,,,,
,,,,,,,,,,,
,,,,,,,,,,`;

export const another = `
Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required],,,,,,,,,,,,,,
melanie.gordon1@furman.edu,Bread,12343,,Admin,Yes,,,,,,,,,,,,,,
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
