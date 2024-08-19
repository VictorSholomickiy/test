import { Ticker } from '@models/ticker';
import { DataFilter } from '@models/data-filter';

export type DataState = {
  data: Ticker[];
  filteredData: Ticker[];
  filter: DataFilter;

  pending: boolean;
  historyPending: boolean;
  error: string;
};

export const initialFilerState: DataFilter = {
  volumeMin: null,
  volumeMax: null,
  priceRangeMin: null,
  priceRangeMax: null,
  priceChangePercentageMin: null,
  priceChangePercentageMax: null,
};

export const initialState: DataState = {
  data: [],
  filteredData: [],
  filter: initialFilerState,

  pending: false,
  historyPending: false,
  error: '',
};

