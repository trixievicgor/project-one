export async function onRequest(context) {
const { request } = context;

// Handle preflight requests
if (request.method === 'OPTIONS') {
return new Response(null, {
status: 204,
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
},
});
}

// Continue to the next handler
return context.next();
}
