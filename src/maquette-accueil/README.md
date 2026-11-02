# Maquette de la page d'accueil

Première base de travail pour la refonte du site : la page d'accueil en HTML, CSS et JavaScript, sans framework ni étape de build. Elle sert à discuter de la direction avant de choisir le framework du site (README de `main`, section 6) et de découper les textes en fichiers Markdown dans `contenu/`.

## Lancer en local

Depuis ce dossier :

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000. Ouvrir `index.html` directement dans le navigateur fonctionne aussi.

## Ce qu'il y a dans ce dossier

- `index.html` : la page, une section par bloc.
- `styles.css` : les couleurs de l'école en variables en tête de fichier (`:root`), puis une partie par section, puis tablette et mobile.
- `main.js` : menu mobile, onglets, graphique des salaires, apparitions au défilement, compte à rebours, et le trajet du satellite (fonction `route()`).
- `assets/` : le logo (`logo.svg` foncé, `logo-clair.svg` pour les fonds sombres) et les polices.
- `assets/fonts/` : Sora et Work Sans (licence SIL Open Font License 1.1, textes de licence à côté), hébergées ici pour qu'aucun visiteur ne soit envoyé vers les serveurs de Google.

## L'idée de la page

Le logo est un soleil et son satellite. Le satellite, c'est l'étudiant, qui gravite entre l'école et les entreprises (alternance, cas réels) avant de prendre sa propre trajectoire. Le petit point noir traverse la page au défilement :
1. demi-tour sous le soleil de l'accueil ;
2. bord de la grille des partenaires (les logos qu'il a « visités » reprennent leurs couleurs) ;
3. marge du manifeste, puis ligne de la trajectoire (bac, Bachelor, MSc, métier), dont il allume les étapes ;
4. pastille de l'onglet de cas ouvert ;
5. filet des immersions de l'année ;
6. anneau des témoignages ;
7. axe des salaires ;
8. il se pose sur le soleil de l'appel final.

Le défilement reste celui du navigateur. Le point ne change de colonne que dans les espaces vides entre les sections, pour ne jamais passer sur du texte.

## Ce qui reste à valider ou à faire

- **Contenus** : repris du site actuel (programmes, cas d'entreprise, salaires, associations). Le bloc « Et cette année » (OpenAI × Mirakl, Hackdays Meetic, Hackathon Dust × Eugenia, soirée Replit) vient de comptes rendus d'étudiants : à confirmer par l'école.
- **Témoignages** : anonymisés (ni prénom, ni photo, ni initiale) pour respecter la règle 1 du README de `main` (section 8.1). Les citations viennent de la page `/campus/paris` du site actuel. Pour les illustrer, l'école peut fournir des photos avec le consentement écrit des élèves concernés.
- **Images** : les photos (accueil, programmes, associations) et les logos partenaires sont encore chargés depuis eugeniaschool.com. À remplacer par les originaux de l'école dans `medias/`, avec leurs droits, avant toute mise en ligne.
- **Date de la Journée Portes Ouvertes** (samedi 12 décembre 2026) : écrite en dur dans `index.html` et `main.js`.
- **Liens** : ils pointent vers les pages du site actuel tant que les autres pages ne sont pas refaites.
- **Mentions légales et politique de confidentialité** : liens vides (`#`) dans le pied de page.
