/**
 * Types et helpers sans acces au disque : ce module peut etre importe
 * aussi bien par le serveur que par les composants client.
 * Tout ce qui lit `content/` vit dans lib/content.ts, cote serveur uniquement.
 */

export const TYPES: Record<string, string> = {
  cours: 'Cours',
  synthese: 'Synthese',
  interrogation: 'Interrogation',
  examen: 'Examen',
  exercices: 'Exercices',
  corrige: 'Corrige',
  info: 'Info',
};

export function typeLabel(type: string): string {
  return TYPES[type] ?? type;
}

export function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export type Attachment = {
  titre: string;
  lien: string;
};

export type Subject = {
  slug: string;
  nom: string;
  couleur: string;
  description: string | null;
  ordre: number;
  pages: number;
};

export type Page = {
  slug: string;
  matiere: string;
  matiereNom: string;
  matiereCouleur: string;
  titre: string;
  type: string;
  annee: string | null;
  prof: string | null;
  resume: string | null;
  date: string | null;
  fichiers: Attachment[];
  html: string;
  texte: string;
};

/** Version allegee d'une page, embarquee dans la page de recherche. */
export type IndexEntry = {
  titre: string;
  matiere: string;
  matiereNom: string;
  matiereCouleur: string;
  slug: string;
  type: string;
  annee: string | null;
  prof: string | null;
  resume: string | null;
  fichiers: number;
  recherche: string;
};
