import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const start = Date.now();
  const response = await next();
  const duration = Date.now() - start;

  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    method: context.request.method,
    url: context.url.pathname,
    status: response.status,
    responseTimeMs: duration,
  }));

  return response;
});
