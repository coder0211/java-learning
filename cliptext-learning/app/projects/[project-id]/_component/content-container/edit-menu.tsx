import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { CircleX, Copy, Grip } from "lucide-react";
import React from "react";

interface EditMenuProps {
  onDeleteClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const EditMenu = ({ onDeleteClick }: EditMenuProps) => {
  return (
    <div className="absolute top-0 right-2 -translate-y-[50%] bg-white border p-2 rounded-md opacity-0 group-hover:opacity-100 flex gap-x-2">
      {/* <Hint label="Drag" sideOffset={10} side="bottom">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="w-8 h-8 cursor-grab active:cursor-grabbing"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Grip className="w-4 h-4" />
        </Button>
      </Hint>

      <Hint label="Duplicate" sideOffset={10} side="bottom">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="w-8 h-8"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </Hint> */}

      <Hint label="Delete" align="end" side="bottom">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="w-6 h-6"
          onClick={onDeleteClick}
        >
          <CircleX className="w-4 h-4" />
        </Button>
      </Hint>
    </div>
  );
};

export default EditMenu;
