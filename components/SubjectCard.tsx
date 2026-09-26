import Link from 'next/link';
import { palette } from '@/lib/colors';
import type { Subject } from '@/lib/labels';
import { ArrowIcon } from './icons';

export function SubjectCard({ subject }: { subject: Subject }) {
  const tone = palette(subject.couleur);

  return (
    <Link
      href={`/matiere/${subject.slug}`}
      className={`group flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 ${tone.card}`}
    >
      <span className={`size-2.5 rounded-full ${tone.dot}`} aria-hidden />
      <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {subject.nom}
      </h3>
      {subject.description && (
        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
          {subject.description}
        </p>
      )}
      <p className="mt-auto flex items-center gap-1.5 pt-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="font-medium text-slate-700 dark:text-slate-300">{subject.pages}</span>
        {subject.pages === 1 ? 'page' : 'pages'}
        <ArrowIcon className="size-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
      </p>
    </Link>
  );
}
