# Happy Birthday Khushi

This is a Vite + React + TailwindCSS demo site made to celebrate Khushi. It includes premium animations (Framer Motion), a photo gallery, a cake-order demo (stores in localStorage), and background music.

Quick start:

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

 - Replace placeholders with local imports and add sample low-res images.
 - Add particle/fireworks animations and polish (Framer Motion + canvas). (done)
 - Add an Express demo server for `POST /api/cake-order` that saves orders to `server/data/orders.json`. (done)

Server usage
------------
To run the demo server that accepts cake orders (saves to `server/data/orders.json`):

```powershell
npm run start-server
```

That starts the server on port 4000 by default. The front-end will POST to `/api/cake-order` (relative URL) — when running the Vite dev server, use a proxy or run the server and the front-end together; the simplest is to run both terminals:

Terminal 1:
```powershell
npm run start-server
```

Terminal 2:
```powershell
npm run dev
```


Windows One‑click bootstrap
--------------------------------

I've included a Windows PowerShell bootstrap script `bootstrap-windows.ps1` and a `bootstrap.cmd` wrapper to help beginners set up the project automatically.

To run the bootstrap (from the project folder) open Command Prompt and run:

```powershell
bootstrap.cmd
```

What the bootstrap does:
- Detects whether `node` is installed and verifies the major version is >= 18.
- If `package.json` is missing it runs `npm init -y` and installs required packages.
- If `package.json` exists it runs `npm install`.
- Ensures Tailwind config exists and will run `npx tailwindcss init -p` if missing.

If Node.js is not installed the script will stop and show exact install instructions (see below).

Recommended manual commands
---------------------------
If you prefer to run commands yourself, here are the commands used by the bootstrap script.

- If Node.js is not installed, initialize Node (manual):

```powershell
winget install OpenJS.NodeJS.LTS
# or using Chocolatey (if you have choco):
choco install nodejs-lts
```

Verify installation:

```powershell
node -v
npm -v
```

- Project init (if `package.json` does not exist):

```powershell
npm init -y
npm install react react-dom framer-motion react-icons
npm install -D vite tailwindcss postcss autoprefixer @vitejs/plugin-react
npx tailwindcss init -p
```

- If `package.json` exists simply run:

```powershell
npm install
```

Run dev server:

```powershell
npm run dev
```

Build for production:

```powershell
npm run build
npm run preview
```

Where to put your five images and audio
---------------------------------------
Place your uploaded images and audio file in the `public/assets/` folder with these exact names (the app references `/assets/<name>` at runtime):

- `public/assets/khushi1.jpg`
- `public/assets/khushi2.jpg`
- `public/assets/khushi3.jpg`
- `public/assets/khushi4.jpg`
- `public/assets/khushi5.jpg`
- `public/assets/piano.mp3`

Cake preview images
--------------------
To have flavor-specific cake previews show reliably, place cake images in `public/images/cakes` with these filenames:

- `public/images/cakes/chocolate-truffle.jpg`
- `public/images/cakes/red-velvet.jpg`
- `public/images/cakes/black-forest.jpg`
- `public/images/cakes/butterscotch.jpg`

If these files are present the site will use them for the preview; otherwise it falls back to remote placeholders.

No code changes are required after copying files — the app will load local assets automatically.

Deploying to GitHub and Vercel
-----------------------------
1) Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

2) Deploy to Vercel (recommended)

- Go to https://vercel.com and sign in.
- Choose "Import Project" → pick your GitHub repository.
- Set Framework Preset to `Vite` (Vercel usually detects it). Build command: `npm run build`. Output directory: `dist`.
- Deploy — Vercel will build and host your site.

Serverless API (Vercel)
-----------------------
This project now includes a serverless API endpoint at `/api/cake-order` that Vercel will host automatically when you deploy the repository. It sends the owner a Telegram message when an order is posted.

To enable Telegram notifications in production:
1. Deploy this repo to Vercel (see steps above).
2. In your Vercel Project Settings → Environment Variables, add:
	- `TELEGRAM_BOT_TOKEN` = your bot token
	- `TELEGRAM_CHAT_ID` = the recipient's chat id
3. Redeploy. The endpoint `/api/cake-order` will now forward orders as Telegram messages.

Local testing: you can still run `node server/server.js` locally for development, but Vercel's `/api/cake-order` is recommended for production.

Alternative: Use Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

If you want, I can automatically add a `.vercelignore` and a `vercel.json` configuration.
 
Deployment & testing
--------------------
Build the production site and preview it locally:

```bash
npm run build
npm run preview
```

Publish to GitHub Pages (uses `gh-pages`):

```bash
npm install --save-dev gh-pages
npm run deploy
```

If your site will be served from a subpath (username.github.io/repo), set `VITE_BASE` before building:

```bash
VITE_BASE='/your-repo-name/' npm run build
```

API testing (local server)
--------------------------
Start the demo server:

```bash
npm run start-server
```

Then POST an order:

```bash
curl -X POST http://localhost:4000/api/cake-order \
	-H "Content-Type: application/json" \
	-d '{"name":"Test","phone":"000","flavor":"Chocolate Truffle","time":"5pm","notes":"Test"}'
```

If `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set in the environment, the server will forward the message and log the Telegram API response in its terminal.
