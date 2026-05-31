import { useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Bot, Mic, Play, Square, Sparkles, Volume2 } from 'lucide-react';
import { FileDropzone } from '../components/FileDropzone';
import { TypingText } from '../components/TypingText';
import { summaryService } from '../services/summaryService';
import { aiService } from '../services/aiService';
import { useSummaryControls } from '../context/SummaryControlsContext';

export const WorkspacePage = () => {
  const [mode, setMode] = useState<'text' | 'file' | 'youtube' | 'audio'>('text');
  const [text, setText] = useState('Paste a long article, report, or meeting notes here and generate a premium AI summary.');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [assistantPrompt, setAssistantPrompt] = useState('What are the key takeaways?');
  const [assistantAnswer, setAssistantAnswer] = useState('');
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { summaryType, summaryLength } = useSummaryControls();

  const getSummaryText = (value: any) => {
    const candidates = [
      value?.analysis?.summary,
      value?.summary?.summarizedText,
      value?.summaryText,
      value?.summary,
      value?.analysis?.summarizedText,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim().length > 0) {
        return candidate.trim();
      }
      if (candidate && typeof candidate === 'object') {
        const nested = (candidate as any).summarizedText ?? (candidate as any).summary;
        if (typeof nested === 'string' && nested.trim().length > 0) {
          return nested.trim();
        }
      }
    }

    return 'Summary ready.';
  };

  const splitSummaryLines = (summaryText: string) => {
    const byNewline = summaryText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (byNewline.length > 1) {
      return byNewline;
    }

    return summaryText
      .split(/(?<=[.!?])\s+/)
      .map((line) => line.trim())
      .filter(Boolean);
  };

  const currentContext = useMemo(() => getSummaryText(result) || result?.transcription || text, [result, text]);

  const generate = async () => {
    setLoading(true);
    try {
      if (mode === 'text') {
        const response = await summaryService.summarizeText({ text, summaryType, summaryLength });
        setResult(response);
      } else if (mode === 'file' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('summaryType', summaryType);
        formData.append('summaryLength', summaryLength);
        setResult(await summaryService.summarizeFile(formData));
      } else if (mode === 'youtube') {
        setResult(await summaryService.summarizeYouTube({ url: youtubeUrl, summaryType, summaryLength }));
      } else if (mode === 'audio' && audioFile) {
        const formData = new FormData();
        formData.append('file', audioFile);
        formData.append('summaryType', summaryType);
        formData.append('summaryLength', summaryLength);
        setResult(await summaryService.summarizeAudio(formData));
      } else {
        toast.error('Please provide valid input for the selected mode');
        return;
      }
      toast.success('Summary generated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Summary failed');
    } finally {
      setLoading(false);
    }
  };

  const askAssistant = async () => {
    try {
      const response = await aiService.chat({ context: currentContext, question: assistantPrompt });
      setAssistantAnswer(response.answer);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Assistant request failed');
    }
  };

  const speakSummary = () => {
    const utterance = new SpeechSynthesisUtterance(getSummaryText(result) || 'No summary available yet.');
    utterance.rate = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const startVoiceInput = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in this browser');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.onresult = (event: any) => setText(event.results[0][0].transcript);
      recognition.onerror = () => toast.error('Could not access speech recognition. Please try again.');
      recognition.start();
      toast.success('Listening for speech input');
    } catch {
      toast.error('Could not start speech recognition');
    }
  };

  const toggleAudioRecording = async () => {
    if (recording) {
      mediaRecorderRef.current?.stop();
      setRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const recordedFile = new File([blob], 'recording.webm', { type: 'audio/webm' });
        setAudioFile(recordedFile);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      toast.success('Recording started');
    } catch {
      toast.error('Could not access the microphone');
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] pb-10">
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-6">
        <div className="flex flex-wrap gap-2">
          {(['text', 'file', 'youtube', 'audio'] as const).map((item) => (
            <button key={item} onClick={() => setMode(item)} className={`rounded-full px-4 py-2 text-sm ${mode === item ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-white/70'}`}>
              {item.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">Summary type</p>
            <p className="mt-2 text-sm text-white/80">{summaryType.charAt(0).toUpperCase() + summaryType.slice(1)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">Summary style</p>
            <p className="mt-2 text-sm text-white/80">{summaryLength.charAt(0).toUpperCase() + summaryLength.slice(1)}</p>
          </div>
        </div>

        {mode === 'text' && (
          <div className="mt-5 space-y-4">
            <textarea aria-label="Source text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste long text here" className="min-h-[220px] w-full rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-4 outline-none" />
            <div className="flex flex-wrap gap-3">
              <button onClick={generate} disabled={loading} className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 font-medium text-white">{loading ? 'Generating...' : 'Generate Summary'}</button>
              <button onClick={startVoiceInput} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white/80 inline-flex items-center gap-2"><Mic className="h-4 w-4" /> Speech to text</button>
            </div>
          </div>
        )}

        {mode === 'file' && (
          <div className="mt-5 space-y-4">
            <FileDropzone label={file ? file.name : 'Upload a PDF or DOCX file'} accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={setFile} />
            <button onClick={generate} disabled={loading} className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 font-medium text-white">Summarize file</button>
          </div>
        )}

        {mode === 'youtube' && (
          <div className="mt-5 space-y-4">
            <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="Paste YouTube URL" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" />
            <button onClick={generate} disabled={loading} className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 font-medium text-white">Summarize YouTube video</button>
          </div>
        )}

        {mode === 'audio' && (
          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap gap-3">
              <FileDropzone label={audioFile ? audioFile.name : 'Upload recorded audio'} accept="audio/*" onChange={setAudioFile} />
              <button onClick={toggleAudioRecording} className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white/80 inline-flex items-center gap-2">
                {recording ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />} {recording ? 'Stop recording' : 'Record voice'}
              </button>
            </div>
            <button onClick={generate} disabled={loading} className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 font-medium text-white">Transcribe & summarize</button>
          </div>
        )}
      </motion.section>

      <section className="space-y-6">
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">AI Summary Output</h2>
            <button onClick={speakSummary} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"><Volume2 className="h-4 w-4" /> Speak</button>
          </div>
          <div className="mt-4 min-h-[220px] rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-5">
            {loading ? (
              <div className="space-y-3"><div className="h-4 w-3/4 rounded bg-white/10 animate-shimmer" /><div className="h-4 w-full rounded bg-white/10 animate-shimmer" /><div className="h-4 w-2/3 rounded bg-white/10 animate-shimmer" /></div>
            ) : result ? (
              (() => {
                const summaryText = getSummaryText(result);
                const summaryLines = splitSummaryLines(summaryText);

                if (summaryLength === 'bullets') {
                  return <ul className="space-y-2 text-white/85">
                    {summaryLines.map((line: string, index: number) => (
                      <li key={`${line}-${index}`} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" />
                        <span>{line.replace(/^[-*•]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>;
                }

                if (summaryLength === 'highlights') {
                  return <div className="flex flex-wrap gap-3 text-white/85">
                    {summaryLines.map((line: string, index: number) => (
                      <span key={`${line}-${index}`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                        {line.replace(/^\d+\.\s*/, '')}
                      </span>
                    ))}
                  </div>;
                }

                return <TypingText text={summaryText} />;
              })()
            ) : (
              <p className="text-white/55">Your generated summary will appear here.</p>
            )}
          </div>
          {result?.analysis && (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-4"><p className="text-sm text-white/50">Title</p><p className="mt-2 font-medium">{result.analysis.title}</p></div>
              <div className="rounded-3xl bg-white/5 p-4"><p className="text-sm text-white/50">Topic</p><p className="mt-2 font-medium">{result.analysis.topic}</p></div>
              <div className="rounded-3xl bg-white/5 p-4"><p className="text-sm text-white/50">Sentiment</p><p className="mt-2 font-medium">{result.analysis.sentiment}</p></div>
              <div className="rounded-3xl bg-white/5 p-4"><p className="text-sm text-white/50">Readability</p><p className="mt-2 font-medium">{result.analysis.readabilityScore}/100</p></div>
            </div>
          )}
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2"><Bot className="h-5 w-5 text-cyan-300" /><h3 className="text-lg font-semibold">AI Assistant</h3></div>
          <textarea value={assistantPrompt} onChange={(e) => setAssistantPrompt(e.target.value)} className="min-h-28 w-full rounded-3xl border border-white/10 bg-white/5 p-4 outline-none" placeholder="Ask about the generated content" />
          <button onClick={askAssistant} className="rounded-full bg-white px-5 py-3 font-medium text-slate-950">Ask assistant</button>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 min-h-24 text-white/80">{assistantAnswer || 'The assistant will answer questions about the current summary or uploaded content.'}</div>
        </div>
      </section>
    </div>
  );
};
