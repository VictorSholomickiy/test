import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';

import { Ticker } from '@models/ticker';
import { UrlService } from '@services/url.service';
import { RequestService } from './request.service';
import { CandlestickResponse } from '@models/chart-data';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private urlService: UrlService,
    private requestService: RequestService,
    private errorHandlingService: ErrorHandlingService,
  ) {
  }

  public getData$(): Observable<Ticker[]> {
    return this.requestService
      .get(this.urlService.getDataURL())
      .pipe(
        map((data: Ticker[]) => data.filter((item: Ticker) => item.symbol.endsWith('USDT'))),
        catchError((error) => this.errorHandlingService.handleError(error)));
  }

  public get24hPriceHistory$(symbol: string): Observable<CandlestickResponse> {
    return this.requestService
      .get(this.urlService.get24hPriceHistoryURL(symbol))
      .pipe(catchError((error) => this.errorHandlingService.handleError(error)));
  }
}
