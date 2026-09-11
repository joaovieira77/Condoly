import Sidebar from './Sidebar';

export default function Layout({ title, action, children }) {
  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar />
      <main className="flex-1 px-10 py-8 max-w-5xl">
        <div className="flex items-start justify-between mb-8">
          <h1 className="font-display text-3xl text-ink">{title}</h1>
          {action}
        </div>
        {children}
      </main>
    </div>
  );
}
