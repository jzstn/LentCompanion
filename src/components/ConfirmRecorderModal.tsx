import type { EventType } from '../types';

interface ConfirmRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: EventType;
}

export const ConfirmRecorderModal = ({ isOpen, onClose, onConfirm, type }: ConfirmRecorderModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 ring-1 ring-zinc-200">
        <h2 className="text-lg font-semibold text-zinc-900">Quick check-in for {type}</h2>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-zinc-300 px-3 py-2 text-sm">Cancel</button>
          <button type="button" onClick={onConfirm} className="rounded-xl bg-zinc-900 px-3 py-2 text-sm text-white">Save</button>
        </div>
      </div>
    </div>
  );
};
