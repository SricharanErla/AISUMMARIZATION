import { useTheme } from '../context/ThemeContext';

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="glass-panel rounded-3xl p-6 max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="mt-1 text-white/60">Personalize the SummiAI experience.</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 flex items-center justify-between">
        <div>
          <p className="font-medium">Theme</p>
          <p className="text-sm text-white/55">Currently set to {theme} mode.</p>
        </div>
        <button onClick={toggleTheme} className="rounded-full bg-white px-4 py-2 font-medium text-slate-950">Toggle theme</button>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
        Recommended production settings: secure JWT secret, restricted CORS origin, Atlas IP allowlist, and a valid OpenAI key.
      </div>
    </div>
  );
};
