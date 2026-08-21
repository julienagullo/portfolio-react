import { FAVORITE_GAMES } from '../../../config/hobbies.ts';
import HobbyContent from './HobbyContent.tsx';

export default function GamesContent() {
  return <HobbyContent items={FAVORITE_GAMES} orientation="landscape" />;
}
