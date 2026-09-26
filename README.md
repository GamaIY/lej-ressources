# LEJ — Ressources

Site statique de partage de cours, syntheses, anciennes interrogations et
examens. Chaque page est un fichier texte dans ce depot.

Les pages sont pre-generees au build : le site est quasi entierement
statique. Seuls le journal des visites et sa page de consultation tournent
cote serveur.

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

## Le journal des visites

Demande par la direction. Conception retenue :

- **Ce qui est enregistre** : adresse IP, page consultee, date et heure,
  navigateur declare. Rien d'autre.
- **Uniquement apres accord.** Le bandeau propose « Accepter » et
  « Refuser ». Refuser n'envoie aucune requete au serveur : l'adresse IP
  n'est alors ni vue ni stockee. Ce n'est pas un bandeau decoratif.
- **48 heures, garanties par la base.** Chaque journee de visites recoit une
  duree de vie de 48 h dans Redis, qui supprime tout seul. Il n'y a pas de
  script de nettoyage qu'on pourrait oublier de lancer, et pas de sauvegarde
  d'ou les donnees pourraient ressortir.
- **Consultation** : `/journal`, protege par mot de passe
  (identifiant `direction`, mot de passe = `JOURNAL_PASSWORD`). La page est
  en `noindex` : elle n'apparaitra pas dans Google.
- **Information des visiteurs** : la page `/confidentialite` detaille ce qui
  est collecte, pourquoi, combien de temps, et les droits RGPD.

### Mode test, tant que le site n'est ouvert a personne

Tant que tu es seul a consulter le site, le bandeau n'a pas d'interet : tu
peux enregistrer toutes les visites automatiquement pour observer le trafic.

Ajoute sur Vercel la variable
`NEXT_PUBLIC_JOURNAL_SANS_CONSENTEMENT` = `1`, puis redeploie. Le bandeau
disparait, chaque visite est enregistree, et la page `/journal` affiche un
avertissement rouge qui te le rappelle a chaque consultation.

**Avant de communiquer l'adresse du site a qui que ce soit : supprime cette
variable** (ne la mets pas a 0, supprime-la) et redeploie. Le bandeau revient
et plus rien n'est enregistre sans accord. Le mode par defaut, sans variable,
est celui qui demande le consentement : un oubli retombe du cote sur.

### A completer par l'etablissement

La page de confidentialite contient un encadre a remplir : identite exacte du
responsable du traitement (l'ecole), son adresse, et le contact du delegue a
la protection des donnees. Une adresse IP est une donnee personnelle au sens
du RGPD, et le public de ce site comprend des mineurs : ces mentions ne sont
pas optionnelles.

Verifie aussi aupres du DPO de l'ecole que la finalite retenue
(frequentation et securite) correspond bien a ce que la direction veut
faire de ces donnees. Si le but est d'identifier individuellement des
eleves, l'adresse IP est un outil a la fois peu fiable et juridiquement
expose : une connexion partagee donne la meme adresse a toute une classe.

---

## Ce que le site ne fait pas

Il n'y a **pas de page d'administration** : ajouter du contenu passe
forcement par GitHub. C'est le prix de la simplicite — en echange, il n'y a
rien qui puisse tomber en panne, rien a payer, rien a configurer, et le site
se charge instantanement.

Si un jour tu veux deposer des fichiers depuis une page web plutot que depuis
GitHub, il faudra rajouter un stockage (Vercel Blob) et une page protegee par
mot de passe.

---

## Plus tard : la connexion Smartschool

Rien n'est fait dans ce sens pour l'instant. Pour que les eleves se
connectent avec leur compte Smartschool, il faut d'abord obtenir des acces
cote ecole : Smartschool expose ses services aux etablissements, pas au
public, et la demande passe par l'administrateur Smartschool de l'ecole
(activation des webservices et delivrance d'une cle). C'est une demarche
administrative, pas technique — autant la lancer des maintenant si la
direction le souhaite, le developpement viendra apres.

A prevoir a ce moment-la : une page de connexion, des sessions, et une
reflexion sur ce qui devient reserve aux eleves connectes. Cela remet aussi
sur la table la question des donnees personnelles, cette fois nominatives.
