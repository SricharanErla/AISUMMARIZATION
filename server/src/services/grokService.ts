import OpenAI from 'openai';
import { env } from '../config/env';

const client = env.GROQ_API_KEY ? new OpenAI({ apiKey: env.GROQ_API_KEY, baseURL: env.GROQ_BASE_URL }) : null;

export const groq = client;

export const hasGroq = Boolean(client);

export const hasGrok = hasGroq;

export const getJsonFromModel = async <T>(system: string, user: string): Promise<T> => {
  if (!client) {
    throw new Error('Groq is not configured');
  }

  const response = await client.chat.completions.create({
    model: env.GROQ_MODEL,
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });

  const content = response.choices[0]?.message?.content ?? '{}';
  try {
    return JSON.parse(content) as T;
  } catch {
    const match = content.match(/\{[\s\S]*\}/m);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        throw new Error(`Failed to parse JSON from model output. Raw output: ${content}`);
      }
    }
    throw new Error(`Model output was not valid JSON. Raw output: ${content}`);
  }
};