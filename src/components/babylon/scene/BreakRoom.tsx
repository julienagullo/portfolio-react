import type { Texture } from '@babylonjs/core';

import Layer from '../Layer';

const LAYER_DEPTH = 5;

type BreakRoomProps = {
  assets: Record<string, Texture>;
};

export default function BreakRoom({ assets }: BreakRoomProps) {
  const names = Object.keys(assets).sort();

  return (
    <>
      {names.map((name, i) => (
        <Layer key={name} name={name} texture={assets[name]} z={i * LAYER_DEPTH} />
      ))}
    </>
  );
}