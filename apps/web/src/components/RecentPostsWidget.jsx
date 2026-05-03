import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { featuredImageUrl, formatDate } from '@/lib/postFormat.js';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

function RecentPostsWidget() {
  const [posts, setPosts] = useState([]);
  const { lang } = useLanguage();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await pb.collection('posts').getList(1, 4, {
          filter: 'status = "published"',
          sort: '-published_at',
          $autoCancel: false,
        });
        if (!cancelled) setPosts(list.items);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!posts.length) return null;

  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4 pb-2 border-b border-border font-serif">
        Recent Flows
      </h3>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group grid grid-cols-4 gap-3 items-center"
          >
            <div className="col-span-1 aspect-square rounded-md overflow-hidden bg-muted border border-border/50">
              {featuredImageUrl(post) && (
                <img
                  src={featuredImageUrl(post)}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
            </div>
            <div className="col-span-3">
              <h4 className="font-serif text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1">
                {post.title}
              </h4>
              <p className="text-[11px] font-sans text-muted-foreground uppercase tracking-wide">
                {formatDate(post.published_at || post.created, lang === 'ko' ? 'ko-KR' : 'en-US')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecentPostsWidget;
