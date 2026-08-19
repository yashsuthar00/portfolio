/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { trackEvent } from '@/utils/analytics';
import {
  Canvas,
  extend,
  RootState,
  useFrame,
  useThree,
} from '@react-three/fiber';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// Register meshline components with React Three Fiber
extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}

// Define interface for mesh line material props
interface MeshLineMaterialProps {
  transparent: boolean;
  opacity: number;
  color: string;
  depthTest: boolean;
  resolution: [number, number];
  lineWidth: number;
}

// Define interface for rigid body type
type RigidBodyType =
  | 'fixed'
  | 'dynamic'
  | 'kinematicPosition'
  | 'kinematicVelocity';

// Define interface for pointer event target
interface PointerEventTarget extends EventTarget {
  releasePointerCapture: (pointerId: number) => void;
  setPointerCapture: (pointerId: number) => void;
}

// Define interface for Three event with proper target typing
interface TypedThreeEvent {
  target: PointerEventTarget;
  pointerId: number;
  point: THREE.Vector3;
  // Add any other properties from ThreeEvent if needed
}

export default function BandApp(): React.ReactElement {
  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
      <Physics debug interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band />
      </Physics>
    </Canvas>
  );
}

function Band(): React.ReactElement {
  // Explicitly type all refs
  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  // Only keep used Vector3 instances
  const vec: THREE.Vector3 = new THREE.Vector3();
  const dir: THREE.Vector3 = new THREE.Vector3();

  // Explicitly type the size destructuring
  const { width, height }: { width: number; height: number } = useThree(
    (state: RootState) => state.size
  );

  // Explicitly type the dragged state
  const [dragged, drag]: [
    false | THREE.Vector3,
    (value: false | THREE.Vector3) => void,
  ] = useState<false | THREE.Vector3>(false);

  // Explicitly type joint parameters
  const jointParams1: [
    [number, number, number],
    [number, number, number],
    number,
  ] = [[0, 0, 0], [0, 0, 0], 1];
  const jointParams2: [
    [number, number, number],
    [number, number, number],
    number,
  ] = [[0, 0, 0], [0, 0, 0], 1];
  const jointParams3: [
    [number, number, number],
    [number, number, number],
    number,
  ] = [[0, 0, 0], [0, 0, 0], 1];
  const sphericalJointParams: [
    [number, number, number],
    [number, number, number],
  ] = [
    [0, 0, 0],
    [0, 1.45, 0],
  ];

  useRopeJoint(fixed, j1, jointParams1);
  useRopeJoint(j1, j2, jointParams2);
  useRopeJoint(j2, j3, jointParams3);
  useSphericalJoint(j3, card, sphericalJointParams);

  // Ensure curve is defined and in scope
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
      ]),
    []
  );

  useFrame((state: RootState): void => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      // Explicitly type the refs array
      const refs: Array<React.RefObject<any>> = [card, j1, j2, j3, fixed];
      refs.forEach(ref => ref.current?.wakeUp());

      const translation: { x: number; y: number; z: number } = {
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      };
      card.current?.setNextKinematicTranslation(translation);
    }
    if (fixed.current) {
      // Calculate catmul curve with explicit assertions
      const j3Translation: THREE.Vector3 = new THREE.Vector3(
        j3.current!.translation().x,
        j3.current!.translation().y,
        j3.current!.translation().z
      );
      const j2Translation: THREE.Vector3 = new THREE.Vector3(
        j2.current!.translation().x,
        j2.current!.translation().y,
        j2.current!.translation().z
      );
      const j1Translation: THREE.Vector3 = new THREE.Vector3(
        j1.current!.translation().x,
        j1.current!.translation().y,
        j1.current!.translation().z
      );
      const fixedTranslation: THREE.Vector3 = new THREE.Vector3(
        fixed.current!.translation().x,
        fixed.current!.translation().y,
        fixed.current!.translation().z
      );

      curve.points[0].copy(j3Translation);
      curve.points[1].copy(j2Translation);
      curve.points[2].copy(j1Translation);
      curve.points[3].copy(fixedTranslation);

      const curvePoints: THREE.Vector3[] = curve.getPoints(32);
      const bandGeometry = band.current!.geometry as MeshLineGeometry;
      bandGeometry.setPoints(curvePoints);

      // Tilt it back towards the screen with explicit typing
      const cardAngularVelocity = card.current!.angvel();
      const cardRotation = card.current!.rotation();

      // Use the returned object directly, no need to copy to THREE.Vector3
      const newAngularVelocity = {
        x: cardAngularVelocity.x,
        y: cardAngularVelocity.y - cardRotation.y * 0.25,
        z: cardAngularVelocity.z,
      };
      card.current!.setAngvel(newAngularVelocity, true);
    }
  });

  // Remembers where/when a drag started, so pointer-up can measure it.
  const dragStartRef = useRef<{ point: THREE.Vector3; time: number } | null>(
    null
  );
  // Distinguishes "noticed the card once" from repeat play (per pageview).
  const hasInteractedRef = useRef(false);

  // Explicitly type event handlers
  const handlePointerUp = (e: TypedThreeEvent): void => {
    e.target.releasePointerCapture(e.pointerId);
    drag(false);

    // Analytics: measure the drag to tell a real "stretch" from an idle tap.
    // distance is in 3D world units; the stretch threshold is tunable.
    const start = dragStartRef.current;
    dragStartRef.current = null;
    if (start) {
      const distance = start.point.distanceTo(e.point);
      trackEvent('card_interact', {
        stretched: distance > 0.5,
        distance: Math.round(distance * 100) / 100,
        duration_ms: Math.round(performance.now() - start.time),
        is_first: !hasInteractedRef.current,
      });
      hasInteractedRef.current = true;
    }
  };

  const handlePointerDown = (e: TypedThreeEvent): void => {
    e.target.setPointerCapture(e.pointerId);
    dragStartRef.current = { point: e.point.clone(), time: performance.now() };
    const cardTranslation = new THREE.Vector3(
      card.current!.translation().x,
      card.current!.translation().y,
      card.current!.translation().z
    );
    const dragVector: THREE.Vector3 = new THREE.Vector3()
      .copy(e.point)
      .sub(vec.copy(cardTranslation));
    drag(dragVector);
  };

  // Explicitly type rigid body type
  const rigidBodyType: RigidBodyType = dragged
    ? 'kinematicPosition'
    : 'dynamic';

  // Explicitly type position arrays
  const groupPosition: [number, number, number] = [0, 4, 0];
  const j1Position: [number, number, number] = [0.5, 0, 0];
  const j2Position: [number, number, number] = [1, 0, 0];
  const j3Position: [number, number, number] = [1.5, 0, 0];
  const cardPosition: [number, number, number] = [2, 0, 0];

  // Explicitly type collider args
  const ballColliderArgs: [number] = [0.1];
  const cuboidColliderArgs: [number, number, number] = [0.8, 1.125, 0.01];

  // Explicitly type geometry args
  const planeGeometryArgs: [number, number] = [0.8 * 2, 1.125 * 2];

  // Explicitly type material props
  const meshLineMaterialProps: MeshLineMaterialProps = {
    transparent: true,
    opacity: 0.25,
    color: 'white',
    depthTest: false,
    resolution: [width, height],
    lineWidth: 1,
  };

  const meshBasicMaterialProps = {
    transparent: true,
    opacity: 0.25,
    color: 'white',
    side: THREE.DoubleSide,
  };

  return (
    <>
      <group position={groupPosition}>
        <RigidBody
          ref={fixed}
          angularDamping={2}
          linearDamping={2}
          type='fixed'
        />
        <RigidBody
          position={j1Position}
          ref={j1}
          angularDamping={2}
          linearDamping={2}
        >
          <BallCollider args={ballColliderArgs} />
        </RigidBody>
        <RigidBody
          position={j2Position}
          ref={j2}
          angularDamping={2}
          linearDamping={2}
        >
          <BallCollider args={ballColliderArgs} />
        </RigidBody>
        <RigidBody
          position={j3Position}
          ref={j3}
          angularDamping={2}
          linearDamping={2}
        >
          <BallCollider args={ballColliderArgs} />
        </RigidBody>
        <RigidBody
          position={cardPosition}
          ref={card}
          angularDamping={2}
          linearDamping={2}
          type={rigidBodyType}
        >
          <CuboidCollider args={cuboidColliderArgs} />
          <mesh onPointerUp={handlePointerUp} onPointerDown={handlePointerDown}>
            <planeGeometry args={planeGeometryArgs} />
            <meshBasicMaterial {...meshBasicMaterialProps} />
          </mesh>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial {...meshLineMaterialProps} />
      </mesh>
    </>
  );
}
