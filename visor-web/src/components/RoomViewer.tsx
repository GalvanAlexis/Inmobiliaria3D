"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Environment } from "@react-three/drei";

interface Hotspot {
  position: [number, number, number];
  label: string;
  targetRoom: string;
}

interface RoomViewerProps {
  roomName: string;
  hotspots?: Hotspot[];
  onNavigate?: (targetRoom: string) => void;
}

export default function RoomViewer({
  roomName,
  hotspots = [],
  onNavigate,
}: RoomViewerProps) {
  const urls = [
    `${roomName}/px.svg`,
    `${roomName}/nx.svg`,
    `${roomName}/py.svg`,
    `${roomName}/ny.svg`,
    `${roomName}/pz.svg`,
    `${roomName}/nz.svg`,
  ];

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
        <Environment background files={urls} path="/" />

        {/* Render Hotspots */}
        {hotspots.map((hotspot, index) => (
          <Html key={index} position={hotspot.position} center>
            <button
              onClick={() => onNavigate && onNavigate(hotspot.targetRoom)}
              className="bg-white/80 hover:bg-white text-black font-bold py-2 px-4 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer pointer-events-auto border-2 border-transparent hover:border-blue-500 whitespace-nowrap"
            >
              🚪 {hotspot.label}
            </button>
          </Html>
        ))}
      </Canvas>
      <div className="absolute top-4 left-4 inline-block bg-black/60 text-white px-4 py-2 rounded-lg pointer-events-none">
        <h1 className="text-xl font-bold">Inmobiliaria3D - Visor</h1>
        <p className="text-sm opacity-80">
          Arrastra para explorar. Haz clic en las puertas.
        </p>
      </div>
    </div>
  );
}
