# SummitAI

AI-first summarization platform for text, files, YouTube transcripts, and audio.

## Architecture
- Monorepo with npm workspaces (`client`, `server`)
- Frontend (`client`): React + Vite + Tailwind + Axios
- Backend (`server`): Express + TypeScript + Multer
- AI providers: Groq primary path with OpenAI fallback, runtime fallback if no provider keys are available

## Clean Project Structure
```text
AISUMMARIZATION/
   client/
      src/
      index.html
      vite.config.ts
      package.json
   server/
      src/
      uploads/
      package.json
   package.json
   README.md
```

Generated artifacts (`dist`, `*.tsbuildinfo`, generated `vite.config.js` files) are intentionally excluded from source control.

## Features
- Text summarization (`short`, `medium`, `detailed`)
- Output formats (`paragraph`, `bullets`, `highlights`)
- File summarization (PDF, DOCX)
- YouTube transcript summarization
- Audio transcription + summarization
- Assistant Q&A on generated content

## Environment Setup
1. Copy env templates:
- `server/.env.example` -> `server/.env`
- `client/.env.example` -> `client/.env`

2. Configure server keys in `server/.env`:
- `GROQ_API_KEY` (recommended)
- `OPENAI_API_KEY` (optional fallback)
- `CLIENT_URL` must match your deployed frontend origin exactly in production

3. Configure frontend API base in `client/.env`:
- `VITE_API_BASE_URL=http://localhost:5000/api`
- You can also use `VITE_API_URL`, but `VITE_API_BASE_URL` is the canonical name

## Perfect Local Workflow
Install once from monorepo root:

```bash
npm install
```

Start both apps:

```bash
npm run dev
```

Useful commands:

```bash
npm run dev:server
npm run dev:client
npm run clean
npm run build
npm run rebuild
npm run lint
npm run verify
```

## Verification Checklist
- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`
- Summarize endpoint: `POST /api/summarize/text`

If `http://localhost:5000/` returns 404, that is expected (root route is not a UI route).

## Deployment
### Backend (Render)
- Root directory: `server`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Required env:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `CLIENT_URL=https://your-vercel-app.vercel.app`
   - `GROQ_API_KEY=<optional but recommended>`
   - `OPENAI_API_KEY=<optional fallback>`

Backend routes:
- `GET /` returns a simple JSON status payload
- `GET /api/health` is the preferred health check
- `POST /api/summarize/text` is the main summarize endpoint

### Frontend (Vercel)
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Required env:
   - `VITE_API_BASE_URL=https://your-render-backend.onrender.com`
   - or `VITE_API_BASE_URL=https://your-render-backend.onrender.com/api`

The frontend normalizes the backend URL, so either form works.

### Deployment Checklist
1. Deploy the backend on Render first.
2. Set `CLIENT_URL` on Render to the exact Vercel production origin.
3. Set `VITE_API_BASE_URL` on Vercel to the Render backend URL.
4. Redeploy Vercel after changing frontend env vars.
5. Confirm `https://your-render-backend.onrender.com/api/health` returns `200 OK`.
6. If you see a root `404`, that is no longer expected after the root route fix.
