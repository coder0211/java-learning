import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUpdateProjectModal } from "@/stores/update-project-modal-store";
import { useProjects } from "@/stores/projects-store";
import { toast } from "sonner";
import { updateName } from "@/api/project";

const UpdateProjectModal = () => {
  const { isOpen, name, id, close } = useUpdateProjectModal();
  const { update } = useProjects();
  const [updatedName, setUpdatedName] = useState(name);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setUpdatedName(name);
  }, [name]);

  const onUpdate = async () => {
    try {
      if (updatedName === name) {
        return;
      }
      if (updatedName?.length) {
        setIsUpdating(true);
        await updateName(id!, updatedName);
        update(id!, { name: updatedName });
        toast.success("Updated project successfully!");
        close();
      } else {
        toast.info("Please field your project name.");
      }
    } catch (e) {
      toast.error(
        "Could not update project name. Please try again or contact supports, thanks."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(e) => {
        close();
        setUpdatedName("");
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium ">Change name</DialogTitle>
        </DialogHeader>

        <Input
          className="mt-2 w-full"
          placeholder="Project name"
          defaultValue={name}
          onChange={(e) => setUpdatedName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onUpdate();
            }
          }}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} type="button">
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={onUpdate}
            disabled={isUpdating}
            className={`${isUpdating && "opacity-75"}`}
          >
            Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProjectModal;
