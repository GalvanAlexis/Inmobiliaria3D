"use client";

import { useState } from "react";
import RoomViewer from "@/components/RoomViewer";
import SphericalViewer from "@/components/SphericalViewer";

type Mode = "cubemap" | "spherical";

// Define the cubemap rooms
const ROOMS = {
  room1: {
    id: "room1",
    name: "Dormitorio (Mock)",
    hotspots: [
      {
        position: [0, 0, -490] as [number, number, number],
        label: "Ir al Baño",
        targetRoom: "room2",
      },
    ],
  },
  room2: {
    id: "room2",
    name: "Baño (Mock)",
    hotspots: [
      {
        position: [0, 0, 490] as [number, number, number],
        label: "Volver al Dormitorio",
        targetRoom: "room1",
      },
    ],
  },
};

type RoomId = keyof typeof ROOMS;

export default function Home() {
  const [mode, setMode] = useState<Mode>("spherical");
  const [currentRoom, setCurrentRoom] = useState<RoomId>("room1");

  const room = ROOMS[currentRoom];

  const handleNavigate = (targetRoomId: string) => {
    if (ROOMS[targetRoomId as RoomId]) {
      setCurrentRoom(targetRoomId as RoomId);
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Mode Switcher */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setMode("spherical")}
          className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all ${
            mode === "spherical"
              ? "bg-blue-600 text-white"
              : "bg-white/80 text-black hover:bg-white"
          }`}
        >
          🌍 Esférico (Real)
        </button>
        <button
          onClick={() => setMode("cubemap")}
          className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all ${
            mode === "cubemap"
              ? "bg-blue-600 text-white"
              : "bg-white/80 text-black hover:bg-white"
          }`}
        >
          📦 Cubemap (Mock)
        </button>
      </div>

      {mode === "spherical" ? (
        <SphericalViewer imagePath="/panorama.jpg" label="Dormitorio Real" />
      ) : (
        <RoomViewer
          roomName={room.id}
          hotspots={room.hotspots}
          onNavigate={handleNavigate}
        />
      )}
    </main>
  );
}
