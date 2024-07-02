import { Room } from "@/types/room-types";
import React from "react";
import RoomItemButton from "./room-item-button";
import { formatDistanceToNow } from "date-fns";
import { useRooms } from "@/stores/rooms-store";

interface RoomItemProps {
  room: Room;
}

const RoomItem = ({ room }: RoomItemProps) => {
  const { currentRoom, setCurrentRoom } = useRooms();

  const onClick = (id: string) => {
    setCurrentRoom(id);
  };
  return (
    <div
      key={room.id}
      onClick={() => onClick(room.id)}
      className="flex gap-x-2 items-start rounded-md border py-2 px-2 cursor-pointer hover:bg-slate-100 transition"
    >
      <div>
        <RoomItemButton room={room} className="w-9 h-9" />
      </div>
      <div className="flex flex-col">
        <p
          className={`font-regular text-sm line-clamp-1 ${currentRoom?.id === room.id ? "text-foreground" : "text-muted-foreground"}`}
        >
          {room.name}
        </p>
        <p className="mt-1 font-regular text-[10px] text-muted-foreground">
          You, {formatDistanceToNow(room.createdAt, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default RoomItem;
