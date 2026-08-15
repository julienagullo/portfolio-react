import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Howl } from 'howler';

import {
  AMBIANCE_DUCK_FACTOR,
  AMBIANCE_VOLUME,
  CROSSFADE_MS,
  DUCK_FADE_MS,
  MUTE_FADE_MS,
  ROOM_AMBIANCE,
  SFX_VOLUME,
  type RoomName,
} from '../config.ts';

type AudioContextValue = {
  muted: boolean;
  toggleMute: () => void;
  playAmbiance: (room: RoomName) => void;
  playSfx: (src: string) => void;
  setAmbianceDucked: (ducked: boolean) => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true);

  const howlsRef = useRef<Partial<Record<RoomName, Howl>>>({});
  const currentRoomRef = useRef<RoomName | null>(null);
  const sfxCacheRef = useRef<Map<string, Howl>>(new Map());
  const duckedRef = useRef(false);

  const getHowl = useCallback((room: RoomName) => {
    let howl = howlsRef.current[room];
    if (!howl) {
      howl = new Howl({ src: [ROOM_AMBIANCE[room]], loop: true, volume: 0 });
      howlsRef.current[room] = howl;
    }
    return howl;
  }, []);

  // Volume "plein" de l'ambiance, réduit tant qu'un item est survolé (voir
  // setAmbianceDucked) pour laisser le SFX de clic ressortir sans le couvrir.
  const targetAmbianceVolume = useCallback(
    () => (duckedRef.current ? AMBIANCE_VOLUME * AMBIANCE_DUCK_FACTOR : AMBIANCE_VOLUME),
    [],
  );

  const playAmbiance = useCallback(
    (room: RoomName) => {
      const previousRoom = currentRoomRef.current;
      if (previousRoom === room) return;
      currentRoomRef.current = room;

      if (previousRoom) {
        const prev = howlsRef.current[previousRoom];
        if (prev?.playing()) {
          prev.fade(prev.volume(), 0, CROSSFADE_MS);
          setTimeout(() => prev.stop(), CROSSFADE_MS);
        }
      }

      if (muted) return;

      const next = getHowl(room);
      next.volume(0);
      next.play();
      next.fade(0, targetAmbianceVolume(), CROSSFADE_MS);
    },
    [muted, getHowl, targetAmbianceVolume],
  );

  // Sons courts au clic sur les items (voir config.ITEM_SFX) : un Howl par fichier,
  // mis en cache pour rejouer instantanément sans recréer l'instance à chaque clic.
  const playSfx = useCallback(
    (src: string) => {
      if (muted) return;
      let howl = sfxCacheRef.current.get(src);
      if (!howl) {
        howl = new Howl({ src: [src], volume: SFX_VOLUME });
        sfxCacheRef.current.set(src, howl);
      }
      howl.play();
    },
    [muted],
  );

  // Baisse l'ambiance pendant le survol d'un item plutôt que de jouer un SFX au
  // rollover : garde le son discret tout en donnant un feedback de présence.
  const setAmbianceDucked = useCallback(
    (ducked: boolean) => {
      if (duckedRef.current === ducked) return;
      duckedRef.current = ducked;

      const room = currentRoomRef.current;
      if (!room || muted) return;
      const howl = getHowl(room);
      if (howl.playing()) {
        howl.fade(howl.volume(), targetAmbianceVolume(), DUCK_FADE_MS);
      }
    },
    [muted, getHowl, targetAmbianceVolume],
  );

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      const room = currentRoomRef.current;
      if (room) {
        const howl = getHowl(room);
        if (next) {
          if (howl.playing()) {
            howl.fade(howl.volume(), 0, MUTE_FADE_MS);
            setTimeout(() => howl.stop(), MUTE_FADE_MS);
          }
        } else {
          howl.volume(0);
          howl.play();
          howl.fade(0, targetAmbianceVolume(), MUTE_FADE_MS);
        }
      }
      return next;
    });
  }, [getHowl, targetAmbianceVolume]);

  const value = useMemo<AudioContextValue>(
    () => ({ muted, toggleMute, playAmbiance, playSfx, setAmbianceDucked }),
    [muted, toggleMute, playAmbiance, playSfx, setAmbianceDucked],
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio() {
  const context = useContext(AudioCtx);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
