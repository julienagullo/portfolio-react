# Portfolio Interactif — Diorama Pixel Art (Babylon.js)

## Concept général

Portfolio en scène montée en Babylon.js, façon pur diorama (shadow box). Superposition de plusieurs calques texturés en profondeur (fond lointain → décor → objets interactifs → premier plan) dans une vraie scène 3D. La caméra est fixée sur un point central de la pièce et **pivote légèrement autour de ce centre** au mouvement de la souris (rotation, pas de translation).

L'utilisateur navigue entre **3 salles** via des miniatures cliquables en bas de l'écran, avec transition en fondu (fade) entre chaque salle.

---

## Stack technique — choix et justification

Ce portfolio est aussi un **démonstrateur de compétences** : le code source est public (repo GitHub accessible depuis le site). L'audience cible (tech lead, recruteur technique) va probablement ouvrir le repo pour évaluer la qualité du code, pas juste regarder le rendu final.

**Stack retenue : React + react-babylonjs** (plutôt que Babylon.js vanilla)

Pourquoi :
- Montre la capacité à intégrer un moteur de rendu impératif (Babylon.js) dans un paradigme déclaratif (React) — un vrai exercice d'architecture (cycle de vie, reconciliation, perf) que peu de devs front maîtrisent.
- Cohérent avec l'écosystème dominant en entreprise : la majorité des stacks front en poste utilisent React, donc le code est directement lisible/évaluable par la plupart des lecteurs techniques.
- Permet une gestion d'état unifiée entre la scène 3D et l'UI HTML (modals, miniatures, chat de la salle de réunion) via le state React, plutôt que de mélanger DOM manipulé à la main et scene graph Babylon séparément.

**react-babylonjs vs Reactylon** (les deux frameworks React pour Babylon.js) :
- **react-babylonjs** est retenu comme choix par défaut : plus mature, plus reconnaissable pour quelqu'un qui connaît déjà l'écosystème Babylon.js, syntaxe JSX qui mappe clairement sur l'API Babylon (`<scene>`, `<freeCamera>`, `<plane>`, etc.), pas de dépendance tierce en dehors de React + babylon.js.
- **Reactylon** reste une alternative valable si on veut appuyer sur la veille technique (lib plus récente, orientée multiplateforme web/mobile/XR, gestion automatique de la disposition des objets) — mais moins immédiatement identifiable pour un lecteur pressé, et ses capacités XR dépassent le besoin réel du MVP (même si la V2 VR viendra justement en tirer parti).
- Point de vigilance : vérifier la compatibilité de version React ciblée (react-babylonjs a une ligne 3.x maintenue pour React < 19, et les versions récentes pour React 19).

**TypeScript** conservé dans tous les cas, pour la rigueur de typage et l'auto-complétion sur les props Babylon.js.

---

## Structure des salles

### 1. Bureau (salle "pro")
Éléments interactifs → ouvrent un modal avec infos professionnelles :
- Livres → CV + projets
- PC portable → Compétences
- Téléphone → Informations de contact

### 2. Salle de détente (salle "perso")
Même schéma d'interaction, mais contenu plus personnel et ton plus léger :
- Lecteur DVD → Réalisateurs appréciés
- Romans → Auteurs appréciés
- Peluche Tux → Projets open source

### 3. Salle de réunion (salle "mixte")
Chat connecté à une API LLM avec RAG sur les projets et compétences.
- Salle de réunion → Bulle de dialogue façon mini-entretien
- Réponses en streaming (effet "en train d'écrire")
- Historique limité (4-6 derniers échanges) envoyé en contexte

---

## Architecture technique

