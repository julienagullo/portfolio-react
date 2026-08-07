import { ActionManager, Color3, ExecuteCodeAction, Vector3, type Mesh, type Texture } from '@babylonjs/core';

type ItemProps = {
  name: string;
  texture: Texture;
  x: number;
  y: number;
  z: number;
  width: number;
};

export default function Item({ name, texture, x, y, z, width }: ItemProps) {
  const { width: texWidth, height: texHeight } = texture.getSize();
  const height = width * (texHeight / texWidth);

  return (
    <plane
      name={name}
      width={width}
      height={height}
      position={new Vector3(x, y, z)}
      onCreated={(mesh: Mesh) => {
        mesh.actionManager = new ActionManager(mesh.getScene());
        mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => {}));
      }}
    >
      <standardMaterial
        name={`${name}-material`}
        backFaceCulling={false}
        disableLighting={false}
        emissiveColor={new Color3(0, 0, 0)}
        diffuseTexture={texture}
      />
    </plane>
  );
}