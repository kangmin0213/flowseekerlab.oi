import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  ArrowLeft,
  Save,
  Send,
  Clock,
  Trash2,
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Image as ImageIcon,
  Link2,
} from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout.jsx';
import FormField from '@/components/admin/FormField.jsx';
import LoadingSpinner from '@/components/admin/LoadingSpinner.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const slugify = (str) =>
  (str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-colors ${
        active
          ? 'bg-[hsl(var(--admin-accent))/15] text-[hsl(var(--admin-accent))]'
          : 'text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-hover))]'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function EditorToolbar({ editor, onInsertLink, onInsertImage }) {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-hover))/40]">
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="H1"><Heading1 className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2"><Heading2 className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3"><Heading3 className="h-4 w-4" /></ToolbarButton>
      <div className="w-px h-5 bg-[hsl(var(--admin-border))] mx-1" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough className="h-4 w-4" /></ToolbarButton>
      <div className="w-px h-5 bg-[hsl(var(--admin-border))] mx-1" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list"><List className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list"><ListOrdered className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote"><Quote className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block"><Code className="h-4 w-4" /></ToolbarButton>
      <div className="w-px h-5 bg-[hsl(var(--admin-border))] mx-1" />
      <ToolbarButton onClick={onInsertLink} title="Insert link"><Link2 className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={onInsertImage} title="Insert image"><ImageIcon className="h-4 w-4" /></ToolbarButton>
      <div className="w-px h-5 bg-[hsl(var(--admin-border))] mx-1" />
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo className="h-4 w-4" /></ToolbarButton>
    </div>
  );
}

function PostEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [slugTouched, setSlugTouched] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category_id: '',
    status: 'draft',
    scheduled_at: '',
    featured_image: null,
    existing_featured_image: null,
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg max-w-none px-4 py-6 min-h-[420px] focus:outline-none',
      },
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const cats = await pb.collection('categories').getFullList({ sort: 'name', $autoCancel: false });
        setCategories(cats);
      } catch {
        // categories collection may be empty / unauthorized — ignore
      }
    })();
  }, []);

  useEffect(() => {
    if (!isEdit || !editor) return;
    (async () => {
      try {
        const post = await pb.collection('posts').getOne(id, { $autoCancel: false });
        setForm({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          category_id: post.category_id || '',
          status: post.status || 'draft',
          scheduled_at: post.scheduled_at ? post.scheduled_at.slice(0, 16) : '',
          featured_image: null,
          existing_featured_image: post.featured_image || null,
        });
        setSlugTouched(true);
        editor.commands.setContent(post.content || '');
        if (post.featured_image) {
          setImagePreview(pb.files.getUrl(post, post.featured_image));
        }
      } catch {
        toast.error('Failed to load post');
        navigate('/admin/posts');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, editor, navigate]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onTitleChange = (e) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : slugify(title),
    }));
  };

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateField('featured_image', file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const buildPayload = useCallback(
    (overrideStatus) => {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('content', editor?.getHTML() || '');
      fd.append('excerpt', form.excerpt);
      fd.append('slug', form.slug || slugify(form.title));
      if (form.category_id) fd.append('category_id', form.category_id);
      const status = overrideStatus || form.status;
      fd.append('status', status);
      if (status === 'published' && (!isEdit || form.status !== 'published')) {
        fd.append('published_at', new Date().toISOString());
      }
      if (status === 'scheduled' && form.scheduled_at) {
        fd.append('scheduled_at', new Date(form.scheduled_at).toISOString());
      }
      if (!isEdit) {
        fd.append('author_id', currentUser?.id || '');
        fd.append('views', '0');
      }
      if (form.featured_image) fd.append('featured_image', form.featured_image);
      return fd;
    },
    [form, editor, isEdit, currentUser]
  );

  const validate = (status) => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!editor?.getText().trim()) {
      toast.error('Content is required');
      return false;
    }
    if (status === 'scheduled' && !form.scheduled_at) {
      toast.error('Schedule date is required');
      return false;
    }
    return true;
  };

  const save = async (overrideStatus) => {
    const targetStatus = overrideStatus || form.status;
    if (!validate(targetStatus)) return;

    try {
      setSaving(true);
      const payload = buildPayload(overrideStatus);
      if (isEdit) {
        await pb.collection('posts').update(id, payload, { $autoCancel: false });
      } else {
        await pb.collection('posts').create(payload, { $autoCancel: false });
      }
      const label =
        targetStatus === 'published'
          ? 'Post published'
          : targetStatus === 'scheduled'
            ? 'Post scheduled'
            : 'Draft saved';
      toast.success(label);
      navigate('/admin/posts');
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Failed to save post';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const insertLink = () => {
    if (!editor) return;
    const url = window.prompt('Enter URL:', 'https://');
    if (!url) return;
    const text = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to) || url;
    editor.chain().focus().insertContent(`<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`).run();
  };

  const insertImage = async () => {
    if (!editor) return;
    const choice = window.prompt('Image source — paste a URL, or leave blank to upload:');
    if (choice === null) return;
    if (choice.trim()) {
      editor.chain().focus().insertContent(`<img src="${choice.trim()}" alt="" />`).run();
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('alt_text', file.name);
        const record = await pb.collection('images').create(fd, { $autoCancel: false });
        const url = pb.files.getUrl(record, record.file);
        editor.chain().focus().insertContent(`<img src="${url}" alt="${file.name}" />`).run();
      } catch (err) {
        toast.error(err?.data?.message || 'Image upload failed');
      }
    };
    input.click();
  };

  const removeFeaturedImage = () => {
    setForm((prev) => ({ ...prev, featured_image: null, existing_featured_image: null }));
    setImagePreview(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20 flex justify-center"><LoadingSpinner /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/posts"
            className="p-2 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--admin-hover))] transition-colors"
            title="Back to posts"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-serif font-bold">{isEdit ? 'Edit Post' : 'New Post'}</h2>
            <p className="text-[hsl(var(--muted-foreground))]">
              {isEdit ? 'Update your article.' : 'Compose a new article for your blog.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => save('draft')}
            disabled={saving}
            className="px-4 py-2 rounded-md text-sm font-medium border border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-hover))] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          {form.status === 'scheduled' || form.scheduled_at ? (
            <button
              onClick={() => save('scheduled')}
              disabled={saving}
              className="px-4 py-2 rounded-md text-sm font-medium border border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-hover))] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Clock className="h-4 w-4" />
              Schedule
            </button>
          ) : null}
          <button
            onClick={() => save('published')}
            disabled={saving}
            className="bg-[hsl(var(--admin-accent))] text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-[hsl(var(--admin-accent))/90] transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="admin-card p-6">
            <FormField label="Title">
              <input
                type="text"
                value={form.title}
                onChange={onTitleChange}
                placeholder="Your post title"
                className="w-full text-2xl font-serif font-bold bg-transparent border-0 border-b border-[hsl(var(--admin-border))] focus:border-[hsl(var(--admin-accent))] focus:outline-none px-0 py-2"
              />
            </FormField>
            <FormField label="Slug">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  updateField('slug', slugify(e.target.value));
                }}
                placeholder="auto-generated-from-title"
                className="w-full bg-transparent border border-[hsl(var(--admin-border))] rounded-md focus:border-[hsl(var(--admin-accent))] focus:outline-none px-3 py-2 text-sm font-mono"
              />
            </FormField>
            <FormField label="Excerpt">
              <textarea
                value={form.excerpt}
                onChange={(e) => updateField('excerpt', e.target.value)}
                placeholder="Short summary shown on the blog list (optional)"
                rows={2}
                className="w-full bg-transparent border border-[hsl(var(--admin-border))] rounded-md focus:border-[hsl(var(--admin-accent))] focus:outline-none px-3 py-2 text-sm resize-y"
              />
            </FormField>
          </div>

          <div className="admin-card p-0 overflow-hidden">
            <div className="px-6 pt-4">
              <label className="text-sm font-medium text-[hsl(var(--admin-text))]">Content</label>
            </div>
            <EditorToolbar editor={editor} onInsertLink={insertLink} onInsertImage={insertImage} />
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="admin-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-4">
              Publish
            </h3>
            <FormField label="Status">
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full bg-transparent border border-[hsl(var(--admin-border))] rounded-md focus:border-[hsl(var(--admin-accent))] focus:outline-none px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </FormField>
            {form.status === 'scheduled' && (
              <FormField label="Scheduled at">
                <input
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={(e) => updateField('scheduled_at', e.target.value)}
                  className="w-full bg-transparent border border-[hsl(var(--admin-border))] rounded-md focus:border-[hsl(var(--admin-accent))] focus:outline-none px-3 py-2 text-sm"
                />
              </FormField>
            )}
          </div>

          <div className="admin-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-4">
              Category
            </h3>
            <FormField label="Category">
              <select
                value={form.category_id}
                onChange={(e) => updateField('category_id', e.target.value)}
                className="w-full bg-transparent border border-[hsl(var(--admin-border))] rounded-md focus:border-[hsl(var(--admin-accent))] focus:outline-none px-3 py-2 text-sm"
              >
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="admin-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-4">
              Featured Image
            </h3>
            {imagePreview ? (
              <div className="space-y-3">
                <img
                  src={imagePreview}
                  alt="Featured"
                  className="w-full rounded-md border border-[hsl(var(--admin-border))]"
                />
                <button
                  type="button"
                  onClick={removeFeaturedImage}
                  className="flex items-center gap-2 text-sm text-[hsl(var(--admin-error))] hover:underline"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[hsl(var(--admin-border))] rounded-md py-8 cursor-pointer hover:bg-[hsl(var(--admin-hover))/40] transition-colors">
                <ImageIcon className="h-6 w-6 text-[hsl(var(--muted-foreground))]" />
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  Click to upload (JPG, PNG, WebP, GIF · max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={onImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default PostEditorPage;
