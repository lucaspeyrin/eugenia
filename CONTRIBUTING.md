# Contribuer au dépôt Eugenia School

> **Statut : brouillon v0.1.** Les règles marquées **[H]** attendent la validation du comité.

## 1. Avant de commencer

1. Lisez le [README](README.md), en particulier la section RGPD (section 8).
2. Vérifiez qu'une issue n'existe pas déjà sur le même sujet.
3. Pour une idée nouvelle : ouvrez une issue avec le modèle du chantier concerné et attendez la décision du comité avant de coder.

## 2. Règles absolues

- Aucune donnée personnelle réelle, aucun secret, sur aucune branche.
- Aucun sujet d'examen, aucune grille de correction confidentielle, aucun résultat d'élève.
- Personne ne pousse directement sur `main` ni sur une branche `*-main` ou `*-dev`.

## 3. Circuit d'une contribution

```
issue acceptée
  → branche de travail créée depuis <chantier>-dev
  → commits
  → PR vers <chantier>-dev   (revue des mainteneurs du chantier)
  → PR de <chantier>-dev vers <chantier>-main   (publication, par les mainteneurs)
```

| Chantier | Branche de départ | Cible de votre PR |
|---|---|---|
| Site | `site-dev` | `site-dev` |
| Appli | `appli-dev` | `appli-dev` |
| Cursus | `cursus-dev` | `cursus-dev` |
| Documentation commune | `main` | `main` |

## 4. Conventions

**Nom de branche** : `<chantier>/<numéro-issue>-<description-courte>`, par exemple `site/42-page-admissions`.

**Message de commit** [H] : `<type>(<chantier>): <résumé à l'impératif>`

| Type | Usage |
|---|---|
| `contenu` | Texte, page, module de cours |
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction |
| `docs` | Documentation |
| `rgpd` | Mise en conformité données personnelles |
| `chore` | Maintenance, configuration |

Exemple : `contenu(site): réécrit la page admissions`

**Pull request** : une PR = un sujet. Elle référence son issue (`Closes #42`) et remplit le modèle de PR.

## 5. Revue

- Le relecteur vérifie le fond, la forme et la conformité RGPD.
- Les commentaires portent sur le travail, jamais sur la personne.
- Une PR sans activité de son auteur pendant 30 jours peut être fermée [H].

## 6. Signaler un incident

Donnée personnelle ou secret poussé par erreur : ne supprimez rien vous-même, prévenez immédiatement le référent RGPD [À COMPLÉTER]. Une suppression dans un nouveau commit laisse la donnée dans l'historique.

## 7. Licence des contributions

[À DÉFINIR par le comité.] Tant que ce point n'est pas tranché, toute contribution reste sous réserve de la licence qui sera adoptée.
