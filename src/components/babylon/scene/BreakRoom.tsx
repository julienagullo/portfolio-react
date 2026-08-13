import { Color3, Vector3, type Texture } from '@babylonjs/core';

import Layer from '../Layer';
import SpriteItem from '../SpriteItem';
import { BREAK_ITEMS, type ItemHover, type Language } from '../../../config';
import { t, type TranslationKey } from '../../../lang';

const LAYER_DEPTH = 5;
const SUN_Z = 2 * LAYER_DEPTH - 1.5;

type BreakRoomProps = {
  assets: Record<string, Texture>;
  language: Language;
  onHover: (hover: ItemHover | null) => void;
};

export default function BreakRoom({ assets, language, onHover }: BreakRoomProps) {
  const layerNames = Object.keys(assets)
    .filter((name) => !(name in BREAK_ITEMS))
    .sort();
  const itemSprites = Object.keys(assets).filter((name) => name in BREAK_ITEMS);

  return (
    <>
      <pointLight
        name="sun"
        position={new Vector3(0, 0.6, SUN_Z)}
        diffuse={new Color3(1, 0.95, 0.85)}
        intensity={0.8}
      />
      {layerNames.map((name, i) => (
        <Layer key={name} name={name} texture={assets[name]} z={i * LAYER_DEPTH} lit />
      ))}
      {itemSprites.map((name) => {
        const { x, y, z, width, labelOffsetY, url, cellWidth, cellHeight, frameCount } = BREAK_ITEMS[name];
        return (
          <SpriteItem
            key={name}
            name={name}
            label={t(language, `items.${name}` as TranslationKey)}
            imgUrl={url}
            cellWidth={cellWidth}
            cellHeight={cellHeight}
            frameCount={frameCount}
            x={x}
            y={y}
            z={z}
            width={width}
            labelOffsetY={labelOffsetY}
            onHover={onHover}
          />
        );
      })}
    </>
  );
}
