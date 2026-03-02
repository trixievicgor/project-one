import { fetchStockData } from "../../services/stockService";

export async function onRequestGet(context: any) {
  const { request } = context;
  
  try {
    const url = new URL(request.url);
    // This extracts "AAPL" from ".../api/stock/AAPL"
    const pathParts = url.pathname.split('/');
    const code = pathParts[pathParts.length - 1];
    
    if (!code || code === 'stock') {
      return new Response(JSON.stringify({ error: "Ticker symbol required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const stockData = await fetchStockData(code.toUpperCase());
    
    return new Response(JSON.stringify(stockData), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}