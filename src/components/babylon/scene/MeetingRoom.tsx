import type { Texture } from '@babylonjs/core';

import Layer from '../Layer';

const LAYER_DEPTH = 5;

type MeetingRoomProps = {
  assets: Record<string, Texture>;
};

export default function MeetingRoom({ assets }: MeetingRoomProps) {
  const names = Object.keys(assets).sort();

  return (
    <>
      {names.map((name, i) => (
        <Layer key={name} name={name} texture={assets[name]} z={i * LAYER_DEPTH} />
      ))}
    </>
  );
}