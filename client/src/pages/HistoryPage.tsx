import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { summaryService } from '../services/summaryService';

export const HistoryPage = () => {
  const [summaries, setSummaries] = useState<any[]>([]);

  const load = async () => {
    const response = await summaryService.history();
    setSummaries(response.summaries);
  };

  useEffect(() => {
    void load();
  }, []);

  const remove = async (id: string) => {
    await summaryService.deleteHistory(id);
    toast.success('Deleted');
    await load();
  };

  return (
    <div className="glass-panel rounded-3xl p-6">
      <h2 className="text-2xl font-semibold">Summary History</h2>
      <p className="mt-1 text-white/60">Recent content processed by your account.</p>
      <div className="mt-6 space-y-4">
        {summaries.map((summary) => (
          <div key={summary.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{summary.title}</p>
                <p className="mt-2 text-sm text-white/60 line-clamp-2">{summary.summarizedText}</p>
                <p className="mt-2 text-xs text-white/40">{summary.summaryType} · {summary.summaryLength} · {new Date(summary.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => remove(summary.id)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
