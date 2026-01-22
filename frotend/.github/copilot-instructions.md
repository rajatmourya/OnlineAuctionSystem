# Copilot instructions (online_auction_system frontend)

## Big picture

- This is a Create React App (CRA) single-page app using React Router. Routes are defined in [src/App.js](src/App.js).
- UI is organized by pages under [src/pages](src/pages) (each page has `Page.js` + `Page.css`) and shared components under [src/components](src/components) (e.g. [src/components/Navbar/Navbar.js](src/components/Navbar/Navbar.js)).
- Backend communication goes through Axios via a single configured instance in [src/api/axiosConfig.js](src/api/axiosConfig.js); feature-specific API calls live in [src/services](src/services).

## Dev workflows

- Install deps: `npm install`
- Run dev server: `npm start` (CRA, http://localhost:3000)
- Run tests (watch): `npm test`
- Production build: `npm run build`

## Backend/API integration

- Axios base URL is hard-coded to `http://localhost:8081/api` in [src/api/axiosConfig.js](src/api/axiosConfig.js). If the backend host/port changes, update it there.
- Auth token: request interceptor reads `localStorage.getItem('loggedUser')`, parses JSON, and sends `Authorization: Bearer <token>` when `loggedUser.token` exists.
- 401 handling: response interceptor clears `loggedUser` + `role` and redirects to `/user-login`.

## Auth + roles (convention)

- Pages commonly read the current user via `JSON.parse(localStorage.getItem('loggedUser'))` and gate access by `loggedUser.role`.
- Role values appear in multiple casings (e.g. `buyer`/`BUYER`, `admin`/`ADMIN`, `seller`). When implementing new role checks, handle both existing casings to match current behavior.

## Service patterns (how to add/change endpoints)

- Services import the shared axios instance and use an `API_BASE` constant, e.g. [src/services/transactionService.js](src/services/transactionService.js), [src/services/invoiceService.js](src/services/invoiceService.js).
- Many services map frontend field names to backend DTOs (example: `createAuction` in [src/services/auctionService.js](src/services/auctionService.js) maps `startPrice` → `startingPrice`, wraps `image` into `images: [image]`, converts `endDate` → ISO `endTime`). Preserve these mappings when extending endpoints.
- Errors are typically rethrown as `error.response?.data || error.message`; UI pages often display `err?.error || err?.message`.

## UI/data-flow conventions

- Pages fetch data in `useEffect`, then enrich lists by calling other services (example: Orders enriches transactions with auction + seller data in [src/pages/Orders/Orders.js](src/pages/Orders/Orders.js)).
- Local storage helpers exist in [src/services/storageService.js](src/services/storageService.js) (`getJson`, `setJson`, `upsertBy`). Prefer them when you need safe JSON parsing.

## Common gotchas

- Avoid adding duplicate exports (ESM will fail at build time); keep one `export default` per module.
- Backend date fields vary (`endTime` vs `endDate`); pages often use `a.endTime || a.endDate`.
