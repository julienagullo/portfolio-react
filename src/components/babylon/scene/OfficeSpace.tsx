import type { Texture } from '@babylonjs/core';

import Layer from '../Layer';

const LAYER_DEPTH = 5;

type OfficeSpaceProps = {
  assets: Record<string, Texture>;
};

export default function OfficeSpace({ assets }: OfficeSpaceProps) {
  const names = Object.keys(assets).sort();

  return (
    <>
      {names.map((name, i) => (
        <Layer key={name} name={name} texture={assets[name]} z={i * LAYER_DEPTH} />
      ))}
    </>
  );
}