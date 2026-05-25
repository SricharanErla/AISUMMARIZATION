import { useState } from 'react';
import toast from 'react-hot-toast';
import { aiService } from '../services/aiService';

export const AssistantPage = () => {
  const [context, setContext] = useState('Paste summary or notes from an uploaded document here.');
  const [question, setQuestion] = useState('What should I focus on first?');
  const [answer, setAnswer] = useState('');

  const ask = async () => {
    try {
      const response = await aiService.chat({ context, question });
      setAnswer(response.answer);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Chat failed');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <h2 className="text-2xl font-semibold">AI Assistant</h2>
        <textarea aria-label="Assistant context" value={context} onChange={(e) => setContext(e.target.value)} placeholder="Provide context for the assistant" className="min-h-56 w-full rounded-3xl border border-white/10 bg-white/5 p-4 outline-none" />
        <textarea aria-label="Assistant question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question" className="min-h-28 w-full rounded-3xl border border-white/10 bg-white/5 p-4 outline-none" />
        <button onClick={ask} className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 font-medium text-white">Ask AI</button>
      </div>
      <div className="glass-panel rounded-3xl p-6">
        <h3 className="text-xl font-semibold">Assistant response</h3>
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 min-h-80 text-white/80 whitespace-pre-wrap">{answer || 'Your AI assistant will answer in a concise, useful format here.'}</div>
      </div>
    </div>
  );
};
