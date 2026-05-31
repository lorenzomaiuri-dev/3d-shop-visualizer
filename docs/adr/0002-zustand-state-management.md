# ADR-0002 — Zustand for global state management

**Status:** Accepted  
**Date:** 2026-06

---

## Context

The application has three distinct areas of global state that must be shared across the component tree:

1. **App-level** — whether the SQLite-WASM database has finished initializing.
2. **Configurator** — currently viewed product, available variants, selected variant, computed price.
3. **Cart** — list of cart items, loading state, optimistic updates after add/remove.

Each area has async operations (DB queries) and loading/error states. The chosen solution must integrate naturally with React without adding unnecessary boilerplate.

Alternatives considered:

| Option                       | Pros                                                                                    | Cons                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| React Context + `useReducer` | Zero dependencies, built-in                                                             | Causes full subtree re-renders, verbose async patterns                       |
| **Zustand**                  | Minimal API, no Provider, fine-grained subscriptions, async actions are plain functions | Smaller ecosystem than Redux                                                 |
| Redux Toolkit                | Mature ecosystem, devtools, strict patterns                                             | Significant boilerplate (slices, thunks, selectors), overkill for this scope |
| Jotai / Recoil               | Atomic model suits fine-grained state                                                   | Less intuitive for action-based async flows                                  |

---

## Decision

Use **Zustand** for all global state.

Each store is a self-contained module (`useAppStore`, `useConfiguratorStore`, `useCartStore`) that exposes both state slices and async actions as plain `async` functions. There is no Provider to wrap the tree, and components subscribe only to the slices they use — avoiding unnecessary re-renders.

Repositories are accessed inside store actions via `getContainer()` (see ADR-0003), keeping the stores decoupled from the SQLite implementation.

---

## Consequences

**Positive:**

- No boilerplate: an async action is just an `async` function that calls `set()`.
- Components subscribe selectively: `useCartStore(state => state.items)` does not re-render when `isLoading` changes.
- Stores are straightforward to unit-test: `useStore.setState(...)` seeds state, actions are called directly.
- No `<Provider>` means stores can be accessed outside the React tree if needed (e.g. from a service).

**Negative / trade-offs:**

- Redux DevTools integration requires an extra middleware (`zustand/middleware` `devtools`) — not configured in this project.
- No enforced immutability: `set()` merges the patch, which is ergonomic but could hide bugs if object references are mutated before being passed to `set`.
