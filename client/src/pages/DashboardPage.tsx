import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock3, FileText, Languages, WandSparkles } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { summaryService } from '../services/summaryService';

export const DashboardPage = () => {
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await summaryService.history();
        setSummaries(response.summaries);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const stats = [
    { label: 'Total summaries', value: String(summaries.length), detail: 'Stored securely in your history.' },
    { label: 'Top source', value: summaries[0]?.source ?? 'Text', detail: 'Latest content type analyzed.' },
    { label: 'Latest sentiment', value: summaries[0]?.sentiment ?? 'Neutral', detail: 'AI sentiment classification.' },
    { label: 'Languages', value: 'Multi', detail: 'Support for multilingual summaries.' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-6">
          <h2 className="text-xl font-semibold">Recent activity</h2>
          <p className="mt-1 text-sm text-white/60">A live view of recent content intelligence.</p>
          <div className="mt-5 space-y-4">
            {loading ? (
              <>
                <LoadingSkeleton className="h-20" />
                <LoadingSkeleton className="h-20" />
              </>
            ) : summaries.slice(0, 4).map((item) => (
              <div key={item.id ?? item._id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{item.title || item.analysis?.title || 'Untitled summary'}</p>
                    <p className="mt-1 text-sm text-white/55 line-clamp-2">{item.summarizedText ?? item.summary?.summarizedText ?? item.analysis?.summary}</p>
                  </div>
                  <div className="text-right text-xs text-white/45">
                    <p className="inline-flex items-center gap-1 rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-200">
                      <Clock3 className="h-3.5 w-3.5" /> {item.summaryType ?? item.summary?.summaryType}
                    </p>
                    <p className="mt-2">{new Date(item.createdAt ?? item.summary?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4">
          <div className="glass-panel rounded-3xl p-6">
            <WandSparkles className="h-6 w-6 text-cyan-300" />
            <h3 className="mt-4 text-lg font-semibold">Smart recommendations</h3>
            <p className="mt-2 text-sm text-white/65">Use the workspace to extract summaries, keywords, sentiment, and title suggestions in one pass.</p>
          </div>
          <div className="glass-panel rounded-3xl p-6">
            <FileText className="h-6 w-6 text-fuchsia-300" />
            <h3 className="mt-4 text-lg font-semibold">File workflow</h3>
            <p className="mt-2 text-sm text-white/65">Upload PDFs or DOCX files and summarize automatically without manual copying.</p>
          </div>
          <div className="glass-panel rounded-3xl p-6">
            <Languages className="h-6 w-6 text-emerald-300" />
            <h3 className="mt-4 text-lg font-semibold">Global-ready output</h3>
            <p className="mt-2 text-sm text-white/65">Support for multilingual summarization and international team workflows.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
