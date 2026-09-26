import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DownloadIcon } from '@/components/icons';
import { palette } from '@/lib/colors';
import { getPage, getPages } from '@/lib/content';
import { formatDate, typeLabel } from '@/lib/labels';

type Params = Promise<{ slug: string; page: string }>;

export function generateStaticParams() {
  return getPages().map((page) => ({ slug: page.matiere, page: page.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug, page } = await params;
  const doc = getPage(slug, page);
  if (!doc) return { title: 'Page introuvable' };
  return {
    title: doc.titre,
    description: doc.resume ?? undefined,
  };
}

export default async function ContentPage({ params }: { params: Params }) {
  const { slug, page } = await params;

  const doc = getPage(slug, page);
  if (!doc) notFound();

  const tone = palette(doc.matiereCouleur);
  const date = formatDate(doc.date);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href={`/matiere/${doc.matiere}`}
        className="text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        &larr; {doc.matiereNom}
      </Link>

      <header className="mt-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tone.chip}`}
        >
          {typeLabel(doc.type)}
        </span>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {doc.titre}
        </h1>

        {doc.resume && (
          <p className="mt-3 text-lg text-pretty text-slate-600 dark:text-slate-400">
            {doc.resume}
          </p>
        )}

        <dl className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
          <div>
            <dt className="sr-only">Matiere</dt>
            <dd className={`font-medium ${tone.text}`}>{doc.matiereNom}</dd>
          </div>
          {doc.annee && (
            <>
              <span aria-hidden>·</span>
              <div>
                <dt className="sr-only">Annee</dt>
                <dd>{doc.annee}</dd>
              </div>
            </>
          )}
          {doc.prof && (
            <>
              <span aria-hidden>·</span>
              <div>
                <dt className="sr-only">Professeur</dt>
                <dd>{doc.prof}</dd>
              </div>
            </>
          )}
          {date && (
            <>
              <span aria-hidden>·</span>
              <div>
                <dt className="sr-only">Date</dt>
                <dd>{date}</dd>
              </div>
            </>
          )}
        </dl>
      </header>

      {doc.fichiers.length > 0 && (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <h2 className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            A telecharger
          </h2>
          <ul className="space-y-2">
            {doc.fichiers.map((fichier) => (
              <li key={fichier.lien}>
                <a
                  href={fichier.lien}
                  download
                  className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/50"
                >
                  <DownloadIcon className="size-4 shrink-0 text-slate-400" />
                  <span className="min-w-0 flex-1 truncate">{fichier.titre}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: doc.html }} />
    </article>
  );
}
