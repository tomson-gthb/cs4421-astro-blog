import { expect, test } from 'vitest';

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

test('formatDate formats ISO strings correctly', () => {
  expect(formatDate('2026-06-15')).toBe('Jun 15, 2026');
});
