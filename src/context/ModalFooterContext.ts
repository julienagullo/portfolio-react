import { createContext } from 'react';

// Slot de pied de modal, hors de la zone scrollable (voir MainModal.tsx), pour
// une pagination/nav toujours visible. Le contenu (ex. CurriculumContent) n'a
// pas de référence directe à ce noeud DOM : il le récupère via ce contexte et
// y projette son footer avec createPortal.
export const ModalFooterContext = createContext<HTMLDivElement | null>(null);
