import { YoutubeTranscript } from 'youtube-transcript';

export const getYouTubeTranscript = async (url: string) => {
  try {
    // The library accepts video id or url; normalize by extracting id if provided
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    return transcript.map((item) => item.text).join(' ');
  } catch (err) {
    throw new Error(`Could not fetch YouTube transcript for ${url}: ${err instanceof Error ? err.message : String(err)}`);
  }
};
