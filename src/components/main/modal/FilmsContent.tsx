import { FAVORITE_FILMS } from '../../../hobbies.ts';
import HobbyContent from './HobbyContent.tsx';

export default function FilmsContent() {
  return <HobbyContent items={FAVORITE_FILMS} />;
}
