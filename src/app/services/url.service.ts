import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private readonly URL = 'https://data-api.binance.vision/api/v3';

  public getDataURL(): string {
    return `${this.URL}/ticker/24hr`;
  }

  public get24hPriceHistoryURL(symbol: string): string {
    return `${this.URL}/klines?symbol=${symbol}&interval=1h&limit=24`;
  }
}
