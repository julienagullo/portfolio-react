import { FAVORITE_FILMS } from '../../../config/hobbies.ts';
import HobbyContent from './HobbyContent.tsx';

export default function FilmsContent() {
  return <HobbyContent items={FAVORITE_FILMS} />;
}
