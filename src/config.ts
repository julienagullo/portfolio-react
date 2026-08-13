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
export type Language = 'fr' | 'en';
export const DEFAULT_LANGUAGE: Language = 'fr';

export type Pointer = { x: number; y: number };
export type ItemHover = { label: string; xPercent: number; yPercent: number };

export const CAMERA_RADIUS = 10;
export const CAMERA_FOV = 0.5;
export const CAMERA_ALPHA_RANGE = 0.15;
export const CAMERA_BETA_RANGE = 0.05;
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
    { name: 'office_phone', url: officePhone },
    { name: 'office_books', url: officeBooks },
    { name: 'office_computer', url: officeComputer },
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

export type ItemDef = { x: number; y: number; z: number; width: number; labelOffsetY?: number };
export type SpriteItemDef = ItemDef & { url: string; cellWidth: number; cellHeight: number; frameCount: number };

export const OFFICE_SPRITE_ITEMS: Record<string, SpriteItemDef> = {
  office_books: { x: -0.95, y: -0.72, z: 4.85, width: 1, url: officeBooks, cellWidth: 175, cellHeight: 200, labelOffsetY: 0.1, frameCount: 5 },
  office_phone: { x: -2.45, y: -0.92, z: 4.85, width: 1.1, url: officePhone, cellWidth: 170, cellHeight: 115, labelOffsetY: 0.3, frameCount: 5 },
  office_computer: { x: 1.8, y: -0.825, z: 4.85, width: 1.45, url: officeComputer, cellWidth: 225, cellHeight: 140, frameCount: 5 },
};

export const BREAK_ITEMS: Record<string, SpriteItemDef> = {
  break_dvd: { x: -2.3, y: -3.1, z: 4.85, width: 1.3, url: breakDvd, cellWidth: 275, cellHeight: 100, frameCount: 1 },
  break_books: { x: 2.1, y: -2.19, z: 4.85, width: 1.1, url: breakBooks, cellWidth: 180, cellHeight: 135, frameCount: 1 },
  break_console: { x: -0.5, y: -2.22, z: 4.85, width: 1.1, url: breakConsole, cellWidth: 165, cellHeight: 115, frameCount: 5 },
};

export const MEETING_ITEMS: Record<string, SpriteItemDef> = {
  meeting_robot: { x: -0.06, y: -1.09, z: 4.85, width: 1.5, url: meetingRobot, cellWidth: 240, cellHeight: 205, frameCount: 1, labelOffsetY: 0.35 },
};