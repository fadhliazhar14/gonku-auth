import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import Button from '../forms/button';

export default function ActionButton({
  variant = 'edit',
  appearance = 'solid',
  children,
  className = '',
  handleClick
}) {
  const config = {
    edit: {
      label: 'Edit',
      icon: PencilSquareIcon,
      solid: 'bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800 focus-visible:outline-yellow-600',
      soft: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 active:bg-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:hover:bg-yellow-900/50',
    },
    delete: {
      label: 'Delete',
      icon: TrashIcon,
      solid: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:outline-red-600',
      soft: 'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50',
    },
  }[variant];

  const Icon = config.icon;

  return (
    <Button
      isFormDefault={false}
      handlerOnClick={handleClick}
      styleClasses={`ml-2 inline-flex items-center justify-center gap-2 px-2.5 py-1.5 text-xs font-extrabold rounded-lg transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${config[appearance]} ${className}`}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span>{children || config.label}</span>
    </Button>
  );
}
