interface StockBasicInfo {
  symbol: string;
  price: number;
  currency: string;
  name?: string;
  change: number;
}

export const fetchStockData = async (symbol: string, yahooFinance: any): Promise<StockBasicInfo> => {
  try {
    // const yahooFinance = new YahooFinance();
    const quote = await yahooFinance.quote(symbol);
    const { regularMarketPrice: price, currency, regularMarketChangePercent } = quote;
    return { symbol, price, currency, change: parseFloat(regularMarketChangePercent.toFixed(2)) };
  } catch (error: any) {
    throw new Error(`Yahoo Finance Error: ${error.message}`);
  }
};
