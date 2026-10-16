import { expect, test } from 'vitest';

interface FrontmatterData {
  title?: string;
  date?: string;
  [key: string]: unknown;
}

export function validateFrontmatter(data: FrontmatterData): boolean {
  return Boolean(data && data.title && data.date);
}

test('validateFrontmatter accepts valid data and rejects incomplete data', () => {
  expect(validateFrontmatter({ title: 'Test', date: '2026-01-01' })).toBe(true);
  expect(validateFrontmatter({ title: 'Incomplete' })).toBe(false);
});
