import { BulkInvitation } from '@youscience/user-service-common';

const CSV_HEADERS = ['Email', 'Name', 'Student ID', 'Date of Birth (MM-DD-YYYY)', 'Role', 'Email Invite'];

const sanitizedHeader = (header: string[]) =>
  header.map((column) => column.replace(/\s*\[Optional\]|\[Required\]/g, '').trim());

const validateHeaders = (header: string[], expectedHeaders: string[]) =>
  header.every((column, index) => column === expectedHeaders[index]);

// Validation for CSV upload
export const validateCsvData = (
  csvString: string,
): {
  isInvalidHeader: boolean;
  processedCsvString: string;
} => {
  // Processing csv string for ms excel upload
  const processedCsvString = csvString
    .trim()
    .replace(/,+$/gm, '') // Removing trailing commas at end of the line
    .replace(/^\s*$/gm, ''); // Removing empty lines

  const lines = processedCsvString.split(/\r\n|\r|\n/);
  // const lines = processedCsvString.split('\r\n');      // Previous implementation
  const header = sanitizedHeader(lines[0].split(','));

  // Check if headers match
  if (!validateHeaders(header, CSV_HEADERS)) {
    return {
      isInvalidHeader: true,
      processedCsvString: '',
    };
  }

  return {
    isInvalidHeader: false,
    processedCsvString,
  };
};

export const convertCSVToBulkInvitations = (csvString: string, tenantId: string): BulkInvitation[] => {
  const rows: string[] = csvString.trim().split(/\r\n|\r|\n/);
  const header: string[] = sanitizedHeader(rows[0].split(','));

  const headersMapping: Record<string, keyof BulkInvitation> = {
    Email: 'emailAddress',
    Name: 'fullName',
    'Student ID': 'studentId',
    'Date of Birth (MM-DD-YYYY)': 'dateOfBirth',
    Role: 'role',
    'Email Invite': 'emailInvite',
  };

  const bulkInvitations: BulkInvitation[] = rows.slice(1).map((row) => {
    const values: string[] = row.split(',');
    const invitationData: Partial<BulkInvitation> = { tenantId };

    values.forEach((value, index) => {
      const originalHeader = header[index];
      const mappedHeader = headersMapping[originalHeader];

      if (mappedHeader) {
        if (mappedHeader === 'emailInvite') {
          invitationData[mappedHeader] = value.trim().toLowerCase() === 'Yes';
        } else {
          invitationData[mappedHeader] = value.trim();
        }
      }
    });

    return invitationData as BulkInvitation;
  });

  return bulkInvitations;
};
