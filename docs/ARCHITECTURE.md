# SaveLoop architecture

```text
React + Vite (frontend)
 ├── React Router: public/user/admin page layouts
 ├── Zustand: auth, bookmarks, categories, AI UI, general UI
 ├── Motion: entrance/hover/floating chat animations
 └── Axios: Firebase ID token → backend REST endpoints
                         │
                         ▼
Node.js + Express (backend)
 ├── Firebase Admin SDK: verify valid identity token
 ├── MongoDB Users: role/status check (admin-only middleware)
 ├── Mongoose controllers: bookmarks/categories/reminders/search
 ├── URL and hashtag validation (server-owned)
 ├── Rule-based category suggestion
 └── AI service (optional)
      ├── Embeddings via provider API
      ├── MongoDB Atlas Vector Search over accessible user records
      └── LLM response grounded on authorized matching results
                         │
                         ▼
MongoDB Atlas collections
 Users | Bookmarks | Categories | Reminders | ChatMessages
```

Every bookmark, category, reminder and chat message has the verified Firebase UID (`userId`) and queries constrain results to that value. No API accepts an arbitrary userId as the source of authority. Admin endpoints only expose aggregates and user account metadata.

### Why Firebase **and** MongoDB?
Firebase handles identity and password login. MongoDB stores all application data. Bookmark data is NOT duplicated in Firebase Firestore.

### Bookmark data model
- `userId`: verified Firebase UID
- `url`, `canonicalUrl`: exact external link/reference
- `platform`: detected from hostname
- `title`, `notes`, `tags`, `categoryId`, `categoryName`: searchable metadata
- `status`: pending, completed, archived
- `priority`: low, normal, high (supports the blueprint's high-priority query example)
- `savedAt`: server-generated timestamp
- `embedding` / `embeddingStatus`: optional semantic search

### Security tradeoffs
- Arbitrary user URLs are **not fetched** by the server, so this MVP avoids SSRF risks from metadata scraping.
- Remote preview images and third-party media downloads are not used.
- Access checks use Firebase token verification + MongoDB user status/role.
- Bookmark/category/reminder data is scoped per user.
- Rate limits apply to API calls, especially AI endpoints.
- For true production scaling, add pagination, a bounded queue for embeddings, retry logic, structured audit logs, full monitoring, stronger input policies, E2E tests and a managed notification service.
