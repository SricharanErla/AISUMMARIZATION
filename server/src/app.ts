import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import summarizeRoutes from './routes/summarizeRoutes';
import historyRoutes from './routes/historyRoutes';
import aiRoutes from './routes/aiRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import { env } from './config/env';

export const app = express();

app.use(helmet());
const allowedOrigins = [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174'].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser tools like curl/postman (no origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return callback(null, true);
      return callback(new Error('CORS policy: Origin not allowed'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/summarize', summarizeRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);
