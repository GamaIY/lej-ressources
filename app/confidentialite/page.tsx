import Link from 'next/link';
import { BoutonRevenirSurLeChoix } from '@/components/BandeauConfidentialite';

export const metadata = {
  title: 'Confidentialite',
  description: 'Quelles donnees ce site enregistre, pourquoi, combien de temps.',
};

const contact = process.env.NEXT_PUBLIC_CONTACT_RGPD;

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        &larr; Accueil
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight">Confidentialite</h1>
      <p className="mt-3 text-lg text-pretty text-slate-600 dark:text-slate-400">
        Cette page explique exactement ce que ce site enregistre sur toi, pourquoi, et combien de
        temps.
      </p>

      <div className="prose mt-8">
        <h2>Ce qui est enregistre</h2>
        <p>Si tu as clique sur &laquo;&nbsp;Accepter&nbsp;&raquo; dans le bandeau :</p>
        <ul>
          <li>
            <strong>ton adresse IP</strong> — le numero que ton fournisseur d&apos;acces attribue a
            ta connexion ;
          </li>
          <li>
            <strong>la page consultee</strong> et la <strong>date et heure</strong> de la visite ;
          </li>
          <li>
            le <strong>type de navigateur</strong> que tu utilises.
          </li>
        </ul>
        <p>
          C&apos;est tout. Pas de nom, pas d&apos;adresse e-mail, pas de compte, pas de mouchard
          publicitaire, pas de reseau social, pas de profil de navigation.
        </p>

        <h2>Si tu refuses</h2>
        <p>
          Rien n&apos;est envoye et <strong>ton adresse IP n&apos;est jamais enregistree</strong>.
          Le bouton &laquo;&nbsp;Refuser&nbsp;&raquo; n&apos;est pas un bouton de facade : la
          requete qui transmet la visite n&apos;est tout simplement pas declenchee. Le site
          fonctionne exactement pareil.
        </p>

        <h2>Combien de temps</h2>
        <p>
          <strong>48 heures.</strong> La suppression est faite automatiquement par la base de
          donnees elle-meme, qui refuse de garder une donnee au-dela de ce delai. Il n&apos;y a
          aucune archive, aucune sauvegarde, aucune copie ailleurs.
        </p>

        <h2>Pourquoi</h2>
        <p>
          Pour mesurer la frequentation du site et pouvoir reagir en cas d&apos;usage abusif
          (surcharge, tentative d&apos;intrusion). Ces donnees ne servent ni a identifier
          individuellement un eleve, ni a controler qui consulte quoi.
        </p>

        <h2>Qui y a acces</h2>
        <p>
          Seule la direction de l&apos;etablissement, via une page protegee par mot de passe. Les
          donnees ne sont ni vendues, ni partagees, ni transmises a un tiers. Elles sont hebergees
          en Europe.
        </p>

        <h2>Les cookies</h2>
        <p>
          Ce site pose <strong>un seul cookie</strong>, qui retient la reponse que tu as donnee au
          bandeau. Sans lui, la question te serait reposee a chaque page. Il ne sert a rien
          d&apos;autre et ne permet aucun suivi.
        </p>

        <h2>Tes droits</h2>
        <p>
          Le reglement europeen (RGPD) te donne le droit de demander quelles donnees te concernant
          sont enregistrees, de les faire corriger ou supprimer, et de t&apos;opposer a leur
          enregistrement. En pratique, tu peux aussi simplement refuser dans le bandeau, ou revenir
          sur ton choix ci-dessous.
        </p>
        <p>
          Tu peux egalement introduire une reclamation aupres de l&apos;Autorite de protection des
          donnees (
          <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noreferrer">
            autoriteprotectiondonnees.be
          </a>
          ).
        </p>

        <h2>Contact</h2>
        {contact ? (
          <p>
            Pour toute question sur tes donnees :{' '}
            <a href={`mailto:${contact}`}>{contact}</a>.
          </p>
        ) : (
          <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            <strong>A completer par l&apos;etablissement :</strong> le nom du responsable du
            traitement, son adresse, et l&apos;adresse de contact du delegue a la protection des
            donnees. Renseigne la variable <code>NEXT_PUBLIC_CONTACT_RGPD</code> sur Vercel pour
            afficher l&apos;adresse de contact, et complete cette section avec l&apos;identite
            exacte de l&apos;ecole.
          </p>
        )}
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
        <h2 className="text-base font-semibold tracking-tight">Ton choix</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Tu peux changer d&apos;avis a tout moment, dans un sens comme dans l&apos;autre.
        </p>
        <BoutonRevenirSurLeChoix />
      </section>
    </div>
  );
}
