import type { FastingEvent } from '../types';

export const JourneyMap = ({ events }: { events: FastingEvent[] }) => {
  return (
    <section className="rounded-xl bg-white p-4 ring-1 ring-zinc-200">
      <h2 className="text-lg font-semibold text-zinc-900">Journey Map</h2>
      <p className="mt-2 text-sm text-zinc-600">{events.length} events captured.</p>
    </section>
  );
};
