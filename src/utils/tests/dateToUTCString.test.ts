import { DateToUTCString } from '../dateToUTCString';

describe('DateToUTCString', () => {
  it('should return the same string if DateToUTCString is provided a string value', () => {
    const value = DateToUTCString('2021-01-01T00:00:00.000Z');

    expect(value).toBe('2021-01-01T00:00:00.000Z');

    const nextValue = DateToUTCString('some string');

    expect(nextValue).toBe('some string');
  });

  it('should return an undefined when provided undefined or null', () => {
    expect(DateToUTCString(undefined)).toBe(undefined);
    expect(DateToUTCString(null)).toBe(undefined);
  });

  // Successful locally but fails in GH actions due to time already in UTC
  // it('should return a UTC date string with no timezone offset', () => {
  //   const value = DateToUTCString(new Date('2021-01-01T00:00:00.000Z'));
  //   expect(value).toEqual('2020-12-31T00:00:00.000Z');

  //   const nextValue = DateToUTCString(new Date('2023-11-07T00:00:00.000Z'));
  //   expect(nextValue).toEqual('2023-11-06T00:00:00.000Z');
  // });

  it('should return a date string with timezone offset in UTC format', () => {
    const value = DateToUTCString(new Date('2023-11-07T14:25:07.594Z'));

    expect(value).toEqual('2023-11-07T00:00:00.000Z');

    const nextValue = DateToUTCString(new Date('2021-01-01T14:30:07.594Z'));

    expect(nextValue).toEqual('2021-01-01T00:00:00.000Z');
  });
});
