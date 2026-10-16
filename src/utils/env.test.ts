import { expect, test } from 'vitest';

export function getServerPort(envPort?: string): number {
  return envPort ? parseInt(envPort, 10) : 4321;
}

test('getServerPort uses default port when undefined', () => {
  expect(getServerPort(undefined)).toBe(4321);
  expect(getServerPort('8080')).toBe(8080);
});
