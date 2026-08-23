import { createContext } from 'react';

// Conteneur scrollable du modal, exposé pour que le contenu remette le scroll en haut lui-même.
export const ModalContentContext = createContext<HTMLDivElement | null>(null);
