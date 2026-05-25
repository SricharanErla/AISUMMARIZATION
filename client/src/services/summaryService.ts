import { api } from './api';

export interface AnalysisResponse {
  summary: string;
  keywords: string[];
  sentiment: string;
  title: string;
  topic: string;
  language: string;
  readabilityScore: number;
  recommendations: string[];
}

export const summaryService = {
  summarizeText: async (payload: { text: string; summaryType: string; summaryLength: string; language?: string }) => {
    const { data } = await api.post('/summarize/text', payload);
    return data;
  },
  summarizeFile: async (payload: FormData) => {
    const { data } = await api.post('/summarize/file', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
    return data;
  },
  summarizeYouTube: async (payload: { url: string; summaryType: string; summaryLength: string; language?: string }) => {
    const { data } = await api.post('/summarize/youtube', payload);
    return data;
  },
  summarizeAudio: async (payload: FormData) => {
    const { data } = await api.post('/summarize/audio', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
    return data;
  },
  history: async () => {
    const { data } = await api.get('/history');
    return data as { summaries: any[] };
  },
  deleteHistory: async (id: string) => {
    const { data } = await api.delete(`/history/${id}`);
    return data;
  },
};
