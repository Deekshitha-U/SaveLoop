# SaveLoop — every source file explained

**How to study this project:** Begin with `client/src/main.jsx` → `App.jsx` → `routes/AppRouter.jsx` → a layout → a page → its service/store. Then follow the backend call `server/src/app.js` → route → middleware → controller → service → model.

All paths below match this project archive exactly. No generated `node_modules` or `dist` files are included; install them using npm.

## 1. Working example: how adding a bookmark works

1. `AddBookmarkPage.jsx` renders `BookmarkForm.jsx`.
2. `BookmarkForm.jsx` validates the entered URL and calls `useBookmarkStore.create` or `useBookmarkStore.update`.
3. `bookmarkStore.js` calls `bookmarkService.js`. In demo mode that calls `demoService.js`; in live mode Axios calls the Express API.
4. `api.js` attaches the Firebase ID token. `authenticate.js` verifies it and identifies the signed-in user.
5. `bookmarkRoutes.js` invokes `bookmarkController.js`; Zod validation runs before the controller.
6. `urlUtils.js` normalizes the link, `platformService.js` detects website type, `hashtagUtils.js` normalizes tags, and category lookup validates ownership.
7. `Bookmark.js` saves data in MongoDB and enforces a per-user duplicate index. Optional embedding logic runs if OpenAI is configured.
8. The controller returns the newly saved bookmark to React, and the page navigates to its detail view.

## 2. Authentication and roles (study this before the admin code)

Firebase Auth signs in the person. A verified ID token is sent to the backend. MongoDB `User.js` owns the **role** and **status**. `ProtectedRoute.jsx` is a visual navigation guard, but real security is `authenticate.js` and `requireAdmin.js` on the backend.

## 3. Source file inventory

### Root

- `.gitignore` — Prevents uploading Node dependencies, secrets and compiled output.
- `README.md` — Full setup, demo/live modes, MongoDB, Firebase, admin, AI, deployment and troubleshooting.
- `package.json` — Root npm workspaces: installs client/server packages and starts both dev servers.

### Frontend configuration

- `client/.env.example` — Frontend environment template: demo mode, API URL and public Firebase web config.
- `client/index.html` — HTML entry, fonts, viewport, page title and root mounting element.
- `client/package.json` — React, Vite, Tailwind, Motion, Firebase, Axios, Router and Zustand dependencies.
- `client/public/favicon.svg` — SaveLoop gradient-friendly browser icon.
- `client/src/App.jsx` — Bootstraps Firebase/demo authentication and global toast messages.
- `client/src/config/firebase.js` — Initializes client Firebase only when credentials are present; exposes DEMO_MODE.
- `client/src/index.css` — All design tokens, black/rust-orange styling, animations and responsive breakpoints.
- `client/src/main.jsx` — Mounts the React App into #root; imports global CSS.
- `client/vercel.json` — SPA fallback for React Router routes when deployed to Vercel.
- `client/vite.config.js` — Vite configuration, React plugin, Tailwind v4 plugin and dev port.

### Frontend components

- `client/src/components/ai/FloatingAI.jsx` — Animated assistant drawer/bubble, chat and clickable DB result cards.
- `client/src/components/bookmarks/BookmarkCard.jsx` — Bookmark visual card with title/status/tags/date, open/edit/delete actions.
- `client/src/components/bookmarks/BookmarkFilters.jsx` — Search, category, platform, status, sort and date controls.
- `client/src/components/bookmarks/BookmarkForm.jsx` — Add/edit link form: analyse, suggest category, status, priority, tags, reminder.
- `client/src/components/common/Brand.jsx` — Reusable infinity-style SaveLoop brand link.
- `client/src/components/common/Button.jsx` — Reusable animated CTA/ghost/danger buttons using Motion.
- `client/src/components/common/ConfirmDialog.jsx` — Reusable animated modal for destructive actions.
- `client/src/components/common/EmptyState.jsx` — Empty list/search UI with optional action link.
- `client/src/components/common/Input.jsx` — Accessible labeled form control with hint/error states.
- `client/src/components/common/Loader.jsx` — Centered spinner while page data or authentication is loading.
- `client/src/components/common/PageHeader.jsx` — Animated page heading, subtitle and action slot.
- `client/src/components/common/PlatformIcon.jsx` — Maps detected platforms to Lucide icons.
- `client/src/components/common/StatCard.jsx` — Hover-animated metric card for dashboards.
- `client/src/components/layout/Sidebar.jsx` — Shared role-based sidebar with responsive mobile overlay and sign out.
- `client/src/components/layout/Topbar.jsx` — Responsive top navigation, search, demo badge, quick save and profile.

