export default function EmptyState({ title, description }) {
  return (
    <div className="panel px-8 py-12 text-center">
      <p className="font-display text-lg text-ink mb-1">{title}</p>
      {description && <p className="text-sm text-ink-soft">{description}</p>}
    </div>
  );
}
