import { OPEN_SOURCE_PROJECTS } from '../../../config/hobbies.ts';
import HobbyContent from './HobbyContent.tsx';

export default function OpenSourceContent() {
  return <HobbyContent items={OPEN_SOURCE_PROJECTS} orientation="portrait" />;
}
