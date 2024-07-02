import { getById } from "@/api/project";
import Aside from "@/app/(dashboard)/_components/aside";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

type Props = {
  params: { "project-id": string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params["project-id"];

  const project = await getById(id);

  return {
    title: `${project.name} | cliptext.com`,
  };
}

const ProjectLayout = ({ children }: ProjectLayoutProps) => {
  return (
    <main className="w-full h-full bg-white overflow-hidden">
      <Aside />

      <div className="ml-14 h-full flex flex-col">
        <div className="flex-1">
          <div className="w-full h-[calc(100vh)]">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default ProjectLayout;
