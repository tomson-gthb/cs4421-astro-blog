import { expect, test } from 'vitest';

interface Post {
  title: string;
  tags: string[];
}

export function filterPostsByTag(posts: Post[], tag: string): Post[] {
  return posts.filter(post => post.tags.includes(tag.toLowerCase()));
}

test('filterPostsByTag filters array accurately', () => {
  const mockPosts: Post[] = [
    { title: 'Post 1', tags: ['astro', 'ssr'] },
    { title: 'Post 2', tags: ['aws'] },
  ];
  const results = filterPostsByTag(mockPosts, 'astro');
  expect(results).toHaveLength(1);
  expect(results[0].title).toBe('Post 1');
});
