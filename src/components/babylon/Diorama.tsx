import { useCallback, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { Engine, Scene } from 'react-babylonjs';

import style from './Diorama.module.css';
import Camera from './Camera';
import Light from './Light';
import Manager, { type LoadedAssets } from '../main/Manager.tsx';
import Loading from '../main/Loading.tsx';
import OfficeSpace from './scene/OfficeSpace';
import BreakRoom from './scene/BreakRoom';
import MeetingRoom from './scene/MeetingRoom';
import RoomThumbnails from '../main/overlay/RoomThumbnails.tsx';
import TransitionOverlay from '../main/overlay/TransitionOverlay.tsx';

import { SCENE_HEIGHT, SCENE_WIDTH, type Language, type Pointer, type RoomName } from '../../config';

type DioramaProps = {
  language: Language;
};

export default function Diorama({ language }: DioramaProps) {
  const pointerRef = useRef<Pointer>({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);
  const [assets, setAssets] = useState<LoadedAssets | null>(null);
  const [activeRoom, setActiveRoom] = useState<RoomName>('OfficeSpace');
  const [transition, setTransition] = useState<'idle' | 'covering' | 'revealing'>('idle');
  const [pendingRoom, setPendingRoom] = useState<RoomName | null>(null);

  const handleProgress = useCallback((loaded: number, total: number) => {
    setProgress(total === 0 ? 0 : (loaded / total) * 100);
  }, []);

  const handleLoaded = useCallback((loadedAssets: LoadedAssets) => {
    setAssets(loadedAssets);
  }, []);

  const handleSelectRoom = (room: RoomName) => {
    if (room === activeRoom || transition !== 'idle') return;
    setPendingRoom(room);
    setTransition('covering');
  };

  const handleOverlayTransitionEnd = () => {
    if (transition === 'covering' && pendingRoom) {
      setActiveRoom(pendingRoom);
      setPendingRoom(null);
      setTransition('revealing');
    } else if (transition === 'revealing') {
      setTransition('idle');
    }
  };

  const updatePointer = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
    };
  };

  return (
    <div className={style.container} onPointerDown={updatePointer} onPointerMove={updatePointer}>
      <Engine
        antialias
        adaptToDeviceRatio
        canvasId="portfolio-canvas"
        width={SCENE_WIDTH}
        height={SCENE_HEIGHT}
        className={style.canvas}
      >
        <Scene>
          <Camera pointerRef={pointerRef} />
          <Light />
          <Manager onProgress={handleProgress} onLoaded={handleLoaded} />
          {assets && activeRoom === 'OfficeSpace' && <OfficeSpace assets={assets.OfficeSpace} />}
          {assets && activeRoom === 'BreakRoom' && <BreakRoom assets={assets.BreakRoom} />}
          {assets && activeRoom === 'MeetingRoom' && <MeetingRoom assets={assets.MeetingRoom} />}
        </Scene>
      </Engine>
      {!assets && <Loading progress={progress} language={language} />}
      {assets && <RoomThumbnails activeRoom={activeRoom} onSelect={handleSelectRoom} language={language} />}
      <TransitionOverlay visible={transition === 'covering'} onTransitionEnd={handleOverlayTransitionEnd} />
    </div>
  );
}