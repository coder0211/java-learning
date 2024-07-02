"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateProjectModal } from "@/stores/create-project-modal-store";
import { useProjects } from "@/stores/projects-store";
import { useRooms } from "@/stores/rooms-store";
import { useUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { Folder, LayoutGrid, Plus, Search, Table2 } from "lucide-react";
import React from "react";

const Navbar = () => {
  const { currentRoom } = useRooms();
  const { projects } = useProjects();
  const { user } = useUser();

  const { setOpen } = useCreateProjectModal();

  const onCreateClick = () => {
    setOpen(true);
  };

  return (
    <div className="m-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center rounded-md p-2">
          <Folder className="w-6 h-6 mr-2 text-muted-foreground" />
          <span>{currentRoom?.name}</span>
        </div>

        <div className="cursor-pointer bg-white hover:bg-slate-100">
          <div className="flex items-center justify-start p-2 border rounded-md gap-x-6">
            <div className="flex items-center">
              <Avatar className="w-8 h-8 border-2 rounded-md">
                <AvatarImage
                  src={user?.imageUrl}
                  alt={user?.fullName!}
                  className="rounded-md"
                />
                <AvatarFallback>
                  {user?.fullName?.at(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Avatar className="-ml-2 w-8 h-8 border-2 rounded-md">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="rounded-md"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="-ml-2 w-8 h-8 border-2 rounded-md">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="rounded-md"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex items-center justify-center text-[12px] text-muted-foreground ml-2">
                +3 members
              </div>
            </div>

            <Button className="w-6 h-6" size={"icon"}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {!projects ||
        (projects?.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="max-w-[450px] relative">
              <Search className="w-4 h-4 absolute top-1/2 left-3 -translate-y-1/2" />
              <Input placeholder="Search project..." className="pl-9" />
            </div>

            <div className="flex items-center gap-x-4">
              <div className="flex items-center gap-x-2">
                <Button size={"icon"} variant={"outline"}>
                  <Table2 className="w-4 h-4" />
                </Button>
                <Button size={"icon"} variant={"outline"}>
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
              <Button onClick={onCreateClick}>Create</Button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Navbar;
