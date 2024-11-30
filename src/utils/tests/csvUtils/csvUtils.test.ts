/* eslint-disable max-len */
import * as ValidateCsv from '../../csvUtils/csvUtils';
import { withCorrectFormat, withExtraColumns, withExtraRows, withProceedingRow } from './testCsvs';

describe('csvToArray', () => {
  it('should parse the csv file with correct format', () => {
    const validateSpy = vi.spyOn(ValidateCsv, 'validateCsvData');
    const validateCsvDataMock = vitest.fn().mockResolvedValueOnce(withCorrectFormat);

    validateSpy.mockImplementation(validateCsvDataMock);
    expect(
      validateSpy.mockReturnValueOnce({
        isInvalidHeader: false,
        processedCsvString: withCorrectFormat,
      }),
    );
  });

  it('should parse the csv with extra columns', () => {
    const validateSpy = vi.spyOn(ValidateCsv, 'validateCsvData');
    const validateCsvDataMock = vitest.fn().mockResolvedValueOnce(withExtraColumns);

    expect(validateSpy.getMockName()).toEqual('validateCsvData');

    validateSpy.mockImplementation(validateCsvDataMock);
    expect(
      validateSpy.mockReturnValueOnce({
        isInvalidHeader: false,
        processedCsvString: withCorrectFormat,
      }),
    );
  });

  it('should parse the csv with extra rows', () => {
    const validateSpy = vi.spyOn(ValidateCsv, 'validateCsvData');
    const validateCsvDataMock = vitest.fn().mockResolvedValueOnce(withExtraRows);

    expect(validateSpy.getMockName()).toEqual('validateCsvData');

    validateSpy.mockImplementation(validateCsvDataMock);
    expect(
      validateSpy.mockReturnValueOnce({
        isInvalidHeader: false,
        processedCsvString: withCorrectFormat,
      }),
    );
  });

  it('should fail formating proceeding row', () => {
    const validateSpy = vi.spyOn(ValidateCsv, 'validateCsvData');
    const validateCsvDataMock = vitest.fn().mockResolvedValueOnce(withProceedingRow);

    expect(validateSpy.getMockName()).toEqual('validateCsvData');

    validateSpy.mockImplementation(validateCsvDataMock);
    expect(
      validateSpy.mockReturnValueOnce({
        isInvalidHeader: true,
        processedCsvString: `'\n' +
    'Email [Required],Name [Optional],Student ID [Optional],Date of Birth (MM-DD-YYYY) [Optional],Role [Required],Email Invite [Required]\n' +
    'brandon.allred+ proctor&youscience.com,Bread,,,Proctor,Yes'`,
      }),
    );
  });
});
