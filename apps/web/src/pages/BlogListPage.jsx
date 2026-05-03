import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import SEO from '@/components/SEO.jsx';
import BlogCard from '@/components/BlogCard.jsx';
import LoadingSpinner from '@/components/admin/LoadingSpinner.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

function BlogListPage() {
  const { categorySlug } = useParams();
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        let cat = null;
        if (categorySlug) {
          const cats = await pb.collection('categories').getList(1, 1, {
            filter: `slug = "${categorySlug}"`,
            $autoCancel: false,
          });
          cat = cats.items[0] || null;
          if (!cancelled) setCategory(cat);
        }
        const filters = [`status = "published"`];
        if (cat) filters.push(`category_id = "${cat.id}"`);
        const list = await pb.collection('posts').getList(1, 50, {
          filter: filters.join(' && '),
          sort: '-published_at',
          expand: 'author_id,category_id',
          $autoCancel: false,
        });
        if (!cancelled) setPosts(list.items);
      } catch {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  const heading = category ? category.name : t('home.latest');
  const path = categorySlug ? `/category/${categorySlug}` : '/blog';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title={heading} description={category?.description} path={path} />
      <Header />
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3">{heading}</h1>
          {category?.description && (
            <p className="text-muted-foreground text-lg">{category.description}</p>
          )}
        </header>

        {loading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground">{t('common.noResults')}</p>
        ) : (
          <div className="flex flex-col">
            {posts.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default BlogListPage;
