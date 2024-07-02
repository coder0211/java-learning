"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDeleteProjectModal } from "@/stores/delete-project-modal-store";
import { useUpdateProjectModal } from "@/stores/update-project-modal-store";
import { Clipboard, Pen, Trash } from "lucide-react";
import { toast } from "sonner";

interface DropdownMenuProjectProps {
  children: React.ReactNode;
  projectId: string;
  projectName: string;
}

const DropdownMenuProject = ({
  children,
  projectId,
  projectName,
}: DropdownMenuProjectProps) => {
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
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[200px]"
          onClick={(e) => {
            e.stopPropagation();
          }}
          side="right"
          align="start"
        >
          <DropdownMenuItem
            className="cursor-pointer flex items-center"
            onClick={onOpenDialogUpdate}
          >
            <Pen className="w-4 h-4 mr-2" />
            <span>Change name</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer  flex items-center"
            onClick={onOpenDialogDelete}
          >
            <Trash className="w-4 h-4 mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default DropdownMenuProject;
