import { useEffect, useRef } from 'react';
import { AssetsManager, Texture } from '@babylonjs/core';
import { useScene } from 'react-babylonjs';

import { ASSET_MANIFEST, UI_ASSETS, type RoomName } from '../../config/config.ts';

export type LoadedAssets = Record<RoomName, Record<string, Texture>>;

type ManagerProps = {
  onProgress: (loaded: number, total: number) => void;
  onLoaded: (assets: LoadedAssets) => void;
};

export default function Manager({ onProgress, onLoaded }: ManagerProps) {
  const scene = useScene();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!scene || startedRef.current) return;
    startedRef.current = true;

    const assetsManager = new AssetsManager(scene);
    assetsManager.useDefaultLoadingScreen = false;

    const loaded = {} as LoadedAssets;

    (Object.keys(ASSET_MANIFEST) as RoomName[]).forEach((room) => {
      loaded[room] = {};
      ASSET_MANIFEST[room].forEach((asset) => {
        const task = assetsManager.addTextureTask(
          asset.name,
          asset.url,
          true,
          true,
          Texture.NEAREST_SAMPLINGMODE,
        );
        task.onSuccess = (successfulTask) => {
          successfulTask.texture.hasAlpha = true;
          loaded[room][asset.name] = successfulTask.texture;
        };
      });
    });

    // UI hors scène 3D : chargée en HTMLImageElement, comptée dans la même progression.
    UI_ASSETS.forEach((asset) => {
      assetsManager.addImageTask(asset.name, asset.url);
    });

    assetsManager.onProgress = (remainingCount, totalCount) => {
      onProgress(totalCount - remainingCount, totalCount);
    };

    assetsManager.onFinish = () => {
      onLoaded(loaded);
    };

    assetsManager.load();
  }, [scene, onProgress, onLoaded]);

  return null;
}