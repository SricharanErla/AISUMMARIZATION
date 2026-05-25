import { ArrowLeft, Home, Menu, MoonStar, SunMedium } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { styleOptions, summaryOptions } from '../context/summaryControlsOptions';
import { useSummaryControls } from '../context/SummaryControlsContext';

export const Navbar = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { summaryType, summaryLength, setSummaryType, setSummaryLength } = useSummaryControls();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', onPointerDown);
    return () => window.removeEventListener('mousedown', onPointerDown);
  }, []);

  const labelCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

  return (
    <header className="glass-panel relative z-50 overflow-visible rounded-3xl px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link to="/" aria-label="Back to home" title="Back to home" className="xl:hidden h-10 w-10 rounded-2xl bg-white/5 border border-white/10 text-white inline-flex items-center justify-center hover:bg-white/10 transition">
          <Home className="h-5 w-5" />
        </Link>
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          title="Go back"
          className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 text-white inline-flex items-center justify-center hover:bg-white/10 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Open navigation menu"
            title="Open navigation menu"
            className="xl:hidden h-10 w-10 rounded-2xl bg-white/5 border border-white/10 text-white inline-flex items-center justify-center hover:bg-white/10 transition"
          >
            <Menu className="h-5 w-5" />
          </button>

          {menuOpen && (
            <div className="absolute left-0 top-12 z-[70] w-[18rem] rounded-3xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl pointer-events-auto">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">Summary type</p>
                  <div className="mt-3 grid gap-2">
                    {summaryOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSummaryType(option);
                          setMenuOpen(false);
                        }}
                        className={`rounded-2xl border px-3 py-2 text-sm transition ${summaryType === option ? 'border-cyan-400/60 bg-cyan-400/10 text-white' : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10'}`}
                      >
                        {labelCase(option)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">Summary style</p>
                  <div className="mt-3 grid gap-2">
                    {styleOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSummaryLength(option);
                          setMenuOpen(false);
                        }}
                        className={`rounded-2xl border px-3 py-2 text-sm transition ${summaryLength === option ? 'border-fuchsia-400/60 bg-fuchsia-400/10 text-white' : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10'}`}
                      >
                        {labelCase(option)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">AI SaaS Dashboard</p>
          <h1 className="text-lg md:text-xl font-semibold text-white">Welcome back, {user?.name ?? 'Explorer'}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunMedium className="h-5 w-5 mx-auto" /> : <MoonStar className="h-5 w-5 mx-auto" />}
        </button>
      </div>
    </header>
  );
};
