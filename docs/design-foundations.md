# Fondations du design

Branche `redesign/foundations`, créée depuis `redesign/site`. L’identité existante
(palette, logo, mises en page) est conservée ; seules les bases sont unifiées.

## Police

Le site utilise Roboto, la police de la signature « Architecture et design »
du logo (identifiée par comparaison des tracés, le texte du logo étant
vectorisé). Elle est chargée en police variable par `next/font` dans
`src/app/(site)/layout.tsx` et servie par le site. Auparavant, Geist était
chargée mais une règle `font-family: Arial` sur `body` l’écrasait ; Geist et
Geist Mono ne sont plus chargées.

## Échelle typographique

Six tailles, définies dans `src/app/globals.css` (`@theme`). Chacune porte son
interlignage et son espacement des lettres ; les pages n’en utilisent pas d’autres.

| Classe         | Taille     | Usage                                 |
| -------------- | ---------- | ------------------------------------- |
| `text-label`   | 12 px      | étiquettes, métadonnées, légendes     |
| `text-small`   | 14 px      | texte secondaire, menus, informations |
| `text-body`    | 16 px      | texte courant (taille par défaut)     |
| `text-lead`    | 20 → 28 px | textes mis en avant, titres de cartes |
| `text-heading` | 24 → 44 px | titres de page, coordonnées, menus    |
| `text-display` | 48 → 72 px | titres de projet                      |

Les tailles fluides s’adaptent à la largeur d’écran avec `clamp()`.

## Couleurs

La palette n’est définie qu’à un endroit : `src/app/globals.css`.
`tailwind.config.ts`, ignoré par Tailwind 4 et qui la dupliquait, est retiré.
Le texte courant est noir studio (`--foreground`) sur toutes les pages ; le vert
mousse des descriptions de projet est remplacé. Les liens secondaires des menus
utilisent le noir à 60 %. Les couleurs d’accent (rouge des métadonnées, argile
des cartes) sont inchangées.
