# SaveLoop — Clean Light Edition

**Start here:** [`docs/CLEAN_LIGHT_SETUP.md`](docs/CLEAN_LIGHT_SETUP.md). This cleaned project was based on the full SaveLoop folder you uploaded, retains your real backend and all source files, and defaults to a working light theme. Private `.env` files and service-account keys are intentionally excluded.

---

# SaveLoop — AI-Powered Personal Content Organisation & Intelligent Retrieval

> **Save once. Find anytime. Rediscover everything.**

A complete **MERN + Zustand + Firebase + AI/RAG** source-code project designed from the supplied 12-page SaveLoop blueprint and the approved **black + rust-orange** UI mockup.

The source includes a **frontend demo mode** (browse pages and practice CRUD without credentials) and a **live full-stack mode** (Firebase Authentication + MongoDB Atlas + Express API). AI embeddings and MongoDB Vector Search are optional enhancements to the working core.

## 1. Easiest way to see the UI — DEMO MODE

Requirements: Node.js 20.19+ or 22.12+, npm, VS Code.

Open the **root `SaveLoop-Full-Project` folder** in VS Code, then run these commands in the terminal:

```powershell
npm install
Copy-Item client/.env.example client/.env
npm run dev:client
```

Open `http://localhost:5173`.

**What to click:** Home → Login → **Preview user dashboard** or **Preview admin dashboard**.

Demo mode has fictional example bookmarks, an interactive save/edit/delete flow, categories, reminders, a simple rule-based chat preview, charts and admin account previews. They are stored in your browser's localStorage so they remain after refresh. This is **not a real account or backend**; the UI clearly shows **DEMO MODE**. Do not judge production access control based on demo mode.

> If you already ran `npm create vite@latest client -- --template react` inside another folder, do **not** create another Vite app inside this ZIP. This project **already contains** the Vite setup and all required files. You can replace your unfinished starter with the ZIP's `client/` folder after backing up your work.

## 2. Run the LIVE MERN project

### 2.1 Create MongoDB Atlas database

1. Visit https://cloud.mongodb.com. Create a project and a database deployment.
2. **Database Access → Add New Database User**. Select username/password. Set a strong password; do not use `<>` angle brackets in the URI.
3. **Network Access → Add IP Address**. Add your current development IP. For deployment, use a compatible Atlas access policy that restricts exposure appropriately.
4. Open your cluster → **Connect → Drivers → Node.js**. Copy the connection string and replace `<password>` with the database user's **URL-encoded** password. Use database `saveloop`.
5. Keep the connection string ONLY in `server/.env`.

### 2.2 Configure Firebase Authentication (web client)

1. Visit https://console.firebase.google.com and create a Firebase project.
2. **Build → Authentication → Sign-in method → Email/Password → Enable**.
3. **Project Settings (gear icon) → General → Your apps → Add web app `</>`**.
4. Copy values such as `apiKey`, `authDomain`, `projectId`, `appId`, `storageBucket`, `messagingSenderId` into `client/.env` with the `VITE_FIREBASE_` prefixes.
5. Set `VITE_DEMO_MODE=false`.
6. Under **Authentication → Settings → Authorized domains**, add your frontend deployment hostname when deploying.

Firebase web configuration is intended for client use. **The Firebase service account private key is a secret**, and must ONLY exist on the backend.

### 2.3 Configure Firebase Admin SDK (server)

1. Firebase Console → **Project Settings → Service accounts → Generate new private key**.
2. Download the JSON and save it at `server/serviceAccountKey.json`. **Do not put it under `client/` or commit it to GitHub.**
3. In `server/.env` set `FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json`.
4. Alternatively, for Render, set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` and escaped `FIREBASE_PRIVATE_KEY` environment variables instead. Remove the path variable if using this approach.

### 2.4 Environment files

Windows PowerShell commands from the project root:

```powershell
Copy-Item client/.env.example client/.env
Copy-Item server/.env.example server/.env
```

Edit `client/.env`:

```dotenv
VITE_DEMO_MODE=false
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_APP_ID=your-web-app-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
```

Edit `server/.env`:

```dotenv
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://USERNAME:URL_ENCODED_PASSWORD@cluster.example.mongodb.net/saveloop
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
OPENAI_API_KEY=
```

**Start both servers:**

```powershell
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend health check: http://localhost:5000/api/health
- Register your own account, log in, save real bookmarks, and explore the user dashboard.

