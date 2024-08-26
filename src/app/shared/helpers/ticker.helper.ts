import { Ticker } from '@models/ticker';
import { DataFilter } from '@models/data-filter';
import { PriceTicker } from '@models/price-ticker';

export function filterTickers(tickers: Ticker[], filter: DataFilter): Ticker[] {
  return tickers.filter((ticker) => {
    const quoteVolume = parseFloat(ticker.quoteVolume);
    const priceChange = parseFloat(ticker.priceChange);
    const priceChangePercent = parseFloat(ticker.priceChangePercent);

    if (filter.volumeMin !== null && quoteVolume < filter.volumeMin) return false;
    if (filter.volumeMax !== null && quoteVolume > filter.volumeMax) return false;

    if (filter.priceRangeMin !== null && priceChange < filter.priceRangeMin) return false;
    if (filter.priceRangeMax !== null && priceChange > filter.priceRangeMax) return false;

    if (filter.priceChangePercentageMin !== null && priceChangePercent < filter.priceChangePercentageMin) return false;
    if (filter.priceChangePercentageMax !== null && priceChangePercent > filter.priceChangePercentageMax) return false;

    return true;
  });
}

export function updateTickersPrice(data: Ticker[], priceTickers: PriceTicker[]): Ticker[] {
  for (const ticker of data) {
    for (const price of priceTickers) {
      if (ticker.symbol === price.symbol) {
        ticker.lastPrice = price.lastPrice;
        break;
      }
    }
  }

  return data;
}

