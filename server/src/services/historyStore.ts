import { randomUUID } from 'crypto';

export interface RuntimeSummaryRecord {
  id: string;
  originalText: string;
  summarizedText: string;
  summaryType: 'short' | 'medium' | 'detailed';
  summaryLength: 'paragraph' | 'bullets' | 'highlights';
  keywords: string[];
  sentiment: string;
  title: string;
  language: string;
  source: 'text' | 'file' | 'youtube' | 'audio';
  createdAt: string;
}

const runtimeHistory: RuntimeSummaryRecord[] = [];

export const historyStore = {
  list: () => runtimeHistory.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  add: (entry: Omit<RuntimeSummaryRecord, 'id' | 'createdAt'>) => {
    const record: RuntimeSummaryRecord = {
      ...entry,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    runtimeHistory.unshift(record);
    return record;
  },
  remove: (id: string) => {
    const index = runtimeHistory.findIndex((item) => item.id === id);
    if (index >= 0) {
      runtimeHistory.splice(index, 1);
      return true;
    }
    return false;
  },
  clear: () => {
    runtimeHistory.length = 0;
  },
};