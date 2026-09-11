const estilos = {
  brass: 'bg-brass-soft text-[#6B4E20] border-brass/30',
  clay: 'bg-clay-soft text-[#7A342A] border-clay/30',
  forest: 'bg-forest-soft text-[#274539] border-forest/30',
};

export default function StatusBadge({ tone = 'clay', children }) {
  return (
    <span className={`inline-block text-xs px-2.5 py-1 rounded border ${estilos[tone]}`}>
      {children}
    </span>
  );
}
