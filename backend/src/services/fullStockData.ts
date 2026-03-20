export const fetchFullStockData = async (symbol: string, yahooFinance: any): Promise<any> => {
  try {
    // const yahooFinance = new YahooFinance();
    const quote = await yahooFinance.quote(symbol);
    return quote;
  } catch (error: any) {
    throw new Error(`Yahoo Finance Error: ${error.message}`);
  }
};
