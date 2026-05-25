import type { Response } from 'express';
import fs from 'fs/promises';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/errorResponse';
import { summarizeText } from '../services/summaryService';
import { extractTextFromUpload } from '../services/extractionService';
import { getYouTubeTranscript } from '../services/youtubeService';
import { transcribeAudio } from '../services/audioService';
import { historyStore } from '../services/historyStore';

const saveSummary = async (
  payload: {
    originalText: string;
    summarizedText: string;
    summaryType: 'short' | 'medium' | 'detailed';
    summaryLength: 'paragraph' | 'bullets' | 'highlights';
    keywords: string[];
    sentiment: string;
    title: string;
    language: string;
    source: 'text' | 'file' | 'youtube' | 'audio';
  }
) => historyStore.add(payload);

export const summarizeTextHandler = asyncHandler(async (req: any, res: Response) => {
  const { text, summaryType, summaryLength, language } = req.body as {
    text: string;
    summaryType: 'short' | 'medium' | 'detailed';
    summaryLength: 'paragraph' | 'bullets' | 'highlights';
    language?: string;
  };

  if (!text || text.trim().length < 25) {
    throw new ApiError(400, 'Text must be at least 25 characters');
  }

  const analysis = await summarizeText(text, summaryType, summaryLength, language ?? 'en');
  const summary = await saveSummary({
    originalText: text,
    summarizedText: analysis.summary,
    summaryType,
    summaryLength,
    keywords: analysis.keywords,
    sentiment: analysis.sentiment,
    title: analysis.title,
    language: analysis.language,
    source: 'text',
  });

  res.json({ summary, analysis });
});

export const summarizeFileHandler = asyncHandler(async (req: any, res: Response) => {
  const file = req.file;
  if (!file) {
    throw new ApiError(400, 'File is required');
  }

  try {
    const extractedText = await extractTextFromUpload(file.path, file.mimetype);
    if (!extractedText) {
      throw new ApiError(400, 'Could not extract text from file');
    }

    const { summaryType = 'medium', summaryLength = 'paragraph', language = 'en' } = req.body as {
      summaryType?: 'short' | 'medium' | 'detailed';
      summaryLength?: 'paragraph' | 'bullets' | 'highlights';
      language?: string;
    };

    const analysis = await summarizeText(extractedText, summaryType, summaryLength, language);
    const summary = await saveSummary({
      originalText: extractedText,
      summarizedText: analysis.summary,
      summaryType,
      summaryLength,
      keywords: analysis.keywords,
      sentiment: analysis.sentiment,
      title: analysis.title,
      language: analysis.language,
      source: 'file',
    });

    res.json({ summary, analysis });
  } finally {
    await fs.unlink(file.path).catch(() => undefined);
  }
});

export const summarizeYouTubeHandler = asyncHandler(async (req: any, res: Response) => {
  const { url, summaryType = 'medium', summaryLength = 'paragraph', language = 'en' } = req.body as {
    url: string;
    summaryType?: 'short' | 'medium' | 'detailed';
    summaryLength?: 'paragraph' | 'bullets' | 'highlights';
    language?: string;
  };

  if (!url) {
    throw new ApiError(400, 'YouTube URL is required');
  }

  const transcript = await getYouTubeTranscript(url);
  const analysis = await summarizeText(transcript, summaryType, summaryLength, language);
  const summary = await saveSummary({
    originalText: transcript,
    summarizedText: analysis.summary,
    summaryType,
    summaryLength,
    keywords: analysis.keywords,
    sentiment: analysis.sentiment,
    title: analysis.title,
    language: analysis.language,
    source: 'youtube',
  });

  res.json({ summary, analysis });
});

export const summarizeAudioHandler = asyncHandler(async (req: any, res: Response) => {
  const file = req.file;
  if (!file) {
    throw new ApiError(400, 'Audio file is required');
  }

  try {
    const transcription = await transcribeAudio(file.path);
    const { summaryType = 'medium', summaryLength = 'paragraph', language = 'en' } = req.body as {
      summaryType?: 'short' | 'medium' | 'detailed';
      summaryLength?: 'paragraph' | 'bullets' | 'highlights';
      language?: string;
    };

    const analysis = await summarizeText(transcription, summaryType, summaryLength, language);
    const summary = await saveSummary({
      originalText: transcription,
      summarizedText: analysis.summary,
      summaryType,
      summaryLength,
      keywords: analysis.keywords,
      sentiment: analysis.sentiment,
      title: analysis.title,
      language: analysis.language,
      source: 'audio',
    });

    res.json({ transcription, summary, analysis });
  } finally {
    await fs.unlink(file.path).catch(() => undefined);
  }
});
