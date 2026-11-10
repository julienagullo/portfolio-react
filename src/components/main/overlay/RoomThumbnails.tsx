import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ROOM_THUMBNAILS, type RoomName } from '../../../config/config.ts';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import style from './RoomThumbnails.module.css';

const HIDE_DELAY_MS = 2500;
const REVEAL_ZONE_HEIGHT = 100;
const REVEAL_ZONE_WIDTH_RATIO = 0.5;

type RoomThumbnailsProps = {
  activeRoom: RoomName;
  onSelect: (room: RoomName) => void;
  // undefined = desktop (hover souris) ; défini = mobile, piloté par le burger (Diorama).
  mobileOpen?: boolean;
};

export default function RoomThumbnails({ activeRoom, onSelect, mobileOpen }: RoomThumbnailsProps) {
  const { t } = useLanguage();
  const rooms = Object.entries(ROOM_THUMBNAILS) as [RoomName, string][];
  const isControlled = mobileOpen !== undefined;
  const [internalVisible, setInternalVisible] = useState(true);
  const visible = isControlled ? mobileOpen : internalVisible;
  const hoveringRef = useRef(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleHide = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!hoveringRef.current) setInternalVisible(false);
    }, HIDE_DELAY_MS);
  };

  useEffect(() => {
    if (isControlled || !internalVisible) return;
    scheduleHide();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isControlled, internalVisible]);

  useEffect(() => {
    if (isControlled) return;
    const handlePointerMove = (e: PointerEvent) => {
      const nearTop = e.clientY < REVEAL_ZONE_HEIGHT;
      const centerMin = window.innerWidth * (0.5 - REVEAL_ZONE_WIDTH_RATIO / 2);
      const centerMax = window.innerWidth * (0.5 + REVEAL_ZONE_WIDTH_RATIO / 2);
      const nearCenter = e.clientX > centerMin && e.clientX < centerMax;
      if (nearTop && nearCenter) setInternalVisible(true);
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [isControlled]);

  const handlePointerEnter = () => {
    hoveringRef.current = true;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  const handlePointerLeave = () => {
    hoveringRef.current = false;
    scheduleHide();
  };

  // Tactile : le navigateur rattache tout le geste à la miniature touchée en premier (capture
  // implicite), et un doigt qui bouge peut annuler le click. Comme pour les objets de la scène,
  // on retient la miniature sous le doigt au relâchement. Souris et clavier gardent le click.
  const containerRef = useRef<HTMLDivElement>(null);
  const skipClickRef = useRef(false);
  // Miniature sous le doigt pendant l'appui : remplace :hover, que le tactile n'applique qu'après le tap.
  const [touchedRoom, setTouchedRoom] = useState<RoomName | null>(null);

  const roomAt = (x: number, y: number): RoomName | null => {
    const button = document.elementFromPoint(x, y)?.closest('button');
    if (!button || !containerRef.current?.contains(button)) return null;
    return rooms.find(([name]) => name === button.name)?.[0] ?? null;
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    skipClickRef.current = false;
    if (e.pointerType !== 'mouse') setTouchedRoom(roomAt(e.clientX, e.clientY));
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') setTouchedRoom(roomAt(e.clientX, e.clientY));
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return;
    setTouchedRoom(null);
    // Le click éventuel qui suit viserait la miniature de départ : ignoré.
    skipClickRef.current = true;
    const room = roomAt(e.clientX, e.clientY);
    if (room) onSelect(room);
  };

  const handlePointerCancel = () => setTouchedRoom(null);

  const handleClick = (room: RoomName) => {
    if (skipClickRef.current) {
      skipClickRef.current = false;
      return;
    }
    onSelect(room);
  };

  return (
    <div
      className={[style.container, !visible && style.hidden, isControlled && style.controlled].filter(Boolean).join(' ')}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      ref={containerRef}
    >
      {rooms.map(([room, thumb]) => (
        <button
          key={room}
          name={room}
          type="button"
          className={[room === activeRoom ? style.thumbActive : style.thumb, room === touchedRoom && style.touched]
            .filter(Boolean)
            .join(' ')}
          onClick={() => handleClick(room)}
        >
          <span className={style.thumbImage}>
            <img src={thumb} alt={room} draggable={false} />
          </span>
          <span className={style.label}>{t(`rooms.${room}`)}</span>
        </button>
      ))}
    </div>
  );
}
