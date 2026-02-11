import { useMemo } from 'react';
import type { EventType, RecorderDraft } from '../types';

interface ConfirmRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: RecorderDraft;
  setDraft: (draft: RecorderDraft) => void;
  onConfirm: () => void;
}

const JOURNAL_TAGS = ['gratitude', 'honesty', 'surrender', 'focus'];
const PRAYER_FRUITS = ['patience', 'charity', 'discipline', 'peace'];
const INSIGHT_TAGS = ['pattern', 'breakthrough', 'challenge', 'next-step'];

const choicesByType: Record<EventType, string[]> = {
  journal: JOURNAL_TAGS,
  prayer: PRAYER_FRUITS,
  insight: INSIGHT_TAGS
};

const capByType: Record<EventType, number> = {
  journal: 2,
  prayer: 2,
  insight: 3
};

export const ConfirmRecorderModal = ({
  isOpen,
  onClose,
  draft,
  setDraft,
  onConfirm
}: ConfirmRecorderModalProps) => {
  const choices = useMemo(() => choicesByType[draft.type], [draft.type]);
  const cap = capByType[draft.type];

  if (!isOpen) {
    return null;
  }

  const toggleChip = (chip: string) => {
    const selected = draft.chips.includes(chip);

    if (selected) {
      setDraft({ ...draft, chips: draft.chips.filter((c) => c !== chip) });
      return;
    }

    if (draft.chips.length >= cap) {
      return;
    }

    setDraft({ ...draft, chips: [...draft.chips, chip] });
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900">Confirm your entry</h2>
        <p className="mt-1 text-sm text-slate-600">Only selectable chips are supported. Pick up to {cap}.</p>

        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-slate-700">Title</label>
          <input
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Entry title"
          />
        </div>

        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-slate-700">Notes</label>
          <textarea
            value={draft.notes}
            onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
            className="min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Capture what happened and what changed."
          />
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-slate-700">Selectable chips</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {choices.map((chip) => {
              const selected = draft.chips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleChip(chip)}
                  className={`rounded-full border px-3 py-1 text-sm capitalize transition ${
                    selected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            Save entry
          </button>
        </div>
      </div>
    </div>
  );
};
