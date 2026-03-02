interface StockBasicInfo {
  symbol: string;
  price: number;
  currency: string;
  name?: string;
  change: number;
}

export const fetchStockData = async (symbol: string): Promise<StockBasicInfo> => {
  try {
    // Calling the Yahoo v8 API directly via fetch
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
    
    if (!response.ok) {
      throw new Error(`Stock symbol not found: ${symbol}`);
    }

    const data: any = await response.json();
    const result = data.chart.result[0];
    const meta = result.meta;

    return {
      symbol: meta.symbol,
      price: meta.regularMarketPrice,
      currency: meta.currency,
      // Manual calculation of percent change to keep the function "lean"
      change: parseFloat(((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100).toFixed(2))
    };
  } catch (error: any) {
    throw new Error(`Stock API Error: ${error.message}`);
  }
};