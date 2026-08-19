import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { Color4 } from '@babylonjs/core';
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
import BurgerButton from '../main/overlay/BurgerButton.tsx';
import TransitionOverlay from '../main/overlay/TransitionOverlay.tsx';
import ItemTooltip from '../main/overlay/ItemTooltip.tsx';
import MainModal from '../main/modal/MainModal.tsx';
import { MODAL_CONTENT } from '../main/modal/modalRegistry.tsx';

import { BREAK_POINT, ITEM_SFX, SCENE_HEIGHT, SCENE_WIDTH, type ItemHover, type Pointer, type RoomName } from '../../config';
import { useAudio } from '../../context/AudioContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useBreakpoint } from '../../hooks/useBreakpoint.ts';
import type { TranslationKey } from '../../lang.ts';

export default function Diorama() {
  const { language, t } = useLanguage();
  const { playAmbiance, playSfx, setAmbianceDucked } = useAudio();
  const isMobile = useBreakpoint(BREAK_POINT);
  const pointerRef = useRef<Pointer>({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);
  const [assets, setAssets] = useState<LoadedAssets | null>(null);
  const [activeRoom, setActiveRoom] = useState<RoomName>('OfficeSpace');
  const [transition, setTransition] = useState<'idle' | 'covering' | 'revealing'>('idle');
  const [pendingRoom, setPendingRoom] = useState<RoomName | null>(null);
  const [hover, setHover] = useState<ItemHover | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [itemHovered, setItemHovered] = useState(false);
  // Menu des salles replié par défaut sur mobile : ouvert via le burger (voir
  // RoomThumbnails.mobileOpen), pas de révélation au survol souris au tactile.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    playAmbiance(activeRoom);
  }, [activeRoom, playAmbiance]);

  const handleHover = useCallback((h: ItemHover | null) => setHover(h), []);

  const handleItemClick = useCallback(
    (name: string) => {
      const src = ITEM_SFX[name];
      if (src) playSfx(src);
      if (name in MODAL_CONTENT) setActiveItem(name);
    },
    [playSfx],
  );

  const handleCloseModal = useCallback(() => setActiveItem(null), []);

  const ActiveModalContent = activeItem ? MODAL_CONTENT[activeItem] : undefined;

  // Tant qu'une modal est ouverte, aucun item ne doit rester visuellement
  // "survolé" — nécessaire notamment sur tactile où le tap qui ouvre la modal
  // ne génère jamais de pointerout naturel (voir SpriteItemMesh.forceUnhover).
  const suppressHover = activeItem !== null;

  // Baisse l'ambiance pendant le survol d'un item plutôt que de jouer un SFX au
  // rollover (voir AudioContext.setAmbianceDucked).
  const handleItemHoverChange = useCallback((hovering: boolean) => setItemHovered(hovering), []);

  // Ducking piloté par deux sources indépendantes (survol ET modal ouverte),
  // plutôt que par le seul hover Babylon : sur tactile le "survol" reste
  // volontairement coupé dès l'ouverture de la modal (voir suppressHover
  // ci-dessus), mais on veut quand même garder l'ambiance baissée tant que la
  // modal reste ouverte.
  useEffect(() => {
    setAmbianceDucked(itemHovered || activeItem !== null);
  }, [itemHovered, activeItem, setAmbianceDucked]);

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
    setHover(null);
    setActiveItem(null);
    setItemHovered(false);
    setMobileMenuOpen(false);
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
        <Scene clearColor={new Color4(0.1, 0.1, 0.1, 1)}>
          <Camera pointerRef={pointerRef} />
          <Light />
          <Manager onProgress={handleProgress} onLoaded={handleLoaded} />
          {assets && activeRoom === 'OfficeSpace' && (
            <OfficeSpace
              assets={assets.OfficeSpace}
              language={language}
              onHover={handleHover}
              onItemClick={handleItemClick}
              onItemHoverChange={handleItemHoverChange}
              suppressHover={suppressHover}
            />
          )}
          {assets && activeRoom === 'BreakRoom' && (
            <BreakRoom
              assets={assets.BreakRoom}
              language={language}
              onHover={handleHover}
              onItemClick={handleItemClick}
              onItemHoverChange={handleItemHoverChange}
              suppressHover={suppressHover}
            />
          )}
          {assets && activeRoom === 'MeetingRoom' && (
            <MeetingRoom
              assets={assets.MeetingRoom}
              language={language}
              onHover={handleHover}
              onItemClick={handleItemClick}
              onItemHoverChange={handleItemHoverChange}
              suppressHover={suppressHover}
            />
          )}
        </Scene>
      </Engine>
      {!assets && <Loading progress={progress} />}
      {assets && isMobile && <BurgerButton onClick={() => setMobileMenuOpen((prev) => !prev)} />}
      {assets && (
        <RoomThumbnails
          activeRoom={activeRoom}
          onSelect={handleSelectRoom}
          mobileOpen={isMobile ? mobileMenuOpen : undefined}
        />
      )}
      <TransitionOverlay visible={transition === 'covering'} onTransitionEnd={handleOverlayTransitionEnd} />
      <ItemTooltip hover={hover} />
      {activeItem && ActiveModalContent && (
        <MainModal title={t(`items.${activeItem}` as TranslationKey)} onClose={handleCloseModal}>
          <ActiveModalContent />
        </MainModal>
      )}
    </div>
  );
}