import OpenAI from 'openai';
import { env } from '../config/env';

const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export const openai = client;

export const hasOpenAI = Boolean(client);

export const getJsonFromModel = async <T>(system: string, user: string): Promise<T> => {
  if (!client) {
    throw new Error('OpenAI is not configured');
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });

  const content = response.choices[0]?.message?.content ?? '{}';
  // Try to parse strictly, otherwise attempt to recover a JSON object substring
  try {
    return JSON.parse(content) as T;
  } catch (err) {
    // attempt to extract first JSON object in the text
    const match = content.match(/\{[\s\S]*\}/m);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch (err2) {
        throw new Error(`Failed to parse JSON from model output. Raw output: ${content}`);
      }
    }
    throw new Error(`Model output was not valid JSON. Raw output: ${content}`);
  }
};
