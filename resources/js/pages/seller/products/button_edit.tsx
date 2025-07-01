import { Pencil } from 'lucide-react';

interface EditButtonProps {
  onClick: () => void;
}

export default function EditButton({ onClick }: EditButtonProps) {
  return (
    <button
      className="flex w-full items-center gap-2 border border-blue-500 text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
      onClick={onClick}
    >
      <Pencil size={16} />
      EDIT
    </button>
  );
}