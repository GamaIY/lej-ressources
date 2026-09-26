import Link from 'next/link';
import { RETENTION_SECONDES, journalConfigure, lireVisites, type Visite } from '@/lib/journal';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Journal des visites', robots: { index: false, follow: false } };

export default async function JournalPage() {
  if (!journalConfigure()) {
    return (
      <Cadre>
        <Avertissement>
          Le stockage n&apos;est pas branche. Sur Vercel : <strong>Storage</strong> &rsaquo;{' '}
          <strong>Create Database</strong> &rsaquo; <strong>Upstash for Redis</strong> &rsaquo;{' '}
          <strong>Connect</strong> au projet, puis redeploie. Tant que ce n&apos;est pas fait,
          aucune visite n&apos;est enregistree.
        </Avertissement>
      </Cadre>
    );
  }

  let visites: Visite[];
  try {
    visites = await lireVisites();
  } catch (error) {
    return (
      <Cadre>
        <Avertissement>
          Lecture impossible : {error instanceof Error ? error.message : 'erreur inconnue'}
        </Avertissement>
      </Cadre>
    );
  }

  const ipUniques = new Set(visites.map((visite) => visite.ip)).size;
  const pages = new Map<string, number>();
  for (const visite of visites) {
    pages.set(visite.p, (pages.get(visite.p) ?? 0) + 1);
  }
  const populaires = [...pages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <Cadre>
      <div className="grid gap-4 sm:grid-cols-3">
        <Chiffre valeur={visites.length} libelle="visites" />
        <Chiffre valeur={ipUniques} libelle="adresses distinctes" />
        <Chiffre valeur={Math.round(RETENTION_SECONDES / 3600)} libelle="heures conservees" />
      </div>

      {populaires.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold tracking-wider text-slate-400 uppercase">
            Pages les plus vues
          </h2>
          <ul className="space-y-1.5">
            {populaires.map(([chemin, nombre]) => (
              <li
                key={chemin}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900/60"
              >
                <span className="min-w-0 truncate font-medium">{chemin}</span>
                <span className="shrink-0 text-slate-500 tabular-nums">{nombre}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold tracking-wider text-slate-400 uppercase">
          Detail
        </h2>

        {visites.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Aucune visite enregistree sur les 48 dernieres heures. C&apos;est normal si personne
            n&apos;est venu, ou si les visiteurs ont refuse dans le bandeau.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs tracking-wider text-slate-500 uppercase dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Quand</th>
                  <th className="px-4 py-2.5 font-semibold">Adresse IP</th>
                  <th className="px-4 py-2.5 font-semibold">Page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900/60">
                {visites.map((visite, index) => (
                  <tr key={`${visite.h}-${index}`}>
                    <td className="px-4 py-2.5 whitespace-nowrap tabular-nums">
                      {new Date(visite.h).toLocaleString('fr-BE', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs whitespace-nowrap">{visite.ip}</td>
                    <td className="max-w-xs truncate px-4 py-2.5">{visite.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Cadre>
  );
}

function Cadre({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        &larr; Accueil
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Journal des visites</h1>
      <p className="mt-1 mb-8 text-sm text-slate-500 dark:text-slate-400">
        Les 48 dernieres heures. Au-dela, les donnees sont supprimees automatiquement et ne sont
        recuperables nulle part.
      </p>
      <ModeTest />
      {children}
    </div>
  );
}

/**
 * Rappel affiche a chaque consultation tant que le mode test est actif.
 * C'est le moment ou l'on y pense : celui ou l'on regarde les donnees.
 */
function ModeTest() {
  if (process.env.NEXT_PUBLIC_JOURNAL_SANS_CONSENTEMENT !== '1') return null;

  return (
    <div className="mb-8 rounded-2xl border-2 border-rose-400 bg-rose-50 p-5 text-sm text-rose-900 dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-200">
      <h2 className="text-base font-semibold">Mode test : enregistrement sans consentement</h2>
      <p className="mt-2">
        Le bandeau est desactive et <strong>chaque visite est enregistree sans que le visiteur en
        soit informe</strong>. C&apos;est acceptable tant que tu es seul a utiliser le site.
      </p>
      <p className="mt-2">
        Avant de communiquer l&apos;adresse du site a qui que ce soit : supprime la variable{' '}
        <code className="rounded bg-rose-500/20 px-1">NEXT_PUBLIC_JOURNAL_SANS_CONSENTEMENT</code>{' '}
        sur Vercel et redeploie. Le bandeau revient et plus rien n&apos;est enregistre sans accord.
      </p>
    </div>
  );
}

function Chiffre({ valeur, libelle }: { valeur: number; libelle: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{libelle}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums">{valeur}</p>
    </div>
  );
}

function Avertissement({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
      {children}
    </div>
  );
}
