import express, { Request, Response } from 'express';
import cors from 'cors';
import { fetchStockData } from './services/stockService.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/stock/:code', async (req: Request, res: Response) => {
  const { code } = req.params;

  // Check if code exists and is a single string
  if (typeof code !== 'string') {
    res.status(400).json({ error: "Invalid ticker symbol format" });
    return; 
  }

  try {
    const data = await fetchStockData(code);
    res.json(data);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is officially UP on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
});