### Frontend
- React + react-babylonjs (JSX déclaratif : `<Scene>`, `<arcRotateCamera>`, `<plane>`, etc.) + TypeScript
- Plans (`<plane>`) texturés en pixel art, sampling `NEAREST` pour rendu net, `noMipmap: true` pour éviter tout flou parasite en rotation
- Caméra **perspective** (`ArcRotateCamera`) avec FOV serré, ciblée sur le centre de la pièce — pas de caméra orthographique : c'est la perspective qui crée l'effet de profondeur en rotation
- Rotation caméra : gérée dans le composant `src/components/babylon/Camera.tsx` via `useBeforeRender` (react-babylonjs). La position souris normalisée est partagée par une ref (`pointerRef`), le composant en déduit un `alpha`/`beta` cible et lerp la caméra vers cette cible à chaque frame (`ORBIT_LERP`). `radius` verrouillé (`lowerRadiusLimit` = `upperRadiusLimit`, pas de zoom), inputs natifs de la caméra désactivés (`camera.inputs.clear()`), `alpha`/`beta` contraints à une plage très étroite (`CAMERA_ALPHA_RANGE`/`CAMERA_BETA_RANGE` dans `src/config/config.ts`)
- Chaque calque a une vraie position en profondeur (Z) dans la scène — c'est ce décalage réel combiné à la rotation caméra qui donne l'effet de profondeur (pas de facteur de déplacement artificiel par layer)
- Miniatures des 3 salles + modals en composants React (HTML/CSS) superposés au canvas (plus simple à styliser que du picking 3D pur)
- Overlay de transition en composant React (opacity animée via state) pour le fade entre salles
- Découpage en modules, l'architecture doit rester lisible pour quelqu'un qui audite le repo

### Calques & budget textures
- Répartition : **3 plans** de décor + les objets interactifs
- Textures sources en **UHD**, scène rendue/affichée en **HD** → marge confortable pour que les bords des plans ne soient jamais visibles pendant la rotation caméra
- Format **WebP** (qualité ~80-85) plutôt que PNG — gain net de poids à qualité équivalente
- **Budget de marge : ~1 Mo par plan** (volontairement large pour absorber la variabilité aplats/dégradés sans avoir à tester chaque asset au préalable)
- État réel : les 9 textures de décor pèsent **~1,7 Mo au total** (`src/assets/texture/`), très en dessous de la marge prévue
- Estimation initiale : 9 plans × 1 Mo ≈ 10 Mo de textures + police + son + objets interactifs → **budget cible 15-20 Mo** pour l'ensemble des assets, dans la limite haute de **25 Mo** pour le site complet (bundle JS Babylon.js/React inclus)

### Chargement
- **Tout est préchargé d'un coup** au démarrage (les 3 salles, tous les calques) — pas de chargement progressif salle par salle
- Écran de loading pendant ce préchargement

### Contrôles UI globaux
- **Bouton plein écran** (toggle fullscreen via Fullscreen API)
- **Bouton couper le son** (mute/unmute, état global, affecte effets sonores)
- **Bouton changement de langue** (FR / EN)

### Internationalisation (i18n)
- Démo technique orientée recruteurs/tech leads internationaux → **2 langues supportées : FR et EN**, avec un toggle visible dans les contrôles UI globaux
- Contenu concerné : textes de l'UI, contenu des salles, et prompt système + réponses du chat RAG de la salle de réunion
- Approche : dictionnaire de traductions par clé (JSON/TS par langue) avec fichier de traduction TS
- Langue par défaut détectée via `navigator.language`, override manuel possible via le toggle

### Contenu (bureau / détente)
- Contenu métier centralisé dans des configs TS typées (`src/config/curriculum.ts`, `skills.ts`, `contact.ts`, `hobbies.ts`) ; libellés d'UI dans `src/config/lang.ts`
- Un seul conteneur de modal générique (`src/components/main/modal/MainModal.tsx` : titre, fermeture, touche Échap) dont le contenu est choisi via un registre `MODAL_CONTENT` (`modalRegistry.tsx`) qui associe chaque élément cliquable (`office_books`, `hobbies_tux`…) à son composant de contenu (`SkillsContent`, `FilmsContent`…)
- Les listes de loisirs partagent le même rendu en frise chronologique (`HobbyContent.tsx`, orientation `portrait` ou `landscape`)

