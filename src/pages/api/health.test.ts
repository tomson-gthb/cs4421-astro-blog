import { expect, test } from 'vitest';

// Simulated API handler
export async function GET() {
  return new Response(JSON.stringify({ status: 'healthy' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

test('Health endpoint returns 200 OK and healthy status', async () => {
  const response = await GET();
  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.status).toBe('healthy');
});
