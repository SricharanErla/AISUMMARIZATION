import { getJsonFromModel, hasOpenAI } from './openaiService';

export type SummaryType = 'short' | 'medium' | 'detailed';
export type SummaryLength = 'paragraph' | 'bullets' | 'highlights';

export interface SummaryAnalysis {
  summary: string;
  keywords: string[];
  sentiment: string;
  title: string;
  topic: string;
  language: string;
  readabilityScore: number;
  recommendations: string[];
}

const lengthInstructions: Record<SummaryType, string> = {
  short: 'Keep it very concise, around 3-5 sentences.',
  medium: 'Provide a balanced summary with the key points and supporting context.',
  detailed: 'Provide a thorough summary with major details, logic, and important context.',
};

const styleInstructions: Record<SummaryLength, string> = {
  paragraph: 'Write the summary as a well-structured paragraph.',
  bullets: 'Write the summary as concise bullet points.',
  highlights: 'Write the summary as short key highlights or takeaways.',
};

const buildFallbackSummary = (text: string, summaryType: SummaryType, summaryLength: SummaryLength) => {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const limit = summaryType === 'short' ? 2 : summaryType === 'medium' ? 4 : 7;
  const selected = sentences.slice(0, limit).length > 0 ? sentences.slice(0, limit) : [text.slice(0, 240)];

  if (summaryLength === 'bullets') {
    return selected.map((sentence) => `- ${sentence.replace(/^[-*•]\s*/, '').trim()}`).join('\n');
  }

  if (summaryLength === 'highlights') {
    return selected.map((sentence, index) => `${index + 1}. ${sentence.replace(/^[-*•]\s*/, '').trim()}`).join('\n');
  }

  return selected.join(' ');
};

export const summarizeText = async (
  text: string,
  summaryType: SummaryType,
  summaryLength: SummaryLength,
  language = 'en'
): Promise<SummaryAnalysis> => {
  if (!hasOpenAI) {
    const summary = buildFallbackSummary(text, summaryType, summaryLength);
    const keywords = Array.from(new Set(text.toLowerCase().match(/\b[a-z]{5,}\b/g) ?? [])).slice(0, 8);

    return {
      summary: summary || text.slice(0, 240),
      keywords,
      sentiment: 'neutral',
      title: (text.trim().split(/\s+/).slice(0, 6).join(' ') || 'Runtime summary').replace(/[\r\n]+/g, ' '),
      topic: 'general',
      language,
      readabilityScore: 72,
      recommendations: ['Connect an OpenAI key for richer summaries', 'Try a longer source text for better output', 'Use the file or YouTube workflow for structured inputs'],
    };
  }

  const system = [
    'You are a premium AI summarization engine for a SaaS content platform.',
    'Return only valid JSON with the keys: summary, keywords, sentiment, title, topic, language, readabilityScore, recommendations.',
    'Keep the language natural and accurate.',
  ].join(' ');

  const user = [
    `Summarize the text in ${language}.`,
    lengthInstructions[summaryType],
    styleInstructions[summaryLength],
    'Also extract 5-10 keywords, detect sentiment, generate a short title, classify the topic, estimate a readability score from 0 to 100, and give 3 recommendations.',
    'Input text:',
    text,
  ].join('\n\n');

  return getJsonFromModel<SummaryAnalysis>(system, user);
};

export const generateAnswer = async (context: string, question: string) => {
  if (!hasOpenAI) {
    return {
      answer: `Runtime mode is active. Based on the current content, focus on: ${context.slice(0, 140)}`,
      sources: ['local-runtime'],
    };
  }

  return getJsonFromModel<{ answer: string; sources: string[] }>(
    'You are a helpful AI assistant for uploaded content. Return only JSON with answer and sources.',
    `Context:\n${context}\n\nQuestion:\n${question}`
  );
};

export const extractKeywords = async (text: string) => {
  if (!hasOpenAI) {
    return { keywords: Array.from(new Set(text.toLowerCase().match(/\b[a-z]{5,}\b/g) ?? [])).slice(0, 10) };
  }

  return getJsonFromModel<{ keywords: string[] }>(
    'Extract important keywords from the given text. Return only JSON with a keywords array.',
    text
  );
};

export const analyzeSentiment = async (text: string) => {
  if (!hasOpenAI) {
    return { sentiment: 'neutral', score: 0.5, explanation: 'Runtime fallback sentiment analysis.' };
  }

  return getJsonFromModel<{ sentiment: string; score: number; explanation: string }>(
    'Analyze sentiment. Return only JSON with sentiment, score, explanation.',
    text
  );
};

export const generateTitle = async (text: string) => {
  if (!hasOpenAI) {
    return { title: text.trim().split(/\s+/).slice(0, 8).join(' ') || 'Runtime summary' };
  }

  return getJsonFromModel<{ title: string }>(
    'Generate a concise, compelling title. Return only JSON with title.',
    text
  );
};

export const classifyTopic = async (text: string) => {
  if (!hasOpenAI) {
    return { topic: 'general' };
  }

  return getJsonFromModel<{ topic: string }>(
    'Classify the main topic. Return only JSON with topic.',
    text
  );
};
