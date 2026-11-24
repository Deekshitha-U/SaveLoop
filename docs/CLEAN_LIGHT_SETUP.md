# SaveLoop — Clean Light Edition (built from your uploaded project)

This is your existing full-stack application, not a new unrelated starter template. All React pages, Express routes, MongoDB models, Firebase integration, AI services, document guides, and the package-lock.json are retained.

## What was fixed

1. **Light theme actually works** — the original `src/store/uiStore.js` omitted the `theme`, `toggleTheme`, and `setTheme` fields even though the top bar attempted to use them. It now defaults to **Light** and remembers the choice locally.
2. **Background is light** — cream/white panels with subtle peach accents. Dark mode remains available from the top-right switch.
3. **Welcome popup after successful login** — already implemented in `LoginPage.jsx`; retained and styled to follow the selected theme. The signup screen also shows a success message and friendly errors.
4. **Subtle animation** — only a small tooltip on desktop sidebar icons, gentle button/card hover, and four faint background circles on the login screen. The larger ripple and icon rotation effects were removed.
5. **Bookmark illustrations** — a saved item's *category* chooses among 11 local illustrations (e.g., Food, Technology, Education, Design), instead of its social-media platform choosing an arbitrary decorative background. No third-party media is downloaded.
6. **Organized folders** — duplicate `layouts/Sidebar.jsx` and `layouts/Topbar.jsx` files and obsolete nested update ZIPs were removed. Live components remain under `components/layout/`.
7. **Security** — environment files and the downloaded Firebase Admin private key from the uploaded archive are NOT included in either downloadable ZIP. These files must remain on your own computer.

## Recommended: apply only the patch to your current, working project

This is the best choice because it leaves your current working `.env` files, Firebase Admin credential, MongoDB setup and `node_modules` in place.

1. Back up your current `SaveLoop` folder, or use Git to commit before replacing anything.
2. Copy `SaveLoop-Light-Fix-Only.zip` into your **existing** `SaveLoop` root folder (the folder containing `package.json`).
3. In PowerShell *from that folder*, run:

   ```powershell
   Expand-Archive -Path .\SaveLoop-Light-Fix-Only.zip -DestinationPath . -Force
   ```

4. Start backend and frontend in separate terminals:

   ```powershell
   npm run dev:server
   ```

   ```powershell
   npm run dev:client
   ```

5. Open `http://localhost:5173`, refresh with `Ctrl+Shift+R`, and try the theme switch in the top-right corner or in `/app/settings`.

If the browser kept an old theme choice and you want the default light background: click **Light** in Settings. As a last resort, open browser DevTools Console and run:

```js
localStorage.removeItem('saveloop-theme'); location.reload();
```

## If you want to start from the completely clean folder

The complete ZIP extracts a sibling folder called `SaveLoop-Clean`.

1. Extract `SaveLoop-Clean-Complete.zip` to your projects directory.
2. Copy your OWN local configuration from your previous project, without sharing it:

   ```powershell
   # Run from inside the new SaveLoop-Clean folder. Your old SaveLoop folder must be a sibling.
   Copy-Item ..\SaveLoop\client\.env .\client\.env
   Copy-Item ..\SaveLoop\server\.env .\server\.env
   Copy-Item ..\SaveLoop\server\serviceAccountKey.json .\server\serviceAccountKey.json
   ```

   If you store Firebase Admin credentials as individual environment variables, you do not need the JSON file; follow the existing `server/src/config/firebaseAdmin.js`.

3. Run from the **SaveLoop-Clean** root:

   ```powershell
   npm install
   npm run dev
   ```

4. Verify `client/.env` contains `VITE_DEMO_MODE=false` and an API URL targeting the running backend, or you will be viewing the optional browser demo instead of real data.

5. Do **not** delete `.env.example`. The `.env.example` files contain only variable names and are safe to share. `.env` and `serviceAccountKey.json` are **never** safe to share.

## Where is everything?

- **React** components: `client/src/components/`
- **Public, auth, user, admin pages:** `client/src/pages/`
- **Actual theme preference:** `client/src/store/uiStore.js`
- **Light CSS overrides:** `client/src/light-theme.css`
- **Small animation CSS:** `client/src/interaction-polish.css`
- **Login welcome toast:** `client/src/pages/auth/LoginPage.jsx`
- **Toast container styling:** `client/src/App.jsx`
- **Profile dropdown and theme switch:** `client/src/components/layout/Topbar.jsx`
- **Category art mapping:** `client/src/utils/categoryArtwork.js`
- **11 original SVG illustrations:** `client/public/category-artwork/`
- **Backend and DB logic:** `server/src/`
- **Setup, tests, architecture and original PDF:** `docs/`
- **Exhaustive file tree:** `docs/COMPLETE_FOLDER_STRUCTURE.txt`

## Protect your credentials

The uploaded ZIP contained private application configuration and a Firebase Admin service-account JSON key. They were deliberately excluded from the cleaned ZIP. Because credentials were shared in an uploaded archive, it's prudent to rotate your Firebase Admin private key and any live MongoDB database password or LLM API key that was included. Update your local `server/.env` after rotation. I have **not** changed any Firebase account password or database password for you.

## Verification and limits

- Source code syntax and all relative frontend imports were checked.
- Three stylesheets parsed; all 11 SVG assets parsed as valid XML.
- 8 backend utility tests passed.
- The full Vite production build was **not** executable in this environment because npm dependency installation was unavailable. Please run `npm install`, then `npm run build` locally.
- Firebase, MongoDB, email/password login and OpenAI API requests cannot be tested here with your private credentials. They remain in the original backend source and should be tested in your environment.
