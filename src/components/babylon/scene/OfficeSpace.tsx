import { Color3, Vector3, type Texture } from '@babylonjs/core';

import Layer from '../Layer';

const LAYER_DEPTH = 5;
const SUN_Z = 2 * LAYER_DEPTH - 1.75; // juste devant le 3ème plan (z=10)

type OfficeSpaceProps = {
  assets: Record<string, Texture>;
};

export default function OfficeSpace({ assets }: OfficeSpaceProps) {
  const names = Object.keys(assets).sort();

  return (
    <>
      <pointLight
        name="sun"
        position={new Vector3(1, 1.2, SUN_Z)}
        diffuse={new Color3(1, 0.95, 0.85)}
        intensity={0.8}
      />
      {names.map((name, i) => (
        <Layer key={name} name={name} texture={assets[name]} z={i * LAYER_DEPTH} lit />
      ))}
    </>
  );
}