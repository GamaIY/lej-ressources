import { NextResponse, type NextRequest } from 'next/server';

/**
 * Protege la page /journal, qui affiche des donnees personnelles.
 *
 * L'authentification HTTP Basic suffit ici : le navigateur affiche lui-meme
 * la fenetre de mot de passe, il n'y a donc ni page de connexion a ecrire ni
 * session a gerer. Le mot de passe circule chiffre puisque Vercel impose
 * HTTPS.
 */

const IDENTIFIANT = 'direction';

/** Comparaison a temps constant, pour ne pas fuiter le mot de passe caractere par caractere. */
function memeChaine(a: string, b: string): boolean {
  const encodeur = new TextEncoder();
  const ba = encodeur.encode(a);
  const bb = encodeur.encode(b);
  let difference = ba.length ^ bb.length;
  for (let i = 0; i < Math.max(ba.length, bb.length); i++) {
    difference |= (ba[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return difference === 0;
}

function demanderIdentifiants(message: string) {
  return new NextResponse(message, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Journal des visites", charset="UTF-8"',
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}

export function middleware(request: NextRequest) {
  const attendu = process.env.JOURNAL_PASSWORD;

  // Sans mot de passe configure, la page reste fermee : mieux vaut
  // inaccessible qu'ouverte a tous.
  if (!attendu) {
    return new NextResponse(
      "La variable JOURNAL_PASSWORD n'est pas definie : la page est desactivee.",
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } }
    );
  }

  const entete = request.headers.get('authorization');
  if (!entete?.startsWith('Basic ')) {
    return demanderIdentifiants('Authentification requise.');
  }

  let identifiant = '';
  let motDePasse = '';
  try {
    const decode = atob(entete.slice(6));
    const separateur = decode.indexOf(':');
    identifiant = decode.slice(0, separateur);
    motDePasse = decode.slice(separateur + 1);
  } catch {
    return demanderIdentifiants('En-tete illisible.');
  }

  if (!memeChaine(identifiant, IDENTIFIANT) || !memeChaine(motDePasse, attendu)) {
    return demanderIdentifiants('Identifiants incorrects.');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/journal', '/journal/:path*'],
};
