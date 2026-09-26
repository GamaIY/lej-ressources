---
titre: Chapitre 3 — Les derivees
type: cours
annee: 2025-2026
prof: M. Dupont
date: 2026-09-24
resume: Definition, regles de calcul et applications, avec les exercices types corriges au tableau.
fichiers:
  - titre: Le cours complet (PDF)
    lien: /fichiers/maths-chapitre-3.pdf
---

## Definition

Le nombre derive de `f` en `a` est la limite du taux d'accroissement :

> f'(a) = lim (f(a+h) - f(a)) / h quand h tend vers 0

Geometriquement, c'est **la pente de la tangente** a la courbe au point d'abscisse `a`.

## Regles a connaitre par coeur

| Fonction     | Derivee          |
| ------------ | ---------------- |
| `x^n`        | `n·x^(n-1)`      |
| `1/x`        | `-1/x²`          |
| `racine(x)`  | `1/(2·racine(x))`|
| `e^x`        | `e^x`            |
| `ln(x)`      | `1/x`            |

### Operations

- **Somme** : `(u + v)' = u' + v'`
- **Produit** : `(u·v)' = u'·v + u·v'`
- **Quotient** : `(u/v)' = (u'·v - u·v') / v²`
- **Composee** : `(v ∘ u)' = u' × v'(u)`

## Ce qui tombe a l'interro

1. Calculer une derivee avec la regle du produit ou du quotient.
2. Determiner l'equation de la tangente en un point.
3. Etudier le signe de la derivee pour dresser le tableau de variations.

Le point 3 vaut la moitie des points : ne le bacle pas.
