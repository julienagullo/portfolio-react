import type { ComponentType } from 'react';

import SkillsContent from './SkillsContent.tsx';

// Table de correspondance item cliqué → contenu de modal. Un seul <MainModal>
// générique (voir MainModal.tsx) est réutilisé pour tous les items ; seul le
// composant de contenu change. À compléter au fur et à mesure des modals
// (curriculum, films, jeux indé, romans...).
export const MODAL_CONTENT: Partial<Record<string, ComponentType>> = {
  office_books: SkillsContent,
};
