# 🌍 EcoSphere – ESG Management Platform Frontend

This is the frontend repository for **EcoSphere**, a decoupled ESG (Environmental, Social, and Governance) management platform built using React 19, Vite, TypeScript, and TailwindCSS.

It is structured around an **Interface-Driven Architecture**, making the presentation layer completely independent of backend and database implementations.

---

## 🚀 How to Run Locally

You can run the application entirely locally on your machine without any external hosting or backend server connections.

### Windows (Quick Start)
1. Double-click the **`run-local.bat`** script in the project root.
2. The script will automatically verify Node.js, run `npm install` if `node_modules` is missing, start the Vite development server, and open `http://localhost:5173` in your default browser.

### Manual Commands (Any OS)
If you prefer running manual shell commands:

```bash
# 1. Install dependencies
npm install

# 2. Start the local dev server
npm run dev

# 3. Open http://localhost:5173 in your browser
```

---

## 🧪 Testing Locally

The repository contains testing suites for utility functions, stateful mock databases, and custom React Query hooks.

To execute tests locally:

```bash
# Run unit and integration tests
npm run test
```

---

## 📂 Project Architecture

We use a **Feature-First** structure where pages, hooks, schemas, and components are encapsulated by business domains:

```text
src/
├── app/                  # Application bootstrap, routing layout, and caching client
├── components/           # Generic presentational UI library (Buttons, tables, overlays)
├── context/              # UI contexts (e.g., Theme, simulated active user role)
├── features/             # Business modules
│   ├── dashboard/        # ESG metrics overall widgets and department comparatives
│   ├── carbon/           # Carbon Scope 1/2/3 logs ledgers and target goals
│   └── [future]/         # Placeholder directories for CSR, Governance, Gamification
├── repositories/         # Service contracts (interfaces)
└── services/             # API layer implementations
    ├── mock/             # Stateful in-memory stores simulating DB operations
    ├── adapters/         # Converts raw backend DTOs to view-ready models
    └── mockNetwork.ts    # Configures latency, timeouts, and error triggers
```

---

## 🔌 Swapping Mocks for Real API Services

To connect the frontend to a real backend REST API:
1. Implement the API service class under `src/services/api/` matching the repository interface under `src/repositories/`.
2. Open **`src/services/index.ts`** and swap the mock export instance for the new API instance.

Because custom query hooks communicate exclusively with the repository contracts, **no UI components, forms, tables, layouts, or chart configurations require any code modifications**.
