import { api } from './api';

export const aiService = {
  chat: async (payload: { context: string; question: string }) => {
    const { data } = await api.post('/ai/chat', payload);
    return data as { answer: string; sources: string[] };
  },
  keywords: async (payload: { text: string }) => {
    const { data } = await api.post('/ai/keywords', payload);
    return data as { keywords: string[] };
  },
  sentiment: async (payload: { text: string }) => {
    const { data } = await api.post('/ai/sentiment', payload);
    return data as { sentiment: string; score: number; explanation: string };
  },
};
