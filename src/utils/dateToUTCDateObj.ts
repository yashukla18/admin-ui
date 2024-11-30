export function dateToUTCDateObj(value: Date) {
  // eslint-disable-next-line no-restricted-globals
  const isValid = value instanceof Date && !isNaN(value as unknown as number);

  if (isValid) {
    const isoString = new Date(value).toISOString();

    const offset = value.getTimezoneOffset();
    let year;
    let month;
    let day;

    if (offset >= 0) {
      year = Number(isoString.slice(0, 4));
      month = Number(isoString.slice(5, 7));
      day = Number(isoString.slice(8, 10));
    }

    if (offset < 0) {
      year = value.getFullYear();
      month = value.getMonth() + 1;
      day = value.getDate();
    }

    if (year && year < 1900) {
      return value;
    }

    if (year && month && day) {
      return new Date(year, month - 1, day, 0, 0, 0, 0);
    }
  }
  return value;
}
