"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Line } from "@react-three/drei";
import type { Group, Mesh } from "three";

type Vec3 = [number, number, number];

const titanium = "#A5AFB2";
const graphite = "#5A6264";
const arcBlue = "#176F86";
const forgeAmber = "#B9682E";
const laserGreen = "#2F8B5F";
const stressRed = "#B42318";
const warmStudio = "#FBF6EC";

function smoothStep(value: number) {
  return value * value * (3 - 2 * value);
}

function mixVec3(from: Vec3, to: Vec3, amount: number): Vec3 {
  return [
    from[0] + (to[0] - from[0]) * amount,
    from[1] + (to[1] - from[1]) * amount,
    from[2] + (to[2] - from[2]) * amount,
  ];
}

function ProcessPart({
  base,
  exploded,
  children,
}: {
  base: Vec3;
  exploded: Vec3;
  children: React.ReactNode;
}) {
  const ref = useRef<Group>(null);
  const elapsedRef = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;

    elapsedRef.current += delta;
    const raw = (Math.sin(elapsedRef.current * 0.42 - 0.8) + 1) / 2;
    const amount = smoothStep(raw);
    ref.current.position.set(...mixVec3(base, exploded, amount));
  });

  return <group ref={ref}>{children}</group>;
}

function FastenerStack({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.101, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.022, 48]} />
        <meshStandardMaterial color={graphite} metalness={0.65} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.126, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.018, 16, 64]} />
        <meshStandardMaterial
          color={arcBlue}
          emissive={arcBlue}
          emissiveIntensity={0.28}
          metalness={0.7}
          roughness={0.22}
        />
      </mesh>
    </group>
  );
}

function AdditiveLayerStack() {
  return (
    <group>
      {Array.from({ length: 9 }).map((_, index) => (
        <mesh key={index} position={[0, -0.38 + index * 0.045, 0]}>
          <boxGeometry args={[2.35 - index * 0.04, 0.018, 0.86 - index * 0.018]} />
          <meshStandardMaterial
            color={forgeAmber}
            emissive={forgeAmber}
            emissiveIntensity={0.04}
            metalness={0.35}
            roughness={0.52}
            transparent
            opacity={0.34}
          />
        </mesh>
      ))}
    </group>
  );
}

function MetrologyScan() {
  const ref = useRef<Mesh>(null);
  const elapsedRef = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    elapsedRef.current += delta;
    const progress = (elapsedRef.current * 0.22) % 1;
    ref.current.position.x = -1.75 + progress * 3.5;
  });

  return (
    <mesh ref={ref} position={[0, 0.55, 0]}>
      <boxGeometry args={[0.026, 1.55, 1.75]} />
      <meshBasicMaterial color={laserGreen} transparent opacity={0.26} />
    </mesh>
  );
}

function FEMMarkers() {
  return (
    <group position={[0, 0.17, 0]}>
      <mesh position={[-0.66, 0, -0.34]}>
        <boxGeometry args={[0.46, 0.012, 0.055]} />
        <meshStandardMaterial color={arcBlue} emissive={arcBlue} emissiveIntensity={0.22} />
      </mesh>
      <mesh position={[0.18, 0, 0.1]}>
        <boxGeometry args={[0.54, 0.012, 0.055]} />
        <meshStandardMaterial color={forgeAmber} emissive={forgeAmber} emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0.84, 0, 0.34]}>
        <boxGeometry args={[0.38, 0.012, 0.055]} />
        <meshStandardMaterial color={stressRed} emissive={stressRed} emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
}

