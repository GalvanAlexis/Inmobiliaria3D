"use client";

import { useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";

function PanoramaSphere({ imagePath }: { imagePath: string }) {
  const texture = useLoader(TextureLoader, imagePath);
  // Flip the texture horizontally so it renders correctly when viewed from inside
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.x = -1;

  return (
    <mesh>
      {/* Large sphere — camera is at center looking out */}
      <sphereGeometry args={[500, 60, 40]} />
      {/* BackSide renders the inside face of the sphere */}
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

interface SphericalViewerProps {
  imagePath: string;
  label?: string;
}

export default function SphericalViewer({
  imagePath,
  label = "Visor 360°",
}: SphericalViewerProps) {
  const cameraRef = useRef(null);

  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={-0.5}
        />
        <PanoramaSphere imagePath={imagePath} />
      </Canvas>
      <div className="absolute top-4 left-4 inline-block bg-black/60 text-white px-4 py-2 rounded-lg pointer-events-none">
        <h1 className="text-xl font-bold">Inmobiliaria3D - Visor Esférico</h1>
        <p className="text-sm opacity-80">
          {label} · Arrastra para explorar 360°
        </p>
      </div>
    </div>
  );
}
