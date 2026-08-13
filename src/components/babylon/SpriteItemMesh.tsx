import {
  ActionManager,
  Color3,
  ExecuteCodeAction,
  Matrix,
  Texture,
  Vector3,
  type Mesh,
} from '@babylonjs/core';
import { useEffect, useMemo, useRef } from 'react';
import { useBeforeRender } from 'react-babylonjs';

import type { ItemHover } from '../../config';

type SpriteItemMeshProps = {
  name: string;
  label: string;
  texture: Texture;
  cellWidth: number;
  cellHeight: number;
  frameCount: number;
  x: number;
  y: number;
  z: number;
  width: number;
  frameDelay?: number;
  labelOffsetY?: number;
  onHover: (hover: ItemHover | null) => void;
};

export default function SpriteItemMesh({
  name,
  label,
  texture,
  cellWidth,
  cellHeight,
  frameCount,
  x,
  y,
  z,
  width,
  frameDelay = 60,
  labelOffsetY = 0.25,
  onHover,
}: SpriteItemMeshProps) {
  const hoveredRef = useRef(false);
  const labelRef = useRef(label);
  useEffect(() => {
    labelRef.current = label;
  }, [label]);

  const height = width * (cellHeight / cellWidth);
  const lastIndex = frameCount - 1;

  const itemTexture = useMemo(() => {
    const clone = texture.clone();
    clone.hasAlpha = true;
    clone.wrapU = Texture.CLAMP_ADDRESSMODE;
    clone.wrapV = Texture.CLAMP_ADDRESSMODE;
    return clone;
  }, [texture]);

  const layout = useMemo(() => {
    const { width: texWidth, height: texHeight } = itemTexture.getSize();
    const columns = Math.max(1, Math.floor(texWidth / cellWidth));
    return { columns, uScale: cellWidth / texWidth, vScale: cellHeight / texHeight };
  }, [itemTexture, cellWidth, cellHeight]);

  const applyFrame = (index: number) => {
    const { columns, uScale, vScale } = layout;
    const row = Math.floor(index / columns);
    const col = index % columns;
    itemTexture.uScale = uScale;
    itemTexture.vScale = vScale;
    itemTexture.uOffset = col * uScale;
    itemTexture.vOffset = 1 - (row + 1) * vScale;
  };

  const frameRef = useRef(0);
  const elapsedRef = useRef(0);

  const resetFrame = () => {
    frameRef.current = 0;
    elapsedRef.current = 0;
    applyFrame(0);
  };

  useEffect(() => {
    resetFrame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemTexture, layout]);

  useBeforeRender((scene) => {
    if (!hoveredRef.current || frameRef.current >= lastIndex) return;
    elapsedRef.current += scene.getEngine().getDeltaTime();
    if (elapsedRef.current >= frameDelay) {
      elapsedRef.current = 0;
      frameRef.current += 1;
      applyFrame(frameRef.current);
    }
  });

  return (
    <plane
      name={name}
      width={width}
      height={height}
      position={new Vector3(x, y, z)}
      onCreated={(mesh: Mesh) => {
        mesh.actionManager = new ActionManager(mesh.getScene());
        mesh.actionManager.registerAction(
          new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => {
            hoveredRef.current = true;
            resetFrame();
            const scene = mesh.getScene();
            const camera = scene.activeCamera;
            if (!camera) return;
            const engine = scene.getEngine();
            const renderWidth = engine.getRenderWidth();
            const renderHeight = engine.getRenderHeight();
            const viewport = camera.viewport.toGlobal(renderWidth, renderHeight);
            const anchor = mesh.position.add(new Vector3(0, height / 2 + labelOffsetY, 0));
            const projected = Vector3.Project(anchor, Matrix.Identity(), scene.getTransformMatrix(), viewport);
            onHover({
              label: labelRef.current,
              xPercent: (projected.x / renderWidth) * 100,
              yPercent: (projected.y / renderHeight) * 100,
            });
          }),
        );
        mesh.actionManager.registerAction(
          new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => {
            hoveredRef.current = false;
            resetFrame();
            onHover(null);
          }),
        );
      }}
    >
      <standardMaterial
        name={`${name}-material`}
        backFaceCulling={false}
        disableLighting
        emissiveColor={new Color3(1, 1, 1)}
        diffuseTexture={itemTexture}
        useAlphaFromDiffuseTexture
      />
    </plane>
  );
}
