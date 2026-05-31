# ADR-0001 — SQLite-WASM as the local-first data layer

**Status:** Accepted  
**Date:** 2026-06

---

## Context

The application needs to store and query relational data (products, variants, cart items) with support for filtering, joins, and price computation. The typical approach would be a REST/GraphQL backend backed by a server-side database.

However, the project's constraints and goals pointed away from that:

- **No backend requirement** — the course project must be deployable as a static site (GitHub Pages).
- **Low-latency UX** — every product variant switch should feel instant; round-trip network latency would be noticeable.
- **Relational data model** — products, variants, and cart rows have foreign-key relationships; a plain JSON file or `localStorage` key-value store would require manual join logic.

Alternatives considered:

| Option                                   | Pros                                          | Cons                                                                  |
| ---------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------- |
| REST backend (e.g. Express + PostgreSQL) | Persistent data, multi-user                   | Requires hosting, network latency, out of scope                       |
| `localStorage` / `IndexedDB` (raw)       | Browser-native, persistent                    | No SQL, manual joins, poor DX                                         |
| **SQLite-WASM (`sql.js`)**               | Full SQL in-browser, zero backend, relational | ~1 MB WASM payload, in-memory only (data lost on refresh), async init |
| Dexie.js (IndexedDB wrapper)             | Persistent, lighter than WASM                 | No SQL, schema migrations are manual                                  |

---

## Decision

Use **`sql.js`** (SQLite compiled to WebAssembly) as the data layer, initialized once at application startup and seeded with static product data.

The database lives entirely in memory: it is created fresh on each page load from a deterministic seed script. This is acceptable because the product catalogue is read-only and the cart is session-scoped (no account system).

The initialization is encapsulated in `src/services/database.ts` behind a `getDb()` accessor. All repository code reaches the DB only through this accessor, never directly — making a future migration to IndexedDB or a real backend a localised change.

---

## Consequences

**Positive:**

- Zero backend infrastructure; deploys as a fully static site.
- All data operations are synchronous from the application's perspective (after the async init).
- Full SQL expressiveness: JOINs, aggregates, and future migrations via `ALTER TABLE`.
- Completely testable in Node/Vitest with no network or service dependencies.

**Negative / trade-offs:**

- The WASM binary (~1 MB) adds to the initial load. Mitigated by lazy initialization — the binary is fetched after the first render.
- Data is **not persisted** across page reloads. Acceptable for a demo/course project; a production version would persist the DB binary to IndexedDB using the OPFS adapter.
- Async initialization creates a startup race condition: components that mount before `initDatabase()` resolves must guard against a null DB handle (see `useCartStore.fetchItems`).
