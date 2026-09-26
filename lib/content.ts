import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { TYPES, typeLabel, type Attachment, type IndexEntry, type Page, type Subject } from './labels';

/**
 * Tout le contenu du site vit dans le dossier `content/`, en Markdown.
 *
 *   content/<matiere>/matiere.json   les infos de la matiere (nom, couleur)
 *   content/<matiere>/<page>.md      une page
 *
 * Ce module lit le disque : il est donc reserve au serveur, et de fait au
 * moment du build, puisque le site est entierement statique.
 */

const CONTENT_DIR = join(process.cwd(), 'content');

/** "chapitre-3-derivees" devient "Chapitre 3 derivees", au cas ou le titre manque. */
function prettify(slug: string): string {
  const words = slug.replace(/[-_]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function subjectDirs(): string[] {
  if (!existsSync(CONTENT_DIR)) return [];
  return readdirSync(CONTENT_DIR).filter((entry) => {
    if (entry.startsWith('.') || entry.startsWith('_')) return false;
    return statSync(join(CONTENT_DIR, entry)).isDirectory();
  });
}

function readSubjectMeta(slug: string): Partial<Subject> {
  const file = join(CONTENT_DIR, slug, 'matiere.json');
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as Partial<Subject>;
  } catch {
    // Un JSON casse ne doit pas faire echouer tout le build.
    return {};
  }
}

function markdownFiles(subjectSlug: string): string[] {
  return readdirSync(join(CONTENT_DIR, subjectSlug))
    .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
    .sort();
}

/** `fichiers` accepte une simple liste de chemins ou des objets {titre, lien}. */
function normaliseAttachments(raw: unknown): Attachment[] {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((entry): Attachment[] => {
    if (typeof entry === 'string') {
      return [{ titre: entry.split('/').pop() ?? entry, lien: entry }];
    }
    if (entry && typeof entry === 'object') {
      const item = entry as Record<string, unknown>;
      const lien = typeof item.lien === 'string' ? item.lien : null;
      if (!lien) return [];
      const titre = typeof item.titre === 'string' ? item.titre : (lien.split('/').pop() ?? lien);
      return [{ titre, lien }];
    }
    return [];
  });
}

/** Le YAML transforme `date: 2026-09-26` en objet Date : on reprend du texte. */
function asText(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

function readPage(subjectSlug: string, filename: string, subject: Subject): Page {
  const raw = readFileSync(join(CONTENT_DIR, subjectSlug, filename), 'utf8');
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.md$/, '');

  return {
    slug,
    matiere: subjectSlug,
    matiereNom: subject.nom,
    matiereCouleur: subject.couleur,
    titre: asText(data.titre) ?? prettify(slug),
    type: asText(data.type) ?? 'cours',
    annee: asText(data.annee),
    prof: asText(data.prof),
    resume: asText(data.resume),
    date: asText(data.date),
    fichiers: normaliseAttachments(data.fichiers),
    html: marked.parse(content, { async: false }),
    texte: content.replace(/[#*_`>[\]()-]/g, ' ').replace(/\s+/g, ' ').trim(),
  };
}

export function getSubjects(): Subject[] {
  return subjectDirs()
    .map((slug) => {
      const meta = readSubjectMeta(slug);
      return {
        slug,
        nom: meta.nom ?? prettify(slug),
        couleur: meta.couleur ?? 'blue',
        description: meta.description ?? null,
        ordre: typeof meta.ordre === 'number' ? meta.ordre : 999,
        pages: markdownFiles(slug).length,
      };
    })
    .sort((a, b) => a.ordre - b.ordre || a.nom.localeCompare(b.nom, 'fr'));
}

export function getSubject(slug: string): Subject | null {
  return getSubjects().find((subject) => subject.slug === slug) ?? null;
}

/** Les plus recentes d'abord : par date si elle est donnee, sinon par titre. */
function byRecency(a: Page, b: Page): number {
  if (a.date && b.date) return b.date.localeCompare(a.date);
  if (a.date) return -1;
  if (b.date) return 1;
  return a.titre.localeCompare(b.titre, 'fr');
}

export function getPages(subjectSlug?: string): Page[] {
  return getSubjects()
    .filter((subject) => !subjectSlug || subject.slug === subjectSlug)
    .flatMap((subject) =>
      markdownFiles(subject.slug).map((file) => readPage(subject.slug, file, subject))
    )
    .sort(byRecency);
}

export function getPage(subjectSlug: string, pageSlug: string): Page | null {
  const subject = getSubject(subjectSlug);
  if (!subject) return null;

  const file = `${pageSlug}.md`;
  if (!existsSync(join(CONTENT_DIR, subjectSlug, file))) return null;

  return readPage(subjectSlug, file, subject);
}

/** Index embarque dans la page de recherche : tout se filtre cote navigateur. */
export function getSearchIndex(): IndexEntry[] {
  return getPages().map((page) => ({
    titre: page.titre,
    matiere: page.matiere,
    matiereNom: page.matiereNom,
    matiereCouleur: page.matiereCouleur,
    slug: page.slug,
    type: page.type,
    annee: page.annee,
    prof: page.prof,
    resume: page.resume,
    fichiers: page.fichiers.length,
    recherche: [page.titre, page.matiereNom, typeLabel(page.type), page.prof, page.annee, page.texte]
      .filter(Boolean)
      .join(' ')
      .toLowerCase(),
  }));
}

export { TYPES, typeLabel };
export type { Attachment, IndexEntry, Page, Subject };
