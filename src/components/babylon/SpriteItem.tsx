import { ActionManager, Color3, ExecuteCodeAction, Texture, Vector3, type Mesh } from '@babylonjs/core';
import { useState } from 'react';

type SpriteItemProps = {
  name: string;
  imgUrl: string;
  cellWidth: number;
  cellHeight: number;
  frameCount: number;
  x: number;
  y: number;
  z: number;
  width: number;
  frameDelay?: number;
};

export default function SpriteItem({
  name,
  imgUrl,
  cellWidth,
  cellHeight,
  frameCount,
  x,
  y,
  z,
  width,
  frameDelay = 40, // x3 plus rapide (delay initial 120ms)
}: SpriteItemProps) {
  const [hovered, setHovered] = useState(false);
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
            new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => setHovered(true)),
          );
          mesh.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => setHovered(false)),
          );
        }}
      >
        <standardMaterial name={`${name}-hitbox-material`} alpha={0} emissiveColor={new Color3(0, 0, 0)} />
      </plane>
    </>
  );
}