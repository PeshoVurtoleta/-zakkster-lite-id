# @zakkster/lite-id

[![npm version](https://img.shields.io/npm/v/@zakkster/lite-id.svg?style=for-the-badge&color=latest)](https://www.npmjs.com/package/@zakkster/lite-id)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@zakkster/lite-id?style=for-the-badge)](https://bundlephobia.com/result?p=@zakkster/lite-id)
[![npm downloads](https://img.shields.io/npm/dm/@zakkster/lite-id?style=for-the-badge&color=blue)](https://www.npmjs.com/package/@zakkster/lite-id)
[![npm total downloads](https://img.shields.io/npm/dt/@zakkster/lite-id?style=for-the-badge&color=blue)](https://www.npmjs.com/package/@zakkster/lite-id)
![TypeScript](https://img.shields.io/badge/TypeScript-Types-informational)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Low-GC, deterministic ID generator. A faster, seedable alternative to nanoid.

## Why lite-id?

| Feature | lite-id | nanoid | uuid | cuid2 |
|---|---|---|---|---|
| **Deterministic mode** | **Yes (seeded)** | No | No | No |
| **Shared buffer reuse** | **Yes** | No | No | No |
| **Crypto-secure mode** | **Yes** | Yes | Yes | Yes |
| **SSR fallback** | **Yes** | Partial | Yes | Yes |
| **Zero-dependency secure** | Needs lite-random | Yes | Yes | No |
| **Bundle size** | **~0.5KB** | ~0.7KB | ~2KB | ~2KB |

## Installation

```bash
npm install @zakkster/lite-id
```

## Quick Start

```javascript
import { liteId, seed } from '@zakkster/lite-id';

// Secure (crypto-backed)
const id = liteId();        // "Xk9_mBqRtLzN2vP4wHs7a"
const short = liteId(8);    // "k9_mBqRt"

// Deterministic (seeded)
seed(42);
const a = liteId(12, true); // Always the same for seed 42
seed(42);
const b = liteId(12, true); // b === a guaranteed
```

## Recipes

### Entity IDs in a Game Loop

```javascript
import { liteId, seed } from '@zakkster/lite-id';
seed(gameState.seed);
const bulletId = liteId(8, true); // Deterministic across clients
```

### React Key Generation

```javascript
const items = data.map(item => ({
    ...item,
    key: liteId(10), // Cryptographically unique
}));
```

### Deterministic Test Fixtures

```javascript
beforeEach(() => seed(12345));
test('creates user', () => {
    const id = liteId(21, true); // Same ID every test run
});
```

## API

| Export | Description |
|---|---|
| `liteId(len?, deterministic?)` | Generate an ID. Default: 21 chars, crypto-secure. |
| `seed(n)` | Seed the deterministic RNG. |

## License

MIT
