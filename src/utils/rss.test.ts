import { expect, test } from 'vitest';

export function formatRssItem(post: { title: string; slug: string; date: string }) {
  return {
    title: post.title,
    link: `/posts/${post.slug}`,
    pubDate: new Date(post.date).toUTCString(),
  };
}

test('formatRssItem creates expected RSS structure', () => {
  const item = formatRssItem({ title: 'Hello', slug: 'hello', date: '2026-01-01' });
  expect(item.link).toBe('/posts/hello');
  expect(item.title).toBe('Hello');
  expect(item.pubDate).toContain('2026');
});
