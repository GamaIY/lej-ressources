'use client';

import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { PageCard } from '@/components/PageCard';
import { SearchIcon } from '@/components/icons';
import type { IndexEntry } from '@/lib/labels';

type Filtre = { valeur: string; libelle: string };

/**
 * Tout le filtrage se fait dans le navigateur : l'index complet est livre
 * avec la page. C'est ce qui permet au site de rester entierement statique.
 */
export function Search({
  entries,
  matieres,
  types,
}: {
  entries: IndexEntry[];
  matieres: Filtre[];
  types: Filtre[];
}) {
  const [q, setQ] = useState('');
  const [matiere, setMatiere] = useState('');
  const [type, setType] = useState('');

  const resultats = useMemo(() => {
    const besoin = q.trim().toLowerCase();

    return entries.filter((entry) => {
      if (matiere && entry.matiere !== matiere) return false;
      if (type && entry.type !== type) return false;
      if (besoin && !entry.recherche.includes(besoin)) return false;
      return true;
    });
  }, [entries, q, matiere, type]);

  const actif = Boolean(q.trim() || matiere || type);

  return (
    <div>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Chercher un cours, une interro, un professeur..."
          aria-label="Rechercher"
          autoFocus
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 text-[15px] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-slate-600 dark:focus:ring-white/5"
        />
      </div>

      <div className="mt-5 space-y-3">
        <FiltreLigne
          label="Matiere"
          options={matieres}
          courant={matiere}
          onChange={setMatiere}
        />
        <FiltreLigne label="Type" options={types} courant={type} onChange={setType} />
      </div>

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        {resultats.length} page{resultats.length === 1 ? '' : 's'}
        {actif && ' correspondent a ta recherche'}
      </p>

      <div className="mt-4">
        {resultats.length === 0 ? (
          <EmptyState
            titre="Rien trouve"
            texte="Essaie avec moins de filtres, ou un autre mot-cle."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resultats.map((entry) => (
              <PageCard
                key={`${entry.matiere}/${entry.slug}`}
                titre={entry.titre}
                matiere={entry.matiere}
                matiereNom={entry.matiereNom}
                matiereCouleur={entry.matiereCouleur}
                slug={entry.slug}
                type={entry.type}
                annee={entry.annee}
                prof={entry.prof}
                resume={entry.resume}
                fichiers={entry.fichiers}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FiltreLigne({
  label,
  options,
  courant,
  onChange,
}: {
  label: string;
  options: Filtre[];
  courant: string;
  onChange: (valeur: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
        {label}
      </span>
      <Chip actif={!courant} onClick={() => onChange('')}>
        Tous
      </Chip>
      {options.map((option) => (
        <Chip
          key={option.valeur}
          actif={courant === option.valeur}
          onClick={() => onChange(courant === option.valeur ? '' : option.valeur)}
        >
          {option.libelle}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  actif,
  onClick,
  children,
}: {
  actif: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={
        actif
          ? 'rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-slate-900'
          : 'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
      }
    >
      {children}
    </button>
  );
}
