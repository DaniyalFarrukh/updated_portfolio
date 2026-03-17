import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Torus, Octahedron } from "@react-three/drei";
import * as THREE from "three";

function DistortSphere({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.elapsedTime * 0.3;
      ref.current.rotation.y = clock.elapsedTime * 0.2;
    }
  });
  return (
    <Float speed={2} floatIntensity={1.2} rotationIntensity={0.6}>
      <Sphere ref={ref} args={[0.55, 32, 32]} position={position}>
        <MeshDistortMaterial
          color="#7c3aed"
          attach="material"
          distort={0.45}
          speed={3}
          roughness={0.0}
          metalness={0.3}
          transparent
          opacity={0.95}
          emissive="#6366f1"
          emissiveIntensity={0.4}
        />
      </Sphere>
    </Float>
  );
}

function SpinningTorus({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.elapsedTime * 0.4;
      ref.current.rotation.z = clock.elapsedTime * 0.25;
    }
  });
  return (
    <Float speed={1.5} floatIntensity={1} rotationIntensity={0.8}>
      <Torus ref={ref} args={[0.4, 0.14, 16, 60]} position={position}>
        <meshStandardMaterial
          color="#a855f7"
          roughness={0.0}
          metalness={0.3}
          transparent
          opacity={0.95}
          emissive="#a855f7"
          emissiveIntensity={0.5}
        />
      </Torus>
    </Float>
  );
}

function SpinningOcta({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.5;
      ref.current.rotation.x = clock.elapsedTime * 0.3;
    }
  });
  return (
    <Float speed={2.5} floatIntensity={1.5} rotationIntensity={1}>
      <Octahedron ref={ref} args={[0.38, 0]} position={position}>
        <meshStandardMaterial
          color="#06b6d4"
          roughness={0.0}
          metalness={0.3}
          transparent
          opacity={0.95}
          emissive="#06b6d4"
          emissiveIntensity={0.5}
        />
      </Octahedron>
    </Float>
  );
}

function Scene() {
  return (
    <>
      {/* Boosted lights so shapes are visible over the globe */}
      <ambientLight intensity={2.5} />
      <directionalLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
      <pointLight position={[0, 0, 4]} intensity={3} color="#ffffff" />
      <pointLight position={[-4, -3, -2]} intensity={2} color="#a855f7" />
      <pointLight position={[4, 3, 2]} intensity={2} color="#06b6d4" />

      <DistortSphere position={[2.2, 0.5, -1]} />
      <SpinningTorus position={[-2.0, -0.6, -0.5]} />
      <SpinningOcta position={[0.2, 1.8, -2]} />
      <DistortSphere position={[-1.0, -2.0, -1.5]} />
      <SpinningTorus position={[3.0, -1.5, -2]} />
    </>
  );
}

export const FloatingGeometry = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{ zIndex: 1 }}
    aria-hidden="true"
  >
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  </div>
);