### Frontend layouts/routes

- `client/src/layouts/AdminLayout.jsx` — Admin sidebar/topbar + nested admin route.
- `client/src/layouts/AuthLayout.jsx` — Two-column themed marketing panel + login/signup forms.
- `client/src/layouts/PublicLayout.jsx` — Landing header/footer wrapped around public routes.
- `client/src/layouts/UserLayout.jsx` — Sidebar/topbar + nested user route and floating AI.
- `client/src/routes/AdminRoute.jsx` — Restricts /admin route tree to users whose server role is admin.
- `client/src/routes/AppRouter.jsx` — Declares every public, auth, user, admin and error route.
- `client/src/routes/ProtectedRoute.jsx` — Redirects unauthenticated users to login; waits for auth readiness.

### Frontend pages

- `client/src/pages/admin/AdminDashboardPage.jsx` — Aggregate user/bookmark statistics and safe recent-user table.
- `client/src/pages/admin/AdminSettingsPage.jsx` — Admin security, account details, reset password and logout.
- `client/src/pages/admin/AdminUserDetailPage.jsx` — View account status and permitted disable/reactivate action.
- `client/src/pages/admin/AdminUsersPage.jsx` — Searchable table of account metadata and aggregate counts.
- `client/src/pages/auth/ForgotPasswordPage.jsx` — Firebase email password-reset flow.
- `client/src/pages/auth/LoginPage.jsx` — Firebase email/password login and demo role preview buttons.
- `client/src/pages/auth/SignupPage.jsx` — Firebase signup form, password confirmation and profile creation.
- `client/src/pages/errors/NotFoundPage.jsx` — Friendly 404 fallback.
- `client/src/pages/errors/UnauthorizedPage.jsx` — User-facing error screen for admin-only access.
- `client/src/pages/public/LandingPage.jsx` — Hero, animated library preview, features, supported platforms, steps, CTA.
- `client/src/pages/user/AddBookmarkPage.jsx` — Page wrapper for new bookmark form.
- `client/src/pages/user/BookmarkDetailPage.jsx` — Full saved link data with original URL, safe external open, edit/delete.
- `client/src/pages/user/BookmarksPage.jsx` — Searchable/filterable grid/list, delete confirmation and quick create.
- `client/src/pages/user/CategoriesPage.jsx` — Create, rename, delete, and choose parent categories.
- `client/src/pages/user/DashboardPage.jsx` — Personal stats, decorative activity chart, category overview, recent saves.
- `client/src/pages/user/EditBookmarkPage.jsx` — Fetches bookmark by ID then reuses BookmarkForm.
- `client/src/pages/user/ProfilePage.jsx` — View and update personal account name and bookmark count.
- `client/src/pages/user/RemindersPage.jsx` — Create, list, complete and delete in-app reminders.
- `client/src/pages/user/SearchPage.jsx` — Structured API search plus natural-language AI launcher.
- `client/src/pages/user/SettingsPage.jsx` — Theme presentation, privacy details, password link and logout.

### Frontend services/stores/utilities

- `client/src/assets/README.md` — Place original or licensed images here in future releases.
- `client/src/hooks/README.md` — Reserved folder for custom reusable React hooks.
- `client/src/services/adminService.js` — Admin stats/account queries and account status updates.
- `client/src/services/aiService.js` — Category suggestions, AI chat and authenticated chat history API.
- `client/src/services/api.js` — Axios base URL, timeout, automatic Firebase Bearer token and error handling.
- `client/src/services/authService.js` — Firebase login/signup/reset/logout and profile synchronization.
- `client/src/services/bookmarkService.js` — Switches bookmark CRUD between demo and protected backend REST API.
- `client/src/services/categoryService.js` — Switches category CRUD between demo and backend API.
- `client/src/services/demoService.js` — Fictional browser-local preview data with CRUD/search/category/reminder/AI methods.
- `client/src/services/reminderService.js` — Switches reminder CRUD between demo and backend API.
- `client/src/services/searchService.js` — Uses dedicated GET /api/search endpoint (demo or backend).
- `client/src/store/aiStore.js` — Zustand chat panel visibility, messages, history and async sending.
- `client/src/store/authStore.js` — Zustand user profile/session state and Firebase auth state listener.
- `client/src/store/bookmarkStore.js` — Zustand shared bookmarks and CRUD actions.
- `client/src/store/categoryStore.js` — Zustand category list and CRUD actions.
- `client/src/store/uiStore.js` — Zustand responsive sidebar and grid/list preference.
- `client/src/utils/dateUtils.js` — Human-readable saved/reminder dates and datetime-local input conversion.
- `client/src/utils/platformUtils.js` — Friendly platform names and safe HTTP(S) external-link checking.

