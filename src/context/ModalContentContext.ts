import { createContext } from 'react';

// Conteneur scrollable du modal (voir MainModal.tsx), exposé au contenu pour
// qu'il puisse remettre le scroll en haut lui-même (ex. CurriculumContent au
// changement de slide) sans que MainModal ait à connaître cette logique.
export const ModalContentContext = createContext<HTMLDivElement | null>(null);
