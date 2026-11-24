# Page-to-page workflows

## Public flow

Landing `/` → Login `/login` or Signup `/signup` → Firebase Authentication → `POST /api/users/sync` → role-aware redirection.

Forgot password: `/forgot-password` → Firebase password reset email (live mode only).

## User flow

Dashboard → New Save → Add URL and details → Analyse Link (rule-based category) → choose a category → Save → Bookmark detail → Open original URL (new tab).

Library → search/filter/sort → details → edit/status/priority → archive or delete.

Categories → create/rename/delete → assign categories while saving/editing.

Reminders → choose saved bookmark → schedule → mark completed/reschedule/delete.

AI bubble (all user pages) → question → backend derives structured filters → MongoDB user-owned results → optional vector retrieval → optional grounded AI answer → clickable real links.

Profile/Settings → update display name, reset password, sign out.

## Admin flow

Trusted admin account → `/admin` → aggregate stats (users/bookmarks/platform mix) → `/admin/users` → search account → `/admin/users/:id` → view role/account status/aggregate count → disable/reactivate (never expose private user bookmark text or URLs).

Role assignment is NOT available in the public UI. Use the trusted server script described in `README.md`.
