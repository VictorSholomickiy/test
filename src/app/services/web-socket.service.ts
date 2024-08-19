import { Observable, Subject } from 'rxjs';
import { inject, Injectable } from '@angular/core';

import { DataStore } from '@store/data.store';
import { PriceTicker, PriceTickerAPI } from '@models/price-ticker';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  // DI
  private dataStore = inject(DataStore);

  private socket: WebSocket;
  private subject: Subject<PriceTicker[]>;

  constructor() {
    this.connect();
  }

  public getPriceData(): Observable<PriceTicker[]> {
    return this.subject.asObservable();
  }

  private connect(): void {
    this.socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    this.subject = new Subject<PriceTicker[]>();

    this.socket.onmessage = (event) => {
      if (!this.dataStore.data().length) {
        return;
      }

      const apiFilteredData = JSON.parse(event.data)
        .filter((item: PriceTickerAPI) => item.s.endsWith('USDT'))

      this.subject.next(PriceTicker.getPreparedItems(apiFilteredData));
    };

    this.socket.onclose = (event) => {
      this.connect();
    };
  }
}
