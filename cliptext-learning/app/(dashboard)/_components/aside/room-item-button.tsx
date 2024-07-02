"use client";

import Hint from "@/components/hint";
import { useRooms } from "@/stores/rooms-store";
import { Room } from "@/types/room-types";
import React from "react";

interface RoomItemProps {
  room: Room;
  side?: "left" | "top" | "right" | "bottom";
  align?: "center" | "end" | "start";
  className?: string;
}

const RoomItemButton = ({ room, side, align, className }: RoomItemProps) => {
  const { currentRoom, setCurrentRoom } = useRooms();

  const onClick = () => {
    setCurrentRoom(room.id);
  };

  const splitName = room.name?.split(" ");

  return (
    <button
      onClick={onClick}
      className={`rounded-md overflow-hidden flex items-center justify-center w-8 h-8 ${currentRoom?.id === room.id ? "bg-blue-700" : "bg-slate-100 border hover:bg-slate-200"} transition ${className}`}
    >
      <span
        className={`font-normal text-sm ${currentRoom?.id === room.id ? "text-white" : "text-black"}`}
      >
        {splitName[0][0].toUpperCase()}
      </span>
    </button>
  );
};

export default RoomItemButton;
