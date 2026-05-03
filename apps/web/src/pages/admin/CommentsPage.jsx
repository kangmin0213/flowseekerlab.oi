import React, { useEffect, useState } from 'react';
import { Check, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout.jsx';
import LoadingSpinner from '@/components/admin/LoadingSpinner.jsx';
import EmptyState from '@/components/admin/EmptyState.jsx';
import pb from '@/lib/pocketbaseClient.js';

function CommentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const load = async () => {
    setLoading(true);
    try {
      const list = await pb.collection('comments').getFullList({
        sort: '-created',
        $autoCancel: false,
      });
      setItems(list);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setApproved = async (id, approved) => {
    try {
      await pb.collection('comments').update(id, { approved }, { $autoCancel: false });
      toast.success(approved ? 'Approved' : 'Rejected');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await pb.collection('comments').delete(id, { $autoCancel: false });
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const visible = items.filter((c) => {
    if (filter === 'pending') return !c.approved;
    if (filter === 'approved') return c.approved;
    return true;
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold">Comments</h2>
          <p className="text-[hsl(var(--muted-foreground))]">Moderate visitor comments.</p>
        </div>
        <div className="flex gap-2 text-xs">
          {['pending', 'approved', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full border transition-colors ${
                filter === f
                  ? 'bg-[hsl(var(--admin-accent))] text-white border-[hsl(var(--admin-accent))]'
                  : 'border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-hover))]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card p-4">
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : visible.length === 0 ? (
          <EmptyState title="No comments" description={`No ${filter} comments.`} />
        ) : (
          <ul className="flex flex-col gap-3">
            {visible.map((c) => (
              <li key={c.id} className="border border-[hsl(var(--admin-border))] rounded-lg p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="font-medium text-sm">{c.author_name}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">
                      {c.author_email} · {new Date(c.created).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!c.approved && (
                      <button
                        onClick={() => setApproved(c.id, true)}
                        className="p-1.5 text-[hsl(var(--admin-success))] hover:bg-[hsl(var(--admin-success))/10] rounded"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    {c.approved && (
                      <button
                        onClick={() => setApproved(c.id, false)}
                        className="p-1.5 text-[hsl(var(--admin-warning))] hover:bg-[hsl(var(--admin-warning))/10] rounded"
                        title="Unapprove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => remove(c.id)}
                      className="p-1.5 text-[hsl(var(--admin-error))] hover:bg-[hsl(var(--admin-error))/10] rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{c.content}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 font-mono">
                  Post: {c.post_id}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
}

export default CommentsPage;
