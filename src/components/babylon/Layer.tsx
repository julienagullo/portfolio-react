import { Color3, Vector3, type Texture } from '@babylonjs/core';

import { CAMERA_RADIUS, LAYER_BASE_WIDTH } from '../../config/config';

type LayerProps = {
  name: string;
  texture: Texture;
  z: number;
  lit?: boolean;
};

export default function Layer({ name, texture, z, lit = false }: LayerProps) {
  const { width: texWidth, height: texHeight } = texture.getSize();
  const aspectRatio = texHeight / texWidth;
  const scale = (CAMERA_RADIUS + z) / CAMERA_RADIUS;
  const width = LAYER_BASE_WIDTH * scale;
  const height = width * aspectRatio;

  return (
    <plane name={name} width={width} height={height} position={new Vector3(0, 0, z)} isPickable={false}>
      <standardMaterial
        name={`${name}-material`}
        backFaceCulling={false}
        disableLighting={!lit}
        emissiveColor={lit ? new Color3(0, 0, 0) : new Color3(1, 1, 1)}
        diffuseTexture={texture}
      />
    </plane>
  );
}