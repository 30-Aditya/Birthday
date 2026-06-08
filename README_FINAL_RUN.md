Final run instructions
======================

1) Open Command Prompt and change to project folder:

```powershell
cd "C:\Users\adity\OneDrive\문서\Birthday"
```

2) Install dependencies:

```powershell
npm install
```

3) Start demo server (saves orders to `server/data/orders.json`):

```powershell
npm run start-server
```

4) In another terminal, start the dev server:

```powershell
npm run dev
```

5) Open http://localhost:5173

Build & Preview:

```powershell
npm run build
npm run preview
```

Deploy to Vercel:
- Push to GitHub and import repository to Vercel. Use `build` command `npm run build` and output `dist`.
