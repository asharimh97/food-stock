import { describe, it, expect } from 'vitest';
import { calculateBestBefore } from './shelfLife';

describe('Shelf Life Logic', () => {
	it('calculates fresh red meat correctly (3 days)', () => {
		const bestBefore = calculateBestBefore(
			'2024-01-01T00:00:00.000Z',
			'red_meat',
			'fresh',
			'chiller'
		);
		expect(new Date(bestBefore).toISOString().startsWith('2024-01-04')).toBe(true);
	});

	it('calculates frozen red meat correctly (180 days)', () => {
		const bestBefore = calculateBestBefore(
			'2024-01-01T00:00:00.000Z',
			'red_meat',
			'frozen',
			'freezer'
		);
		const expected = new Date('2024-01-01T00:00:00.000Z');
		expected.setDate(expected.getDate() + 180);
		expect(bestBefore).toBe(expected.toISOString());
	});

	it('handles packaged food opened state correctly (6 days)', () => {
		const bestBefore = calculateBestBefore(
			'2024-01-01T00:00:00.000Z',
			'packaged',
			'opened',
			'shelf'
		);
		expect(new Date(bestBefore).toISOString().startsWith('2024-01-07')).toBe(true);
	});

	it('prioritizes user expiry for packaged food if shorter', () => {
		const bestBefore = calculateBestBefore(
			'2024-01-01T00:00:00.000Z',
			'packaged',
			'opened',
			'shelf',
			'2024-01-05T00:00:00.000Z'
		);
		expect(new Date(bestBefore).toISOString().startsWith('2024-01-05')).toBe(true);
	});

	it('uses user expiry for non-packaged food if provided', () => {
		const bestBefore = calculateBestBefore(
			'2024-01-01T00:00:00.000Z',
			'red_meat',
			'fresh',
			'chiller',
			'2024-01-10T00:00:00.000Z'
		);
		expect(bestBefore).toBe('2024-01-10T00:00:00.000Z');
	});
});
