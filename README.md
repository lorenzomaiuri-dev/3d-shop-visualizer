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
├── services/           # SQLite-Wasm initialization and DB drivers
├── store/              # Global state (Zustand stores)
├── types/              # Global TypeScript interfaces
└── utils/              # Helper functions (formatters, constants)
```

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
