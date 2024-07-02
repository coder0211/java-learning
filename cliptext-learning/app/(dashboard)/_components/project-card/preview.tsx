"use client";

import { Badge } from "@/components/ui/badge";
import { SERVER_ENDPOINT } from "@/config/server-config";
import { formatDuration } from "@/lib/utils";
import { Kind, Project } from "@/types/project-types";
import { Headphones } from "lucide-react";
import Image from "next/image";

interface PreviewProps {
  project: Project;
}

const Preview = ({ project }: PreviewProps) => {
  return (
    <>
      <div className="w-full aspect-[16/9] flex-1 group relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-0 left-0 right-0 bottom-0  flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40" />

        {project.kind === Kind.Video && (
          <div className="w-full h-full flex items-center justify-center opacity-100 transition bg-gray-200 relative">
            {!project.thumbnail && (
              <video
                className="w-full h-full object-cover absolute top-0 left-0 bottom-0 right-0"
                controls={false}
              >
                <source src={SERVER_ENDPOINT + "/" + project.url + "#t=5"} />
              </video>
            )}
            {project.thumbnail && (
              <Image
                src={SERVER_ENDPOINT + "/" + project.thumbnail}
                alt="thumbnail"
                fill
                className="top-0 left-0 w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {project.kind === Kind.Audio && (
          <div className="w-full h-full flex items-center justify-center opacity-100 transition bg-blue-100 relative">
            <Headphones className="w-8 h-8 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        )}

        <div className="absolute bottom-2 right-2 flex flex-col items-center justify-center opacity-100 transition gap-y-4">
          <span className="flex items-center justify-center px-2 py-1 rounded-md bg-black/50 text-white text-[12px]">
            {formatDuration(project.duration)}
          </span>
        </div>
      </div>
    </>
  );
};

export default Preview;
