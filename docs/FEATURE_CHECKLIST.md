# SaveLoop complete project checklist

Check off each item only after verifying it yourself in your configured environment.

## Foundation
- [ ] Install Node.js 20.19+ or 22.12+ and Git
- [ ] Run `npm install` from project root
- [ ] Copy `client/.env.example` to `client/.env`
- [ ] Run `npm run dev:client` with `VITE_DEMO_MODE=true`
- [ ] Visit Landing, Login, Signup and Forgot Password
- [ ] Open user demo, admin demo and test mobile widths
- [ ] Verify animated buttons, cards, transitions and AI panel
- [ ] Configure Firebase web app + email/password authentication
- [ ] Configure Firebase Admin SDK server service account (private)
- [ ] Configure MongoDB Atlas and network access
- [ ] Configure backend CORS origin and `MONGODB_URI`
- [ ] Run `npm run dev` with `VITE_DEMO_MODE=false`

## Authentication and security
- [ ] Create real Firebase account
- [ ] Log in, log out, password reset
- [ ] Check Firebase ID tokens are verified by backend
- [ ] Confirm `/api/users/sync` adds user without admin privilege
- [ ] Promote trusted admin by server script only
- [ ] Ordinary user cannot call `/api/admin/*`
- [ ] Ordinary user cannot read/change another account's bookmarks by ID
- [ ] Disabled user cannot continue using protected APIs
- [ ] No secret files committed to GitHub

## Bookmarks
- [ ] Add URL, tags, title, notes, category, priority, status
- [ ] Detect YouTube, Instagram, Pinterest, Facebook, LinkedIn and website URLs
- [ ] Reject invalid or unsafe schemes
- [ ] Normalize tracking parameters, detect duplicates
- [ ] Save timestamp comes from backend
- [ ] List, view, edit, delete bookmarks
- [ ] Change pending/completed/archived status
- [ ] View original resource with `noopener noreferrer`
- [ ] Handle missing, private, or deleted original content gracefully
- [ ] Do not download third-party media

## Organisation and search
- [ ] Create, rename and delete categories
- [ ] Nested subcategories (one level in this MVP)
- [ ] Keep bookmarks when a category is deleted
- [ ] Filter by platform, category, status and date
- [ ] Search by title, notes, hashtags and priority
- [ ] Sort by newest, oldest, title
- [ ] Search returns only authenticated user's results

## AI / RAG
- [ ] Floating AI widget opens/closes
- [ ] Category suggestions work in rules-only mode
- [ ] User can manually overwrite category suggestions
- [ ] AI assistant returns actual saved MongoDB link records
- [ ] No matching results: explain clearly, do not invent URLs
- [ ] Optional: configure OpenAI API key
- [ ] Optional: configure Atlas vector index on 1536-dimensional embeddings
- [ ] Optional: verify semantic retrieval on actual notes/titles
- [ ] Fallback to lexical search if embeddings unavailable
- [ ] Verify AI cannot expose another user's records

## Reminders
- [ ] Create a reminder for a bookmark
- [ ] View upcoming and overdue reminders
- [ ] Mark reminder completed and pending
- [ ] Delete reminder
- [ ] Deleting bookmark removes related reminders

## Admin
- [ ] Admin dashboard statistics
- [ ] User management table and search
- [ ] Individual account details without private content
- [ ] Disable/reactivate account
- [ ] Cannot disable your own logged-in admin account
- [ ] All admin endpoints enforce MongoDB role checks

## Testing and deployment
- [ ] Run Node syntax checks and `npm test`
- [ ] Run `npm run build`
- [ ] Postman test each REST endpoint (see POSTMAN_TESTS.md)
- [ ] Perform negative tests for unauthorized access
- [ ] Deploy backend to Render with environment variables
- [ ] Deploy frontend to Vercel, root directory `client`
- [ ] Update frontend `VITE_API_URL` and server `CLIENT_ORIGIN`
- [ ] Test the full application from the deployed URL
- [ ] Add screenshots and demo walkthrough to your GitHub README

## Out of scope for this MVP
Automatic import of existing Instagram/YouTube/Pinterest saves; third-party video downloading; unauthorised scraping; paid billing; browser extension; realtime push/email notifications; complete SaaS monitoring.
