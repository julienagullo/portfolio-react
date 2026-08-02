import { useRef } from 'react';
import type { RefObject } from 'react';
import { type ArcRotateCamera, Vector3 } from '@babylonjs/core';
import { useBeforeRender } from 'react-babylonjs';

import { CAMERA_ALPHA_RANGE, CAMERA_BETA_RANGE, CAMERA_FOV, CAMERA_RADIUS, type Pointer } from '../../config';

const ORBIT_LERP = 0.10;
const ALPHA_BASE = -Math.PI / 2;
const BETA_BASE = Math.PI / 2;

export default function Camera({ pointerRef }: { pointerRef: RefObject<Pointer> }) {
  const cameraRef = useRef<ArcRotateCamera | null>(null);

  useBeforeRender(() => {
    const camera = cameraRef.current;
    if (!camera) return;
    const { x, y } = pointerRef.current;
    const targetAlpha = ALPHA_BASE - x * CAMERA_ALPHA_RANGE;
    const targetBeta = BETA_BASE - y * CAMERA_BETA_RANGE;
    camera.alpha += (targetAlpha - camera.alpha) * ORBIT_LERP;
    camera.beta += (targetBeta - camera.beta) * ORBIT_LERP;
  });

  return (
    <arcRotateCamera
      name="camera1"
      target={Vector3.Zero()}
      alpha={ALPHA_BASE}
      beta={BETA_BASE}
      radius={CAMERA_RADIUS}
      fov={CAMERA_FOV}
      lowerRadiusLimit={CAMERA_RADIUS}
      upperRadiusLimit={CAMERA_RADIUS}
      onCreated={(camera) => {
        camera.inputs.clear();
        cameraRef.current = camera;
      }}
    />
  );
}