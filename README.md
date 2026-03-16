# Enterprise Turborepo (TypeScript)

A high‑performance monorepo setup using **Turborepo**, **pnpm workspaces**, and **TypeScript**.
This template provides a scalable foundation for modern TypeScript‑based applications, with shared packages and isolated app environments.

## 🚀 Features

- **Turborepo** for task orchestration and caching
- **pnpm workspaces** for fast, disk‑efficient dependency management
- **TypeScript** across all apps and packages
- **Modular architecture** with `apps/*` and `packages/*`
- **Shared UI package** for component reuse
- Ready for frameworks like **Next.js**, **Express**, or any TS runtime

## 📂 Project Structure

```
.
├── apps/
│   └── web/          # Example web app (Next.js placeholder)
├── packages/
│   └── ui/           # Shared UI components
├── turbo.json        # Turborepo pipeline config
├── pnpm-workspace.yaml
└── package.json
```

## 🛠️ Scripts

### Root scripts
| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all dev servers in parallel |
| `pnpm build` | Build all apps & packages |
| `pnpm lint` | Run linting across the monorepo |

### App-level scripts
Each app/package may define its own `dev`, `build`, and `lint` scripts.

## 📦 Adding New Apps or Packages

Create a new app:

```
mkdir apps/api
pnpm init -y
```

Create a new shared package:

```
mkdir packages/utils
pnpm init -y
```

Then reference it using:

```json
"dependencies": {
  "utils": "workspace:*"
}
```

## 🧩 UI Package

The `ui` package exports shared components:

```
packages/ui/
├── index.ts
└── package.json
```

Import it anywhere in the monorepo:

```ts
import { Button } from "ui";
```

## ⚡ Getting Started

Install dependencies:

```
pnpm install
```

Run development:

```
pnpm dev
```

Build everything:

```
pnpm build
```

## 📄 License

MIT — feel free to use this template for personal or commercial projects.
