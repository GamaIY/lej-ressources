/**
 * Journal des visites.
 *
 * Les visites sont stockees dans Upstash Redis, une liste par jour :
 *
 *   visites:2026-09-26  ->  ["{...}", "{...}", ...]
 *
 * Chaque cle recoit une duree de vie de 48 heures. C'est Redis qui supprime,
 * pas un script de nettoyage : la duree de conservation est donc garantie
 * meme si personne ne s'en occupe. On ne peut pas oublier d'effacer.
 *
 * L'API REST d'Upstash est appelee directement avec fetch : pas de dependance
 * supplementaire a installer.
 */

/** 48 heures, en secondes. C'est la duree de conservation demandee. */
export const RETENTION_SECONDES = 48 * 60 * 60;

/** Nombre de journees a relire pour couvrir 48 h glissantes. */
const JOURS_A_RELIRE = 3;

export type Visite = {
  /** Horodatage ISO */
  h: string;
  /** Adresse IP */
  ip: string;
  /** Chemin visite */
  p: string;
  /** Navigateur declare, tronque */
  ua: string;
};

function config(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ''), token };
}

export function journalConfigure(): boolean {
  return config() !== null;
}

/** Envoie plusieurs commandes Redis en un seul aller-retour. */
async function pipeline(commandes: (string | number)[][]): Promise<unknown[]> {
  const reglages = config();
  if (!reglages) {
    throw new Error(
      "Le journal n'est pas configure : les variables KV_REST_API_URL et KV_REST_API_TOKEN sont absentes."
    );
  }

  const reponse = await fetch(`${reglages.url}/pipeline`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${reglages.token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(commandes),
    cache: 'no-store',
  });

  if (!reponse.ok) {
    throw new Error(`Upstash a repondu ${reponse.status}.`);
  }

  const resultats = (await reponse.json()) as Array<{ result?: unknown; error?: string }>;
  const enErreur = resultats.find((item) => item.error);
  if (enErreur) throw new Error(enErreur.error);

  return resultats.map((item) => item.result);
}

function cleDuJour(date: Date): string {
  return `visites:${date.toISOString().slice(0, 10)}`;
}

/** Les cles des derniers jours, la plus recente en premier. */
function clesRecentes(): string[] {
  const cles: string[] = [];
  for (let recul = 0; recul < JOURS_A_RELIRE; recul++) {
    const date = new Date(Date.now() - recul * 24 * 60 * 60 * 1000);
    cles.push(cleDuJour(date));
  }
  return cles;
}

export async function enregistrerVisite(visite: Visite): Promise<void> {
  const cle = cleDuJour(new Date());

  await pipeline([
    ['RPUSH', cle, JSON.stringify(visite)],
    // Repousse l'expiration a chaque ecriture : la liste du jour disparait
    // 48 h apres la derniere visite qu'elle contient.
    ['EXPIRE', cle, RETENTION_SECONDES],
  ]);
}

/** Les visites des 48 dernieres heures, la plus recente en premier. */
export async function lireVisites(): Promise<Visite[]> {
  const cles = clesRecentes();
  const resultats = await pipeline(cles.map((cle) => ['LRANGE', cle, 0, -1]));

  const limite = Date.now() - RETENTION_SECONDES * 1000;

  return resultats
    .flatMap((resultat) => (Array.isArray(resultat) ? (resultat as string[]) : []))
    .flatMap((brut): Visite[] => {
      try {
        return [JSON.parse(brut) as Visite];
      } catch {
        // Une ligne illisible ne doit pas faire tomber toute la page.
        return [];
      }
    })
    .filter((visite) => new Date(visite.h).getTime() >= limite)
    .sort((a, b) => b.h.localeCompare(a.h));
}

/**
 * L'adresse IP du visiteur.
 * Sur Vercel, la vraie adresse arrive dans x-forwarded-for ; le premier
 * element de la liste est le client, les suivants sont les relais.
 */
export function adresseIP(headers: Headers): string {
  const transmise = headers.get('x-forwarded-for');
  if (transmise) {
    const premiere = transmise.split(',')[0]?.trim();
    if (premiere) return premiere;
  }
  return headers.get('x-real-ip')?.trim() || 'inconnue';
}