### Backend configuration/models

- `server/.env.example` — Private server config template for DB, Firebase, allowed CORS and AI.
- `server/package.json` — Express, MongoDB, Firebase Admin, validation, security and test scripts.
- `server/src/app.js` — Express CORS, headers, request limits, endpoints, health check, errors.
- `server/src/config/aiConfig.js` — Central optional OpenAI models and MongoDB vector index settings.
- `server/src/config/db.js` — Connects to MongoDB Atlas using Mongoose.
- `server/src/config/firebaseAdmin.js` — Initializes Firebase Admin from service-account JSON or environment variables.
- `server/src/models/Bookmark.js` — MongoDB bookmark, per-user indexes, saved time, tags, category, status and embedding.
- `server/src/models/Category.js` — Per-user dynamic category with optional parent.
- `server/src/models/ChatMessage.js` — Per-user chat transcript and source bookmark IDs.
- `server/src/models/Reminder.js` — Per-user bookmark reminder, due date and completion flag.
- `server/src/models/User.js` — MongoDB user profile, UID, server-controlled role/status and preferences.
- `server/src/server.js` — Loads env, initializes Firebase Admin, connects MongoDB, starts HTTP server.

### Backend controllers/routes

- `server/src/controllers/adminController.js` — Aggregated platform stats and admin-controlled account metadata/status.
- `server/src/controllers/aiController.js` — Category suggestion, retrieval-grounded chat and chat history.
- `server/src/controllers/bookmarkController.js` — CRUD with validated URL, per-user ownership, duplicates, tags, embeddings.
- `server/src/controllers/categoryController.js` — CRUD per-user categories, parent validation, preserve bookmarks on delete.
- `server/src/controllers/reminderController.js` — CRUD reminders with bookmark owner checks and populated details.
- `server/src/controllers/searchController.js` — Returns per-user structured search results.
- `server/src/controllers/userController.js` — Syncs Firebase user to MongoDB; seeds defaults; reads/updates own profile.
- `server/src/routes/adminRoutes.js` — Only admin middleware can access statistics and account actions.
- `server/src/routes/aiRoutes.js` — POST /ai/categorize/chat, GET history, AI rate limits.
- `server/src/routes/bookmarkRoutes.js` — Routes for /api/bookmarks CRUD (authentication mounted at app).
- `server/src/routes/categoryRoutes.js` — Routes for /api/categories CRUD.
- `server/src/routes/reminderRoutes.js` — Routes for /api/reminders CRUD.
- `server/src/routes/searchRoutes.js` — GET /api/search.
- `server/src/routes/userRoutes.js` — Routes for /api/users/sync and /me (token-verified).

### Backend middleware/services/utils