Node.js versions: Vite officially supports 20.19+ and 22.12+. https://vite.dev/guide/ . This repo pins Vite 6-compatible package ranges to reduce setup churn. Tailwind v4 uses the `@tailwindcss/vite` plugin; there is **no `tailwind.config.js` required** for the current styling. https://tailwindcss.com/docs/installation/using-vite .

## 3. Create the first ADMIN account

All new registrations are **ordinary users**. Admin access must be granted by a trusted server-side operation.

1. Register through the live frontend, then log in once so your profile exists in MongoDB.
2. Firebase Console → **Authentication → Users** → copy the account's **Firebase UID**.
3. Open a separate terminal in `server`:

```powershell
cd server
node scripts/promoteAdmin.js YOUR_FIREBASE_UID
```

4. Log out and log in again. Navigate to `/admin` to view the admin dashboard.

Do NOT expose the script as a public API. Do NOT allow users to choose their own role on signup. The backend checks MongoDB roles on every admin request.

## 4. Important routes

**Public:** `/`, `/login`, `/signup`, `/forgot-password`.

**User:** `/app/dashboard`, `/app/bookmarks`, `/app/bookmarks/new`, `/app/bookmarks/:id`, `/app/bookmarks/:id/edit`, `/app/categories`, `/app/search`, `/app/reminders`, `/app/profile`, `/app/settings`.

**Admin:** `/admin`, `/admin/users`, `/admin/users/:id`, `/admin/settings`.

**Error pages:** `/unauthorized` and custom 404 page.

## 5. Core SaveLoop logic

### Saving a resource

1. User enters an HTTP/HTTPS link and optionally title/notes/hashtags.
2. Backend validates/normalizes the URL and detects platform from host.
3. Safe URL-derived title fallback — **no arbitrary URL scraping**.
4. Category suggestions use rule-based keywords; the user can always choose a category manually.
5. Duplicate check (`userId` + `canonicalUrl`) runs in MongoDB.
6. Save bookmark with **server-created `savedAt` timestamp**.
7. If OpenAI API access is configured, generate a short-text embedding (otherwise skip gracefully).

### Structured search

The backend filters bookmarks by the Firebase-authenticated UID. It can search title, notes, tags, category, platform, status, date range and priority. The frontend provides grid/list browsing and sort controls.

### AI / RAG

The assistant interprets common structured questions (e.g. "Find pending YouTube React resources"), performs database lookup, and returns **actual stored bookmark URLs**. If an OpenAI key and a MongoDB Vector Search index are configured, it also tries semantic retrieval over bookmark titles, tags, and user notes. It passes retrieved metadata to the LLM to generate a grounded answer. If AI services fail, exact/keyword retrieval still works. The assistant never constructs URLs itself.

**Limitations:** A private Instagram reel with no title, notes or metadata cannot be meaningfully summarised from its opaque URL. SaveLoop stores link references, not third-party videos or private content.

## 6. Optional OpenAI + MongoDB Atlas Vector Search

Only needed after basic CRUD and Firebase authentication work.

1. Set `OPENAI_API_KEY=...` in `server/.env` (never in client env).
2. By default the backend embeds with `text-embedding-3-small` (1536 dimensions) and uses `gpt-4o-mini` for brief grounded answers. Models and API availability/costs can change; update as needed.
3. MongoDB Atlas → your `saveloop` database → `bookmarks` collection → **Search Indexes → Create Index → Vector Search**.
4. Name the index **`bookmark_vector_index`**, using definition [`docs/mongodb-vector-index.json`](docs/mongodb-vector-index.json).
5. Verify your Atlas deployment tier supports Vector Search and let the index finish building before testing semantic queries.
6. Create or edit bookmarks after setting the API key to populate their embeddings. Old bookmarks created without an AI key are **not automatically backfilled** in this MVP.
7. If AI or vector search is unavailable, normal bookmark searching still works and the server logs a warning.

MongoDB's vector search `$vectorSearch` operator is documented at https://www.mongodb.com/docs/manual/reference/operator/aggregation/vectorsearch/ .

## 7. Running tests

```powershell
npm test
npm run build
```

`npm test` runs Node's built-in test runner on URL validation, tag normalization, platform classification, category suggestion and query interpretation. The build compiles React + Vite. For protected HTTP routes, use the manual Postman checklist in [`docs/POSTMAN_TESTS.md`](docs/POSTMAN_TESTS.md).

Run the UI in your browser and verify that it works before you deploy. **A successful syntax check is not enough to prove Firebase/Atlas integration is configured.**

