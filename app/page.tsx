import Link from 'next/link';
import { EmptyState } from '@/components/EmptyState';
import { PageCard } from '@/components/PageCard';
import { SearchIcon } from '@/components/icons';
import { SubjectCard } from '@/components/SubjectCard';
import { getPages, getSubjects } from '@/lib/content';

export default function HomePage() {
  const subjects = getSubjects();
  const recent = getPages().slice(0, 6);
  const total = subjects.reduce((sum, subject) => sum + subject.pages, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <section className="py-14 text-center sm:py-20">
        <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase dark:text-slate-500">
          LEJ
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Tous tes cours au meme endroit
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-pretty text-slate-600 dark:text-slate-400">
          Cours, syntheses, anciennes interrogations et examens. Classes par matiere, consultables
          en ligne et telechargeables.
        </p>

        <Link
          href="/recherche"
          className="mx-auto mt-8 flex w-full max-w-lg items-center gap-3 rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-4 text-left text-[15px] text-slate-400 shadow-sm transition hover:border-slate-300 hover:shadow dark:border-slate-800 dark:bg-slate-900"
        >
          <SearchIcon className="size-5 shrink-0" />
          Chercher un cours, une interro, un professeur...
        </Link>

        {total > 0 && (
          <dl className="mx-auto mt-10 flex max-w-lg justify-center gap-8 text-sm sm:gap-12">
            <Stat value={total} label={total === 1 ? 'page' : 'pages'} />
            <Stat
              value={subjects.length}
              label={subjects.length === 1 ? 'matiere' : 'matieres'}
            />
          </dl>
        )}
      </section>

      <section className="pb-16">
        <h2 className="mb-5 text-xl font-semibold tracking-tight">Matieres</h2>

        {subjects.length === 0 ? (
          <EmptyState
            titre="Aucune matiere pour l'instant"
            texte="Cree un dossier dans content/ avec un fichier .md dedans, pousse sur GitHub, et la matiere apparaitra ici."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <SubjectCard key={subject.slug} subject={subject} />
            ))}
          </div>
        )}
      </section>

      {recent.length > 0 && (
        <section className="pb-20">
          <h2 className="mb-5 text-xl font-semibold tracking-tight">Derniers ajouts</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((page) => (
              <PageCard
                key={`${page.matiere}/${page.slug}`}
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
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block text-2xl font-bold tracking-tight tabular-nums">{value}</span>
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
      </dd>
    </div>
  );
}
