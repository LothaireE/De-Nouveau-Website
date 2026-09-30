# Refactor de l’administration Payload

Branche `refactor/admin-structure`, créée depuis `develop`, dans le worktree
`de-nouveau-refactor`. La branche et le dossier de travail d’origine restent indépendants.

## Environnement isolé

Le `.env` local est une copie de l’original dont seule `DATABASE_URL` a changé.
Il désigne la branche Neon `refactor-admin-structure`. Il n’est pas versionné.
Le fichier local non versionné `.refactor-isolation.json` contient uniquement
`databaseHost`, le nom d’hôte attendu. Tous les points d’entrée Payload refusent
une autre connexion, ainsi que l’endpoint d’origine (avec ou sans pooler).
`PAYLOAD_EXPECTED_DATABASE_HOST` permet de fournir cette valeur explicitement.
Ce garde-fou doit être configuré pour toute nouvelle installation de cette branche.

Le mode `push` et la création automatique de base sont désactivés.
`PAYLOAD_DROP_DATABASE=true` est refusé. Aucune migration historique n’a été exécutée.
Le script dédié exécute uniquement le SQL additif des Globals, dans une transaction,
avec verrou et contrôle de checksum. Son suivi utilise la nouvelle table
`admin_refactor_migrations`.

Les médias S3/R2 sont en lecture seule : création, modification et suppression sont
bloquées par les permissions et un hook, y compris via la Local API avec
`overrideAccess`. Les envois directs du navigateur sont désactivés. Les fichiers
existants restent consultables. L’association automatique projet → média n’est
pas appelée dans cet environnement, puisqu’elle modifierait les documents médias.
Aucun fichier média n’a été copié, modifié ou supprimé.

Les revalidations utilisent le cache Next.js de cette instance, sans requête HTTP
vers l’environnement d’origine. Le cookie `payload-admin-refactor-token` distingue
la connexion admin de celle des autres serveurs locaux.

## Organisation

- `src/globals/` : Accueil, À propos et Contact, regroupés dans « Pages du site ».
- `src/fields/` : champs de pages, slug et SEO ; noms des champs existants conservés.
- `src/access/` : règles d’accès extraites sans changer les droits existants.
- `src/lib/payload/` : client, projets, Globals, repli et métadonnées SEO.
- `src/hooks/revalidate.ts` : revalidation locale des pages, projets et dépendances.
- `src/library/payload/` : exports de compatibilité et helpers existants conservés.

Les Globals gardent tous les champs de contenu des pages pour permettre une copie
complète ; leurs conditions d’affichage sont adaptées au type de page fixe.
Les titres et descriptions SEO des Globals sont facultatifs et reprennent les
valeurs actuelles du site lorsqu’ils sont vides. Les champs SEO historiques des
projets restent inchangés. `SiteSettings` n’a pas été ajouté, conformément au plan validé.

Un Global sans titre renseigné utilise sa page historique. Une fois le Global
renseigné, ses champs facultatifs vides restent vides : ils ne sont pas remplacés
par les anciennes valeurs. Une erreur de base est remontée, pas assimilée à un
Global vide.

## Commandes dans ce worktree

```sh
npm ci
npm run refactor:migrate
npm run refactor:copy
npm run payload:generate
npm run dev:refactor
```

Le serveur de développement écoute sur `http://127.0.0.1:3001`.
Le script de copie travaille en transaction, sans requête de modification sur
`pages`. Il conserve les identifiants des médias et des lignes de listes, vérifie
les contenus après copie et ne remplace jamais un Global contenant déjà une
valeur, même si son titre est encore vide. Il peut être relancé.

Pour créer un relevé en lecture seule de toutes les tables :

```sh
node scripts/database-snapshot.mjs .env /tmp/admin-copy-snapshot.json
```

