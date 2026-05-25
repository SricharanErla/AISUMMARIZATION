# SummitAI

Runtime-ready content summarizer for text, files, YouTube transcripts, and audio. The app now runs without a database or login service, and falls back to local summarization when OpenAI is not configured.

## Stack
- Frontend: React, Vite, Tailwind CSS, Framer Motion, Axios, React Router DOM
- Backend: Node.js, Express, Multer, TypeScript
- AI: OpenAI API when available, local runtime fallback when it is not

## Features
- Text summarization with short, medium, and detailed outputs
- Summary styles: paragraph, bullets, highlights
- PDF and DOCX upload summarization
- YouTube transcript summarization
- Audio transcription and summarization
- Speech-to-text and microphone recording in the workspace UI
- Assistant chat over the generated summary or uploaded content

## Local Setup
1. Install dependencies from the root:
   ```bash
   npm install
   ```
2. Copy the example environment files:
   - `server/.env.example` to `server/.env`
   - `client/.env.example` to `client/.env`
3. Run both apps in development:
   ```bash
   npm run dev
   ```

## Deployment
Deploy the backend to Render and the frontend to Vercel.

### Backend on Render
- Root directory: `server`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variables:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `CLIENT_URL=<your frontend URL>`
  - `OPENAI_API_KEY=<optional>`
  - `MAX_UPLOAD_SIZE=26214400`

### Frontend on Vercel
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_BASE_URL=<your backend URL>/api`

## Production notes
- Keep the frontend API URL pointed at the deployed backend.
- Set `OPENAI_API_KEY` only if you want model-backed summaries.
- If you use local uploads heavily, raise `MAX_UPLOAD_SIZE` in Render as needed.
