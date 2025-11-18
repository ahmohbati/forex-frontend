**Project**
- **Name**: `forex-frontend` — a React + Vite frontend for a forex exchange demo project.
- **Purpose**: local development, UI exploration, and lightweight integration tests with mocked API responses.

**Prerequisites**
- **Node.js**: v16+ (v22 tested here).
- **npm**: bundled with Node.

**Quick Start**
- Install dependencies:

```powershell
npm install
```

- Start development server:

```powershell
npm run dev
```

- Open the app in your browser at `http://localhost:5173` (Vite will pick another port if 5173 is in use).

**Available Scripts**
- `npm run dev` : Run Vite dev server.
- `npm run build`: Build production bundle.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint over the codebase.
- `npm test` : Run unit tests (Vitest).

**Project Structure (important files)**
- `index.html` — Vite entry HTML.
- `src/main.jsx` — React bootstrap (starts MSW worker in development).
- `src/App.jsx` — Routes and top-level app component.
- `src/index.css` — Tailwind entry (`@tailwind base; @tailwind components; @tailwind utilities;`).
- `vite.config.js` — Vite configuration and proxy settings.
- `postcss.config.js` — PostCSS + Tailwind configuration.
- `src/lib/api.js` — Axios instance (reads `VITE_API_URL`).
- `src/mocks/browser.js` — MSW browser worker (development only).
- `src/lib/api.test.js` — Example unit test using `axios-mock-adapter`.

**Environment / Configuration**
- To change the backend URL used by the client, set `VITE_API_URL` in an `.env` file at the project root (e.g. `.env` or `.env.local`):

```text
VITE_API_URL=http://localhost:3000
```

When running `vite` the client will use `import.meta.env.VITE_API_URL` at runtime.

**Styling (Tailwind CSS)**
- This project uses Tailwind CSS. `src/index.css` contains the Tailwind directives. PostCSS and the Tailwind plugin are configured in `postcss.config.js`.
- If your editor flags `@tailwind` or `@apply` as unknown, that's the editor/linters not recognizing PostCSS/Tailwind rules — builds still succeed when PostCSS is configured correctly.

**Mocking and Tests**
- Development mocking: MSW (Mock Service Worker) is used for browser development. The worker is started in `src/main.jsx` when `import.meta.env.DEV` is true.
- Unit tests: Vitest + `axios-mock-adapter` are used for Node-based unit tests to avoid MSW Node runtime ESM/CJS complications encountered during development.

Run tests (PowerShell):

```powershell
npm test
# or run a single file
npx vitest run src/lib/api.test.js --run --reporter verbose
```

Capture machine-readable results (JSON):

```powershell
npx vitest run --reporter json > vitest-results.json
```