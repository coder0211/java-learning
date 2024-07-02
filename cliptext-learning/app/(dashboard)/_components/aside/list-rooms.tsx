"use client";

import { Input } from "@/components/ui/input";
import { useRooms } from "@/stores/rooms-store";
import { Bird, Search } from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import RoomItem from "./room-item";
import { ScrollArea } from "@/components/ui/scroll-area";

const ListRooms = () => {
  const { rooms } = useRooms();
  const [renderingRooms, setRenderingRooms] = useState(rooms);
  const [name, setName] = useDebounceValue("", 100);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  useEffect(() => {
    setRenderingRooms(
      rooms?.filter((room) => {
        return room.name.includes(name.trim());
      })
    );
  }, [rooms, name]);

  return (
    <div className="flex flex-col gap-y-4 w-full">
      <div className="w-full relative">
        <Search className="w-4 h-4 absolute top-1/2 left-3 -translate-y-1/2" />
        <Input
          placeholder="Search your rooms"
          className="pl-9"
          onChange={onChange}
        />
      </div>
      {!renderingRooms?.length && (
        <div className="w-full flex flex-col justify-center items-center">
          <Bird className="w-8 h-8 text-muted-foreground mt-2" />
          <p className="mt-4 text-sm font-normal text-muted-foreground">
            No rooms found for &apos;{name}&apos;
          </p>
        </div>
      )}

      <ScrollArea>
        <div className="flex flex-col gap-y-4 w-full max-h-[280px] ">
          {renderingRooms?.map((room) => {
            return <RoomItem key={room.id} room={room} />;
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ListRooms;
