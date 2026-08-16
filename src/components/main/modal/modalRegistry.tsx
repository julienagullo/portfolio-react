import type { ComponentType } from 'react';

import BooksContent from './BooksContent.tsx';
import ContactContent from './ContactContent.tsx';
import CurriculumContent from './CurriculumContent.tsx';
import FilmsContent from './FilmsContent.tsx';
import GamesContent from './GamesContent.tsx';
import SkillsContent from './SkillsContent.tsx';

export const MODAL_CONTENT: Partial<Record<string, ComponentType>> = {
  office_books: SkillsContent,
  office_computer: CurriculumContent,
  office_phone: ContactContent,
  break_dvd: FilmsContent,
  break_books: BooksContent,
  break_console: GamesContent,
};
