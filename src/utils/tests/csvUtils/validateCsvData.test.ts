/* eslint-disable max-len */
import { validateCsvData } from '@utils/csvUtils';
import { convertCSVToBulkInvitations } from '@utils/csvUtils/csvUtils';
import { another, formattedWithExtraColumns, withExtraColumns, withExtraRows, withProceedingRow } from './testCsvs';

describe('validateCsvData', () => {
  it('should validate with the correct format', () => {
    const result = validateCsvData(withExtraColumns);

    expect(result).toMatchObject({
      isInvalidHeader: false,
      processedCsvString: formattedWithExtraColumns,
    });
  });

  it('should invalidate csv with proceeding rows', () => {
    const result = validateCsvData(withProceedingRow);

    expect(result).toMatchObject({
      isInvalidHeader: true,
      processedCsvString: '',
    });
  });

  it('should validate csv with extra rows', () => {
    const result = validateCsvData(withExtraRows);

    const processedCsvString = `Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required]
brandon.allred@youscience.com,Bread,,,Proctor,Yes
`;

    expect(result).toMatchObject({
      isInvalidHeader: false,
      processedCsvString,
    });
  });

  it('should validate with extra rows and columns', () => {
    const result = validateCsvData(another);
    const processedCsvString = `Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required]
melanie.gordon1@furman.edu,Bread,12343,,Admin,Yes
`;

    expect(result).toMatchObject({
      isInvalidHeader: false,
      processedCsvString,
    });
  });

  describe('csvToBulkInvitations', () => {
    it('should convert a csvString to a valid array of invitation objects', () => {
      const processedCsvString = ` Email [Required],Name [Required],Student ID [Required],Date of Birth (MM-DD-YYYY) [Required],Role [Required],Email Invite [Required]
      i.balu@kbs.sch.id,Balu S,,,Learner,No`;
      const result = convertCSVToBulkInvitations(processedCsvString, '123');

      expect(result).toEqual([
        {
          dateOfBirth: '',
          emailAddress: 'i.balu@kbs.sch.id',
          emailInvite: false,
          fullName: 'Balu S',
          role: 'Learner',
          studentId: '',
          tenantId: '123',
        },
      ]);
    });
  });
});
