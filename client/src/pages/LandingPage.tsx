import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Mic, Sparkles, Youtube } from 'lucide-react';

const features = [
  { icon: Sparkles, title: 'Prompt-engineered summaries', text: 'Short, medium, detailed outputs with paragraph, bullet, and highlights styles.' },
  { icon: FileText, title: 'File intelligence', text: 'Upload PDFs and DOCX files and extract text automatically for AI analysis.' },
  { icon: Youtube, title: 'YouTube transcript summarization', text: 'Paste a video URL and summarize the transcript instantly.' },
  { icon: Mic, title: 'Voice-first workflows', text: 'Use speech-to-text and text-to-speech to move faster with your content.' },
];

export const LandingPage = () => {
  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
          <div className="font-semibold tracking-wide">SummitAI</div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm text-white/70 hover:text-white">Dashboard</Link>
            <Link to="/workspace" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950">Get Started</Link>
          </div>
        </header>

        <section className="grid gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              Premium AI Content Summarizer
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
              Turn any document, video, or conversation into a clean executive summary.
            </motion.h1>
            <p className="mt-6 max-w-2xl text-lg text-white/70">
              A runtime-only AI summarizer for high-volume content workflows, built for fast local use with OpenAI or offline fallbacks.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/workspace" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 py-3 font-medium text-white shadow-glow">
                Open workspace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/dashboard" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-white/80 hover:bg-white/10">
                View dashboard
              </Link>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-[2rem] border border-white/10 p-6 shadow-glow">
            <div className="rounded-3xl bg-slate-950/60 p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Live AI Preview</p>
              <h2 className="mt-3 text-2xl font-semibold">AI-generated insight</h2>
              <p className="mt-4 text-white/70 leading-relaxed">
                The platform extracts key ideas, sentiment, keywords, and recommendations to accelerate research, team collaboration, and content review.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl bg-white/5 p-3">Keywords</div>
                <div className="rounded-2xl bg-white/5 p-3">Sentiment</div>
                <div className="rounded-2xl bg-white/5 p-3">Readability</div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="glass-panel rounded-3xl p-5"
              >
                <Icon className="h-6 w-6 text-cyan-300" />
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-white/65">{feature.text}</p>
              </motion.div>
            );
          })}
        </section>
      </div>
    </div>
  );
};
