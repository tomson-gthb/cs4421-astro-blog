import { expect, test } from 'vitest';

interface PostItem {
  title: string;
  description: string;
}

export function searchPosts(posts: PostItem[], query: string) {
  const q = query.toLowerCase();
  return posts.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
}

test('searchPosts matches queries case-insensitively', () => {
  const posts = [{ title: 'AWS ECS Guide', description: 'Deploying containers' }];
  const res = searchPosts(posts, 'containers');
  expect(res).toHaveLength(1);
});
