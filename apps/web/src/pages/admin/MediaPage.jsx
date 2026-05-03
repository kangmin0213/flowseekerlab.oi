import React, { useEffect, useRef, useState } from 'react';
import { Upload, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout.jsx';
import LoadingSpinner from '@/components/admin/LoadingSpinner.jsx';
import EmptyState from '@/components/admin/EmptyState.jsx';
import pb from '@/lib/pocketbaseClient.js';

function MediaPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const list = await pb.collection('images').getList(1, 100, {
        sort: '-created',
        $autoCancel: false,
      });
      setItems(list.items);
    } catch {
      // images collection may not be writable to anonymous; admin-only
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('alt_text', file.name);
        await pb.collection('images').create(fd, { $autoCancel: false });
      }
      toast.success(`Uploaded ${files.length} file(s)`);
      load();
    } catch (err) {
      toast.error(err?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await pb.collection('images').delete(id, { $autoCancel: false });
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const copyUrl = (item) => {
    const url = pb.files.getUrl(item, item.file);
    navigator.clipboard.writeText(url);
    toast.success('URL copied');
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold">Media</h2>
          <p className="text-[hsl(var(--muted-foreground))]">Upload and manage images.</p>
        </div>
        <label className="bg-[hsl(var(--admin-accent))] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 cursor-pointer">
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload'}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={onUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <div className="admin-card p-4">
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : items.length === 0 ? (
          <EmptyState title="No images" description="Upload your first image to get started." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => {
              const url = item.file ? pb.files.getUrl(item, item.file, { thumb: '300x300' }) : null;
              return (
                <div key={item.id} className="group relative rounded-lg overflow-hidden border border-[hsl(var(--admin-border))]">
                  <div className="aspect-square bg-[hsl(var(--admin-hover))]">
                    {url && <img src={url} alt={item.alt_text || ''} className="w-full h-full object-cover" />}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => copyUrl(item)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-md backdrop-blur">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(item.id)} className="p-2 bg-white/10 hover:bg-red-500/80 text-white rounded-md backdrop-blur">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default MediaPage;
