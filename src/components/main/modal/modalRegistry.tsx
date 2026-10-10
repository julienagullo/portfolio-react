import type { ComponentType } from 'react';

import BooksContent from './BooksContent.tsx';
import ContactContent from './ContactContent.tsx';
import CurriculumContent from './CurriculumContent.tsx';
import FilmsContent from './FilmsContent.tsx';
import OpenSourceContent from './OpenSourceContent.tsx';
import SkillsContent from './SkillsContent.tsx';

export const MODAL_CONTENT: Partial<Record<string, ComponentType>> = {
  office_books: SkillsContent,
  office_computer: CurriculumContent,
  office_phone: ContactContent,
  hobbies_dvd: FilmsContent,
  hobbies_books: BooksContent,
  hobbies_tux: OpenSourceContent,
};
