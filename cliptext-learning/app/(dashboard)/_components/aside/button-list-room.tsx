import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Folder } from "lucide-react";
import React from "react";
import ListRooms from "./list-rooms";

const ButtonListRoom = () => {
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <div className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 rounded-md">
            <Folder className="w-4 h-4" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="start"
          sideOffset={16}
          className="max-w-[350px]"
        >
          <ListRooms />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ButtonListRoom;
