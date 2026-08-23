import { createContext } from 'react';

// Slot de pied de modal hors zone scrollable ; le contenu y projette son footer via createPortal.
export const ModalFooterContext = createContext<HTMLDivElement | null>(null);