function AerospaceBracket() {
  const rootRef = useRef<Group>(null);
  const elapsedRef = useRef(0);

  useFrame((_, delta) => {
    if (!rootRef.current) return;
    elapsedRef.current += delta;
    rootRef.current.rotation.y = -0.45 + Math.sin(elapsedRef.current * 0.18) * 0.18;
    rootRef.current.rotation.x = 0.16 + Math.sin(elapsedRef.current * 0.24) * 0.035;
  });

  return (
    <group ref={rootRef} scale={1.18} rotation={[0.16, -0.45, -0.08]}>
      <Float speed={0.75} rotationIntensity={0.08} floatIntensity={0.18}>
        <ProcessPart base={[0, 0, 0]} exploded={[0, -0.12, 0]}>
          <mesh>
            <boxGeometry args={[2.85, 0.16, 1.16]} />
            <meshStandardMaterial color={titanium} metalness={0.82} roughness={0.27} />
          </mesh>
          <mesh position={[0, 0.091, 0]}>
            <boxGeometry args={[2.95, 0.012, 1.24]} />
            <meshStandardMaterial color="#ECE6D8" metalness={0.58} roughness={0.28} transparent opacity={0.44} />
          </mesh>
          <FastenerStack x={-1.02} z={-0.35} />
          <FastenerStack x={1.02} z={0.35} />
          <FEMMarkers />
        </ProcessPart>

        <ProcessPart base={[0, 0.26, 0]} exploded={[0, 0.82, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.34, 0.82, 0.96]} />
            <meshStandardMaterial color="#C2B49F" metalness={0.62} roughness={0.36} />
          </mesh>
          <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.32, 0.035, 20, 72]} />
            <meshStandardMaterial color={titanium} metalness={0.85} roughness={0.23} />
          </mesh>
          <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.038, 48]} />
            <meshStandardMaterial color={graphite} metalness={0.6} roughness={0.48} />
          </mesh>
        </ProcessPart>

        <ProcessPart base={[-0.84, 0.24, 0]} exploded={[-1.18, 0.46, -0.18]}>
          <mesh rotation={[0, 0, 0.02]}>
            <boxGeometry args={[0.1, 0.62, 0.98]} />
            <meshStandardMaterial color="#B8AA95" metalness={0.62} roughness={0.35} />
          </mesh>
        </ProcessPart>

        <ProcessPart base={[0.84, 0.24, 0]} exploded={[1.18, 0.46, 0.18]}>
          <mesh rotation={[0, 0, -0.02]}>
            <boxGeometry args={[0.1, 0.62, 0.98]} />
            <meshStandardMaterial color="#B8AA95" metalness={0.62} roughness={0.35} />
          </mesh>
        </ProcessPart>

        <ProcessPart base={[0, -0.18, 0]} exploded={[0, -0.72, 0]}>
          <AdditiveLayerStack />
        </ProcessPart>

        <Line
          points={[
            [-1.38, 0.21, -0.47],
            [-0.78, 0.21, -0.47],
            [-0.78, 0.21, 0.12],
            [0.24, 0.21, 0.12],
            [0.24, 0.21, 0.47],
            [1.36, 0.21, 0.47],
          ]}
          color={laserGreen}
          lineWidth={1.2}
          transparent
          opacity={0.72}
        />

        <Line
          points={[
            [-1.52, 0.42, -0.66],
            [-1.22, 0.42, -0.86],
            [-0.74, 0.42, -0.72],
          ]}
          color={forgeAmber}
          lineWidth={1.4}
        />

        <MetrologyScan />
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.35, 5.3], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
    >
      <fog attach="fog" args={[warmStudio, 6, 13]} />

      <ambientLight intensity={0.62} />
      <directionalLight position={[5, 5, 5]} intensity={0.82} color="#fff8eb" />
      <directionalLight position={[-4, -1, 3]} intensity={0.32} color={forgeAmber} />
      <pointLight position={[0, 2.8, 2.4]} intensity={0.48} color={arcBlue} distance={8} />
      <pointLight position={[-2.2, -1.8, 3]} intensity={0.32} color={forgeAmber} distance={6} />

      <AerospaceBracket />

      <Environment preset="warehouse" environmentIntensity={0.36} />
    </Canvas>
  );
}
