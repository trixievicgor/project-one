import express, { Request, Response } from 'express';
import cors from 'cors';
import YahooFinance from 'yahoo-finance2';
import { fetchStockData } from './services/stockService.js';
import { fetchFullStockData } from './services/fullStockData.js';
import { fetchTopMovers } from './services/topMoversService.js';
import { fetchPriceHistory } from './services/priceHistory.js';

const app = express();
app.use(cors());  
app.use(express.json());
const yahooFinance = new YahooFinance();

app.get('/api/stock/data/:code', async (req: Request, res: Response) => {
  const { code } = req.params;

  // Check if code exists and is a single string
  if (typeof code !== 'string') {
    res.status(400).json({ error: "Invalid ticker symbol format" });
    return; 
  }

  try {
    const data = await fetchFullStockData(code, yahooFinance);
    res.json(data);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/api/stock/history/:code/:range', async (req: Request, res: Response) => {
  const { code, range } = req.params; // Both are now in req.params

  if ((typeof code !== 'string') || (typeof range !== 'string')) {
    res.status(400).json({ error: "Invalid ticker symbol or range format" });
    return; 
  }

  try {
    // Both are guaranteed strings by Express, solving your TS error!
    const data = await fetchPriceHistory(code, yahooFinance, range);
    res.json(data);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/api/stock/:code', async (req: Request, res: Response) => {
  const { code } = req.params;

  // Check if code exists and is a single string
  if (typeof code !== 'string') {
    res.status(400).json({ error: "Invalid ticker symbol format" });
    return; 
  }

  try {
    const data = await fetchStockData(code, yahooFinance);
    res.json(data);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/api/top-movers', async (req: Request, res: Response) => {
  try {
    const data = await fetchTopMovers(yahooFinance);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is officially UP on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
});