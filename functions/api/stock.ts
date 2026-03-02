import { fetchStockData } from "../services/stockService";
export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    const url = new URL(request.url);
    const code = url.pathname.split('/').pop();
    
    // Check if code exists and is a single string
    if (typeof code !== 'string' || code.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid ticker symbol format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Your stock service logic
    const stockData = await fetchStockData(code);
    
    return new Response(JSON.stringify(stockData), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // CORS
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
