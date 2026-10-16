import { expect, test } from 'vitest';

export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}

test('getTotalPages computes page counts correctly', () => {
  expect(getTotalPages(25, 10)).toBe(3);
  expect(getTotalPages(10, 10)).toBe(1);
  expect(getTotalPages(0, 10)).toBe(0);
});
