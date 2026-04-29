"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const mesh = useRef<THREE.Points>(null);
  const count = 500;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0.38;
        colors[i * 3 + 1] = 0.4;
        colors[i * 3 + 2] = 0.95;
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.13;
        colors[i * 3 + 1] = 0.83;
        colors[i * 3 + 2] = 0.93;
      } else {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      }
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = time * 0.02;
    mesh.current.rotation.x = time * 0.01;

    const positionArray = mesh.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      positionArray[i * 3 + 1] += Math.sin(time + i) * 0.001;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.05;
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(time * 0.5 + i) * 0.5;
      child.rotation.x = time * 0.1 + i;
      child.rotation.z = time * 0.05 + i;
    });
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-3, 0, -2]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#6366F1"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      <mesh position={[3, 1, -1]}>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color="#22D3EE"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      <mesh position={[0, -2, -3]}>
        <torusGeometry args={[0.6, 0.2, 16, 32]} />
        <meshStandardMaterial
          color="#10B981"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
    </group>
  );
}

export function ParticleField() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Particles />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}

