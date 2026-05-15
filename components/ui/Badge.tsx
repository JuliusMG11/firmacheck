interface BadgeProps {
  active: boolean;
}

export default function Badge({ active }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
        ${active
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}
    >
      {active ? 'aktivní' : 'neaktivní'}
    </span>
  );
}