### Pages secondaires (SEO)
- Pas de react-router : un routeur maison très léger (`src/components/Router.tsx`) lit `window.location.pathname` et sert soit `<Portfolio>` (diorama, `/`), soit une page de `src/pages/` enveloppée dans `<Header>`/`<Footer>`. Aucune navigation client interceptée : les liens sont de simples `<a href>`, chaque changement de route recharge la page — plus simple, et la page secondaire ne charge jamais le bundle Babylon.js/RAG du diorama.
- L'URL de chaque page est dérivée automatiquement de son nom de composant, en kebab-case (`WebManager` → `/web-manager`) — ajouter une page = créer le composant dans `src/pages/` et l'ajouter au tableau `PAGES` du routeur, rien d'autre à configurer. Ce mapping s'appuie sur `Component.name` à l'exécution ; comme le build passe par **rolldown** (pas esbuild) sous Vite 8, la préservation des noms de fonctions à la minification se configure via `build.rollupOptions.output.minify.mangle.keepNames` dans `vite.config.ts` (l'équivalent esbuild `keepNames` ne s'applique pas ici).
- Le site étant rendu côté client, `.htaccess` route désormais tout ce qui ne correspond à aucun fichier/dossier réel vers `index.html` (`RewriteCond %{REQUEST_FILENAME} !-f`/`!-d`) pour que `/web-manager` fonctionne en accès direct ou au rechargement — sans casser `/blog/`, `/rag/`, `/assets/`, etc. qui restent servis normalement.

### Salle de réunion — RAG + LLM