Ce relevé contient uniquement les nombres de lignes et empreintes SHA-256, sans
contenus ni identifiants de connexion. En cas de modifications simultanées sur
l’environnement d’origine, un écart ultérieur doit être examiné, pas écrasé.

## Vérification des données effectuée

Les 22 tables initiales avaient des contenus identiques entre origine et copie.
Après migration et copie, les empreintes de ces 22 tables sont inchangées dans
les deux bases. Les trois Globals ont été copiés et contrôlés champ par champ.
Une nouvelle exécution de la migration et du script de copie laisse les
35 tables de la copie inchangées (22 initiales, 12 pour les Globals, 1 de suivi).

Collections conservées : 3 pages, 8 projets, 40 médias, 0 catégorie, 1 utilisateur.
`pages` reste en base et sert de repli ; sa collection est masquée dans l’administration (`admin.hidden`). Aucune suppression de l’ancienne
structure n’est préparée ; elle relève d’une intervention séparée à valider.

## SEO automatique

Les pages Accueil, À propos et Contact utilisent les textes dédiés de
`src/library/seoContent.ts`. Le client n’a aucun champ SEO à remplir. Les titres
et descriptions se retrouvent également dans les balises de partage. Les
projets utilisent leur titre, leur description courte et leur couverture.
Les espaces superflus sont nettoyés ; une description longue est résumée en
privilégiant une phrase complète, puis une coupure entre mots avec une ellipse.
La cible de 160 caractères est un choix de présentation, pas une limite Google.
Le contenu éditorial enregistré n’est jamais réécrit.

Tout ce qui concerne le SEO est regroupé dans une section repliable
« Référencement (SEO) », fermée par défaut et placée en fin de formulaire
(projets, Accueil, À propos, Contact ; sur l’Accueil, après « Projets à la
une »). Cette section sans nom ne change ni les chemins des champs ni les
colonnes : le schéma calculé par Payload est identique avant et après.

L’admin y affiche un aperçu en lecture seule, actualisé depuis les champs du
formulaire. Les corrections manuelles des pages fixes sont dans « Réglages SEO
avancés », repliés et visibles seulement aux administrateurs. Les permissions
de création et de modification des deux champs sont également restreintes côté
serveur. Leur lecture reste possible pour afficher la valeur effective dans
l’aperçu. Les champs historiques des projets restent masqués et inutilisés.

Le champ de rôle utilisateur est aussi protégé à la création pour qu’un éditeur
ne puisse pas créer un compte administrateur et contourner ces restrictions.
Aucune promotion de compte, migration ou modification des contenus existants
n’a été effectuée pour ce changement.

La collection `categories` et le champ associé des projets sont masqués dans
l’administration. Leur schéma, leurs données et leur usage dans les données
structurées restent conservés.

## Projets à la une

Dans le Global Accueil, « Projets à la une » permet de sélectionner jusqu’à
trois projets distincts et de réordonner les lignes par glisser-déposer.
Le sélecteur ne propose que les projets publiés et visibles. Le frontend
vérifie également ces critères lors de la lecture, puis restitue l’ordre choisi.
Les références restent des identifiants dans les réponses du Global pour éviter
d’y inclure le contenu d’un projet devenu brouillon ou masqué.

Sur l’accueil, la sélection s’affiche dans une section « Projets à la une »
placée entre l’en-tête et la galerie (`src/components/home/FeaturedProjects.tsx`) :
une rangée par projet, séparée par un filet, avec l’image de couverture sur 7/12
de la largeur, le titre, la description courte et un lien « Voir le projet ».
Le côté de l’image alterne d’une rangée à l’autre ; sur mobile, l’image précède
toujours le texte. Une liste vide masque la section. Une sélection dont certains
projets deviennent indisponibles affiche uniquement les projets encore
admissibles, sans les remplacer par d’autres. La galerie qui suit présente tous
les projets publiés et visibles, qu’ils soient à la une ou non.

