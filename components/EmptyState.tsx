export function EmptyState({ titre, texte }: { titre: string; texte: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/30">
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{titre}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{texte}</p>
    </div>
  );
}
