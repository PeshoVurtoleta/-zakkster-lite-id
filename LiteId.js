/**
 * @zakkster/lite-id — Low-GC, Deterministic ID Generator
 *
 * A faster, deterministic-capable alternative to nanoid.
 * Uses an auto-growing shared buffer to minimize allocations.
 *
 * Two modes:
 *   - Secure: crypto.getRandomValues (default)
 *   - Deterministic: lite-random seeded PRNG (for replays, tests, SSR)
 *
 * Depends on: @zakkster/lite-random
 */

import { Random } from '@zakkster/lite-random';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

let _buf = new Uint8Array(256);
let _rng = null;

function getBuffer(len) {
    if (len > _buf.length) _buf = new Uint8Array(len);
    return _buf;
}

const _crypto = typeof globalThis !== 'undefined' && globalThis.crypto ? globalThis.crypto : null;

/**
 * Seed the deterministic RNG.
 * Same seed = same sequence of IDs.
 * @param {number} s
 */
export function seed(s) {
    if (!_rng) _rng = new Random(s);
    else _rng.reset(s);
}

/**
 * Generate a random ID.
 *
 * Note: Falls back to non-cryptographic PRNG if WebCrypto is unavailable.
 * Do not use for secure tokens in unsupported environments.
 *
 * @param {number}  [len=21]
 * @param {boolean} [deterministic=false]
 * @returns {string}
 */
export function liteId(len = 21, deterministic = false) {
    let out = '';

    if (deterministic) {
        if (!_rng) _rng = new Random(42);
        for (let i = 0; i < len; i++) out += ALPHABET[(_rng.next() * 64) | 0];
        return out;
    }

    if (!_crypto) {
        if (!_rng) _rng = new Random(Date.now());
        for (let i = 0; i < len; i++) out += ALPHABET[(_rng.next() * 64) | 0];
        return out;
    }

    const buf = getBuffer(len);
    _crypto.getRandomValues(buf.subarray(0, len));
    for (let i = 0; i < len; i++) out += ALPHABET[buf[i] & 63];
    return out;
}

export default liteId;
