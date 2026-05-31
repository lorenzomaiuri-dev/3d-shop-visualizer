# ADR-0003 — Repository pattern with a DI container

**Status:** Accepted  
**Date:** 2026-06

---

## Context

Store actions and hooks need to query the SQLite database. The naive approach — calling `getDb()` and writing raw SQL directly inside Zustand actions or React components — would have several problems:

- **Untestable**: unit tests would need a real WASM-initialised database.
- **Coupled**: changing the storage backend (e.g. switching to IndexedDB or a REST API) would require touching every store and hook.
- **Scattered SQL**: no single place to audit or optimise queries.

---

## Decision

Adopt the **Repository pattern**:

- Each aggregate (Product, Variant, Cart) has a TypeScript **interface** in `src/repositories/interfaces/` that describes the operations consumers need (`findAll`, `findById`, `addItem`, etc.).
- A **concrete implementation** in `src/repositories/sqlite/` holds all the raw SQL for that aggregate.
- A **lazy singleton container** in `src/services/container.ts` wires interfaces to implementations. It is created on the first call to `getContainer()` and reused thereafter.

```
src/
├── repositories/
│   ├── interfaces/          ← contracts (IProductRepository, etc.)
│   └── sqlite/              ← SQL implementations
└── services/
    ├── database.ts          ← WASM init + getDb()
    └── container.ts         ← getContainer() → IContainer
```

Store actions depend only on the interface, never on the concrete class:

```ts
const { cartRepository } = getContainer() // returns ICartRepository
await cartRepository.findAll()
```

---

## Consequences

**Positive:**

- **Testable in isolation**: unit tests mock `getContainer` with a plain object whose methods are `vi.fn()` — no WASM needed.
- **Single responsibility**: SQL lives in one file per aggregate; stores contain no query strings.
- **Swappable backend**: replacing SQLite with IndexedDB or a REST client means writing a new concrete class and changing one line in `container.ts`.

**Negative / trade-offs:**

- **Indirection**: for a small project, three layers (interface → implementation → container) can feel like over-engineering. The payoff becomes clear in tests and in any future backend migration.
- **Type safety at the boundary**: `sql.js` returns `(string | number | null)[][]`, which must be manually mapped to typed objects. This mapping is a source of potential type drift if the SQL schema changes without updating the mapping code.