## 8. Deploy

### Vercel frontend

1. Push the project to GitHub.
2. Import the repo into Vercel. Set **Root Directory** to `client`.
3. Build command `npm run build`. Output folder `dist`.
4. Add `VITE_DEMO_MODE=false`, `VITE_API_URL=https://YOUR-BACKEND.onrender.com/api` and all `VITE_FIREBASE_...` web values.
5. Add the deployed frontend domain to Firebase Authentication authorized domains.
6. The included `client/vercel.json` rewrites React Router paths to `index.html`.

### Render backend

1. Create a Render Web Service from the GitHub repo with root directory `server`.
2. Build command `npm install`; start command `npm start`.
3. Add `MONGODB_URI`, `CLIENT_ORIGIN=https://YOUR-FRONTEND.vercel.app`, Firebase Admin environment variables, and optional OpenAI key.
4. Do not upload `serviceAccountKey.json` into a public repo or add secrets to the frontend.
5. Verify `https://YOUR-BACKEND.onrender.com/api/health` responds before testing the frontend.

For workspace-based monorepos, if Render/Vercel install commands have workspace issues, use install/build inside the respective service root and keep the service's package manager settings consistent.

## 9. Source layout and learning guide

- [`docs/FILE_BY_FILE_GUIDE.md`](docs/FILE_BY_FILE_GUIDE.md) — **every folder, file and its responsibility**.
- [`docs/FEATURE_CHECKLIST.md`](docs/FEATURE_CHECKLIST.md) — full feature checklist.
- [`docs/POSTMAN_TESTS.md`](docs/POSTMAN_TESTS.md) — test endpoints and cross-account security.
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — black/rust-orange UI palette and component rules.
- [`docs/mongodb-vector-index.json`](docs/mongodb-vector-index.json) — Atlas Vector Search index definition.

## 10. MVP / future feature boundary

**Included:** Landing, login/signup/reset, user dashboard, library CRUD, categories, platform detection, notes/tags, duplicate detection, search and filters, statuses/priorities, in-app reminders, profile/settings, admin counts and account management, optional AI/RAG with graceful fallback, animations and responsive UI.

**Not included in the 14-day MVP:** paid plans/pricing, direct imports of saved posts from social networks, downloading Instagram/Pinterest/YouTube media, browser extension, queue-backed embeddings, social OAuth, content transcription, email/push notification delivery, extensive automated integration/E2E testing. These are not promised in the supplied blueprint.

## 11. Troubleshooting

- **`vite` not recognized:** run `npm install` from the root and `npm run dev:client`.
- **Blank React page:** check terminal build output and browser Developer Tools console; make sure `.env` is under `client/`.
- **Firebase auth/invalid-api-key:** copy all web config values from Firebase project settings and enable Email/Password sign-in.
- **Backend `serviceAccountKey.json` missing:** place the private JSON inside `server/` and confirm the relative path in `server/.env`.
- **MongoDB `bad auth`:** Atlas database username/password is different from your Atlas login account; URL-encode special characters in URI password.
- **MongoDB timeout:** check Atlas Network Access, cluster status and your current IP.
- **CORS error:** set `CLIENT_ORIGIN` to the exact frontend origin, with no trailing `/`; restart server.
- **401 on API:** Firebase ID token missing/expired; log in again. Axios automatically attaches it.
- **403 on `/admin`:** your MongoDB user role is not `admin`; follow the trusted promotion script.
- **AI unavailable:** leave `OPENAI_API_KEY` blank and use fallback. If enabling RAG, verify Atlas vector index and embeddings.
- **Images appear as abstract gradients:** intentional. We do not copy or download social media thumbnails.

**Demo data and concept imagery are illustrative, not evidence of real accounts, analytics or provider integration.**

## 12. Approved UI design references

The images in [`docs/UI-reference/`](docs/UI-reference/) preserve the approved landing/login concept art. They are design mockups, not screenshots of the runnable application. The actual code renders responsive React pages using real components and CSS artwork.

## 13. Learn every code path in sequence

Read [`docs/STEP_BY_STEP_LEARNING_PLAN.md`](docs/STEP_BY_STEP_LEARNING_PLAN.md). It walks through React entry, layouts, Zustand, backend, database CRUD, admin security, AI/RAG and deployment with concrete exercises. The original user-supplied 12-page blueprint is preserved as [`docs/Original_SaveLoop_Blueprint.pdf`](docs/Original_SaveLoop_Blueprint.pdf).
