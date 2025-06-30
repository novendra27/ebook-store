import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  onClick: () => void;
}

export default function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button
      className="flex w-full items-center gap-2 border border-red-500 text-red-600 px-4 py-2 rounded hover:bg-red-100"
      onClick={onClick}
    >
      <Trash2 size={16} />
      HAPUS
    </button>
  );
}
