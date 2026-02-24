"use client";

import { useState } from "react";
import RoomViewer from "@/components/RoomViewer";

// Define the rooms and their hotspots
const ROOMS = {
  room1: {
    id: "room1",
    name: "Dormitorio",
    hotspots: [
      {
        position: [0, 0, -490] as [number, number, number], // Positioned far away on the Z axis (Front)
        label: "Ir al Baño",
        targetRoom: "room2",
      },
    ],
  },
  room2: {
    id: "room2",
    name: "Baño",
    hotspots: [
      {
        position: [0, 0, 490] as [number, number, number], // Positioned far away on the Z axis (Back)
        label: "Volver al Dormitorio",
        targetRoom: "room1",
      },
    ],
  },
};

type RoomId = keyof typeof ROOMS;

export default function Home() {
  const [currentRoom, setCurrentRoom] = useState<RoomId>("room1");

  const room = ROOMS[currentRoom];

  const handleNavigate = (targetRoomId: string) => {
    if (ROOMS[targetRoomId as RoomId]) {
      setCurrentRoom(targetRoomId as RoomId);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <RoomViewer
        roomName={room.id}
        hotspots={room.hotspots}
        onNavigate={handleNavigate}
      />
    </main>
  );
}
