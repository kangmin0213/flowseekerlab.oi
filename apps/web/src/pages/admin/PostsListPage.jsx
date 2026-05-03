
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout.jsx';
import pb from '@/lib/pocketbaseClient.js';
import EmptyState from '@/components/admin/EmptyState.jsx';
import LoadingSpinner from '@/components/admin/LoadingSpinner.jsx';
import { toast } from 'sonner';

function PostsListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('posts').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setPosts(records);
    } catch (err) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await pb.collection('posts').delete(id, { $autoCancel: false });
        toast.success('Post deleted');
        fetchPosts();
      } catch (err) {
        toast.error('Failed to delete post');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold">Posts</h2>
          <p className="text-[hsl(var(--muted-foreground))]">Manage your articles and project logs.</p>
        </div>
        <Link 
          to="/admin/posts/new" 
          className="bg-[hsl(var(--admin-accent))] text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-[hsl(var(--admin-accent))/90] transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner /></div>
        ) : posts.length === 0 ? (
          <EmptyState 
            title="No posts yet" 
            description="Create your first post to get started."
            action={<Link to="/admin/posts/new" className="text-[hsl(var(--admin-accent))] hover:underline">Write a post</Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[hsl(var(--admin-hover))] border-b border-[hsl(var(--admin-border))] text-[hsl(var(--muted-foreground))] uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--admin-border))]">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-[hsl(var(--admin-hover))/50] transition-colors">
                    <td className="px-6 py-4 font-medium text-[hsl(var(--admin-text))] max-w-[300px] truncate">
                      {post.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        post.status === 'published' ? 'bg-[hsl(var(--admin-success))/10] text-[hsl(var(--admin-success))]' :
                        'bg-[hsl(var(--admin-warning))/10] text-[hsl(var(--admin-warning))]'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">
                      {new Date(post.created).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/posts/edit/${post.id}`} className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--admin-accent))] rounded transition-colors">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(post.id)} className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--admin-error))] rounded transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default PostsListPage;
