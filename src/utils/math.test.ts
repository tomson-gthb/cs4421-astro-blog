import {expect, test} from 'vitest';
import {add} from './math.ts';

test('add functions correctly calculates the sum of two numbers', () => {
	expect(add(2,3)).toBe(5);
});

test('ensure the sum of 3 and 5 not equal to 4 ', () => {
	expect(add(3,5)).not.toBe(4);
});