- `server/src/middleware/authenticate.js` — Verifies Firebase ID token, loads MongoDB user, blocks disabled sessions.
- `server/src/middleware/errorHandler.js` — Normalizes database and request errors into safe JSON responses.
- `server/src/middleware/requireAdmin.js` — Checks MongoDB role=admin on every admin API call.
- `server/src/middleware/validateRequest.js` — Zod request body validation middleware.
- `server/src/services/aiProviderService.js` — Optional API calls to OpenAI for embeddings and grounded summaries.
- `server/src/services/categorySuggestService.js` — Keyword/hashtag classification with manual Uncategorised fallback.
- `server/src/services/embeddingService.js` — Generates/stores text embeddings for new or edited bookmarks if configured.
- `server/src/services/metadataService.js` — Safe metadata fallback; explicitly never fetches arbitrary user URLs.
- `server/src/services/platformService.js` — Detects a platform using exact host/subdomain matching; creates fallback title.
- `server/src/services/queryParserService.js` — Interprets natural-language platform, status, priority, date and keyword filters without database access.
- `server/src/services/ragService.js` — Parses natural-language filters, retrieves authorized lexical/vector results.
- `server/src/services/searchService.js` — Builds scoped MongoDB filters, validates dates, sorts and limits results.
- `server/src/utils/asyncHandler.js` — Wraps async Express handlers and forwards errors.
- `server/src/utils/hashtagUtils.js` — Normalizes and deduplicates up to 15 hashtags.
- `server/src/utils/httpError.js` — Creates HTTP errors with correct status and human-readable message.
- `server/src/utils/urlUtils.js` — Validates/normalizes HTTP(S) URL, strips tracking and blocks local hosts.
- `server/src/validators/schemas.js` — Zod field schemas: bookmarks, category, reminder, chat, profile, admin.

### Backend scripts/tests

- `server/scripts/promoteAdmin.js` — Trusted one-off command to grant a legitimate account admin role.
- `server/tests/utils.test.js` — Native Node tests for platform, URL, tag, category and AI-query helpers.

### Documentation

- `docs/ARCHITECTURE.md` — Frontend/auth/backend/database architecture and boundaries.
- `docs/DESIGN_SYSTEM.md` — Color palette, fonts, motion and layout rules.
- `docs/FEATURE_CHECKLIST.md` — Checklist covering setup, security, CRUD, AI, admin and deployment.
- `docs/POSTMAN_TESTS.md` — HTTP endpoint examples and negative cross-account tests.
- `docs/USER_ADMIN_FLOWS.md` — User/admin click-through flows from landing to actions.
- `docs/mongodb-vector-index.json` — Atlas Vector Search index for 1536-dimension embeddings + UID filter.

## 4. Reading roadmap

**Start here:** `main.jsx` → `App.jsx` → `AppRouter.jsx` → `PublicLayout.jsx` → `LandingPage.jsx` → `AuthLayout.jsx` → `LoginPage.jsx`.

**Learn user CRUD:** `UserLayout.jsx` → `BookmarkCard.jsx` + `BookmarkForm.jsx` → `bookmarkStore.js` → `bookmarkService.js` → `bookmarkRoutes.js` → `bookmarkController.js` → `Bookmark.js`.

**Learn AI:** `FloatingAI.jsx` → `aiStore.js` → `aiService.js` → `aiRoutes.js` → `aiController.js` → `ragService.js` → `aiProviderService.js`.

**Learn admins/security:** `AdminLayout.jsx` → `AdminUsersPage.jsx` → `adminService.js` → `adminRoutes.js` → `requireAdmin.js` → `adminController.js`.

## 5. What code to edit for a change

- New color or animation: `client/src/index.css`.
- New sidebar item: `Sidebar.jsx`, add route in `AppRouter.jsx`, create a `pages/...` file.
- New MongoDB field: `models/Bookmark.js`, `validators/schemas.js`, `controllers/bookmarkController.js`, `components/bookmarks/BookmarkForm.jsx`, plus demo model.
- New API operation: route → auth/validator → controller → service → client service → React UI.
- New AI provider: implement its integration in `aiProviderService.js`, keeping all API keys server-side.

## 6. Honesty about the scope

`DEMO_MODE=true` is a **browser-only preview**, not a production backend. Live auth requires Firebase, live data requires MongoDB, and embeddings require both an AI API key and Atlas Vector Search setup. Do not mark an integration complete until you test it.

## 7. Additional project references

- `docs/FOLDER_STRUCTURE.txt` — exact generated folder/file tree of the source archive.
- `docs/UI-reference/approved-landing-concept.png` — approved visual layout for the landing page.
- `docs/UI-reference/approved-login-concept.png` — approved visual layout for login.
- `docs/UI-reference/README.md` — clarifies that the images are conceptual mockups, not runtime screenshots.
- `docs/USER_ADMIN_FLOWS.md` — complete page navigation workflows.
- `docs/STEP_BY_STEP_LEARNING_PLAN.md` — progressive exercises explaining how React, Zustand, API, MongoDB and AI code connect.
- `docs/Original_SaveLoop_Blueprint.pdf` — original 12-page user-provided specification for comparison.
