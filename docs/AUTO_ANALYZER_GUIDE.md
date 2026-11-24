# SaveLoop — URL-Only Bookmark Analysis (2026-11-22)

This enhancement works with your existing SaveLoop-Clean project. No new frontend app, database, Firebase setup, theme change, or admin changes.

## What changes for users?

1. Navigate to **Add Bookmark**.
2. Paste a full URL (YouTube, Instagram, Facebook, Pinterest, LinkedIn or any other public website).
3. SaveLoop waits briefly (~800 ms) and attempts to retrieve **permitted** metadata. You may also click **Analyse link**.
4. When the source provides metadata, the title, description, tags, and matching category can be automatically filled. The default category is selected only if it already exists in *your* categories.
5. When access is limited, a banner explains that the platform doesn't provide enough information. You can enter a title/tags manually **or save just the URL** as Uncategorised.
6. Click **Save bookmark**. If the frontend analysis was skipped, the backend also attempts metadata retrieval before storing the bookmark.
7. Your original URL remains the clickable source; no third-party video files are downloaded.

## Platform support (actual, not promises)

| Platform | What SaveLoop uses | What may be missing |
|---|---|---|
| YouTube | Free public oEmbed title; optional YouTube Data API for description and public tags | Descriptions/tags without API key; unavailable/private videos |
| Instagram/Facebook | Meta's official public oEmbed; tokenless where eligible | Post title/caption/hashtags generally **not** supplied by oEmbed |
| Pinterest | Official Pinterest API only if `PINTEREST_ACCESS_TOKEN` has required `pins:read` rights | Pins outside permitted account/access scope; shortened pin.it URLs |
| LinkedIn | URL detection and manual fallback | General post metadata requires specialised permissions; not scraped |
| Ordinary websites/GitHub/Medium | Microlink metadata API (free public endpoint or optional key) | Private sites, blocked URLs, exhausted quota, missing metadata |

**Limited access is not an error:** the user's original URL can still be saved with optional manual fields.

## Environment configuration (only the backend `server/.env`)

Keep your Firebase and MongoDB settings. Add only the optional variables you need:

```dotenv
# Strongly recommended for richer YouTube metadata:
YOUTUBE_API_KEY=
# Optional Pinterest read access from an authorised Pinterest app:
PINTEREST_ACCESS_TOKEN=
# Official Meta public oEmbed works tokenless for eligible public content:
META_GRAPH_VERSION=v27.0
META_OEMBED_ACCESS_TOKEN=
# Optional metadata provider for public web pages, free endpoint by default:
METADATA_PROVIDER=microlink
MICROLINK_API_KEY=
# Existing LLM service for smarter classification when available:
OPENAI_API_KEY=YOUR_EXISTING_KEY_IF_CONFIGURED
```

`MICROLINK_API_KEY` is optional. When absent, SaveLoop calls the provider's free `api.microlink.io` service; this is subject to provider limits. You may set `METADATA_PROVIDER=none` to disable third-party website analysis. **A link submitted for analysis/saving may be sent to Microlink's service for public-page metadata**, so don't submit private/sensitive links there.

Never place server API keys in `client/.env`. Never upload your `.env` or Firebase Admin JSON files. The optional keys are not required for basic saving; use `VITE_DEMO_MODE=false` for real MongoDB accounts.

## Run in VS Code (Windows PowerShell)

1. Back up your current `SaveLoop-Clean` folder.
2. Put `SaveLoop-Auto-Analyze-Update.zip` inside the `SaveLoop-Clean` root.
3. Extract from the **root folder**:
   ```powershell
   Expand-Archive -Path .\SaveLoop-Auto-Analyze-Update.zip -DestinationPath . -Force
   ```
4. If desired, add the optional API key(s) above to `server/.env`; keep existing settings unchanged.
5. Stop and restart **both** frontend and backend after applying code changes:
   ```powershell
   npm run dev:server
   ```
   In a second terminal:
   ```powershell
   npm run dev:client
   ```
6. Open `http://localhost:5173/app/bookmarks/new` after login.
7. Test a public YouTube video first (title), then public website, Instagram or Facebook public post (likely limited), Pinterest/LinkedIn (permissions may limit).
8. Run `npm test` from project root to execute the new mocked provider tests.

You do **not** need to install extra npm packages for these files; the Node runtime uses built-in `fetch` and the existing frontend libraries.

## Files and responsibility

- `client/src/components/bookmarks/BookmarkForm.jsx` — automatic analyse-on-paste, editable metadata, limited-access explanation, URL-only saving.
- `client/src/components/bookmarks/bookmark-analyzer.css` — small styling/transition adjustments only to the form.
- `client/src/services/demoService.js` — keeps demo mode honest; real provider integrations run only with `VITE_DEMO_MODE=false`.
- `server/src/services/metadataService.js` — only sends requests to hardcoded provider API hosts. No arbitrary URL fetching or scraping.
- `server/src/services/bookmarkAnalyzerService.js` — combines permitted metadata, existing category rules, and optional LLM classification.
- `server/src/services/aiProviderService.js` — optional OpenAI category and tag suggestions based only on available text.
- `server/src/controllers/aiController.js` — `/api/ai/categorize` uses the new analysis.
- `server/src/controllers/bookmarkController.js` — URL-only automatic enrichment on save, preserving manual changes.
- `server/src/models/Bookmark.js` — stores extracted description separately from user's notes.
- `server/src/validators/schemas.js` — accepts optional description.
- `server/src/services/searchService.js`, `server/src/services/ragService.js`, `server/src/services/embeddingService.js` — enable searching extracted descriptions.
- `server/.env.example` — documents optional credentials without containing secrets.
- `server/tests/bookmarkAnalyzer.test.js` — offline mocked tests for multiple platforms and restricted-content fallbacks.

## Things this enhancement intentionally does not do

- Does not download/rehost social-media videos or bypass private content permissions.
- Does not magically see text appearing *inside* a video from its URL.
- Does not retrieve a user's saved content collection from other social-media accounts.
- Does not auto-enrich **old** saved bookmarks; use Edit Bookmark → Analyse link for those.
- Does not bypass Firebase or admin role checks.

## Troubleshooting

- **Analyse shows limited access**: This is expected on restricted/private posts or when permitted metadata doesn't contain descriptive text. Enter some hashtags, or save the URL as Uncategorised.
- **YouTube only shows the title**: Add `YOUTUBE_API_KEY` to `server/.env` to try to retrieve permitted description and tags, then restart Express.
- **Pin details unavailable**: The official API requires a valid `pins:read` token and access to that Pin; short `pin.it` URLs are not resolved through unapproved redirects.
- **Website metadata not found**: Microlink quota/outbound networking or site's metadata may be unavailable; manual entry remains available.
- **AI suggestions look basic**: Without `OPENAI_API_KEY`, rule-based classification remains available. Even with a key, lack of accessible text means no reliable category can be inferred.
- **Save fails**: Verify the backend health endpoint and MongoDB connectivity; metadata unavailability itself must not prevent saving a valid URL.
