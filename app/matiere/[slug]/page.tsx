import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EmptyState } from '@/components/EmptyState';
import { PageCard } from '@/components/PageCard';
import { palette } from '@/lib/colors';
import { getPages, getSubject, getSubjects } from '@/lib/content';
import { TYPES, typeLabel, type Page } from '@/lib/labels';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getSubjects().map((subject) => ({ slug: subject.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  return { title: getSubject(slug)?.nom ?? 'Matiere' };
}

export default async function SubjectPage({ params }: { params: Params }) {
  const { slug } = await params;

  const subject = getSubject(slug);
  if (!subject) notFound();

  const pages = getPages(slug);
  const tone = palette(subject.couleur);

  // Regroupe par type pour que la page reste lisible quand il y en a beaucoup.
  const groups = new Map<string, Page[]>();
  for (const page of pages) {
    const list = groups.get(page.type) ?? [];
    list.push(page);
    groups.set(page.type, list);
  }

  const order = Object.keys(TYPES);
  const kinds = [...groups.keys()].sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        &larr; Toutes les matieres
      </Link>

      <header className="mt-4 flex flex-wrap items-center gap-3">
        <span className={`size-3 rounded-full ${tone.dot}`} aria-hidden />
        <h1 className="text-3xl font-bold tracking-tight">{subject.nom}</h1>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tone.chip}`}
        >
          {pages.length} page{pages.length === 1 ? '' : 's'}
        </span>
      </header>

      {subject.description && (
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">{subject.description}</p>
      )}

      {pages.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            titre="Rien dans cette matiere"
            texte={`Ajoute un fichier .md dans content/${subject.slug}/ et il apparaitra ici.`}
          />
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {kinds.map((kind) => (
            <section key={kind}>
              <h2 className="mb-4 text-sm font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                {typeLabel(kind)}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groups.get(kind)!.map((page) => (
                  <PageCard
                    key={page.slug}
                    titre={page.titre}
                    matiere={page.matiere}
                    matiereNom={page.matiereNom}
                    matiereCouleur={page.matiereCouleur}
                    slug={page.slug}
                    type={page.type}
                    annee={page.annee}
                    prof={page.prof}
                    resume={page.resume}
                    fichiers={page.fichiers.length}
                    masquerMatiere
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
