import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const isHealthy = apiKey && apiKey.trim().length > 0 && !apiKey.includes('FAIL_INJECTION');

  const status = isHealthy ? 'ok' : 'error';
  const httpStatus = isHealthy ? 200 : 503; 

  const responseData = {
    status: status,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    dependencies: {
      openWeatherApi: apiKey ? 'configured' : 'missing'
    }
  };

  // Structured JSON logging with correct severity level for triage
  console.log(JSON.stringify({
    level: isHealthy ? 'INFO' : 'ERROR',
    endpoint: '/api/health',
    method: 'GET',
    status: httpStatus,
    timestamp: responseData.timestamp,
    error: isHealthy ? null : 'OpenWeather API Key dependency missing or invalidated via fault injection.'
  }));

  return new Response(JSON.stringify(responseData), {
    status: httpStatus,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

