import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import SEO from '@/components/SEO.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title={t('common.notFound')} path="/404" noindex />
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
        <p className="text-7xl font-serif font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
          {t('common.notFound')}
        </h1>
        <Link
          to="/"
          className="text-primary underline-offset-4 hover:underline mt-2"
        >
          {t('common.backHome')}
        </Link>
      </main>
      <Footer />
    </div>
  );
}

export default NotFoundPage;
