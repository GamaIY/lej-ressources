import Link from 'next/link';
import { palette } from '@/lib/colors';
import { typeLabel } from '@/lib/labels';
import { DocIcon, PaperclipIcon } from './icons';

type Props = {
  titre: string;
  matiere: string;
  matiereNom: string;
  matiereCouleur: string;
  slug: string;
  type: string;
  annee?: string | null;
  prof?: string | null;
  resume?: string | null;
  fichiers?: number;
  /** Sur la page d'une matiere, repeter son nom sur chaque carte est inutile. */
  masquerMatiere?: boolean;
};

export function PageCard({
  titre,
  matiere,
  matiereNom,
  matiereCouleur,
  slug,
  type,
  annee,
  prof,
  resume,
  fichiers = 0,
  masquerMatiere = false,
}: Props) {
  const tone = palette(matiereCouleur);

  return (
    <Link
      href={`/matiere/${matiere}/${slug}`}
      className={`group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 ${tone.card}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset ${tone.chip}`}
        >
          <DocIcon />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] leading-snug font-semibold text-slate-900 dark:text-slate-50">
            {titre}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            {!masquerMatiere && (
              <>
                <span className={`font-medium ${tone.text}`}>{matiereNom}</span>
                <span aria-hidden>·</span>
              </>
            )}
            <span>{typeLabel(type)}</span>
            {annee && (
              <>
                <span aria-hidden>·</span>
                <span>{annee}</span>
              </>
            )}
            {prof && (
              <>
                <span aria-hidden>·</span>
                <span>{prof}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {resume && (
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{resume}</p>
      )}

      {fichiers > 0 && (
        <p className="mt-auto flex items-center gap-1.5 pt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <PaperclipIcon className="size-3.5" />
          {fichiers} fichier{fichiers > 1 ? 's' : ''} a telecharger
        </p>
      )}
    </Link>
  );
}