La migration additive `20260930_featured_projects.sql`, appliquée par
`npm run refactor:migrate`, ajoute uniquement `home_page_featured_projects`
et ses contraintes et index. Aucun projet n’est dupliqué ni présélectionné.

## Informations de l’agence

Le Global « Informations de l’agence », dans « Réglages du site », centralise email, téléphone, adresse et réseaux sociaux. Les pages du site et les données structurées SEO utilisent cette source unique. Vider un champ dans cette fiche le retire du site : les anciennes valeurs ne sont pas réintroduites. Une sauvegarde invalide le cache de toutes les pages.

Les anciens champs restent en base dans Pages et les Globals de pages, mais sont masqués dans l’admin. La migration additive `20260930_agency_info.sql` crée uniquement deux tables. Après `npm run refactor:migrate`, exécuter `node --import tsx scripts/copy-agency-info.ts` dans l’environnement isolé avant de démarrer le site. La copie transactionnelle privilégie Contact pour les coordonnées, complète les valeurs absentes depuis les autres pages et rassemble les liens sociaux sans doublon. Elle vérifie que les sources restent identiques et ne remplace jamais une fiche déjà initialisée, même vidée volontairement.

## Administration en français

L’interface Payload est configurée en français uniquement (`i18n` dans
`payload.config.ts`). Les libellés, options et descriptions des collections,
Globals et champs partagés sont traduits : projets, médias, utilisateurs, pages
et informations de l’agence.

Seuls les textes affichés changent. Les noms de champs, les slugs et les valeurs
enregistrées (`show`, `hidden`, `délivré`, `portrait`, etc.) sont inchangés :
aucune migration n’est nécessaire et `payload-types.ts` ne diffère que par ses
commentaires.

Les dates de l’admin utilisent le format `d MMMM yyyy, HH:mm`
(« 28 septembre 2026, 11:39 »). La formule générique de Payload
« Créer un(e) nouveau ou nouvelle » est remplacée par « Ajouter ».

## Mentions légales

La fiche « Informations de l’agence » est organisée en deux onglets :
« Coordonnées » (champs existants, chemins inchangés) et « Mentions légales ».
Ce second onglet propose : raison sociale, forme juridique, capital social,
SIRET, RCS, TVA intracommunautaire, inscription à l’Ordre des architectes,
assureur professionnel et détails du contrat, directeur ou directrice de la
publication. Tous les champs sont facultatifs.

La page `/mentions-legales` est générée automatiquement à partir de cette fiche
(`src/library/legalNotice.ts`). Le siège social, l’e-mail et le téléphone
reprennent les coordonnées communes. Un champ vide n’est pas affiché, et une
section sans contenu disparaît. L’hébergeur (Vercel) est une information
technique maintenue dans le code (`SITE_HOSTING`), pas dans l’admin.
Un lien discret « Mentions légales » figure en bas de toutes les pages.
La page n’est pas ajoutée au sitemap. La sauvegarde de la fiche invalide déjà
le cache de tout le site, cette page comprise.

La migration additive `20260930_agency_legal_info.sql`, générée hors connexion
par `scripts/prepare-legal-schema.ts` puis appliquée par
`npm run refactor:migrate`, ajoute uniquement dix colonnes facultatives
`legal_*` à `agency_info`. Aucune donnée n’est copiée. Les relevés avant/après
montrent que seules `agency_info` (nouvelles colonnes vides) et
`admin_refactor_migrations` (une ligne) diffèrent ; les valeurs existantes
d’`agency_info` sont identiques.

## Navigation de l’administration

Le menu est organisé en trois groupes, sans groupe générique « Collections » :

- **Projets** : Projets, Médias ;
- **Réglages du site** : Utilisateurs, Informations de l’agence ;
- **Pages du site** : Accueil, À propos, Contact.

