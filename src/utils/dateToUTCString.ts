export const DateToUTCString = (value: Date | undefined | null | string) => {
  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}T00:00:00.000Z`;
  }

  return undefined;
};
