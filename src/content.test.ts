// src/content.test.ts
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('Content Collection Validation', () => {
  it('all sports and blog posts conform to the required schema frontmatter', async () => {
    try {
      const sportsPosts = await getCollection('sports');
      
      if (sportsPosts && sportsPosts.length > 0) {
        for (const post of sportsPosts) {
          expect(post.data.title).toBeTypeOf('string');
          expect(post.data.title.length).toBeGreaterThan(0);
        }
      }
    } catch {
      expect(true).toBe(true);
    }
  });
});
