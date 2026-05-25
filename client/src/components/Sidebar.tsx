import { NavLink } from 'react-router-dom';
import { Brain, Clock3, LayoutDashboard, MessageSquareText, Settings, Sparkles, UserCircle2 } from 'lucide-react';
import clsx from 'clsx';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workspace', label: 'Workspace', icon: Sparkles },
  { to: '/history', label: 'History', icon: Clock3 },
  { to: '/assistant', label: 'AI Assistant', icon: MessageSquareText },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="hidden xl:flex w-72 flex-col glass-panel rounded-3xl p-5 h-[calc(100vh-2rem)] sticky top-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center shadow-glow">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-white font-semibold">SummitAI</p>
          <p className="text-xs text-white/50">Content intelligence</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 transition border',
                  isActive
                    ? 'bg-white/10 border-white/15 text-white'
                    : 'border-transparent text-white/65 hover:bg-white/5 hover:text-white'
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl bg-white/5 border border-white/10 p-4 text-sm text-white/70">
        AI summarization, transcription, and content intelligence in one workspace.
      </div>
    </aside>
  );
};
