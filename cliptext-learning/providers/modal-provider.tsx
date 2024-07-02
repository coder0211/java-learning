"use client";

import CreateProjectModal from "@/components/modals/create-project-modal";
import DeleteProjectModal from "@/components/modals/delete-project-modal";
import UpdateProjectModal from "@/components/modals/update-project-modal";
import React, { useEffect, useState } from "react";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateProjectModal />
      <DeleteProjectModal />
      <UpdateProjectModal />
    </>
  );
};

export default ModalProvider;
