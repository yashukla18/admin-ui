import { dateToUTCDateObj } from '@utils/dateToUTCDateObj';

describe('dateToUTCDateObj', () => {
  it('should return original input if the input is not a valid date', () => {
    const value = dateToUTCDateObj('2021-01-01T00:00:00.000Z' as unknown as Date);

    expect(value).toBe('2021-01-01T00:00:00.000Z');
  });

  it('should return original input if the year is less than 1900', () => {
    const dateLessThan1900 = new Date('1899-11-07T14:25:07.594Z');
    const value = dateToUTCDateObj(dateLessThan1900);

    expect(value).toBe(dateLessThan1900);
  });

  it('should retrun a date object with no timezone offset', () => {
    const value = dateToUTCDateObj(new Date('2023-11-07T14:25:07.594Z'));

    expect(value).toEqual(new Date(2023, 10, 7, 0, 0, 0, 0));
  });
});
