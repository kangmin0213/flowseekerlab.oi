import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          <div className="flex flex-col gap-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                FlowSeeker Lab
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="flex flex-col gap-4 md:items-center">
            <h4 className="font-serif font-semibold text-foreground">{t('footer.navigation')}</h4>
            <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">{t('nav.home')}</Link>
              <Link to="/blog" className="hover:text-foreground transition-colors">{t('home.latest')}</Link>
              <Link to="/search" className="hover:text-foreground transition-colors">{t('common.search')}</Link>
              <a href="/rss.xml" className="hover:text-foreground transition-colors">RSS</a>
            </nav>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <h4 className="font-serif font-semibold text-foreground">{t('footer.connect')}</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground md:items-end">
              <a href="#" className="hover:text-foreground transition-colors">Twitter (X)</a>
              <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FlowSeeker Lab. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-foreground transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
