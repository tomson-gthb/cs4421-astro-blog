import { expect, test } from 'vitest';

export function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
}

test('slugify converts titles to valid URL slugs', () => {
  expect(slugify('Hello World! Server-Side Rendering')).toBe('hello-world-server-side-rendering');
  expect(slugify('  Astro 5.0 Release  ')).toBe('astro-50-release');
});
