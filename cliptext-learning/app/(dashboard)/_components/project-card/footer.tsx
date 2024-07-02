"use client";

import { EllipsisVertical } from "lucide-react";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import DropdownMenuProject from "./dropdown-menu-project";
import Hint from "@/components/hint";
import { Project, Status } from "@/types/project-types";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FooterProps {
  project: Project;
}

const Footer = ({ project }: FooterProps) => {
  const { name, id, createdAt, authorId, authorName } = project;
  const { user } = useUser();
  const labelCreatedUser = authorId === user?.id ? "You" : authorName;
  return (
    <div className="py-4 pl-4 pr-2 flex flex-col gap-y-4">
      <div className="flex items-start justify-between w-full gap-x-8">
        <h2
          className="text-foreground font-medium text-base flex-1 line-clamp-2 cursor-pointer"
          title={name}
        >
          {name}
        </h2>

        <DropdownMenuProject projectName={name} projectId={id}>
          <button
            className="outline-none opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <EllipsisVertical className="h-5 w-5 text-muted-foreground" />
          </button>
        </DropdownMenuProject>
      </div>

      <div>
        {project.status === Status.Pending && (
          <Badge variant={"warning"}>Processing</Badge>
        )}

        {project.status === Status.Success && (
          <Badge variant={"success"}>Success</Badge>
        )}

        {project.status === Status.Fail && (
          <Badge variant={"error"}>Failed</Badge>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-y-2">
        <Separator className="w-8" />

        <div className="flex gap-x-2 items-center justify-start">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName!} />
            <AvatarFallback>
              {user?.fullName?.at(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className=" flex flex-col justify-center">
            <p className="text-foreground font-normal text-[12px] pointer-events-none">
              {labelCreatedUser}
            </p>
            <p className="text-muted-foreground font-normal text-[10px] pointer-events-none">
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
