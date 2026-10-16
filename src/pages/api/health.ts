import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const responseData = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  // Structured JSON logging for CloudWatch / central logs
  console.log(JSON.stringify({
    level: 'INFO',
    endpoint: '/api/health',
    method: 'GET',
    status: 200,
    timestamp: responseData.timestamp,
  }));

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
