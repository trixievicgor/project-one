export const fetchPriceHistory = async (symbol: string, yahooFinance: any, range: string): Promise<any> => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // "2026-03-20"
  
  let period1 = new Date();
  let interval = '1d';

  switch (range.toUpperCase()) {
    // case '1D':
    //   period1.setDate(today.getDate() - 1);
    //   interval = '1m'; // 1-minute bars
    //   break;
    case '1W':
      period1.setDate(today.getDate() - 7);
      interval = '1d'; // 15-minute bars
      break;
    case '1M':
      period1.setMonth(today.getMonth() - 1);
      interval = '1d'; // Daily bars
      break;
    case '3M':
      period1.setMonth(today.getMonth() - 3);
      interval = '1wk';
      break;
    case '6M':
      period1.setMonth(today.getMonth() - 6);
      interval = '1wk';
      break;
    case 'YTD':
      // Sets to Jan 1st of the current year (2026)
      period1 = new Date(today.getFullYear(), 0, 1);
      console.log("YTD period1:", period1);
      interval = '1wk';
      break;
    case '1Y':
      period1.setFullYear(today.getFullYear() - 1);
      console.log("1Y period1:", period1);
      interval = '1wk';
      break;
    case '5Y':
      period1.setFullYear(today.getFullYear() - 5);
      interval = '1wk';
      break;
    default:
      period1.setMonth(today.getMonth() - 1); // Default to 1M
  }

  const period1Str = period1.toISOString().split('T')[0];

  try {
    return await yahooFinance.historical(symbol, {
      period1: period1Str,
      period2: todayStr,
      interval: interval
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch ${range} history: ${error.message}`);
  }
};