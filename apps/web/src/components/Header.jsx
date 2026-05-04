import React, { useEffect, useState } from 'react';
import { Moon, Sun, Menu, X, Search, Globe } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { getSiteMeta, CMS_DEFAULTS } from '@/lib/cmsSettings.js';

function Header() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { t, lang, setLang, supported } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [siteName, setSiteName] = useState(CMS_DEFAULTS.site_name);

  useEffect(() => {
    (async () => {
      try {
        const cats = await pb.collection('categories').getFullList({
          sort: 'name',
          $autoCancel: false,
        });
        setCategories(cats);
      } catch {
        // ignore
      }
    })();
    getSiteMeta().then((m) => setSiteName(m.site_name)).catch(() => {});
  }, []);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    ...categories.map((c) => ({ name: c.name, path: `/category/${c.slug}` })),
    { name: t('nav.search'), path: '/search' },
  ];

  const cycleLang = () => {
    const idx = supported.indexOf(lang);
    setLang(supported[(idx + 1) % supported.length]);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="group relative inline-block">
              <span className="font-serif text-3xl font-bold tracking-tight text-foreground">
                {siteName}
              </span>
              <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-100 bg-foreground transition-transform duration-300 ease-out group-hover:scale-x-0"></span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/search')}
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={cycleLang}
              className="flex items-center gap-1 h-10 px-3 rounded-full text-foreground/80 hover:bg-muted hover:text-foreground transition-colors text-xs font-bold uppercase"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4" />
              {lang}
            </button>
            <button
              onClick={toggleDarkMode}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-border py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className="px-2 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted rounded-md"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
