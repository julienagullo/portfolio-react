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
- Consoles → Studios appréciés

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
- Rotation caméra : gérée via un hook custom (`useCameraOrbit`) qui écoute le pointer move, calcule un delta `alpha`/`beta` cible à partir de la position souris normalisée, et lerp la caméra vers cette cible à chaque frame. `radius` verrouillé (pas de zoom), `alpha`/`beta` contraints à une plage très étroite
- Chaque calque a une vraie position en profondeur (Z) dans la scène — c'est ce décalage réel combiné à la rotation caméra qui donne l'effet de profondeur (pas de facteur de déplacement artificiel par layer)
- Miniatures des 3 salles + modals en composants React (HTML/CSS) superposés au canvas (plus simple à styliser que du picking 3D pur)
- Overlay de transition en composant React (opacity animée via state) pour le fade entre salles
- Découpage en modules, l'architecture doit rester lisible pour quelqu'un qui audite le repo

### Calques & budget textures
- Répartition : **3 plans** de décor + les objets interactifs
- Textures sources en **UHD**, scène rendue/affichée en **HD** → marge confortable pour que les bords des plans ne soient jamais visibles pendant la rotation caméra
- Format **WebP** (qualité ~80-85) plutôt que PNG — gain net de poids à qualité équivalente
- **Budget de marge : ~1 Mo par plan** (volontairement large pour absorber la variabilité aplats/dégradés sans avoir à tester chaque asset au préalable)
- Estimation totale : 9 plans × 1 Mo ≈ 10 Mo de textures + police + son + objets interactifs → **budget cible 15-20 Mo** pour l'ensemble des assets, dans la limite haute de **25 Mo** pour le site complet (bundle JS Babylon.js/React inclus)

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
- Config centralisée avec fichier de configuration TS → objet cliqué → `{ title, items }`
- Un seul composant `<Modal>` générique réutilisé partout, alimenté par la config selon la salle + l'élément cliqué

### Salle de réunion — RAG + LLM
- **Backend obligatoire** (serverless function / Cloudflare Worker) : jamais d'appel LLM direct depuis le frontend (clé API exposée)
- Documents sources (projets, commentaires, CV) découpés en chunks (~300-500 tokens)
- Embeddings des chunks stockés en local (JSON + cosine similarity, ou SQLite + extension vecteur)
- À chaque question : embedding de la question → récupération des 3-5 chunks les plus proches → injection dans le prompt système
- Garde-fous : rate limiting côté backend, fallback si l'API échoue, recadrage poli si hors-sujet

---

## Son

**Périmètre** : ambiance sonore discrète par salle + SFX sur les interactions — pas juste des SFX ponctuels, le son participe à l'identité de chaque salle au même titre que le décor visuel.

### Choix technique
- **Howler.js** retenu plutôt que l'AudioEngine natif de Babylon.js : API plus simple à piloter depuis l'état React (bouton mute global, changement de salle), découplée du scene graph 3D. Le son n'a pas besoin d'être spatialisé dans ce diorama (caméra quasi fixe, pas de déplacement réel dans l'espace) donc aucun bénéfice à passer par Babylon Sound pour ça — inutile d'ajouter cette complexité.
- Gestion centralisée via un hook/contexte custom (`useAudio` / `AudioProvider`) qui expose l'état mute global et des fonctions `playSfx` / `playAmbiance` / `stopAmbiance`, plutôt que des instances `Howl` éparpillées dans les composants.

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
- Format **MP3** (fallback **OGG** si besoin de compat navigateur élargie) — compressé, léger, largement supporté
- Ambiances en boucles courtes (30-40s) plutôt que des fichiers longs, pour rester légères
- Budget dédié : **~500 Ko à 1 Mo** pour l'ensemble ambiances + SFX, à absorber dans l'enveloppe globale déjà prévue (15-20 Mo cible / 25 Mo max)

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
- [x] Implémenter `useCameraOrbit` (ArcRotateCamera, rotation souris avec lerp, alpha/beta contraints, radius verrouillé)
- [x] Caméra perspective (FOV serré) + calibrage du cadrage
- [x] Export textures 2K → scène affichée en 1K, format WebP, `noMipmap: true`, sampling `NEAREST`

### Navigation entre salles
- [x] Composant `<RoomThumbnails>` (miniatures cliquables en bas d'écran) + état actif
- [x] Composant `<TransitionOverlay>` (fade) + swap de textures/salle via state

### Salle Bureau
- [ ] Éléments interactifs + gestion du state "élément sélectionné"
- [ ] Config TS du contenu pro (projets, compétences, contact)
- [ ] Câblage avec le composant `<Modal>` générique
- [ ] Style de modal pro (agenda pro)

### Salle Détente
- [ ] Éléments interactifs + gestion du state "élément sélectionné"
- [ ] Config TS du contenu perso (réalisateurs, auteurs, intérêts)
- [ ] Câblage avec le composant `<Modal>` générique
- [ ] Style de modal loisirs (agenda perso)

### Salle Réunion (RAG + LLM)
- [ ] Rédiger et structurer les documents sources (projets, commentaires, CV)
- [ ] Chunking des documents
- [ ] Génération et stockage des embeddings
- [ ] Backend proxy (serverless function) pour appel LLM sécurisé
- [ ] Recherche par similarité + injection du contexte dans le prompt système
- [ ] UI bulle de chat + streaming des réponses
- [ ] Historique de conversation limité
- [ ] Rate limiting + fallback erreur + recadrage hors-sujet

### Son
- [ ] Installer Howler.js + mettre en place le hook/contexte `useAudio` (état mute global, `playSfx`/`playAmbiance`/`stopAmbiance`)
- [ ] Sourcer/produire les 3 ambiances de salle (bureau, détente, réunion) en boucle courte + gestion du crossfade au changement de salle
- [ ] SFX clic sur les éléments interactifs + ouverture/fermeture de modal
- [ ] Déblocage audio au premier geste utilisateur (contournement autoplay) + mute par défaut au chargement
- [ ] (optionnel) SFX de frappe pendant le streaming du chat RAG

### Finitions
- [x] Responsive / adaptation mobile (au moins un fallback correct si rotation caméra souris non pertinente au tactile)
- [x] Bouton plein écran (toggle Fullscreen API)
- [x] Bouton couper le son (mute/unmute global)
- [ ] Support multilingue FR/EN (toggle UI, dictionnaire de traductions, contenu des salles, chat RAG)
- [ ] Déploiement (hébergement frontend + backend)