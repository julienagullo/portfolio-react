# Portfolio Interactif — Diorama Pixel Art (Babylon.js)

## Concept général

Portfolio en scène montée en Babylon.js, façon pur diorama (shadow box). Superposition de plusieurs calques texturés en profondeur (fond lointain → arrière-plan → mobilier → objets interactifs → premier plan) dans une vraie scène 3D. La caméra est fixée sur un point central de la pièce et **pivote très légèrement autour de ce centre** au mouvement de la souris (rotation, pas de translation) pour un effet de profondeur beaucoup plus marqué qu'un simple parallax 2D.

L'utilisateur navigue entre **3 salles** via des miniatures cliquables en bas de l'écran, avec transition en fondu (fade) entre chaque salle. Une horloge visible dans le décor tourne en continu (24h simulées en 5 minutes réelles) et reste **synchronisée entre les salles** — l'heure ne se reset pas au changement de salle, pour renforcer l'illusion d'un lieu vivant.

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
Éléments clicables → ouvrent un modal avec infos professionnelles :
- Ordinateur / écran → Projets
- Pile de livres → Compétences / stack technique
- Cadre photo → À propos / bio
- Téléphone / enveloppe → Contact
- Lampe → toggle ambiance jour/nuit (peut être lié à l'heure de l'horloge)

### 2. Salle de détente (salle "perso")
Même schéma d'interaction, mais contenu plus personnel et ton plus léger :
- Télé / console → Jeux du moment (statut, avancement)
- Étagère → Lectures en cours / récentes
- Poster → Films préférés
- Enceinte / vinyle → Musique du moment
- Modals avec covers en mini-grille, notes/étoiles, statuts ("en cours", "terminé", "coup de cœur")

### 3. Salle de réunion (salle "chat / entretien")
Partie la plus complexe : chat connecté à une API LLM + RAG sur les projets et retours reçus.
- Bulle de dialogue façon mini-entretien
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
- Découpage en modules clairs : `components/Scene/`, `components/Rooms/`, `components/Modal/`, `hooks/useClock.ts`, `hooks/useCameraOrbit.ts`, etc. — l'architecture doit rester lisible pour quelqu'un qui audite le repo

### Horloge
- Ratio d'accélération : 288x (24h simulées / 5 min réelles)
- Géré via un hook custom (`useClock`) branché sur `scene.onBeforeRenderObservable`, avec le state remonté au niveau du composant racine pour rester **synchronisé entre les salles** (pas de reset au changement de salle)
- Possibilité de lier l'ambiance lumineuse (lampe, ciel) à la plage horaire simulée

### Calques & budget textures
- Répartition : **5 plans** pour le Bureau, **5 plans** pour la salle de Détente, **3 plans** pour la salle de Réunion (décor plus sobre, volontairement, pour ne pas distraire du chat) + les objets interactifs (petits, poids négligeable)
- Textures sources en **4K**, scène rendue/affichée en **2K** → marge confortable pour que les bords des plans ne soient jamais visibles pendant la rotation caméra, même en cas de léger overshoot du lerp souris
- Format **WebP** (qualité ~80-85) plutôt que PNG — gain net de poids à qualité équivalente
- **Budget de marge : ~1 Mo par plan** (volontairement large pour absorber la variabilité aplats/dégradés sans avoir à tester chaque asset au préalable)
- Estimation totale : 13 plans × 1 Mo ≈ 13 Mo de textures + police + son + objets interactifs → **budget cible 20-25 Mo** pour l'ensemble des assets, dans la limite haute de **30 Mo** pour le site complet (bundle JS Babylon.js/React inclus)
- Standard de référence : connexion 4G (pas le meilleur cas de labo)

### Chargement
- **Tout est préchargé d'un coup** au démarrage (les 3 salles, tous les calques) — pas de chargement progressif salle par salle, pour rester simple et garantir zéro flash au changement de salle
- Écran de loading pendant ce préchargement (voir section dédiée plus bas)

