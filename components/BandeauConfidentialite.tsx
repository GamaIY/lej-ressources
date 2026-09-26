'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Bandeau d'information et de choix.
 *
 * Tant que le visiteur n'a pas repondu, rien n'est envoye au serveur : la
 * requete qui enregistre la visite part uniquement apres un « Accepter ».
 * Le bouton « Refuser » n'est donc pas decoratif, il empeche reellement
 * l'enregistrement de l'adresse IP.
 *
 * Le choix lui-meme est garde dans un cookie. Un cookie de preference de ce
 * type est considere comme strictement necessaire : sans lui, il faudrait
 * reposer la question a chaque page.
 */

const COOKIE = 'lej-journal';
const SIX_MOIS = 60 * 60 * 24 * 182;

/**
 * Mode test, active par NEXT_PUBLIC_JOURNAL_SANS_CONSENTEMENT=1.
 *
 * Le bandeau disparait et chaque visite est enregistree sans rien demander.
 * A n'utiliser que tant que le site n'est consulte par personne d'autre que
 * toi : des qu'une autre personne y accede, retire la variable sur Vercel et
 * redeploie. Le mode par defaut, sans variable, est celui qui demande
 * l'accord — c'est volontaire : un oubli retombe du cote sur.
 */
const SANS_CONSENTEMENT = process.env.NEXT_PUBLIC_JOURNAL_SANS_CONSENTEMENT === '1';

/**
 * La page d'administration ne se compte pas elle-meme : sinon chaque
 * consultation du journal par la direction gonfle les statistiques que ce
 * meme journal affiche, et y inscrit l'adresse de la direction.
 */
function estPageAdmin(chemin: string): boolean {
  return chemin.startsWith('/journal');
}

type Choix = 'oui' | 'non' | null;

function lireChoix(): Choix {
  if (typeof document === 'undefined') return null;
  const trouve = document.cookie
    .split(';')
    .map((morceau) => morceau.trim())
    .find((morceau) => morceau.startsWith(`${COOKIE}=`));

  const valeur = trouve?.split('=')[1];
  return valeur === 'oui' || valeur === 'non' ? valeur : null;
}

function ecrireChoix(choix: Exclude<Choix, null>) {
  document.cookie = `${COOKIE}=${choix}; path=/; max-age=${SIX_MOIS}; SameSite=Lax`;
}

export function BandeauConfidentialite() {
  const chemin = usePathname();
  const [choix, setChoix] = useState<Choix>(null);
  const [charge, setCharge] = useState(false);

  // Le cookie n'est lisible que dans le navigateur : on attend le montage
  // pour eviter que le serveur et le client ne rendent des choses differentes.
  useEffect(() => {
    setChoix(lireChoix());
    setCharge(true);
  }, []);

  useEffect(() => {
    if (!chemin || estPageAdmin(chemin)) return;
    if (!SANS_CONSENTEMENT && choix !== 'oui') return;

    // La barre finale est obligatoire : next.config a trailingSlash, et sans
    // elle la requete part en redirection 308 avant d'arriver a la route.
    // keepalive : la requete arrive meme si la page est quittee aussitot.
    fetch('/api/journal/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chemin }),
      keepalive: true,
    }).catch(() => {
      // Le journal est accessoire : son echec ne doit rien casser.
    });
  }, [choix, chemin]);

  function repondre(reponse: Exclude<Choix, null>) {
    ecrireChoix(reponse);
    setChoix(reponse);
  }

  // Inutile de demander son consentement a la direction sur une page qui,
  // justement, n'enregistre rien.
  if (SANS_CONSENTEMENT) return null;
  if (!charge || choix !== null || estPageAdmin(chemin ?? '')) return null;

  return (
    <div
      role="dialog"
      aria-label="Information sur les donnees collectees"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-900">
        <p className="flex-1 text-sm text-slate-600 dark:text-slate-300">
          Ce site enregistre <strong className="font-semibold">ton adresse IP</strong> et la page
          consultee pendant <strong className="font-semibold">48 heures</strong>, a des fins de
          securite et de statistiques de frequentation. Rien n&apos;est conserve au-dela, et aucune
          donnee n&apos;est transmise a un tiers.{' '}
          <Link
            href="/confidentialite"
            className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-400"
          >
            En savoir plus
          </Link>
        </p>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => repondre('non')}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-100 sm:flex-none dark:border-slate-600 dark:hover:bg-slate-800"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => repondre('oui')}
            className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:flex-none dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}

/** Permet de revenir sur son choix depuis la page de confidentialite. */
export function BoutonRevenirSurLeChoix() {
  const [message, setMessage] = useState<string | null>(null);

  function reinitialiser() {
    document.cookie = `${COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    setMessage('Choix efface. La question te sera reposee au prochain chargement de page.');
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={reinitialiser}
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900"
      >
        Revenir sur mon choix
      </button>
      {message && (
        <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">{message}</p>
      )}
    </div>
  );
}
