import { useEffect, useRef, useState } from 'react';
import { ROOM_THUMBNAILS, type RoomName } from '../../../config.ts';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import style from './RoomThumbnails.module.css';

const HIDE_DELAY_MS = 2500;
const REVEAL_ZONE_HEIGHT = 100;
const REVEAL_ZONE_WIDTH_RATIO = 0.5;

type RoomThumbnailsProps = {
  activeRoom: RoomName;
  onSelect: (room: RoomName) => void;
};

export default function RoomThumbnails({ activeRoom, onSelect }: RoomThumbnailsProps) {
  const { t } = useLanguage();
  const rooms = Object.entries(ROOM_THUMBNAILS) as [RoomName, string][];
  const [visible, setVisible] = useState(true);
  const hoveringRef = useRef(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleHide = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!hoveringRef.current) setVisible(false);
    }, HIDE_DELAY_MS);
  };

  useEffect(() => {
    if (!visible) return;
    scheduleHide();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [visible]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const nearTop = e.clientY < REVEAL_ZONE_HEIGHT;
      const centerMin = window.innerWidth * (0.5 - REVEAL_ZONE_WIDTH_RATIO / 2);
      const centerMax = window.innerWidth * (0.5 + REVEAL_ZONE_WIDTH_RATIO / 2);
      const nearCenter = e.clientX > centerMin && e.clientX < centerMax;
      if (nearTop && nearCenter) setVisible(true);
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const handlePointerEnter = () => {
    hoveringRef.current = true;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  const handlePointerLeave = () => {
    hoveringRef.current = false;
    scheduleHide();
  };

  return (
    <div
      className={visible ? style.container : `${style.container} ${style.hidden}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {rooms.map(([room, thumb]) => (
        <button
          key={room}
          type="button"
          className={room === activeRoom ? style.thumbActive : style.thumb}
          onClick={() => onSelect(room)}
        >
          <span className={style.thumbImage}>
            <img src={thumb} alt={room} />
          </span>
          <span className={style.label}>{t(`rooms.${room}`)}</span>
        </button>
      ))}
    </div>
  );
}
