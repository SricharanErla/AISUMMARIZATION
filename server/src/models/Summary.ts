import { Schema, model, type Document, Types } from 'mongoose';

export interface ISummary extends Document {
  userId: Types.ObjectId;
  originalText: string;
  summarizedText: string;
  summaryType: 'short' | 'medium' | 'detailed';
  summaryLength: 'paragraph' | 'bullets' | 'highlights';
  keywords: string[];
  sentiment: string;
  title: string;
  language: string;
  source: 'text' | 'file' | 'youtube' | 'audio';
  createdAt: Date;
}

const summarySchema = new Schema<ISummary>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    originalText: { type: String, required: true },
    summarizedText: { type: String, required: true },
    summaryType: { type: String, enum: ['short', 'medium', 'detailed'], required: true },
    summaryLength: { type: String, enum: ['paragraph', 'bullets', 'highlights'], required: true },
    keywords: [{ type: String }],
    sentiment: { type: String, default: 'neutral' },
    title: { type: String, default: '' },
    language: { type: String, default: 'en' },
    source: { type: String, enum: ['text', 'file', 'youtube', 'audio'], default: 'text' },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Summary = model<ISummary>('Summary', summarySchema);
