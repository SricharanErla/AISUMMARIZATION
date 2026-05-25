import fs from 'fs/promises';
import { toFile } from 'openai/uploads';
import { openai, hasOpenAI } from './openaiService';

export const transcribeAudio = async (filePath: string) => {
  if (!hasOpenAI || !openai) {
    const file = await fs.readFile(filePath, 'utf8').catch(() => '');
    return file ? file.slice(0, 120) : 'Audio transcription is unavailable in runtime mode without an OpenAI key.';
  }

  const file = await fs.readFile(filePath);
  const transcription = await openai.audio.transcriptions.create({
    file: await toFile(file, 'audio.webm'),
    model: 'whisper-1',
  });
  return transcription.text;
};