Payload ordonne les groupes selon la première entité visible rencontrée, en
parcourant les collections avant les Globals. L’ordre du tableau `collections`
de `payload.config.ts` a donc été ajusté (Projets, Médias, Utilisateurs, puis
les collections masquées). Il ne change ni les tables ni les données ; seul
l’ordre des déclarations de `payload-types.ts` diffère. Un groupe composé
uniquement de Globals, comme « Pages du site », ne peut pas précéder les groupes
de collections sans remplacer le menu par un composant personnalisé.

## Médias

- La liste et les sélecteurs de médias affichent le nom du fichier, toujours
  renseigné, au lieu du texte alternatif souvent vide. La légende reste visible
  en colonne.
- « Projet associé » est en lecture seule dans l’admin : l’association est
  faite automatiquement. La restriction est limitée à l’interface, pour que le
  hook d’association de l’environnement normal continue de fonctionner.
- La vidéo d’en-tête est limitée à 4 Mo (`src/fields/heroMedia.ts`). Le
  sélecteur ne propose que les images et les vidéos de 4 Mo au plus, et
  l’enregistrement d’une page refuse une vidéo plus lourde avec un message
  explicite. Les images ne sont pas concernées. La limite s’applique au choix du
  média d’en-tête et non à l’envoi dans la médiathèque, où les vidéos de
  galerie peuvent rester plus lourdes. Au moment du changement, l’en-tête était
  une image et la médiathèque ne contenait aucune vidéo.

Aucune migration : seules des options d’administration et de validation
changent, et `payload-types.ts` ne diffère que par ses commentaires.

## Portage vers le projet d’origine

La branche `feature/admin-structure` reprend `refactor/admin-structure` (sans
le redesign) et rend conditionnelles les protections propres au refactor,
au lieu de les supprimer.

| Comportement                           | Refactor (fichier `.refactor-isolation.json`) | Projet d’origine (sans ce fichier)                       |
| -------------------------------------- | --------------------------------------------- | -------------------------------------------------------- |
| Vérification de la base par l’app      | obligatoire (hôte du fichier)                 | seulement si `PAYLOAD_EXPECTED_DATABASE_HOST` est défini |
| Médias                                 | lecture seule                                 | modifiables, sauf si `PAYLOAD_MEDIA_READ_ONLY=true`      |
| Association automatique projet → média | désactivée                                    | active (sauf médias en lecture seule)                    |
| Cookie et titre de l’admin             | `payload-admin-refactor`, « Refactor isolé »  | valeurs par défaut, « De Nouveau »                       |
| Refus du point d’accès de production   | toujours                                      | non (la production pourra l’utiliser)                    |

Les scripts qui écrivent des données (`migrate-admin-globals`,
`copy-pages-to-globals`, `copy-agency-info`, `create-test-admin`) échouent
toujours tant que la base cible n’est pas nommée explicitement, par le fichier
de garde ou par `PAYLOAD_EXPECTED_DATABASE_HOST`. `PAYLOAD_DROP_DATABASE=true`
reste refusé partout. La synchronisation automatique du schéma reste désactivée
(`push: false`) ; la branche `fix/disable-db-push` l’applique aussi à `develop`.

Pour tester en local dans `de-nouveau`, sur la branche Neon `dev` :

1. Dans `de-nouveau/.env` : `DATABASE_URL` vers `dev`,
   `PAYLOAD_EXPECTED_DATABASE_HOST` avec le nom d’hôte de `dev`, et
   `PAYLOAD_MEDIA_READ_ONLY=true` (le stockage des médias est celui de la
   production).
2. `npm ci`, puis relevé en lecture seule avec `scripts/database-snapshot.mjs`.
3. `npm run refactor:migrate`, puis `npm run refactor:copy`, puis
   `node --import tsx scripts/copy-agency-info.ts`.
4. Nouveau relevé et comparaison, puis `npm run payload:generate` et
   `npm run dev`.

Le passage en production suit les mêmes étapes, après sauvegarde et accord
explicite, en retirant `PAYLOAD_MEDIA_READ_ONLY`.
