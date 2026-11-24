# Study the complete SaveLoop code without getting overwhelmed

The source code is already separated into small files. Follow this learning order, **running the result and editing one thing at a time**. Each unit has a question to answer and a practical check.

## Part 1 — How the app starts

1. `client/index.html` — locate the `<div id="root"></div>` element.
2. `client/src/main.jsx` — see where React mounts the `App` component.
3. `client/src/App.jsx` — understand the authentication listener and global toast provider.
4. `client/src/routes/AppRouter.jsx` — follow how a URL maps to a page.
5. `client/src/layouts/*.jsx` — learn `<Outlet />` and shared page structure.

**Your check:** Change the landing hero text in `LandingPage.jsx`; confirm it updates in the browser without reloading the dev server.

## Part 2 — Design and reusable components

1. `client/src/index.css` — inspect `:root` tokens and `.btn`, `.panel`, `.app-shell` and `@media` rules.
2. `components/common/Brand.jsx` and `Button.jsx` — understand props, class composition and Motion hover effects.
3. `components/layout/Sidebar.jsx` — read the `NavLink` array and active link styling.
4. `components/layout/Topbar.jsx` — see how user actions connect to routes.

**Your check:** Change `--rust` or `.btn-primary` colors, then verify the entire site remains consistent.

## Part 3 — React state and services

1. `client/src/store/authStore.js` — user, loading, login, logout and profile update.
2. `client/src/services/api.js` — Axios and `Authorization: Bearer ...`.
3. `client/src/store/bookmarkStore.js` — how state is updated after saving or editing.
4. `client/src/services/bookmarkService.js` — switches between demo/local and live/backend mode.
5. `client/src/services/demoService.js` — easy way to study CRUD with localStorage before MongoDB.

**Your check:** Add a bookmark in demo mode, refresh, edit its title, then delete it.

## Part 4 — Backend startup and data

1. `server/src/server.js` — server startup sequence.
2. `server/src/config/db.js` — MongoDB connection.
3. `server/src/config/firebaseAdmin.js` — trusted server Firebase SDK.
4. `server/src/app.js` — middleware and routes.
5. `server/src/models/Bookmark.js` — Mongoose schema, indexes and the per-user duplicate key.

**Your check:** After configuring MongoDB and Firebase, inspect your Atlas `bookmarks` collection when you add a link.

## Part 5 — Bookmark request from start to finish

1. `components/bookmarks/BookmarkForm.jsx` — form fields, validation, async submit handler.
2. `bookmarkStore.js` — sends data to the service and updates state.
3. `bookmarkService.js` — makes POST `/api/bookmarks` using Axios.
4. `server/src/routes/bookmarkRoutes.js` — matches POST request.
5. `server/src/middleware/authenticate.js` — reads and verifies the Firebase ID token.
6. `server/src/validators/schemas.js` — validates body fields.
7. `server/src/controllers/bookmarkController.js` — checks category ownership/duplicate, creates DB document.
8. `server/src/services/platformService.js` + `urlUtils.js` + `hashtagUtils.js` — data processing.
9. `server/src/models/Bookmark.js` — persists in MongoDB.

**Your check:** Use Postman to POST the same URL twice. The second should return 409.

## Part 6 — User/admin security

1. `server/src/models/User.js` — MongoDB role/status fields.
2. `server/src/middleware/authenticate.js` — only valid, active Firebase users can access APIs.
3. `server/src/middleware/requireAdmin.js` — reject users without admin role.
4. `server/src/routes/adminRoutes.js` — all operations behind admin guard.
5. `server/scripts/promoteAdmin.js` — admin promotion runs offline on a trusted server.

**Your check:** A normal user's token must return 403 for `/api/admin/stats`.

## Part 7 — Search, AI, RAG

1. `server/src/services/searchService.js` — exact title/tag/platform/date/status filters.
2. `server/src/services/categorySuggestService.js` — safe rules-based AI fallback.
3. `server/src/services/queryParserService.js` — extract filters from natural sentences.
4. `server/src/services/ragService.js` — retrieve matching user-owned DB records and optionally vectors.
5. `server/src/services/aiProviderService.js` — optionally call LLM and embedding API.
6. `client/src/components/ai/FloatingAI.jsx` — render answer plus real URLs.

**Your check:** Save one React link with a useful title and tags. Ask the assistant for React tutorials, and confirm the source URL is identical to the one saved.

## Part 8 — Reminders, admins, deployment

1. `server/src/controllers/reminderController.js` and `RemindersPage.jsx` — add, reschedule, complete and delete.
2. `server/src/controllers/adminController.js` and admin pages — aggregate stats without private user data.
3. `docs/POSTMAN_TESTS.md` — test success, validation errors and forbidden cross-user access.
4. `README.md` — Firebase, MongoDB, Vercel, Render and optional vector index setup.

**Your check:** Run `npm test`, `npm run build`, and then use a real browser to verify each user/admin route in live mode.
