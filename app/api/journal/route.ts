import { NextResponse } from 'next/server';
import { adresseIP, enregistrerVisite, journalConfigure } from '@/lib/journal';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Enregistre une visite.
 *
 * Appelee par le navigateur uniquement si le visiteur a accepte dans le
 * bandeau : refuser n'envoie aucune requete ici, donc aucune adresse IP
 * n'est vue ni stockee.
 */
export async function POST(request: Request) {
  // Sans stockage configure, on ne collecte rien plutot que d'echouer bruyamment.
  if (!journalConfigure()) {
    return NextResponse.json({ ok: false, raison: 'journal non configure' }, { status: 204 });
  }

  let chemin = '/';
  try {
    const corps = await request.json();
    if (typeof corps?.chemin === 'string') chemin = corps.chemin.slice(0, 300);
  } catch {
    // Corps absent ou illisible : on garde la valeur par defaut.
  }

  try {
    await enregistrerVisite({
      h: new Date().toISOString(),
      ip: adresseIP(request.headers),
      p: chemin,
      ua: (request.headers.get('user-agent') ?? '').slice(0, 200),
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // Un journal en panne ne doit jamais casser la navigation du visiteur.
    console.error('journal:', error instanceof Error ? error.message : error);
    return new NextResponse(null, { status: 204 });
  }
}
