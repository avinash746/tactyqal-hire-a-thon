'use client';
import { useCallback, useEffect, useState } from 'react';
import { formatDate } from '@/lib/format';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const EMPTY = { title: '', excerpt: '', content: '', coverImage: '', tags: '', status: 'draft' };

export default function AdminPanel() {
  const [key, setKey] = useState('');
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null); // {type, text}
  const [busy, setBusy] = useState(false);

  useEffect(() => { setKey(sessionStorage.getItem('adminKey') || ''); }, []);

  const call = useCallback(async (path, { method = 'GET', body } = {}) => {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: body ? JSON.stringify(body) : undefined
    });
    if (res.status === 204) return null;
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = json.details?.map((d) => `${d.field}: ${d.message}`).join('; ');
      throw new Error([json.error, detail].filter(Boolean).join(' - ') || `Request failed (${res.status})`);
    }
    return json;
  }, [key]);

  const load = useCallback(async () => {
    try {
      const json = await call('/posts?status=all&limit=50');
      setPosts(json.data);
    } catch (e) {
      setPosts([]);
      setMessage({ type: 'error', text: e.message === 'Failed to fetch' ? 'Cannot reach the API. Is the backend running?' : e.message });
    }
  }, [call]);

  useEffect(() => { if (key) load(); }, [key, load]);

  const saveKey = (e) => {
    e.preventDefault();
    const v = new FormData(e.currentTarget).get('key').toString().trim();
    sessionStorage.setItem('adminKey', v);
    setMessage(null);
    setKey(v);
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setMessage(null);
    const body = {
      title: form.title, content: form.content, status: form.status,
      excerpt: form.excerpt || undefined, coverImage: form.coverImage || undefined,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean)
    };
    try {
      await call(editingId ? `/posts/${editingId}` : '/posts', { method: editingId ? 'PATCH' : 'POST', body });
      setMessage({ type: 'ok', text: editingId ? 'Post updated.' : 'Post created.' });
      setForm(EMPTY); setEditingId(null);
      await load();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally { setBusy(false); }
  };

  const edit = async (p) => {
    try {
      const { data } = await call(`/posts/${p.id}`);
      setEditingId(data.id);
      setForm({ title: data.title, excerpt: data.excerpt, content: data.content, coverImage: data.coverImage, tags: data.tags.join(', '), status: data.status });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) { setMessage({ type: 'error', text: err.message }); }
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try { await call(`/posts/${p.id}`, { method: 'DELETE' }); setMessage({ type: 'ok', text: 'Post deleted.' }); await load(); }
    catch (err) { setMessage({ type: 'error', text: err.message }); }
  };

  const field = 'mt-1 w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-2.5 outline-none focus:border-signal';

  return (
    <div className="mt-10 space-y-10">
      <form onSubmit={saveKey} className="flex max-w-xl flex-wrap items-end gap-3">
        <div className="min-w-[14rem] flex-1">
          <label htmlFor="key" className="text-sm font-semibold">Admin API key</label>
          <input id="key" name="key" type="password" defaultValue={key} key={key} autoComplete="off" className={field} />
        </div>
        <button className="btn-primary !py-2.5">{key ? 'Update key' : 'Unlock'}</button>
      </form>

      <p aria-live="polite" className={message ? `rounded-xl px-4 py-3 text-sm font-semibold ${message.type === 'ok' ? 'bg-mint-tint' : 'bg-marigold-tint'}` : 'sr-only'}>{message?.text}</p>

      {key && (
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-ink/10">
            <h2 className="text-2xl font-bold">{editingId ? 'Edit post' : 'New post'}</h2>
            <div><label className="text-sm font-semibold" htmlFor="title">Title</label><input id="title" required minLength={3} value={form.title} onChange={set('title')} className={field} /></div>
            <div><label className="text-sm font-semibold" htmlFor="excerpt">Excerpt (optional, made from content if empty)</label><input id="excerpt" value={form.excerpt} onChange={set('excerpt')} className={field} /></div>
            <div><label className="text-sm font-semibold" htmlFor="cover">Cover image URL (optional)</label><input id="cover" type="url" value={form.coverImage} onChange={set('coverImage')} className={field} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="text-sm font-semibold" htmlFor="tags">Tags (comma separated)</label><input id="tags" value={form.tags} onChange={set('tags')} className={field} /></div>
              <div><label className="text-sm font-semibold" htmlFor="status">Status</label>
                <select id="status" value={form.status} onChange={set('status')} className={field}><option value="draft">Draft</option><option value="published">Published</option></select></div>
            </div>
            <div><label className="text-sm font-semibold" htmlFor="content">Content (Markdown)</label><textarea id="content" required rows={12} value={form.content} onChange={set('content')} className={`${field} font-mono text-sm`} /></div>
            <div className="flex gap-3">
              <button disabled={busy} className="btn-primary disabled:opacity-60">{busy ? 'Saving...' : editingId ? 'Save changes' : 'Create post'}</button>
              {editingId && <button type="button" className="btn-ghost" onClick={() => { setEditingId(null); setForm(EMPTY); }}>Cancel</button>}
            </div>
          </form>

          <section aria-labelledby="all-posts">
            <h2 id="all-posts" className="text-2xl font-bold">All posts ({posts.length})</h2>
            {posts.length === 0 ? (
              <p className="mt-4 text-ink-soft">No posts yet. Create the first one, or run <code>npm run seed</code> in the backend.</p>
            ) : (
              <ul className="mt-4 divide-y divide-ink/10 rounded-2xl bg-white ring-1 ring-ink/10">
                {posts.map((p) => (
                  <li key={p.id} className="flex items-start justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-bold">{p.title}</p>
                      <p className="text-sm text-ink-mute">
                        <span className={`mr-2 rounded-full px-2 py-0.5 text-xs font-semibold ${p.status === 'published' ? 'bg-mint-tint' : 'bg-marigold-tint'}`}>{p.status}</span>
                        {formatDate(p.publishedAt || p.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2 text-sm font-semibold">
                      <button onClick={() => edit(p)} className="rounded-lg px-3 py-1.5 text-signal hover:bg-signal-tint">Edit</button>
                      <button onClick={() => remove(p)} className="rounded-lg px-3 py-1.5 text-red-700 hover:bg-red-50">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
