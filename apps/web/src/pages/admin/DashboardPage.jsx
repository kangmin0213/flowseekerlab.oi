import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { Link } from 'react-router-dom';
import { FileText, Users, Eye, MessageSquare, Sparkles } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout.jsx';
import LoadingSpinner from '@/components/admin/LoadingSpinner.jsx';
import pb from '@/lib/pocketbaseClient.js';

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="admin-card flex items-center gap-4">
      <div className="p-3 bg-[hsl(var(--admin-accent))/10] text-[hsl(var(--admin-accent))] rounded-lg">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-[hsl(var(--muted-foreground))] font-medium">{title}</p>
        <h3 className="text-2xl font-bold font-sans">{value}</h3>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [postsTrend, setPostsTrend] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [posts, users, comments, allPosts] = await Promise.all([
          pb.collection('posts').getList(1, 1, { $autoCancel: false }),
          pb.collection('users').getList(1, 1, { $autoCancel: false }),
          pb.collection('comments').getList(1, 1, { $autoCancel: false }).catch(() => ({ totalItems: 0 })),
          pb.collection('posts').getFullList({ sort: '-created', $autoCancel: false }).catch(() => []),
        ]);

        const totalViews = allPosts.reduce((sum, p) => sum + (p.views || 0), 0);

        // Last 30 days posts trend
        const days = Array.from({ length: 30 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          d.setHours(0, 0, 0, 0);
          return d;
        });
        const trend = days.map((d) => {
          const next = new Date(d);
          next.setDate(d.getDate() + 1);
          const count = allPosts.filter((p) => {
            const c = new Date(p.created);
            return c >= d && c < next;
          }).length;
          return { date: `${d.getMonth() + 1}/${d.getDate()}`, posts: count };
        });

        const top = [...allPosts]
          .filter((p) => p.status === 'published')
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map((p) => ({ name: p.title.length > 24 ? p.title.slice(0, 22) + '…' : p.title, views: p.views || 0 }));

        setStats({
          totalPosts: posts.totalItems,
          totalUsers: users.totalItems,
          totalComments: comments.totalItems || 0,
          totalViews,
        });
        setPostsTrend(trend);
        setTopPosts(top);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold mb-1">Dashboard Overview</h2>
        <p className="text-[hsl(var(--muted-foreground))]">Welcome back to FlowSeeker Lab admin.</p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><LoadingSpinner /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Posts" value={stats?.totalPosts || 0} icon={FileText} />
            <StatCard title="Users" value={stats?.totalUsers || 0} icon={Users} />
            <StatCard title="Total Views" value={stats?.totalViews || 0} icon={Eye} />
            <StatCard title="Comments" value={stats?.totalComments || 0} icon={MessageSquare} />
          </div>

          {(stats?.totalPosts || 0) === 0 && (
            <div className="admin-card mb-8 flex items-start gap-3">
              <div className="p-2 bg-[hsl(var(--admin-accent))/10] text-[hsl(var(--admin-accent))] rounded-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-semibold mb-1">Your blog is empty.</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
                  Charts will populate as you publish posts and visitors generate views. All numbers above are read live from PocketBase — there is no demo data.
                </p>
                <Link
                  to="/admin/posts/new"
                  className="inline-flex items-center gap-2 bg-[hsl(var(--admin-accent))] text-white px-3 py-1.5 rounded-md text-sm font-medium"
                >
                  <FileText className="h-4 w-4" /> Write your first post
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="admin-card">
              <h3 className="font-serif font-semibold mb-4">Posts (Last 30 Days)</h3>
              <div className="h-72">
                {postsTrend.every((d) => d.posts === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-sm text-[hsl(var(--muted-foreground))] gap-2">
                    <p>No posts created in the last 30 days.</p>
                    <p className="text-xs">This chart will start filling in as soon as you publish.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={postsTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--admin-border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--admin-sidebar-bg))',
                          border: '1px solid hsl(var(--admin-border))',
                          borderRadius: 6,
                        }}
                      />
                      <Line type="monotone" dataKey="posts" stroke="hsl(var(--admin-accent))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="admin-card">
              <h3 className="font-serif font-semibold mb-4">Top Posts by Views</h3>
              <div className="h-72">
                {topPosts.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[hsl(var(--muted-foreground))] text-sm">
                    No view data yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topPosts} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--admin-border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis dataKey="name" type="category" width={140} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--admin-sidebar-bg))',
                          border: '1px solid hsl(var(--admin-border))',
                          borderRadius: 6,
                        }}
                      />
                      <Bar dataKey="views" fill="hsl(var(--admin-accent))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default DashboardPage;