### Contrôles UI globaux
- **Bouton plein écran** (toggle fullscreen via Fullscreen API)
- **Bouton couper le son** (mute/unmute, état global, affecte musique d'ambiance + éventuels effets sonores)
- **Bouton changement de langue** (FR / EN, voir section Internationalisation)

### Internationalisation (i18n)
- Démo technique orientée recruteurs/tech leads internationaux → **2 langues supportées : FR et EN**, avec un toggle visible dans les contrôles UI globaux
- Contenu concerné : textes de l'UI (modals, boutons, page de loading), contenu des salles (`roomContent`), et prompt système + réponses du chat RAG de la salle de réunion
- Approche : dictionnaire de traductions par clé (JSON/TS par langue), pas besoin d'une lib i18n lourde vu le volume de texte limité
- Langue par défaut détectée via `navigator.language`, override manuel possible via le toggle (état persistant, ex: `localStorage`)

### Contenu (bureau / détente)
- Config centralisée en JSON/objet TS (`roomContent`) par salle → objet cliqué → `{ title, items }`
- Un seul composant `<Modal>` générique réutilisé partout, alimenté par la config selon la salle + l'élément cliqué

### Salle de réunion — RAG + LLM
- **Backend obligatoire** (serverless function / Cloudflare Worker) : jamais d'appel LLM direct depuis le frontend (clé API exposée sinon)
- Documents sources (projets, commentaires, CV) découpés en chunks (~300-500 tokens)
- Embeddings des chunks stockés en local (JSON + cosine similarity, ou SQLite + extension vecteur) — pas besoin d'une vraie base vectorielle pour ce volume
- À chaque question : embedding de la question → récupération des 3-5 chunks les plus proches → injection dans le prompt système
- Garde-fous : rate limiting côté backend, fallback si l'API échoue, recadrage poli si hors-sujet

---

## Page de loading

- Nécessaire vu le poids des assets (textures pixel art multiples par salle + polices + éventuel son)
- Précharger toutes les textures des 3 salles au démarrage (pas de chargement à la volée au changement de salle → évite tout flash/latence pendant les transitions)
- Barre de progression ou animation pixel art cohérente avec l'univers du site (ex: petit personnage qui marche, horloge qui se monte, etc.)
- Écran de loading en HTML/CSS par-dessus le canvas, masqué une fois `scene.executeWhenReady` (ou équivalent AssetsManager) déclenché
- Prévoir un fallback/timeout si un asset ne charge pas (message d'erreur discret plutôt que blocage infini)

---

## TODO

### Setup
- [ ] Initialiser projet React + TypeScript + Vite
- [ ] Installer et configurer react-babylonjs (vérifier compatibilité version React ciblée)
- [ ] Définir la structure de dossiers (`components/`, `hooks/`, `assets/`, `config/`)
- [ ] Mettre en place la page de loading avec préchargement de tous les assets (3 salles)
- [ ] README clair (schéma d'architecture, choix techniques, comment lancer le projet) — important vu l'angle démonstrateur

### Diorama & rotation caméra
- [ ] Créer les calques par salle (5 Bureau, 5 Détente, 3 Réunion) avec positionnement en profondeur (Z)
- [ ] Implémenter `useCameraOrbit` (ArcRotateCamera, rotation souris avec lerp, alpha/beta contraints, radius verrouillé)
- [ ] Caméra perspective (FOV serré) + calibrage du cadrage
- [ ] Export textures 4K → scène affichée en 2K, format WebP, `noMipmap: true`, sampling `NEAREST`

### Horloge
- [ ] Implémenter la logique de temps simulé (288x) persistante entre les salles
- [ ] Aiguilles heures/minutes animées
- [ ] Lier l'ambiance lumineuse (lampe, ciel) à l'heure simulée

### Navigation entre salles
- [ ] Composant `<RoomThumbnails>` (miniatures cliquables en bas d'écran) + état actif
- [ ] Composant `<TransitionOverlay>` (fade) + swap de textures/salle via state
- [ ] (Optionnel) variante slide/glissement en plus du fade

### Salle Bureau
- [ ] Éléments clicables (via props `onPick` sur les meshes react-babylonjs) + gestion du state "élément sélectionné"
- [ ] Config TS du contenu (projets, compétences, à propos, contact)
- [ ] Câblage avec le composant `<Modal>` générique

### Salle Détente
- [ ] Éléments clicables (jeux, lectures, films, musique)
- [ ] Config TS du contenu perso
- [ ] Style de modal différencié (covers, notes, statuts)

### Salle Réunion (RAG + LLM)
- [ ] Rédiger et structurer les documents sources (projets, commentaires, CV)
- [ ] Chunking des documents
- [ ] Génération et stockage des embeddings
- [ ] Backend proxy (serverless function) pour appel LLM sécurisé
- [ ] Recherche par similarité + injection du contexte dans le prompt système
- [ ] UI bulle de chat + streaming des réponses
- [ ] Historique de conversation limité
- [ ] Rate limiting + fallback erreur + recadrage hors-sujet

### Finitions
- [ ] Responsive / adaptation mobile (au moins un fallback correct si rotation caméra souris non pertinente au tactile)
- [ ] Bouton plein écran (toggle Fullscreen API)
- [ ] Bouton couper le son (mute/unmute global)
- [ ] Support multilingue FR/EN (toggle UI, dictionnaire de traductions, contenu des salles, chat RAG)
- [ ] Tests de perf (poids des textures, nombre d'assets, respect du budget 20-25 Mo)
- [ ] Déploiement (hébergement frontend + backend)

---

## V2 — Passe d'optimisation VR

- [ ] Bouton "Activer VR" (visible uniquement si WebXR disponible sur l'appareil)
- [ ] Détection du contexte XR dans `useCameraOrbit` : désactiver le pilotage souris et laisser le tracking natif WebXR piloter la caméra en VR
- [ ] Revoir les contraintes `alpha`/`beta` en VR : la plage serrée pensée pour desktop peut créer une gêne (dissonance vestibulaire) si la tête cogne contre une limite artificielle
- [ ] Profilage perf pour cible 90 Hz stable en stéréo (draw calls, résolution des textures en mémoire GPU) — le facteur limitant en VR est le coût de rendu par frame, pas le poids des assets
- [ ] Tests réels au casque