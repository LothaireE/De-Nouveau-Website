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
`pages` reste disponible et sert de repli. Aucune suppression de l’ancienne
structure n’est préparée ; elle relève d’une intervention séparée à valider.
