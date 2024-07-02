"use client";

import { save } from "@/api/room";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRooms } from "@/stores/rooms-store";
import { Room } from "@/types/room-types";
import { useUser } from "@clerk/nextjs";
import { Check, Loader2, Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

const InputRoom = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useUser();
  const { add, setCurrentRoom } = useRooms();

  const resetState = () => {
    setName("");
  };

  const onCreate = async () => {
    setIsCreating(true);

    try {
      if (!name?.length) {
        toast.warning("Please fill your room name");
        return;
      }

      const room: Room = {
        id: uuid(),
        name: name?.trim(),
        owner: user?.id!,
        createdAt: Date.now(),
        isDefault: false,
      };

      await save(room);
      add(room);
      setCurrentRoom(room.id);

      setOpen(false);
      resetState();
      toast.success(`'${room.name}' room is created!`);
    } catch (e) {
      toast.error(
        "Could not create room! Please try again or contact support."
      );
      console.log(e);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(e) => {
        if (!isCreating) {
          setOpen(e);
        } else {
          resetState();
        }
      }}
    >
      <PopoverTrigger>
        <Hint label={"Create room"} side="right" align="center" sideOffset={16}>
          <Button
            className="w-8 h-8 group"
            variant={"outline"}
            size={"icon"}
            asChild
          >
            <div>
              <Plus className="w-4 h-4 text-muted-foreground text-black transition" />
            </div>
          </Button>
        </Hint>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="center"
        sideOffset={16}
        className="w-[350px]"
      >
        <div className="flex gap-x-4 w-full">
          <Input
            placeholder="Enter room name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isCreating}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                onCreate();
              }
            }}
          />
          <Button
            className="aspect-square"
            size={"icon"}
            onClick={onCreate}
            disabled={isCreating}
          >
            {!isCreating && <Check className="w-4 h-4" />}
            {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InputRoom;
