import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { Ticker } from '@models/ticker';
import { DataFilter } from '@models/data-filter';
import { PriceTicker } from '@models/price-ticker';
import { DataService } from '@services/data.service';
import { initialFilerState, initialState } from '@store/data.state';
import { filterTickers, updateTickersPrice } from '@helpers/ticker.helper';

export const DataStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed(store => ({
    filterHasValue: computed(() => {
      for (let key in store.filter()) {
        if (store.filter()[key as keyof DataFilter]) {
          return true;
        }
      }
      return false;
    }),
    filteredData: computed(() => {
      return store.filter() && store.data().length ? filterTickers(store.data(), store.filter()) : store.data();
    }),
  })),

  withMethods(store => {
    const dataService = inject(DataService);

    return {
      clearStore: () => patchState(store, initialState),
      // GET DATA
      getData: rxMethod<void>(
        pipe(
          tap(() => patchState(store, {pending: true})),
          switchMap(() => dataService.getData$()),
          tapResponse({
            next: (data: Ticker[]) => patchState(store, {data, filteredData: data, pending: false, error: ''}),
            error: (error: string) => patchState(store, {error, pending: false, data: [], filteredData: []}),
          }),
        ),
      ),

      updateTickersPrice: (priceTickers: PriceTicker[]) => {
        const data = updateTickersPrice(store.data(), priceTickers);

        return patchState(store, { data });
      },

      // History
      isHistoryLoading: () => patchState(store, {historyPending: true}),
      isHistoryLoaded: () => patchState(store, {historyPending: false}),

      // UPDATE FILTER DATA
      updateFilterData: (filter: DataFilter) => patchState(store, { filter }),
      clearFilterData: () => patchState(store, { filter: initialFilerState }),
    }
  }),
);
