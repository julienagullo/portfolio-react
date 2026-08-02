import { Vector3 } from '@babylonjs/core';

export default function Light() {
  return <hemisphericLight name="light1" intensity={1.8} direction={Vector3.Up()} />;
}