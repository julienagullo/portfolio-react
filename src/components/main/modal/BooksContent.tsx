import { FAVORITE_AUTHORS } from '../../../hobbies.ts';
import AuthorsContent from './AuthorsContent.tsx';

export default function BooksContent() {
  return <AuthorsContent authors={FAVORITE_AUTHORS} />;
}
