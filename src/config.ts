import office01 from './assets/texture/office_01.png';
import office02 from './assets/texture/office_02.png';
import office03 from './assets/texture/office_03.png';
import break01 from './assets/texture/break_01.png';
import break02 from './assets/texture/break_02.png';
import break03 from './assets/texture/break_03.png';
import meeting01 from './assets/texture/meeting_01.png';
import meeting02 from './assets/texture/meeting_02.png';
import meeting03 from './assets/texture/meeting_03.png';
import officeThumb from './assets/image/office_space.png';
import breakThumb from './assets/image/break_room.png';
import meetingThumb from './assets/image/meeting_room.png';

export const SCENE_WIDTH = 1920;
export const SCENE_HEIGHT = 1080;

export type Pointer = { x: number; y: number };

export type Language = 'fr' | 'en';
export const DEFAULT_LANGUAGE: Language = 'fr';

// Caméra orbitale (ArcRotateCamera) — valeurs de départ, à ajuster par test visuel
export const CAMERA_RADIUS = 10; // distance caméra-cible, verrouillée (pas de zoom)
export const CAMERA_FOV = 0.5; // radians, FOV serré
export const CAMERA_ALPHA_RANGE = 0.15; // amplitude max de rotation horizontale (radians)
export const CAMERA_BETA_RANGE = 0.05; // amplitude max de rotation verticale (radians)

// Largeur (unités monde) du plan le plus proche (z=0) — à ajuster par test visuel.
// Les plans plus profonds sont mis à l'échelle pour continuer à couvrir le champ de vision.
export const LAYER_BASE_WIDTH = 14;

export type RoomName = 'OfficeSpace' | 'BreakRoom' | 'MeetingRoom';

export type AssetDef = {
  name: string;
  url: string;
};

export const ASSET_MANIFEST: Record<RoomName, AssetDef[]> = {
  OfficeSpace: [
    { name: 'office_01', url: office01 },
    { name: 'office_02', url: office02 },
    { name: 'office_03', url: office03 }
  ],
  BreakRoom: [
    { name: 'break_01', url: break01 },
    { name: 'break_02', url: break02 },
    { name: 'break_03', url: break03 }
  ],
  MeetingRoom: [
    { name: 'meeting_01', url: meeting01 },
    { name: 'meeting_02', url: meeting02 },
    { name: 'meeting_03', url: meeting03 },
  ],
};

export const ROOM_THUMBNAILS: Partial<Record<RoomName, string>> = {
  OfficeSpace: officeThumb,
  BreakRoom: breakThumb,
  MeetingRoom: meetingThumb,
};