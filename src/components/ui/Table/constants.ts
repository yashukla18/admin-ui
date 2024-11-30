import { OrderType } from './interfaces';

export const DEFAULT_DATE_FORMAT = 'dd-MM-yyyy';

export const SORT_OPTIONS: { [k: string]: OrderType } = {
  ASC: 'asc',
  DESC: 'desc',
};

export const TABLE_PER_PAGE_OPTIONS = [10, 20, 50];

export const ROW_HEIGHT = 44;
