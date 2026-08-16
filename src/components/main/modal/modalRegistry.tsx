import type { ComponentType } from 'react';

import ContactContent from './ContactContent.tsx';
import CurriculumContent from './CurriculumContent.tsx';
import SkillsContent from './SkillsContent.tsx';

export const MODAL_CONTENT: Partial<Record<string, ComponentType>> = {
  office_books: SkillsContent,
  office_computer: CurriculumContent,
  office_phone: ContactContent,
};
