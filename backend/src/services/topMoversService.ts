export const fetchTopMovers = async (yahooFinance: any): Promise<any> => {
  try {
    // We can run these in parallel for efficiency
    const [gainersResult, losersResult] = await Promise.all([
      yahooFinance.screener({
        scrIds: "day_gainers",
        count: 10
      }, { validateResult: false }),
      yahooFinance.screener({
        scrIds: "day_losers",
        count: 10
      }, { validateResult: false })
    ]);

    const formatResults = (data: any) => {
      return (data.quotes || []).slice(0, 10).map((stock: any) => ({
        symbol: stock.symbol,
        changePercent: parseFloat(stock.regularMarketChangePercent.toFixed(2))
      }));
    };
    
    return {
      gainers: formatResults(gainersResult),
      losers: formatResults(losersResult)
    };
  } catch (error: any) {
    throw new Error(`Top Movers Error: ${error.message}`);
  }
};