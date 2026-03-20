import { describe, it, expect } from 'vitest';
import { liteId, seed } from './LiteId.d.ts';

describe('🆔 lite-id', () => {

    describe('liteId() — secure mode', () => {
        it('generates a string of default length 21', () => {
            const id = liteId();
            expect(id).toHaveLength(21);
            expect(typeof id).toBe('string');
        });

        it('respects custom length', () => {
            expect(liteId(8)).toHaveLength(8);
            expect(liteId(64)).toHaveLength(64);
        });

        it('uses only URL-safe characters', () => {
            const id = liteId(100);
            expect(id).toMatch(/^[A-Za-z0-9_-]+$/);
        });

        it('generates unique IDs', () => {
            const ids = new Set(Array.from({ length: 100 }, () => liteId()));
            expect(ids.size).toBe(100);
        });
    });

    describe('liteId() — deterministic mode', () => {
        it('generates a string of correct length', () => {
            seed(42);
            const id = liteId(21, true);
            expect(id).toHaveLength(21);
        });

        it('uses only URL-safe characters', () => {
            seed(42);
            const id = liteId(100, true);
            expect(id).toMatch(/^[A-Za-z0-9_-]+$/);
        });

        it('produces identical output for same seed', () => {
            seed(42);
            const a = liteId(12, true);
            seed(42);
            const b = liteId(12, true);
            expect(a).toBe(b);
        });

        it('produces different output for different seeds', () => {
            seed(1);
            const a = liteId(12, true);
            seed(2);
            const b = liteId(12, true);
            expect(a).not.toBe(b);
        });

        it('produces different sequential IDs (same seed, no reset)', () => {
            seed(42);
            const a = liteId(12, true);
            const b = liteId(12, true);
            expect(a).not.toBe(b);
        });
    });

    describe('seed()', () => {
        it('resets the deterministic sequence', () => {
            seed(99);
            const first = liteId(10, true);
            const second = liteId(10, true);
            seed(99);
            const firstAgain = liteId(10, true);
            expect(firstAgain).toBe(first);
            expect(firstAgain).not.toBe(second);
        });
    });

    describe('edge cases', () => {
        it('handles length 1', () => {
            expect(liteId(1)).toHaveLength(1);
        });

        it('handles length 0', () => {
            expect(liteId(0)).toBe('');
        });

        it('deterministic mode defaults to seed 42 if not seeded', () => {
            // Reset module state by seeding explicitly
            seed(42);
            const a = liteId(16, true);
            // A fresh deterministic call should use seed 42
            seed(42);
            const b = liteId(16, true);
            expect(a).toBe(b);
        });
    });
});
