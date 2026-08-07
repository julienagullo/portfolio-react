import office01 from './assets/texture/office_01.webp';
import office02 from './assets/texture/office_02.webp';
import office03 from './assets/texture/office_03.webp';
import officeBooks from './assets/image/office_books.webp';
import officeComputer from './assets/image/office_computer.webp';
import officePhone from './assets/image/office_phone.webp';
import break01 from './assets/texture/break_01.webp';
import break02 from './assets/texture/break_02.webp';
import break03 from './assets/texture/break_03.webp';
import breakBooks from './assets/image/break_books.webp';
import breakConsole from './assets/image/break_console.webp';
import breakDvd from './assets/image/break_dvd.webp';
import meeting01 from './assets/texture/meeting_01.webp';
import meeting02 from './assets/texture/meeting_02.webp';
import meeting03 from './assets/texture/meeting_03.webp';
import meetingRobot from './assets/image/meeting_robot.webp';
import officeThumb from './assets/image/office_space.webp';
import breakThumb from './assets/image/break_room.webp';
import meetingThumb from './assets/image/meeting_room.webp';

export const SCENE_WIDTH = 1920;
export const SCENE_HEIGHT = 1080;

export type Pointer = { x: number; y: number };

export type Language = 'fr' | 'en';
export const DEFAULT_LANGUAGE: Language = 'fr';

export const CAMERA_RADIUS = 10; // distance caméra-cible, verrouillée (pas de zoom)
export const CAMERA_FOV = 0.5; // radians, FOV serré
export const CAMERA_ALPHA_RANGE = 0.15; // amplitude max de rotation horizontale (radians)
export const CAMERA_BETA_RANGE = 0.05; // amplitude max de rotation verticale (radians)

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
    { name: 'office_03', url: office03 },
    { name: 'office_books', url: officeBooks },
    { name: 'office_computer', url: officeComputer },
    { name: 'office_phone', url: officePhone },
  ],
  BreakRoom: [
    { name: 'break_01', url: break01 },
    { name: 'break_02', url: break02 },
    { name: 'break_03', url: break03 },
    { name: 'break_dvd', url: breakDvd },
    { name: 'break_books', url: breakBooks },
    { name: 'break_console', url: breakConsole },
  ],
  MeetingRoom: [
    { name: 'meeting_01', url: meeting01 },
    { name: 'meeting_02', url: meeting02 },
    { name: 'meeting_03', url: meeting03 },
    { name: 'meeting_robot', url: meetingRobot },
  ],
};

export const ROOM_THUMBNAILS: Partial<Record<RoomName, string>> = {
  OfficeSpace: officeThumb,
  BreakRoom: breakThumb,
  MeetingRoom: meetingThumb,
};

export type ItemDef = { x: number; y: number; z: number; width: number };

export const OFFICE_ITEMS: Record<string, ItemDef> = {
  office_phone: { x: -2.45, y: -0.92, z: 4.85, width: 1.1 },
  office_books: { x: -1.5, y: -0.89, z: 4.85, width: 1 },
  office_computer: { x: 1.85, y: -0.85, z: 4.85, width: 1.4 },
};

export const BREAK_ITEMS: Record<string, ItemDef> = {
  break_dvd: { x: -1.65, y: -3.35, z: 4.85, width: 1.2 },
  break_books: { x: 2.45, y: -2.43, z: 4.85, width: 1 },
  break_console: { x: 0.15, y: -2.465, z: 4.85, width: 1 },
};

export const MEETING_ITEMS: Record<string, ItemDef> = {
  meeting_robot: { x: -0.025, y: -0.925, z: 4.85, width: 2 },
};