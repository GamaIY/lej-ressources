# LEJ — Ressources

Site statique de partage de cours, syntheses, anciennes interrogations et
examens. Chaque page est un fichier texte dans ce depot.

**Aucune base de donnees, aucun compte, aucune variable d'environnement,
aucune integration a brancher.** `next build` produit des fichiers HTML que
Vercel sert tels quels.

Pour ajouter du contenu : tu ecris un fichier, tu le mets sur GitHub,
Vercel redeploie tout seul en une trentaine de secondes.

---

## Deploiement, une seule fois

### 1. Mettre le code sur GitHub

```bash
git remote add origin https://github.com/<ton-compte>/<ton-repo>.git
git push -u origin main
```

### 2. Importer sur Vercel

[vercel.com/new](https://vercel.com/new) → **Import** le repo → **Deploy**.

Ne change aucun reglage : Vercel detecte Next.js tout seul. Il n'y a rien a
configurer apres, le site est en ligne et fonctionne immediatement.

---

## Ajouter une page

### Depuis GitHub, sans rien installer

1. Ouvre ton depot sur github.com.
2. Va dans `content/`, puis dans le dossier de la matiere voulue.
3. **Add file** → **Create new file**.
4. Nomme-le `mon-sujet.md` (minuscules, tirets, pas d'accents ni d'espaces).
5. Colle le modele ci-dessous, modifie-le, **Commit changes**.

Vercel redeploie automatiquement. La page apparait au bout de ~30 secondes.

### Le modele

```markdown
---
titre: Chapitre 4 — Les integrales
type: cours
annee: 2025-2026
prof: M. Dupont
date: 2026-10-15
resume: Une phrase affichee sur les cartes et dans les resultats Google.
---

## Un sous-titre

Le texte s'ecrit en **Markdown** : *italique*, [un lien](https://example.com),
`du code`.

- une liste
- a puces

> Une citation ou un encadre important.
```

Le fichier [content/MODELE.md](content/MODELE.md) contient ce modele, pret a
copier.

### Les champs entre les deux lignes de tirets

| Champ      | Obligatoire | Role                                                    |
| ---------- | ----------- | ------------------------------------------------------- |
| `titre`    | non\*       | Le titre affiche. Sans lui, le nom du fichier est utilise |
| `type`     | non         | `cours` par defaut. Sert a grouper et a filtrer          |
| `annee`    | non         | Texte libre : `2025-2026`                                |
| `prof`     | non         | Texte libre                                              |
| `date`     | non         | `AAAA-MM-JJ`. Classe les « derniers ajouts »             |
| `resume`   | non         | Une phrase de presentation                               |
| `fichiers` | non         | Les documents a telecharger (voir plus bas)              |

\* Tout est optionnel, mais un titre et un resume rendent le site bien plus
lisible.

Types disponibles : `cours`, `synthese`, `interrogation`, `examen`,
`exercices`, `corrige`, `info`.

---

## Joindre un PDF

1. Depose le fichier dans `public/fichiers/` (sur github.com : **Add file** →
   **Upload files**, tu peux glisser-deposer).
2. Reference-le dans la page :

```markdown
---
titre: Interrogation de janvier
type: interrogation
fichiers:
  - titre: Enonce (PDF)
    lien: /fichiers/maths-interro-janvier.pdf
  - titre: Corrige (PDF)
    lien: /fichiers/maths-interro-janvier-corrige.pdf
---
```

Le chemin commence toujours par `/fichiers/`, **sans** `public` devant.

> Les PDF actuellement dans `public/fichiers/` sont des exemples generes
> automatiquement. Remplace-les par les vrais.

---

## Ajouter une matiere

Cree un dossier dans `content/`, par exemple `content/anglais/`, et mets
dedans un fichier `matiere.json` :

```json
{
  "nom": "Anglais",
  "couleur": "violet",
  "description": "Grammaire, vocabulaire et litterature",
  "ordre": 5
}
```

- `nom` : le nom affiche. Sans ce fichier, le nom du dossier est utilise.
- `couleur` : `blue`, `violet`, `emerald`, `amber`, `rose`, `cyan`, `lime`,
  `orange`, `fuchsia`, `slate`.
- `ordre` : petit nombre = plus haut dans la liste.

Le nom du dossier devient l'adresse de la matiere : `content/anglais/` donne
`/matiere/anglais`. **Renommer un dossier casse les liens deja partages** vers
cette matiere.

---

## Travailler en local (optionnel)

Pas obligatoire — tout se fait tres bien depuis github.com. Mais pour voir le
rendu avant de publier :

```bash
npm install
npm run dev
```

Puis [localhost:3000](http://localhost:3000). Les pages se rafraichissent
a chaque fois que tu enregistres un fichier.

```bash
npm run build   # genere le site statique dans out/
```

---

## Structure

```
content/               tout le contenu du site
  MODELE.md            le modele a copier pour une nouvelle page
  mathematiques/
    matiere.json       nom, couleur et ordre de la matiere
    chapitre-3-derivees.md
    interro-janvier-2025.md
  francais/
  sciences/
  infos-pratiques/

public/fichiers/       les PDF et documents a telecharger

app/                   les pages du site
  page.tsx                       accueil
  recherche/                     recherche, filtree dans le navigateur
  matiere/[slug]/                les pages d'une matiere, groupees par type
  matiere/[slug]/[page]/         une page de contenu
lib/
  content.ts           lit le dossier content/ au moment du build
  labels.ts            types et libelles partages
components/            cartes, recherche, icones
```

---

## Ce que le site ne fait pas

Il n'y a **pas de page d'administration** : ajouter du contenu passe
forcement par GitHub. C'est le prix de la simplicite — en echange, il n'y a
rien qui puisse tomber en panne, rien a payer, rien a configurer, et le site
se charge instantanement.

Si un jour tu veux deposer des fichiers depuis une page web plutot que depuis
GitHub, il faudra rajouter un stockage (Vercel Blob) et une page protegee par
mot de passe.
