// transform Date to date in string format YYYYMMDD
// example: from Tue Nov 29 2022 to 20221129
export const dateToCustomString = (dateOrString: Date | string) => {
  const date = new Date(dateOrString);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${date.getFullYear()}${month > 10 ? month : `0${month}`}${day > 10 ? day : `0${day}`}`;
};

// transform format YYYYMMDD to Date
// example: from 20221129 to Tue Nov 29 2022
export const customStringToDate = (dateString: string | null): string | Date => {
  if (!dateString) {
    return '';
  }
  const year = dateString.slice(0, 4);
  const moth = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);

  return new Date(new Date().setFullYear(+year, +moth - 1, +day));
};
