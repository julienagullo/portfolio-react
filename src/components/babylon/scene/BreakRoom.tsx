import { Color3, Vector3, type Texture } from '@babylonjs/core';

import Layer from '../Layer';
import Item from '../Item';
import { BREAK_ITEMS } from '../../../config';

const LAYER_DEPTH = 5;
const SUN_Z = 2 * LAYER_DEPTH - 1.7;

type BreakRoomProps = {
  assets: Record<string, Texture>;
};

export default function BreakRoom({ assets }: BreakRoomProps) {
  const layerNames = Object.keys(assets)
    .filter((name) => !(name in BREAK_ITEMS))
    .sort();
  const itemNames = Object.keys(assets).filter((name) => name in BREAK_ITEMS);

  return (
    <>
      <pointLight
        name="sun"
        position={new Vector3(-0.1, 0.6, SUN_Z)}
        diffuse={new Color3(1, 0.95, 0.85)}
        intensity={0.8}
      />
      {layerNames.map((name, i) => (
        <Layer key={name} name={name} texture={assets[name]} z={i * LAYER_DEPTH} lit />
      ))}
      {itemNames.map((name) => {
        const { x, y, z, width } = BREAK_ITEMS[name];
        return <Item key={name} name={name} texture={assets[name]} x={x} y={y} z={z} width={width} />;
      })}
    </>
  );
}