**Génération des documents sources**
- `src/scripts/generate-rag-docs.mjs` (`npm run generate-rag`) génère `public/rag/portfolio-fr.md` et `public/rag/portfolio-en.md` à partir de la config typée (`src/config/curriculum.ts`, `src/config/hobbies.ts`) — source unique de vérité, pas de duplication manuelle entre les deux langues.
- Tous les libellés du markdown généré sont localisés par langue via un petit dictionnaire par fonction de rendu (`renderCurriculum`, `renderHobbies`), y compris les titres de sections/blocs (ex. `Parcours professionnel`/`Professional background`, `Projet`/`Project`, `Contexte`/`Context`, `chez`/`at`, `Lien`/`Link`) — pas seulement le contenu métier (`role`, `title`, `description`, `skills`, déjà stocké par langue dans la config). Point de vigilance corrigé : ces libellés de structure étaient auparavant codés en dur en français, ce qui laissait des titres hybrides FR/EN dans `portfolio-en.md` (ex. `### Projet — Cross-cutting ERP improvements`) ; relancer le script après toute modification de la config pour garder les deux fichiers `.md` synchronisés.
- **Champ `ragComment` (bilingue, optionnel)** : disponible sur `CvExperience`, `HobbyItem` et `BookAuthorEntry` (`src/config/curriculum.ts`, `src/config/hobbies.ts`) — volontairement pas sur `CvProject` (trop granulaire, on reste au niveau le plus général de chaque fichier). Permet d'ajouter du contexte destiné uniquement au RAG — jamais lu par les composants React (modals), jamais affiché dans l'UI. Le générateur (`pushRagComment` dans `generate-rag-docs.mjs`) l'injecte comme paragraphe supplémentaire juste après `description`, dans la langue correspondante. Bilingue comme le reste du contenu de ces fichiers (et pas texte libre en une seule langue) pour éviter de réintroduire des blocs français dans `portfolio-en.md` — exactement le défaut déjà corrigé pour les libellés de structure ci-dessus.
- **Modèle de chat : Ministral 8B** (`ministral-8b-2512`, API Mistral chat completions) — valeur par défaut de `DEFAULT_MISTRAL_MODEL` dans `public/api.php`, surchargeable via la variable `MISTRAL_API_MODEL` du `.env` (voir `.env.example`) sans toucher au code. Petit modèle rapide et peu coûteux, suffisant pour un chat RAG texte sur ce périmètre
- **Backend PHP** (`public/api.php` + classes sous `public/src/`, autoload maison) servi par le même hébergement Apache que le front — jamais d'appel LLM direct depuis le frontend (clé API exposée). En dev, Vite proxifie `/api.php` vers `http://localhost/portfolio` (`vite.config.ts`)
  - `Config/Env` : lecture du `.env` (`MISTRAL_API_KEY`, `MISTRAL_API_MODEL`)
  - `Http/*` : requête entrante (`ServerRequest`), client HTTP sortant (`Request`), réponse (`Response`)
  - `Rag/Retriever` : embedding de la question + sélection des chunks
  - `Cache/RateLimiter` : rate limiting par IP, fenêtre fixe de 4h, stockage JSON (`public/var/cache/rate-limit.json`) ; un `GET` sur `api.php` renvoie le quota restant sans le consommer (barre d'énergie du chat)
  - `Log/FileLogger` : logs dans `public/var/log/app.log`
- **Chunking** (`src/scripts/generate-rag-embeddings.mjs`) : un chunk par intro de section `##` et un par sous-section `###` (préfixé de son titre `##` parent) — découpage sémantique calé sur la structure du markdown généré, plutôt qu'une taille fixe en tokens
- **Embeddings** : modèle `mistral-embed`, vecteurs normalisés stockés en JSON (`public/rag/embeddings-fr.json`, `embeddings-en.json`) ; similarité cosinus = produit scalaire sur vecteurs normalisés, côté PHP
- À chaque question : embedding de la question → récupération des 4 chunks les plus proches (`Retriever::topChunks`, `k = 4`) → injection dans le prompt système, avec l'historique récent (longueurs bornées par `MAX_QUESTION_LENGTH` / `MAX_HISTORY_ANSWER_LENGTH`)
- Garde-fous : rate limiting côté backend, fallback si l'API échoue, recadrage poli si hors-sujet

---

## Son

**Périmètre** : ambiance sonore discrète par salle + SFX sur les interactions — pas juste des SFX ponctuels, le son participe à l'identité de chaque salle au même titre que le décor visuel.

### Choix technique
- **Howler.js** retenu plutôt que l'AudioEngine natif de Babylon.js : API plus simple à piloter depuis l'état React (bouton mute global, changement de salle), découplée du scene graph 3D. Le son n'a pas besoin d'être spatialisé dans ce diorama (caméra quasi fixe, pas de déplacement réel dans l'espace) donc aucun bénéfice à passer par Babylon Sound pour ça — inutile d'ajouter cette complexité.
- Gestion centralisée via un contexte custom (`useAudio` / `AudioProvider`, dans `src/context/AudioContext.tsx`) qui expose l'état mute global et des fonctions `playSfx` / `playAmbiance` / `stopAmbiance`, plutôt que des instances `Howl` éparpillées dans les composants.

### Ambiance par salle
- Une boucle d'ambiance discrète par salle, en **crossfade** au changement de salle (jamais de cut brutal)
- Bureau : ambiance neutre (clavier lointain, ventilation)
- Salle de détente : ambiance plus chaude (son de vague, domestique)
- Salle de réunion : ambiance plus légère (machine à café, léger brouhaha)
- Volume bas par défaut — fond sonore uniquement, jamais au premier plan par rapport aux SFX d'interaction

### SFX interactions
- Son court au clic sur chaque élément interactif — feedback cohérent avec l'ouverture du modal
- Son à l'ouverture / fermeture de modal
- Effet sonore léger de type "frappe" pendant le streaming du chat RAG (synchro avec l'effet "machine à écrire")

### Contrôle global & autoplay
- Le bouton "couper le son" déjà prévu dans les contrôles UI globaux coupe à la fois ambiance et SFX
- **Point de vigilance navigateur** : autoplay bloqué tant qu'il n'y a pas eu d'interaction utilisateur (policy Chrome/Safari) → le son ne démarre qu'après un premier geste explicite
- Mute par défaut au premier chargement, activation explicite par l'utilisateur — meilleure pratique UX et contourne proprement le blocage autoplay

### Format & budget
- Format **WAV** conservé : les `Howl` sont créés à la demande (au premier `play`) et le son est coupé par défaut, donc aucun fichier audio n'est téléchargé tant que l'utilisateur n'active pas le son
- Ambiances en boucles courtes (30-40s) plutôt que des fichiers longs, pour rester légères
- Budget dédié : **moins de 5 Mo** pour l'ensemble ambiances + SFX, à absorber dans l'enveloppe globale déjà prévue (15-20 Mo cible / 25 Mo max)

---

## Page de loading

- Nécessaire vu le poids des assets (textures pixel art multiples par salle + polices + son, voir section dédiée)
- Précharger toutes les textures des 3 salles au démarrage (pas de chargement à la volée au changement de salle)
- Barre de progression fine et stylisée qui s'affiche sur un fond de texture avec écrit "Chargement du bureau"
- Prévoir un fallback/timeout si un asset ne charge pas (message d'erreur dans la console)

---

## TODO

### Setup
- [x] Initialiser projet React + TypeScript + Vite
- [x] Installer et configurer react-babylonjs (vérifier compatibilité version React ciblée)
- [x] Définir la structure de dossiers (`components/`, `hooks/`, `assets/`, `config/`)
- [x] Mettre en place la page de loading avec préchargement de tous les assets (3 salles)
- [x] README clair (schéma d'architecture, choix techniques, comment lancer le projet) — important vu l'angle démonstrateur

### Diorama & rotation caméra
- [x] Créer 3 calques par salle avec positionnement en profondeur (Z)
- [x] Implémenter la rotation caméra dans `Camera.tsx` (ArcRotateCamera, rotation souris avec lerp, alpha/beta contraints, radius verrouillé)
- [x] Caméra perspective (FOV serré) + calibrage du cadrage
- [x] Export textures 2K → scène affichée en 1K, format WebP, `noMipmap: true`, sampling `NEAREST`

### Navigation entre salles
- [x] Composant `<RoomThumbnails>` (miniatures cliquables en bas d'écran) + état actif
- [x] Composant `<TransitionOverlay>` (fade) + swap de textures/salle via state

### Salle Bureau
- [x] Éléments interactifs + gestion du state "élément sélectionné"
- [x] Config TS du contenu pro (projets, compétences, contact)
- [x] Câblage avec le composant `<Modal>` générique

### Salle Détente
- [x] Éléments interactifs + gestion du state "élément sélectionné"
- [x] Config TS du contenu perso (films, auteurs, jeux)
- [x] Remplacer la section « Jeux indés » (console) par une section « Open source » (peluche Tux)
- [x] Câblage avec le composant `<Modal>` générique

### Salle Réunion (RAG + LLM)
- [x] Rédiger et structurer les documents sources (projets, commentaires, CV)
- [x] Chunking des documents
- [x] Génération et stockage des embeddings
- [x] Backend proxy (serverless function) pour appel LLM sécurisé
- [x] Recherche par similarité + injection du contexte dans le prompt système
- [x] UI bulle de chat + streaming des réponses
- [x] Rate limiting + fallback erreur + recadrage hors-sujet

### Son
- [x] Installer Howler.js + mettre en place le contexte `useAudio` (état mute global, `playSfx`/`playAmbiance`/`stopAmbiance`)
- [x] Sourcer/produire les 3 ambiances de salle (bureau, détente, réunion) en boucle courte + gestion du crossfade au changement de salle
- [x] SFX clic sur les éléments interactifs + ouverture/fermeture de modal
- [x] Déblocage audio si clic sur le bouton son + mute par défaut au chargement

### Finitions
- [x] Responsive / adaptation mobile (au moins un fallback correct si rotation caméra souris non pertinente au tactile)
- [x] Bouton plein écran (toggle Fullscreen API)
- [x] Bouton couper le son (mute/unmute global)
- [x] Support multilingue FR/EN (toggle UI, dictionnaire de traductions, contenu des salles, chat RAG)
- [x] Déploiement (hébergement frontend + backend)

### SEO
- [x] Landing page pour le référencement (`/web-manager` — router léger maison, voir `src/components/Router.tsx`)