import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout.jsx';
import FormField from '@/components/admin/FormField.jsx';

const STORAGE_KEY = 'site-settings';

const defaultSettings = {
  siteName: 'FlowSeeker Lab',
  tagline: 'Read the flow with AI & Crypto, and turn it into action.',
  description:
    'High-signal analysis at the intersection of AI and crypto. Insights, alpha, and build-in-public project logs.',
  baseUrl: 'https://flowseekerlab.io',
  twitter: '@flowseekerlab',
  postsPerPage: 10,
  enableComments: true,
};

function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...defaultSettings, ...JSON.parse(raw) });
    } catch {
      // ignore
    }
  }, []);

  const update = (key, value) => setSettings((p) => ({ ...p, [key]: value }));

  const save = (e) => {
    e.preventDefault();
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold">Settings</h2>
        <p className="text-[hsl(var(--muted-foreground))]">Configure your blog.</p>
      </div>

      <form onSubmit={save} className="admin-card p-6 max-w-3xl">
        <FormField label="Site Name">
          <input
            value={settings.siteName}
            onChange={(e) => update('siteName', e.target.value)}
            className="w-full bg-transparent border border-[hsl(var(--admin-border))] rounded-md px-3 py-2 text-sm focus:border-[hsl(var(--admin-accent))] focus:outline-none"
          />
        </FormField>
        <FormField label="Tagline">
          <input
            value={settings.tagline}
            onChange={(e) => update('tagline', e.target.value)}
            className="w-full bg-transparent border border-[hsl(var(--admin-border))] rounded-md px-3 py-2 text-sm focus:border-[hsl(var(--admin-accent))] focus:outline-none"
          />
        </FormField>
        <FormField label="Description">
          <textarea
            rows={3}
            value={settings.description}
            onChange={(e) => update('description', e.target.value)}
            className="w-full bg-transparent border border-[hsl(var(--admin-border))] rounded-md px-3 py-2 text-sm focus:border-[hsl(var(--admin-accent))] focus:outline-none"
          />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Base URL">
            <input
              value={settings.baseUrl}
              onChange={(e) => update('baseUrl', e.target.value)}
              className="w-full bg-transparent border border-[hsl(var(--admin-border))] rounded-md px-3 py-2 text-sm focus:border-[hsl(var(--admin-accent))] focus:outline-none"
            />
          </FormField>
          <FormField label="Twitter Handle">
            <input
              value={settings.twitter}
              onChange={(e) => update('twitter', e.target.value)}
              className="w-full bg-transparent border border-[hsl(var(--admin-border))] rounded-md px-3 py-2 text-sm focus:border-[hsl(var(--admin-accent))] focus:outline-none"
            />
          </FormField>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Posts Per Page">
            <input
              type="number"
              min={1}
              max={100}
              value={settings.postsPerPage}
              onChange={(e) => update('postsPerPage', parseInt(e.target.value, 10) || 10)}
              className="w-full bg-transparent border border-[hsl(var(--admin-border))] rounded-md px-3 py-2 text-sm focus:border-[hsl(var(--admin-accent))] focus:outline-none"
            />
          </FormField>
          <FormField label="Enable Comments">
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={settings.enableComments}
                onChange={(e) => update('enableComments', e.target.checked)}
              />
              <span className="text-sm">Allow public comments</span>
            </label>
          </FormField>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-[hsl(var(--admin-accent))] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> Save Settings
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default SettingsPage;
