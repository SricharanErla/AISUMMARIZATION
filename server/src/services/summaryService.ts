import { getJsonFromModel, hasGrok } from './grokService';
import { getJsonFromModel as getJsonFromOpenAI, hasOpenAI } from './openaiService';

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

const sanitizeString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const sanitizeStringArray = (value: unknown, max = 10) => {
  if (!Array.isArray(value)) {
    return [] as string[];
  }
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .slice(0, max);
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

const buildFallbackKeywords = (text: string) => Array.from(new Set(text.toLowerCase().match(/\b[a-z]{5,}\b/g) ?? [])).slice(0, 8);

const normalizeSummaryAnalysis = (
  value: unknown,
  text: string,
  summaryType: SummaryType,
  summaryLength: SummaryLength,
  language: string
): SummaryAnalysis => {
  const baseSummary = buildFallbackSummary(text, summaryType, summaryLength);
  const baseKeywords = buildFallbackKeywords(text);
  const baseTitle = (text.trim().split(/\s+/).slice(0, 6).join(' ') || 'Runtime summary').replace(/[\r\n]+/g, ' ');

  if (!value || typeof value !== 'object') {
    return {
      summary: baseSummary || text.slice(0, 240),
      keywords: baseKeywords,
      sentiment: 'neutral',
      title: baseTitle,
      topic: 'general',
      language,
      readabilityScore: 72,
      recommendations: ['Try a longer source text for better output', 'Use a specific summary type for better structure', 'Check model settings if output quality drops'],
    };
  }

  const raw = value as Record<string, unknown>;
  const summary = sanitizeString(raw.summary) || baseSummary || text.slice(0, 240);
  const keywords = sanitizeStringArray(raw.keywords, 10);
  const sentiment = sanitizeString(raw.sentiment) || 'neutral';
  const title = sanitizeString(raw.title) || baseTitle;
  const topic = sanitizeString(raw.topic) || 'general';
  const outputLanguage = sanitizeString(raw.language) || language;
  const readabilityValue = typeof raw.readabilityScore === 'number' ? raw.readabilityScore : Number(raw.readabilityScore);
  const readabilityScore = Number.isFinite(readabilityValue) ? Math.max(0, Math.min(100, Math.round(readabilityValue))) : 72;
  const recommendations = sanitizeStringArray(raw.recommendations, 5);

  return {
    summary,
    keywords: keywords.length > 0 ? keywords : baseKeywords,
    sentiment,
    title,
    topic,
    language: outputLanguage,
    readabilityScore,
    recommendations:
      recommendations.length > 0
        ? recommendations
        : ['Try a longer source text for better output', 'Use a specific summary type for better structure', 'Check model settings if output quality drops'],
  };
};

const requestSummaryFromProvider = async (system: string, user: string) => {
  if (hasGrok) {
    try {
      return await getJsonFromModel<SummaryAnalysis>(system, user);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Groq summarizeText failed, trying OpenAI fallback:', error);
    }
  }

  if (hasOpenAI) {
    return getJsonFromOpenAI<SummaryAnalysis>(system, user);
  }

  throw new Error('No AI provider configured');
};

export const summarizeText = async (
  text: string,
  summaryType: SummaryType,
  summaryLength: SummaryLength,
  language = 'en'
): Promise<SummaryAnalysis> => {
  if (!hasGrok && !hasOpenAI) {
    return normalizeSummaryAnalysis(null, text, summaryType, summaryLength, language);
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

  try {
    const raw = await requestSummaryFromProvider(system, user);
    return normalizeSummaryAnalysis(raw, text, summaryType, summaryLength, language);
  } catch (error) {
    // Keep the app usable when providers are unavailable or return invalid output.
    // eslint-disable-next-line no-console
    console.warn('summarizeText failed, using runtime fallback:', error);
    return normalizeSummaryAnalysis(null, text, summaryType, summaryLength, language);
  }
};

export const generateAnswer = async (context: string, question: string) => {
  if (!hasGrok) {
    return {
      answer: `Runtime mode is active. Based on the current content, focus on: ${context.slice(0, 140)}`,
      sources: ['local-runtime'],
    };
  }

  try {
    return await getJsonFromModel<{ answer: string; sources: string[] }>(
      'You are a helpful AI assistant for uploaded content. Return only JSON with answer and sources.',
      `Context:\n${context}\n\nQuestion:\n${question}`
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Groq generateAnswer failed, using runtime fallback:', error);
    return {
      answer: `Runtime mode is active. Based on the current content, focus on: ${context.slice(0, 140)}`,
      sources: ['local-runtime'],
    };
  }
};

export const extractKeywords = async (text: string) => {
  if (!hasGrok) {
    return { keywords: Array.from(new Set(text.toLowerCase().match(/\b[a-z]{5,}\b/g) ?? [])).slice(0, 10) };
  }

  try {
    return await getJsonFromModel<{ keywords: string[] }>(
      'Extract important keywords from the given text. Return only JSON with a keywords array.',
      text
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Groq extractKeywords failed, using runtime fallback:', error);
    return { keywords: Array.from(new Set(text.toLowerCase().match(/\b[a-z]{5,}\b/g) ?? [])).slice(0, 10) };
  }
};

export const analyzeSentiment = async (text: string) => {
  if (!hasGrok) {
    return { sentiment: 'neutral', score: 0.5, explanation: 'Runtime fallback sentiment analysis.' };
  }

  try {
    return await getJsonFromModel<{ sentiment: string; score: number; explanation: string }>(
      'Analyze sentiment. Return only JSON with sentiment, score, explanation.',
      text
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Groq analyzeSentiment failed, using runtime fallback:', error);
    return { sentiment: 'neutral', score: 0.5, explanation: 'Runtime fallback sentiment analysis.' };
  }
};

export const generateTitle = async (text: string) => {
  if (!hasGrok) {
    return { title: text.trim().split(/\s+/).slice(0, 8).join(' ') || 'Runtime summary' };
  }

  try {
    return await getJsonFromModel<{ title: string }>(
      'Generate a concise, compelling title. Return only JSON with title.',
      text
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Groq generateTitle failed, using runtime fallback:', error);
    return { title: text.trim().split(/\s+/).slice(0, 8).join(' ') || 'Runtime summary' };
  }
};

export const classifyTopic = async (text: string) => {
  if (!hasGrok) {
    return { topic: 'general' };
  }

  try {
    return await getJsonFromModel<{ topic: string }>(
      'Classify the main topic. Return only JSON with topic.',
      text
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Groq classifyTopic failed, using runtime fallback:', error);
    return { topic: 'general' };
  }
};
