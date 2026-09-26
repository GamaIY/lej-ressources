import { Search } from '@/components/Search';
import { getSearchIndex, getSubjects } from '@/lib/content';
import { typeLabel } from '@/lib/labels';

export const metadata = { title: 'Rechercher' };

export default function SearchPage() {
  const entries = getSearchIndex();

  const matieres = getSubjects()
    .filter((subject) => subject.pages > 0)
    .map((subject) => ({ valeur: subject.slug, libelle: subject.nom }));

  // Seuls les types reellement utilises meritent un filtre.
  const types = [...new Set(entries.map((entry) => entry.type))]
    .sort()
    .map((type) => ({ valeur: type, libelle: typeLabel(type) }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Rechercher</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500 dark:text-slate-400">
        Dans les titres, le contenu des pages, les professeurs et les annees.
      </p>

      <Search entries={entries} matieres={matieres} types={types} />
    </div>
  );
}
