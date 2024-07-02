"use client";

import { listRoomByOwner } from "@/api/room";
import { Separator } from "@/components/ui/separator";
import { useRooms } from "@/stores/rooms-store";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import RoomItemButton from "./room-item-button";

import InputRoom from "./input-room";
import { ScrollArea } from "@/components/ui/scroll-area";
import ButtonListRoom from "./button-list-room";

const RoomsSection = () => {
  const { user } = useUser();
  const { currentRoom, setRooms, setCurrentRoom } = useRooms();

  useEffect(() => {
    const init = async () => {
      const rooms = await listRoomByOwner(user?.id!);
      setRooms(rooms);

      if (rooms?.length) {
        setCurrentRoom(rooms[0].id);
      }
    };

    init();
  }, [user?.id!]);

  return (
    <div className="flex flex-col items-center py-2 gap-y-2 justify-center border rounded-md">
      <ButtonListRoom />

      <Separator />

      <ScrollArea className="max-h-[250px]">
        <div className="flex flex-col items-center gap-y-2 justify-center h-full">
          {currentRoom && <RoomItemButton room={currentRoom} />}
        </div>
      </ScrollArea>

      <Separator />

      <InputRoom />
    </div>
  );
};

export default RoomsSection;
