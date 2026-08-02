import { Color3, Vector3, type Texture } from '@babylonjs/core';

import { CAMERA_RADIUS, LAYER_BASE_WIDTH } from '../../config';

type LayerProps = {
  name: string;
  texture: Texture;
  z: number;
};

export default function Layer({ name, texture, z }: LayerProps) {
  const { width: texWidth, height: texHeight } = texture.getSize();
  const aspectRatio = texHeight / texWidth;

  // Un plan plus profond (z plus grand) est plus loin de la caméra : il doit être
  // proportionnellement plus large pour continuer à couvrir le champ de vision.
  const scale = (CAMERA_RADIUS + z) / CAMERA_RADIUS;
  const width = LAYER_BASE_WIDTH * scale;
  const height = width * aspectRatio;

  return (
    <plane name={name} width={width} height={height} position={new Vector3(0, 0, z)}>
      <standardMaterial
        name={`${name}-material`}
        backFaceCulling={false}
        disableLighting
        emissiveColor={new Color3(1, 1, 1)}
        diffuseTexture={texture}
      />
    </plane>
  );
}