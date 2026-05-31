import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 5000),
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',
  MAX_UPLOAD_SIZE: Number(process.env.MAX_UPLOAD_SIZE ?? 25 * 1024 * 1024),
  GROQ_API_KEY: process.env.GROQ_API_KEY ?? process.env.GROK_API_KEY ?? process.env.XAI_API_KEY ?? '',
  GROQ_BASE_URL: process.env.GROQ_BASE_URL ?? 'https://api.groq.com/openai/v1',
  GROQ_MODEL: process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
};
