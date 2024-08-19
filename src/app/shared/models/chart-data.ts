export type CandlestickData = [
  number,  // Timestamp (Unix Epoch in milliseconds)
  string,  // Opening price
  string,  // Highest price
  string,  // Lowest price
  string,  // Closing price
  string,  // Volume traded during the interval
  number,  // Close timestamp (Unix Epoch in milliseconds)
  string,  // Quote asset volume
  number,  // Number of trades
  string,  // Taker buy base asset volume
  string,  // Taker buy quote asset volume
  string   // Ignore (possibly a reserved field, usually 0)
];

export type CandlestickResponse = CandlestickData[];
