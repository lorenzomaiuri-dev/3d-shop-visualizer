# 3d-shop-visualizer: Local-First 3D Product Configurator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**3d-shop-visualizer** is a high-performance web application demonstrating a modern approach to e-commerce interfaces. It combines **Real-time 3D Rendering (WebGL)** with a **Local-First Data Layer (SQLite-WASM)** to provide a seamless, low-latency user experience without the need for a traditional backend.

This project was developed for the _Technologies for web applications_ course, focusing on modularity, clean architecture, and the synergy between WebAssembly and modern frontend frameworks.

---

## 🚀 Key Features

- **Interactive 3D Viewport**: Real-time product visualization using **Three.js** and **React Three Fiber**.
- **Dynamic SQL Configuration**: Product variants, materials, and pricing are managed via an in-browser **SQLite (WASM)** database.
- **PBR Rendering**: High-fidelity materials (Physically Based Rendering) with environment mapping and post-processing effects.
- **Responsive & Accessible UI**: A mobile-first interface built with Tailwind CSS and Framer Motion for fluid transitions.
- **Zero-Latency Interactions**: Instant UI updates by querying the local database instead of awaiting network requests.
- **AR/VR/XR Mode** _(Experimental)_: Immersive product preview via the **WebXR Device API**, powered by `@react-three/xr`.

> ⚠️ **AR/VR/XR — Experimental Feature**
>
> The immersive AR mode relies on the [WebXR Device API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API), which is still evolving and **not supported by all browsers or devices**.
>
> **Requirements:**
>
> - A [WebXR-compatible browser](https://caniuse.com/webxr) (Chrome for Android 79+, Samsung Internet, Meta Browser; desktop support is limited)
> - A device with AR hardware support (ARCore on Android, or a VR headset)
> - The page must be served over **HTTPS** (or `localhost`)
>
> On unsupported platforms the AR button will either be hidden or non-functional — the rest of the application works normally regardless.

---

## 🛠 Tech Stack

- **Core**: [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **3D Engine**: [Three.js](https://threejs.org/) via [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Data Layer**: [SQLite-Wasm](https://sqlite.org/wasm) for relational data persistence in the browser.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (for lightweight global state).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/).
- **Tooling**: [Vite](https://vitejs.dev/) for bundling, [Vitest](https://vitest.dev/) for unit testing.
- **CI/CD**: GitHub Actions for automated linting, testing, and deployment to GitHub Pages.

---

## 🏗 Architecture

The project follows **Clean Architecture** principles to ensure separation of concerns and maintainability:

```text
src/
├── assets/             # Static files (icons, images)
├── components/         # Shared UI components (buttons, layouts, etc.)
├── features/           # Feature-based modules
│   ├── configurator/   # 3D Configurator logic,  UI
│   └── catalog/        # Product listing and search logic
├── hooks/              # Shared React hooks
├── pages/              # Full-feature pages for routes
├── services/           # SQLite-Wasm initialization and DB drivers
├── store/              # Global state (Zustand stores)
├── types/              # Global TypeScript interfaces
└── utils/              # Helper functions (formatters, constants)
```

## 📄 Documentation

| Document                                                             | Description                                                                    |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [Architecture — Runtime View](docs/ARCHITECTURE.md)                  | Sequence diagrams for startup, configurator, variant selection, and cart flows |
| [ADR-0001 — SQLite-WASM](docs/adr/0001-sqlite-wasm-local-first.md)   | Why SQLite in the browser instead of a backend                                 |
| [ADR-0002 — Zustand](docs/adr/0002-zustand-state-management.md)      | Why Zustand instead of Redux or React Context                                  |
| [ADR-0003 — Repository pattern](docs/adr/0003-repository-pattern.md) | Why the repository + DI container abstraction                                  |

---

## 💎 Code Quality & Development Workflow

To maintain high professional standards, the project implements:

- Conventional Commits: Enforced via @commitlint to ensure a readable and structured git history.
- Git Hooks: Managed by Husky to run linters and formatters before every commit.
- Automated Linting: ESLint and Prettier (with lint-staged) to guarantee code consistency and prevent errors.

### The Data Layer (Local-First SQL)

The application leverages **SQLite compiled to WebAssembly**. Upon initialization, the database is seeded with product metadata. When a user selects a configuration (e.g., color or material), the application executes an optimized SQL query to fetch the corresponding texture paths and price adjustments, decoupling the UI from the raw data source.

---

## 🛠 Development & Deployment

### Prerequisites

- Node.js (v18+)
- pnpm or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/lorenzomaiuri-dev/3d-shop-visualizer.git

# Install dependencies
pnpm install # or npm install

# Start development server
pnpm dev # or npm run dev
```

### Build & Deploy

```bash
# Production build
pnpm build # or npm run build

# Linting & Formatting
pnpm lint # or npm run lint
pnpm format # or npm run format
```
