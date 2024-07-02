"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useDeleteProjectModal } from "@/stores/delete-project-modal-store";
import { Button } from "../ui/button";
import { useProjects } from "@/stores/projects-store";
import { deleteProject as deleteProjectApi } from "@/api/project";
import { toast } from "sonner";

const DeleteProjectModal = () => {
  const { id, name, isOpen, close } = useDeleteProjectModal();
  const { delete: deleteProject } = useProjects();

  const onDelete = async () => {
    if (id) {
      try {
        await deleteProjectApi(id);
        toast.success("Deleted project successfully!");
        deleteProject(id);
      } catch (e) {
        toast.error(
          "Could not delete the project! Please try again or contact the supports, thanks."
        );
      }
    }
    close();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(e) => {
        close();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>
          <DialogDescription>
            Are you sure to delete the project <b> {name}?</b>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} type="button">
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            className="bg-rose-500 hover:bg-rose-800 hover:text-rose-200"
            onClick={onDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProjectModal;
