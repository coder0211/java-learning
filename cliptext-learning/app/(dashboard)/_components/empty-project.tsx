import { Button } from "@/components/ui/button";
import { useCreateProjectModal } from "@/stores/create-project-modal-store";
import Image from "next/image";
import React from "react";

const EmptyProject = () => {
  const { setOpen } = useCreateProjectModal();

  const onClick = () => {
    setOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Image src={"/create-project.svg"} alt="empty" width={220} height={220} />

      <p className="font-semibold text-2xl mt-6">You have no project</p>
      <p className="font-normal text-sm mt-2 text-muted-foreground">
        Join the journey by creating new project
      </p>
      <Button className="mt-6" onClick={onClick}>
        Create project
      </Button>
    </div>
  );
};

export default EmptyProject;
