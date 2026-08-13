import { ActionManager, Color3, ExecuteCodeAction, Matrix, Texture, Vector3, type Mesh } from '@babylonjs/core';
import { useEffect, useRef, useState } from 'react';

import type { ItemHover } from '../../config';

type SpriteItemProps = {
  name: string;
  label: string;
  imgUrl: string;
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

export default function SpriteItem({
  name,
  label,
  imgUrl,
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
}: SpriteItemProps) {
  const [hovered, setHovered] = useState(false);
  const labelRef = useRef(label);
  useEffect(() => {
    labelRef.current = label;
  }, [label]);
  const height = width * (cellHeight / cellWidth);
  const lastIndex = frameCount - 1;

  return (
    <>
      <spriteManager
        name={`${name}-manager`}
        imgUrl={imgUrl}
        capacity={1}
        cellSize={{ width: cellWidth, height: cellHeight }}
        samplingMode={Texture.NEAREST_SAMPLINGMODE}
      >
        <sprite
          name={name}
          position={new Vector3(x, y, z)}
          width={width}
          height={height}
          cellIndex={0}
          fromIndex={0}
          toIndex={hovered ? lastIndex : 0}
          loopAnimation={false}
          delay={frameDelay}
        />
      </spriteManager>
      <plane
        name={`${name}-hitbox`}
        width={width}
        height={height}
        position={new Vector3(x, y, z)}
        visibility={0}
        onCreated={(mesh: Mesh) => {
          mesh.actionManager = new ActionManager(mesh.getScene());
          mesh.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => {
              setHovered(true);
              const scene = mesh.getScene();
              const camera = scene.activeCamera;
              if (!camera) return;
              const engine = scene.getEngine();
              const renderWidth = engine.getRenderWidth();
              const renderHeight = engine.getRenderHeight();
              const viewport = camera.viewport.toGlobal(renderWidth, renderHeight);
              const bottom = mesh.position.add(new Vector3(0, height / 2 + labelOffsetY, 0));
              const projected = Vector3.Project(bottom, Matrix.Identity(), scene.getTransformMatrix(), viewport);
              onHover({
                label: labelRef.current,
                xPercent: (projected.x / renderWidth) * 100,
                yPercent: (projected.y / renderHeight) * 100,
              });
            }),
          );
          mesh.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => {
              setHovered(false);
              onHover(null);
            }),
          );
        }}
      >
        <standardMaterial name={`${name}-hitbox-material`} alpha={0} emissiveColor={new Color3(0, 0, 0)} />
      </plane>
    </>
  );
}
