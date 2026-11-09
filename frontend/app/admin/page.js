import AdminPanel from '@/components/AdminPanel';

export const metadata = { title: 'Blog admin demo', robots: { index: false } };

export default function AdminPage() {
  return (
    <div className="container-x py-14 md:py-20">
      <h1 className="text-4xl font-extrabold md:text-5xl">Blog admin</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        A small demo client for the blog API. Enter the <code>ADMIN_API_KEY</code> from the backend's <code>.env</code> to create,
        edit and delete posts. The key stays in this browser tab (session storage) and is only sent to the API.
      </p>
      <AdminPanel />
    </div>
  );
}
