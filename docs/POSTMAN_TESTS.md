# Postman tests — SaveLoop REST API

## Authentication

Every protected API endpoint requires header:

```http
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
Content-Type: application/json
```

Get a short-lived ID token from a **real logged-in Firebase session**. In browser DevTools → Network, select an authorized request to your backend and inspect its `Authorization` header. Do not share tokens publicly and do not commit exported Postman credentials.

## Health (public)

`GET http://localhost:5000/api/health` → `200` and `{ "status": "ok" }`.

## Account profile

1. `POST /api/users/sync` → creates safe default user role. No request body needed.
2. `GET /api/users/me` → name, email, role, status.
3. `PATCH /api/users/me` body `{ "name":"Test User" }` → updates profile.

## Bookmarks — live examples

1. `POST /api/bookmarks` body:
   ```json
   { "url":"https://react.dev/reference/react/hooks", "title":"React Hooks", "notes":"Study for frontend interviews", "tags":["react","hooks","interview"], "status":"pending", "priority":"high" }
   ```
   Expect `201` and bookmark ID.
2. Repeat same URL → `409` duplicate.
3. `GET /api/bookmarks` → contains the new bookmark.
4. `GET /api/bookmarks/BOOKMARK_ID` → owner can read.
5. `PATCH /api/bookmarks/BOOKMARK_ID` body `{ "status":"completed" }` → updated status.
6. `GET /api/bookmarks?platform=website&status=completed&priority=high` → filtered.
7. `GET /api/search?q=React` → structured search.
8. `DELETE /api/bookmarks/BOOKMARK_ID` → deleted, subsequent GET `404`.

## Categories

1. `GET /api/categories`
2. `POST /api/categories` body `{ "name":"Backend Engineering" }`
3. `PATCH /api/categories/CATEGORY_ID` body `{ "name":"Node.js Backend" }`
4. `DELETE /api/categories/CATEGORY_ID` — existing bookmarks remain but become Uncategorised.

## Reminders

1. `POST /api/reminders` body `{ "bookmarkId":"YOUR_BOOKMARK_ID", "remindAt":"2027-01-01T10:00:00+05:30" }`.
2. `GET /api/reminders`
3. `PATCH /api/reminders/REMINDER_ID` body `{ "completed": true }`
4. `DELETE /api/reminders/REMINDER_ID`

## AI

1. `POST /api/ai/categorize` body `{ "url":"https://react.dev/", "tags":["#react","#javascript"] }` → category suggestions.
2. `POST /api/ai/chat` body `{ "message":"Find my saved React resources" }` → `bookmarks[]` contains only actual database IDs/URLs.
3. `GET /api/ai/history` → authenticated user's latest 30 messages.
4. Remove all matching test bookmarks and retry → message clearly says no matches.
5. Without `OPENAI_API_KEY`, exact search and category suggestions still work.

## Admin

1. `GET /api/admin/stats` (admin only) → counts.
2. `GET /api/admin/users` (admin only) → account management data.
3. `GET /api/admin/users/MONGO_USER_ID` (admin only) → account and aggregate bookmark count, **not saved URLs/notes**.
4. `PATCH /api/admin/users/MONGO_USER_ID` body `{ "status":"disabled" }` → `200` for allowed target.

## Security tests — MUST PASS

- Without Authorization header: protected routes return `401`.
- With a normal user's valid token: `/api/admin/stats` returns `403`.
- With another account's bookmark ID: `GET/PATCH/DELETE /api/bookmarks/:id` return `404`.
- With another account's category ID: editing/deletion returns `404`.
- With another account's reminder ID: editing/deletion returns `404`.
- With `javascript:` URL or `http://127.0.0.1`: creating a bookmark returns `400`.
- With fake admin role included in request body: user role remains `user`; no endpoint exposes role updates.
- Admin account attempting to disable itself: `400`.
- Authenticated disabled account: protected routes return `403`.
- Backend should **not fetch arbitrary pasted URLs** or store restricted third-party media.

## Expected limitations

In-app reminders are displayed when a user visits the app; no push/email scheduler is present. OpenAI and Vector Search require optional keys/indexes, and embeddings for old bookmarks are not automatically backfilled.
