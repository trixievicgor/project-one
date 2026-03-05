import YahooFinance from 'yahoo-finance2';
export const fetchStockData = async (symbol) => {
    try {
        const yahooFinance = new YahooFinance();
        const quote = await yahooFinance.quote(symbol);
        const { regularMarketPrice: price, currency, regularMarketChangePercent } = quote;
        return { symbol, price, currency, change: parseFloat(regularMarketChangePercent.toFixed(2)) };
    }
    catch (error) {
        throw new Error(`Yahoo Finance Error: ${error.message}`);
    }
};
