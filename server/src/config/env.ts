import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 5000),
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',
  MAX_UPLOAD_SIZE: Number(process.env.MAX_UPLOAD_SIZE ?? 25 * 1024 * 1024),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
};
