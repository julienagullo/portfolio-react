# Portfolio-react

Here is my portfolio made with React, TypeScript, Vite and Babylon.js (react-babylonjs): [Website](https://jagullo.fr/)

[![license](https://img.shields.io/github/license/julienagullo/cookieKit.svg)](https://github.com/julienagullo/portfolio-react/LICENSE.md)

A pixel-art diorama-style portfolio: a 3D scene (shadow box) with layered depth, browsed across 3 rooms (office, lounge, meeting room) with a slight camera rotation on mouse move. The meeting room includes a RAG-powered chat backed by an LLM.

## Table of contents

- [Quick start](#quick-start)
- [Tech stack](#tech-stack)
- [Contact](#contact)
- [Responsibility](#responsibility)
- [License](#license)

## Quick start

#### Download the release:

- Download [last release](https://github.com/julienagullo/portfolio-react/releases/)
- Or clone the repo: `git clone https://github.com/julienagullo/portfolio-react.git`


#### Project setup

```
npm install
```

#### Compiles for development

```
npm run dev
```

#### Compiles and minifies for production

```
npm run build
```

#### Compiles and minifies for production, inlining all chunks into a single bundle

```
npm run compile
```

#### Lints files

```
npm run lint
```

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **Babylon.js** via **react-babylonjs** for the 3D diorama scene
- **Howler.js** for ambient sound and SFX per room
- LLM chat with RAG on the meeting room, via a serverless backend (no direct client-side LLM calls)

More architecture details in [CLAUDE.md](./CLAUDE.md).


## Contact

- Mail: [contact@jagullo.fr](contact@jagullo.fr?subject=[GitHub]%20portfolio-react)
- Website: <https://jagullo.fr>
- Github: <https://github.com/julienagullo>


## Responsibility

Author disclaims any responsibility for the use that is made with this tool.

```text
Al-Nu’man ibn Bashir reported,
The Messenger of Allah (Peace and Blessings be upon Him) said: « Verily, the lawful is clear and the unlawful is clear, and between the two of them they are doubtful matters about which many people don't know. Thus, he who avoids doubtful matters clears himself in regard to his religion and his honor, and he who falls into doubtful matters will fall into the unlawful as the shepherd who pastures near a sanctuary, all but grazing there in. Verily, every king has a sanctum and the sanctum of Allah is his prohibitions. Verily, in the body is a piece of flesh which, if sound, the entire body is sound, and if corrupt, the entire body is corrupt. Truly, it is the heart. »
Sahih al-Bukhārī 52, Sahih Muslim 1599
```

```text
D'après Nu'man Ibn Bachir (qu'Allah l'agrée),
Le Messager d'Allah (que La Prière d'Allah et Son Salut soient sur Lui) a dit : « Certes le halal est clair et certes le haram est clair et il y a entre les deux des choses ambiguës que peu de gens connaissent. Celui qui s'écarte des choses ambiguës a préservé sa religion et son honneur. Quant à celui qui tombe dans les choses ambiguës il tombe dans le haram comme le berger qui fait paitre ses bêtes près d'un enclos réservé et qui sont sur le point de rentrer dedans. Certes chaque roi a un domaine réservé et certes le domaine réservé d'Allah est ses interdits. Certes il y a dans le corps un morceau de chair, si il est bon alors l'ensemble du corps est bon tandis que si il est mauvais alors c'est l'ensemble du corps qui est mauvais, certes il s'agit du coeur. »
Sahih al-Bukhārī 52, Sahih Muslim 1599
```


## License

Copyright © jagullo.fr

Licensed under the MIT license except for all images.
