import { expect, test } from 'vitest';

export function getReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

test('getReadingTime calculates correct duration', () => {
  const shortText = 'word '.repeat(100); // 100 words
  expect(getReadingTime(shortText)).toBe('1 min read');
  
  const longText = 'word '.repeat(500); // 500 words
  expect(getReadingTime(longText)).toBe('3 min read');
});
