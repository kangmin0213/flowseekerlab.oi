import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { getSiteMeta, CMS_DEFAULTS } from '@/lib/cmsSettings.js';

function Footer() {
  const { t } = useLanguage();
  const [meta, setMeta] = useState({
    site_name: CMS_DEFAULTS.site_name,
    site_tagline: CMS_DEFAULTS.site_tagline,
    footer_nav: CMS_DEFAULTS.footer_nav,
    footer_social: CMS_DEFAULTS.footer_social,
  });

  useEffect(() => {
    getSiteMeta().then(setMeta).catch(() => {});
  }, []);

  const envSocialLinks = useMemo(() => {
    return [
      { label: 'Twitter (X)', url: import.meta.env.VITE_SITE_TWITTER_URL },
      { label: 'LinkedIn', url: import.meta.env.VITE_SITE_LINKEDIN_URL },
      { label: 'GitHub', url: import.meta.env.VITE_SITE_GITHUB_URL },
    ].filter((e) => typeof e.url === 'string' && e.url.startsWith('http'));
  }, []);

  const socialLinks = meta.footer_social.length ? meta.footer_social : envSocialLinks;

  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          <div className="flex flex-col gap-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                {meta.site_name}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {meta.site_tagline || t('footer.tagline')}
            </p>
          </div>

          <div className="flex flex-col gap-4 md:items-center">
            <h4 className="font-serif font-semibold text-foreground">{t('footer.navigation')}</h4>
            <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
              {meta.footer_nav.length > 0 ? (
                meta.footer_nav.map((item) =>
                  item.url.startsWith('/') ? (
                    <Link key={`${item.label}-${item.url}`} to={item.url} className="hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={`${item.label}-${item.url}`}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  ),
                )
              ) : (
                <>
                  <Link to="/" className="hover:text-foreground transition-colors">{t('nav.home')}</Link>
                  <Link to="/blog" className="hover:text-foreground transition-colors">{t('home.latest')}</Link>
                  <Link to="/search" className="hover:text-foreground transition-colors">{t('common.search')}</Link>
                  <a href="/rss.xml" className="hover:text-foreground transition-colors">RSS</a>
                </>
              )}
              <Link to="/privacy" className="hover:text-foreground transition-colors">{t('footer.privacy')}</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">{t('footer.terms')}</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <h4 className="font-serif font-semibold text-foreground">{t('footer.connect')}</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground md:items-end">
              {socialLinks.length > 0 ? (
                socialLinks.map((item) => (
                  <a
                    key={`${item.label}-${item.url}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                ))
              ) : (
                <p className="text-xs text-muted-foreground/80 max-w-[220px] text-right leading-relaxed">
                  {t('footer.socialPlaceholder')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {meta.site_name}. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
