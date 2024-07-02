"use client";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { useDeleteProjectModal } from "@/stores/delete-project-modal-store";
import { useUpdateProjectModal } from "@/stores/update-project-modal-store";
import { Clipboard, Pen, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface ContextMenuProjectProps {
  children: React.ReactNode;
  projectId: string;
  projectName: string;
}

const ContextMenuProject = ({
  children,
  projectId,
  projectName,
}: ContextMenuProjectProps) => {
  const { open: openDeleteDialog } = useDeleteProjectModal();
  const { open: openUpdateDialog } = useUpdateProjectModal();

  const onOpenDialogDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDeleteDialog(projectId, projectName);
  };

  const onOpenDialogUpdate = (e: React.MouseEvent) => {
    e.stopPropagation();
    openUpdateDialog(projectId, projectName);
  };

  const onCopy = () => {
    navigator.clipboard.writeText(window.location.href + projectId);
    toast.success("Copied project link.");
  };

  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent
        className="w-[200px]"
        onClick={(e) => e.stopPropagation()}
      >
        <ContextMenuItem
          className="cursor-pointer flex items-center"
          onClick={onOpenDialogUpdate}
        >
          <Pen className="w-4 h-4 mr-2" />
          <span>Change name</span>
        </ContextMenuItem>

        <ContextMenuSeparator />
        <ContextMenuItem
          className="cursor-pointer flex items-center"
          onClick={onOpenDialogDelete}
        >
          <Trash className="w-4 h-4 mr-2" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ContextMenuProject;
