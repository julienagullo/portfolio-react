import { Color3, Vector3, type Texture } from '@babylonjs/core';

import Layer from '../Layer';
import SpriteItemMesh from '../SpriteItemMesh';
import { OFFICE_SPRITE_ITEMS, type ItemHover, type Language } from '../../../config';
import { t, type TranslationKey } from '../../../lang';

const LAYER_DEPTH = 5;
const SUN_Z = 2 * LAYER_DEPTH - 1.5;

type OfficeSpaceProps = {
  assets: Record<string, Texture>;
  language: Language;
  onHover: (hover: ItemHover | null) => void;
  onItemClick: (name: string) => void;
  onItemHoverChange: (hovering: boolean) => void;
};

export default function OfficeSpace({ assets, language, onHover, onItemClick, onItemHoverChange }: OfficeSpaceProps) {
  const layerNames = Object.keys(assets)
    .filter((name) => !(name in OFFICE_SPRITE_ITEMS))
    .sort();
  const itemSprites = Object.keys(assets).filter((name) => name in OFFICE_SPRITE_ITEMS);

  return (
    <>
      <pointLight
        name="sun"
        position={new Vector3(1, 1.2, SUN_Z)}
        diffuse={new Color3(1, 0.95, 0.85)}
        intensity={0.7}
      />
      {layerNames.map((name, i) => (
        <Layer key={name} name={name} texture={assets[name]} z={i * LAYER_DEPTH} lit />
      ))}
      {itemSprites.map((name) => {
        const { x, y, z, width, labelOffsetY, cellWidth, cellHeight, frameCount } = OFFICE_SPRITE_ITEMS[name];
        return (
          <SpriteItemMesh
            key={name}
            name={name}
            label={t(language, `items.${name}` as TranslationKey)}
            texture={assets[name]}
            cellWidth={cellWidth}
            cellHeight={cellHeight}
            frameCount={frameCount}
            x={x}
            y={y}
            z={z}
            width={width}
            labelOffsetY={labelOffsetY}
            onHover={onHover}
            onClick={onItemClick}
            onHoverChange={onItemHoverChange}
          />
        );
      })}
    </>
  );
}